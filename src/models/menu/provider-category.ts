import { ProviderStage } from "./provider-stage";

export interface ProviderCategory {
  c_id?: string;
  c_name?: string;
  pid?: number;
  s_id?: number;
  sort?: number;
  stages?: Array<ProviderStage>;
}
