export class Provider {
  static readonly INTERNAL = 1;
  static readonly ENET = 2;
  static readonly SPORTRADAR = 3;
  static readonly RBALL = 4;
  static readonly BETGENIUS = 8;
  static readonly PERFORM_GROUP = 5;
  static readonly OPTA = 6;
  static readonly WATCH_AND_BET = 7;
  static readonly SCC = 9;
  static readonly CRICTRACKER = 10;
  static readonly BETWAY = 11;
  static readonly RIVALS = 12;
  static readonly CROWDY = 13;
  static readonly PA_MEDIA = 14;
  static readonly BOOKMAKERS = 15;
  static readonly ACCUSCORE = 16;
  static readonly SOFASCORE = 17;
  static readonly SOCCERWAY = 18;
  static readonly BETSAPI = 19;
  static readonly BET365 = 20;
  static readonly EUROPEAN_TOUR_OFFICIAL_WEBSITE = 21;
  static readonly PGA_TOUR_OFFICIAL_WEBSITE = 22;
  static readonly SCORESPRO = 23;
  static readonly ATP_TOUR = 24;
  static readonly WTA_TOUR = 25;
  static readonly WHOSCORED = 26;
  static readonly ESPN = 27;
  static readonly ULTIMATE_TENNIS_STATISTICS = 28;
  static readonly FOOTBALL365 = 29;
  static readonly BETWAY_AFRICA = 30;
  static readonly GAZZETTA = 31;
  static readonly CESKA_TELEVIZE = 32;
  static readonly SPORTAL = 33;
  static readonly BETWAY_REST_OF_AFRICA = 34;

  static titleForProvider(provider: number): string {
    switch (provider) {
      case Provider.INTERNAL:
        return "Internal";
      case Provider.ENET:
        return "Enet";
      case Provider.SPORTRADAR:
        return "Sportradar";
      case Provider.RBALL:
        return "RunningBall";
      case Provider.BETGENIUS:
        return "BetGenius";
      case Provider.PERFORM_GROUP:
        return "Perform Group";
      case Provider.OPTA:
        return "Opta";
      case Provider.WATCH_AND_BET:
        return "Watch and Bet";
      case Provider.SCC:
        return "SportCC";
      case Provider.CRICTRACKER:
        return "Crictracker";
      case Provider.BETWAY:
        return "Betway";
      case Provider.RIVALS:
        return "Rivals";
      case Provider.CROWDY:
        return "Crowdy";
      case Provider.PA_MEDIA:
        return "PA Media";
      case Provider.BOOKMAKERS:
        return "Bookmakers";
      case Provider.ACCUSCORE:
        return "Accustore";
      case Provider.SOFASCORE:
        return "SofaScore";
      case Provider.SOCCERWAY:
        return "Soccerway";
      case Provider.BETSAPI:
        return "BetsApi";
      case Provider.BET365:
        return "Bet365";
      case Provider.EUROPEAN_TOUR_OFFICIAL_WEBSITE:
        return "European Tour Official Website";
      case Provider.PGA_TOUR_OFFICIAL_WEBSITE:
        return "PGA Tour Official Website";
      case Provider.SCORESPRO:
        return "Scores Pro";
      case Provider.ATP_TOUR:
        return "ATP Tour";
      case Provider.WTA_TOUR:
        return "WTA Tour";
      case Provider.WHOSCORED:
        return "WhoScored";
      case Provider.ESPN:
        return "ESPN";
      case Provider.ULTIMATE_TENNIS_STATISTICS:
        return "Ultimate Tennis Statistics";
      case Provider.FOOTBALL365:
        return "Football 365";
      case Provider.BETWAY_AFRICA:
        return "Betway Africa";
      case Provider.GAZZETTA:
        return "Gazzetta";
      case Provider.CESKA_TELEVIZE:
        return "Ceska Televize";
      case Provider.SPORTAL:
        return "Sportal";
      case Provider.BETWAY_REST_OF_AFRICA:
        return "Betway Rest of Africa";
      default:
        return "Unknown (" + provider + ")";
    }
  }

  static initialsForProvider(provider: number): string {
    switch (provider) {
      case Provider.INTERNAL:
        return "I";
      case Provider.ENET:
        return "EP";
      case Provider.SPORTRADAR:
        return "SR";
      case Provider.RBALL:
        return "RB";
      case Provider.BETGENIUS:
        return "BG";
      case Provider.PERFORM_GROUP:
        return "PG";
      case Provider.OPTA:
        return "OP";
      case Provider.WATCH_AND_BET:
        return "WB";
      case Provider.SCC:
        return "SC";
      case Provider.CRICTRACKER:
        return "CR";
      case Provider.BETWAY:
        return "BW";
      case Provider.RIVALS:
        return "RI";
      case Provider.CROWDY:
        return "CW";
      case Provider.PA_MEDIA:
        return "PM";
      case Provider.BOOKMAKERS:
        return "BM";
      case Provider.ACCUSCORE:
        return "AS";
      case Provider.SOFASCORE:
        return "SS";
      case Provider.SOCCERWAY:
        return "SW";
      case Provider.BETSAPI:
        return "BT";
      case Provider.BET365:
        return "B3";
      case Provider.EUROPEAN_TOUR_OFFICIAL_WEBSITE:
        return "ET";
      case Provider.PGA_TOUR_OFFICIAL_WEBSITE:
        return "PT";
      case Provider.SCORESPRO:
        return "SP";
      case Provider.ATP_TOUR:
        return "AT";
      case Provider.WTA_TOUR:
        return "WT";
      case Provider.WHOSCORED:
        return "WS";
      case Provider.ESPN:
        return "ES";
      case Provider.ULTIMATE_TENNIS_STATISTICS:
        return "UT";
      case Provider.FOOTBALL365:
        return "F3";
      case Provider.BETWAY_AFRICA:
        return "BA";
      case Provider.GAZZETTA:
        return "GA";
      case Provider.CESKA_TELEVIZE:
        return "CT";
      case Provider.SPORTAL:
        return "SL";
      case Provider.BETWAY_REST_OF_AFRICA:
        return "BR";
      default:
        return provider.toString(10);
    }
  }

  static codeForProvider(provider: number): string | undefined {
    switch (provider) {
      case Provider.INTERNAL:
        return "internal";
      case Provider.ENET:
        return "enet";
      case Provider.SPORTRADAR:
        return "sportradar";
      case Provider.RBALL:
        return "rball";
      case Provider.BETGENIUS:
        return "bet_genius";
      case Provider.PERFORM_GROUP:
        return "perform_group";
      case Provider.OPTA:
        return "opta";
      case Provider.WATCH_AND_BET:
        return "watch_and_bet";
      case Provider.SCC:
        return "scc";
      case Provider.CRICTRACKER:
        return "crictracker";
      case Provider.BETWAY:
        return "betway";
      case Provider.RIVALS:
        return "rivals";
      case Provider.CROWDY:
        return "crowdy";
      case Provider.PA_MEDIA:
        return "pa_media";
      case Provider.BOOKMAKERS:
        return "bookmakers";
      case Provider.ACCUSCORE:
        return "accustore";
      case Provider.SOFASCORE:
        return "sofascore";
      case Provider.SOCCERWAY:
        return "soccerway";
      case Provider.BETSAPI:
        return "betsapi";
      case Provider.BET365:
        return "bet365";
      case Provider.EUROPEAN_TOUR_OFFICIAL_WEBSITE:
        return "european_tour_official_website";
      case Provider.PGA_TOUR_OFFICIAL_WEBSITE:
        return "pga_tour_official_website";
      case Provider.SCORESPRO:
        return "scores_pro";
      case Provider.ATP_TOUR:
        return "atp_tour";
      case Provider.WTA_TOUR:
        return "wta_tour";
      case Provider.WHOSCORED:
        return "whoscored";
      case Provider.ESPN:
        return "espn";
      case Provider.ULTIMATE_TENNIS_STATISTICS:
        return "ultimate_tennis_statistics";
      case Provider.FOOTBALL365:
        return "football365";
      case Provider.BETWAY_AFRICA:
        return "betway_africa";
      case Provider.GAZZETTA:
        return "gazzetta";
      case Provider.CESKA_TELEVIZE:
        return "ceska_televize";
      case Provider.SPORTAL:
        return "sportal";
      case Provider.BETWAY_REST_OF_AFRICA:
        return "betway-rest-of-africa";
    }
    return undefined;
  }

  static fromCode(code: string): number | undefined {
    switch (code.toLowerCase()) {
      case "internal":
        return Provider.INTERNAL;
      case "enet":
        return Provider.ENET;
      case "sportradar":
        return Provider.SPORTRADAR;
      case "rball":
        return Provider.RBALL;
      case "bet_genius":
        return Provider.BETGENIUS;
      case "perform_group":
        return Provider.PERFORM_GROUP;
      case "opta":
        return Provider.OPTA;
      case "watch_and_bet":
        return Provider.WATCH_AND_BET;
      case "scc":
        return Provider.SCC;
      case "crictracker":
        return Provider.CRICTRACKER;
      case "betway":
        return Provider.BETWAY;
      case "rivals":
        return Provider.RIVALS;
      case "crowdy":
        return Provider.CROWDY;
      case "pa_media":
        return Provider.PA_MEDIA;
      case "bookmakers":
        return Provider.BOOKMAKERS;
      case "accustore":
        return Provider.ACCUSCORE;
      case "sofascore":
        return Provider.SOFASCORE;
      case "soccerway":
        return Provider.SOCCERWAY;
      case "betsapi":
        return Provider.BETSAPI;
      case "bet365":
        return Provider.BET365;
      case "european_tour_official_website":
        return Provider.EUROPEAN_TOUR_OFFICIAL_WEBSITE;
      case "pga_tour_official_website":
        return Provider.PGA_TOUR_OFFICIAL_WEBSITE;
      case "scores_pro":
        return Provider.SCORESPRO;
      case "atp_tour":
        return Provider.ATP_TOUR;
      case "wta_tour":
        return Provider.WTA_TOUR;
      case "whoscored":
        return Provider.WHOSCORED;
      case "espn":
        return Provider.ESPN;
      case "ultimate_tennis_statistics":
        return Provider.ULTIMATE_TENNIS_STATISTICS;
      case "football365":
        return Provider.FOOTBALL365;
      case "betway_africa":
        return Provider.BETWAY_AFRICA;
      case "gazzetta":
        return Provider.GAZZETTA;
      case "ceska_televize":
        return Provider.CESKA_TELEVIZE;
      case "sportal":
        return Provider.SPORTAL;
      case "betway-rest-of-africa":
        return Provider.BETWAY_REST_OF_AFRICA;
    }
    return undefined;
  }

  static readonly PROVIDERS = [
    Provider.ENET,
    Provider.BETGENIUS,
    Provider.RBALL,
    Provider.SCC,
    Provider.INTERNAL,
    Provider.SPORTRADAR,
  ];
}
