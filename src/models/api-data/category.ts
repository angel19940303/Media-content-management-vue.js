import { Stage } from "./stage";

export class Category {
  readonly c_id: string;
  readonly c_code?: string;
  readonly c_name?: string;
  readonly s_id?: number;
  readonly sort?: number;
  readonly pid?: number;
  readonly categories?: Category[];
  readonly stages?: Stage[];

  private constructor(
    c_id: string,
    c_code: string | undefined,
    c_name: string | undefined,
    s_id: number | undefined,
    sort: number | undefined,
    pid: number | undefined,
    categories: Category[] | undefined,
    stages: Stage[] | undefined
  ) {
    this.c_id = c_id;
    this.c_code = c_code;
    this.c_name = c_name;
    this.s_id = s_id;
    this.sort = sort;
    this.pid = pid;
    this.categories = categories;
    this.stages = stages;
  }

  static fromData(data: any): Category | undefined {
    if (data === undefined || data === null) {
      return undefined;
    }
    const c_id: string | undefined = data["c_id"];
    if (c_id === undefined) {
      return undefined;
    }
    const c_code: string | undefined = data["c_code"];
    const c_name: string | undefined = data["c_name"];
    const s_id: number | undefined = data["s_id"];
    const sort: number | undefined = data["sort"];
    const pid: number | undefined = data["pid"];
    const categories: Category[] = Category.listFromData(data["categories"]);
    const stages: Stage[] = Stage.listFromData(data["stages"]);
    return new Category(
      c_id,
      c_code,
      c_name,
      s_id,
      sort,
      pid,
      categories,
      stages
    );
  }

  static listFromData(data?: any): Category[] {
    const categories = new Array<Category>();
    if (data !== undefined && Array.isArray(data)) {
      data.forEach((item: any) => {
        const category = this.fromData(item);
        if (category !== undefined) {
          categories.push(category);
        }
      });
    }
    return categories;
  }
}
