import { VideoEntryDataPayload } from "../videos/video-entry-data-payload";
import { EnumList } from "../common/enum-list";
import { MatchVideoCollection } from "../videos/match-video-collection";

export class MatchVideoCollectionFormValidation {
  readonly isIntervalEventIdValid: boolean;
  readonly isLanguageValid: boolean;
  readonly areVideosValid: boolean;
  readonly isValid: boolean;

  readonly internalEventIdErrors: string[];
  readonly languageErrors: string[];
  readonly videosErrors: string[];

  readonly isInitial: boolean;

  private constructor(
    internalEventIdErrors: string[],
    languageErrors: string[],
    videosErrors: string[],
    isInitial: boolean
  ) {
    this.isIntervalEventIdValid =
      isInitial || internalEventIdErrors.length === 0;
    this.isLanguageValid = isInitial || languageErrors.length === 0;
    this.areVideosValid = isInitial || videosErrors.length === 0;
    this.isValid =
      this.isIntervalEventIdValid &&
      this.isLanguageValid &&
      this.areVideosValid;

    this.internalEventIdErrors = internalEventIdErrors;
    this.languageErrors = languageErrors;
    this.videosErrors = videosErrors;
    this.isInitial = isInitial;
  }

  static create(): MatchVideoCollectionFormValidation {
    return new MatchVideoCollectionFormValidation([], [], [], true);
  }

  static fromData(
    data: MatchVideoCollection,
    enums: EnumList
  ): MatchVideoCollectionFormValidation {
    return new MatchVideoCollectionFormValidation(
      this.validateInternalEventId(data.internalEventId),
      this.validateLanguage(data.language, enums),
      this.validateVideos(data.videos),
      false
    );
  }

  static validateInternalEventId(internalEventId: string): string[] {
    if (internalEventId.length === 0) {
      return ["Internal event ID is empty"];
    }
    return [];
  }

  static validateLanguage(language: string, enums: EnumList): string[] {
    if (!enums.hasLanguageWithCode(language)) {
      return ["Language does not exist"];
    }
    return [];
  }

  static validateVideos(videos: VideoEntryDataPayload[]): string[] {
    if (videos.length === 0) {
      return ["List of videos is empty"];
    }
    return [];
  }

  getInternalEventIdErrors(): string[] {
    return this.isInitial ? [] : this.internalEventIdErrors;
  }

  getVideosErrors(): string[] {
    return this.isInitial ? [] : this.videosErrors;
  }

  withInternalEventId(
    internalEventId: string
  ): MatchVideoCollectionFormValidation {
    const internalEventIdErrors = MatchVideoCollectionFormValidation.validateInternalEventId(
      internalEventId
    );
    return this.copy({
      internalEventIdErrors: internalEventIdErrors,
      isInitial: false,
    });
  }

  withLanguage(
    language: string,
    enums: EnumList
  ): MatchVideoCollectionFormValidation {
    const languageErrors = MatchVideoCollectionFormValidation.validateLanguage(
      language,
      enums
    );
    return this.copy({ languageErrors: languageErrors, isInitial: false });
  }

  withVideos(
    videos: VideoEntryDataPayload[]
  ): MatchVideoCollectionFormValidation {
    const videosErrors = MatchVideoCollectionFormValidation.validateVideos(
      videos
    );
    return this.copy({ videosErrors: videosErrors, isInitial: false });
  }

  validated(): MatchVideoCollectionFormValidation {
    if (this.isInitial) {
      return this.copy({ isInitial: false });
    }
    return this;
  }

  private copy(
    values: Partial<MatchVideoCollectionFormValidation>
  ): MatchVideoCollectionFormValidation {
    const valueOrElse = <T>(value: T | undefined, fallbackValue: T): T => {
      return value !== undefined ? value : fallbackValue;
    };
    return new MatchVideoCollectionFormValidation(
      valueOrElse(values.internalEventIdErrors, this.internalEventIdErrors),
      valueOrElse(values.languageErrors, this.languageErrors),
      valueOrElse(values.videosErrors, this.videosErrors),
      valueOrElse(values.isInitial, this.isInitial)
    );
  }
}
