import { Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

//! mockResolvedValue always return a promise
//! mockReturnValue will return something (not promise)

// mockRepository is something which is injected in some class (service)
const mockRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

const mockUser = { id: 12, username: 'user-1' }; // mockUser to provide as a user

describe('Tasks Service', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    // Must Task -- we create a mock module
    const module = await Test.createTestingModule({
      providers: [
        TasksService, // pTests are about TasksService class
        { provide: TaskRepository, useFactory: mockRepository }, // injected task repository to tasksService class
      ],
    }).compile();

    // to initialize every provider as this
    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('Get Tasks', () => {
    it('get tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue'); // now taskRepository.getTasks returns 'someValue' and as a promise
      expect(taskRepository.getTasks).not.toHaveBeenCalled(); // at this moment, taskRepository.getTasks not have to be called
      const filters = { status: TaskStatus.IN_PROGRESS, search: 'something' }; // mock filters
      const result = await tasksService.getAllTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled(); // till now taskRepository.getTasks have to be called
      expect(result).toEqual('someValue');
    });
  });

  describe('Get Tasks By ID', () => {
    it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
      taskRepository.findOne.mockResolvedValue({
        title: 'piro',
        description: 'grammer',
      }); // now taskRepository.findOne returns same object and as a promise
      const result = await tasksService.getTaskById(1, mockUser); // as we call this fn
      // taskRepository.findOne will be called which will return user object, we assigned above
      expect(result).toEqual({ title: 'piro', description: 'grammer' });
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      }); // at this point, taskRepository.findOne should have been called with the arguments , which original taskRepository.findOne takes
    });

    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null); // taskRepository.findOne will return null on any case
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(); // rejects is like a catch block
      // as tasksService.getTaskById is an async function but that's how we call the function which throws an error and not return anything
      // expect(some_async_fn_without_any_await).rejects.toThrow(some_error_like_NotFoundException)
    });
  });

  describe('Create Tasks', () => {
    it('works well', async () => {
      expect(taskRepository.createTask).not.toHaveBeenCalled(); // at this time, taskRepository.createTask shouldn't have been called

      const returnedData = {
        id: 1,
        title: 'piro',
        description: 'grammer',
        status: TaskStatus.IN_PROGRESS,
      }; // mock return data

      const mockCreateTaskDTO = { title: 'piro', description: 'grammer' };

      taskRepository.createTask.mockResolvedValue(returnedData); // so taskRepository.createTask will always return returnedData with a promise

      //! we don't need to provide exact returned data in mockResolved Value
      //! we could also say taskRepository.createTask.mockResolvedValue('someString');
      //! and we could expect expect(result).toEqual('someString');

      const result = await tasksService.createTask(mockCreateTaskDTO, mockUser);

      expect(result).toEqual(returnedData);
    });
  });

  describe('Delete Tasks', () => {
    it('should deleta a task', async () => {
      // on service file, if we delete something, we get property affected: number_of_tasks_deleted
      taskRepository.delete.mockResolvedValue({ affected: 1 }); // it will return {affected:1} always with a promise
      expect(taskRepository.delete).not.toHaveBeenCalled(); // as we didn't call delete function, taskRepository.delete fn must not to be called

      await tasksService.deleteTask(1, mockUser); // it doesn't return anything - so didn't save in variable
      // no need to test result , when tasksService.deleteTask is called , it will run
      // and when it calls taskRepository.delete fn , it wii get property {affected:1} , so it will not throw an error
      // if there is some problem , test will not pass

      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      }); // as service file delete function is called, taskRepository.delete fn must  be called
    });

    it('should throw an error', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 }); // it will always return {affected:0} means nothing is deleted
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow();
      // as tasksService.deleteTask is an async function but that's how we call the function which throws an error and not return anything
      // expect(some_async_fn_without_any_await).rejects.toThrow(some_error_like_NotFoundException)
    });
  });

  describe('Update Task Status', () => {
    it('runs well and return a task', async () => {
      // updateFunction calls same file function -- this.getTaskById()
      // which returns a task, but we only need user's status
      // and we need a save function too

      // mocking getTaskById and getting status and save fn
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.IN_PROGRESS,
        save: jest.fn().mockResolvedValue(true),
      });

      expect(tasksService.getTaskById).not.toHaveBeenCalled();

      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.IN_PROGRESS,
        mockUser,
      ); // result will have an updated task

      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
    });
  });
});
