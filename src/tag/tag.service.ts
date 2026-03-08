import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  findAll() {
    return this.tagRepo.find({ order: { name: 'ASC' } });
  }

  async create(dto: CreateTagDto) {
    const existing = await this.tagRepo.findOneBy({ name: dto.name });
    if (existing) throw new ConflictException('Tag already exists');
    const tag = this.tagRepo.create(dto);
    return this.tagRepo.save(tag);
  }

  async remove(id: number) {
    const result = await this.tagRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Tag not found');
  }
}
