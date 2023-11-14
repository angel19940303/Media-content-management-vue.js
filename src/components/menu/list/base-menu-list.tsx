import React from "react";
import { createStyles, Theme, WithStyles } from "@material-ui/core/styles";
import { MenuDataPayload } from "../../../models/menu/menu-data-payload";
import { ApiDataLoader } from "../../../api/api-data-loader";
import { LoadStatus } from "../../../models/enums/load_status";
import Paper from "@material-ui/core/Paper";
import LoadingIndicator from "../../../components/common/loading-indicator";
import AppBar from "@material-ui/core/AppBar";
import { Sport } from "../../../models/enums/sport";
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
import { DataTransformUtil } from "../../../utils/data-transform-util";
import BaseAuthPaperbasePage from "../../../pages/base-auth-paperbase-page";
import MasterError from "../../master-error";
import { Redirect } from "react-router-dom";
import { Routes } from "../../routing";

export const baseMenuListStyles = (theme: Theme) =>
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
    tableHeader: {
      backgroundColor: "#f5f5f5",
    },
    emptyNote: {
      padding: "25px 0",
    },
  });

export interface BaseMenuListProps
  extends WithStyles<typeof baseMenuListStyles> {}

export interface BaseMenuListState {
  isLoading: boolean;
  isError: boolean;
  loadStatus: number;
  data?: Array<MenuDataPayload>;
  filteredData?: Array<MenuDataPayload>;
  filterText?: string;
  createMenuAnchorEl?: any;
}

export abstract class BaseMenuList<
  T extends BaseMenuListProps,
  U extends BaseMenuListState
> extends BaseAuthPaperbasePage<T, U> {
  static initialState<U extends BaseMenuListState>(): U {
    return { isLoading: true, isError: false, loadStatus: -1 } as U;
  }

  componentDidMount() {
    ApiDataLoader.shared.loadMenuList((status, data) => {
      if (status === LoadStatus.SUCCESS) {
        this.setState({
          isLoading: false,
          isError: false,
          data: DataTransformUtil.sortedListById(data),
          loadStatus: status,
        });
      } else {
        this.setState({ isLoading: false, isError: true, loadStatus: status });
      }
    });
  }

  /*render(): React.ReactNode {
    return (
        <Paperbase><Paper className={this.props.classes.paper}>{this.renderContent()}</Paper></Paperbase>
    );
  }*/

  abstract renderToolbarActions(): React.ReactNode;

  abstract renderItemActions(item: MenuDataPayload): React.ReactNode;

  protected renderContent(): React.ReactNode {
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
      <Paper className={this.props.classes.paper}>
        {this.renderPageContent()}
      </Paper>
    );
  }

  private renderPageContent(): React.ReactNode {
    if (this.state.isLoading) {
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
        <div>{this.renderData()}</div>
      </>
    );
  }

  private renderToolbar(): React.ReactNode {
    const onFilterChange = (event: any) => {
      const filterText: string = event.target.value.toLowerCase();
      if (
        filterText.length === 0 ||
        !this.state.data ||
        this.state.data.length === 0
      ) {
        this.setState({ filteredData: undefined, filterText: undefined });
      } else {
        const filteredData = this.state.data.filter((item) => {
          const sportTitle = Sport.title(item.sportId);
          return (
            (sportTitle && sportTitle.toLowerCase().indexOf(filterText) >= 0) ||
            (item.name && item.name.toLowerCase().indexOf(filterText) >= 0)
          );
        });
        this.setState({ filteredData: filteredData, filterText: filterText });
      }
    };

    let actions = this.renderToolbarActions();
    if (actions) {
      actions = <Grid item>{actions}</Grid>;
    }

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
              placeholder="Search by menu name or sport"
              InputProps={{
                disableUnderline: true,
                className: this.props.classes.searchInput,
              }}
            />
          </Grid>
          {actions}
        </Grid>
      </Toolbar>
    );
  }

  private renderData(): React.ReactNode {
    const data: Array<MenuDataPayload> | undefined =
      this.state.filteredData || this.state.data;
    if (!data || data.length === 0) {
      return (
        <Typography
          color="textSecondary"
          align="center"
          className={this.props.classes.emptyNote}
        >
          No menus have been added yet
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
              <TableCell>Name</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {(data || []).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{Sport.title(item.sportId)}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">
                  {this.renderItemActions(item)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
