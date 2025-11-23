import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { fileEncryption } from '../utils/file-encryption';
import { storage } from '../storage';
import { uploadRateLimiter } from '../middleware/rate-limit';
import path from 'path';

const router = Router();

router.post('/upload-encrypted-photo', uploadRateLimiter, upload.single('photo'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { clientId, description, weight } = req.body;

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    console.log(`📁 Encrypting file: ${req.file.originalname} (${req.file.size} bytes)`);

    const encryptedFile = await fileEncryption.encryptFile(
      req.file.path,
      req.file.originalname,
      req.file.mimetype
    );

    console.log(`🔐 File encrypted successfully: ${path.basename(encryptedFile.encryptedPath)}`);

    const progressPhoto = await storage.createProgressPhoto({
      clientId,
      photoUrl: encryptedFile.encryptedPath,
      description,
      weight: weight ? parseFloat(weight) : undefined,
      isEncrypted: true,
      encryptionIV: encryptedFile.iv,
      encryptionSalt: encryptedFile.salt,
      encryptionTag: encryptedFile.tag,
      originalName: encryptedFile.originalName,
      mimetype: encryptedFile.mimetype,
    });

    console.log(`✅ Encrypted photo record created: ${progressPhoto._id}`);

    res.json({
      success: true,
      photoId: progressPhoto._id,
      message: 'Photo encrypted and uploaded successfully',
      metadata: {
        originalName: encryptedFile.originalName,
        size: encryptedFile.size,
        encrypted: true
      }
    });

  } catch (error) {
    console.error('Error uploading encrypted photo:', error);
    res.status(500).json({ 
      error: 'Failed to upload encrypted photo',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/download-encrypted-photo/:photoId', async (req: Request, res: Response) => {
  try {
    const { photoId } = req.params;
    const { clientId } = req.query;

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    const photos = await storage.getProgressPhotos(clientId as string);
    const photo = photos.find((p: any) => p._id.toString() === photoId);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (!photo.isEncrypted) {
      return res.status(400).json({ error: 'Photo is not encrypted' });
    }

    console.log(`🔓 Decrypting file: ${photo.originalName}`);

    const decryptedBuffer = await fileEncryption.decryptFile(
      photo.photoUrl,
      photo.encryptionIV!,
      photo.encryptionSalt!,
      photo.encryptionTag!
    );

    console.log(`✅ File decrypted successfully (${decryptedBuffer.length} bytes)`);

    res.setHeader('Content-Type', photo.mimetype || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${photo.originalName}"`);
    res.setHeader('X-Encryption-Status', 'decrypted');
    res.send(decryptedBuffer);

  } catch (error) {
    console.error('Error downloading encrypted photo:', error);
    res.status(500).json({ 
      error: 'Failed to decrypt and download photo',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/photo/:photoId/metadata', async (req: Request, res: Response) => {
  try {
    const { photoId } = req.params;
    const { clientId } = req.query;

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    const photos = await storage.getProgressPhotos(clientId as string);
    const photo = photos.find((p: any) => p._id.toString() === photoId);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.json({
      photoId: photo._id,
      originalName: photo.originalName,
      mimetype: photo.mimetype,
      uploadedAt: photo.uploadedAt,
      description: photo.description,
      weight: photo.weight,
      isEncrypted: photo.isEncrypted,
      encryptionStatus: photo.isEncrypted ? 'AES-256-GCM encrypted at rest' : 'Not encrypted'
    });

  } catch (error) {
    console.error('Error fetching photo metadata:', error);
    res.status(500).json({ 
      error: 'Failed to fetch photo metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
