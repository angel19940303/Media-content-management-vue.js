export class MatchRound {
  static readonly FINAL = "final";
  static readonly SEMI_FINALS = "semi finals";
  static readonly QUARTER_FINALS = "quarter finals";
  static readonly ROUND_1_8 = "1/8";
  static readonly ROUND_1_16 = "1/16";
  static readonly ROUND_1_32 = "1/32";
  static readonly ROUND_1_64 = "1/64";
  static readonly ROUND_1_128 = "1/128";
  static readonly ROUND_1_96 = "1/96";
  static readonly ROUND_1_48 = "1/48";
  static readonly ROUND_1_24 = "1/24";
  static readonly ROUND_1_12 = "1/12";
  static readonly ROUND_1_6 = "1/6";
  static readonly ROUND_1_3 = "1/3";
  static readonly ROUND_1_28 = "1/28";
  static readonly ROUND_1_14 = "1/14";
  static readonly ROUND_1_7 = "1/7";
  static readonly THIRD = "3rd";
  static readonly BRONZE = "bronze";
  static readonly ROUND_3RD_PLACE = "3rd place";
  static readonly THIRD_PLACE = "third place";
  static readonly ROUND_1_256 = "1/256";
  static readonly ROUND_1_512 = "1/512";
  static readonly PLACEMENT = "placement";
  static readonly PLAYOFF = "playoff";
  static readonly CHALLENGER = "challenger";
  static readonly GROUP_MATCH = "group match";
  static readonly ONE_OFF_MATCH = "one-off match";
  static readonly ONLY = "only";
  static readonly POOL_MATCH = "pool match";
  static readonly PRELIMINARY = "preliminary";
  static readonly QUALIFIER = "qualifier";
  static readonly SUPER_EIGHT = "super eight";
  static readonly SUPER_FOUR = "super four";
  static readonly SUPER_SIXES = "super sixes";
  static readonly WARM_UP = "warm up";
  static readonly TOUR_MATCH = "tour match";

  static readonly ALL = [
    MatchRound.FINAL,
    MatchRound.SEMI_FINALS,
    MatchRound.QUARTER_FINALS,
    MatchRound.ROUND_1_8,
    MatchRound.ROUND_1_16,
    MatchRound.ROUND_1_32,
    MatchRound.ROUND_1_64,
    MatchRound.ROUND_1_128,
    MatchRound.ROUND_1_96,
    MatchRound.ROUND_1_48,
    MatchRound.ROUND_1_24,
    MatchRound.ROUND_1_12,
    MatchRound.ROUND_1_6,
    MatchRound.ROUND_1_3,
    MatchRound.ROUND_1_28,
    MatchRound.ROUND_1_14,
    MatchRound.ROUND_1_7,
    MatchRound.THIRD,
    MatchRound.BRONZE,
    MatchRound.ROUND_3RD_PLACE,
    MatchRound.THIRD_PLACE,
    MatchRound.ROUND_1_256,
    MatchRound.ROUND_1_512,
    MatchRound.PLACEMENT,
    MatchRound.PLAYOFF,
    MatchRound.CHALLENGER,
    MatchRound.GROUP_MATCH,
    MatchRound.ONE_OFF_MATCH,
    MatchRound.ONLY,
    MatchRound.POOL_MATCH,
    MatchRound.PRELIMINARY,
    MatchRound.QUALIFIER,
    MatchRound.SUPER_EIGHT,
    MatchRound.SUPER_FOUR,
    MatchRound.SUPER_SIXES,
    MatchRound.WARM_UP,
    MatchRound.TOUR_MATCH,
  ];

  static titleForRound(round: string): string {
    switch (round) {
      case MatchRound.FINAL:
        return "Final";
      case MatchRound.SEMI_FINALS:
        return "Semi-finals";
      case MatchRound.QUARTER_FINALS:
        return "Quarter-finals";
      case MatchRound.ROUND_1_8:
        return "Round of 16";
      case MatchRound.ROUND_1_16:
        return "Round of 32";
      case MatchRound.ROUND_1_32:
        return "Round of 64";
      case MatchRound.ROUND_1_64:
        return "Round of 128";
      case MatchRound.ROUND_1_128:
        return "Round of 256";
      case MatchRound.ROUND_1_96:
        return "1/96";
      case MatchRound.ROUND_1_48:
        return "1/48";
      case MatchRound.ROUND_1_24:
        return "1/24";
      case MatchRound.ROUND_1_12:
        return "1/12";
      case MatchRound.ROUND_1_6:
        return "1/6";
      case MatchRound.ROUND_1_3:
        return "1/3";
      case MatchRound.ROUND_1_28:
        return "1/20";
      case MatchRound.ROUND_1_14:
        return "1/14";
      case MatchRound.ROUND_1_7:
        return "1/7";
      case MatchRound.THIRD:
        return "Third";
      case MatchRound.BRONZE:
        return "Bronze";
      case MatchRound.ROUND_3RD_PLACE:
        return "3rd Place";
      case MatchRound.THIRD_PLACE:
        return "Third Place";
      case MatchRound.ROUND_1_256:
        return "Round of 512";
      case MatchRound.ROUND_1_512:
        return "Round of 1024";
      case MatchRound.PLACEMENT:
        return "Placement";
      case MatchRound.PLAYOFF:
        return "Play-off";
      case MatchRound.CHALLENGER:
        return "Challenger";
      case MatchRound.GROUP_MATCH:
        return "Group Match";
      case MatchRound.ONE_OFF_MATCH:
        return "One-off Match";
      case MatchRound.ONLY:
        return "Only";
      case MatchRound.POOL_MATCH:
        return "Pool Match";
      case MatchRound.PRELIMINARY:
        return "Preliminary";
      case MatchRound.QUALIFIER:
        return "Qualifier";
      case MatchRound.SUPER_EIGHT:
        return "Super Eight";
      case MatchRound.SUPER_FOUR:
        return "Super Four";
      case MatchRound.SUPER_SIXES:
        return "Super Sixes";
      case MatchRound.WARM_UP:
        return "Warm-up";
      case MatchRound.TOUR_MATCH:
        return "Tour Match";
      default:
        return "";
    }
  }
}
