import { ProviderCategory } from "../models/menu/provider-category";
import { LoadStatus } from "../models/enums/load_status";
import { ProviderCategoryCollection } from "../models/menu/provider-category-collection";
import { Provider } from "../models/enums/provider";
import { ProviderCategoryGroup } from "../models/menu/provider-category-group";
import { MappedMatch } from "../models/mapping/mapped-match";
import { MenuDataPayload } from "../models/menu/menu-data-payload";
import { MenuItem } from "../models/menu/menu-item";
import { StageDataCollection } from "../models/api-data/stage-data-collection";
import { LocEnumDataPayload } from "../models/loc-enums/loc-enum-data-payload";
import { NewsFeedDataPayload } from "../models/news/news-feed-data-payload";
import { EnumList } from "../models/common/enum-list";
import { FlowEntryDataPayload, NewsEntryDataPayload } from '../models/news/news-entry-data-payload';
import { NewsEntryListPayload } from "../models/news/news-entry-list-payload";
import { Stage } from "../models/api-data/stage";
import { MappedParticipant } from "../models/mapping/mapped-participant";
//import { default as MenuResponse } from "../config/menu-data.json";
import { MatchVideoCollectionList } from "../models/videos/match-video-collection-list";
import { MatchVideoCollection } from "../models/videos/match-video-collection";
import { Match } from "../models/api-data/match";
import { MappingVariationPayload } from "../models/mapping/mapping-variation-payload";
import { ImageResource } from "../models/ui/image-resource";
import { ImageUtil } from "../utils/image-util";
import { Login } from "../models/login/login";
import { UserPermissions } from "../models/user/user-permissions";
import { User } from "../models/user/user";

export class ApiDataLoader {
  private static readonly API_BASE_URL = "/api/v1";
  private static readonly DATA_BASE_URL = "/data/v1/en";
  private static readonly MAPPING_BASE_URL = "/mapping/v1";

  private static readonly ADMIN_BASE_URL =
    ApiDataLoader.API_BASE_URL + "/admin";

  private static readonly SPORT_MENU_BASE_URL =
    ApiDataLoader.DATA_BASE_URL + "/categories/";
  private static readonly ALL_PROVIDER_STAGES_BASE_URL =
    ApiDataLoader.DATA_BASE_URL + "/providers/categories/";
  private static readonly PROVIDER_STAGES_BASE_URL =
    ApiDataLoader.DATA_BASE_URL + "/categories/";
  private static readonly DATA_SEARCH_BASE_URL =
    ApiDataLoader.DATA_BASE_URL + "/search/";

  private static readonly MAPPED_DATE_BASE_URL =
    ApiDataLoader.MAPPING_BASE_URL + "/date/mapped";

  private static readonly MAPPED_PARTICIPANTS_BASE_URL =
    ApiDataLoader.MAPPING_BASE_URL + "/participants";

  private static readonly IMAGE_BASE_URL =
    ApiDataLoader.ADMIN_BASE_URL + "/image";
  private static readonly IMAGES_LOAD_URL =
    ApiDataLoader.ADMIN_BASE_URL + "/images";

  private static readonly ENUMS_LOAD_URL =
    ApiDataLoader.API_BASE_URL + "/enums";
  private static readonly MENU_BASE_URL =
    ApiDataLoader.ADMIN_BASE_URL + "/menu";
  private static readonly MENU_LIST_URL =
    ApiDataLoader.ADMIN_BASE_URL + "/menus";

  private static readonly LOC_ENUM_BASE_URL =
    ApiDataLoader.ADMIN_BASE_URL + "/loc-enum";
  private static readonly LOC_ENUM_LIST_URL =
    ApiDataLoader.ADMIN_BASE_URL + "/loc-enums";

  private static readonly NEWS_FEED_BASE_URL =
    ApiDataLoader.API_BASE_URL + "/news/admin/feed";
  private static readonly NEWS_FEED_LIST_URL =
    ApiDataLoader.API_BASE_URL + "/news/admin/feeds";

  private static readonly NEWS_ENTRY_BASE_URL =
    ApiDataLoader.API_BASE_URL + "/news/admin/entry";
  private static readonly NEWS_ENTRY_LIST_URL =
    ApiDataLoader.API_BASE_URL + "/news/admin/entries";
  private static readonly FLOW_NEWS_LIST_URL =
    ApiDataLoader.API_BASE_URL + "/flow/news/";

  private static readonly ALL_MENU_ENTRIES_BASE_URL =
    ApiDataLoader.ADMIN_BASE_URL + "/menus/entries/";

  private static readonly PUBLISH_MENUS =
    ApiDataLoader.ADMIN_BASE_URL + "/apis/menu/refresh";

  private static readonly PULL_PROVIDER_STAGE =
    ApiDataLoader.ADMIN_BASE_URL + "/apis/data/pull/stage"; // + /:provider/:id

  //v1/en/categories/soccer/0
  private static readonly CATEGORIES_BASE_URL =
    ApiDataLoader.DATA_BASE_URL + "/categories/";
  private static readonly STAGE_DETAIL_BASE_URL =
    ApiDataLoader.DATA_BASE_URL + "/stage/";
  private static readonly STAGE_DRAW_BASE_URL =
    ApiDataLoader.STAGE_DETAIL_BASE_URL + "draw/";
  private static readonly STAGE_TEAM_STATS_BASE_URL =
    ApiDataLoader.STAGE_DETAIL_BASE_URL + "part/stats/";
  private static readonly MATCHES_BASE_URL =
    ApiDataLoader.DATA_BASE_URL + "/matches/";
  private static readonly MATCH_FULL_BASE_URL =
    ApiDataLoader.DATA_BASE_URL + "/match/";

  private static MATCH_VIDEO_FEED_BASE_URL =
    ApiDataLoader.ADMIN_BASE_URL + "/video";
  private static MATCH_VIDEO_FEED_LIST_URL =
    ApiDataLoader.MATCH_VIDEO_FEED_BASE_URL + "s";

  private static MAPPING_SEARCH_MATCHES_BASE_URL =
    ApiDataLoader.MAPPING_BASE_URL + "/matches/";
  private static MAPPING_SEARCH_PARTICIPANTS_BASE_URL =
    ApiDataLoader.MAPPING_BASE_URL + "/participants/";
  private static MAPPING_VARIATION_URL =
    ApiDataLoader.MAPPING_BASE_URL + "/variation";

  private static MAPPING_UNMAPPED_MATCHES_URL =
    ApiDataLoader.MAPPING_BASE_URL + "/matches/unmapped";

  private static LOGIN_URL = ApiDataLoader.ADMIN_BASE_URL + "/login";
  private static LOGGED_IN_URL = ApiDataLoader.ADMIN_BASE_URL + "/loggedin";
  private static PERMISSIONS_URL =
    ApiDataLoader.ADMIN_BASE_URL + "/permissions";
  private static LOGOUT_URL = ApiDataLoader.ADMIN_BASE_URL + "/logout";

  private static USER_BASE_URL = ApiDataLoader.ADMIN_BASE_URL + "/user";
  private static USER_LIST_URL = ApiDataLoader.ADMIN_BASE_URL + "/users";
  private static USER_CHANGE_PASSWORD =
    ApiDataLoader.USER_BASE_URL + "/changepassword";

  static readonly shared: ApiDataLoader = new ApiDataLoader();

  loadMenu(
    id: number,
    callback: (
      status: number,
      data?: MenuDataPayload,
      enums?: EnumList,
      message?: string
    ) => void
  ): void {
    const url = ApiDataLoader.MENU_BASE_URL + "/" + id;
    this.loadWithEnums(url, callback);
  }

  loadMenuList(
    callback: (
      status: number,
      data?: Array<MenuDataPayload>,
      message?: string
    ) => void
  ): void {
    this.load(ApiDataLoader.MENU_LIST_URL, callback);
  }

  saveMenu(
    menuData: MenuDataPayload,
    idsToPull: Map<number, Set<string>> | undefined,
    callback: (status: number, data?: MenuDataPayload, message?: string) => void
  ): void {
    const method = menuData.id === undefined ? "POST" : "PUT";
    this.save(
      method,
      ApiDataLoader.MENU_BASE_URL,
      menuData,
      idsToPull,
      callback
    );
  }

  loadLocEnum(
    id: number,
    callback: (
      status: number,
      data?: LocEnumDataPayload,
      message?: string
    ) => void
  ): void {
    const url = ApiDataLoader.LOC_ENUM_BASE_URL + "/" + id;
    this.load(url, callback);
  }

  loadLocEnumList(
    callback: (
      status: number,
      data?: Array<LocEnumDataPayload>,
      message?: string
    ) => void
  ): void {
    this.load(ApiDataLoader.LOC_ENUM_LIST_URL, callback);
  }

  saveLocEnum(
    locEnumData: LocEnumDataPayload,
    callback: (
      status: number,
      data?: LocEnumDataPayload,
      message?: string
    ) => void
  ): void {
    const method = locEnumData.id === undefined ? "POST" : "PUT";
    this.save(
      method,
      ApiDataLoader.LOC_ENUM_BASE_URL,
      locEnumData,
      undefined,
      callback
    );
  }

  loadNewsFeed(
    id: number,
    callback: (
      status: number,
      data?: NewsFeedDataPayload,
      message?: string
    ) => void
  ): void {
    const url = ApiDataLoader.NEWS_FEED_BASE_URL + "/" + id;
    this.load(url, callback);
  }

  loadNewsFeedList(
    callback: (
      status: number,
      data?: Array<NewsFeedDataPayload>,
      enums?: EnumList,
      message?: string
    ) => void
  ): void {
    const newsFeedPromise = fetch(ApiDataLoader.NEWS_FEED_LIST_URL).then(
      (response) => {
        if (response.status !== 200) {
          throw new Error("Received error status code: " + response.status);
        }
        return response.json();
      }
    );
    const enumsPromise = fetch(ApiDataLoader.ENUMS_LOAD_URL).then(
      (response) => {
        if (response.status !== 200) {
          throw new Error("Received error status code: " + response.status);
        }
        return response.json();
      }
    );

    Promise.all([newsFeedPromise, enumsPromise])
      .then((data) => {
        callback(LoadStatus.SUCCESS, data[0], EnumList.fromData(data[1]));
      })
      .catch((error) => {
        if (error === "unauthenticated") {
          callback(LoadStatus.UNAUTHENTICATED);
        } else if (error === "unauthorized") {
          callback(LoadStatus.UNAUTHORIZED);
        } else {
          callback(LoadStatus.FAILURE);
        }
      });
  }

  saveNewsFeed(
    newsFeedData: NewsFeedDataPayload,
    callback: (
      status: number,
      data?: NewsFeedDataPayload,
      message?: string
    ) => void
  ): void {
    const method = newsFeedData.ID === undefined ? "POST" : "PUT";
    this.save(
      method,
      ApiDataLoader.NEWS_FEED_BASE_URL,
      newsFeedData,
      undefined,
      callback
    );
  }

  loadNewsEntry(
    id: number,
    callback: (
      status: number,
      data?: NewsEntryDataPayload,
      enums?: EnumList,
      message?: string
    ) => void
  ): void {
    const url = ApiDataLoader.NEWS_ENTRY_BASE_URL + "/" + id;
    const newsEntryPromise = fetch(url).then((response) => {
      if (response.status !== 200) {
        throw new Error("Received error status code: " + response.status);
      }
      return response.json();
    });
    const enumsPromise = fetch(ApiDataLoader.ENUMS_LOAD_URL).then(
      (response) => {
        if (response.status !== 200) {
          throw new Error("Received error status code: " + response.status);
        }
        return response.json();
      }
    );

    Promise.all([newsEntryPromise, enumsPromise])
      .then((data) => {
        callback(LoadStatus.SUCCESS, data[0], EnumList.fromData(data[1]));
      })
      .catch((error) => {
        if (error === "unauthenticated") {
          callback(LoadStatus.UNAUTHENTICATED);
        } else if (error === "unauthorized") {
          callback(LoadStatus.UNAUTHORIZED);
        } else {
          callback(LoadStatus.FAILURE);
        }
      });
  }

  loadNewsEntryList(
    sport: number,
    limit: number,
    offset: number,
    provider: number | undefined,
    language: number | undefined,
    title: string | undefined,
    callback: (
      status: number,
      data?: NewsEntryListPayload,
      message?: string
    ) => void
  ): void {
    let url =
      ApiDataLoader.NEWS_ENTRY_LIST_URL +
      `?sport=${sport}&limit=${limit}&offset=${offset}`;
    if (provider !== undefined) {
      url += "&provider=" + provider;
    }
    if (language !== undefined) {
      url += "&language=" + language;
    }
    if (title !== undefined) {
      url += "&title=" + encodeURIComponent(title);
    }
    this.load(url, callback);
  }
  loadFlowNewsList(
      sport: number,
      language: number | undefined,
      limit: number,
      provider: number | undefined,
      title: string | undefined,
      offset: number,
      callback: (
          status: number,
          data?: FlowEntryDataPayload[],
          message?: string
      ) => void
  ): void {
    let url = ApiDataLoader.FLOW_NEWS_LIST_URL + `en/1`;
    this.load(url, callback);
  }

  saveNewsEntry(
    newsEntryData: NewsEntryDataPayload,
    callback: (
      status: number,
      data?: NewsEntryDataPayload,
      message?: string
    ) => void
  ): void {
    const method = newsEntryData.ID === undefined ? "POST" : "PUT";
    this.save(
      method,
      ApiDataLoader.NEWS_ENTRY_BASE_URL,
      newsEntryData,
      undefined,
      callback
    );
  }

  loadVideoCollectionList(
    callback: (
      status: number,
      data?: MatchVideoCollectionList,
      enums?: EnumList,
      message?: string
    ) => void
  ): void {
    const url = ApiDataLoader.MATCH_VIDEO_FEED_LIST_URL;
    const videosPromise = fetch(url).then((response) => {
      if (response.status !== 200) {
        throw new Error("Received error status code: " + response.status);
      }
      return response.json();
    });
    const enumsPromise = fetch(ApiDataLoader.ENUMS_LOAD_URL).then(
      (response) => {
        if (response.status !== 200) {
          throw new Error("Received error status code: " + response.status);
        }
        return response.json();
      }
    );

    Promise.all([videosPromise, enumsPromise])
      .then((data) => {
        callback(
          LoadStatus.SUCCESS,
          MatchVideoCollectionList.fromData(data[0]),
          EnumList.fromData(data[1])
        );
      })
      .catch((error) => {
        if (error === "unauthenticated") {
          callback(LoadStatus.UNAUTHENTICATED);
        } else if (error === "unauthorized") {
          callback(LoadStatus.UNAUTHORIZED);
        } else {
          callback(LoadStatus.FAILURE);
        }
      });
  }

  loadVideoCollection(
    internalEventId: string,
    callback: (
      status: number,
      data?: MatchVideoCollection[],
      enums?: EnumList,
      message?: string
    ) => void
  ): void {
    const enumsUrl = ApiDataLoader.ENUMS_LOAD_URL;
    const baseUrl =
      ApiDataLoader.MATCH_VIDEO_FEED_BASE_URL + "/" + internalEventId + "/";
    fetch(enumsUrl)
      .then((response) => {
        if (response.status === 401) {
          return Promise.reject("unauthenticated");
        }
        if (response.status === 403) {
          return Promise.reject("unauthorized");
        }
        if (response.status >= 400) {
          return Promise.reject("failed to load enums");
        }
        return response.json();
      })
      .then((enumsJson) => {
        const enums = EnumList.fromData(enumsJson);
        if (enums === undefined) {
          return Promise.reject("failed to load enums");
        }
        const dataPromises = enums.getLanguages().map((language) => {
          return fetch(baseUrl + language)
            .then((response) => {
              if (response.status === 404) {
                return Promise.resolve<any | undefined>(undefined);
              }
              if (response.status === 401) {
                return Promise.reject("unauthenticated");
              }
              if (response.status === 403) {
                return Promise.reject("unauthorized");
              }
              if (response.status >= 400) {
                return Promise.reject(
                  "failed to load data for language " + language
                );
              }
              return response.json();
            })
            .then((json) => {
              if (json !== undefined) {
                return json as MatchVideoCollection;
              }
              return undefined;
            });
        });
        Promise.all(dataPromises)
          .then((data) => {
            const validData = new Array<MatchVideoCollection>();
            data.forEach((item) => {
              if (item !== undefined) {
                validData.push(item);
              }
            });
            callback(LoadStatus.SUCCESS, validData, enums);
          })
          .catch((error) => {
            if (error === "unauthenticated") {
              callback(LoadStatus.UNAUTHENTICATED, undefined, undefined, error);
            } else if (error === "unauthorized") {
              callback(LoadStatus.UNAUTHORIZED, undefined, undefined, error);
            } else {
              callback(LoadStatus.FAILURE, undefined, undefined, error);
            }
          });
      })
      .catch((error) => {
        if (error === "unauthenticated") {
          callback(LoadStatus.UNAUTHENTICATED, undefined, undefined, error);
        } else if (error === "unauthorized") {
          callback(LoadStatus.UNAUTHORIZED, undefined, undefined, error);
        } else {
          callback(LoadStatus.FAILURE, undefined, undefined, error);
        }
      });
  }

  loadSportMenu(
    sport: string,
    callback: (
      status: number,
      categories?: Array<ProviderCategory>,
      message?: string
    ) => void
  ): void {
    this.load(ApiDataLoader.SPORT_MENU_BASE_URL + sport, callback);
  }

  loadSportStages(
    sport: string,
    callback: (
      status: number,
      result?: ProviderCategoryCollection,
      message?: string
    ) => void
  ): void {
    const url = ApiDataLoader.ALL_PROVIDER_STAGES_BASE_URL + sport;
    this.load(url, (status: number, data?: Array<ProviderCategoryGroup>) => {
      callback(status, ProviderCategoryCollection.fromData(data));
    });
  }

  loadSportProviderStages(
    sport: string,
    providerId: number,
    callback: (
      status: number,
      result?: ProviderCategoryCollection,
      enums?: EnumList,
      message?: string
    ) => void
  ): void {
    const url =
      ApiDataLoader.PROVIDER_STAGES_BASE_URL +
      sport +
      "/provider/" +
      Provider.codeForProvider(providerId);
    this.loadWithEnums(
      url,
      (status, data?: any, enums?: EnumList, message?: string) => {
        callback(
          status,
          ProviderCategoryCollection.fromProviderData(
            providerId,
            data?.categories
          ),
          enums,
          message
        );
      }
    );
  }

  loadSportInternalCategories(
    sport: string,
    callback: (
      status: number,
      result?: ProviderCategoryCollection,
      message?: string
    ) => void
  ): void {
    const sportTypeSuffix = sport + "/0";
    const url = ApiDataLoader.CATEGORIES_BASE_URL + sportTypeSuffix;
    this.load(url, (status: number, data?: any, message?: string) => {
      callback(
        status,
        ProviderCategoryCollection.fromProviderData(
          Provider.INTERNAL,
          data?.categories
        )
      );
    });
  }

  loadSportInternalStageDetail(
    sport: string,
    stageId: string,
    callback: (
      status: number,
      result?: StageDataCollection,
      message?: string
    ) => void
  ): void {
    const sportStageIdSuffix = sport + "/" + stageId;
    const detailUrl = ApiDataLoader.STAGE_DETAIL_BASE_URL + sportStageIdSuffix;
    const drawUrl = ApiDataLoader.STAGE_DRAW_BASE_URL + sportStageIdSuffix;
    const teamStatsUrl =
      ApiDataLoader.STAGE_TEAM_STATS_BASE_URL + sportStageIdSuffix;

    const detailPromise = fetch(detailUrl).then((response) => {
      if (response.status !== 200) {
        throw new Error("Received error status code: " + response.status);
      }
      return response.json();
    });

    const drawPromise = fetch(drawUrl)
      .then((response) => response.json())
      .catch(() => undefined);
    const teamStatsPromise = fetch(teamStatsUrl)
      .then((response) => response.json())
      .catch(() => undefined);

    Promise.all([detailPromise, drawPromise, teamStatsPromise])
      .then((data) =>
        callback(
          LoadStatus.SUCCESS,
          StageDataCollection.fromData(data[0], data[1], data[2])
        )
      )
      .catch((error) => {
        if (error === "unauthenticated") {
          callback(LoadStatus.UNAUTHENTICATED);
        } else if (error === "unauthorized") {
          callback(LoadStatus.UNAUTHORIZED);
        } else {
          callback(LoadStatus.FAILURE);
        }
      });
  }

  loadSportInternalStages(
    sport: string,
    stageIds: string[],
    callback: (status: number, result?: Stage[], message?: string) => void,
    progress?: (index: number) => void
  ): void {
    let index = 0;
    const stages = new Array<Stage>();
    const remainingStageIds = Array.from(stageIds);
    const step = () => {
      if (progress) {
        progress(index);
      }
      index++;
      const stageId = remainingStageIds.pop();
      if (stageId === undefined) {
        callback(LoadStatus.SUCCESS, stages);
        return;
      }
      const sportStageIdSuffix = sport + "/" + stageId;
      const url = ApiDataLoader.STAGE_DETAIL_BASE_URL + sportStageIdSuffix;
      fetch(url)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error("Received error status code: " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          const stage = Stage.fromData(json);
          if (stage !== undefined) {
            stages.push(stage);
          }
          step();
        })
        .catch((error) => {
          if (error === "unauthenticated") {
            callback(LoadStatus.UNAUTHENTICATED);
          } else if (error === "unauthorized") {
            callback(LoadStatus.UNAUTHORIZED);
          } else {
            callback(LoadStatus.FAILURE);
          }
        });
    };

    step();
  }

  loadSportStageDateRange(
    sport: string,
    fromDateTime: string,
    toDateTime: string,
    callback: (status: number, data?: Stage[], message?: string) => void
  ): void {
    const url =
      ApiDataLoader.MATCHES_BASE_URL +
      sport +
      "/from/" +
      fromDateTime +
      "/to/" +
      toDateTime;
    this.load(url, (status: number, data?: any, message?: string) => {
      callback(status, Stage.listFromData(data), message);
    });
  }

  loadMappedMatches(
    sport: string,
    date: string,
    callback: (
      status: number,
      mappedMatches?: Array<MappedMatch>,
      message?: string
    ) => void
  ): void {
    const url = ApiDataLoader.MAPPED_DATE_BASE_URL + sport + "/" + date;
    this.load(url, callback);
  }

  loadMappedParticipants(
    sport: string,
    providerId: number,
    callback: (
      status: number,
      mappedParticipants?: Map<string, MappedParticipant>,
      message?: string
    ) => void
  ): void {
    const url =
      ApiDataLoader.MAPPED_PARTICIPANTS_BASE_URL +
      "/" +
      sport +
      "/" +
      providerId;
    this.load(url, (status, data, message) => {
      if (status === LoadStatus.SUCCESS && data !== undefined) {
        callback(status, MappedParticipant.mapFromData(providerId, data));
      } else {
        callback(status, undefined, message);
      }
    });
  }

  loadSearchMatchMappings(
    sport: string,
    date: string,
    query: string,
    providerId: number | undefined,
    callback: (status: number, results?: any, message?: string) => void
  ): void {
    const payload = { query: query, provider_id: providerId };
    const url =
      ApiDataLoader.MAPPING_SEARCH_MATCHES_BASE_URL + `${sport}/${date}/search`;
    this.save("POST", url, payload, undefined, callback);
  }

  loadSearchParticipantMappings(
    sport: string,
    query: string,
    providerId: number | undefined,
    callback: (status: number, results?: any, message?: string) => void
  ): void {
    const payload = { query: query, provider_id: providerId };
    const url =
      ApiDataLoader.MAPPING_SEARCH_PARTICIPANTS_BASE_URL + `${sport}/search`;
    this.save("POST", url, payload, undefined, callback);
  }

  loadUnmappedMatches(
    callback: (
      status: number,
      results?: any,
      enums?: EnumList,
      message?: string
    ) => void
  ): void {
    this.loadWithEnums(ApiDataLoader.MAPPING_UNMAPPED_MATCHES_URL, callback);
  }

  loadEnums(
    callback: (status: number, enums?: EnumList, message?: string) => void
  ): void {
    this.load(ApiDataLoader.ENUMS_LOAD_URL, (status, data, message) => {
      if (status === LoadStatus.SUCCESS && data !== undefined) {
        callback(status, EnumList.fromData(data), message);
      } else {
        callback(status, undefined, message);
      }
    });
  }

  loadAllMenuEntries(
    sportId: number,
    callback: (status: number, data?: Array<MenuItem>, message?: string) => void
  ): void {
    const url = ApiDataLoader.ALL_MENU_ENTRIES_BASE_URL + sportId + "/1";
    this.load(url, callback);
  }

  publishMenus(
    callback: (status: number, data?: any, message?: string) => void
  ): void {
    fetch(ApiDataLoader.PUBLISH_MENUS)
      .then((response) => {
        if (response.status === 401) {
          callback(LoadStatus.UNAUTHENTICATED);
        } else if (response.status === 403) {
          callback(LoadStatus.UNAUTHORIZED);
        } else if (response.status >= 400) {
          callback(LoadStatus.FAILURE);
        } else {
          callback(LoadStatus.SUCCESS);
        }
      })
      .catch(() => callback(LoadStatus.FAILURE));
  }

  pullProviderStage(
    providerId: number,
    stageId: string,
    callback: (status: number, data?: any, message?: string) => void
  ): void {
    const url =
      ApiDataLoader.PULL_PROVIDER_STAGE + "/" + providerId + "/" + stageId;
    fetch(url)
      .then((response) => {
        if (response.status === 401) {
          callback(LoadStatus.UNAUTHENTICATED);
        } else if (response.status === 403) {
          callback(LoadStatus.UNAUTHORIZED);
        } else if (response.status >= 400) {
          callback(LoadStatus.FAILURE);
        } else {
          callback(LoadStatus.SUCCESS);
        }
      })
      .catch(() => callback(LoadStatus.FAILURE));
  }

  pullDataForProviderStages(
    data: [number, string][],
    callback: (status: number, data?: any, message?: string) => void
  ): void {
    const promises = data.map(([providerId, stageId]) => {
      const url =
        ApiDataLoader.PULL_PROVIDER_STAGE + "/" + providerId + "/" + stageId;
      return fetch(url).then((response) => {
        if (response.status === 401) {
          return Promise.reject("unauthenticated");
        }
        if (response.status === 403) {
          return Promise.reject("unauthorized");
        }
        if (response.status >= 400) {
          return Promise.reject("received error status " + response.status);
        }
        return response.text();
      });
    });
    Promise.all(promises)
      .then((results) => callback(LoadStatus.SUCCESS, results))
      .catch((error) => {
        if (error === "unauthenticated") {
          callback(LoadStatus.UNAUTHENTICATED, undefined, error);
        } else if (error === "unauthorized") {
          callback(LoadStatus.UNAUTHORIZED, undefined, error);
        } else {
          callback(LoadStatus.FAILURE, undefined, error);
        }
      });
  }

  searchData(
    sport: string,
    searchString: string,
    callback: (status: number, data?: any, message?: string) => void
  ): void {
    const url =
      ApiDataLoader.DATA_SEARCH_BASE_URL + sport + "?userInput=" + searchString;
    this.load(url, callback);
  }

  loadMatch(
    sport: string,
    matchId: string,
    callback: (status: number, data?: Match, message?: string) => void
  ): void {
    fetch(ApiDataLoader.MATCH_FULL_BASE_URL + sport + "/full/" + matchId)
      .then((response) => this.handleResponsePromise<any>(response))
      .then((data) => Match.fromData(data))
      .then((match) => callback(LoadStatus.SUCCESS, match))
      .catch((error) => {
        if (error === "unauthenticated") {
          callback(LoadStatus.UNAUTHENTICATED, undefined, error);
        } else if (error === "unauthorized") {
          callback(LoadStatus.UNAUTHORIZED, undefined, error);
        } else {
          callback(LoadStatus.FAILURE, undefined, error);
        }
      });
  }

  saveVideoCollections(
    videoCollections: MatchVideoCollection[],
    callback: (
      status: number,
      data?: MatchVideoCollection[],
      message?: string
    ) => void
  ): void {
    const promises = videoCollections.map((collection) => {
      if (collection.videos.length === 0) {
        const url = `${ApiDataLoader.MATCH_VIDEO_FEED_BASE_URL}/${collection.internalEventId}/${collection.language}`;
        return this.validatedResponsePromise(
          fetch(url, { method: "DELETE", cache: "no-cache" })
        ).then((r) => r.text());
      } else {
        return this.validatedResponsePromise(
          fetch(ApiDataLoader.MATCH_VIDEO_FEED_BASE_URL, {
            method: "POST",
            cache: "no-cache",
            headers: { "Content-Type": "application-json" },
            body: JSON.stringify(collection),
          })
        ).then((r) => r.text());
      }
    });
    Promise.all(promises)
      .then((rawDataCollection) => {
        const resultCollections = new Array<MatchVideoCollection>();
        rawDataCollection.forEach((rawData) => {
          try {
            resultCollections.push(JSON.parse(rawData));
          } catch (e) {}
        });
        callback(LoadStatus.SUCCESS, resultCollections);
      })
      .catch((error) => {
        if (error === "unauthenticated") {
          callback(LoadStatus.UNAUTHENTICATED, undefined, error);
        } else if (error === "unauthorized") {
          callback(LoadStatus.UNAUTHORIZED, undefined, error);
        } else {
          callback(LoadStatus.FAILURE, undefined, error);
        }
      });
  }

  saveMappingVariation(
    payload: MappingVariationPayload,
    callback: (
      status: number,
      data?: MappingVariationPayload,
      message?: string
    ) => void
  ): void {
    this.save(
      "POST",
      ApiDataLoader.MAPPING_VARIATION_URL,
      payload,
      undefined,
      callback
    );
  }

  deleteMappingVariation(
    payload: MappingVariationPayload,
    callback: (
      status: number,
      data?: MappingVariationPayload,
      message?: string
    ) => void
  ): void {
    this.save(
      "DELETE",
      ApiDataLoader.MAPPING_VARIATION_URL,
      payload,
      undefined,
      callback
    );
  }

  uploadImageUrl(): string {
    return ApiDataLoader.IMAGE_BASE_URL;
  }

  loadImages(
    callback: (status: number, data?: ImageResource[], message?: string) => void
  ): void {
    fetch(ApiDataLoader.IMAGES_LOAD_URL)
      .then((response) => this.handleResponsePromise(response))
      .then((data: any) => {
        if (Array.isArray(data)) {
          return Promise.all(
            data
              .reverse()
              .map((fileName: string) =>
                ImageUtil.getImageSize(fileName).then((size) =>
                  ImageResource.fromFileName(fileName, size)
                )
              )
          );
        } else {
          return Promise.resolve(new Array<ImageResource>());
        }
      })
      .then((imageResources: ImageResource[]) =>
        callback(LoadStatus.SUCCESS, imageResources)
      )
      .catch((error) => {
        if (error === "unauthenticated") {
          callback(LoadStatus.UNAUTHENTICATED, undefined, error);
        } else if (error === "unauthorized") {
          callback(LoadStatus.UNAUTHORIZED, undefined, error);
        } else {
          callback(LoadStatus.FAILURE, undefined, error);
        }
      });
  }

  deleteImage(
    id: string,
    callback: (status: number, message?: string) => void
  ): void {
    const url = ApiDataLoader.IMAGE_BASE_URL + "/" + id;
    this.delete(url, (status, data, message) => callback(status, message));
  }

  logIn(
    email: string,
    password: string,
    callback: (status: number, data?: User, message?: string) => void
  ): void {
    const data: Login = { email: email, password: password };
    this.save<User>(
      "POST",
      ApiDataLoader.LOGIN_URL,
      data,
      undefined,
      (status, data, message) => {
        callback(status, data, message);
      }
    );
  }

  logOut(callback: (status: number, message?: string) => void): void {
    this.loadWithRequestInit(
      ApiDataLoader.LOGOUT_URL,
      { cache: "no-store" },
      (status, data, message) => callback(status, message)
    );
  }

  loggedIn(
    callback: (status: number, userData?: User, message?: string) => void
  ): void {
    fetch(ApiDataLoader.LOGGED_IN_URL, { cache: "no-store" }).then(
      (response) => {
        if (response.status === 401) {
          callback(LoadStatus.UNAUTHENTICATED);
        } else if (response.status === 403) {
          callback(LoadStatus.UNAUTHORIZED);
        } else if (response.status >= 400) {
          callback(LoadStatus.FAILURE);
        } else {
          response
            .json()
            .then((json) => callback(LoadStatus.SUCCESS, json))
            .catch((error) => callback(LoadStatus.FAILURE, undefined, error));
        }
      }
    );
  }

  loggedInWithPermissions(
    callback: (
      status: number,
      userData?: User,
      availablePermissions?: UserPermissions,
      message?: string
    ) => void
  ): void {
    this.loggedIn((status, userData, message) => {
      if (status !== LoadStatus.SUCCESS) {
        callback(status, userData, undefined, message);
      } else {
        fetch(ApiDataLoader.PERMISSIONS_URL)
          .then((response) => response.json())
          .then((json) => callback(LoadStatus.SUCCESS, userData, json))
          .catch((error) =>
            callback(LoadStatus.FAILURE, undefined, undefined, error)
          );
      }
    });
    /*fetch(ApiDataLoader.LOGGED_IN_URL, { cache: "no-store" })
      .then((response) => {
        if (response.status === 401) {
          callback(LoadStatus.UNAUTHENTICATED);
        } else if (response.status === 403) {
          callback(LoadStatus.UNAUTHORIZED);
        } else if (response.status >= 400) {
          callback(LoadStatus.FAILURE);
        } else {
          const userDataPromise = response.json().then((json) => json as User);
          const permissionsPromise = fetch(ApiDataLoader.PERMISSIONS_URL)
            .then((response) => response.json())
            .then((json) => json as UserPermissions);
          Promise.all([userDataPromise, permissionsPromise])
            .then(([userData, permissions]) =>
              callback(LoadStatus.SUCCESS, userData, permissions)
            )
            .catch((error) =>
              callback(LoadStatus.FAILURE, undefined, undefined, error)
            );
        }
      })
      .catch((error) =>
        callback(LoadStatus.FAILURE, undefined, undefined, error)
      );*/
  }

  loadUsers(
    callback: (status: number, data?: User[], message?: string) => void
  ): void {
    this.load<User[]>(ApiDataLoader.USER_LIST_URL, callback);
  }

  saveUser(
    user: User,
    callback: (status: number, data?: User, message?: string) => void
  ): void {
    const method = user.id !== undefined && user.id > 0 ? "PUT" : "POST";
    this.save<User>(
      method,
      ApiDataLoader.USER_BASE_URL,
      user,
      undefined,
      callback
    );
  }

  deleteUser(
    userId: number,
    callback: (status: number, message?: string) => void
  ): void {
    const url = ApiDataLoader.USER_BASE_URL + "/" + userId;
    this.delete(url, (status, data, message) => callback(status, message));
  }

  changePassword(
    user: Login,
    callback: (status: number, message?: string) => void
  ): void {
    this.save<any>(
      "POST",
      ApiDataLoader.USER_CHANGE_PASSWORD,
      user,
      undefined,
      (status, data, message) => callback(status, message)
    );
  }

  private load<T>(
    url: string,
    callback: (status: number, data?: T, message?: string) => void
  ): void {
    this.loadWithRequestInit(url, undefined, callback);
  }

  private loadWithRequestInit<T>(
    url: string,
    requestInit: RequestInit | undefined,
    callback: (status: number, data?: T, message?: string) => void
  ) {
    const fetchPromise =
      requestInit !== undefined ? fetch(url, requestInit) : fetch(url);
    fetchPromise
      .then((response) => this.handleResponse(response, callback))
      .catch((error) => {
        if (error === "unauthenticated") {
          callback(LoadStatus.UNAUTHENTICATED);
        } else if (error === "unauthorized") {
          callback(LoadStatus.UNAUTHORIZED);
        } else {
          callback(LoadStatus.FAILURE);
        }
      });
  }

  private loadWithEnums<T>(
    url: string,
    callback: (
      status: number,
      data?: T,
      enums?: EnumList,
      message?: string
    ) => void
  ): void {
    const dataPromise = fetch(url).then((response) =>
      this.handleResponsePromise(response)
    );
    const enumsPromise = fetch(ApiDataLoader.ENUMS_LOAD_URL).then(
      (response) => {
        if (response.status !== 200) {
          throw new Error("Received error status code: " + response.status);
        }
        return response.json();
      }
    );
    Promise.all([dataPromise, enumsPromise])
      .then((results) => {
        callback(LoadStatus.SUCCESS, results[0], EnumList.fromData(results[1]));
      })
      .catch((error) => {
        if (error === "unauthenticated") {
          callback(LoadStatus.UNAUTHENTICATED, undefined, undefined, error);
        } else if (error === "unauthorized") {
          callback(LoadStatus.UNAUTHORIZED, undefined, undefined, error);
        } else {
          callback(LoadStatus.FAILURE, undefined, undefined, error);
        }
      });
  }

  private save<T>(
    method: string,
    url: string,
    data: any,
    idsToPull: Map<number, Set<string>> | undefined,
    callback: (status: number, data?: T, message?: string) => void
  ): void {
    const stageUrls = new Array<string>();
    if (idsToPull) {
      idsToPull.forEach((ids, providerId) => {
        ids.forEach((stageId) => {
          stageUrls.push(
            ApiDataLoader.PULL_PROVIDER_STAGE + "/" + providerId + "/" + stageId
          );
        });
      });
    }

    let savePromise = this.validatedResponsePromise(
      fetch(url, {
        method: method,
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    );

    if (idsToPull) {
      savePromise = savePromise
        .then((response) =>
          this.validatedResponsePromise(
            fetch(ApiDataLoader.PUBLISH_MENUS)
          ).then(() => response)
        )
        .then((response) =>
          this.pullProviderStages(stageUrls).then(() => response)
        );
    }

    savePromise
      .then((response) => this.handleResponse(response, callback))
      .catch((error) => {
        if (error === "unauthenticated") {
          callback(LoadStatus.UNAUTHENTICATED);
        } else if (error === "unauthorized") {
          callback(LoadStatus.UNAUTHORIZED);
        } else {
          callback(LoadStatus.FAILURE);
        }
      });
  }

  private delete(
    url: string,
    callback: (status: number, data?: any, message?: string) => void
  ): void {
    fetch(url, {
      method: "DELETE",
      cache: "no-cache",
    }).then((response) => this.handleResponse(response, callback));
  }

  private pullProviderStages(stageUrls: string[] | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      if (stageUrls === undefined || stageUrls.length === 0) {
        resolve();
        return;
      }
      const url = stageUrls[0];
      fetch(url)
        .then((response) => {
          if (response.status === 401) {
            reject("unauthenticated");
          } else if (response.status === 403) {
            reject("unauthorized");
          } else if (response.status >= 400) {
            reject();
          } else {
            this.pullProviderStages(stageUrls.slice(1))
              .then(() => resolve())
              .catch(() => reject());
          }
        })
        .catch(() => reject());
    });
  }

  private handleResponse<T>(
    response: Response,
    callback: (status: number, data?: T, message?: string) => void
  ): void {
    if (response.status === 401) {
      callback(LoadStatus.UNAUTHENTICATED);
    } else if (response.status === 403) {
      callback(LoadStatus.UNAUTHORIZED);
    } else if (response.status >= 400) {
      response
        .text()
        .then((text) => callback(LoadStatus.FAILURE, undefined, text))
        .catch(() => callback(LoadStatus.FAILURE));
    } else {
      response
        .text()
        .then((data) => {
          if (data !== undefined && data.length > 0) {
            try {
              const json: any = JSON.parse(data);
              callback(LoadStatus.SUCCESS, json);
            } catch (e) {
              callback(LoadStatus.FAILURE);
            }
          } else {
            const json: any = {};
            callback(LoadStatus.SUCCESS, json);
          }
        })
        .catch((e) => callback(LoadStatus.FAILURE));
    }
  }

  private handleResponsePromise<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      return Promise.reject("unauthenticated");
    } else if (response.status === 403) {
      return Promise.reject("unauthorized");
    } else if (response.status >= 400) {
      return response.text().then((text) => Promise.reject(text));
    } else {
      return response.text().then((data) => {
        if (data === undefined || data.length === 0) {
          return Promise.resolve({});
        }
        try {
          const json = JSON.parse(data);
          return Promise.resolve(json);
        } catch (error) {
          return Promise.reject(error);
        }
      });
    }
  }

  private validatedResponsePromise(
    promise: Promise<Response>
  ): Promise<Response> {
    return promise.then((response) => {
      if (response.status === 401) {
        throw new Error("unauthenticated");
      } else if (response.status === 403) {
        throw new Error("unauthorized");
      } else if (response.status >= 400) {
        console.log(response);
        throw new Error(
          `response from ${response.url} has status code ${response.status}`
        );
      }
      return response;
    });
  }
}
