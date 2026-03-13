import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(id);
  }
}
