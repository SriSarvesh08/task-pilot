import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import type { Request } from 'express';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { GetTasksDto } from './dto/get-tasks.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    type: string;
  };
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() createTaskDto: CreateTaskDto) {
    const userId = req.user.sub;
    return this.tasksService.create(userId, createTaskDto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest, @Query() query: GetTasksDto) {
    const userId = req.user.sub;
    return this.tasksService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.tasksService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const userId = req.user.sub;
    return this.tasksService.update(id, userId, updateTaskDto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.tasksService.remove(id, userId);
  }
}
