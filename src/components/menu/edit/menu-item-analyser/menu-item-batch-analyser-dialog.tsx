import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import { ComponentDataState } from "../../../../models/enums/component-data-state";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { MenuItem } from "../../../../models/menu/menu-item";
import { StageDataAnalysisResult } from "../../../../models/ui/stage-data-analysis-result";
import { ApiDataLoader } from "../../../../api/api-data-loader";
import { LoadStatus } from "../../../../models/enums/load_status";
import { StageDataAnalysisUtil } from "../../../../utils/stage-data-analysis-util";
//import { default as BatchAnalysisResults } from "../../../../config/batch-analysis-result-data.json";
import { MenuItemProperty } from "../../../../models/enums/menu-item-property";
import MenuItemBatchAnalysisResultList from "./menu-item-batch-analysis-result-list";
import LinearProgress from "@material-ui/core/LinearProgress";
import { DateUtil } from "../../../../utils/date-util";

const styles = () =>
  createStyles({
    noPadding: {
      padding: "0",
    },
    loader: {
      padding: "25px",
      "& > div": {
        margin: "10px 0",
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  sport: string;
  menuItems: MenuItem[];
  onClose?: () => void;
  onApplyResults?: (ids: Set<string>, property: number, value: boolean) => void;
  onError?: (loadStatus: number) => void;
}

interface RState {
  dataState: number;
  results: Map<string, StageDataAnalysisResult>;
}

class StageDataBatchAnalyserDialog extends React.Component<RProps, RState> {
  private lastProcessedIndex = -1;
  private isInitialised = false;

  constructor(props: RProps) {
    super(props);
    this.state = {
      dataState: ComponentDataState.INITIALIZING,
      results: new Map<string, StageDataAnalysisResult>(),
    };
  }

  componentDidMount() {
    this.isInitialised = true;
    this.process();
  }

  componentWillUnmount() {
    this.isInitialised = false;
  }

  render(): React.ReactNode {
    return (
      <Dialog
        maxWidth={"sm"}
        fullWidth={true}
        open={true}
        onClose={() => this.onClose()}
        aria-labelledby="stage-data-batch-analysis-dialog-title"
      >
        <DialogTitle id="stage-data-batch-analysis-dialog-title">
          Stage Data Batch Analysis
        </DialogTitle>
        <DialogContent className={this.props.classes.noPadding} dividers>
          {this.renderContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.onClose()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.props.menuItems.length > this.state.results.size) {
      const progress =
        (this.state.results.size / this.props.menuItems.length) * 100;
      return (
        <div className={this.props.classes.loader}>
          Analysing stage data: {this.lastProcessedIndex} /{" "}
          {this.props.menuItems.length} completed
          <LinearProgress variant="determinate" value={progress} />
        </div>
      );
    }
    const rows = this.buildRows();
    return (
      <MenuItemBatchAnalysisResultList
        rows={rows}
        virtualizedWithHeight={340}
        onFix={(id, property, value) => this.onFix(id, property, value)}
        onFixAll={(property, value) => this.onFixAll(property, value)}
      />
    );
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  private process(): void {
    const index = this.lastProcessedIndex + 1;
    if (index < this.props.menuItems.length) {
      const item = this.props.menuItems[index];
      const id = item.id;
      if (id === undefined) {
        if (this.isInitialised) {
          this.lastProcessedIndex = index;
          this.process();
        }
        return;
      }
      const newResults = new Map<string, StageDataAnalysisResult>(
        this.state.results
      );
      ApiDataLoader.shared.loadSportInternalStageDetail(
        this.props.sport,
        id,
        (status, data) => {
          if (!this.isInitialised) {
            return;
          }
          if (status === LoadStatus.SUCCESS) {
            const result = StageDataAnalysisUtil.create(id, data).analyse();
            newResults.set(id, result);
          } else if (LoadStatus.isAuthError(status)) {
            this.setState({
              results: new Map<string, StageDataAnalysisResult>(),
            });
            if (this.props.onError !== undefined) {
              this.props.onError(status);
            }
            return;
          }
          this.lastProcessedIndex = index;
          this.setState({ results: newResults });
          this.process();
        }
      );
      /*setTimeout(() => {
                if (!this.isInitialised) {
                    return;
                }
                if (index < BatchAnalysisResults.length) {
                    const result = BatchAnalysisResults[index];
                    const resultData = new StageDataAnalysisResult(result.result.id, result.result.hasData, result.result.hasLeagueTable, result.result.hasDraw, result.result.hasTopScorers, result.result.hasTeamStats, result.result.hasTrackerWidget);
                    const newResults = new Map<string, StageDataAnalysisResult>(this.state.results);
                    newResults.set(result.id, resultData);
                    this.setState({results: newResults});
                }
                this.lastProcessedIndex = index;
                this.process();
            }, 3);*/
    }
  }

  private buildRows(): Array<any> {
    const rows = new Array<any>();
    const nowTimestamp = DateUtil.dateToApiTimestamp(new Date(), true);
    this.props.menuItems.forEach((item) => {
      if (item.id === undefined) {
        return;
      }
      const result = this.state.results.get(item.id);
      if (result === undefined) {
        return;
      }
      let lastEnd: number | undefined = undefined;
      if (item.children) {
        item.children.forEach((child) => {
          if (
            child.timeRange !== undefined &&
            (lastEnd === undefined || lastEnd <= child.timeRange.end)
          ) {
            lastEnd = child.timeRange.end;
          }
        });
      }
      const isOldHiddenStage =
        item.hidden && lastEnd !== undefined && lastEnd < nowTimestamp;
      const shouldFixHidden =
        result.hasData === item.hidden && !isOldHiddenStage;
      if (
        result.hasDraw === item.noDraw ||
        result.hasLeagueTable === item.noTable ||
        result.hasTopScorers === item.noScorers ||
        result.hasTeamStats === item.noTeamStats ||
        result.hasTrackerWidget === item.noTracker ||
        shouldFixHidden
      ) {
        const title = item.path.length > 0 ? item.path.join(" - ") : item.title;
        rows.push({ id: item.id, content: title, isTitle: true });
        if (result.hasDraw === item.noDraw) {
          const message = result.hasDraw
            ? "Draw should be enabled"
            : "Draw should be disabled";
          rows.push({
            id: item.id,
            content: message,
            isTitle: false,
            property: MenuItemProperty.NO_DRAW,
            value: result.hasDraw,
          });
        }
        if (result.hasLeagueTable === item.noTable) {
          const message = result.hasLeagueTable
            ? "League table should be enabled"
            : "League table should be disabled";
          rows.push({
            id: item.id,
            content: message,
            isTitle: false,
            property: MenuItemProperty.NO_TABLE,
            value: result.hasLeagueTable,
          });
        }
        if (result.hasTopScorers === item.noScorers) {
          const message = result.hasTopScorers
            ? "Top scorers should be enabled"
            : "Top scorers should be disabled";
          rows.push({
            id: item.id,
            content: message,
            isTitle: false,
            property: MenuItemProperty.NO_SCORERS,
            value: result.hasTopScorers,
          });
        }
        if (result.hasTeamStats === item.noTeamStats) {
          const message = result.hasTeamStats
            ? "Team stats should be enabled"
            : "Team stats should be disabled";
          rows.push({
            id: item.id,
            content: message,
            isTitle: false,
            property: MenuItemProperty.NO_TEAM_STATS,
            value: result.hasTeamStats,
          });
        }
        if (result.hasTrackerWidget === item.noTracker) {
          const message = result.hasTrackerWidget
            ? "Tracker should be enabled"
            : "Tracker should be disabled";
          rows.push({
            id: item.id,
            content: message,
            isTitle: false,
            property: MenuItemProperty.NO_TRACKER,
            value: result.hasTrackerWidget,
          });
        }
        if (shouldFixHidden) {
          const message = result.hasData
            ? "Stage should be visible"
            : "Stage should be hidden";
          rows.push({
            id: item.id,
            content: message,
            isTitle: false,
            property: MenuItemProperty.HIDDEN,
            value: result.hasData,
          });
        }
      }
    });
    return rows;
  }

  private onFix(id: string, property: number, value: boolean): void {
    const resultToApply = this.state.results.get(id);
    if (resultToApply) {
      const valueForProperty = resultToApply.valueForProperty(property);
      if (
        valueForProperty !== undefined &&
        value === !valueForProperty &&
        this.props.onApplyResults !== undefined
      ) {
        const ids = new Set<string>([id]);
        this.props.onApplyResults(ids, property, !value);
      }
    }
  }

  private onFixAll(property: number, value: boolean): void {
    const ids = new Set<string>();
    this.state.results.forEach((result) => {
      const valueForProperty = result.valueForProperty(property);
      if (valueForProperty !== undefined && value === !valueForProperty) {
        ids.add(result.id);
      }
    });
    if (ids.size > 0 && this.props.onApplyResults) {
      this.props.onApplyResults(ids, property, !value);
    }
  }
}

export default withStyles(styles)(StageDataBatchAnalyserDialog);
