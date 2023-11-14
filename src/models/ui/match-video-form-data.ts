import { MatchVideoEntryFormData } from "./match-video-entry-form-data";
import { MatchVideoCollection } from "../videos/match-video-collection";
import { EnumList } from "../common/enum-list";
import { DataTransformUtil } from "../../utils/data-transform-util";
import { DateUtil } from "../../utils/date-util";
import { VideoEntryDataPayload } from "../videos/video-entry-data-payload";

export class MatchVideoFormData {
  readonly internalEventId: string;
  readonly videos: MatchVideoEntryFormData[];
  readonly localizedCreatedAt: Map<string, string>;

  private constructor(
    internalEventId: string,
    videos: MatchVideoEntryFormData[],
    localizedCreatedAt: Map<string, string>
  ) {
    this.internalEventId = internalEventId;
    this.videos = videos;
    this.localizedCreatedAt = localizedCreatedAt;
  }

  static create(internalEventId: string): MatchVideoFormData {
    return new MatchVideoFormData(
      internalEventId,
      [],
      new Map<string, string>()
    );
  }

  static fromData(
    internalEventId: string,
    data: MatchVideoCollection[],
    enums: EnumList
  ): MatchVideoFormData {
    const localizedCreatedAt = new Map<string, string>();
    const videos = new Array<MatchVideoEntryFormData>();
    data.forEach((videoCollection) => {
      if (
        videoCollection.created_at === undefined ||
        videoCollection.language === undefined ||
        videoCollection.videos === undefined
      ) {
        return;
      }
      localizedCreatedAt.set(
        videoCollection.language,
        videoCollection.created_at
      );
      videoCollection.videos.forEach((video) => {
        const videoData = MatchVideoEntryFormData.fromData(
          videoCollection.language,
          video,
          enums
        );
        if (videoData !== undefined) {
          videos.push(videoData);
        }
      });
    });
    return new MatchVideoFormData(internalEventId, videos, localizedCreatedAt);
  }

  addVideoEntry(videoEntry: MatchVideoEntryFormData): MatchVideoFormData {
    const newVideos = Array.from(this.videos);
    const newLocalizedCreatedAt = new Map<string, string>(
      this.localizedCreatedAt
    );
    newVideos.push(videoEntry);
    if (!newLocalizedCreatedAt.has(videoEntry.language)) {
      newLocalizedCreatedAt.set(
        videoEntry.language,
        DateUtil.formatIso8601(new Date())
      );
    }
    return this.copy({
      videos: newVideos,
      localizedCreatedAt: newLocalizedCreatedAt,
    });
  }

  updateVideoEntry(
    videoEntry: MatchVideoEntryFormData,
    index: number
  ): MatchVideoFormData {
    if (index < 0 || index >= this.videos.length) {
      return this.addVideoEntry(videoEntry);
    }
    const newVideos = Array.from(this.videos);
    newVideos.splice(index, 1, videoEntry);
    return this.copy({ videos: newVideos });
  }

  deleteVideoEntry(index: number): MatchVideoFormData {
    if (index < 0 || index >= this.videos.length) {
      return this;
    }
    const newVideos = Array.from(this.videos);
    newVideos.splice(index, 1);
    return this.copy({ videos: newVideos });
  }

  localizedCollections(): MatchVideoCollection[] {
    const collections = new Array<MatchVideoCollection>();
    const videosByLanguage = new Map<string, VideoEntryDataPayload[]>();
    this.videos.forEach((video) => {
      let videos = videosByLanguage.get(video.language);
      if (videos === undefined) {
        videos = new Array<VideoEntryDataPayload>();
        videosByLanguage.set(video.language, videos);
      }
      videos.push(video.videoEntryDataPayload());
    });
    this.localizedCreatedAt.forEach((createdAt, language) => {
      collections.push({
        videos: videosByLanguage.get(language) || [],
        language: language,
        created_at: createdAt,
        internalEventId: this.internalEventId,
        updated_at: DateUtil.formatIso8601(new Date()),
      });
    });
    return collections;
  }

  private copy(values: Partial<MatchVideoFormData>): MatchVideoFormData {
    return new MatchVideoFormData(
      DataTransformUtil.getOrElse(values.internalEventId, this.internalEventId),
      DataTransformUtil.getOrElse(values.videos, this.videos),
      DataTransformUtil.getOrElse(
        values.localizedCreatedAt,
        this.localizedCreatedAt
      )
    );
  }
}
