import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Unique,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['username']) // we will add the title of the columns we want to be unique
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string; // just to save salt

  @OneToMany(
    type => Task,
    task => task.user,
    { eager: true },
  )
  tasks: Task[];

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await bcrypt.hash(password, this.salt);
    return hashPassword === this.password; // this will return true of false to validate password
  }
}
