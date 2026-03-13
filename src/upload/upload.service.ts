import { BadRequestException, Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads');
  private readonly allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  private readonly maxSize = 5 * 1024 * 1024; // 5MB

  async saveFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    const ext = extname(file.originalname).toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Allowed extensions: ${this.allowedExtensions.join(', ')}`,
      );
    }

    const filename = `${randomUUID()}${ext}`;
    await mkdir(this.uploadDir, { recursive: true });
    await writeFile(join(this.uploadDir, filename), file.buffer);

    return { url: `/uploads/${filename}` };
  }
}
