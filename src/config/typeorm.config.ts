import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

//! This file is TypeOrm config file for postgres
//! this file is like as mongoose to mongodb

interface configInterface {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}
const dbConfig: configInterface = config.get('db');

// all the process.env.RDS Variables will be saved in Elasticbeanstalk
export const typeOrmConfig: TypeOrmModuleOptions = {
  // all the info about pg i made by myself when creating a db in pgAdmin
  type: dbConfig.type,
  host: process.env.RDS_HOST_NAME || dbConfig.host,
  port: dbConfig.port, // Add process.env.RDS_PORT || here , when i know the type of process.env.RDS_PORT
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DATABASE || dbConfig.database,

  // typeorm specifications
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // it means to pick every file with ext .entity.ts/js after going to the src folder
  synchronize: dbConfig.synchronize, // in development we use it as true, in prod -> false
};
