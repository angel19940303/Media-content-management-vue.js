import { ConfigUtil } from "./config-util";

export class ImageUtil {
  static getImageSize(imageFileName: string): Promise<[number, number]> {
    return new Promise<[number, number]>((resolve) => {
      const image = new Image();
      image.onload = (event) => {
        if (event.target !== null) {
          const target: any = event.target;
          resolve([target.width || 0, target.height || 0]);
        } else {
          resolve([0, 0]);
        }
      };
      image.onerror = () => {
        resolve([0, 0]);
      };
      image.src = ConfigUtil.imageUrl(imageFileName);
    });
  }

  static getAspectRatio(
    width: number | undefined,
    height: number | undefined
  ): string | undefined {
    if (
      width === undefined ||
      height === undefined ||
      width === 0 ||
      height === 0
    ) {
      return undefined;
    }

    if (width === height) {
      return "1:1";
    }

    const gcd = (a: number, b: number): number => {
      const max = Math.max(a, b);
      const min = Math.min(a, b);
      const diff = max - min;
      if (diff === min || min <= 0) {
        return min;
      }
      return gcd(diff, min);
    };

    const divisor = gcd(width, height);
    if (divisor <= 0) {
      return undefined;
    }
    return width / divisor + ":" + height / divisor;
  }
}
