export class TextUtil {
  static strToUrlCode(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w]/gi, "-")
      .replace(/_/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
      .replace(/-s-/g, "s-")
      .replace(/-s$/, "s")
      .replace(/-(-)+/g, "-")
      .replace(/-i-/gi, "-1-")
      .replace(/-i$/i, "-1")
      .replace(/-ii-/gi, "-2-")
      .replace(/-ii$/i, "-2")
      .replace(/-iii-/gi, "-3-")
      .replace(/-iii$/i, "-3")
      .replace(/-iv-/gi, "-4-")
      .replace(/-iv$/i, "-4")
      .replace(/-v-/gi, "-5-")
      .replace(/-v$/i, "-5")
      .toLowerCase();
  }

  static pad(number: number, digits: number): string {
    const numberDigits =
      number === 0 ? 1 : Math.floor(Math.log(number) / Math.log(10)) + 1;
    if (digits <= numberDigits) {
      return number.toString(10);
    }
    const length = digits - numberDigits;
    if (isNaN(length) || length < 0) {
      return "";
    }
    let prefix = "";
    for (let i = 0; i < length; i++) {
      prefix += "0";
    }
    return prefix + number.toString(10);
  }

  static parseNumber(string: string | undefined): number | undefined {
    if (!string) {
      return undefined;
    }
    const number = parseInt(string, 10);
    if (isNaN(number)) {
      return undefined;
    }
    return number;
  }

  static nameToInitials(name: string): string {
    const nameParts = name.split(" ");
    let initials = "";
    for (let i = 0; i < nameParts.length; i++) {
      const namePart = nameParts[i];
      if (namePart.length > 0) {
        initials += namePart.substr(0, 1).toUpperCase();
        if (initials.length >= 2) {
          break;
        }
      }
    }
    return initials;
  }
}
