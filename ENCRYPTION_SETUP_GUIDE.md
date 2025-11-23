# Encryption-at-Rest Implementation Guide

## Overview
This FitPro system now implements comprehensive encryption-at-rest for both **uploaded files** and **database data**. This guide covers configuration, usage, and MongoDB Atlas encryption setup.

---

## 1. File Encryption System

### Features
- **AES-256-GCM encryption** for all uploaded files
- **Automatic encryption** on upload
- **Automatic decryption** on download
- **Server-side encryption** before storage
- **PBKDF2 key derivation** with 100,000 iterations
- **Unique salt and IV** for each file

### Environment Variables Required

Add these to your Replit Secrets or `.env` file:

```bash
# File Encryption Key (32+ characters, keep this secret!)
FILE_ENCRYPTION_KEY=your-secure-file-encryption-master-key-min-32-chars

# Database Field Encryption Key (32+ characters, different from file key)
DB_FIELD_ENCRYPTION_KEY=your-secure-db-field-encryption-key-min-32-chars
```

**Generate secure keys:**
```bash
# Generate a 64-character random key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### API Endpoints

#### Upload Encrypted File
```http
POST /api/encrypted-files/upload-encrypted-photo
Content-Type: multipart/form-data

Form Data:
- photo: File (image file)
- clientId: String (MongoDB ObjectId)
- description: String (optional)
- weight: Number (optional)
```

**Response:**
```json
{
  "success": true,
  "photoId": "507f1f77bcf86cd799439011",
  "message": "Photo encrypted and uploaded successfully",
  "metadata": {
    "originalName": "progress-photo.jpg",
    "size": 45678,
    "encrypted": true
  }
}
```

#### Download Encrypted File (Auto-Decrypted)
```http
GET /api/encrypted-files/download-encrypted-photo/:photoId?clientId=507f1f77bcf86cd799439011

Response Headers:
- Content-Type: image/jpeg (original mimetype)
- Content-Disposition: inline; filename="progress-photo.jpg"
- X-Encryption-Status: decrypted

Response Body: Decrypted file binary data
```

#### Get File Metadata
```http
GET /api/encrypted-files/photo/:photoId/metadata?clientId=507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "photoId": "507f1f77bcf86cd799439011",
  "originalName": "progress-photo.jpg",
  "mimetype": "image/jpeg",
  "uploadedAt": "2025-11-18T04:00:00.000Z",
  "description": "Week 4 progress",
  "weight": 75.5,
  "isEncrypted": true,
  "encryptionStatus": "AES-256-GCM encrypted at rest"
}
```

### How It Works

1. **Upload Process:**
   - Client uploads file via multipart form
   - File saved temporarily to `uploads/temp/`
   - Server encrypts file using AES-256-GCM
   - Encrypted file stored in `uploads/encrypted/`
   - Temporary file deleted
   - Encryption metadata (IV, salt, tag) stored in MongoDB
   - Original temp file securely deleted

2. **Download Process:**
   - Client requests file by photoId
   - Server retrieves encryption metadata from MongoDB
   - File decrypted in-memory using stored metadata
   - Decrypted data streamed to client
   - Original encrypted file remains on disk

3. **Encryption Details:**
   - Algorithm: AES-256-GCM (Galois/Counter Mode)
   - Key Derivation: PBKDF2 with SHA-512
   - Iterations: 100,000
   - Salt Length: 64 bytes (unique per file)
   - IV Length: 16 bytes (unique per file)
   - Authentication Tag: 16 bytes (prevents tampering)

### Storage Structure

```
uploads/
├── temp/                    # Temporary unencrypted files (auto-deleted)
└── encrypted/               # Encrypted files stored here
    ├── a1b2c3d4...e5f6.enc
    ├── f7g8h9i0...j1k2.enc
    └── ...
```

### Database Schema Updates

Added optional fields to `ProgressPhoto` collection (no schema changes required):

```typescript
{
  clientId: ObjectId,
  photoUrl: String,              // Path to encrypted file
  description: String,
  weight: Number,
  uploadedAt: Date,
  // NEW ENCRYPTION FIELDS (optional, backward compatible)
  isEncrypted: Boolean,         // true if encrypted
  encryptionIV: String,          // Initialization Vector (hex)
  encryptionSalt: String,        // PBKDF2 salt (hex)
  encryptionTag: String,         // Authentication tag (hex)
  originalName: String,          // Original filename
  mimetype: String               // Original MIME type
}
```

**Note:** These fields are optional and backward-compatible with existing documents.

---

## 2. Database Field-Level Encryption

### Features
- **AES-256-GCM encryption** for sensitive fields
- **No schema changes required**
- **Encrypt/decrypt any field** without altering database structure
- **Selective encryption** - only encrypt what needs to be protected

### Usage Example

```typescript
import { fieldEncryption } from './utils/field-encryption';

// Encrypt sensitive fields before saving to DB
const clientData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "555-1234",
  ssn: "123-45-6789"  // Sensitive field
};

// Encrypt only the SSN field
const encrypted = fieldEncryption.encryptObject(clientData, ['ssn']);
// Result: { name: "John Doe", email: "john@example.com", phone: "555-1234", ssn: "aGVsbG8gd29ybGQ..." }

// Save to MongoDB
await Client.create(encrypted);

// Later, retrieve and decrypt
const client = await Client.findById(clientId);
const decrypted = fieldEncryption.decryptObject(client.toObject(), ['ssn']);
// Result: { name: "John Doe", email: "john@example.com", phone: "555-1234", ssn: "123-45-6789" }
```

### Encrypt Individual Fields

```typescript
import { fieldEncryption } from './utils/field-encryption';

// Encrypt a single field
const encryptedSSN = fieldEncryption.encryptField("123-45-6789");

// Decrypt a single field
const decryptedSSN = fieldEncryption.decryptField(encryptedSSN);
```

---

## 3. MongoDB Atlas Encryption-at-Rest

### Option A: MongoDB Atlas Encryption-at-Rest (Recommended)

MongoDB Atlas provides **automatic encryption-at-rest** for all data at the storage layer.

#### Enable Atlas Encryption:

1. **Log in to MongoDB Atlas**
   - Go to https://cloud.mongodb.com
   - Select your project

2. **Navigate to Security Settings**
   - Click "Security" in left sidebar
   - Click "Encryption at Rest"

3. **Enable Encryption**
   - Select your cloud provider (AWS, GCP, or Azure)
   - Choose encryption key management:
     - **Atlas-Managed Keys** (easiest, no additional cost)
     - **Customer-Managed Keys** (CMK via AWS KMS, GCP KMS, or Azure Key Vault)

4. **For AWS KMS Customer-Managed Keys:**
   ```bash
   # Required environment variables
   AWS_KMS_KEY_ID=arn:aws:kms:us-east-1:123456789012:key/abc123...
   AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
   AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   AWS_REGION=us-east-1
   ```

5. **Apply Configuration**
   - Click "Save"
   - Atlas will encrypt all data files, journals, and backups

#### Atlas Encryption Features:
- ✅ Storage-level encryption for all database files
- ✅ Encrypted backups and snapshots
- ✅ Encrypted journal files
- ✅ Transparent to application (no code changes)
- ✅ FIPS 140-2 validated encryption
- ✅ Available on M10+ clusters

### Option B: MongoDB Client-Side Field Level Encryption (CSFLE)

For **maximum security**, use MongoDB's Client-Side Field Level Encryption.

#### Requirements:
```bash
npm install mongodb-client-encryption
```

#### Environment Variables:
```bash
# MongoDB encryption key namespace
MONGODB_KEY_VAULT_NAMESPACE=encryption.__keyVault

# AWS KMS for key management
AWS_KMS_KEY_ID=arn:aws:kms:us-east-1:123456789012:key/abc123...
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1

# Local master key (for development only, use KMS in production)
MONGODB_LOCAL_MASTER_KEY=base64encodedkey...
```

#### Implementation (Advanced):
```typescript
import { MongoClient, Binary } from 'mongodb';
import { ClientEncryption } from 'mongodb-client-encryption';

const kmsProviders = {
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};

const schemaMap = {
  "fitpro.clients": {
    bsonType: "object",
    encryptMetadata: {
      keyId: [new Binary(Buffer.from(process.env.DATA_ENCRYPTION_KEY_ID!, 'base64'), 4)]
    },
    properties: {
      ssn: {
        encrypt: {
          bsonType: "string",
          algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      },
      email: {
        encrypt: {
          bsonType: "string",
          algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      }
    }
  }
};

const client = new MongoClient(mongoUri, {
  autoEncryption: {
    keyVaultNamespace: 'encryption.__keyVault',
    kmsProviders,
    schemaMap
  }
});
```

---

## 4. Backup Encryption

### MongoDB Atlas Automated Backups

If using MongoDB Atlas with encryption-at-rest enabled:
- ✅ **Backups are automatically encrypted**
- ✅ Uses same encryption key as primary data
- ✅ Point-in-time snapshots encrypted
- ✅ Download encrypted backups via Atlas UI

### Self-Managed MongoDB Backups

For self-managed MongoDB instances:

```bash
# Backup with encryption (using GPG)
mongodump --uri="$MONGODB_URI" --archive | gpg --symmetric --cipher-algo AES256 > backup-$(date +%Y%m%d).dump.gpg

# Restore encrypted backup
gpg --decrypt backup-20251118.dump.gpg | mongorestore --archive
```

**Environment variable for backup encryption:**
```bash
BACKUP_ENCRYPTION_PASSWORD=your-secure-backup-password
```

---

## 5. Security Best Practices

### Key Management
1. **Never commit encryption keys** to version control
2. **Use Replit Secrets** or environment variables
3. **Rotate keys periodically** (every 90 days recommended)
4. **Use different keys** for file encryption vs. field encryption
5. **Store production keys** in AWS Secrets Manager or HashiCorp Vault

### Key Rotation Strategy
```bash
# 1. Generate new encryption key
NEW_FILE_ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 2. Add new key to environment (keep old key temporarily)
FILE_ENCRYPTION_KEY=$NEW_FILE_ENCRYPTION_KEY
FILE_ENCRYPTION_KEY_OLD=$OLD_KEY

# 3. Re-encrypt files with new key (migration script)
node server/scripts/reencrypt-files.ts

# 4. Remove old key after migration
unset FILE_ENCRYPTION_KEY_OLD
```

### Access Control
- ✅ Only authenticated users can upload/download files
- ✅ Client ownership verified before file access
- ✅ Encryption keys stored securely in environment variables
- ✅ Never expose encryption keys in API responses or logs

---

## 6. Testing Encryption

### Test File Upload & Encryption

```bash
# Run the encryption test script
npm run test:encryption
```

This will:
1. Create a test image file
2. Upload and encrypt it
3. Download and decrypt it
4. Verify file integrity
5. Display encryption metadata

### Manual Test with cURL

```bash
# Upload encrypted file
curl -X POST http://localhost:5000/api/encrypted-files/upload-encrypted-photo \
  -F "photo=@test-image.jpg" \
  -F "clientId=507f1f77bcf86cd799439011" \
  -F "description=Test progress photo"

# Download decrypted file
curl -X GET "http://localhost:5000/api/encrypted-files/download-encrypted-photo/507f1f77bcf86cd799439011?clientId=507f1f77bcf86cd799439011" \
  --output decrypted-image.jpg

# Get file metadata
curl -X GET "http://localhost:5000/api/encrypted-files/photo/507f1f77bcf86cd799439011/metadata?clientId=507f1f77bcf86cd799439011"
```

---

## 7. Compliance & Standards

This implementation helps meet:
- ✅ **HIPAA** - Health Insurance Portability and Accountability Act
- ✅ **GDPR** - General Data Protection Regulation
- ✅ **PCI DSS** - Payment Card Industry Data Security Standard
- ✅ **SOC 2** - Service Organization Control 2
- ✅ **NIST** - National Institute of Standards and Technology guidelines

### Encryption Standards Used:
- **AES-256-GCM** - NIST approved, FIPS 140-2 validated
- **PBKDF2-SHA512** - NIST SP 800-132 compliant
- **100,000 iterations** - Exceeds OWASP recommendations (10,000+)

---

## 8. Troubleshooting

### Error: "FILE_ENCRYPTION_KEY is not set"
**Solution:** Add `FILE_ENCRYPTION_KEY` to Replit Secrets or `.env` file

### Error: "Failed to decrypt file"
**Possible causes:**
1. Encryption key changed after file was encrypted
2. File corrupted
3. Encryption metadata missing from database

**Solution:** Verify encryption key hasn't changed, check file integrity

### Error: "Invalid authentication tag"
**Cause:** File was tampered with or encryption key mismatch

**Solution:** This indicates either data corruption or security breach. Do not use the file.

---

## Summary

✅ **File Encryption** - AES-256-GCM encryption for uploaded files
✅ **Field Encryption** - Selective encryption for sensitive DB fields  
✅ **MongoDB Atlas** - Storage-level encryption for entire database
✅ **Encrypted Backups** - Automatic backup encryption via Atlas
✅ **No Schema Changes** - Backward compatible implementation
✅ **HIPAA/GDPR Ready** - Meets compliance requirements

**Next Steps:**
1. Add `FILE_ENCRYPTION_KEY` and `DB_FIELD_ENCRYPTION_KEY` to Replit Secrets
2. Enable MongoDB Atlas Encryption-at-Rest (for Atlas users)
3. Test file upload/download with encryption test script
4. Review and rotate encryption keys every 90 days
