import { LocaleBuilder } from "../../common/builders/locale-builder";
import { LocEnumItem } from "../loc-enum-item";
import { LocaleType } from "../../common/locale-type";
import { Sport } from "../../enums/sport";
import { Locale } from "../../common/locale";

export class LocEnumItemBuilder {
  private providerIds = new Map<number, string>();
  private sport = Sport.SOCCER;
  private name = LocaleBuilder.create();

  static fromItem(item: LocEnumItem): LocEnumItemBuilder {
    const builder = new LocEnumItemBuilder();
    item.providerIds.forEach((id, providerId) =>
      builder.addProviderId(providerId, id)
    );
    item.name.locale.forEach((value, language) =>
      builder.addLocale(language, value)
    );
    return builder;
  }

  setSport(sport: number): LocEnumItemBuilder {
    this.sport = sport;
    return this;
  }

  setProviderIds(providerIds: Map<number, string>): LocEnumItemBuilder {
    this.providerIds = new Map<number, string>(providerIds);
    return this;
  }

  setName(name: Locale): LocEnumItemBuilder {
    this.name = LocaleBuilder.fromLocale(name);
    return this;
  }

  addProviderId(providerId: number, id: string): LocEnumItemBuilder {
    this.providerIds.set(providerId, id);
    return this;
  }

  addLocalisedName(language: string, name: string): LocEnumItemBuilder {
    this.name.addValueParts(language, name, true);
    return this;
  }

  addLocale(language: string, localeValue: LocaleType): LocEnumItemBuilder {
    this.name.addValue(language, localeValue);
    return this;
  }

  build(): LocEnumItem {
    return new LocEnumItem(this.providerIds, this.sport, this.name.build());
  }
}
