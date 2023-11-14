import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import React from "react";
import { ApiDataLoader } from "../../../api/api-data-loader";
import { LoadStatus } from "../../../models/enums/load_status";
import Paper from "@material-ui/core/Paper";
import LoadingIndicator from "../../../components/common/loading-indicator";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import MasterError from "../../master-error";
import { Redirect } from "react-router-dom";
import { Routes } from "../../routing";
import { MenuItemList } from "../../../models/menu/menu-item-list";
import { MenuDataPayload } from "../../../models/menu/menu-data-payload";
import { MenuItemPayloadBuilder } from "../../../models/menu/builders/menu-item-payload-builder";
import { IncrementalIdGenerator } from "../../../models/common/incremental-id-generator";
import { EnumList } from "../../../models/common/enum-list";
import { ConfigUtil } from "../../../utils/config-util";
import MenuSortableTree from "../../menu/edit/menu-sortable-tree";
import { BaseMenuListState } from "../../menu/list/base-menu-list";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

const locOverviewListStyles = (theme: Theme) =>
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

interface LocOverviewListProps
  extends WithStyles<typeof locOverviewListStyles> {
  id?: number;
}

interface LocOverviewListState extends BaseMenuListState {
  id?: number;
  menuItems: MenuItemList;
  name: string;
  enums: EnumList;
  selectedLanguage: string;
}

class LocOverviewList extends React.Component<
  LocOverviewListProps,
  LocOverviewListState
> {
  private readonly treeIdCounter = new IncrementalIdGenerator();
  private readonly menuItemListBuilder = new MenuItemPayloadBuilder(
    this.treeIdCounter
  );

  constructor(props: LocOverviewListProps) {
    super(props);
    this.state = {
      id: props.id,
      isLoading: true,
      isError: false,
      loadStatus: -1,
      name: "",
      enums: EnumList.createEmoty(),
      menuItems: MenuItemList.create(),
      selectedLanguage: ConfigUtil.defaultLanguage(),
    };
  }

  componentDidMount() {
    ApiDataLoader.shared.loadMenu(1, (status, data, enums) => {
      if (status === LoadStatus.SUCCESS) {
        const payload = this.menuItemListBuilder.fromMenuDataPayload(data);
        this.setState({
          isLoading: false,
          menuItems: MenuItemList.from(
            payload.menuItems,
            this.state.selectedLanguage,
            payload.localizedSortOrders
          ),
          name: data?.name || "",
          enums: enums || EnumList.createEmoty(),
        });
      } else {
        this.setState({ isLoading: false, isError: true, loadStatus: status });
      }
    });
  }

  render(): React.ReactNode {
    if (
      !this.state.isLoading &&
      this.state.loadStatus === LoadStatus.UNAUTHORIZED
    ) {
      return <MasterError type="unauthorized" />;
    }
    if (
      !this.state.isLoading &&
      this.state.loadStatus === LoadStatus.UNAUTHENTICATED
    ) {
      return <Redirect to={Routes.Login} />;
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
          return item.name && item.name.toLowerCase().indexOf(filterText) >= 0;
        });
        this.setState({ filteredData: filteredData, filterText: filterText });
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
              placeholder="Search by stage name"
              InputProps={{
                disableUnderline: true,
                className: this.props.classes.searchInput,
              }}
            />
          </Grid>
        </Grid>
      </Toolbar>
    );
  }

  private renderData(): React.ReactNode {
    if (this.state.menuItems.items.length === 0) {
      return "Menu items are empty.";
    }

    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className={this.props.classes.tableHeader}>
              <TableCell>ID</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Country ID</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    );
  }
}

export default withStyles(locOverviewListStyles)(LocOverviewList);
