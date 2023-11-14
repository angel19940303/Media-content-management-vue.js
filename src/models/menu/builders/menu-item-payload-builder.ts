import { ProviderCategory } from "../provider-category";
import { DateUtil } from "../../../utils/date-util";
import { IncrementalIdGenerator } from "../../common/incremental-id-generator";
import { MenuItemPayloadBuilderDefaultValues } from "./menu-item-payload-builder-default-values";
import { MenuItemPayload } from "../menu-item-payload";
import { SportMenuItemPayloadBuilder } from "./sport-menu-item-payload-builder";
import { MenuDataPayload } from "../menu-data-payload";
import { DataMenuItemPayloadBuilder } from "./data-menu-item-payload-builder";
import { StageMapping } from "../stage-mapping";
import { MenuItem } from "../menu-item";
import { MenuItemBuilder } from "./menu-item-builder";
import { MenuItemType } from "../../enums/menu-item-type";
import { LocaleBuilder } from "../../common/builders/locale-builder";
import { TextUtil } from "../../../utils/text-util";
import { Gender } from "../../enums/gender";
import { ConfigUtil } from "../../../utils/config-util";

export class MenuItemPayloadBuilder {
  private static readonly API_FLAG_BASE_URL = "/flags/";

  private readonly treeIdCounter: IncrementalIdGenerator;
  private defaultValues = MenuItemPayloadBuilder.defaultValues();

  constructor(treeIdCounter: IncrementalIdGenerator) {
    this.treeIdCounter = treeIdCounter;
  }

  static defaultValues(): MenuItemPayloadBuilderDefaultValues {
    const startDate = DateUtil.createDate(2019, 0, 1, 0, 0, 0, 0, true);
    const endDate = DateUtil.createDate(2020, 11, 31, 23, 59, 59, 999, true);
    return {
      startDate: startDate,
      start: DateUtil.dateToApiTimestamp(startDate, true),
      endDate: endDate,
      end: DateUtil.dateToApiTimestamp(endDate, true),
      seasonName: startDate.getUTCFullYear() + "/" + endDate.getUTCFullYear(),
      language: ConfigUtil.defaultLanguage(),
      flagBaseUrl: MenuItemPayloadBuilder.API_FLAG_BASE_URL,
    };
  }

  fromSportData(
    data?: Array<ProviderCategory>,
    parseIds?: boolean
  ): MenuItemPayload {
    return SportMenuItemPayloadBuilder.create(
      this.treeIdCounter,
      this.defaultValues
    )
      .setParseIds(parseIds === true)
      .addData(data)
      .build();
  }

  fromMenuDataPayload(data?: MenuDataPayload): MenuItemPayload {
    return DataMenuItemPayloadBuilder.create(
      this.treeIdCounter,
      this.defaultValues
    )
      .addData(data)
      .build();
  }

  itemStructureFromStageMapping(
    stageMapping: StageMapping,
    createStage: boolean,
    primaryTitle?: string
  ): MenuItem {
    const primary =
      primaryTitle !== undefined && primaryTitle <= stageMapping.seasonName;
    const seasonItemBuilder = MenuItemBuilder.create()
      .setType(MenuItemType.SEASON)
      .setTreeId(this.treeIdCounter.getAndIncrement())
      .setTitle(stageMapping.seasonName)
      .setName(
        LocaleBuilder.create()
          .addValueParts(this.defaultValues.language, stageMapping.seasonName)
          .build()
      )
      .setCode(
        LocaleBuilder.create()
          .addValueParts(
            this.defaultValues.language,
            TextUtil.strToUrlCode(stageMapping.seasonName)
          )
          .build()
      )
      .setTimeRange(stageMapping.timeRange)
      .setPrimary(primary)
      .addStageMapping(stageMapping);

    if (!createStage) {
      return seasonItemBuilder.build();
    }

    seasonItemBuilder.setPrimary(true);

    return MenuItemBuilder.create()
      .setType(MenuItemType.STAGE)
      .setTreeId(this.treeIdCounter.getAndIncrement())
      .setTitle(
        stageMapping.stageName + Gender.shortSuffix(stageMapping.gender)
      )
      .setName(
        LocaleBuilder.create()
          .addValueParts(this.defaultValues.language, stageMapping.stageName)
          .build()
      )
      .setCode(
        LocaleBuilder.create()
          .addValueParts(
            this.defaultValues.language,
            TextUtil.strToUrlCode(stageMapping.stageName)
          )
          .build()
      )
      .setGender(stageMapping.gender)
      .setTimeRange(stageMapping.timeRange)
      .addChildFromBuilder(seasonItemBuilder)
      .build();
  }
}
