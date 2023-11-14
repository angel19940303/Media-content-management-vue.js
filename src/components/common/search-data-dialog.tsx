import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import React, { ChangeEvent } from "react";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import { Match } from "../../models/api-data/match";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import LoadingIndicator from "./loading-indicator";
import { ApiDataLoader } from "../../api/api-data-loader";
import { LoadStatus } from "../../models/enums/load_status";
import { SearchResultCollection } from "../../models/api-data/search-result-collection";
import TextField from "@material-ui/core/TextField";
import { Team } from "../../models/api-data/team";
import { Category } from "../../models/api-data/category";
import { Stage } from "../../models/api-data/stage";

const styles = () =>
  createStyles({
    title: {
      padding: 10,
    },
    content: {
      height: 400,
      padding: 0,
    },
    resultHeader: {
      backgroundColor: "#efefef",
      padding: "5px 10px",
    },
    simpleRow: {
      borderBottom: "1px solid #eee",
      padding: "5px 10px",
      "&:last-child": {
        borderBottom: "none",
      },
      "&:hover": {
        backgroundColor: "#f6f6f6",
        cursor: "pointer",
      },
    },
    matchRow: {
      borderBottom: "1px solid #eee",
      padding: "5px 10px",
      "& div": {
        display: "flex",
      },
      "&:last-child": {
        borderBottom: "none",
      },
      "&:hover": {
        backgroundColor: "#f6f6f6",
        cursor: "pointer",
      },
    },
    infoRow: {
      padding: "5px 10px",
    },
    matchRowDate: {
      flex: "55px 0 0",
    },
    matchRowTeam: {
      flex: 1,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  sport: string;
  showTeams?: boolean;
  showCategories?: boolean;
  showStages?: boolean;
  showMatches?: boolean;
  onItemSelect?: (item: Team | Category | Stage | Match) => void;
  onClose?: () => void;
}

interface RState {
  isLoading: boolean;
  isError: boolean;
  searchString?: string;
  results?: SearchResultCollection;
}

class SearchDataDialog extends React.Component<RProps, RState> {
  private static readonly MIN_SEARCH_STR_LENGTH = 3;
  private static readonly LOAD_DELAY_MS = 250;

  private delayTimer: any | null;

  constructor(props: RProps) {
    super(props);
    this.delayTimer = null;
    this.state = {
      isLoading: false,
      isError: false,
    };
  }

  private scheduleLoadSearchResults(): void {
    this.clearLoadDelayTimer();
    this.delayTimer = setTimeout(() => {
      this.loadSearchResults();
      this.delayTimer = null;
    }, SearchDataDialog.LOAD_DELAY_MS);
  }

  private clearLoadDelayTimer(): void {
    if (this.delayTimer !== null) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  }

  private loadSearchResults(): void {
    if (
      this.state.searchString === undefined ||
      this.state.searchString.length < SearchDataDialog.MIN_SEARCH_STR_LENGTH
    ) {
      this.setState({ results: undefined });
      return;
    }
    ApiDataLoader.shared.searchData(
      this.props.sport,
      this.state.searchString,
      (status: number, data?: any) => {
        if (status === LoadStatus.SUCCESS) {
          this.setState({
            isLoading: false,
            isError: false,
            results: SearchResultCollection.fromData(data),
          });
        } else {
          this.setState({
            isLoading: false,
            isError: true,
          });
        }
      }
    );
  }

  render(): React.ReactNode {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className={this.props.classes.title}>
          {this.renderTitle()}
        </DialogTitle>
        <DialogContent className={this.props.classes.content} dividers>
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

  reset(): void {
    this.setState({
      isLoading: false,
      isError: false,
      searchString: undefined,
      results: undefined,
    });
  }

  private renderTitle(): React.ReactNode {
    const hasShowSettings = this.hasShowSettings();
    const searchTypes = new Array<string>();
    if (!hasShowSettings || this.props.showTeams === true) {
      searchTypes.push("teams");
    }
    if (!hasShowSettings || this.props.showCategories === true) {
      searchTypes.push("categories");
    }
    if (!hasShowSettings || this.props.showStages === true) {
      searchTypes.push("stages");
    }
    if (!hasShowSettings || this.props.showMatches === true) {
      searchTypes.push("matches");
    }
    const label =
      "Search by " +
      searchTypes.reduce((prev, cur, idx, arr) => {
        const delimiter = idx === arr.length - 1 ? " or " : ", ";
        return prev + delimiter + cur;
      });
    return (
      <TextField
        label={label}
        variant="outlined"
        size="small"
        fullWidth
        value={this.state.searchString || ""}
        onChange={(event) => this.onSearchTextChange(event)}
      />
    );
  }

  private renderContent(): React.ReactNode {
    const searchStr = this.state.searchString;
    if (
      searchStr !== undefined &&
      searchStr.length >= SearchDataDialog.MIN_SEARCH_STR_LENGTH
    ) {
      if (this.state.results === undefined || this.state.results.isEmpty()) {
        if (this.state.isLoading) {
          return <LoadingIndicator />;
        }
        return (
          <div className={this.props.classes.infoRow}>
            There are no matches matching the search expression
          </div>
        );
      }
      return this.renderResults(this.state.results);
    }
    return (
      <div className={this.props.classes.infoRow}>
        Start by typing in a search expression
      </div>
    );
  }

  private renderResults(results: SearchResultCollection): React.ReactNode {
    return (
      <>
        {this.renderTeamResults(results.teams)}
        {this.renderCategoryResults(results.categories)}
        {this.renderStageResults(results.stages)}
        {this.renderMatchResults(results.matches)}
      </>
    );
  }

  private renderTeamResults(teams: Team[]): React.ReactNode {
    if (
      teams.length === 0 ||
      (this.hasShowSettings() && this.props.showTeams !== true)
    ) {
      return undefined;
    }
    return (
      <>
        <div className={this.props.classes.resultHeader}>Teams</div>
        {teams.map((team) =>
          this.renderSimpleRow(team.name || "", team.id, team)
        )}
      </>
    );
  }

  private renderCategoryResults(categories: Category[]): React.ReactNode {
    if (
      categories.length === 0 ||
      (this.hasShowSettings() && this.props.showCategories !== true)
    ) {
      return undefined;
    }
    return (
      <>
        <div className={this.props.classes.resultHeader}>Categories</div>
        {categories.map((category) =>
          this.renderSimpleRow(category.c_name || "", category.c_id, category)
        )}
      </>
    );
  }

  private renderStageResults(stages: Stage[]): React.ReactNode {
    if (
      stages.length === 0 ||
      (this.hasShowSettings() && this.props.showStages !== true)
    ) {
      return undefined;
    }
    return (
      <>
        <div className={this.props.classes.resultHeader}>Stages</div>
        {stages.map((stage) =>
          this.renderSimpleRow(
            stage.compositeName() || "",
            stage.stageId,
            stage
          )
        )}
      </>
    );
  }

  private renderMatchResults(matches: Match[]): React.ReactNode {
    if (
      matches.length === 0 ||
      (this.hasShowSettings() && this.props.showMatches !== true)
    ) {
      return undefined;
    }
    return (
      <>
        <div className={this.props.classes.resultHeader}>Matches</div>
        {matches.map((match) => this.renderMatchRow(match))}
      </>
    );
  }

  private renderSimpleRow(
    title: string,
    key: string,
    item: Team | Category | Stage | Match
  ): React.ReactNode {
    return (
      <div
        key={key}
        className={this.props.classes.simpleRow}
        onClick={() => this.onSelect(item)}
      >
        {title}
      </div>
    );
  }

  private renderMatchRow(match: Match): React.ReactNode {
    return (
      <div
        className={this.props.classes.matchRow}
        key={match.id}
        onClick={() => this.onSelect(match)}
      >
        <div>
          <span className={this.props.classes.matchRowDate}>
            {match.startDate()}
          </span>
          <span className={this.props.classes.matchRowTeam}>
            {match.homeTeamName()}
          </span>
        </div>
        <div>
          <span className={this.props.classes.matchRowDate}>
            {match.startTime()}
          </span>
          <span className={this.props.classes.matchRowTeam}>
            {match.awayTeamName()}
          </span>
        </div>
      </div>
    );
  }

  private hasShowSettings(): boolean {
    return (
      this.props.showTeams !== undefined ||
      this.props.showCategories !== undefined ||
      this.props.showStages !== undefined ||
      this.props.showMatches !== undefined
    );
  }

  private onSearchTextChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const newSearchString = event.target.value;
    this.setState({ searchString: newSearchString, isLoading: true });
    this.scheduleLoadSearchResults();
  }

  private onSelect(item: Team | Category | Stage | Match): void {
    if (this.props.onItemSelect) {
      this.props.onItemSelect(item);
    }
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

export default withStyles(styles)(SearchDataDialog);
