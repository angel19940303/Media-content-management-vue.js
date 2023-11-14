import { MenuItem } from "../menu-item";
import { ProviderCategory } from "../provider-category";
import { TextUtil } from "../../../utils/text-util";
import { MenuItemType } from "../../enums/menu-item-type";
import { ProviderStage } from "../provider-stage";
import { Gender } from "../../enums/gender";
import { IncrementalIdGenerator } from "../../common/incremental-id-generator";
import { MenuItemPayloadBuilderDefaultValues } from "./menu-item-payload-builder-default-values";
import { MenuItemPayload } from "../menu-item-payload";
import { MenuItemBuilder } from "./menu-item-builder";
import { LocaleBuilder } from "../../common/builders/locale-builder";
import { StageMappingBuilder } from "./stage-mapping-builder";
import { StageMapping } from "../stage-mapping";
import { FlagVariant } from "../../enums/flag-variant";
import { ProviderCategoryCollection } from "../provider-category-collection";
import { LocalizedSortOrderBuilder } from "./localized-sort-order-builder";
import { ConfigUtil } from "../../../utils/config-util";

export class SportMenuItemPayloadBuilder {
  private static readonly FLAG_PROVIDER_PATH = "2/";

  private readonly menuItems: Array<MenuItem>;
  private readonly stageMappings: Array<StageMapping>;
  private readonly assignedSeasonCounts: Map<string, number>;
  private treeIdCounter: IncrementalIdGenerator;
  private defaultValues: MenuItemPayloadBuilderDefaultValues;
  private existingStageItems: Map<string, MenuItem>;
  private existingSeasonItems: Map<string, Map<string, MenuItem>>;
  private parseIds: boolean;
  private localizedSortOrders: Map<string, Map<number, number>>;

  static create(
    treeIdCounter: IncrementalIdGenerator,
    defaultValues: MenuItemPayloadBuilderDefaultValues
  ): SportMenuItemPayloadBuilder {
    return new SportMenuItemPayloadBuilder(treeIdCounter, defaultValues);
  }

  private constructor(
    treeIdCounter: IncrementalIdGenerator,
    defaultValues: MenuItemPayloadBuilderDefaultValues
  ) {
    this.treeIdCounter = treeIdCounter;
    this.defaultValues = defaultValues;
    this.menuItems = new Array<MenuItem>();
    this.stageMappings = new Array<StageMapping>();
    this.assignedSeasonCounts = new Map<string, number>();
    this.existingStageItems = new Map<string, MenuItem>();
    this.existingSeasonItems = new Map<string, Map<string, MenuItem>>();
    this.parseIds = false;
    this.localizedSortOrders = new Map<string, Map<number, number>>();
  }

  addData(data?: Array<ProviderCategory>): SportMenuItemPayloadBuilder {
    if (data && data.length > 0) {
      data.forEach((category) => this.addCategory(category));
    }
    this.menuItems.sort((a, b) =>
      a.title === b.title ? 0 : a.title < b.title ? -1 : 1
    );
    this.localizedSortOrders = LocalizedSortOrderBuilder.create()
      .setDataForLanguage(this.menuItems, ConfigUtil.defaultLanguage())
      .build();
    return this;
  }

  setParseIds(parseIds: boolean): SportMenuItemPayloadBuilder {
    this.parseIds = parseIds;
    return this;
  }

  build(): MenuItemPayload {
    return {
      menuItems: this.menuItems,
      stageMappings: this.stageMappings,
      assignedSeasonCounts: this.assignedSeasonCounts,
      localizedSortOrders: this.localizedSortOrders,
    };
  }

  private addCategory(category: ProviderCategory): void {
    const categoryName = category.c_name;
    if (!categoryName) {
      return;
    }
    const categoryCode = TextUtil.strToUrlCode(categoryName);
    if (category.stages && category.stages.length > 0) {
      const categoryItemBuilder = MenuItemBuilder.create()
        .setType(MenuItemType.CATEGORY)
        .setTreeId(this.treeIdCounter.getAndIncrement())
        .setTitle(categoryName)
        .setName(
          LocaleBuilder.create()
            .addValueParts(this.defaultValues.language, categoryName)
            .build()
        )
        .setCode(
          LocaleBuilder.create()
            .addValueParts(this.defaultValues.language, categoryCode)
            .build()
        );

      if (category.c_id) {
        const baseUrl =
          this.defaultValues.flagBaseUrl +
          SportMenuItemPayloadBuilder.FLAG_PROVIDER_PATH +
          category.c_id;
        categoryItemBuilder.setFlagVariant(
          FlagVariant.SVG_1X1,
          baseUrl + "/1x1.svg"
        );
        categoryItemBuilder.setFlagVariant(
          FlagVariant.SVG_4X3,
          baseUrl + "/4x3.svg"
        );
        categoryItemBuilder.setFlagVariant(
          FlagVariant.PNG_1X1,
          baseUrl + "/1x1.png"
        );
        categoryItemBuilder.setFlagVariant(
          FlagVariant.PNG_4X3,
          baseUrl + "/4x3.png"
        );
      }

      if (this.parseIds) {
        categoryItemBuilder.setId(category.c_id);
      }

      const categoryItem = categoryItemBuilder.build();

      category.stages.forEach((stage) =>
        this.addStage(categoryItem, categoryCode, stage)
      );
      categoryItem.children.sort((a, b) =>
        a.title === b.title ? 0 : a.title < b.title ? -1 : 1
      );
      this.evaluatePrimarySeasons();
      if (categoryItem.children.length > 0) {
        this.menuItems.push(categoryItem);
      }
    }
  }

  private addStage(
    categoryItem: MenuItem,
    categoryCode: string,
    stage: ProviderStage
  ): void {
    const stageName = stage.st_name;
    if (!stageName || !stage.st_id) {
      return;
    }

    const stageGender = stage.st_gender || Gender.UNKNOWN;
    const stageCode = TextUtil.strToUrlCode(
      stageName + Gender.suffix(stageGender)
    );
    const compositeStageCode = categoryCode + "_" + stageCode;

    this.addStageMappingItem(stage);

    let stageItem = this.existingStageItems.get(compositeStageCode);
    if (!stageItem) {
      const stageItemBuilder = MenuItemBuilder.create()
        .setType(MenuItemType.STAGE)
        .setTreeId(this.treeIdCounter.getAndIncrement())
        .setTitle(stageName + Gender.shortSuffix(stageGender))
        .setName(
          LocaleBuilder.create()
            .addValueParts(this.defaultValues.language, stageName)
            .build()
        )
        .setCode(
          LocaleBuilder.create()
            .addValueParts(this.defaultValues.language, stageCode)
            .build()
        )
        .setGender(stageGender);

      if (this.parseIds) {
        stageItemBuilder.setId(stage.st_id);
      }

      stageItem = stageItemBuilder.build();
      categoryItem.children.push(stageItem);
      this.existingStageItems.set(compositeStageCode, stageItem);
    }

    this.addSeason(stageItem, compositeStageCode, stage);
  }

  private addSeason(
    stageItem: MenuItem,
    compositeStageCode: string,
    stage: ProviderStage
  ): void {
    if (!stage.st_id) {
      return;
    }
    const seasonName = stage.season || this.defaultValues.seasonName;
    const seasonCode = TextUtil.strToUrlCode(seasonName);
    const start = stage.start || this.defaultValues.start;
    const end = stage.end || this.defaultValues.end;
    let existingStageSeasonItems = this.existingSeasonItems.get(
      compositeStageCode
    );
    if (!existingStageSeasonItems) {
      existingStageSeasonItems = new Map<string, MenuItem>();
      this.existingSeasonItems.set(
        compositeStageCode,
        existingStageSeasonItems
      );
    }
    let seasonItem = existingStageSeasonItems.get(seasonCode);
    if (!seasonItem) {
      seasonItem = MenuItemBuilder.create()
        .setType(MenuItemType.SEASON)
        .setTreeId(this.treeIdCounter.getAndIncrement())
        .setTitle(seasonName)
        .setName(
          LocaleBuilder.create()
            .addValueParts(this.defaultValues.language, seasonName)
            .build()
        )
        .setCode(
          LocaleBuilder.create()
            .addValueParts(this.defaultValues.language, seasonCode)
            .build()
        )
        .setTimeRangeParts(start, end)
        .build();
      stageItem.children.push(seasonItem);
      existingStageSeasonItems.set(seasonCode, seasonItem);
    }
    seasonItem.stageMappings.push(
      StageMappingBuilder.create()
        .setStageId(ProviderCategoryCollection.sanitizeStageId(stage.st_id))
        .setProviderId(stage.pid || 0)
        .setCategoryName(stage.c_name || "")
        .setStageName(stage.st_name || "")
        .setSeasonName(seasonName)
        .setTimeRangeParts(start, end)
        .setGender(stage.st_gender || Gender.UNKNOWN)
        .incrementAssignmentCount()
        .build()
    );
    this.incrementSeasonAssignmentCount(stage.st_id);
  }

  private addStageMappingItem(stage: ProviderStage) {
    const stageMappingItem = StageMappingBuilder.create()
      .setStageId(ProviderCategoryCollection.sanitizeStageId(stage.st_id || ""))
      .setProviderId(stage.pid || 0)
      .setCategoryName(stage.c_name || "")
      .setStageName(stage.st_name || "")
      .setSeasonName(stage.season || this.defaultValues.seasonName)
      .setGender(stage.st_gender || Gender.UNKNOWN)
      .incrementAssignmentCount()
      .build();
    this.stageMappings.push(stageMappingItem);
  }

  private evaluatePrimarySeasons(): void {
    this.existingSeasonItems.forEach((stageSeasonItems) => {
      let maxSeasonCode = "";
      Array.from(stageSeasonItems.keys()).forEach((code) => {
        if (maxSeasonCode.length === 0 || code > maxSeasonCode) {
          maxSeasonCode = code;
        }
      });
      const primarySeason = stageSeasonItems.get(maxSeasonCode);
      if (primarySeason) {
        primarySeason.primary = true;
      }
    });
  }

  private incrementSeasonAssignmentCount(stageId: string): void {
    const count = this.assignedSeasonCounts.get(stageId) || 0;
    this.assignedSeasonCounts.set(stageId, count + 1);
  }
}
