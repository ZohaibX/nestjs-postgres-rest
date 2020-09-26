import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class FilteredTasksDto {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN]) //! so status provided must be according to enum
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
