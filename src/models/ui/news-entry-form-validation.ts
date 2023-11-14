import { EnumList } from "../common/enum-list";
import { ValidationUtil } from "../../utils/validation-util";
import { NewsMedium } from "../news/news-medium";
import { NewsTag } from "../news/news-tag";
import { NewsEntryDataPayload } from "../news/news-entry-data-payload";
import { DataTransformUtil } from "../../utils/data-transform-util";

export class NewsEntryFormValidation {
  readonly isNewsIdValid: boolean;
  readonly isProviderIdValid: boolean;
  readonly isSportIdValid: boolean;
  readonly isPublishedAtValid: boolean;
  readonly isSortIdValid: boolean;
  readonly isSeoUrlValid: boolean;
  readonly isExternalLinkValid: boolean;
  readonly isOrderValid: boolean;
  readonly isFeedIdValid: boolean;
  readonly isAuthorIdValid: boolean;
  readonly isTitleValid: boolean;
  readonly isDescriptionValid: boolean;
  readonly isArticleValid: boolean;
  readonly isAuthorValid: boolean;
  readonly areImagesValid: boolean;
  readonly areAudiosValid: boolean;
  readonly areVideosValid: boolean;
  readonly areStageTagsValid: boolean;
  readonly areParticipantTagsValid: boolean;
  readonly isLanguageIdValid: boolean;
  readonly isValid: boolean;

  readonly newsIdErrors: Array<string>;
  readonly providerIdErrors: Array<string>;
  readonly sportIdErrors: Array<string>;
  readonly publishedAtErrors: Array<string>;
  readonly sortIdErrors: Array<string>;
  readonly seoUrlErrors: Array<string>;
  readonly articleAndExternalLinkErrors: Array<string>;
  readonly orderErrors: Array<string>;
  readonly feedIdErrors: Array<string>;
  readonly authorIdErrors: Array<string>;
  readonly titleErrors: Array<string>;
  readonly descriptionErrors: Array<string>;
  readonly authorErrors: Array<string>;
  readonly imagesErrors: Array<string>;
  readonly audiosErrors: Array<string>;
  readonly videosErrors: Array<string>;
  readonly stageTagsErrors: Array<string>;
  readonly participantTagsErrors: Array<string>;
  readonly languageIdErrors: Array<string>;

  readonly isInitial: boolean;

  private constructor(
    newsIdErrors: Array<string>,
    providerIdErrors: Array<string>,
    sportIdErrors: Array<string>,
    publishedAtErrors: Array<string>,
    sortIdErrors: Array<string>,
    seoUrlErrors: Array<string>,
    articleAndExternalLinkErrors: Array<string>,
    orderErrors: Array<string>,
    feedIdErrors: Array<string>,
    authorIdErrors: Array<string>,
    titleErrors: Array<string>,
    descriptionErrors: Array<string>,
    authorErrors: Array<string>,
    imagesErrors: Array<string>,
    audiosErrors: Array<string>,
    videosErrors: Array<string>,
    stageTagsErrors: Array<string>,
    participantTagsErrors: Array<string>,
    languageIdErrors: Array<string>,
    isInitial: boolean
  ) {
    this.isNewsIdValid = isInitial || newsIdErrors.length === 0;
    this.isProviderIdValid = isInitial || providerIdErrors.length === 0;
    this.isSportIdValid = isInitial || sportIdErrors.length === 0;
    this.isPublishedAtValid = isInitial || publishedAtErrors.length === 0;
    this.isSortIdValid = isInitial || sortIdErrors.length === 0;
    this.isSeoUrlValid = isInitial || seoUrlErrors.length === 0;
    this.isExternalLinkValid =
      isInitial || articleAndExternalLinkErrors.length === 0;
    this.isOrderValid = isInitial || orderErrors.length === 0;
    this.isFeedIdValid = isInitial || feedIdErrors.length === 0;
    this.isAuthorIdValid = isInitial || authorIdErrors.length === 0;
    this.isTitleValid = isInitial || titleErrors.length === 0;
    this.isDescriptionValid = isInitial || descriptionErrors.length === 0;
    this.isArticleValid =
      isInitial || articleAndExternalLinkErrors.length === 0;
    this.isAuthorValid = isInitial || authorErrors.length === 0;
    this.areImagesValid = isInitial || imagesErrors.length === 0;
    this.areAudiosValid = isInitial || audiosErrors.length === 0;
    this.areVideosValid = isInitial || videosErrors.length === 0;
    this.areStageTagsValid = isInitial || stageTagsErrors.length === 0;
    this.areParticipantTagsValid =
      isInitial || participantTagsErrors.length === 0;
    this.isLanguageIdValid = isInitial || languageIdErrors.length === 0;

    this.newsIdErrors = newsIdErrors;
    this.providerIdErrors = providerIdErrors;
    this.sportIdErrors = sportIdErrors;
    this.publishedAtErrors = publishedAtErrors;
    this.sortIdErrors = sortIdErrors;
    this.seoUrlErrors = seoUrlErrors;
    this.articleAndExternalLinkErrors = articleAndExternalLinkErrors;
    this.orderErrors = orderErrors;
    this.feedIdErrors = feedIdErrors;
    this.authorIdErrors = authorIdErrors;
    this.titleErrors = titleErrors;
    this.descriptionErrors = descriptionErrors;
    this.authorErrors = authorErrors;
    this.imagesErrors = imagesErrors;
    this.audiosErrors = audiosErrors;
    this.videosErrors = videosErrors;
    this.stageTagsErrors = stageTagsErrors;
    this.participantTagsErrors = participantTagsErrors;
    this.languageIdErrors = languageIdErrors;

    this.isValid =
      this.isNewsIdValid &&
      this.isProviderIdValid &&
      this.isSportIdValid &&
      this.isPublishedAtValid &&
      this.isSortIdValid &&
      this.isSeoUrlValid &&
      this.isExternalLinkValid &&
      this.isOrderValid &&
      this.isFeedIdValid &&
      this.isAuthorIdValid &&
      this.isTitleValid &&
      this.isDescriptionValid &&
      this.isArticleValid &&
      this.isAuthorValid &&
      this.areImagesValid &&
      this.areAudiosValid &&
      this.areVideosValid &&
      this.areStageTagsValid &&
      this.areParticipantTagsValid &&
      this.isLanguageIdValid;

    this.isInitial = isInitial;
  }

  private static validateSimple(
    message: string,
    rule: () => boolean
  ): Array<string> {
    if (rule()) {
      return [];
    }
    return [message];
  }

  private static validateNewsId(newsId: string): Array<string> {
    return NewsEntryFormValidation.validateSimple("news ID is empty", () => {
      return ValidationUtil.isValidUrl(newsId);
    });
  }

  private static validateSportId(
    sportId: number,
    enums: EnumList
  ): Array<string> {
    return NewsEntryFormValidation.validateSimple("sport is invalid", () => {
      return ValidationUtil.isValidSportId(sportId, enums);
    });
  }

  private static validateProviderId(
    providerId: number,
    enums: EnumList
  ): Array<string> {
    return NewsEntryFormValidation.validateSimple("provider is invalid", () => {
      return ValidationUtil.isValidProviderId(providerId, enums);
    });
  }

  private static validatePublishedAt(publishedAt: string): Array<string> {
    return NewsEntryFormValidation.validateSimple(
      "published at is not a valid date",
      () => {
        return ValidationUtil.isValidIsoDate(publishedAt);
      }
    );
  }

  private static validateSortId(sortId: string): Array<string> {
    return NewsEntryFormValidation.validateSimple("sort ID is empty", () => {
      return sortId.length > 0;
    });
  }

  private static validateSeoUrl(seoUrl: string): Array<string> {
    return NewsEntryFormValidation.validateSimple("seo url is empty", () => {
      return seoUrl.length > 0;
    });
  }

  private static validateArticleAndExternalLink(
    article: string,
    externalLink: string
  ): Array<string> {
    return NewsEntryFormValidation.validateSimple(
      "invalid article and external link",
      () => {
        return (
          (article.length > 0 && externalLink.length === 0) ||
          ValidationUtil.isValidUrl(externalLink)
        );
      }
    );
  }

  private static validateOrder(order: number): Array<string> {
    return NewsEntryFormValidation.validateSimple("order is invalid", () => {
      return order >= 0;
    });
  }

  private static validateFeedId(feedId: number): Array<string> {
    return NewsEntryFormValidation.validateSimple("feed ID is invalid", () => {
      return feedId >= 0;
    });
  }

  private static validateAuthorId(authorId: number): Array<string> {
    return NewsEntryFormValidation.validateSimple(
      "author ID is invalid",
      () => {
        return authorId >= 0;
      }
    );
  }

  private static validateTitle(title: string): Array<string> {
    return NewsEntryFormValidation.validateSimple("title is empty", () => {
      return title.length > 0;
    });
  }

  private static validateDescription(description: string): Array<string> {
    return NewsEntryFormValidation.validateSimple(
      "description is empty",
      () => {
        return description.length > 0;
      }
    );
  }

  private static validateAuthor(author: string): Array<string> {
    return NewsEntryFormValidation.validateSimple("author is invalid", () => {
      return author.length >= 0;
    });
  }

  private static validateMedia(
    media: Array<NewsMedium>,
    type: string
  ): Array<string> {
    const errors = new Array<string>();
    media.forEach((medium, index) => {
      if (medium.ID === undefined || medium.ID.length === 0) {
        errors.push(`${type} at position ${index + 1} has an empty ID`);
      }
      if (medium.URL === undefined || !ValidationUtil.isValidUrl(medium.URL)) {
        errors.push(`${type} at position ${index + 1} has an invalid URL`);
      }
    });
    return errors;
  }

  private static validateTags(
    tags: Array<[string, NewsTag]>,
    type: string
  ): Array<string> {
    const errors = new Array<string>();
    tags.forEach(([key, tag], index) => {
      if (key.length === 0) {
        errors.push(`${type} tag at position ${index + 1} has an empty key`);
      }
      if (tag.ID === undefined || tag.ID.length === 0) {
        errors.push(`${type} tag at position ${index + 1} has an empty ID`);
      }
      if (tag.Meta === undefined || tag.Meta.length === 0) {
        errors.push(`${type} tag at position ${index + 1} has empty Metadata`);
      }
    });
    return errors;
  }

  private static validateLanguageCode(
    languageCode: string,
    enums: EnumList
  ): Array<string> {
    return NewsEntryFormValidation.validateSimple("language is invalid", () => {
      return ValidationUtil.isValidLanguageCode(languageCode, enums);
    });
  }

  static create(): NewsEntryFormValidation {
    return new NewsEntryFormValidation(
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      true
    );
  }

  static from(
    data: NewsEntryDataPayload,
    enums: EnumList
  ): NewsEntryFormValidation {
    return new NewsEntryFormValidation(
      NewsEntryFormValidation.validateNewsId(data.NewsID || ""),
      NewsEntryFormValidation.validateProviderId(data.Provider || 0, enums),
      NewsEntryFormValidation.validateSportId(data.Sport || 0, enums),
      NewsEntryFormValidation.validatePublishedAt(data.PublishedAt || ""),
      NewsEntryFormValidation.validateSortId(data.SortID || ""),
      NewsEntryFormValidation.validateSeoUrl(data.SeoURL || ""),
      NewsEntryFormValidation.validateArticleAndExternalLink(
        data.Article || "",
        data.ExternalLink || ""
      ),
      NewsEntryFormValidation.validateOrder(data.Order || 0),
      NewsEntryFormValidation.validateFeedId(data.FeedID || 0),
      NewsEntryFormValidation.validateAuthorId(data.AuthorID || 0),
      NewsEntryFormValidation.validateTitle(data.Title || ""),
      NewsEntryFormValidation.validateDescription(data.Description || ""),
      NewsEntryFormValidation.validateAuthor(data.Author || ""),
      NewsEntryFormValidation.validateMedia(data.Images || [], "image"),
      NewsEntryFormValidation.validateMedia(data.Audios || [], "audio"),
      NewsEntryFormValidation.validateMedia(data.Videos || [], "video"),
      NewsEntryFormValidation.validateTags(
        DataTransformUtil.parseNewsTags(data.StageTags),
        "stage tag"
      ),
      NewsEntryFormValidation.validateTags(
        DataTransformUtil.parseNewsTags(data.ParticipantTags),
        "participant tag"
      ),
      NewsEntryFormValidation.validateLanguageCode(
        data.Language || "UNKNOWN_LANGUAGE",
        enums
      ),
      false
    );
  }

  getNewsIdErrors(): Array<string> {
    return this.isInitial ? [] : this.newsIdErrors;
  }

  getProviderIdErrors(): Array<string> {
    return this.isInitial ? [] : this.providerIdErrors;
  }

  getSportIdErrors(): Array<string> {
    return this.isInitial ? [] : this.sportIdErrors;
  }

  getPublishedAtErrors(): Array<string> {
    return this.isInitial ? [] : this.publishedAtErrors;
  }

  getSortIdErrors(): Array<string> {
    return this.isInitial ? [] : this.sortIdErrors;
  }

  getSeoUrlErrors(): Array<string> {
    return this.isInitial ? [] : this.seoUrlErrors;
  }

  getArticleAndExternalLinkErrors(): Array<string> {
    return this.isInitial ? [] : this.articleAndExternalLinkErrors;
  }

  getOrderErrors(): Array<string> {
    return this.isInitial ? [] : this.orderErrors;
  }

  getFeedIdErrors(): Array<string> {
    return this.isInitial ? [] : this.feedIdErrors;
  }

  getAuthorIdErrors(): Array<string> {
    return this.isInitial ? [] : this.authorIdErrors;
  }

  getTitleErrors(): Array<string> {
    return this.isInitial ? [] : this.titleErrors;
  }

  getDescriptionErrors(): Array<string> {
    return this.isInitial ? [] : this.descriptionErrors;
  }

  getAuthorErrors(): Array<string> {
    return this.isInitial ? [] : this.authorErrors;
  }

  getImagesErrors(): Array<string> {
    return this.isInitial ? [] : this.imagesErrors;
  }

  getAudiosErrors(): Array<string> {
    return this.isInitial ? [] : this.audiosErrors;
  }

  getVideosErrors(): Array<string> {
    return this.isInitial ? [] : this.videosErrors;
  }

  getStageTagsErrors(): Array<string> {
    return this.isInitial ? [] : this.stageTagsErrors;
  }

  getParticipantTagsErrors(): Array<string> {
    return this.isInitial ? [] : this.participantTagsErrors;
  }

  getLanguageErrors(): Array<string> {
    return this.isInitial ? [] : this.languageIdErrors;
  }

  getMediaErrors(): Array<string> {
    return this.isInitial
      ? []
      : [...this.imagesErrors, ...this.videosErrors, ...this.audiosErrors];
  }

  getTagsErrors(): Array<string> {
    return this.isInitial
      ? []
      : [...this.stageTagsErrors, ...this.participantTagsErrors];
  }

  withNewsId(newsId: string): NewsEntryFormValidation {
    return this.copy({
      newsIdErrors: NewsEntryFormValidation.validateNewsId(newsId),
    });
  }

  withProviderId(providerId: number, enums: EnumList): NewsEntryFormValidation {
    return this.copy({
      providerIdErrors: NewsEntryFormValidation.validateProviderId(
        providerId,
        enums
      ),
    });
  }

  withSportId(sportId: number, enums: EnumList): NewsEntryFormValidation {
    return this.copy({
      sportIdErrors: NewsEntryFormValidation.validateSportId(sportId, enums),
    });
  }

  withPublishedAt(publishedAt: string): NewsEntryFormValidation {
    return this.copy({
      publishedAtErrors: NewsEntryFormValidation.validatePublishedAt(
        publishedAt
      ),
    });
  }

  withSortId(sortId: string): NewsEntryFormValidation {
    return this.copy({
      sortIdErrors: NewsEntryFormValidation.validateSortId(sortId),
    });
  }

  withSeoUrl(seoUrl: string): NewsEntryFormValidation {
    return this.copy({
      seoUrlErrors: NewsEntryFormValidation.validateSeoUrl(seoUrl),
    });
  }

  withArticleAndExternalLink(
    article: string,
    externalLink: string
  ): NewsEntryFormValidation {
    return this.copy({
      articleAndExternalLinkErrors: NewsEntryFormValidation.validateArticleAndExternalLink(
        article,
        externalLink
      ),
    });
  }

  withOrder(order: number): NewsEntryFormValidation {
    return this.copy({
      orderErrors: NewsEntryFormValidation.validateOrder(order),
    });
  }

  withFeedId(feedId: number): NewsEntryFormValidation {
    return this.copy({
      feedIdErrors: NewsEntryFormValidation.validateFeedId(feedId),
    });
  }

  withAuthorId(authorId: number): NewsEntryFormValidation {
    return this.copy({
      authorIdErrors: NewsEntryFormValidation.validateAuthorId(authorId),
    });
  }

  withTitle(title: string): NewsEntryFormValidation {
    return this.copy({
      titleErrors: NewsEntryFormValidation.validateTitle(title),
    });
  }

  withDescription(description: string): NewsEntryFormValidation {
    return this.copy({
      descriptionErrors: NewsEntryFormValidation.validateDescription(
        description
      ),
    });
  }

  withAuthor(author: string): NewsEntryFormValidation {
    return this.copy({
      authorErrors: NewsEntryFormValidation.validateAuthor(author),
    });
  }

  withImages(images: Array<NewsMedium>): NewsEntryFormValidation {
    return this.copy({
      imagesErrors: NewsEntryFormValidation.validateMedia(images, "image"),
    });
  }

  withAudios(audios: Array<NewsMedium>): NewsEntryFormValidation {
    return this.copy({
      audiosErrors: NewsEntryFormValidation.validateMedia(audios, "audio"),
    });
  }

  withVideos(videos: Array<NewsMedium>): NewsEntryFormValidation {
    return this.copy({
      videosErrors: NewsEntryFormValidation.validateMedia(videos, "video"),
    });
  }

  withStageTags(stageTags: Array<[string, NewsTag]>): NewsEntryFormValidation {
    return this.copy({
      stageTagsErrors: NewsEntryFormValidation.validateTags(
        stageTags,
        "stage tag"
      ),
    });
  }

  withParticipantTags(
    participantTags: Array<[string, NewsTag]>
  ): NewsEntryFormValidation {
    return this.copy({
      participantTagsErrors: NewsEntryFormValidation.validateTags(
        participantTags,
        "participant tag"
      ),
    });
  }

  withLanguage(language: string, enums: EnumList): NewsEntryFormValidation {
    return this.copy({
      languageIdErrors: NewsEntryFormValidation.validateLanguageCode(
        language,
        enums
      ),
    });
  }

  validated(): NewsEntryFormValidation {
    if (this.isInitial) {
      return this.copy({ isInitial: false });
    }
    return this;
  }

  private copy(
    values: Partial<NewsEntryFormValidation>
  ): NewsEntryFormValidation {
    const valueOrElse = <T>(value: T | undefined, fallbackValue: T): T => {
      return value !== undefined ? value : fallbackValue;
    };
    return new NewsEntryFormValidation(
      valueOrElse(values.newsIdErrors, this.newsIdErrors),
      valueOrElse(values.providerIdErrors, this.providerIdErrors),
      valueOrElse(values.sportIdErrors, this.sportIdErrors),
      valueOrElse(values.publishedAtErrors, this.publishedAtErrors),
      valueOrElse(values.sortIdErrors, this.sortIdErrors),
      valueOrElse(values.seoUrlErrors, this.seoUrlErrors),
      valueOrElse(
        values.articleAndExternalLinkErrors,
        this.articleAndExternalLinkErrors
      ),
      valueOrElse(values.orderErrors, this.orderErrors),
      valueOrElse(values.feedIdErrors, this.feedIdErrors),
      valueOrElse(values.authorIdErrors, this.authorIdErrors),
      valueOrElse(values.titleErrors, this.titleErrors),
      valueOrElse(values.descriptionErrors, this.descriptionErrors),
      valueOrElse(values.authorErrors, this.authorErrors),
      valueOrElse(values.imagesErrors, this.imagesErrors),
      valueOrElse(values.audiosErrors, this.audiosErrors),
      valueOrElse(values.videosErrors, this.videosErrors),
      valueOrElse(values.stageTagsErrors, this.stageTagsErrors),
      valueOrElse(values.participantTagsErrors, this.participantTagsErrors),
      valueOrElse(values.languageIdErrors, this.languageIdErrors),
      false
    );
  }
}
