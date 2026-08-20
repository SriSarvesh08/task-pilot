import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    type: string;
  };
}

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() createProjectDto: CreateProjectDto) {
    const userId = req.user.sub;
    return this.projectsService.create(userId, createProjectDto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.projectsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const userId = req.user.sub;
    return this.projectsService.update(id, userId, updateProjectDto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.projectsService.remove(id, userId);
  }
}
