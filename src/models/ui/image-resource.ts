import {
  FileUploadService,
  UploadTaskEvent,
} from "../../api/file_upload/file-upload-service";
import { ImageUtil } from "../../utils/image-util";
import { ConfigUtil } from "../../utils/config-util";

export class ImageResource {
  private static readonly IMG_TYPE_SVG = "svg";
  private static readonly IMG_TYPE_PNG = "png";
  private static readonly IMG_TYPE_JPG = "jpg";
  private static readonly IMG_TYPE_JPEG = "jpeg";
  private static readonly IMG_TYPE_GIF = "gif";
  private static readonly IMG_TYPE_WEBP = "webp";

  readonly fileName?: string;
  readonly id?: number;
  readonly width?: number;
  readonly height?: number;
  readonly progress?: number;
  readonly isError: boolean;

  private constructor(
    fileName: string | undefined,
    id: number | undefined,
    width: number | undefined,
    height: number | undefined,
    progress: number | undefined,
    isError: boolean
  ) {
    this.fileName = fileName;
    this.id = id;
    this.width = width;
    this.height = height;
    this.progress = progress;
    this.isError = isError;
  }

  static fromFileName(
    fileName: string,
    size: [number, number] | undefined
  ): ImageResource {
    const width = size === undefined ? 0 : size[0];
    const height = size === undefined ? 0 : size[1];
    return new ImageResource(
      fileName,
      undefined,
      width,
      height,
      undefined,
      false
    );
  }

  static fromUploadTaskId(id: number): ImageResource {
    return new ImageResource(undefined, id, undefined, undefined, -1, false);
  }

  static fromUploadTaskEvent(
    uploadTaskEvent: UploadTaskEvent
  ): Promise<ImageResource> {
    switch (uploadTaskEvent.eventType) {
      case FileUploadService.getEvents().success:
        if (uploadTaskEvent.uploadedFileName === null) {
          return Promise.resolve(
            new ImageResource(
              undefined,
              uploadTaskEvent.taskId,
              undefined,
              undefined,
              undefined,
              true
            )
          );
        }
        const fileName = uploadTaskEvent.uploadedFileName;
        return ImageUtil.getImageSize(fileName).then((size) =>
          this.fromFileName(fileName, size)
        );
      case FileUploadService.getEvents().failure:
        return Promise.resolve(
          new ImageResource(
            undefined,
            uploadTaskEvent.taskId,
            undefined,
            undefined,
            undefined,
            true
          )
        );
      default:
        return Promise.resolve(
          new ImageResource(
            undefined,
            uploadTaskEvent.taskId,
            undefined,
            undefined,
            uploadTaskEvent.progress * 100,
            false
          )
        );
    }
  }

  withIsError(isError: boolean) {
    return new ImageResource(
      this.fileName,
      this.id,
      undefined,
      undefined,
      -1,
      isError
    );
  }

  isLoading(): boolean {
    return (
      this.progress !== undefined && this.progress >= 0 && this.progress < 100
    );
  }

  isPlaceholder(): boolean {
    return this.id !== undefined && this.fileName === undefined;
  }

  getAspectRatio(): string | undefined {
    return ImageUtil.getAspectRatio(this.width, this.height);
  }

  getUrl(): string | undefined {
    return this.fileName === undefined
      ? undefined
      : ConfigUtil.imageUrl(this.fileName);
  }

  getType(): string | undefined {
    if (this.fileName === undefined) {
      return undefined;
    }
    const index = this.fileName.lastIndexOf(".");
    if (index < 0) {
      return undefined;
    }
    const suffix = this.fileName.substr(index + 1).toLowerCase();
    switch (suffix) {
      case ImageResource.IMG_TYPE_JPG:
      case ImageResource.IMG_TYPE_JPEG:
        return ImageResource.IMG_TYPE_JPG;
      case ImageResource.IMG_TYPE_SVG:
      case ImageResource.IMG_TYPE_PNG:
      case ImageResource.IMG_TYPE_GIF:
      case ImageResource.IMG_TYPE_WEBP:
        return suffix;
      default:
        return undefined;
    }
  }
}
