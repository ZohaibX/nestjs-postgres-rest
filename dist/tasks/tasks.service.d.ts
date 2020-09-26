import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from '../auth/auth.entity';
export declare class TasksService {
    private taskRepository;
    constructor(taskRepository: TaskRepository);
    getAllTasks(queryParams: FilteredTasksDto, user: User): Promise<Task[]>;
    getTaskById(id: number, user: User): Promise<Task>;
    createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task>;
    deleteTask(id: number, user: User): Promise<void>;
    updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task>;
}
