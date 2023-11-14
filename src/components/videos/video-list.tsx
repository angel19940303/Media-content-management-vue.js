import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import React, { RefObject } from "react";
import { ApiDataLoader } from "../../api/api-data-loader";
import { LoadStatus } from "../../models/enums/load_status";
import Paper from "@material-ui/core/Paper";
import LoadingIndicator from "../common/loading-indicator";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import { EnumList } from "../../models/common/enum-list";
import { MatchVideoCollectionList } from "../../models/videos/match-video-collection-list";
import { Stage } from "../../models/api-data/stage";
import { DateUtil } from "../../utils/date-util";
import VideoCalendarView from "./videos-calendar-view";
import Select from "@material-ui/core/Select";
import { InputBase, TextField } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import SearchDataDialog from "../common/search-data-dialog";
import { Team } from "../../models/api-data/team";
import { Category } from "../../models/api-data/category";
import { Match } from "../../models/api-data/match";
import {
  ResizableContentComponent,
  ResizableContentState,
} from "../../models/common/resizable-content-component";
import { ConfigUtil } from "../../utils/config-util";
import { Routes } from "../routing";
import MasterError from "../master-error";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: 936,
      margin: "auto",
      overflow: "hidden",
    },
    searchBar: {
      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    },
    searchInput: {
      fontSize: theme.typography.fontSize,
    },
    block: {
      display: "block",
    },
    contentWrapper: {
      margin: "40px 16px",
    },
    content: {
      overflow: "auto",
    },
    tableHeader: {
      backgroundColor: "#f5f5f5",
    },
    emptyNote: {
      padding: "25px 0",
    },
  });

interface SelectedTimeRange {
  sport: string;
  date: Date;
  data?: Stage[];
}

interface RProps extends RouteComponentProps<any>, WithStyles<typeof styles> {}

interface RState extends ResizableContentState {
  videosLoaded: boolean;
  matchesLoaded: boolean;
  isError: boolean;
  loadStatus: number;
  isDatePickerOpen: boolean;
  isSearchDataOpen: boolean;
  data?: MatchVideoCollectionList;
  selectedTimeRange?: SelectedTimeRange;
  enums: EnumList;
}

class VideoList extends ResizableContentComponent<RProps, RState> {
  private searchDialogRef: RefObject<any> = React.createRef();
  private mounted = false;

  constructor(props: RProps) {
    super(props);
    this.state = {
      videosLoaded: false,
      matchesLoaded: false,
      isError: false,
      loadStatus: -1,
      isDatePickerOpen: false,
      isSearchDataOpen: false,
      enums: EnumList.createEmoty(),
      contentHeight: ResizableContentComponent.contentHeight(),
      contentTopOffset: 0,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    const [sport, date] = this.filterValuesFromSearchString(
      this.props.location.search
    );
    this.mounted = true;
    this.loadVideos();
    this.loadMatches(sport, date);
    this.props.history.listen((location) => {
      if (!this.mounted) {
        return;
      }
      const [sport, date] = this.filterValuesFromSearchString(location.search);
      this.loadMatches(sport, date);
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.mounted = false;
  }

  render(): React.ReactNode {
    if (
      this.state.videosLoaded &&
      this.state.loadStatus === LoadStatus.UNAUTHENTICATED
    ) {
      return <Redirect to={Routes.Login} />;
    }
    if (
      this.state.videosLoaded &&
      this.state.loadStatus === LoadStatus.UNAUTHORIZED
    ) {
      return <MasterError type="unauthorized" />;
    }
    return (
      <Paper
        className={this.props.classes.paper}
        style={{ height: this.state.contentHeight.total }}
      >
        {this.renderContent()}
      </Paper>
    );
  }

  private loadVideos(): void {
    ApiDataLoader.shared.loadVideoCollectionList((status, data, enums) => {
      if (status === LoadStatus.SUCCESS) {
        this.setState({
          videosLoaded: true,
          data: data,
          enums: enums || EnumList.createEmoty(),
          loadStatus: status,
        });
      } else {
        this.setState({
          videosLoaded: true,
          isError: true,
          loadStatus: status,
        });
      }
    });
  }

  private loadMatches(sport: string, selectedDate?: Date): void {
    const startDate = selectedDate ?? new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + 1);
    const startDateParam = DateUtil.formatApiParam(startDate, true);
    const endDateParam = DateUtil.formatApiParam(endDate, true);
    this.setState({
      matchesLoaded: false,
      isDatePickerOpen: false,
      selectedTimeRange: {
        sport: sport,
        date: startDate,
      },
    });
    ApiDataLoader.shared.loadSportStageDateRange(
      sport,
      startDateParam,
      endDateParam,
      (status: number, data?: Stage[]) => {
        if (!this.mounted) {
          return;
        }
        const isError = status !== LoadStatus.SUCCESS;
        this.setState({
          matchesLoaded: true,
          isError: isError,
          selectedTimeRange: {
            sport: sport,
            date: startDate,
            data: data,
          },
        });
      }
    );
  }

  private renderContent(): React.ReactNode {
    if (!this.state.videosLoaded || !this.state.matchesLoaded) {
      return <LoadingIndicator />;
    }
    if (this.state.isError) {
      return "Error";
    }
    return (
      <>
        <AppBar
          className={this.props.classes.searchBar}
          position="static"
          color="default"
          elevation={0}
        >
          {this.renderToolbar()}
        </AppBar>
        <div
          style={{ height: this.state.contentHeight.inner }}
          className={this.props.classes.content}
        >
          {this.renderDataCalendar()}
        </div>
        <SearchDataDialog
          innerRef={this.searchDialogRef}
          sport={
            this.state.selectedTimeRange?.sport || ConfigUtil.defaultSport()
          }
          isOpen={this.state.isSearchDataOpen}
          showMatches
          onItemSelect={(item) => this.onSearchItemSelect(item)}
          onClose={() => this.setState({ isSearchDataOpen: false })}
        />
      </>
    );
  }

  private renderToolbar(): React.ReactNode {
    return (
      <Toolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <FormControl>
              <Select
                value={this.state.selectedTimeRange?.sport || 0}
                onChange={(event) => this.onSportSelect(event)}
                label="Sport"
                input={<InputBase />}
              >
                {this.state.enums.getSports().map((sport) => (
                  <MenuItem key={sport} value={sport.toLowerCase()}>
                    {sport}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              size="small"
              variant="outlined"
              type="date"
              value={DateUtil.formatDatePickerShortString(
                this.state.selectedTimeRange?.date || new Date()
              )}
              onChange={(event) => this.onDatePickerChange(event)}
            />
            <IconButton onClick={() => this.onSearchOpen()}>
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    );
  }

  private renderDataCalendar(): React.ReactNode {
    if (
      this.state.data === undefined ||
      this.state.selectedTimeRange === undefined
    ) {
      return undefined;
    }
    return (
      <VideoCalendarView
        height={this.state.contentHeight.inner}
        videos={this.state.data}
        date={this.state.selectedTimeRange.date}
        stages={this.state.selectedTimeRange.data}
        onMatchSelect={(id) => this.onMatchSelect(id)}
      />
    );
  }

  private onSportSelect(event: any): void {
    const queryString = this.buildQueryString(
      event.target.value,
      this.state.selectedTimeRange?.date
    );
    this.navigateToQueryString(queryString);
  }

  private onDatePickerChange(event: any): void {
    const date = DateUtil.datePickerShortStringToDate(event.target.value);
    if (date !== undefined) {
      const queryString = this.buildQueryString(
        this.state.selectedTimeRange?.sport,
        date
      );
      this.navigateToQueryString(queryString);
    }
  }

  private onSearchOpen(): void {
    this.searchDialogRef.current?.reset();
    this.setState({ isSearchDataOpen: true });
  }

  private onSearchItemSelect(item: Team | Category | Stage | Match): void {
    if (item instanceof Match) {
      this.onMatchSelect(item.id);
    }
  }

  private onMatchSelect(id: string): void {
    const sport =
      this.state.selectedTimeRange?.sport || ConfigUtil.defaultSport();
    const path = `/content/videos/edit/${sport}/${id}`;
    this.props.history.push(path);
  }

  private buildQueryString(sport?: string, date?: Date): string {
    let queryString = "";
    if (sport !== undefined) {
      queryString += "sport=" + encodeURIComponent(sport);
    }
    if (date !== undefined) {
      if (queryString.length > 0) {
        queryString += "&";
      }
      queryString += "date=" + DateUtil.dateToApiTimestamp(date, false);
    }
    return queryString;
  }

  private navigateToQueryString(queryString: string): void {
    let url = "/content/videos";
    if (queryString.length > 0) {
      url += "?" + queryString;
    }
    console.log("Navigating", url);
    this.props.history.push(url);
  }

  private filterValuesFromSearchString(searchString: any): [string, Date] {
    const params = new URLSearchParams(searchString);
    const paramToString = (param: string | null): string | undefined => {
      return param === null ? undefined : param;
    };
    const paramToNumber = (param: string | null): number | undefined => {
      if (param === null) {
        return undefined;
      }
      const paramNum = parseInt(param, 10);
      if (isNaN(paramNum)) {
        return undefined;
      }
      return paramNum;
    };
    const sport =
      paramToString(params.get("sport")) || ConfigUtil.defaultSport();
    const timestamp = paramToNumber(params.get("date"));
    const date =
      timestamp !== undefined
        ? DateUtil.apiTimestampToDate(timestamp, false)
        : new Date();
    return [sport, date];
  }
}

export default withRouter(withStyles(styles)(VideoList));
