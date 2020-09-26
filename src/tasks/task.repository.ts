import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/auth.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

//! only get and post method will be implemented in this file
//! all functional params are provided by service file , so no need for documentation of functional params

@EntityRepository(Task) // Repository of entity (User)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger(); // logger for logging

  // with Query and all this process
  // i can do http://localhost:3000/tasks/?search=back&status=DONE
  async getTasks(
    queryParams: FilteredTasksDto,
    user: User,
  ): Promise<Task[]> /* as we will get promise of tasks[] here */ {
    const { search, status } = queryParams; // queryParams = FilteredTasksDto // so only values of DTO

    const query = this.createQueryBuilder('task');
    // task is just a variable initialized for single data -- for query

    // only get the user's created tasks
    query.where('task.userId = :userId', { userId: user.id }); // get user's created tasks

    if (status) query.andWhere('task.status = :status', { status }); // applying filter for status

    // applying filter for search
    if (search)
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );

    try {
      const tasks = await query.getMany(); // way of getting filtered tasks
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user ${
          user.username
        } , Filters: ${JSON.stringify(queryParams)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(
    createTaskDto: CreateTaskDTO,
    user: User,
  ): Promise<Task> /* as we will get promise of tasks here */ {
    const { title, description } = createTaskDto;

    const task = this.create(); // that's how we create a new user
    // we could also say new Task(); -- this.create() is used when we want tests

    task.title = title;
    task.description = description;

    task.user = user; // assigning user to task.user
    task.status = TaskStatus.OPEN;

    try {
      await task.save();
    } catch (e) {
      this.logger.error(
        `Failed to create task for user ${
          user.username
        } , Data: ${JSON.stringify(createTaskDto)}`,
        e.stack,
      );
      throw new InternalServerErrorException();
    }

    delete task.user; // because we don't wanna return user's data
    return task;
  }
}
