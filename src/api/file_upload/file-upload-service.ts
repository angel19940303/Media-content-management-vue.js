import { ApiDataLoader } from "../api-data-loader";

interface FileUploadTask {
  id: number;
  fileName: string;
  file: File;
}

interface ActiveTask {
  uploadTask: FileUploadTask;
  request: XMLHttpRequest;
}

export interface UploadTaskEvent {
  eventType: string;
  taskId: number;
  fileName: string;
  progress: number;
  uploadedFileName: string | null;
}

interface FileUploadEvents {
  start: string;
  progress: string;
  success: string;
  failure: string;
  cancellation: string;
}

export class FileUploadService {
  private static readonly INSTANCE = new FileUploadService();
  private static readonly MAX_CONCURRENT_TASKS = 4;
  private static readonly NO_PROGRESS = -1;
  private static readonly PROGRESS_START = 0;
  private static readonly FILE_FIELD_NAME = "file";

  private static readonly EVENTS: FileUploadEvents = {
    start: "task-start",
    progress: "task.progress",
    success: "task-success",
    failure: "task-failure",
    cancellation: "task-cancellation",
  };

  private taskQueue = new Array<FileUploadTask>();
  private activeTasks = new Map<number, ActiveTask>();
  private taskCounter = 0;

  private callbacks = new Map<string, Array<(data: UploadTaskEvent) => void>>();

  static getInstance(): FileUploadService {
    return this.INSTANCE;
  }

  static getEvents(): FileUploadEvents {
    return this.EVENTS;
  }

  add(file: File): number {
    const task = { id: this.getTaskId(), fileName: file.name, file: file };
    this.taskQueue.push(task);
    this.startNextUploadTask();
    return task.id;
  }

  on(eventName: string, callback: (data: UploadTaskEvent) => void): void {
    switch (eventName) {
      case FileUploadService.EVENTS.start:
      case FileUploadService.EVENTS.progress:
      case FileUploadService.EVENTS.success:
      case FileUploadService.EVENTS.failure:
      case FileUploadService.EVENTS.cancellation:
        let eventCallbacks = this.callbacks.get(eventName);
        if (eventCallbacks === undefined) {
          eventCallbacks = new Array<(data: any) => void>();
          this.callbacks.set(eventName, eventCallbacks);
        }
        eventCallbacks.push(callback);
    }
  }

  off(eventName: string, callback: (data: UploadTaskEvent) => void): void {
    const eventCallbacks = this.callbacks.get(eventName);
    if (eventCallbacks !== undefined) {
      const index = eventCallbacks.indexOf(callback);
      if (index >= 0) {
        eventCallbacks.splice(index, 1);
        if (eventCallbacks.length === 0) {
          this.callbacks.delete(eventName);
        }
      }
    }
  }

  offEvent(eventName: string): void {
    if (this.callbacks.has(eventName)) {
      this.callbacks.delete(eventName);
    }
  }

  offAll(): void {
    this.callbacks.clear();
  }

  cancelTask(id: number): void {
    const activeTask = this.activeTasks.get(id);
    if (activeTask !== undefined) {
      activeTask.request.abort();
    } else {
      const index = this.taskQueue.findIndex((task) => task.id === id);
      if (index >= 0) {
        const task = this.taskQueue[index];
        this.taskQueue.splice(index, 1);
        this.emitEvent(FileUploadService.EVENTS.cancellation, task, -1, null);
      }
    }
  }

  private startNextUploadTask(): void {
    if (this.activeTasks.size >= FileUploadService.MAX_CONCURRENT_TASKS) {
      return;
    }
    const task = this.taskQueue.shift();
    if (task === undefined) {
      return;
    }

    const taskId = task.id;
    const formData = new FormData();
    formData.append(
      FileUploadService.FILE_FIELD_NAME,
      task.file,
      task.fileName
    );

    const request = new XMLHttpRequest();
    request.upload.addEventListener("progress", (event) =>
      this.onTaskProgress(event, task)
    );
    request.addEventListener("load", (event) =>
      this.onTaskSuccess(event, task)
    );
    request.addEventListener("error", (event) => this.onTaskError(event, task));
    request.addEventListener("abort", (event) => this.onTaskAbort(event, task));
    request.addEventListener("timeout", (event) =>
      this.onTaskError(event, task)
    );
    request.open("POST", ApiDataLoader.shared.uploadImageUrl());
    request.send(formData);

    const activeTask = { uploadTask: task, request: request };
    this.activeTasks.set(taskId, activeTask);

    this.emitEvent(
      FileUploadService.EVENTS.start,
      task,
      FileUploadService.PROGRESS_START,
      null
    );
  }

  private onTaskProgress(
    event: ProgressEvent<XMLHttpRequestEventTarget>,
    task: FileUploadTask
  ): void {
    const progress = event.loaded / event.total;
    this.emitEvent(FileUploadService.EVENTS.progress, task, progress, null);
  }

  private onTaskSuccess(
    event: ProgressEvent<XMLHttpRequestEventTarget>,
    task: FileUploadTask
  ): void {
    const activeTask = this.activeTasks.get(task.id);
    const responseText: any = activeTask?.request.responseText;
    console.log(event, responseText);
    if (responseText !== undefined) {
      try {
        const responseBody = JSON.parse(responseText);
        if (responseBody.FileName !== undefined) {
          this.emitEvent(
            FileUploadService.EVENTS.success,
            task,
            FileUploadService.NO_PROGRESS,
            responseBody.FileName
          );
        } else {
          this.emitEvent(
            FileUploadService.EVENTS.failure,
            task,
            FileUploadService.NO_PROGRESS,
            null
          );
        }
      } catch (error) {
        this.emitEvent(
          FileUploadService.EVENTS.failure,
          task,
          FileUploadService.NO_PROGRESS,
          null
        );
      }
    } else {
      this.emitEvent(
        FileUploadService.EVENTS.failure,
        task,
        FileUploadService.NO_PROGRESS,
        null
      );
    }
    this.activeTasks.delete(task.id);
    this.startNextUploadTask();
  }

  private onTaskError(
    event: ProgressEvent<XMLHttpRequestEventTarget>,
    task: FileUploadTask
  ): void {
    this.emitEvent(
      FileUploadService.EVENTS.failure,
      task,
      FileUploadService.NO_PROGRESS,
      null
    );
    this.activeTasks.delete(task.id);
    this.startNextUploadTask();
  }

  private onTaskAbort(
    event: ProgressEvent<XMLHttpRequestEventTarget>,
    task: FileUploadTask
  ): void {
    this.emitEvent(
      FileUploadService.EVENTS.cancellation,
      task,
      FileUploadService.NO_PROGRESS,
      null
    );
    this.activeTasks.delete(task.id);
    this.startNextUploadTask();
  }

  private emitEvent(
    eventType: string,
    task: FileUploadTask,
    progress: number,
    uploadedFileName: string | null
  ): void {
    const eventCallbacks = this.callbacks.get(eventType);
    if (eventCallbacks !== undefined) {
      const event = {
        eventType: eventType,
        taskId: task.id,
        fileName: task.fileName,
        progress: progress,
        uploadedFileName: uploadedFileName,
      };
      eventCallbacks.forEach((callback) => callback(event));
    }
  }

  private getTaskId(): number {
    this.taskCounter++;
    if (this.taskCounter > 1000000000) {
      this.taskCounter = 1;
    }
    return this.taskCounter;
  }
}
