import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity.js';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetTasksDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder;
}
