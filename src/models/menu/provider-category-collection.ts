import { ProviderCategory } from "./provider-category";
import { ProviderCategoryGroup } from "./provider-category-group";
import { Provider } from "../enums/provider";
import { StageMapping } from "./stage-mapping";
import { DateUtil } from "../../utils/date-util";
import { StageMappingBuilder } from "./builders/stage-mapping-builder";
import { Gender } from "../enums/gender";

export class ProviderCategoryCollection {
  readonly categories: Array<ProviderCategory>;
  readonly providers: Array<number>;

  static fromProviderData(
    providerId: number,
    data?: Array<ProviderCategory>
  ): ProviderCategoryCollection {
    return new ProviderCategoryCollection(data || [], [providerId]);
  }

  static fromData(
    data?: Array<ProviderCategoryGroup>
  ): ProviderCategoryCollection {
    const providers = new Set<number>();
    const categories = new Array<ProviderCategory>();
    if (data) {
      data.forEach((categoryGroup) => {
        const providerId = Provider.fromCode(categoryGroup.provider || "");
        if (!providerId) {
          return;
        }
        providers.add(providerId);
        if (categoryGroup.categories) {
          categoryGroup.categories.forEach((category) =>
            categories.push(category)
          );
        }
      });
    }
    return new ProviderCategoryCollection(
      categories,
      Array.from(providers).sort()
    );
  }

  static sanitizeStageId(stageId: string): string {
    const separatorIndex = stageId.indexOf("-");
    if (separatorIndex >= 0) {
      const prefixedIdRegex = new RegExp(/^[0-9]{1,2}-/);
      if (prefixedIdRegex.test(stageId)) {
        return stageId.substr(separatorIndex + 1);
      }
    }
    return stageId;
  }

  constructor(categories: Array<ProviderCategory>, providers: Array<number>) {
    this.categories = categories;
    this.providers = providers;
  }

  toStageMappings(): Array<StageMapping> {
    const startDate = DateUtil.createDate(2019, 0, 1, 0, 0, 0, 0, true);
    const endDate = DateUtil.createDate(2020, 11, 31, 23, 59, 59, 999, true);
    const defaultSeasonName =
      startDate.getUTCFullYear() + "/" + endDate.getUTCFullYear();
    const stages = new Array<StageMapping>();
    const existingStageIds = new Set<string>(); // TODO: Temporary;
    this.categories.forEach((category) =>
      category.stages?.forEach((stage) => {
        if (
          stage.st_id &&
          stage.c_name &&
          stage.st_name &&
          stage.pid !== undefined &&
          !existingStageIds.has(stage.st_id)
        ) {
          existingStageIds.add(stage.st_id);
          const mappingBuilder = StageMappingBuilder.create()
            .setStageId(ProviderCategoryCollection.sanitizeStageId(stage.st_id))
            .setProviderId(stage.pid)
            .setCategoryName(stage.c_name)
            .setStageName(stage.st_name)
            .setSeasonName(stage.season || defaultSeasonName)
            .setGender(stage.st_gender || Gender.UNKNOWN)
            .setAssignmentCount(0);

          if (
            stage.start !== undefined &&
            stage.end !== undefined &&
            stage.start > 0 &&
            stage.end > stage.start
          ) {
            mappingBuilder.setTimeRangeParts(stage.start, stage.end);
          }
          stages.push(mappingBuilder.build());
        }
      })
    );
    stages.sort((a, b) => {
      return a.fullName === b.fullName ? 0 : a.fullName < b.fullName ? -1 : 1;
    });
    return stages;
  }
}
