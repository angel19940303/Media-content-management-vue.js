export class Sport {
  static readonly SOCCER = 1;
  static readonly TENNIS = 2;
  static readonly HOCKEY = 3;
  static readonly BASKETBALL = 4;
  static readonly CRICKET = 5;
  static readonly VOLLEYBALL = 6;
  static readonly HANDBALL = 7;
  static readonly AMERICAN_FOOTBALL = 9;
  static readonly GOLF = 10;
  static readonly BEACH_VOLLEY = 11;
  static readonly SNOOKER = 12;
  static readonly E_SPORTS = 13;
  static readonly RUGBY = 14;
  static readonly BASEBALL = 15;

  static title(sport: number): string | undefined {
    switch (sport) {
      case Sport.SOCCER:
        return "Soccer";
      case Sport.HOCKEY:
        return "Hockey";
      case Sport.BASKETBALL:
        return "Basketball";
      case Sport.TENNIS:
        return "Tennis";
      case Sport.CRICKET:
        return "Cricket";
      case Sport.RUGBY:
        return "Rugby Union";
      case Sport.BASEBALL:
        return "Baseball";
      case Sport.AMERICAN_FOOTBALL:
        return "American football";
      default:
        return undefined;
    }
  }

  static code(sport: number): string | undefined {
    switch (sport) {
      case Sport.SOCCER:
        return "soccer";
      case Sport.HOCKEY:
        return "ice_hockey";
      case Sport.BASKETBALL:
        return "basketball";
      case Sport.TENNIS:
        return "tennis";
      case Sport.CRICKET:
        return "cricket";
      case Sport.RUGBY:
        return "rugby_union";
      case Sport.BASEBALL:
        return "baseball";
      case Sport.AMERICAN_FOOTBALL:
        return "american_football";
      default:
        return Sport.enumCode(sport)?.toLowerCase();
    }
  }

  static enumCode(sport: number): string | undefined {
    switch (sport) {
      case Sport.SOCCER:
        return "SOCCER";
      case Sport.HOCKEY:
        return "ICE_HOCKEY";
      case Sport.BASKETBALL:
        return "BASKETBALL";
      case Sport.TENNIS:
        return "TENNIS";
      case Sport.CRICKET:
        return "CRICKET";
      case Sport.RUGBY:
        return "RUGBY";
      case Sport.BASEBALL:
        return "BASEBALL";
      case Sport.AMERICAN_FOOTBALL:
        return "AMERICAN_FOOTBALL";
      default:
        return "UNKNOWN_SPORT";
    }
  }

  static fromCode(code: string | undefined): number | undefined {
    switch (code) {
      case "soccer":
        return Sport.SOCCER;
      case "ice_hockey":
        return Sport.HOCKEY;
      case "basketball":
        return Sport.BASKETBALL;
      case "tennis":
        return Sport.TENNIS;
      case "cricket":
        return Sport.CRICKET;
      case "rugby_union":
        return Sport.RUGBY;
      case "baseball":
        return Sport.BASEBALL;
      case "american_football":
        return Sport.AMERICAN_FOOTBALL;
    }
    return undefined;
  }

  static readonly SPORTS = [
    Sport.SOCCER,
    Sport.HOCKEY,
    Sport.BASKETBALL,
    Sport.TENNIS,
    Sport.CRICKET,
    Sport.RUGBY,
    Sport.BASEBALL,
    Sport.AMERICAN_FOOTBALL,
  ];
}
