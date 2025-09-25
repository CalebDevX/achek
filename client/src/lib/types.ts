export interface WhatsAppBotStatus {
  connected: boolean;
  qrCode: string | null;
  sessionId: string | null;
}

export interface BotMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  messageType: string;
  timestamp: Date;
  isBot: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  service: string;
  message: string;
}

export interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface CaseStudy {
  id: number;
  title: string;
  category: string;
  secondaryCategory: string;
  description: string;
  image: string;
  metrics: Array<{
    label: string;
    value: string;
  }>;
  technologies?: string[];
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
}
