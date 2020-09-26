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

//! we can also have ownership here as we can assign some property like owner , manager
//! and we can pass them in jwt and in frontend we can know who is owner or manager .

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

  // one user can have multiple tasks -- one-to-many relation
  @OneToMany(
    type => Task,
    task => task.user,
    { eager: true }, // eager must be true in here, and false in tasks like modules
  )
  tasks: Task[];

  async validatePassword(
    password: string,
  ): Promise<boolean> /* we will get true or false in promise */ {
    //! Logic of verification of password -- everything is used and defined in signUp function in repository file
    // in user.password, we have hashed version of password
    // and in user.salt , we have the salt we used to hash the password
    // so when user provides some password, we will hash that with user.salt
    // and if userProvidedPassword+user.salt becomes as same as user.password, password will be verified and we will get true
    // otherwise, false

    const hashPassword = await bcrypt.hash(password, this.salt);
    return hashPassword === this.password; // this will return true or false to validate password
  }
}
