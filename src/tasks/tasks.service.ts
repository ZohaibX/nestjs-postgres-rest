import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from '../auth/auth.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getAllTasks(
    queryParams: FilteredTasksDto,
    user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(queryParams, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    // normal way
    // const found = await this.taskRepository.findOne(id);

    // to get only task created by user himself
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    }); // postgres query

    if (!found)
      throw new NotFoundException(
        `Data not found according to the giver ID ${id}`,
      );
    //if this function returns error , error will be returned to everywhere this fn is called

    return found;
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
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
  ): Promise<Task> {
    console.log(id);
    const task = await this.getTaskById(id, user); // we will get the task if it is associated with the user
    console.log(task);
    task.status = status;
    await task.save();

    return task;
  }
}
