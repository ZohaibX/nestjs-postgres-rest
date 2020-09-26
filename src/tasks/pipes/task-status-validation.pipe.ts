import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  // this function must be used with value argument
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, metadata);
    // value will the something where we apply this pipe in controllers
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
