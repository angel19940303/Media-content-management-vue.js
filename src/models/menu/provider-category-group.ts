import { ProviderCategory } from "./provider-category";

export interface ProviderCategoryGroup {
  provider: string;
  categories: Array<ProviderCategory>;
}
