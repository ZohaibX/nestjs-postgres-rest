"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const tasks_service_1 = require("./tasks.service");
const task_model_1 = require("./task.model");
const create_task_dto_1 = require("./dto/create-task.dto");
const filtered_tasks_dto_1 = require("./dto/filtered-tasks.dto");
const task_status_validation_pipe_1 = require("./pipes/task-status-validation.pipe");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const auth_entity_1 = require("../auth/auth.entity");
const common_2 = require("@nestjs/common");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
        this.logger = new common_2.Logger('TasksController');
    }
    getAllTasks(queryParameters, user) {
        this.logger.verbose(`${user} is retrieving all its created tasks with ${JSON.stringify(queryParameters)}`);
        return this.tasksService.getAllTasks(queryParameters, user);
    }
    getTaskById(id, user) {
        return this.tasksService.getTaskById(id, user);
    }
    createTask(createTaskDto, user) {
        this.logger.verbose(`${user} is creating a task with data ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }
    deleteTask(id, user) {
        return this.tasksService.deleteTask(id, user);
    }
    updateTaskStatus(id, status, user) {
        console.log(status, id);
        return this.tasksService.updateTaskStatus(id, status, user);
    }
};
__decorate([
    common_1.Get(),
    common_1.UseGuards(passport_1.AuthGuard()),
    __param(0, common_1.Query(common_1.ValidationPipe)),
    __param(1, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filtered_tasks_dto_1.FilteredTasksDto,
        auth_entity_1.User]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getAllTasks", null);
__decorate([
    common_1.Get('/:id'),
    common_1.UseGuards(passport_1.AuthGuard()),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, auth_entity_1.User]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getTaskById", null);
__decorate([
    common_1.Post(),
    common_1.UsePipes(common_1.ValidationPipe),
    common_1.UseGuards(passport_1.AuthGuard()),
    __param(0, common_1.Body()), __param(1, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDTO, auth_entity_1.User]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "createTask", null);
__decorate([
    common_1.Delete('/:id'),
    common_1.UseGuards(passport_1.AuthGuard()),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, auth_entity_1.User]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "deleteTask", null);
__decorate([
    common_1.Patch('/:id/status'),
    common_1.UseGuards(passport_1.AuthGuard()),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body('status', task_status_validation_pipe_1.TaskStatusValidationPipe)),
    __param(2, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, auth_entity_1.User]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "updateTaskStatus", null);
TasksController = __decorate([
    common_1.Controller('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
exports.TasksController = TasksController;
//# sourceMappingURL=tasks.controller.js.map