import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // these two imports are to be added
    TypeOrmModule.forFeature([TaskRepository]), // add this when typeOrm configure file is created
    AuthModule, // added the auth module so we get all the functionalities AuthModule exports
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
