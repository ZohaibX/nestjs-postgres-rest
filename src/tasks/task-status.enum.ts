export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

//! so we can only have 3 options for TaskStatus
//! we have special created task-status-validation.pipe.ts to validate status when we provide status in Patch request
