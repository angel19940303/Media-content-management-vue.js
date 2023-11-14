export class BaseUIModel {
  protected valueOrElse<T>(value: T | undefined, fallbackValue: T): T {
    return value === undefined ? fallbackValue : value;
  }
}
