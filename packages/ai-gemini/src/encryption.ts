import * as crypto from 'crypto';

// Simple encryption utility for WhatsApp tokens
// In production, use a proper KMS service like AWS KMS, Google Cloud KMS, etc.

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

// Encryption key is required and must be provided via environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required for secure token storage');
}

export interface EncryptionResult {
  encrypted: string;
  iv: string;
  tag: string;
}

export function encryptToken(plaintext: string): string {
  try {
    const key = Buffer.from(ENCRYPTION_KEY.substring(0, 64), 'hex');
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Combine iv, tag, and encrypted data
    const result = iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt token');
  }
}

export function decryptToken(encryptedData: string): string {
  try {
    const key = Buffer.from(ENCRYPTION_KEY.substring(0, 64), 'hex');
    const parts = encryptedData.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt token');
  }
}

export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

// Utility functions for WhatsApp tokens
export function encryptWhatsAppTokens(accessToken: string, verifyToken: string): {
  accessTokenEncrypted: string;
  verifyTokenEncrypted: string;
} {
  return {
    accessTokenEncrypted: encryptToken(accessToken),
    verifyTokenEncrypted: encryptToken(verifyToken)
  };
}

export function decryptWhatsAppTokens(accessTokenEncrypted: string, verifyTokenEncrypted: string): {
  accessToken: string;
  verifyToken: string;
} {
  return {
    accessToken: decryptToken(accessTokenEncrypted),
    verifyToken: decryptToken(verifyTokenEncrypted)
  };
}