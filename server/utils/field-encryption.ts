import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const PBKDF2_ITERATIONS = 100000;

export class FieldEncryption {
  private masterKey: string;

  constructor(masterKey?: string) {
    this.masterKey = masterKey || process.env.DB_FIELD_ENCRYPTION_KEY || '';
    
    if (!this.masterKey) {
      throw new Error('DB_FIELD_ENCRYPTION_KEY environment variable is required for field encryption');
    }
  }

  private deriveKey(salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
      this.masterKey,
      salt,
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      'sha512'
    );
  }

  encryptField(plaintext: string): string {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = this.deriveKey(salt);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    const combined = Buffer.concat([salt, iv, tag, encrypted]);
    
    return combined.toString('base64');
  }

  decryptField(ciphertext: string): string {
    const combined = Buffer.from(ciphertext, 'base64');
    
    const salt = combined.subarray(0, SALT_LENGTH);
    const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    
    const key = this.deriveKey(salt);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return decrypted.toString('utf8');
  }

  encryptObject<T extends Record<string, any>>(
    obj: T,
    fieldsToEncrypt: (keyof T)[]
  ): T {
    const encrypted = { ...obj };
    
    fieldsToEncrypt.forEach(field => {
      if (encrypted[field] !== undefined && encrypted[field] !== null) {
        encrypted[field] = this.encryptField(String(encrypted[field])) as any;
      }
    });
    
    return encrypted;
  }

  decryptObject<T extends Record<string, any>>(
    obj: T,
    fieldsToDecrypt: (keyof T)[]
  ): T {
    const decrypted = { ...obj };
    
    fieldsToDecrypt.forEach(field => {
      if (decrypted[field]) {
        try {
          decrypted[field] = this.decryptField(String(decrypted[field])) as any;
        } catch (error) {
          console.error(`Failed to decrypt field ${String(field)}:`, error);
        }
      }
    });
    
    return decrypted;
  }
}

let _fieldEncryptionInstance: FieldEncryption | null = null;

export function getFieldEncryption(): FieldEncryption {
  if (!_fieldEncryptionInstance) {
    _fieldEncryptionInstance = new FieldEncryption();
  }
  return _fieldEncryptionInstance;
}

export const fieldEncryption = new Proxy({} as FieldEncryption, {
  get(_target, prop) {
    return (getFieldEncryption() as any)[prop];
  }
});
