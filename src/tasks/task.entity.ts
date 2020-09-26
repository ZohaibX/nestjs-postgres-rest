import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/auth.entity';

@Entity() // It is a main entity
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number; // id is number in pg

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  // many tasks can be assigned to a single user -- so many-to-one relation
  @ManyToOne(
    type => User,
    user => user.tasks,
    { eager: false }, // for auth entity -- it should be true
  )
  user: User;

  // userId column will be created as we make a relation between user and task
  // but we need to specify it manually to use it
  @Column()
  userId: number;
}
