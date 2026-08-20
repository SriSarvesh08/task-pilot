import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  async create(userId: string, createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      userId,
    });
    return this.projectsRepository.save(project);
  }

  async findAll(userId: string): Promise<Project[]> {
    const projects = await this.projectsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: { tasks: true }
    });

    return projects.map(project => {
      const taskCount = project.tasks?.length || 0;
      // We can safely delete tasks array if not needed by frontend, but assigning taskCount works
      const { tasks, ...rest } = project;
      return {
        ...rest,
        taskCount
      } as Project;
    });
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id } });
    
    if (!project || project.userId !== userId) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, userId: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id, userId);
    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    await this.projectsRepository.remove(project);
  }
}
