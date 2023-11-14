import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { NewsFeedDataPayload } from "../../../models/news/news-feed-data-payload";
import { ApiDataLoader } from "../../../api/api-data-loader";
import { LoadStatus } from "../../../models/enums/load_status";
import Paper from "@material-ui/core/Paper";
import LoadingIndicator from "../../../components/common/loading-indicator";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import { EnumList } from "../../../models/common/enum-list";
import NewsFeedEditDialog from "../../../components/news/feed-list/news-feed-edit-dialog/news-feed-edit-dialog";
import Button from "@material-ui/core/Button";
import { NewsFeedDataList } from "../../../models/news/news-feed-data-list";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import StatusSnackBar, {
  StatusMessage,
} from "../../../components/common/status-snack-bar";
import { Redirect } from "react-router-dom";
import { Routes } from "../../routing";
import MasterError from "../../master-error";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: "100%",
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
    tableHeader: {
      backgroundColor: "#f5f5f5",
    },
    emptyNote: {
      padding: "25px 0",
    },
    wrappingCell: {
      overflowWrap: "break-word",
    },
  });

interface NewsFeedListProps extends WithStyles<typeof styles> {}

interface NewsFeedListState {
  isLoading: boolean;
  isError: boolean;
  loadStatus: number;
  data: NewsFeedDataList;
  enums?: EnumList;
  filteredData?: Array<NewsFeedDataPayload>;
  filterText?: string;
  selectedItem?: NewsFeedDataPayload;
  statusMessage?: StatusMessage;
}

class NewsFeedList extends React.Component<
  NewsFeedListProps,
  NewsFeedListState
> {
  constructor(props: NewsFeedListProps) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      loadStatus: -1,
      data: NewsFeedDataList.fromData([]),
    };
  }

  componentDidMount() {
    ApiDataLoader.shared.loadNewsFeedList((status, data, enums) => {
      if (status === LoadStatus.SUCCESS) {
        const dataList = NewsFeedDataList.fromData(data || []);
        this.setState({
          isLoading: false,
          isError: false,
          data: dataList,
          enums: enums,
          loadStatus: status,
        });
      } else {
        this.setState({ isLoading: false, isError: true, loadStatus: status });
      }
    });
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
      <Paper className={this.props.classes.paper}>{this.renderContent()}</Paper>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    if (this.state.isError) {
      return "Error";
    }
    const isEditDialogOpen = this.state.selectedItem !== undefined;
    const isSnackBarOpen = this.state.statusMessage !== undefined;
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
        <div>{this.renderData()}</div>
        <NewsFeedEditDialog
          isOpen={isEditDialogOpen}
          item={this.state.selectedItem}
          enums={this.state.enums}
          onUpdate={(data) => this.onFeedUpdate(data)}
          onClose={() => this.setState({ selectedItem: undefined })}
        />
        <StatusSnackBar
          isOpen={isSnackBarOpen}
          message={this.state.statusMessage}
          onClose={() => this.onSnackBarClose()}
        />
      </>
    );
  }

  private renderToolbar(): React.ReactNode {
    const onFilterChange = (event: any) => {
      const filterText: string = event.target.value.toLowerCase();
      if (
        filterText.length === 0 ||
        !this.state.data ||
        this.state.data.items.length === 0
      ) {
        this.setState({ filteredData: undefined, filterText: undefined });
      } else {
        this.setState((state) => {
          return {
            filteredData: state.data.filteredItems(filterText, state.enums),
            filterText: filterText,
          };
        });
      }
    };

    return (
      <Toolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <SearchIcon className={this.props.classes.block} color="inherit" />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              value={this.state.filterText || ""}
              onChange={onFilterChange}
              placeholder="Search by sport, provider, language or URL"
              InputProps={{
                disableUnderline: true,
                className: this.props.classes.searchInput,
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.onAddClick()}
            >
              Add News Feed
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    );
  }

  private renderData(): React.ReactNode {
    const data: Array<NewsFeedDataPayload> =
      this.state.filteredData || this.state.data.items;
    if (data.length === 0) {
      return (
        <Typography
          color="textSecondary"
          align="center"
          className={this.props.classes.emptyNote}
        >
          No news feeds been added yet
        </Typography>
      );
    }
    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className={this.props.classes.tableHeader}>
              <TableCell>ID</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>URL</TableCell>
              <TableCell align="center">Enabled</TableCell>
              <TableCell align="center">External</TableCell>
              <TableCell align="right">Frequency</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {(data || []).map((item, index) => (
              <TableRow key={item.ID}>
                <TableCell>{item.ID}</TableCell>
                <TableCell>{this.state.enums?.sportName(item.Sport)}</TableCell>
                <TableCell>
                  {this.state.enums?.languageNameForCode(item.Language)}
                </TableCell>
                <TableCell>
                  {this.state.enums?.providerName(item.Provider)}
                </TableCell>
                <TableCell className={this.props.classes.wrappingCell}>
                  {item.URL}
                </TableCell>
                <TableCell align="center">
                  {item.Enabled ? <CheckCircleIcon /> : <CancelIcon />}
                </TableCell>
                <TableCell align="center">
                  {item.ExternalLinks ? <CheckCircleIcon /> : <CancelIcon />}
                </TableCell>
                <TableCell align="right">
                  {item.FrequencyInMinutes} min
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => this.onEditClick(index)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  private onAddClick(): void {
    const defaultSport = this.state.enums?.defaultSport();
    const defaultLanguage = this.state.enums?.defaultLanguage();
    const defaultProvider = this.state.enums?.defaultProvider();
    if (
      defaultSport === undefined ||
      defaultLanguage === undefined ||
      defaultProvider === undefined
    ) {
      return;
    }
    this.setState({
      selectedItem: {
        Sport: defaultSport,
        Language: defaultLanguage,
        Provider: defaultProvider,
        URL: "",
        Enabled: false,
        ExternalLinks: false,
        FrequencyInMinutes: 0,
        Source: "",
      },
    });
  }

  private onEditClick(index: number): void {
    this.setState((state) => {
      return { selectedItem: state.data.itemAtIndex(index) };
    });
  }

  private onSnackBarClose() {
    this.setState({ statusMessage: undefined });
  }

  private onFeedUpdate(data: NewsFeedDataPayload): void {
    const isNew = data.ID === undefined;
    this.setState({ isLoading: true, selectedItem: undefined });
    ApiDataLoader.shared.saveNewsFeed(data, (status, savedData, message) => {
      if (status === LoadStatus.SUCCESS && savedData !== undefined) {
        const newDataItem = savedData?.ID !== undefined ? savedData : data;
        this.setState((state) => {
          const newData = isNew
            ? state.data.addItem(newDataItem)
            : state.data.updateItem(newDataItem);
          return {
            isLoading: false,
            data: newData,
            statusMessage: {
              type: LoadStatus.SUCCESS,
              text: "Successfully saved news feed",
            },
            loadStatus: status,
          };
        });
      } else {
        const stateText =
          "Failed to save news feed" +
          (message !== undefined ? ": " + message : "");
        this.setState({
          isLoading: false,
          selectedItem: data,
          statusMessage: { type: LoadStatus.FAILURE, text: stateText },
          loadStatus: status,
        });
      }
    });
  }
}

export default withStyles(styles)(NewsFeedList);
