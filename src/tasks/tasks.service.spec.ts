import { Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.model';
import { NotFoundException } from '@nestjs/common';

//! mockResolvedValue always return a promise

const mockRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

const mockUser = { id: 12, username: 'user-1' };

describe('Tasks Service', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    // Must Task
    const module = await Test.createTestingModule({
      providers: [
        TasksService, // provided TasksService to new created testing module
        { provide: TaskRepository, useFactory: mockRepository }, // injected task repository to tasksService
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('Get Tasks', () => {
    it('get tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters = { status: TaskStatus.IN_PROGRESS, search: 'something' };
      const result = await tasksService.getAllTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('Get Tasks By ID', () => {
    it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
      taskRepository.findOne.mockResolvedValue({
        title: 'piro',
        description: 'grammer',
      });
      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual({ title: 'piro', description: 'grammer' });
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null); // notFoundException
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(); // rejects is like a catch block
    });
  });

  describe('Create Tasks', () => {
    it('works well', async () => {
      expect(taskRepository.createTask).not.toHaveBeenCalled();

      const returnedData = {
        id: 1,
        title: 'piro',
        description: 'grammer',
        status: TaskStatus.IN_PROGRESS,
      };
      const mockCreateTaskDTO = { title: 'piro', description: 'grammer' };

      taskRepository.createTask.mockResolvedValue(returnedData);
      // we don't need to provide exact returned data in mockResolved Value
      // we could also say taskRepository.createTask.mockResolvedValue('someString');
      // and we could expect expect(result).toEqual('someString');

      const result = await tasksService.createTask(mockCreateTaskDTO, mockUser);

      expect(result).toEqual(returnedData);
    });
  });

  describe('Delete Tasks', () => {
    it('should deleta a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      // no need to test result , when tasksService.deleteTask is called , it will run
      // and when it calls taskRepository.delete fn , it wii get property {afftected:1} , so it will not throw an error
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('should throw an error', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow();
    });
  });

  describe('Update Task Status', () => {
    it('runs well and return a task', async () => {
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.IN_PROGRESS,
        save: jest.fn().mockResolvedValue(true),
      });
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.IN_PROGRESS,
        mockUser,
      );
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
    });
  });
});
