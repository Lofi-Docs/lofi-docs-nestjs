import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Tag } from '../entities/tag.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async findAll(page = 1, limit = 10, includeUnpublished = false) {
    const where = includeUnpublished ? {} : { is_published: true };
    const [posts, total] = await this.postRepo.findAndCount({
      where,
      relations: ['tags'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        thumbnail_url: true,
        is_published: true,
        view_count: true,
        created_at: true,
        updated_at: true,
      },
    });
    return { posts, total, page, limit };
  }

  async findBySlug(slug: string) {
    const post = await this.postRepo.findOne({
      where: { slug },
      relations: ['tags'],
    });
    if (!post) throw new NotFoundException('Post not found');
    await this.postRepo.increment({ id: post.id }, 'view_count', 1);
    post.view_count += 1;
    return post;
  }

  async findById(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['tags'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(dto: CreatePostDto) {
    const post = this.postRepo.create(dto);
    if (dto.tagIds?.length) {
      post.tags = await this.tagRepo.findBy({ id: In(dto.tagIds) });
    }
    return this.postRepo.save(post);
  }

  async update(id: number, dto: UpdatePostDto) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['tags'],
    });
    if (!post) throw new NotFoundException('Post not found');

    const { tagIds, ...rest } = dto;
    Object.assign(post, rest);

    if (tagIds !== undefined) {
      post.tags = tagIds.length
        ? await this.tagRepo.findBy({ id: In(tagIds) })
        : [];
    }
    return this.postRepo.save(post);
  }

  async remove(id: number) {
    const result = await this.postRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Post not found');
  }
}
