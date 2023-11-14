export class TeamStatsExtended {
  readonly average_possession?: number;
  readonly corner_taken?: number;
  readonly corner_taken_per_game?: number;
  readonly defensive_error?: number;
  readonly direct_freekick?: number;
  readonly direct_freekick_perc?: number;
  readonly elapsed_plus_per_game?: number;
  readonly foul_commit?: number;
  readonly foul_commit_per_game?: number;
  readonly foulsuffered?: number;
  readonly goal_outside_box?: number;
  readonly goal_outside_box_perc?: number;
  readonly head_goal?: number;
  readonly head_goal_perc?: number;
  readonly offside?: number;
  readonly offside_per_game?: number;
  readonly penalties_awarded?: number;
  readonly penalty_commit?: number;
  readonly penalty_commit_perc?: number;
  readonly penalty_missed?: number;
  readonly penalty_missed_perc?: number;
  readonly penalty_saves?: number;
  readonly shotoff?: number;
  readonly shotoff_per_game?: number;
  readonly shoton?: number;
  readonly shoton_per_game?: number;
  readonly shotson_per_goal?: number;
  readonly strike_goal?: number;
  readonly strike_goal_perc?: number;
  readonly total_shots?: number;
  readonly woodwork?: number;
  private constructor(
    average_possession: number | undefined,
    corner_taken: number | undefined,
    corner_taken_per_game: number | undefined,
    defensive_error: number | undefined,
    direct_freekick: number | undefined,
    direct_freekick_perc: number | undefined,
    elapsed_plus_per_game: number | undefined,
    foul_commit: number | undefined,
    foul_commit_per_game: number | undefined,
    foulsuffered: number | undefined,
    goal_outside_box: number | undefined,
    goal_outside_box_perc: number | undefined,
    head_goal: number | undefined,
    head_goal_perc: number | undefined,
    offside: number | undefined,
    offside_per_game: number | undefined,
    penalties_awarded: number | undefined,
    penalty_commit: number | undefined,
    penalty_commit_perc: number | undefined,
    penalty_missed: number | undefined,
    penalty_missed_perc: number | undefined,
    penalty_saves: number | undefined,
    shotoff: number | undefined,
    shotoff_per_game: number | undefined,
    shoton: number | undefined,
    shoton_per_game: number | undefined,
    shotson_per_goal: number | undefined,
    strike_goal: number | undefined,
    strike_goal_perc: number | undefined,
    total_shots: number | undefined,
    woodwork: number | undefined
  ) {
    this.average_possession = average_possession;
    this.corner_taken = corner_taken;
    this.corner_taken_per_game = corner_taken_per_game;
    this.defensive_error = defensive_error;
    this.direct_freekick = direct_freekick;
    this.direct_freekick_perc = direct_freekick_perc;
    this.elapsed_plus_per_game = elapsed_plus_per_game;
    this.foul_commit = foul_commit;
    this.foul_commit_per_game = foul_commit_per_game;
    this.foulsuffered = foulsuffered;
    this.goal_outside_box = goal_outside_box;
    this.goal_outside_box_perc = goal_outside_box_perc;
    this.head_goal = head_goal;
    this.head_goal_perc = head_goal_perc;
    this.offside = offside;
    this.offside_per_game = offside_per_game;
    this.penalties_awarded = penalties_awarded;
    this.penalty_commit = penalty_commit;
    this.penalty_commit_perc = penalty_commit_perc;
    this.penalty_missed = penalty_missed;
    this.penalty_missed_perc = penalty_missed_perc;
    this.penalty_saves = penalty_saves;
    this.shotoff = shotoff;
    this.shotoff_per_game = shotoff_per_game;
    this.shoton = shoton;
    this.shoton_per_game = shoton_per_game;
    this.shotson_per_goal = shotson_per_goal;
    this.strike_goal = strike_goal;
    this.strike_goal_perc = strike_goal_perc;
    this.total_shots = total_shots;
    this.woodwork = woodwork;
  }

  static fromData(data?: any): TeamStatsExtended | undefined {
    if (data === undefined) {
      return undefined;
    }
    const average_possession = data["average_possession"];
    const corner_taken = data["corner_taken"];
    const corner_taken_per_game = data["corner_taken_per_game"];
    const defensive_error = data["defensive_error"];
    const direct_freekick = data["direct_freekick"];
    const direct_freekick_perc = data["direct_freekick_perc"];
    const elapsed_plus_per_game = data["elapsed_plus_per_game"];
    const foul_commit = data["foul_commit"];
    const foul_commit_per_game = data["foul_commit_per_game"];
    const foulsuffered = data["foulsuffered"];
    const goal_outside_box = data["goal_outside_box"];
    const goal_outside_box_perc = data["goal_outside_box_perc"];
    const head_goal = data["head_goal"];
    const head_goal_perc = data["head_goal_perc"];
    const offside = data["offside"];
    const offside_per_game = data["offside_per_game"];
    const penalties_awarded = data["penalties_awarded"];
    const penalty_commit = data["penalty_commit"];
    const penalty_commit_perc = data["penalty_commit_perc"];
    const penalty_missed = data["penalty_missed"];
    const penalty_missed_perc = data["penalty_missed_perc"];
    const penalty_saves = data["penalty_saves"];
    const shotoff = data["shotoff"];
    const shotoff_per_game = data["shotoff_per_game"];
    const shoton = data["shoton"];
    const shoton_per_game = data["shoton_per_game"];
    const shotson_per_goal = data["shotson_per_goal"];
    const strike_goal = data["strike_goal"];
    const strike_goal_perc = data["strike_goal_perc"];
    const total_shots = data["total_shots"];
    const woodwork = data["woodwork"];
    return new TeamStatsExtended(
      average_possession,
      corner_taken,
      corner_taken_per_game,
      defensive_error,
      direct_freekick,
      direct_freekick_perc,
      elapsed_plus_per_game,
      foul_commit,
      foul_commit_per_game,
      foulsuffered,
      goal_outside_box,
      goal_outside_box_perc,
      head_goal,
      head_goal_perc,
      offside,
      offside_per_game,
      penalties_awarded,
      penalty_commit,
      penalty_commit_perc,
      penalty_missed,
      penalty_missed_perc,
      penalty_saves,
      shotoff,
      shotoff_per_game,
      shoton,
      shoton_per_game,
      shotson_per_goal,
      strike_goal,
      strike_goal_perc,
      total_shots,
      woodwork
    );
  }
}
