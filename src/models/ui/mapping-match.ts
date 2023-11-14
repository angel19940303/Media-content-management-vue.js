import { MappingParticipantRecord } from "../mapping/mapping-participant-record";
import { MappingRecord } from "../mapping/mapping-record";
import { DateUtil } from "../../utils/date-util";
import { MappingFilter } from "./mapping-filter";

export class MappingMatchTeam {
  readonly providerId: number;
  readonly id: string;
  readonly name: string;
  readonly gender: number;
  readonly sport: number;

  private constructor(
    providerId: number,
    id: string,
    name: string,
    gender: number,
    sport: number
  ) {
    this.providerId = providerId;
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.sport = sport;
  }

  static fromRecord(
    record: MappingParticipantRecord,
    sport: number
  ): MappingMatchTeam | undefined {
    if (
      record.Provider === undefined ||
      record.ID === undefined ||
      record.Name === undefined ||
      record.GenderID === undefined
    ) {
      return undefined;
    }
    return new MappingMatchTeam(
      record.Provider,
      record.ID,
      record.Name,
      record.GenderID,
      sport
    );
  }

  static listFromRecords(
    records: MappingParticipantRecord[] | undefined,
    sport: number
  ): MappingMatchTeam[] {
    const teams = new Array<MappingMatchTeam>();
    if (records !== undefined) {
      records.forEach((record) => {
        const team = this.fromRecord(record, sport);
        if (team !== undefined) {
          teams.push(team);
        }
      });
    }
    return teams;
  }
}

export class MappingMatch {
  readonly creatorProviderId: number;
  readonly mappingProviderId: number;
  readonly sport: number;
  readonly rank: number;
  readonly creatorId: string;
  readonly mappingId: string;
  readonly creatorTeams: MappingMatchTeam[];
  readonly mappingTeams: MappingMatchTeam[];
  readonly creatorStartDate: Date | undefined;
  readonly mappingStartDate: Date | undefined;
  readonly creatorSport: number;
  readonly mappingSport: number;
  readonly creatorCategoryName: string | undefined;
  readonly mappingCategoryName: string | undefined;
  readonly creatorStageName: string | undefined;
  readonly mappingStageName: string | undefined;
  readonly creatorSeason: string | undefined;
  readonly mappingSeason: string | undefined;

  private constructor(
    creatorProviderId: number,
    mappingProviderId: number,
    sport: number,
    rank: number,
    creatorId: string,
    mappingId: string,
    creatorTeams: MappingMatchTeam[],
    mappingTeams: MappingMatchTeam[],
    creatorStartDate: Date | undefined,
    mappingStartDate: Date | undefined,
    creatorSport: number,
    mappingSport: number,
    creatorCategoryName: string | undefined,
    mappingCategoryName: string | undefined,
    creatorStageName: string | undefined,
    mappingStageName: string | undefined,
    creatorSeason: string | undefined,
    mappingSeason: string | undefined
  ) {
    this.creatorProviderId = creatorProviderId;
    this.mappingProviderId = mappingProviderId;
    this.sport = sport;
    this.rank = rank;
    this.creatorId = creatorId;
    this.mappingId = mappingId;
    this.creatorTeams = creatorTeams;
    this.mappingTeams = mappingTeams;
    this.creatorStartDate = creatorStartDate;
    this.mappingStartDate = mappingStartDate;
    this.creatorSport = creatorSport;
    this.mappingSport = mappingSport;
    this.creatorCategoryName = creatorCategoryName;
    this.mappingCategoryName = mappingCategoryName;
    this.creatorStageName = creatorStageName;
    this.mappingStageName = mappingStageName;
    this.creatorSeason = creatorSeason;
    this.mappingSeason = mappingSeason;
  }

  static fromRecord(record: MappingRecord): MappingMatch | undefined {
    if (
      record.creator_match === undefined ||
      record.creator_match.Provider === undefined ||
      record.creator_match.ID === undefined ||
      record.creator_match.Participants === undefined ||
      record.creator_match.StartTime === undefined ||
      record.creator_match.Sport === undefined ||
      record.mapping_match === undefined ||
      record.mapping_match.Provider === undefined ||
      record.mapping_match.ID === undefined ||
      record.mapping_match.Participants === undefined ||
      record.mapping_match.StartTime === undefined ||
      record.mapping_match.Sport === undefined ||
      record.rank === undefined
    ) {
      return undefined;
    }
    return new MappingMatch(
      record.creator_match.Provider,
      record.mapping_match.Provider,
      record.creator_match.Sport,
      record.rank,
      record.creator_match.ID,
      record.mapping_match.ID,
      MappingMatchTeam.listFromRecords(
        record.creator_match.Participants,
        record.creator_match.Sport
      ),
      MappingMatchTeam.listFromRecords(
        record.mapping_match.Participants,
        record.mapping_match.Sport
      ),
      DateUtil.iso8601StringToDate(record.creator_match.StartTime),
      DateUtil.iso8601StringToDate(record.mapping_match.StartTime),
      record.creator_match.Sport,
      record.mapping_match.Sport,
      record.creator_match.CategoryName,
      record.mapping_match.CategoryName,
      record.creator_match.StageName,
      record.mapping_match.StageName,
      record.creator_match.Season,
      record.mapping_match.Season
    );
  }

  static listFromRecords(records: MappingRecord[] | undefined): MappingMatch[] {
    const mappingMatches = new Array<MappingMatch>();
    if (records !== undefined) {
      records.forEach((record) => {
        const mappingMatch = this.fromRecord(record);
        if (mappingMatch !== undefined) {
          mappingMatches.push(mappingMatch);
        }
      });
    }
    return mappingMatches;
  }

  static filteredList(
    mappings: MappingMatch[],
    filter?: MappingFilter
  ): MappingMatch[] | undefined {
    if (
      filter === undefined ||
      (filter.sourceProviderId === undefined &&
        filter.targetProviderId === undefined &&
        filter.stageName === undefined &&
        filter.teamName === undefined)
    ) {
      return undefined;
    }
    return mappings.filter((mapping) => mapping.matchesFilter(filter));
  }

  private static makeCompositeStageName(
    stageName?: string,
    categoryName?: string
  ): string | undefined {
    if (stageName !== undefined && categoryName !== undefined) {
      return categoryName + " " + stageName;
    }
    if (stageName !== undefined) {
      return stageName;
    }
    return categoryName;
  }

  matchesFilter(filter: MappingFilter): boolean {
    if (
      filter.sourceProviderId !== undefined &&
      this.mappingProviderId !== filter.sourceProviderId
    ) {
      return false;
    }
    if (
      filter.targetProviderId !== undefined &&
      this.creatorProviderId !== filter.targetProviderId
    ) {
      return false;
    }
    if (filter.stageName !== undefined) {
      const stageName = filter.stageName.toLowerCase();
      const mappingStageName = MappingMatch.makeCompositeStageName(
        this.mappingStageName,
        this.mappingCategoryName
      );
      const creatorStageName = MappingMatch.makeCompositeStageName(
        this.creatorStageName,
        this.creatorCategoryName
      );
      if (
        (mappingStageName === undefined ||
          mappingStageName.toLowerCase().indexOf(stageName.toLowerCase()) <
            0) &&
        (creatorStageName === undefined ||
          creatorStageName.toLowerCase().indexOf(stageName.toLowerCase()) < 0)
      ) {
        return false;
      }
    }
    if (filter.teamName !== undefined) {
      const teamName = filter.teamName.toLowerCase();
      if (
        !this.hasTeam((team) => team.name.toLowerCase().indexOf(teamName) >= 0)
      ) {
        return false;
      }
    }
    return true;
  }

  private hasTeam(predicate: (team: MappingMatchTeam) => boolean): boolean {
    for (let i = 0; i < this.mappingTeams.length; i++) {
      if (predicate(this.mappingTeams[i])) {
        return true;
      }
    }
    for (let i = 0; i < this.creatorTeams.length; i++) {
      if (predicate(this.creatorTeams[i])) {
        return true;
      }
    }
    return false;
  }
}
