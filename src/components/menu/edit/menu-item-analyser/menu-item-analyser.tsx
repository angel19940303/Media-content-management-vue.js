import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { MenuItemType } from "../../../../models/enums/menu-item-type";
import Button from "@material-ui/core/Button";
import { ApiDataLoader } from "../../../../api/api-data-loader";
import { LoadStatus } from "../../../../models/enums/load_status";
import { StageDataAnalysisUtil } from "../../../../utils/stage-data-analysis-util";
import { StageDataAnalysisResult } from "../../../../models/ui/stage-data-analysis-result";
import { MenuFormData } from "../../../../models/ui/menu-form-data";
import { CircularProgress, Paper } from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import { MenuItemProperty } from "../../../../models/enums/menu-item-property";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.grey["100"],
      padding: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    loader: {
      textAlign: "center",
    },
    body: {
      paddingTop: theme.spacing(0),
    },
    warningContainer: {
      borderRadius: 8,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#ffecb5",
      overflow: "hidden",
      backgroundColor: "#fff3cd",
      color: "#664d03",
    },
    resultRow: {
      paddingLeft: 5,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    successContainer: {
      borderRadius: 8,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#badbcc",
      overflow: "hidden",
      backgroundColor: "#d1e7dd",
      color: "#0f5132",
    },
    errorContainer: {
      color: "#842029",
    },
    rowTitle: {
      display: "flex",
      justifyContent: "left",
      alignItems: "center",
      paddingTop: 5,
      paddingBottom: 5,
      "& svg": {
        paddingRight: 3,
      },
    },
    footer: {
      paddingTop: theme.spacing(1),
    },
  });

interface RProps extends WithStyles<typeof styles> {
  sportCode: string | undefined;
  menuItemData: MenuFormData;
  onUpdate?: (property: number, value: boolean) => void;
  onError?: (loadStatus: number) => void;
}

interface RState {
  isLoading: boolean;
  isError: boolean;
  analysisResult?: StageDataAnalysisResult;
}

class MenuItemAnalyser extends React.Component<RProps, RState> {
  private static readonly WARNING_DRAW_DATA_HIDDEN =
    "Draw is disabled while draw data exists";
  private static readonly WARNING_DRAW_DATA_SHOWN =
    "Draw is enabled while draw data does not exist";
  private static readonly WARNING_LEAGUE_TABLE_HIDDEN =
    "League table is disabled while league table data is available";
  private static readonly WARNING_LEAGUE_TABLE_SHOWN =
    "League table is enabled while league table data does not exist";
  private static readonly WARNING_TOP_SCORERS_HIDDEN =
    "Top scorers are disabled while top scorer data is available";
  private static readonly WARNING_TOP_SCORERS_SHOWN =
    "Top scorers are enabled while top scorer data does not exist";
  private static readonly WARNING_TEAM_STATS_HIDDEN =
    "Team stats are disabled while team stat data is available";
  private static readonly WARNING_TEAM_STATS_SHOWN =
    "Team stats are enabled while team stat data does not exist";
  private static readonly WARNING_TRACKER_WIDGET_HIDDEN =
    "Tracker widget is disabled while tracker widget data is available";
  private static readonly WARNING_TRACKER_WIDGET_SHOWN =
    "Tracker widget is enabled while tracker widget data does not exist";
  private static readonly WARNING_STAGE_HIDDEN =
    "Stage is hidden while its data is not empty";
  private static readonly WARNING_STAGE_SHOWN =
    "Stage is visible while its data is empty";
  private static readonly INFO_STAGE_SETTINGS_VALID =
    "Stage settings match the available data";

  constructor(props: RProps) {
    super(props);
    this.state = { isLoading: false, isError: false };
  }

  render(): React.ReactNode {
    if (
      this.props.sportCode === undefined ||
      this.props.menuItemData.id === undefined ||
      this.props.menuItemData.type !== MenuItemType.STAGE
    ) {
      return "";
    }
    const content = new Array<React.ReactNode>();
    if (this.state.isLoading) {
      content.push(
        <div className={this.props.classes.loader} key="analysis-info-progess">
          <CircularProgress />
        </div>
      );
    } else {
      if (this.state.analysisResult) {
        content.push(this.renderAnalysisResult());
      } else {
        content.push(
          <div key="analysis-info-msg">
            Analyse stage data to help determine which types of data should be
            enabled.
          </div>
        );
      }
      content.push(this.renderError());
    }
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={this.props.classes.paper} elevation={0}>
            <Typography variant="subtitle1" component="div">
              Stage data analysis
            </Typography>
            <div className={this.props.classes.body}>{content}</div>
            {this.renderFooter()}
          </Paper>
        </Grid>
      </Grid>
    );
  }

  private renderAnalysisResult(): React.ReactNode {
    if (!this.state.analysisResult || !this.props.menuItemData) {
      return "";
    }
    const menuItem = this.props.menuItemData;
    const result: StageDataAnalysisResult = this.state.analysisResult;
    const messages = new Array<string>();
    const properties = new Array<number>();
    if (menuItem.noDraw === result.hasDraw) {
      properties.push(MenuItemProperty.NO_DRAW);
      messages.push(
        result.hasDraw
          ? MenuItemAnalyser.WARNING_DRAW_DATA_HIDDEN
          : MenuItemAnalyser.WARNING_DRAW_DATA_SHOWN
      );
    }
    if (menuItem.noTable === result.hasLeagueTable) {
      properties.push(MenuItemProperty.NO_TABLE);
      messages.push(
        result.hasLeagueTable
          ? MenuItemAnalyser.WARNING_LEAGUE_TABLE_HIDDEN
          : MenuItemAnalyser.WARNING_LEAGUE_TABLE_SHOWN
      );
    }
    if (menuItem.noScorers === result.hasTopScorers) {
      properties.push(MenuItemProperty.NO_SCORERS);
      messages.push(
        result.hasDraw
          ? MenuItemAnalyser.WARNING_TOP_SCORERS_HIDDEN
          : MenuItemAnalyser.WARNING_TOP_SCORERS_SHOWN
      );
    }
    if (menuItem.noTeamStats === result.hasTeamStats) {
      properties.push(MenuItemProperty.NO_TEAM_STATS);
      messages.push(
        result.hasDraw
          ? MenuItemAnalyser.WARNING_TEAM_STATS_HIDDEN
          : MenuItemAnalyser.WARNING_TEAM_STATS_SHOWN
      );
    }
    if (menuItem.noTracker === result.hasTrackerWidget) {
      properties.push(MenuItemProperty.NO_TRACKER);
      messages.push(
        result.hasDraw
          ? MenuItemAnalyser.WARNING_TRACKER_WIDGET_HIDDEN
          : MenuItemAnalyser.WARNING_TRACKER_WIDGET_SHOWN
      );
    }
    if (menuItem.hidden === result.hasData) {
      properties.push(MenuItemProperty.HIDDEN);
      messages.push(
        result.hasDraw
          ? MenuItemAnalyser.WARNING_STAGE_HIDDEN
          : MenuItemAnalyser.WARNING_STAGE_SHOWN
      );
    }
    if (messages.length === 0) {
      return (
        <div
          className={this.props.classes.successContainer}
          key="analysis-result-success"
        >
          <div className={this.props.classes.resultRow}>
            <span className={this.props.classes.rowTitle}>
              <CheckCircleIcon fontSize="small" />
              {MenuItemAnalyser.INFO_STAGE_SETTINGS_VALID}
            </span>
          </div>
        </div>
      );
    }
    return (
      <div
        className={this.props.classes.warningContainer}
        key="analysis-result-warning"
      >
        {messages.map((msg: string, index: number) => (
          <div key={index} className={this.props.classes.resultRow}>
            <span className={this.props.classes.rowTitle}>
              <WarningIcon fontSize="small" />
              {msg}
            </span>
            <Button
              size="small"
              onClick={() => this.onFixClick(properties[index])}
            >
              Fix
            </Button>
          </div>
        ))}
      </div>
    );
  }

  private renderFooter(): React.ReactNode {
    if (this.state.isLoading) {
      return "";
    }
    const analyseButtonTitle = this.state.analysisResult
      ? "Re-run analysis"
      : "Analyse";
    return (
      <div className={this.props.classes.footer}>
        <Button onClick={() => this.onAnalyseClick()} variant="contained">
          {analyseButtonTitle}
        </Button>
      </div>
    );
  }

  private renderError(): React.ReactNode {
    if (!this.state.isError) {
      return "";
    }
    return (
      <div className={this.props.classes.errorContainer} key="analysis-error">
        <div className={this.props.classes.resultRow}>
          <span className={this.props.classes.rowTitle}>
            <ErrorIcon fontSize="small" />
            Error occurred while performing analysis
          </span>
        </div>
      </div>
    );
  }

  private onAnalyseClick(): void {
    if (
      this.props.sportCode === undefined ||
      this.props.menuItemData.id === undefined
    ) {
      return;
    }
    this.setState({ isLoading: true });
    const id = this.props.menuItemData.id;
    ApiDataLoader.shared.loadSportInternalStageDetail(
      this.props.sportCode,
      id,
      (status, result) => {
        if (status !== LoadStatus.SUCCESS) {
          this.setState({ isLoading: false, isError: true });
          if (
            LoadStatus.isAuthError(status) &&
            this.props.onError !== undefined
          ) {
            this.props.onError(status);
          }
          return;
        }
        const analysisResult = StageDataAnalysisUtil.create(
          id,
          result
        ).analyse();
        this.setState({
          isLoading: false,
          isError: false,
          analysisResult: analysisResult,
        });
      }
    );
  }

  private onFixClick(property: number): void {
    const value = this.state.analysisResult?.valueForProperty(property);
    if (value !== undefined && this.props.onUpdate !== undefined) {
      this.props.onUpdate(property, value);
    }
  }
}

export default withStyles(styles)(MenuItemAnalyser);
