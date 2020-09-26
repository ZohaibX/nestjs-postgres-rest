import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from '../auth/auth.entity';

//! All the function parameters we will get from controllers, so no need to document that

@Injectable() //  so it is injectable in controller file
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) // we injects repository in service file
    private taskRepository: TaskRepository, // after injecting, we initializes it like this
  ) {}

  async getAllTasks(
    queryParams: FilteredTasksDto,
    user: User,
  ): Promise<
    Task[]
  > /* as we get a promise with task[] from repository file */ {
    return this.taskRepository.getTasks(queryParams, user); // repository will process getTasks with query params
  }

  async getTaskById(
    id: number,
    user: User,
  ): Promise<Task> /* as we get a promise with task from repository file */ {
    // normal way
    // const found = await this.taskRepository.findOne(id);

    // we will find it from task repository
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    }); // postgres query to findOne // to get only task created by user himself

    if (!found)
      throw new NotFoundException(
        `Data not found according to the giver ID ${id}`,
      );
    //if this function returns error , error will be returned to everywhere this fn is called

    return found; // found is a task
  }

  async createTask(
    createTaskDto: CreateTaskDTO,
    user: User,
  ): Promise<Task> /* as we get a promise with task from repository file */ {
    return this.taskRepository.createTask(createTaskDto, user); // createTask will be handled by repository file
  }

  async deleteTask(
    id: number,
    user: User,
  ): Promise<void> /* as we get a promise with void from repository file */ {
    // Normal way
    // const result = await this.taskRepository.delete(id);

    // Only user can delete who created
    const result = await this.taskRepository.delete({ id, userId: user.id });

    // result will have affected property whose value will be according to the data , deleted.
    if (!result.affected)
      throw new NotFoundException(
        `Data not found according to the giver ID ${id}`,
      );
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> /* as we get a promise with task from repository file */ {
    const task = await this.getTaskById(id, user); // we will get the task if it is associated with the user
    task.status = status;
    await task.save();

    return task;
  }
}
