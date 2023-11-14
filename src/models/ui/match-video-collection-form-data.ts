import { VideoEntryDataPayload } from "../videos/video-entry-data-payload";
import { MatchVideoCollectionFormValidation } from "./match-video-collection-form-validation";
import { BaseUIModel } from "./base-ui-model";
import { EnumList } from "../common/enum-list";
import { MatchVideoCollection } from "../videos/match-video-collection";
import { DateUtil } from "../../utils/date-util";

export class MatchVideoCollectionFormData extends BaseUIModel {
  readonly internalEventId: string;
  readonly language: string;
  readonly videos: VideoEntryDataPayload[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly validation: MatchVideoCollectionFormValidation;

  private constructor(
    internalEventId: string,
    language: string,
    videos: VideoEntryDataPayload[],
    createdAt: string,
    updatedAt: string,
    validation: MatchVideoCollectionFormValidation
  ) {
    super();
    this.internalEventId = internalEventId;
    this.language = language;
    this.videos = videos;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.validation = validation;
  }

  create(): MatchVideoCollectionFormData {
    const dateStr = DateUtil.formatIso8601(new Date());
    return new MatchVideoCollectionFormData(
      "",
      "",
      [],
      dateStr,
      dateStr,
      MatchVideoCollectionFormValidation.create()
    );
  }

  fromData(data: MatchVideoCollection): MatchVideoCollectionFormData {
    return new MatchVideoCollectionFormData(
      data.internalEventId,
      data.language,
      data.videos,
      data.created_at,
      data.updated_at,
      MatchVideoCollectionFormValidation.create()
    );
  }

  withInternalEventId(internalEventId: string): MatchVideoCollectionFormData {
    return this.copy({
      internalEventId: internalEventId,
      validation: this.validation.withInternalEventId(internalEventId),
    });
  }

  withLanguage(
    language: string,
    enums: EnumList
  ): MatchVideoCollectionFormData {
    return this.copy({
      language: language,
      validation: this.validation.withLanguage(language, enums),
    });
  }

  withVideos(videos: VideoEntryDataPayload[]): MatchVideoCollectionFormData {
    return this.copy({
      videos: videos,
      validation: this.validation.withVideos(videos),
    });
  }

  withAddedVideo(video: VideoEntryDataPayload): MatchVideoCollectionFormData {
    const newVideos = Array.from(this.videos);
    newVideos.push(video);
    return this.copy({
      videos: newVideos,
      validation: this.validation.withVideos(newVideos),
    });
  }

  withReplacedVideo(
    index: number,
    video: VideoEntryDataPayload
  ): MatchVideoCollectionFormData {
    if (index < 0 || index >= this.videos.length) {
      return this.withAddedVideo(video);
    }
    const newVideos = Array.from(this.videos);
    newVideos.splice(index, 1, video);
    return this.copy({
      videos: newVideos,
      validation: this.validation.withVideos(newVideos),
    });
  }

  withRemovedVideo(index: number): MatchVideoCollectionFormData {
    if (index < 0 || index >= this.videos.length) {
      return this;
    }
    const newVideos = Array.from(this.videos);
    newVideos.splice(index, 1);
    return this.copy({
      videos: newVideos,
      validation: this.validation.withVideos(newVideos),
    });
  }

  withCreatedAt(createdAt: string): MatchVideoCollectionFormData {
    return this.copy({ createdAt: createdAt });
  }

  withUpdatedAt(updatedAt: string): MatchVideoCollectionFormData {
    return this.copy({ updatedAt: updatedAt });
  }

  validated(enums: EnumList): MatchVideoCollectionFormData {
    return this.copy({
      validation: this.validation
        .withInternalEventId(this.internalEventId)
        .withLanguage(this.language, enums)
        .withVideos(this.videos),
    });
  }

  payload(): MatchVideoCollection {
    return {
      internalEventId: this.internalEventId,
      language: this.language,
      videos: this.videos,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  private copy(
    values: Partial<MatchVideoCollectionFormData>
  ): MatchVideoCollectionFormData {
    return new MatchVideoCollectionFormData(
      this.valueOrElse(values.internalEventId, this.internalEventId),
      this.valueOrElse(values.language, this.language),
      this.valueOrElse(values.videos, this.videos),
      this.valueOrElse(values.createdAt, this.createdAt),
      this.valueOrElse(values.updatedAt, this.updatedAt),
      this.valueOrElse(values.validation, this.validation)
    );
  }
}
