import { Locale } from "../common/locale";
import { Provider } from "../enums/provider";
import { ConfigUtil } from "../../utils/config-util";

export class LocEnumItem {
  readonly providerIds: Map<number, string>;
  readonly sportId: number;
  readonly name: Locale;
  readonly title: string;
  readonly compositeProviderIds: string;

  constructor(providerIds: Map<number, string>, sportId: number, name: Locale) {
    this.providerIds = providerIds;
    this.sportId = sportId;
    this.name = name;
    this.title = LocEnumItem.buildTitle(name);
    this.compositeProviderIds = LocEnumItem.buildCompositeProviderIds(
      providerIds
    );
  }

  private static buildCompositeProviderIds(
    providerIds: Map<number, string>
  ): string {
    let compositeIds = "";
    if (providerIds.size > 0) {
      providerIds.forEach((id, providerId) => {
        const providerIdStr = Provider.initialsForProvider(providerId);
        if (compositeIds.length > 0) {
          compositeIds += ", ";
        }
        compositeIds += providerIdStr + ": " + id;
      });
    }
    return compositeIds;
  }

  private static buildTitle(name: Locale): string {
    let title = name.locale.get(ConfigUtil.defaultLanguage())?.value || "";
    if (title.length === 0) {
      title = "";
      const languages = Array.from(name.locale.keys());
      for (let i = 0; i < languages.length; i++) {
        const language = languages[i];
        const nameValue = name.locale.get(language);
        if (nameValue !== undefined && nameValue.value.length > 0) {
          title = nameValue.value;
          break;
        }
      }
    }
    return title;
  }
}
