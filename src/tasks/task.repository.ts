import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';
import { User } from '../auth/auth.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  private logger = new Logger();

  // with Query and all this process
  // i can do http://localhost:3000/tasks/?search=back&status=DONE
  async getTasks(queryParams: FilteredTasksDto, user: User): Promise<Task[]> {
    const { search, status } = queryParams;
    const query = this.createQueryBuilder('task'); // task is just a variable initialized for single data

    // only get the user's created tasks
    query.where('task.userId = :userId', { userId: user.id });

    if (status) query.andWhere('task.status = :status', { status });

    if (search)
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );

    try {
      const tasks = await query.getMany();
    return tasks;
    } catch (error) {
      this.logger.error(`Failed to get tasks for user ${user.username} , Filters: ${JSON.stringify(queryParams)}` , error.stack);
      throw new InternalServerErrorException()
    }
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.user = user;
    task.status = TaskStatus.OPEN;

    try {
      await task.save();
    } catch (e) {
      this.logger.error(`Failed to create task for user ${user.username} , Data: ${JSON.stringify(createTaskDto)}` , e.stack);
      throw new InternalServerErrorException()
    }

    delete task.user;
    return task;
  }
}
