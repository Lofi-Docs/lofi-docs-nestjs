import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  findByPostId(postId: number) {
    return this.commentRepo.find({
      where: { post_id: postId, is_deleted: false },
      order: { created_at: 'ASC' },
      select: {
        id: true,
        author: true,
        content: true,
        is_deleted: true,
        created_at: true,
      },
    });
  }

  async create(postId: number, dto: CreateCommentDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const comment = this.commentRepo.create({
      ...dto,
      post_id: postId,
      password: hashedPassword,
    });
    const saved = await this.commentRepo.save(comment);
    const { password: _, ...result } = saved;
    return result;
  }

  async remove(id: number, password: string) {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) throw new NotFoundException('Comment not found');

    const isMatch = await bcrypt.compare(password, comment.password);
    if (!isMatch) throw new ForbiddenException('Invalid password');

    comment.is_deleted = true;
    await this.commentRepo.save(comment);
  }
}
