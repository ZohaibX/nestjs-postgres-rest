import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  // we need to provide all modules and typeOrm config file
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TasksModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
