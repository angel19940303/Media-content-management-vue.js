import { NewsFeedDataPayload } from "../news/news-feed-data-payload";
import { NewsFeedFormValidation } from "./news-feed-form-validation";
import { EnumList } from "../common/enum-list";

export class NewsFeedFormData {
  readonly id: number | undefined;
  readonly sportId: number;
  readonly providerId: number;
  readonly languageCode: string;
  readonly url: string;
  readonly enabled: boolean;
  readonly externalLinks: boolean;
  readonly frequency: number;
  readonly source: string;
  readonly createdAt: string | undefined;

  readonly validation: NewsFeedFormValidation;

  private constructor(
    id: number | undefined,
    sportId: number,
    providerId: number,
    languageCode: string,
    url: string | undefined,
    enabled: boolean,
    externalLinks: boolean,
    frequency: number,
    source: string,
    createdAt: string | undefined,
    validation: NewsFeedFormValidation
  ) {
    this.id = id;
    this.sportId = sportId;
    this.providerId = providerId;
    this.languageCode = languageCode;
    this.url = url || "";
    this.enabled = enabled;
    this.externalLinks = externalLinks;
    this.frequency = frequency;
    this.source = source;
    this.createdAt = createdAt;
    this.validation = validation;
  }

  static fromData(data: NewsFeedDataPayload): NewsFeedFormData {
    return new NewsFeedFormData(
      data.ID,
      data.Sport,
      data.Provider,
      data.Language,
      data.URL,
      data.Enabled,
      data.ExternalLinks,
      data.FrequencyInMinutes,
      data.Source,
      data.CreatedAt,
      NewsFeedFormValidation.create()
    );
  }

  withId(id: number | undefined): NewsFeedFormData {
    return this.copy({ id: id });
  }

  withSportId(sportId: number, enums: EnumList): NewsFeedFormData {
    const validation = this.validation.withSportId(sportId, enums);
    return this.copy({ sportId: sportId, validation: validation });
  }

  withProviderId(providerId: number): NewsFeedFormData {
    return this.copy({ providerId: providerId });
  }

  withLanguageCode(languageCode: string, enums: EnumList): NewsFeedFormData {
    const validation = this.validation.withLanguageCode(languageCode, enums);
    return this.copy({ languageCode: languageCode, validation: validation });
  }

  withUrl(url: string | undefined): NewsFeedFormData {
    const validation = this.validation.withUrl(url);
    return this.copy({ url: url, validation: validation });
  }

  withEnabled(enabled: boolean): NewsFeedFormData {
    return this.copy({ enabled: enabled });
  }

  withExternalLinks(externalLinks: boolean): NewsFeedFormData {
    return this.copy({ externalLinks: externalLinks });
  }

  withFrequency(frequency: number): NewsFeedFormData {
    const validation = this.validation.withFrequency(frequency);
    return this.copy({ frequency: frequency, validation: validation });
  }

  withSource(source: string): NewsFeedFormData {
    const validation = this.validation.withSource(source);
    return this.copy({ source: source, validation: validation });
  }

  validated(enums: EnumList): NewsFeedFormData {
    const validation = this.validation
      .withUrl(this.url)
      .withFrequency(this.frequency)
      .withSportId(this.sportId, enums)
      .withLanguageCode(this.languageCode, enums)
      .withSource(this.source)
      .validated();
    return this.copy({ validation: validation });
  }

  toData(): NewsFeedDataPayload {
    return {
      ID: this.id,
      Sport: this.sportId,
      Provider: this.providerId,
      Language: this.languageCode,
      URL: this.url || "",
      Enabled: this.enabled,
      ExternalLinks: this.externalLinks,
      FrequencyInMinutes: this.frequency,
      Source: this.source,
      CreatedAt: this.createdAt,
    };
  }

  private copy(values: Partial<NewsFeedFormData>): NewsFeedFormData {
    const getNumOrElse = (value: number | undefined, fallbackValue: number) => {
      return value !== undefined ? value : fallbackValue;
    };
    const getStringOrElse = (
      value: string | undefined,
      fallbackValue: string
    ) => {
      return value !== undefined ? value : fallbackValue;
    };
    const getNumOptOrElse = (
      value: number | undefined,
      fallbackValue: number | undefined
    ) => {
      return value !== undefined ? value : fallbackValue;
    };
    const getBoolOrElse = (
      value: boolean | undefined,
      fallbackValue: boolean
    ) => {
      return value !== undefined ? value : fallbackValue;
    };
    return new NewsFeedFormData(
      getNumOptOrElse(values.id, this.id),
      getNumOrElse(values.sportId, this.sportId),
      getNumOrElse(values.providerId, this.providerId),
      values.languageCode || this.languageCode,
      getStringOrElse(values.url, this.url),
      getBoolOrElse(values.enabled, this.enabled),
      getBoolOrElse(values.externalLinks, this.externalLinks),
      getNumOrElse(values.frequency, this.frequency),
      getStringOrElse(values.source, this.source),
      values.createdAt || this.createdAt,
      values.validation || this.validation
    );
  }
}
