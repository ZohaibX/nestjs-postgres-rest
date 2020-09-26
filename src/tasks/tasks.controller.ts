import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../auth/auth.entity';
import { Logger } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  private logger = new Logger('TasksController');


  @Get()
  @UseGuards(AuthGuard())
  getAllTasks(
    @Query(ValidationPipe) queryParameters: FilteredTasksDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`${user} is retrieving all its created tasks with ${JSON.stringify(queryParameters)}`)
    return this.tasksService.getAllTasks(queryParameters, user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  createTask(@Body() createTaskDto: CreateTaskDTO, @GetUser() user: User) {
    this.logger.verbose(`${user} is creating a task with data ${JSON.stringify(createTaskDto)}`)
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  @UseGuards(AuthGuard())
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ) {
    console.log(status, id);
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
