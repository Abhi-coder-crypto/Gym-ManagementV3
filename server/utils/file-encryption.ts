import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const PBKDF2_ITERATIONS = 100000;

interface EncryptedFile {
  encryptedPath: string;
  originalName: string;
  mimetype: string;
  size: number;
  iv: string;
  salt: string;
  tag: string;
}

export class FileEncryption {
  private masterKey: string;

  constructor(masterKey?: string) {
    this.masterKey = masterKey || process.env.FILE_ENCRYPTION_KEY || '';
    
    if (!this.masterKey) {
      throw new Error('FILE_ENCRYPTION_KEY environment variable is required for file encryption');
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

  async encryptFile(filePath: string, originalName: string, mimetype: string): Promise<EncryptedFile> {
    const fileBuffer = await readFile(filePath);
    
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = this.deriveKey(salt);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(fileBuffer),
      cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    const encryptedFileName = `${crypto.randomBytes(16).toString('hex')}.enc`;
    const encryptedDir = path.join(process.cwd(), 'uploads', 'encrypted');
    
    if (!fs.existsSync(encryptedDir)) {
      fs.mkdirSync(encryptedDir, { recursive: true });
    }
    
    const encryptedPath = path.join(encryptedDir, encryptedFileName);
    await writeFile(encryptedPath, encrypted);
    
    await unlink(filePath);
    
    return {
      encryptedPath: encryptedPath,
      originalName,
      mimetype,
      size: encrypted.length,
      iv: iv.toString('hex'),
      salt: salt.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  async decryptFile(
    encryptedPath: string,
    iv: string,
    salt: string,
    tag: string
  ): Promise<Buffer> {
    const encryptedData = await readFile(encryptedPath);
    
    const saltBuffer = Buffer.from(salt, 'hex');
    const key = this.deriveKey(saltBuffer);
    const ivBuffer = Buffer.from(iv, 'hex');
    const tagBuffer = Buffer.from(tag, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
    decipher.setAuthTag(tagBuffer);
    
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final()
    ]);
    
    return decrypted;
  }

  async encryptBuffer(buffer: Buffer): Promise<{
    encrypted: Buffer;
    iv: string;
    salt: string;
    tag: string;
  }> {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = this.deriveKey(salt);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(buffer),
      cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      salt: salt.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  async decryptBuffer(
    encrypted: Buffer,
    iv: string,
    salt: string,
    tag: string
  ): Promise<Buffer> {
    const saltBuffer = Buffer.from(salt, 'hex');
    const key = this.deriveKey(saltBuffer);
    const ivBuffer = Buffer.from(iv, 'hex');
    const tagBuffer = Buffer.from(tag, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
    decipher.setAuthTag(tagBuffer);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return decrypted;
  }
}

let _fileEncryptionInstance: FileEncryption | null = null;

export function getFileEncryption(): FileEncryption {
  if (!_fileEncryptionInstance) {
    _fileEncryptionInstance = new FileEncryption();
  }
  return _fileEncryptionInstance;
}

export const fileEncryption = new Proxy({} as FileEncryption, {
  get(_target, prop) {
    return (getFileEncryption() as any)[prop];
  }
});
