"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const typeorm_1 = require("typeorm");
const task_entity_1 = require("./task.entity");
const task_status_enum_1 = require("./task-status.enum");
const common_1 = require("@nestjs/common");
let TaskRepository = class TaskRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger();
    }
    async getTasks(queryParams, user) {
        const { search, status } = queryParams;
        const query = this.createQueryBuilder('task');
        query.where('task.userId = :userId', { userId: user.id });
        if (status)
            query.andWhere('task.status = :status', { status });
        if (search)
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        try {
            const tasks = await query.getMany();
            return tasks;
        }
        catch (error) {
            this.logger.error(`Failed to get tasks for user ${user.username} , Filters: ${JSON.stringify(queryParams)}`, error.stack);
            throw new common_1.InternalServerErrorException();
        }
    }
    async createTask(createTaskDto, user) {
        const { title, description } = createTaskDto;
        const task = this.create();
        task.title = title;
        task.description = description;
        task.user = user;
        task.status = task_status_enum_1.TaskStatus.OPEN;
        try {
            await task.save();
        }
        catch (e) {
            this.logger.error(`Failed to create task for user ${user.username} , Data: ${JSON.stringify(createTaskDto)}`, e.stack);
            throw new common_1.InternalServerErrorException();
        }
        delete task.user;
        return task;
    }
};
TaskRepository = __decorate([
    typeorm_1.EntityRepository(task_entity_1.Task)
], TaskRepository);
exports.TaskRepository = TaskRepository;
//# sourceMappingURL=task.repository.js.map