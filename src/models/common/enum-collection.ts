export class EnumCollection {
  private static readonly GENDER = "gender";
  private static readonly GENDER_INDEX = "gender_index";
  private static readonly LANGUAGES = "languages";
  private static readonly LANGUAGES_INDEX = "languages_index";
  private static readonly PROVIDERS = "providers";
  private static readonly PROVIDERS_INDEX = "providers_index";
  private static readonly SPORTS = "sports";
  private static readonly SPORTS_INDEX = "sports_index";

  private readonly data: any;

  constructor(data: any) {
    this.data = data;
  }

  /*gender(code: string): number | undefined {
        return this.itemId(EnumCollection.GENDER, code);
    }

    genders(): Array<number> {

    }

    private itemId(type: string, code: string): number | undefined {
        const genders = this.data[type];
        if (genders) {
            return genders[code.toUpperCase()];
        }
        return undefined;
    }

    private itemTitle(type: string, itemId: number): string | undefined {

    }

    private itemList(type: string): Array<number> {
        const list = new Array<number>();

        return list;
    }*/
}
