import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

//! This file will specify that we must need to provide input from some options
//! and this file is provided in controllers file and patch request
//! We are using this file for status enum file ,
//! and we can update this file according to our need

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  // this function must be used with value argument
  transform(value: any, metadata: ArgumentMetadata) {
    // value will be whatever input we provide as  a status .
    value = value.toUpperCase();

    if (!this.isStatusValid(value))
      throw new BadRequestException(`${value} is an invalid status`);

    return value; // this is the main return
  }

  private isStatusValid(status: any) {
    const index = this.allowedStatuses.indexOf(status);
    return index !== -1;
    // indexOf will return -1 if nothing found
    // and it will return true if index !== -1
  }
}
