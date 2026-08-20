import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { GetTasksDto } from './dto/get-tasks.dto.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      userId,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(userId: string, query?: GetTasksDto): Promise<{ data: Task[]; total: number }> {
    const qb = this.tasksRepository.createQueryBuilder('task')
      .where('task.userId = :userId', { userId });

    if (query?.search) {
      qb.andWhere('task.title ILIKE :search', { search: `%${query.search}%` });
    }
    
    if (query?.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }
    
    if (query?.priority) {
      qb.andWhere('task.priority = :priority', { priority: query.priority });
    }
    
    if (query?.projectId) {
      qb.andWhere('task.projectId = :projectId', { projectId: query.projectId });
    }

    const sortOrder = query?.sortOrder === 'ASC' ? 'ASC' : 'DESC';
    if (query?.sortBy === 'dueDate') {
      qb.orderBy('task.dueDate', sortOrder);
      qb.addOrderBy('task.createdAt', 'DESC'); // secondary sort
    } else if (query?.sortBy === 'priority') {
      qb.orderBy('task.priority', sortOrder);
      qb.addOrderBy('task.createdAt', 'DESC');
    } else if (query?.sortBy === 'title') {
      qb.orderBy('task.title', sortOrder);
      qb.addOrderBy('task.createdAt', 'DESC');
    } else {
      qb.orderBy('task.createdAt', sortOrder);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    
    if (task.userId !== userId) {
      // Return 404 to avoid leaking existence of other users' tasks
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id, userId);
    
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
  }
}
