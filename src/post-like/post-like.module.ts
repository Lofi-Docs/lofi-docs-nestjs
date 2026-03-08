import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from '../entities/post-like.entity';
import { PostLikeController } from './post-like.controller';
import { PostLikeService } from './post-like.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike])],
  controllers: [PostLikeController],
  providers: [PostLikeService],
})
export class PostLikeModule {}
