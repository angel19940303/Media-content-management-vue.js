import { Provider } from "../../enums/provider";
import { MappingVariation } from "../mapping-variation";

export class MappingVariationBuilder {
  private entityId = "";
  private name = "";
  private providerId = Provider.ENET;

  static new(): MappingVariationBuilder {
    return new MappingVariationBuilder();
  }

  constructor() {}

  setEntityId(entityId: string): MappingVariationBuilder {
    this.entityId = entityId;
    return this;
  }

  setName(name: string): MappingVariationBuilder {
    this.name = name;
    return this;
  }

  setProviderId(providerId: number): MappingVariationBuilder {
    this.providerId = providerId;
    return this;
  }

  build(): MappingVariation | undefined {
    if (this.entityId.length === 0 || this.name.length === 0) {
      return undefined;
    }
    return {
      entity_id: this.entityId,
      name: this.name,
      provider_id: this.providerId,
    };
  }
}
