// WhatsApp Cloud API Adapter for commercial bot deployment
import crypto from 'crypto';
import type { Conversation, WhatsappMessage, Tenant } from '../../../shared/schema';

export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  timestamp: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'location' | 'contacts';
  text?: {
    body: string;
  };
  image?: {
    id: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
  document?: {
    id: string;
    filename: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: 'whatsapp';
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        messages?: WhatsAppMessage[];
        statuses?: Array<{
          id: string;
          status: 'sent' | 'delivered' | 'read' | 'failed';
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

export interface WhatsAppAdapter {
  sendMessage(to: string, message: string, tenantId: string): Promise<void>;
  sendTemplate(to: string, templateName: string, components: any[], tenantId: string): Promise<void>;
  verifyWebhook(signature: string, payload: string, verifyToken: string): boolean;
  processIncomingMessage(webhook: WhatsAppWebhookPayload): Promise<WhatsAppMessage[]>;
  uploadMedia(file: Buffer, mimeType: string, tenantId: string): Promise<string>;
  downloadMedia(mediaId: string, tenantId: string): Promise<Buffer>;
}

export class WhatsAppCloudAPIAdapter implements WhatsAppAdapter {
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(
    private getAccessToken: (tenantId: string) => Promise<string>,
    private getPhoneNumberId: (tenantId: string) => Promise<string>
  ) {}

  async sendMessage(to: string, message: string, tenantId: string): Promise<void> {
    try {
      const accessToken = await this.getAccessToken(tenantId);
      const phoneNumberId = await this.getPhoneNumberId(tenantId);
      
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: message
        }
      };

      const response = await fetch(`${this.baseUrl}/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
      }

      console.log(`Message sent successfully to ${to} for tenant ${tenantId}`);
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      throw error;
    }
  }

  async sendTemplate(to: string, templateName: string, components: any[], tenantId: string): Promise<void> {
    try {
      const accessToken = await this.getAccessToken(tenantId);
      const phoneNumberId = await this.getPhoneNumberId(tenantId);
      
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'en'
          },
          components: components
        }
      };

      const response = await fetch(`${this.baseUrl}/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`WhatsApp Template API error: ${JSON.stringify(error)}`);
      }

      console.log(`Template sent successfully to ${to} for tenant ${tenantId}`);
    } catch (error) {
      console.error('Failed to send WhatsApp template:', error);
      throw error;
    }
  }

  verifyWebhook(signature: string, payload: string, appSecret: string): boolean {
    try {
      // Verify X-Hub-Signature-256 from Meta using App Secret (not verify token)
      const expectedSignature = crypto
        .createHmac('sha256', appSecret)
        .update(payload, 'utf8')
        .digest('hex');
      
      const providedSignature = signature.replace('sha256=', '');
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(providedSignature, 'hex')
      );
    } catch (error) {
      console.error('Webhook verification error:', error);
      return false;
    }
  }

  verifyChallenge(mode: string, token: string, challenge: string, verifyToken: string): string | null {
    // This is for the GET webhook verification challenge
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verified successfully');
      return challenge;
    }
    console.error('Webhook verification failed');
    return null;
  }

  async processIncomingMessage(webhook: WhatsAppWebhookPayload): Promise<WhatsAppMessage[]> {
    const messages: WhatsAppMessage[] = [];

    try {
      if (webhook.object !== 'whatsapp_business_account') {
        return messages;
      }

      for (const entry of webhook.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages' && change.value.messages) {
            messages.push(...change.value.messages);
          }
        }
      }
    } catch (error) {
      console.error('Error processing incoming webhook:', error);
    }

    return messages;
  }

  async uploadMedia(file: Buffer, mimeType: string, tenantId: string): Promise<string> {
    try {
      const accessToken = await this.getAccessToken(tenantId);
      const phoneNumberId = await this.getPhoneNumberId(tenantId);

      const formData = new FormData();
      formData.append('file', new Blob([file], { type: mimeType }));
      formData.append('type', mimeType);
      formData.append('messaging_product', 'whatsapp');

      const response = await fetch(`${this.baseUrl}/${phoneNumberId}/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Media upload error: ${JSON.stringify(error)}`);
      }

      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('Failed to upload media:', error);
      throw error;
    }
  }

  async downloadMedia(mediaId: string, tenantId: string): Promise<Buffer> {
    try {
      const accessToken = await this.getAccessToken(tenantId);

      // First get media URL
      const urlResponse = await fetch(`${this.baseUrl}/${mediaId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!urlResponse.ok) {
        const error = await urlResponse.json();
        throw new Error(`Media URL error: ${JSON.stringify(error)}`);
      }

      const urlResult = await urlResponse.json();
      
      // Then download the actual file
      const fileResponse = await fetch(urlResult.url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!fileResponse.ok) {
        throw new Error(`Media download error: ${fileResponse.statusText}`);
      }

      const arrayBuffer = await fileResponse.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Failed to download media:', error);
      throw error;
    }
  }
}

// Newsletter and Status Broadcasting functionality
export class WhatsAppBroadcast {
  constructor(private adapter: WhatsAppAdapter) {}

  async sendNewsletter(
    subscribers: string[], 
    templateName: string, 
    content: any[],
    tenantId: string
  ): Promise<{ successful: number; failed: number }> {
    let successful = 0;
    let failed = 0;

    console.log(`Broadcasting newsletter to ${subscribers.length} subscribers for tenant ${tenantId}`);

    // Send in batches to avoid rate limits
    const batchSize = 100;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const promises = batch.map(async (subscriber) => {
        try {
          await this.adapter.sendTemplate(subscriber, templateName, content, tenantId);
          successful++;
        } catch (error) {
          console.error(`Failed to send newsletter to ${subscriber}:`, error);
          failed++;
        }
      });

      await Promise.allSettled(promises);
      
      // Rate limiting: wait 1 second between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Newsletter broadcast complete: ${successful} successful, ${failed} failed`);
    return { successful, failed };
  }

  async broadcastPromotion(
    targetAudience: string[],
    promotionMessage: string,
    tenantId: string
  ): Promise<void> {
    console.log(`Broadcasting promotion to ${targetAudience.length} users for tenant ${tenantId}`);

    const batchSize = 50;
    for (let i = 0; i < targetAudience.length; i += batchSize) {
      const batch = targetAudience.slice(i, i + batchSize);
      
      const promises = batch.map(async (phoneNumber) => {
        try {
          await this.adapter.sendMessage(phoneNumber, promotionMessage, tenantId);
        } catch (error) {
          console.error(`Failed to send promotion to ${phoneNumber}:`, error);
        }
      });

      await Promise.allSettled(promises);
      
      // Rate limiting
      if (i + batchSize < targetAudience.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
}

// Utility functions for WhatsApp formatting
export class WhatsAppFormatter {
  static formatMessage(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '*$1*') // Bold
      .replace(/__(.*?)__/g, '_$1_')     // Italic
      .replace(/~~(.*?)~~/g, '~$1~')     // Strikethrough
      .replace(/`(.*?)`/g, '```$1```');  // Monospace
  }

  static createButtonMessage(text: string, buttons: Array<{id: string, title: string}>): any {
    return {
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: text
        },
        action: {
          buttons: buttons.map(btn => ({
            type: 'reply',
            reply: {
              id: btn.id,
              title: btn.title
            }
          }))
        }
      }
    };
  }

  static createListMessage(
    headerText: string, 
    bodyText: string, 
    buttonText: string,
    sections: Array<{
      title: string,
      rows: Array<{id: string, title: string, description?: string}>
    }>
  ): any {
    return {
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: headerText
        },
        body: {
          text: bodyText
        },
        action: {
          button: buttonText,
          sections: sections
        }
      }
    };
  }
}