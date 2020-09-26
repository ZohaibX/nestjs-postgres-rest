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
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilteredTasksDto } from './dto/filtered-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/mustFiles/get-user.decorator';
import { User } from '../auth/auth.entity';
import { Logger } from '@nestjs/common';

// ValidationPipe Uses here
// one in getAllTasks
// 2nd in createTask
// 3rd in updateTaskStatus

@Controller('tasks')
export class TasksController {
  // service is used here
  constructor(private tasksService: TasksService) {}

  // we always use logger
  private logger = new Logger('TasksController');

  @Get()
  @UseGuards(AuthGuard()) // This statement will be used by the jwtStrategy available in auth folder -- documentation is there
  getAllTasks(
    @Query(ValidationPipe) queryParameters: FilteredTasksDto, // we are getting query parameters like status=DONE&search=user
    // QueryParameters will only be according to FilteredTasksDto and applying ValidationPipe in @Query() makes sure that all the validation applied in DTO will be applied when querying
    // FilteredTasksDto is well coded for status enum too
    @GetUser() user: User, // GetUser is a custom decorator we must have in auth folder -- documentation is there
  ): Promise<Task[]> /* as we get a promise with task[] from service file */ {
    this.logger.verbose(
      `${user} is retrieving all its created tasks with ${JSON.stringify(
        queryParameters,
      )}`,
    );
    return this.tasksService.getAllTasks(queryParameters, user); // getAllTasks will work in services file
  }

  @Get('/:id')
  @UseGuards(AuthGuard()) // This statement will be used by the jwtStrategy available in auth folder -- documentation is there
  getTaskById(
    @Param('id', ParseIntPipe) id: number, // param id is string so, parseIntPipe will convert it to number
    @GetUser() user: User, // GetUser is a custom decorator we must have in auth folder
  ): Promise<Task> /* as we get a promise with a task from service file  */ {
    return this.tasksService.getTaskById(id, user); // getTaskById will work in services file
  }

  @Post()
  @UsePipes(ValidationPipe) // This method will strictly apply validation rules we have/may specify/specified in create-Task.dto.ts
  @UseGuards(AuthGuard()) // This statement will be used by the jwtStrategy available in auth folder -- documentation is there
  createTask(
    @Body() createTaskDto: CreateTaskDTO, // we will provide createTaskDto by body
    @GetUser() user: User, // GetUser is a custom decorator we must have in auth folder -- documentation is there
  ): Promise<Task> /* as we get a promise with a task from service file  */ {
    this.logger.verbose(
      `${user.username} is creating a task with data ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user); // createTask will work in services file
  }

  @Delete('/:id')
  @UseGuards(AuthGuard()) // This statement will be used by the jwtStrategy available in auth folder -- documentation is there
  deleteTask(
    @Param('id', ParseIntPipe) id: number, // param id is string so, parseIntPipe will convert it to number
    @GetUser() user: User, // GetUser is a custom decorator we must have in auth folder -- documentation is there
  ): Promise<void> /* as we get a promise with void from service file  */ {
    return this.tasksService.deleteTask(id, user); // deleteTask will work in services file
  }

  @Patch('/:id/status')
  @UseGuards(AuthGuard())
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number, // param id is string so, parseIntPipe will convert it to number
    @Body('status', TaskStatusValidationPipe) status: TaskStatus, // we have a special file (ValidationPipe) as TaskStatusValidationPipe -- documentation is in pipes folder
    // status can only be from the TaskStatus enum
    @GetUser() user: User, // GetUser is a custom decorator we must have in auth folder -- documentation is there
  ): Promise<Task> /* as we get a promise with Task from service file  */ {
    console.log(status, id);
    return this.tasksService.updateTaskStatus(id, status, user); // updateTaskStatus will work in services file
  }
}
