import { Controller, Get, Ip, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PostLikeService } from './post-like.service';

@Controller('posts/:postId/likes')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @Post()
  toggle(@Param('postId', ParseIntPipe) postId: number, @Ip() ip: string) {
    return this.postLikeService.toggle(postId, ip || 'unknown');
  }

  @Get()
  getCount(@Param('postId', ParseIntPipe) postId: number) {
    return this.postLikeService.getCount(postId);
  }

  @Get('check')
  checkLiked(@Param('postId', ParseIntPipe) postId: number, @Ip() ip: string) {
    return this.postLikeService.checkLiked(postId, ip || 'unknown');
  }
}
