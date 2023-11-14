import { VideoEntryDataPayload } from "../videos/video-entry-data-payload";
import { DateUtil } from "../../utils/date-util";
import { DataTransformUtil } from "../../utils/data-transform-util";
import { MatchVideoEntryFormValidation } from "./match-video-entry-form-validation";
import { EnumList } from "../common/enum-list";
import { VideoType } from "../enums/video-type";
import { ConfigUtil } from "../../utils/config-util";

export class MatchVideoEntryFormData {
  readonly id: string | undefined;
  readonly url: string;
  readonly type: number;
  readonly date: Date;
  readonly language: string;
  readonly validation: MatchVideoEntryFormValidation;

  private constructor(
    id: string | undefined,
    url: string,
    type: number,
    date: Date,
    language: string,
    validation: MatchVideoEntryFormValidation
  ) {
    this.id = id;
    this.url = url;
    this.type = type;
    this.date = date;
    this.language = language;
    this.validation = validation;
  }

  static create(): MatchVideoEntryFormData {
    return new MatchVideoEntryFormData(
      undefined,
      "",
      VideoType.UNKNOWN,
      new Date(),
      ConfigUtil.defaultLanguage(),
      MatchVideoEntryFormValidation.create()
    );
  }

  static fromData(
    language: string,
    entry: VideoEntryDataPayload,
    enums: EnumList
  ): MatchVideoEntryFormData | undefined {
    if (
      entry.id === undefined ||
      entry.url === undefined ||
      entry.type === undefined ||
      entry.date === undefined
    ) {
      return undefined;
    }
    const date = DateUtil.iso8601StringToDate(entry.date);
    if (date === undefined) {
      return undefined;
    }
    const validation = MatchVideoEntryFormValidation.fromData(
      language,
      entry,
      enums
    );
    return new MatchVideoEntryFormData(
      entry.id,
      entry.url,
      entry.type,
      date,
      language,
      validation
    );
  }

  withId(id: string): MatchVideoEntryFormData {
    return this.copy({ id: id });
  }

  withUrl(url: string): MatchVideoEntryFormData {
    return this.copy({ url: url, validation: this.validation.withUrl(url) });
  }

  withType(type: number): MatchVideoEntryFormData {
    return this.copy({
      type: type,
      validation: this.validation.withType(type),
    });
  }

  withDate(date: Date): MatchVideoEntryFormData {
    return this.copy({
      date: date,
      validation: this.validation.withDate(date),
    });
  }

  withLanguage(language: string, enums: EnumList): MatchVideoEntryFormData {
    return this.copy({
      language: language,
      validation: this.validation.withLanguage(language, enums),
    });
  }

  validated(enums: EnumList): MatchVideoEntryFormData {
    return this.copy({
      validation: this.validation
        .withUrl(this.url)
        .withType(this.type)
        .withDate(this.date)
        .withLanguage(this.language, enums)
        .validated(),
    });
  }

  videoEntryDataPayload(): VideoEntryDataPayload {
    return {
      id: this.id,
      date: DateUtil.formatIso8601(this.date),
      url: this.url,
      type: this.type,
    };
  }

  private copy(
    values: Partial<MatchVideoEntryFormData>
  ): MatchVideoEntryFormData {
    return new MatchVideoEntryFormData(
      DataTransformUtil.getOrElseOpt(values.id, this.id),
      DataTransformUtil.getOrElse(values.url, this.url),
      DataTransformUtil.getOrElse(values.type, this.type),
      DataTransformUtil.getOrElse(values.date, this.date),
      DataTransformUtil.getOrElse(values.language, this.language),
      DataTransformUtil.getOrElse(values.validation, this.validation)
    );
  }
}
