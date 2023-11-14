export class TeamStats {
  readonly second_yellow?: number;
  readonly assists?: number;
  readonly away_without_win?: number;
  readonly boreDraws?: number;
  readonly bore_draws_percentage?: number;
  readonly both_to_score?: number;
  readonly both_to_score_percentage?: number;
  readonly comebacks?: number;
  readonly conceded?: number;
  readonly conceded_one_or_more_goals?: number;
  readonly conceded_one_or_more_goals_percentage?: number;
  readonly early_goals_team?: number;
  readonly equaliser_goals?: number;
  readonly first_goal?: number;
  readonly first_goal_percentage?: number;
  readonly games_without_goals?: number;
  readonly goal_in_both_halves?: number;
  readonly goal_in_both_halves_percentage?: number;
  readonly goal_ratio_minute_1x15?: number;
  readonly goal_ratio_minute_16x30?: number;
  readonly goal_ratio_minute_31x45?: number;
  readonly goal_ratio_minute_46x60?: number;
  readonly goal_ratio_minute_61x75?: number;
  readonly goal_ratio_minute_76x90?: number;
  readonly goals?: number;
  readonly goals_ratio?: number;
  readonly home_without_win?: number;
  readonly last_gasp_goals_team?: number;
  readonly last_goal?: number;
  readonly last_goal_percentage?: number;
  readonly lost_in_row?: number;
  readonly lost_lead_to_lose?: number;
  readonly matches_won_away_percentage?: number;
  readonly matches_won_home_percentage?: number;
  readonly noconceding_in_row?: number;
  readonly own_goals?: number;
  readonly penalty_goals?: number;
  readonly red?: number;
  readonly scored_in_row?: number;
  readonly time_between_goals_scored?: number;
  readonly time_between_goals_scored_conceded?: number;
  readonly total_cards_yellow_red?: number;
  readonly total_cards_yellow_red_per_game_percentage?: number;
  readonly total_clean_sheets?: number;
  readonly total_games?: number;
  readonly total_games_without_goal?: number;
  readonly total_goals?: number;
  readonly total_goals_first_half?: number;
  readonly total_goals_first_half_percentage?: number;
  readonly total_goals_second_half?: number;
  readonly total_goals_second_half_percentage?: number;
  readonly total_goals_starting_players?: number;
  readonly total_goals_starting_players_percentage?: number;
  readonly total_goals_subbed_players?: number;
  readonly total_goals_subbed_players_percentage?: number;
  readonly when_1x0_down_points?: number;
  readonly when_1x0_down_points_percentage?: number;
  readonly when_1x0_up_points?: number;
  readonly when_1x0_up_points_percentage?: number;
  readonly when_2x0_down_points?: number;
  readonly when_2x0_down_points_percentage?: number;
  readonly when_2x0_up_points?: number;
  readonly when_2x0_up_points_percentage?: number;
  readonly won_2_down?: number;
  readonly won_2_down_percentage?: number;
  readonly won_at_away?: number;
  readonly won_at_home?: number;
  readonly won_first_half?: number;
  readonly won_first_half_percentage?: number;
  readonly won_in_row?: number;
  readonly won_second_half?: number;
  readonly won_second_half_percentage?: number;
  readonly won_to_nil?: number;
  readonly won_to_nil_percentage?: number;
  readonly won_when_1x0_down?: number;
  readonly won_when_1x0_down_percentage?: number;
  readonly won_when_1x0_up?: number;
  readonly won_when_1x0_up_percentage?: number;
  readonly won_when_2x0_up?: number;
  readonly won_when_2x0_up_percentage?: number;
  readonly yellow?: number;
  readonly yellow_cards_per_game?: number;

  private constructor(
    second_yellow: number | undefined,
    assists: number | undefined,
    away_without_win: number | undefined,
    boreDraws: number | undefined,
    bore_draws_percentage: number | undefined,
    both_to_score: number | undefined,
    both_to_score_percentage: number | undefined,
    comebacks: number | undefined,
    conceded: number | undefined,
    conceded_one_or_more_goals: number | undefined,
    conceded_one_or_more_goals_percentage: number | undefined,
    early_goals_team: number | undefined,
    equaliser_goals: number | undefined,
    first_goal: number | undefined,
    first_goal_percentage: number | undefined,
    games_without_goals: number | undefined,
    goal_in_both_halves: number | undefined,
    goal_in_both_halves_percentage: number | undefined,
    goal_ratio_minute_1x15: number | undefined,
    goal_ratio_minute_16x30: number | undefined,
    goal_ratio_minute_31x45: number | undefined,
    goal_ratio_minute_46x60: number | undefined,
    goal_ratio_minute_61x75: number | undefined,
    goal_ratio_minute_76x90: number | undefined,
    goals: number | undefined,
    goals_ratio: number | undefined,
    home_without_win: number | undefined,
    last_gasp_goals_team: number | undefined,
    last_goal: number | undefined,
    last_goal_percentage: number | undefined,
    lost_in_row: number | undefined,
    lost_lead_to_lose: number | undefined,
    matches_won_away_percentage: number | undefined,
    matches_won_home_percentage: number | undefined,
    noconceding_in_row: number | undefined,
    own_goals: number | undefined,
    penalty_goals: number | undefined,
    red: number | undefined,
    scored_in_row: number | undefined,
    time_between_goals_scored: number | undefined,
    time_between_goals_scored_conceded: number | undefined,
    total_cards_yellow_red: number | undefined,
    total_cards_yellow_red_per_game_percentage: number | undefined,
    total_clean_sheets: number | undefined,
    total_games: number | undefined,
    total_games_without_goal: number | undefined,
    total_goals: number | undefined,
    total_goals_first_half: number | undefined,
    total_goals_first_half_percentage: number | undefined,
    total_goals_second_half: number | undefined,
    total_goals_second_half_percentage: number | undefined,
    total_goals_starting_players: number | undefined,
    total_goals_starting_players_percentage: number | undefined,
    total_goals_subbed_players: number | undefined,
    total_goals_subbed_players_percentage: number | undefined,
    when_1x0_down_points: number | undefined,
    when_1x0_down_points_percentage: number | undefined,
    when_1x0_up_points: number | undefined,
    when_1x0_up_points_percentage: number | undefined,
    when_2x0_down_points: number | undefined,
    when_2x0_down_points_percentage: number | undefined,
    when_2x0_up_points: number | undefined,
    when_2x0_up_points_percentage: number | undefined,
    won_2_down: number | undefined,
    won_2_down_percentage: number | undefined,
    won_at_away: number | undefined,
    won_at_home: number | undefined,
    won_first_half: number | undefined,
    won_first_half_percentage: number | undefined,
    won_in_row: number | undefined,
    won_second_half: number | undefined,
    won_second_half_percentage: number | undefined,
    won_to_nil: number | undefined,
    won_to_nil_percentage: number | undefined,
    won_when_1x0_down: number | undefined,
    won_when_1x0_down_percentage: number | undefined,
    won_when_1x0_up: number | undefined,
    won_when_1x0_up_percentage: number | undefined,
    won_when_2x0_up: number | undefined,
    won_when_2x0_up_percentage: number | undefined,
    yellow: number | undefined,
    yellow_cards_per_game: number | undefined
  ) {
    this.second_yellow = second_yellow;
    this.assists = assists;
    this.away_without_win = away_without_win;
    this.boreDraws = boreDraws;
    this.bore_draws_percentage = bore_draws_percentage;
    this.both_to_score = both_to_score;
    this.both_to_score_percentage = both_to_score_percentage;
    this.comebacks = comebacks;
    this.conceded = conceded;
    this.conceded_one_or_more_goals = conceded_one_or_more_goals;
    this.conceded_one_or_more_goals_percentage = conceded_one_or_more_goals_percentage;
    this.early_goals_team = early_goals_team;
    this.equaliser_goals = equaliser_goals;
    this.first_goal = first_goal;
    this.first_goal_percentage = first_goal_percentage;
    this.games_without_goals = games_without_goals;
    this.goal_in_both_halves = goal_in_both_halves;
    this.goal_in_both_halves_percentage = goal_in_both_halves_percentage;
    this.goal_ratio_minute_1x15 = goal_ratio_minute_1x15;
    this.goal_ratio_minute_16x30 = goal_ratio_minute_16x30;
    this.goal_ratio_minute_31x45 = goal_ratio_minute_31x45;
    this.goal_ratio_minute_46x60 = goal_ratio_minute_46x60;
    this.goal_ratio_minute_61x75 = goal_ratio_minute_61x75;
    this.goal_ratio_minute_76x90 = goal_ratio_minute_76x90;
    this.goals = goals;
    this.goals_ratio = goals_ratio;
    this.home_without_win = home_without_win;
    this.last_gasp_goals_team = last_gasp_goals_team;
    this.last_goal = last_goal;
    this.last_goal_percentage = last_goal_percentage;
    this.lost_in_row = lost_in_row;
    this.lost_lead_to_lose = lost_lead_to_lose;
    this.matches_won_away_percentage = matches_won_away_percentage;
    this.matches_won_home_percentage = matches_won_home_percentage;
    this.noconceding_in_row = noconceding_in_row;
    this.own_goals = own_goals;
    this.penalty_goals = penalty_goals;
    this.red = red;
    this.scored_in_row = scored_in_row;
    this.time_between_goals_scored = time_between_goals_scored;
    this.time_between_goals_scored_conceded = time_between_goals_scored_conceded;
    this.total_cards_yellow_red = total_cards_yellow_red;
    this.total_cards_yellow_red_per_game_percentage = total_cards_yellow_red_per_game_percentage;
    this.total_clean_sheets = total_clean_sheets;
    this.total_games = total_games;
    this.total_games_without_goal = total_games_without_goal;
    this.total_goals = total_goals;
    this.total_goals_first_half = total_goals_first_half;
    this.total_goals_first_half_percentage = total_goals_first_half_percentage;
    this.total_goals_second_half = total_goals_second_half;
    this.total_goals_second_half_percentage = total_goals_second_half_percentage;
    this.total_goals_starting_players = total_goals_starting_players;
    this.total_goals_starting_players_percentage = total_goals_starting_players_percentage;
    this.total_goals_subbed_players = total_goals_subbed_players;
    this.total_goals_subbed_players_percentage = total_goals_subbed_players_percentage;
    this.when_1x0_down_points = when_1x0_down_points;
    this.when_1x0_down_points_percentage = when_1x0_down_points_percentage;
    this.when_1x0_up_points = when_1x0_up_points;
    this.when_1x0_up_points_percentage = when_1x0_up_points_percentage;
    this.when_2x0_down_points = when_2x0_down_points;
    this.when_2x0_down_points_percentage = when_2x0_down_points_percentage;
    this.when_2x0_up_points = when_2x0_up_points;
    this.when_2x0_up_points_percentage = when_2x0_up_points_percentage;
    this.won_2_down = won_2_down;
    this.won_2_down_percentage = won_2_down_percentage;
    this.won_at_away = won_at_away;
    this.won_at_home = won_at_home;
    this.won_first_half = won_first_half;
    this.won_first_half_percentage = won_first_half_percentage;
    this.won_in_row = won_in_row;
    this.won_second_half = won_second_half;
    this.won_second_half_percentage = won_second_half_percentage;
    this.won_to_nil = won_to_nil;
    this.won_to_nil_percentage = won_to_nil_percentage;
    this.won_when_1x0_down = won_when_1x0_down;
    this.won_when_1x0_down_percentage = won_when_1x0_down_percentage;
    this.won_when_1x0_up = won_when_1x0_up;
    this.won_when_1x0_up_percentage = won_when_1x0_up_percentage;
    this.won_when_2x0_up = won_when_2x0_up;
    this.won_when_2x0_up_percentage = won_when_2x0_up_percentage;
    this.yellow = yellow;
    this.yellow_cards_per_game = yellow_cards_per_game;
  }

  static fromData(data?: any): TeamStats | undefined {
    if (data === undefined) {
      return undefined;
    }
    const second_yellow: number | undefined = data["second_yellow"];
    const assists: number | undefined = data["assists"];
    const away_without_win: number | undefined = data["away_without_win"];
    const boreDraws: number | undefined = data["boreDraws"];
    const bore_draws_percentage: number | undefined =
      data["bore_draws_percentage"];
    const both_to_score: number | undefined = data["both_to_score"];
    const both_to_score_percentage: number | undefined =
      data["both_to_score_percentage"];
    const comebacks: number | undefined = data["comebacks"];
    const conceded: number | undefined = data["conceded"];
    const conceded_one_or_more_goals: number | undefined =
      data["conceded_one_or_more_goals"];
    const conceded_one_or_more_goals_percentage: number | undefined =
      data["conceded_one_or_more_goals_percentage"];
    const early_goals_team: number | undefined = data["early_goals_team"];
    const equaliser_goals: number | undefined = data["equaliser_goals"];
    const first_goal: number | undefined = data["first_goal"];
    const first_goal_percentage: number | undefined =
      data["first_goal_percentage"];
    const games_without_goals: number | undefined = data["games_without_goals"];
    const goal_in_both_halves: number | undefined = data["goal_in_both_halves"];
    const goal_in_both_halves_percentage: number | undefined =
      data["goal_in_both_halves_percentage"];
    const goal_ratio_minute_1x15: number | undefined =
      data["goal_ratio_minute_1x15"];
    const goal_ratio_minute_16x30: number | undefined =
      data["goal_ratio_minute_16x30"];
    const goal_ratio_minute_31x45: number | undefined =
      data["goal_ratio_minute_31x45"];
    const goal_ratio_minute_46x60: number | undefined =
      data["goal_ratio_minute_46x60"];
    const goal_ratio_minute_61x75: number | undefined =
      data["goal_ratio_minute_61x75"];
    const goal_ratio_minute_76x90: number | undefined =
      data["goal_ratio_minute_76x90"];
    const goals: number | undefined = data["goals"];
    const goals_ratio: number | undefined = data["goals_ratio"];
    const home_without_win: number | undefined = data["home_without_win"];
    const last_gasp_goals_team: number | undefined =
      data["last_gasp_goals_team"];
    const last_goal: number | undefined = data["last_goal"];
    const last_goal_percentage: number | undefined =
      data["last_goal_percentage"];
    const lost_in_row: number | undefined = data["lost_in_row"];
    const lost_lead_to_lose: number | undefined = data["lost_lead_to_lose"];
    const matches_won_away_percentage: number | undefined =
      data["matches_won_away_percentage"];
    const matches_won_home_percentage: number | undefined =
      data["matches_won_home_percentage"];
    const noconceding_in_row: number | undefined = data["noconceding_in_row"];
    const own_goals: number | undefined = data["own_goals"];
    const penalty_goals: number | undefined = data["penalty_goals"];
    const red: number | undefined = data["red"];
    const scored_in_row: number | undefined = data["scored_in_row"];
    const time_between_goals_scored: number | undefined =
      data["time_between_goals_scored"];
    const time_between_goals_scored_conceded: number | undefined =
      data["time_between_goals_scored_conceded"];
    const total_cards_yellow_red: number | undefined =
      data["total_cards_yellow_red"];
    const total_cards_yellow_red_per_game_percentage: number | undefined =
      data["total_cards_yellow_red_per_game_percentage"];
    const total_clean_sheets: number | undefined = data["total_clean_sheets"];
    const total_games: number | undefined = data["total_games"];
    const total_games_without_goal: number | undefined =
      data["total_games_without_goal"];
    const total_goals: number | undefined = data["total_goals"];
    const total_goals_first_half: number | undefined =
      data["total_goals_first_half"];
    const total_goals_first_half_percentage: number | undefined =
      data["total_goals_first_half_percentage"];
    const total_goals_second_half: number | undefined =
      data["total_goals_second_half"];
    const total_goals_second_half_percentage: number | undefined =
      data["total_goals_second_half_percentage"];
    const total_goals_starting_players: number | undefined =
      data["total_goals_starting_players"];
    const total_goals_starting_players_percentage: number | undefined =
      data["total_goals_starting_players_percentage"];
    const total_goals_subbed_players: number | undefined =
      data["total_goals_subbed_players"];
    const total_goals_subbed_players_percentage: number | undefined =
      data["total_goals_subbed_players_percentage"];
    const when_1x0_down_points: number | undefined =
      data["when_1x0_down_points"];
    const when_1x0_down_points_percentage: number | undefined =
      data["when_1x0_down_points_percentage"];
    const when_1x0_up_points: number | undefined = data["when_1x0_up_points"];
    const when_1x0_up_points_percentage: number | undefined =
      data["when_1x0_up_points_percentage"];
    const when_2x0_down_points: number | undefined =
      data["when_2x0_down_points"];
    const when_2x0_down_points_percentage: number | undefined =
      data["when_2x0_down_points_percentage"];
    const when_2x0_up_points: number | undefined = data["when_2x0_up_points"];
    const when_2x0_up_points_percentage: number | undefined =
      data["when_2x0_up_points_percentage"];
    const won_2_down: number | undefined = data["won_2_down"];
    const won_2_down_percentage: number | undefined =
      data["won_2_down_percentage"];
    const won_at_away: number | undefined = data["won_at_away"];
    const won_at_home: number | undefined = data["won_at_home"];
    const won_first_half: number | undefined = data["won_first_half"];
    const won_first_half_percentage: number | undefined =
      data["won_first_half_percentage"];
    const won_in_row: number | undefined = data["won_in_row"];
    const won_second_half: number | undefined = data["won_second_half"];
    const won_second_half_percentage: number | undefined =
      data["won_second_half_percentage"];
    const won_to_nil: number | undefined = data["won_to_nil"];
    const won_to_nil_percentage: number | undefined =
      data["won_to_nil_percentage"];
    const won_when_1x0_down: number | undefined = data["won_when_1x0_down"];
    const won_when_1x0_down_percentage: number | undefined =
      data["won_when_1x0_down_percentage"];
    const won_when_1x0_up: number | undefined = data["won_when_1x0_up"];
    const won_when_1x0_up_percentage: number | undefined =
      data["won_when_1x0_up_percentage"];
    const won_when_2x0_up: number | undefined = data["won_when_2x0_up"];
    const won_when_2x0_up_percentage: number | undefined =
      data["won_when_2x0_up_percentage"];
    const yellow: number | undefined = data["yellow"];
    const yellow_cards_per_game: number | undefined =
      data["yellow_cards_per_game"];

    return new TeamStats(
      second_yellow,
      assists,
      away_without_win,
      boreDraws,
      bore_draws_percentage,
      both_to_score,
      both_to_score_percentage,
      comebacks,
      conceded,
      conceded_one_or_more_goals,
      conceded_one_or_more_goals_percentage,
      early_goals_team,
      equaliser_goals,
      first_goal,
      first_goal_percentage,
      games_without_goals,
      goal_in_both_halves,
      goal_in_both_halves_percentage,
      goal_ratio_minute_1x15,
      goal_ratio_minute_16x30,
      goal_ratio_minute_31x45,
      goal_ratio_minute_46x60,
      goal_ratio_minute_61x75,
      goal_ratio_minute_76x90,
      goals,
      goals_ratio,
      home_without_win,
      last_gasp_goals_team,
      last_goal,
      last_goal_percentage,
      lost_in_row,
      lost_lead_to_lose,
      matches_won_away_percentage,
      matches_won_home_percentage,
      noconceding_in_row,
      own_goals,
      penalty_goals,
      red,
      scored_in_row,
      time_between_goals_scored,
      time_between_goals_scored_conceded,
      total_cards_yellow_red,
      total_cards_yellow_red_per_game_percentage,
      total_clean_sheets,
      total_games,
      total_games_without_goal,
      total_goals,
      total_goals_first_half,
      total_goals_first_half_percentage,
      total_goals_second_half,
      total_goals_second_half_percentage,
      total_goals_starting_players,
      total_goals_starting_players_percentage,
      total_goals_subbed_players,
      total_goals_subbed_players_percentage,
      when_1x0_down_points,
      when_1x0_down_points_percentage,
      when_1x0_up_points,
      when_1x0_up_points_percentage,
      when_2x0_down_points,
      when_2x0_down_points_percentage,
      when_2x0_up_points,
      when_2x0_up_points_percentage,
      won_2_down,
      won_2_down_percentage,
      won_at_away,
      won_at_home,
      won_first_half,
      won_first_half_percentage,
      won_in_row,
      won_second_half,
      won_second_half_percentage,
      won_to_nil,
      won_to_nil_percentage,
      won_when_1x0_down,
      won_when_1x0_down_percentage,
      won_when_1x0_up,
      won_when_1x0_up_percentage,
      won_when_2x0_up,
      won_when_2x0_up_percentage,
      yellow,
      yellow_cards_per_game
    );
  }
}
