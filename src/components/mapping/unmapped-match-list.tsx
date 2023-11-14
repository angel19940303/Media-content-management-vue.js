import React from "react";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import { EnumList } from "../../models/common/enum-list";
import { ApiDataLoader } from "../../api/api-data-loader";
import { LoadStatus } from "../../models/enums/load_status";
import Paper from "@material-ui/core/Paper";
import LoadingIndicator from "../common/loading-indicator";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import MappingEditDialog from "./mapping-edit-dialog";
import { MenuEditAction } from "../../models/enums/menu-edit-action";
import MenuEditActionsPopper from "../menu/edit/menu-edit-actions-popper";
import {
  ResizableContentComponent,
  ResizableContentState,
} from "../../models/common/resizable-content-component";
import { MappingRecord } from "../../models/mapping/mapping-record";
import { MappingMatch, MappingMatchTeam } from "../../models/ui/mapping-match";
import { AutoSizer, List } from "react-virtualized";
import { Avatar } from "@material-ui/core";
import { Provider } from "../../models/enums/provider";
import { Sport } from "../../models/enums/sport";
import { ArrowForward } from "@material-ui/icons";
import { DateUtil } from "../../utils/date-util";
import { MappingVariationPrePopulation } from "../../models/ui/mapping-variation-prepopulation";
import StatusSnackBar, { StatusMessage } from "../common/status-snack-bar";
import { Gender } from "../../models/enums/gender";
import MappingFilterBar from "./mapping-filter-bar";
import { MappingFilter } from "../../models/ui/mapping-filter";
import { Redirect } from "react-router-dom";
import { Routes } from "../routing";
import MasterError from "../master-error";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
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
    matchMappingRow: {
      display: "flex",
      alignItems: "center",
      padding: "0 10px",
      height: 60,
      borderBottom: "1px solid #ddd",
    },
    matchMappingRowSeparator: {
      flex: "0 0 30px",
      textAlign: "center",
      "& svg": {
        verticalAlign: "middle",
      },
    },
    matchMappingRowRank: {
      flex: "0 0 70px",
    },
    matchMappingRowSport: {
      flex: "0 0 70px",
      marginRight: "1em",
    },
    matchMappingRowProvider: {
      flex: "0 0 32px",
    },
    matchMappingRowDate: {
      flex: "0 0 50px",
      textAlign: "center",
    },
    matchMappingRowStageLeft: {
      flex: "0 0 200px",
      textAlign: "right",
      overflow: "hidden",
      "& div": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    matchMappingRowStageRight: {
      flex: "0 0 200px",
      overflow: "hidden",
      "& div": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    matchMappingRowTeamLeft: {
      flex: 1,
      textAlign: "right",
      overflow: "hidden",
      "& div": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    matchMappingRowTeamRight: {
      flex: 1,
      overflow: "hidden",
      "& div": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    matchMappingRowSourceTeam: {
      "& span": {
        cursor: "pointer",
        borderRadius: 5,
        "&:hover": {
          backgroundColor: "#eee",
        },
      },
      "& span.selected": {
        backgroundColor: "#eeeeff",
        "&:hover": {
          backgroundColor: "#ccccff",
        },
      },
    },
    matchMappingRowDestinationTeam: {
      "& span.active": {
        cursor: "pointer",
        borderRadius: 5,
        backgroundColor: "#eeffee",
        "&:hover": {
          backgroundColor: "#ccffcc",
        },
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {}

interface RState extends ResizableContentState {
  data: MappingMatch[] | undefined;
  filteredData: MappingMatch[] | undefined;
  enums: EnumList;
  isLoading: boolean;
  isError: boolean;
  loadStatus: number;
  isEditDialogOpen: boolean;
  selectedMappingTeam?: MappingMatchTeam;
  statusMessage?: StatusMessage;
  mappingFilter?: MappingFilter;
}

class UnmappedMatchList extends ResizableContentComponent<RProps, RState> {
  private listRef: any | undefined = undefined;
  private dialogRef: any = React.createRef();

  private static readonly ACTIONS = [
    MenuEditAction.ADD_VARIATION_TO_PARTICIPANT_MAPPING,
  ];

  constructor(props: RProps) {
    super(props);
    this.state = {
      data: undefined,
      filteredData: undefined,
      enums: EnumList.createEmoty(),
      isLoading: true,
      isError: false,
      loadStatus: -1,
      isEditDialogOpen: false,
      contentHeight: ResizableContentComponent.contentHeight(),
      contentTopOffset: 0,
      selectedMappingTeam: undefined,
      statusMessage: undefined,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    ApiDataLoader.shared.loadUnmappedMatches(
      (status: number, data: MappingRecord[], enums: EnumList | undefined) => {
        if (status === LoadStatus.SUCCESS) {
          const mappingMatches = MappingMatch.listFromRecords(data);
          this.setState({
            enums: enums || EnumList.createEmoty(),
            data: mappingMatches,
            isLoading: false,
            isError: false,
            loadStatus: status,
          });
        } else {
          this.setState({
            isLoading: false,
            isError: true,
            loadStatus: status,
          });
        }
      }
    );
  }

  render(): React.ReactNode {
    if (
      !this.state.isLoading &&
      this.state.loadStatus === LoadStatus.UNAUTHENTICATED
    ) {
      return <Redirect to={Routes.Login} />;
    }
    if (
      !this.state.isLoading &&
      this.state.loadStatus === LoadStatus.UNAUTHORIZED
    ) {
      return <MasterError type="unauthorized" />;
    }

    return (
      <>
        <MenuEditActionsPopper
          actions={UnmappedMatchList.ACTIONS}
          onSelect={(action) => this.onActionSelect(action)}
        />
        <Paper
          className={this.props.classes.paper}
          style={{ height: this.state.contentHeight.total }}
        >
          {this.renderContent()}
        </Paper>
      </>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    if (this.state.isError) {
      return <MasterError type="unknown" />;
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
        {this.renderData()}
        <MappingEditDialog
          innerRef={this.dialogRef}
          enums={this.state.enums}
          isOpen={this.state.isEditDialogOpen}
          onClose={() => this.setState({ isEditDialogOpen: false })}
          onUpdate={(status, message) =>
            this.onVariationsUpdate(status, message)
          }
        />
        <StatusSnackBar
          isOpen={this.state.statusMessage !== undefined}
          message={this.state.statusMessage}
          onClose={() => this.setState({ statusMessage: undefined })}
        />
      </>
    );
  }

  private renderToolbar(): React.ReactNode {
    return (
      <Toolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <MappingFilterBar
              enums={this.state.enums}
              filter={this.state.mappingFilter}
              onChange={(filter) => this.onMappingFilterChange(filter)}
            />
          </Grid>
        </Grid>
      </Toolbar>
    );
  }

  private renderData(): React.ReactNode {
    if (this.state.data === undefined || this.state.data.length === 0) {
      return <div>There are no unmapped matches</div>;
    }

    const data = this.state.filteredData || this.state.data;

    if (data.length === 0) {
      return null;
    }

    const rowRenderer = ({ index, key, style }: any) => {
      return (
        <div key={key} style={style}>
          {this.renderContentForIndex(data[index])}
        </div>
      );
    };

    const rowCount = data.length;
    return (
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            ref={(ref) => this.setListRef(ref)}
            rowCount={rowCount}
            rowHeight={(index) => this.getRowHeight(index.index)}
            width={width}
            height={this.state.contentHeight.inner}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    );
  }

  private renderContentForIndex(rowData: MappingMatch): React.ReactNode {
    const hasSelectedTeam =
      rowData.mappingTeams.find((team) => this.isTeamSelected(team)) !==
      undefined;
    return (
      <div className={this.props.classes.matchMappingRow}>
        <div className={this.props.classes.matchMappingRowRank}>
          {Sport.title(rowData.sport)}
        </div>
        <div className={this.props.classes.matchMappingRowRank}>
          {Math.round(rowData.rank * 10000) / 100} %
        </div>
        <div className={this.props.classes.matchMappingRowProvider}>
          <Avatar>
            {Provider.initialsForProvider(rowData.mappingProviderId)}
          </Avatar>
        </div>
        <div className={this.props.classes.matchMappingRowSeparator}>
          <ArrowForward />
        </div>
        <div className={this.props.classes.matchMappingRowProvider}>
          <Avatar>
            {Provider.initialsForProvider(rowData.creatorProviderId)}
          </Avatar>
        </div>
        <div className={this.props.classes.matchMappingRowSeparator} />
        <div className={this.props.classes.matchMappingRowDate}>
          <div>
            {rowData.mappingStartDate === undefined
              ? "Unknown date"
              : DateUtil.formatDateShort(rowData.mappingStartDate)}
          </div>
          <div>
            {rowData.mappingStartDate === undefined
              ? "Unknown time"
              : DateUtil.formatStartTime(rowData.mappingStartDate)}
          </div>
        </div>
        <div className={this.props.classes.matchMappingRowSeparator}>
          <ArrowForward />
        </div>
        <div className={this.props.classes.matchMappingRowDate}>
          <div>
            {rowData.creatorStartDate === undefined
              ? "Unknown date"
              : DateUtil.formatDateShort(rowData.creatorStartDate)}
          </div>
          <div>
            {rowData.creatorStartDate === undefined
              ? "Unknown time"
              : DateUtil.formatStartTime(rowData.creatorStartDate)}
          </div>
        </div>
        <div className={this.props.classes.matchMappingRowSeparator} />
        <div className={this.props.classes.matchMappingRowStageLeft}>
          <div>{rowData.mappingStageName || "Unknown stage"}</div>
          <div>
            {rowData.mappingCategoryName || "Unknown category"}{" "}
            {rowData.mappingSeason || ""}
          </div>
        </div>
        <div className={this.props.classes.matchMappingRowSeparator}>
          <ArrowForward />
        </div>
        <div className={this.props.classes.matchMappingRowStageRight}>
          <div>{rowData.creatorStageName || "Unknown stage"}</div>
          <div>
            {rowData.creatorCategoryName || "Unknown category"}{" "}
            {rowData.creatorSeason || ""}
          </div>
        </div>
        <div className={this.props.classes.matchMappingRowSeparator} />
        <div className={this.props.classes.matchMappingRowTeamLeft}>
          {rowData.mappingTeams.map((team) => (
            <div
              key={`${team.providerId}-${team.id}`}
              className={this.props.classes.matchMappingRowSourceTeam}
            >
              <span
                className={this.isTeamSelected(team) ? "selected" : ""}
                onClick={() => this.onSourceTeamSelect(team)}
              >
                {team.name + Gender.shortSuffix(team.gender)}
              </span>
            </div>
          ))}
        </div>
        <div className={this.props.classes.matchMappingRowSeparator}>
          <ArrowForward />
        </div>
        <div className={this.props.classes.matchMappingRowTeamRight}>
          {rowData.creatorTeams.map((team) => (
            <div
              key={`${team.providerId}-${team.id}`}
              className={this.props.classes.matchMappingRowDestinationTeam}
            >
              <span
                className={hasSelectedTeam ? "active" : ""}
                onClick={
                  hasSelectedTeam
                    ? () => this.onDestinationTeamSelect(team)
                    : undefined
                }
              >
                {team.name + Gender.shortSuffix(team.gender)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  private getRowHeight(index: number): number {
    return 60;
  }

  private onMappingFilterChange(filter?: MappingFilter): void {
    this.setState((state) => {
      return {
        mappingFilter: filter,
        filteredData:
          state.data === undefined
            ? undefined
            : MappingMatch.filteredList(state.data, filter),
      };
    });
  }

  private onActionSelect(action: number): void {
    switch (action) {
      case MenuEditAction.ADD_VARIATION_TO_PARTICIPANT_MAPPING:
        this.setState({ isEditDialogOpen: true });
        break;
    }
  }

  private onSourceTeamSelect(team: MappingMatchTeam): void {
    if (!this.isTeamSelected(team)) {
      this.setState({ selectedMappingTeam: team });
    } else {
      this.setState({ selectedMappingTeam: undefined });
    }
  }

  private onDestinationTeamSelect(team: MappingMatchTeam): void {
    if (this.state.selectedMappingTeam === undefined) {
      return;
    }
    if (this.dialogRef.current !== null) {
      const prePopulation = MappingVariationPrePopulation.fromMappingMatchTeams(
        this.state.selectedMappingTeam,
        team
      );
      this.dialogRef.current.setPrePopulation(prePopulation);
    }
    this.setState({
      selectedMappingTeam: undefined,
      isEditDialogOpen: true,
    });
  }

  private onVariationsUpdate(
    status: number,
    message: string | undefined
  ): void {
    if (message !== undefined) {
      this.setState({
        statusMessage: { type: status, text: message },
        loadStatus: status,
      });
    }
  }

  private setListRef(listRef: any | undefined): void {
    if (
      listRef &&
      this.state.data !== undefined &&
      this.state.data.length > 0
    ) {
      listRef.measureAllRows();
    }
    this.listRef = listRef;
  }

  private isTeamSelected(team: MappingMatchTeam): boolean {
    return (
      this.state.selectedMappingTeam !== undefined &&
      this.state.selectedMappingTeam.providerId === team.providerId &&
      this.state.selectedMappingTeam.id === team.id
    );
  }
}

export default withStyles(styles)(UnmappedMatchList);
