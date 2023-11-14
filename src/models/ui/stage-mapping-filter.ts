import { StageMapping } from "../menu/stage-mapping";

export class StageMappingFilter {
  readonly provider?: number;
  readonly name?: string;
  readonly hideAssigned?: boolean;

  constructor(provider?: number, name?: string, hideAssigned?: boolean) {
    this.provider = provider;
    this.name = name;
    this.hideAssigned = hideAssigned;
  }

  isEmpty(): boolean {
    return (
      this.provider === undefined &&
      this.name === undefined &&
      this.hideAssigned !== true
    );
  }

  matches(mapping: StageMapping): boolean {
    return (
      this.isEmpty() ||
      (this.matchesProvider(mapping.providerId) &&
        this.matchesName(mapping.fullName) &&
        this.shouldHide(mapping.assignmentCount > 0))
    );
  }

  private matchesProvider(provider: number): boolean {
    return this.provider === undefined || this.provider === provider;
  }

  private matchesName(name: string): boolean {
    return (
      this.name === undefined ||
      new RegExp("^" + this.name + "(.*)", "i").test(name)
    );
  }

  private shouldHide(isAssigned: boolean): boolean {
    return this.hideAssigned !== true || !isAssigned;
  }
}
