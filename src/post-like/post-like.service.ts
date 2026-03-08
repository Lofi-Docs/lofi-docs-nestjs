import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { PostLike } from '../entities/post-like.entity';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLike)
    private readonly likeRepo: Repository<PostLike>,
  ) {}

  private hashIp(ip: string): string {
    return crypto.createHash('sha256').update(ip).digest('hex');
  }

  async toggle(postId: number, ip: string) {
    const ipHash = this.hashIp(ip);
    const existing = await this.likeRepo.findOneBy({
      post_id: postId,
      ip_hash: ipHash,
    });

    if (existing) {
      await this.likeRepo.remove(existing);
      const count = await this.likeRepo.countBy({ post_id: postId });
      return { liked: false, count };
    }

    const like = this.likeRepo.create({ post_id: postId, ip_hash: ipHash });
    await this.likeRepo.save(like);
    const count = await this.likeRepo.countBy({ post_id: postId });
    return { liked: true, count };
  }

  async getCount(postId: number) {
    const count = await this.likeRepo.countBy({ post_id: postId });
    return { postId, count };
  }

  async checkLiked(postId: number, ip: string) {
    const ipHash = this.hashIp(ip);
    const existing = await this.likeRepo.findOneBy({
      post_id: postId,
      ip_hash: ipHash,
    });
    return { liked: !!existing };
  }
}
