import { StageMapping } from "../stage-mapping";
import { TimeRange } from "../../common/time-range";
import { DateUtil } from "../../../utils/date-util";
import { Gender } from "../../enums/gender";
import { Locale } from "../../common/locale";
import { LocaleBuilder } from "../../common/builders/locale-builder";

export class StageMappingBuilder {
  private stageId: string = "";
  private providerId: number = 0;
  private categoryName: string = "";
  private stageName: string = "";
  private seasonName: string = "";
  private gender: number = Gender.UNKNOWN;
  private assignmentCount: number = 0;
  private timeRange?: TimeRange;
  private localizedName: Locale = LocaleBuilder.createEmpty().build();

  private constructor() {}

  static create(): StageMappingBuilder {
    return new StageMappingBuilder();
  }

  static from(stageMapping: StageMapping): StageMappingBuilder {
    return new StageMappingBuilder()
      .setStageId(stageMapping.stageId)
      .setProviderId(stageMapping.providerId)
      .setCategoryName(stageMapping.categoryName)
      .setStageName(stageMapping.stageName)
      .setSeasonName(stageMapping.seasonName)
      .setGender(stageMapping.gender)
      .setAssignmentCount(stageMapping.assignmentCount)
      .setTimeRange(stageMapping.timeRange)
      .setLocalizedName(
        LocaleBuilder.fromLocaleObject(stageMapping.localizedName).build()
      );
  }

  setStageId(stageId: string): StageMappingBuilder {
    this.stageId = stageId;
    return this;
  }

  setProviderId(providerId: number): StageMappingBuilder {
    this.providerId = providerId;
    return this;
  }

  setCategoryName(categoryName: string): StageMappingBuilder {
    this.categoryName = categoryName;
    return this;
  }

  setStageName(stageName: string): StageMappingBuilder {
    this.stageName = stageName;
    return this;
  }

  setSeasonName(seasonName: string): StageMappingBuilder {
    this.seasonName = seasonName;
    return this;
  }

  setGender(gender: number): StageMappingBuilder {
    this.gender = gender;
    return this;
  }

  setAssignmentCount(assignmentCount: number): StageMappingBuilder {
    if (assignmentCount > 0) {
      this.assignmentCount = assignmentCount;
    } else {
      this.assignmentCount = 0;
    }
    return this;
  }

  setTimeRange(timeTange?: TimeRange): StageMappingBuilder {
    this.timeRange = timeTange;
    return this;
  }

  setTimeRangeParts(start: number, end: number): StageMappingBuilder {
    this.timeRange = { start: start, end: end };
    return this;
  }

  setTimeRangePartsStr(start: string, end: string): StageMappingBuilder {
    const startTime = DateUtil.datePickerStringToApiTimestamp(start);
    const endTime = DateUtil.datePickerStringToApiTimestamp(end);
    if (startTime === 0 || endTime === 0) {
      this.timeRange = undefined;
    } else {
      this.timeRange = { start: startTime, end: endTime };
    }
    return this;
  }

  setLocalizedName(localizedName: Locale): StageMappingBuilder {
    this.localizedName = LocaleBuilder.fromLocaleObject(localizedName).build();
    return this;
  }

  incrementAssignmentCount(): StageMappingBuilder {
    this.assignmentCount++;
    return this;
  }

  decrementAssignmentCount(): StageMappingBuilder {
    if (this.assignmentCount > 0) {
      this.assignmentCount--;
    }
    return this;
  }

  build(): StageMapping {
    return {
      stageId: this.stageId,
      providerId: this.providerId,
      categoryName: this.categoryName,
      stageName: this.stageName,
      seasonName: this.seasonName,
      fullName:
        this.categoryName + " - " + this.stageName + " - " + this.seasonName,
      gender: this.gender,
      assignmentCount: this.assignmentCount,
      timeRange: this.timeRange,
      localizedName: LocaleBuilder.fromLocale(
        this.localizedName
      ).buildNonEmpty(),
    };
  }
}
