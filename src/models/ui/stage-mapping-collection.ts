import { StageMapping } from "../menu/stage-mapping";
import { StageMappingFilter } from "./stage-mapping-filter";
import { StageMappingBuilder } from "../menu/builders/stage-mapping-builder";
import { AssignedSeasonCounter } from "./assigned-season-counter";

export class StageMappingCollection {
  private readonly mappings: Array<StageMapping>;
  private readonly filteredMappings?: Array<StageMapping>;
  private readonly filter?: StageMappingFilter;

  static create(mappings?: Array<StageMapping>): StageMappingCollection {
    return new StageMappingCollection(mappings || [], undefined, undefined);
  }

  private constructor(
    mappings: Array<StageMapping>,
    filteredMappings?: Array<StageMapping>,
    filter?: StageMappingFilter
  ) {
    this.mappings = mappings;
    this.filteredMappings = filteredMappings;
    this.filter = filter;
  }

  add(newMapping: StageMapping): StageMappingCollection {
    const newMappings = new Array<StageMapping>();
    const newFilteredMappings = this.filter
      ? new Array<StageMapping>()
      : undefined;
    this.mappings.forEach((mapping) => {
      newMappings.push(mapping);
      if (this.filter && this.filter.matches(mapping) && newFilteredMappings) {
        newFilteredMappings.push(mapping);
      }
    });
    newMappings.push(newMapping);
    if (this.filter && this.filter.matches(newMapping) && newFilteredMappings) {
      newFilteredMappings.push(newMapping);
    }
    return new StageMappingCollection(
      newMappings,
      newFilteredMappings,
      this.filter
    );
  }

  update(index: number, newMapping: StageMapping): StageMappingCollection {
    const newMappings = Array.from(this.mappings);
    const idx = newMappings.findIndex(
      (mapping) => mapping.stageId === newMapping.stageId
    );
    if (idx !== undefined && idx >= 0) {
      newMappings.splice(idx, 1, newMapping);
    }
    let newFilteredMappings: Array<StageMapping> | undefined = undefined;
    if (this.filter && this.filteredMappings) {
      const filter = this.filter;
      newFilteredMappings = newMappings.filter((mapping) =>
        filter.matches(mapping)
      );
    }
    return new StageMappingCollection(
      newMappings,
      newFilteredMappings,
      this.filter
    );
  }

  remove(index: number): StageMappingCollection {
    const newMappings = Array.from(this.mappings);
    let newFilteredMappings: Array<StageMapping> | undefined;
    if (
      this.filteredMappings &&
      index >= 0 &&
      index < this.filteredMappings.length
    ) {
      const mapping = this.filteredMappings[index];
      newFilteredMappings = Array.from(this.filteredMappings);
      newFilteredMappings.splice(index, 1);

      const mainIndex = this.mappings.indexOf(mapping);
      if (index > -1) {
        newMappings.splice(mainIndex, 1);
      }
    } else if (
      !this.filteredMappings &&
      index >= 0 &&
      index < this.mappings.length
    ) {
      newMappings.splice(index, 1);
    }
    return new StageMappingCollection(
      newMappings,
      newFilteredMappings,
      this.filter
    );
  }

  applyFilter(filter?: StageMappingFilter): StageMappingCollection {
    if (filter && !filter.isEmpty()) {
      const filteredMappings = this.mappings.filter((mapping) =>
        filter.matches(mapping)
      );
      return new StageMappingCollection(
        this.mappings,
        filteredMappings,
        filter
      );
    } else {
      return new StageMappingCollection(this.mappings, undefined, undefined);
    }
  }

  list(): Array<StageMapping> {
    if (this.filter && this.filteredMappings) {
      return this.filteredMappings;
    }
    return this.mappings;
  }

  get(index: number): StageMapping | undefined {
    const mappings = this.list();
    if (index >= 0 && index < mappings.length) {
      return mappings[index];
    }
    return undefined;
  }

  updateAtIndex(
    index: number,
    transform: (mapping: StageMappingBuilder) => StageMappingBuilder
  ): StageMappingCollection {
    if (index < 0 || index >= this.mappings.length) {
      return this;
    }
    return this.update(
      index,
      transform(StageMappingBuilder.from(this.mappings[index])).build()
    );
  }

  findAndUpdate(
    mapping: StageMapping,
    transform: (mapping: StageMappingBuilder) => StageMappingBuilder
  ): StageMappingCollection {
    const index = this.mappings.findIndex((m) => m.stageId === mapping.stageId);
    if (index === undefined) {
      return this;
    }
    return this.updateAtIndex(index, transform);
  }

  find(
    predicate: (mapping: StageMapping) => boolean
  ): StageMapping | undefined {
    return this.mappings.find((mapping) => predicate(mapping));
  }

  indexOf(mapping: StageMapping): number {
    if (this.filteredMappings) {
      return this.filteredMappings.indexOf(mapping);
    }
    return this.mappings.indexOf(mapping);
  }

  updateCounts(counter: AssignedSeasonCounter): StageMappingCollection {
    const newMappings = new Array<StageMapping>();
    const newFilteredMappings = this.filter
      ? new Array<StageMapping>()
      : undefined;
    this.mappings.forEach((mapping) => {
      const count = counter.get(mapping.stageId);
      const newMapping = StageMappingBuilder.from(mapping)
        .setAssignmentCount(count)
        .build();
      newMappings.push(newMapping);
      if (
        this.filter &&
        this.filter.matches(newMapping) &&
        newFilteredMappings
      ) {
        newFilteredMappings.push(newMapping);
      }
    });
    return new StageMappingCollection(
      newMappings,
      newFilteredMappings,
      this.filter
    );
  }
}
