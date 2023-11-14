export class LoadStatus {
  static readonly SUCCESS = 0;
  static readonly FAILURE = 1;
  static readonly UNAUTHENTICATED = 2;
  static readonly UNAUTHORIZED = 3;

  static isAuthError(loadStatus: number): boolean {
    return (
      loadStatus === LoadStatus.UNAUTHENTICATED ||
      loadStatus === LoadStatus.UNAUTHORIZED
    );
  }
}
