import { TasksService } from './tasks.service';
import { TaskStatus } from './task.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import { Task } from './task.entity';
import { User } from '../auth/auth.entity';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    private logger;
    getAllTasks(queryParameters: FilteredTasksDto, user: User): Promise<Task[]>;
    getTaskById(id: number, user: User): Promise<Task>;
    createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task>;
    deleteTask(id: number, user: User): Promise<void>;
    updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task>;
}
