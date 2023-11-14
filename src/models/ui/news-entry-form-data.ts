import { NewsMedium } from "../news/news-medium";
import { NewsTag } from "../news/news-tag";
import { NewsEntryFormValidation } from "./news-entry-form-validation";
import { EnumList } from "../common/enum-list";
import { NewsEntryDataPayload } from "../news/news-entry-data-payload";
import { DataTransformUtil } from "../../utils/data-transform-util";

export class NewsEntryFormData {
  readonly id: number | undefined;
  readonly newsId: string;
  readonly providerId: number;
  readonly sportId: number;
  readonly pinned: boolean;
  readonly published: boolean;
  readonly publishedAt: string;
  readonly sortId: string;
  readonly seoUrl: string;
  readonly externalLink: string;
  readonly order: number;
  readonly feedId: number;
  readonly authorId: number;
  readonly title: string;
  readonly description: string;
  readonly article: string;
  readonly author: string;
  readonly images: Array<NewsMedium>;
  readonly audios: Array<NewsMedium>;
  readonly videos: Array<NewsMedium>;
  readonly stageTags: Array<[string, NewsTag]>;
  readonly participantTags: Array<[string, NewsTag]>;
  readonly languageId: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  readonly validation: NewsEntryFormValidation;

  private constructor(
    id: number | undefined,
    newsId: string,
    providerId: number,
    sportId: number,
    pinned: boolean,
    published: boolean,
    publishedAt: string,
    sortId: string,
    seoUrl: string,
    externalLink: string,
    order: number,
    feedId: number,
    authorId: number,
    title: string,
    description: string,
    article: string,
    author: string,
    images: Array<NewsMedium>,
    audios: Array<NewsMedium>,
    videos: Array<NewsMedium>,
    stageTags: Array<[string, NewsTag]>,
    participantTags: Array<[string, NewsTag]>,
    languageId: string,
    createdAt: string,
    updatedAt: string,
    validation: NewsEntryFormValidation
  ) {
    this.id = id;
    this.newsId = newsId;
    this.providerId = providerId;
    this.sportId = sportId;
    this.pinned = pinned;
    this.published = published;
    this.publishedAt = publishedAt;
    this.sortId = sortId;
    this.seoUrl = seoUrl;
    this.externalLink = externalLink;
    this.order = order;
    this.feedId = feedId;
    this.authorId = authorId;
    this.title = title;
    this.description = description;
    this.article = article;
    this.author = author;
    this.images = images;
    this.audios = audios;
    this.videos = videos;
    this.stageTags = stageTags;
    this.participantTags = participantTags;
    this.languageId = languageId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.validation = validation;
  }

  static create(): NewsEntryFormData {
    return new NewsEntryFormData(
      undefined,
      "",
      0,
      0,
      false,
      false,
      "",
      "",
      "",
      "",
      0,
      0,
      0,
      "",
      "",
      "",
      "",
      [],
      [],
      [],
      [],
      [],
      "UNKNOWN_LANGUAGE",
      "",
      "",
      NewsEntryFormValidation.create()
    );
  }

  static from(data: NewsEntryDataPayload, enums: EnumList): NewsEntryFormData {
    return new NewsEntryFormData(
      data.ID,
      data.NewsID || "",
      data.Provider || 0,
      data.Sport || 0,
      data.Pinned === true,
      data.Published === true,
      data.PublishedAt || "",
      data.SortID || "",
      data.SeoURL || "",
      data.ExternalLink || "",
      data.Order || 0,
      data.FeedID || 0,
      data.AuthorID || 0,
      data.Title || "",
      data.Description || "",
      data.Article || "",
      data.Author || "",
      data.Images || [],
      data.Audios || [],
      data.Videos || [],
      DataTransformUtil.parseNewsTags(data.StageTags),
      DataTransformUtil.parseNewsTags(data.ParticipantTags),
      data.Language || "UNKNOWN_LANGUAGE",
      data.CreatedAt || "",
      data.UpdatedAt || "",
      NewsEntryFormValidation.from(data, enums)
    );
  }

  withId(id: number): NewsEntryFormData {
    return this.copyWith({ id: id });
  }

  withNewsId(newsId: string): NewsEntryFormData {
    return this.copyWith({
      newsId: newsId,
      validation: this.validation.withNewsId(newsId),
    });
  }

  withProviderId(providerId: number, enums: EnumList): NewsEntryFormData {
    return this.copyWith({
      providerId: providerId,
      validation: this.validation.withProviderId(providerId, enums),
    });
  }

  withSportId(sportId: number, enums: EnumList): NewsEntryFormData {
    return this.copyWith({
      sportId: sportId,
      validation: this.validation.withSportId(sportId, enums),
    });
  }

  withPinned(pinned: boolean): NewsEntryFormData {
    return this.copyWith({ pinned: pinned });
  }

  withPublished(published: boolean): NewsEntryFormData {
    return this.copyWith({ published: published });
  }

  withSortId(sortId: string): NewsEntryFormData {
    return this.copyWith({
      sortId: sortId,
      validation: this.validation.withSortId(sortId),
    });
  }

  withSeoUrl(seoUrl: string): NewsEntryFormData {
    return this.copyWith({
      seoUrl: seoUrl,
      validation: this.validation.withSeoUrl(seoUrl),
    });
  }

  withExternalLink(externalLink: string): NewsEntryFormData {
    return this.copyWith({
      externalLink: externalLink,
      validation: this.validation.withArticleAndExternalLink(
        this.article,
        externalLink
      ),
    });
  }

  withOrder(order: number): NewsEntryFormData {
    return this.copyWith({
      order: order,
      validation: this.validation.withOrder(order),
    });
  }

  withFeedId(feedId: number): NewsEntryFormData {
    return this.copyWith({
      feedId: feedId,
      validation: this.validation.withFeedId(feedId),
    });
  }

  withAuthorId(authorId: number): NewsEntryFormData {
    return this.copyWith({
      authorId: authorId,
      validation: this.validation.withAuthorId(authorId),
    });
  }

  withTitle(title: string): NewsEntryFormData {
    return this.copyWith({
      title: title,
      validation: this.validation.withTitle(title),
    });
  }

  withDescription(description: string): NewsEntryFormData {
    return this.copyWith({
      description: description,
      validation: this.validation.withDescription(description),
    });
  }

  withArticle(article: string): NewsEntryFormData {
    return this.copyWith({
      article: article,
      validation: this.validation.withArticleAndExternalLink(
        article,
        this.externalLink
      ),
    });
  }

  withAuthor(author: string): NewsEntryFormData {
    return this.copyWith({
      author: author,
      validation: this.validation.withAuthor(author),
    });
  }

  withImages(images: Array<NewsMedium>): NewsEntryFormData {
    return this.copyWith({
      images: images,
      validation: this.validation.withImages(images),
    });
  }

  addImage(image: NewsMedium): NewsEntryFormData {
    const newImages = Array.from(this.images);
    newImages.push(image);
    return this.withImages(newImages);
  }

  removeImage(index: number): NewsEntryFormData {
    if (index < 0 || index > this.images.length) {
      return this;
    }
    const newImages = Array.from(this.images);
    newImages.splice(index, 1);
    return this.withImages(newImages);
  }

  withAudios(audios: Array<NewsMedium>): NewsEntryFormData {
    return this.copyWith({
      audios: audios,
      validation: this.validation.withAudios(audios),
    });
  }

  addAudio(audio: NewsMedium): NewsEntryFormData {
    const newAudios = Array.from(this.audios);
    newAudios.push(audio);
    return this.withAudios(newAudios);
  }

  removeAudio(index: number): NewsEntryFormData {
    if (index < 0 || index > this.audios.length) {
      return this;
    }
    const newAudios = Array.from(this.audios);
    newAudios.splice(index, 1);
    return this.withAudios(newAudios);
  }

  withVideos(videos: Array<NewsMedium>): NewsEntryFormData {
    return this.copyWith({
      videos: videos,
      validation: this.validation.withVideos(videos),
    });
  }

  addVideo(video: NewsMedium): NewsEntryFormData {
    const newVideos = Array.from(this.videos);
    newVideos.push(video);
    return this.withVideos(newVideos);
  }

  removeVideo(index: number): NewsEntryFormData {
    if (index < 0 || index > this.videos.length) {
      return this;
    }
    const newVideos = Array.from(this.videos);
    newVideos.splice(index, 1);
    return this.withVideos(newVideos);
  }

  withStageTags(stageTags: Array<[string, NewsTag]>): NewsEntryFormData {
    return this.copyWith({
      stageTags: stageTags,
      validation: this.validation.withStageTags(stageTags),
    });
  }

  addStageTag(key: string, stageTag: NewsTag): NewsEntryFormData {
    const newStageTags = Array.from(this.stageTags);
    newStageTags.push([key, stageTag]);
    return this.withStageTags(newStageTags);
  }

  removeStageTag(index: number): NewsEntryFormData {
    if (index < 0 || index > this.stageTags.length) {
      return this;
    }
    const newStageTags = Array.from(this.stageTags);
    newStageTags.splice(index, 1);
    return this.withStageTags(newStageTags);
  }

  withParticipantTags(
    participantTags: Array<[string, NewsTag]>
  ): NewsEntryFormData {
    return this.copyWith({
      participantTags: participantTags,
      validation: this.validation.withParticipantTags(participantTags),
    });
  }

  addParticipantTag(key: string, participantTag: NewsTag): NewsEntryFormData {
    const newParticipantTags = Array.from(this.participantTags);
    newParticipantTags.push([key, participantTag]);
    return this.withParticipantTags(newParticipantTags);
  }

  removeParticipantTag(index: number): NewsEntryFormData {
    if (index < 0 || index > this.participantTags.length) {
      return this;
    }
    const newParticipantTags = Array.from(this.participantTags);
    newParticipantTags.splice(index, 1);
    return this.withParticipantTags(newParticipantTags);
  }

  withLanguageId(languageId: string, enums: EnumList): NewsEntryFormData {
    return this.copyWith({
      languageId: languageId,
      validation: this.validation.withLanguage(languageId, enums),
    });
  }

  withCreatedAt(createdAt: string): NewsEntryFormData {
    return this.copyWith({ createdAt: createdAt });
  }

  withUpdatedAt(updatedAt: string): NewsEntryFormData {
    return this.copyWith({ updatedAt: updatedAt });
  }

  validated(): NewsEntryFormData {
    return this.copyWith({ validation: this.validation.validated() });
  }

  dataPayload(): NewsEntryDataPayload {
    return {
      ID: this.id,
      NewsID: this.newsId,
      Provider: this.providerId,
      Sport: this.sportId,
      Pinned: this.pinned,
      Published: this.published,
      PublishedAt: this.publishedAt,
      SortID: this.sortId,
      SeoURL: this.seoUrl,
      ExternalLink: this.externalLink,
      Order: this.order,
      FeedID: this.feedId,
      AuthorID: this.authorId,
      Title: this.title,
      Description: this.description,
      Article: this.article,
      Author: this.author,
      Images: this.images,
      Audios: this.audios,
      Videos: this.videos,
      StageTags: DataTransformUtil.serializeNewsTags(this.stageTags),
      ParticipantTags: DataTransformUtil.serializeNewsTags(
        this.participantTags
      ),
      Language: this.languageId,
      CreatedAt: this.createdAt,
      UpdatedAt: this.updatedAt,
    };
  }

  private copyWith(values: Partial<NewsEntryFormData>): NewsEntryFormData {
    const valueOrElse = <T>(value: T | undefined, fallbackValue: T): T => {
      return value !== undefined ? value : fallbackValue;
    };
    return new NewsEntryFormData(
      values.id || this.id,
      valueOrElse(values.newsId, this.newsId),
      valueOrElse(values.providerId, this.providerId),
      valueOrElse(values.sportId, this.sportId),
      valueOrElse(values.pinned, this.pinned),
      valueOrElse(values.published, this.published),
      valueOrElse(values.publishedAt, this.publishedAt),
      valueOrElse(values.sortId, this.sortId),
      valueOrElse(values.seoUrl, this.seoUrl),
      valueOrElse(values.externalLink, this.externalLink),
      valueOrElse(values.order, this.order),
      valueOrElse(values.feedId, this.feedId),
      valueOrElse(values.authorId, this.authorId),
      valueOrElse(values.title, this.title),
      valueOrElse(values.description, this.description),
      valueOrElse(values.article, this.article),
      valueOrElse(values.author, this.author),
      valueOrElse(values.images, this.images),
      valueOrElse(values.audios, this.audios),
      valueOrElse(values.videos, this.videos),
      valueOrElse(values.stageTags, this.stageTags),
      valueOrElse(values.participantTags, this.participantTags),
      valueOrElse(values.languageId, this.languageId),
      valueOrElse(values.createdAt, this.createdAt),
      valueOrElse(values.updatedAt, this.updatedAt),
      valueOrElse(values.validation, this.validation)
    );
  }
}
