import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { ApiDataLoader } from "../../../api/api-data-loader";
import { LoadStatus } from "../../../models/enums/load_status";
import Paper from "@material-ui/core/Paper";
import LoadingIndicator from "../../../components/common/loading-indicator";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
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
import StatusSnackBar, {
  StatusMessage,
} from "../../../components/common/status-snack-bar";
import { FlowEntryDataPayload, NewsEntryDataPayload } from '../../../models/news/news-entry-data-payload';
import { NewsEntryFormData } from "../../../models/ui/news-entry-form-data";
import PublicIcon from "@material-ui/icons/Public";
import {
  Block,
  ChevronLeft,
  ChevronRight,
  LocationOffOutlined,
  LocationOn,
} from "@material-ui/icons";
import { TableFooter } from "@material-ui/core";
import { NewsEntryListPayload } from "../../../models/news/news-entry-list-payload";
import NewsEntryListFilterToolbar from "../../../components/news/entry-list/news-entry-list-filter-toolbar";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
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
    newsEntryCell: {
      padding: 10,
    },
  });

interface Filter {
  sport: number;
  provider?: number;
  language?: number;
  title?: string;
}

interface Page {
  num: number;
}

interface Content {
  data: Array<FlowEntryDataPayload>;
  enums: EnumList;
  filter: Filter;
  page: Page;
  totalPages: number;
}

interface RProps extends RouteComponentProps<any>, WithStyles<typeof styles> {}

interface RState {
  isLoading: boolean;
  isError: boolean;
  loadStatus: number;
  content: Content;
  statusMessage?: StatusMessage;
}

class NewsEntryList extends React.Component<RProps, RState> {
  private static readonly PAGE_LENGTH = 25;

  private isComponentMounted: boolean;

  constructor(props: RProps) {
    super(props);
    this.isComponentMounted = false;
    this.state = {
      isLoading: true,
      isError: false,
      loadStatus: -1,
      content: {
        data:[],
        enums: EnumList.createEmoty(),
        filter: { sport: 1 },
        page: { num: 1 },
        totalPages: 0,
      },
    };
  }

  componentDidMount() {
    this.isComponentMounted = true;
    ApiDataLoader.shared.loadEnums((status, enums) => {
      if (status === LoadStatus.SUCCESS && enums !== undefined) {
        const filter = this.filterFromSearchString(
          this.props.location.search,
          enums
        );
        if (filter !== undefined) {
          const page = this.state.content.page;
          this.loadNews(filter, page, enums);
          return;
        }
      }
      this.setState({ isLoading: false, isError: true, loadStatus: status });
    });
    this.props.history.listen((location) => {
      const filter = this.filterFromSearchString(
        location.search,
        this.state.content.enums
      );
      if (filter !== undefined) {
        const page: Page = this.hasChangesInFilter(filter)
          ? { num: 1 }
          : this.pageFromSearchString(location.search);
        this.loadNews(filter, page, this.state.content.enums);
      }
    });
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
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

  private loadNews(filter: Filter, page: Page, enums: EnumList) {
    console.log(filter)
    if (!this.isComponentMounted) {
      return;
    }
    this.setState({ isLoading: true, isError: false });
    const limit = NewsEntryList.PAGE_LENGTH;
    const offset = (page.num - 1) * limit;
    // ApiDataLoader.shared.loadNewsEntryList(
    //   filter.sport,
    //   limit,
    //   offset,
    //   filter.provider,
    //   filter.language,
    //   filter.title,
    //   (status, data) => {
    //     if (!this.isComponentMounted) {
    //       return;
    //     }
    //     if (data !== undefined) {
    //       const totalPages = Math.max(
    //         Math.ceil(data.totalNumberOfRecords / NewsEntryList.PAGE_LENGTH),
    //         1
    //       );
    //       const content: Content = {
    //         data: data,
    //         enums: enums,
    //         filter: filter,
    //         page: page,
    //         totalPages: totalPages,
    //       };
    //       this.setState({ isLoading: false, content: content });
    //       return;
    //     }
    //     this.setState({ isLoading: false, isError: true, loadStatus: status });
    //   }
    // );
    ApiDataLoader.shared.loadFlowNewsList(
        filter.sport,
        filter.language,
        limit,
        filter.provider,
        filter.title,
        offset,
        (status, data) => {
          console.log(data)
          if (!this.isComponentMounted) {
            return;
          }
          if (data !== undefined) {
            /*const totalPages = Math.max(
                Math.ceil(data.totalNumberOfRecords / NewsEntryList.PAGE_LENGTH),
                1
            );*/
            const content: Content = {
              data: data,
              enums: enums,
              filter: filter,
              page: page,
              totalPages: 1,
            };
            this.setState({ isLoading: false, content: content });
            return;
          }
          this.setState({ isLoading: false, isError: true, loadStatus: status });

        }
    );

  }

  private renderContent(): React.ReactNode {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    if (this.state.isError) {
      return "Error";
    }
    const isSnackBarOpen = this.state.statusMessage !== undefined;
    const filterKey = this.filterToQueryString(this.state.content.filter);
    return (
      <>
        <AppBar
          className={this.props.classes.searchBar}
          position="static"
          color="default"
          elevation={0}
        >
          <NewsEntryListFilterToolbar
            key={filterKey}
            sport={this.state.content.filter.sport}
            provider={this.state.content.filter.provider}
            language={this.state.content.filter.language}
            title={this.state.content.filter.title}
            enums={this.state.content.enums}
            onChange={(sport, provider, language, title) =>
              this.onFilterChange(sport, provider, language, title)
            }
          />
        </AppBar>
        <div>{this.renderData()}</div>
        <StatusSnackBar
          isOpen={isSnackBarOpen}
          message={this.state.statusMessage}
          onClose={() => this.onSnackBarClose()}
        />
      </>
    );
  }

  private renderData(): React.ReactNode {
    const isLastPage =
      this.state.content.page.num >= this.state.content.totalPages;
    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className={this.props.classes.tableHeader}>
              <TableCell
                padding="none"
                className={this.props.classes.newsEntryCell}
              >
                ID
              </TableCell>
              <TableCell
                padding="none"
                className={this.props.classes.newsEntryCell}
              >
                Sport
              </TableCell>
              <TableCell
                padding="none"
                className={this.props.classes.newsEntryCell}
              >
                Language
              </TableCell>
              <TableCell
                padding="none"
                className={this.props.classes.newsEntryCell}
              >
                Provider
              </TableCell>
              <TableCell
                padding="none"
                className={this.props.classes.newsEntryCell}
              >
                Title
              </TableCell>
              <TableCell
                padding="none"
                width={100}
                className={this.props.classes.newsEntryCell}
              />
            </TableRow>
          </TableHead>
          <TableBody>{this.renderRows()}</TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                <Grid container alignItems="center" justify="flex-end">
                  <Grid item>
                    <Typography
                      component="p"
                      variant="body2"
                      color="textPrimary"
                    >
                      Page {this.state.content.page.num} of{" "}
                      {this.state.content.totalPages}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      onClick={() => this.onPaginationClick(-1)}
                      disabled={this.state.content.page.num === 1}
                    >
                      <ChevronLeft />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      onClick={() => this.onPaginationClick(1)}
                      disabled={
                        this.state.content.data.length === 0 || isLastPage
                      }
                    >
                      <ChevronRight />
                    </IconButton>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  }

  private renderRows(): React.ReactNode {
    const data = this.state.content.data || {
      data: [],
      totalNumberOfRecords: 0,
    };
    if (data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6}>No news entries been added yet</TableCell>
        </TableRow>
      );
    }
    return data.map((item, index) => (
      <TableRow key={item.ID}>
        <TableCell padding="none" className={this.props.classes.newsEntryCell}>
          {item.ID}
        </TableCell>
        <TableCell padding="none" className={this.props.classes.newsEntryCell}>
          {this.state.content.enums.sportName(item.sport)}
        </TableCell>
        <TableCell padding="none" className={this.props.classes.newsEntryCell}>
          {this.state.content.enums.languageNameForCode(item.language)}
        </TableCell>
        <TableCell padding="none" className={this.props.classes.newsEntryCell}>
          {item.author.name}
        </TableCell>
        <TableCell padding="none" className={this.props.classes.newsEntryCell}>
          {item.title}
        </TableCell>
        <TableCell
          padding="none"
          align="right"
          className={this.props.classes.newsEntryCell}
        >
          {/*<IconButton*/}
          {/*  size="small"*/}
          {/*  onClick={() => this.onPublishedClick(item, index)}*/}
          {/*  title="Published"*/}
          {/*>*/}
          {/*  {item.Published ? <PublicIcon /> : <Block />}*/}
          {/*</IconButton>*/}
          {/*<IconButton*/}
          {/*  size="small"*/}
          {/*  onClick={() => this.onPinnedClick(item, index)}*/}
          {/*  title="Pinned"*/}
          {/*>*/}
          {/*  {item.Pinned ? <LocationOn /> : <LocationOffOutlined />}*/}
          {/*</IconButton>*/}
          <IconButton
            href={"/#/content/news/edit/" + item.ID}
            size="small"
            title="Edit"
          >
            <EditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  }

  /*private onPublishedClick(item: NewsEntryDataPayload, index: number): void {
    this.updateItemAtIndex(item, index, (itemData) =>
      itemData.withPublished(!itemData.published)
    );
  }*/

  /*private onPinnedClick(item: NewsEntryDataPayload, index: number): void {
    this.updateItemAtIndex(item, index, (itemData) =>
      itemData.withPinned(!itemData.pinned)
    );
  }*/

  private onPaginationClick(offset: number): void {
    if (offset < 0 && this.state.content.page.num === 1) {
      return;
    }
    const filterQueryString = this.filterToQueryString(
      this.state.content.filter
    );
    const pageQueryString = this.pageToQueryString({
      num: this.state.content.page.num + offset,
    });
    const queryString =
      filterQueryString +
      (filterQueryString.length > 0 ? "&" : "") +
      pageQueryString;
    this.navigateToQueryString(queryString);
  }

  private onFilterChange(
    sport: number,
    provider?: number,
    language?: number,
    title?: string
  ): void {
    const queryString = this.filterToQueryString({
      sport,
      provider,
      language,
      title,
    });
    this.navigateToQueryString(queryString);
  }

  private navigateToQueryString(queryString: string): void {
    let url = "/content/news";
    if (queryString.length > 0) {
      url += "?" + queryString;
    }
    console.log("Navigating", url);
    this.props.history.push(url);
  }

  /*private updateItemAtIndex(
    item: NewsEntryDataPayload,
    index: number,
    transform: (item: NewsEntryFormData) => NewsEntryFormData
  ): void {
    const newItem = transform(
      NewsEntryFormData.from(item, this.state.content.enums)
    ).dataPayload();
    const newData = {
      data: Array.from(this.state.content.data),
      totalNumberOfRecords: this.state.content.data.length,
    };
    if (index >= 0 && index < newData.data.length) {
      newData.data.splice(index, 1, newItem);
    }
    const newContent: Content = { ...this.state.content, data: newData };
    this.setState({ content: newContent });
    ApiDataLoader.shared.saveNewsEntry(newItem, (status) => {
      if (status !== LoadStatus.SUCCESS) {
        this.setState({
          statusMessage: {
            type: LoadStatus.FAILURE,
            text: "Failed to update news entry",
          },
        });
      }
    });
  }*/

  private onSnackBarClose(): void {
    this.setState({ statusMessage: undefined });
  }

  private filterFromSearchString(
    searchString: string,
    enums: EnumList
  ): Filter | undefined {
    const params = new URLSearchParams(searchString);
    const paramToNumber = (param: string | null) =>
      param === null ? undefined : parseInt(param, 10);
    const sport = paramToNumber(params.get("sport")) || enums.defaultSport();
    if (sport === undefined) {
      return undefined;
    }
    const paramToString = (param: string | null) =>
      param === null || param.length === 0 ? undefined : param;
    const language = paramToNumber(params.get("language"));
    const provider = paramToNumber(params.get("provider"));
    const title = paramToString(params.get("title"));

    const filter: Filter = { sport: sport };
    if (language !== undefined && !isNaN(language)) {
      filter.language = language;
    }
    if (provider !== undefined && !isNaN(provider)) {
      filter.provider = provider;
    }
    if (title !== undefined) {
      filter.title = title;
    }
    return filter;
  }

  private pageFromSearchString(searchString: string): Page {
    const params = new URLSearchParams(searchString);
    const pageParam = params.get("page");
    if (pageParam !== null) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page)) {
        return { num: page };
      }
    }
    return { num: 1 };
  }

  private hasChangesInFilter(filter: Filter): boolean {
    return (
      this.state.content.filter.sport !== filter.sport ||
      this.state.content.filter.language !== filter.language ||
      this.state.content.filter.provider !== filter.provider ||
      this.state.content.filter.title !== filter.title
    );
  }

  private filterToQueryString(filter: Filter): string {
    let queryString = "";
    let defaultSport = this.state.content.enums.defaultSport();
    if (defaultSport !== undefined && filter.sport !== defaultSport) {
      queryString += "sport=" + filter.sport;
    }
    if (filter.provider !== undefined && filter.provider !== 0) {
      queryString +=
        (queryString.length > 0 ? "&" : "") + "provider=" + filter.provider;
    }
    if (filter.language !== undefined && filter.language !== 0) {
      queryString +=
        (queryString.length > 0 ? "&" : "") + "language=" + filter.language;
    }
    if (filter.title !== undefined && filter.title !== "") {
      queryString +=
        (queryString.length > 0 ? "&" : "") + "title=" + filter.title;
    }
    return queryString;
  }

  private pageToQueryString(page: Page): string {
    let queryString = "";
    if (page.num > 1) {
      queryString += "page=" + page.num;
    }
    return queryString;
  }
}

export default withRouter(withStyles(styles)(NewsEntryList));
