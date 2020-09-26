import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import { Task } from './task.entity';
import { User } from '../auth/auth.entity';
export declare class TaskRepository extends Repository<Task> {
    private logger;
    getTasks(queryParams: FilteredTasksDto, user: User): Promise<Task[]>;
    createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task>;
}
