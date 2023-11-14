import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import { MenuItemList } from "../../../models/menu/menu-item-list";
import { MenuItem } from "../../../models/menu/menu-item";
import ResizablePaper from "../../common/resizable-paper";
import { ApiDataLoader } from "../../../api/api-data-loader";
import { LoadStatus } from "../../../models/enums/load_status";
import { IncrementalIdGenerator } from "../../../models/common/incremental-id-generator";
import { MenuItemPayloadBuilder } from "../../../models/menu/builders/menu-item-payload-builder";
import { Grid } from "@material-ui/core";
import LoadingIndicator from "../../common/loading-indicator";
import MenuSortableTree from "./menu-sortable-tree";
import { MenuItemBuilder } from "../../../models/menu/builders/menu-item-builder";
import { MenuItemType } from "../../../models/enums/menu-item-type";
import MenuEditBottomBar from "../../common/base-edit-bottom-bar";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import SearchFieldForm from "../../common/search-field-form";
import { MenuDataPayload } from "../../../models/menu/menu-data-payload";
import { Sport } from "../../../models/enums/sport";
import { EditStatusMessage } from "../../../models/ui/edit-status-message";
import MenuEditStatusBox from "./menu-edit-status-box";
import BaseMenuEdit, { BaseMenuEditState } from "./base-menu-edit";
import { EnumList } from "../../../models/common/enum-list";
import { TreeDataNodeType } from "../../../models/enums/tree-data-node-type";
import { ConfigUtil } from "../../../utils/config-util";
import MasterError from "../../master-error";
import { Routes } from "../../routing";

const styles = () =>
  createStyles({
    paper: {
      maxWidth: "100%",
      margin: "auto",
      overflow: "hidden",
    },
    savingProgress: {
      textAlign: "center",
    },
  });

interface RProps extends RouteComponentProps<any>, WithStyles<typeof styles> {
  id: number;
}

interface RState extends BaseMenuEditState {
  isError: boolean;
  menuItemList: MenuItemList;
  menuItems: Array<MenuItem>;
  popularItems: Array<MenuItem>;
  enums: EnumList;
}

class MenuPopularEdit extends BaseMenuEdit<RProps, RState> {
  private readonly treeIdCounter = new IncrementalIdGenerator();
  private readonly menuItemListBuilder = new MenuItemPayloadBuilder(
    this.treeIdCounter
  );

  constructor(props: RProps) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      loadStatus: -1,
      name: "",
      menuItemList: MenuItemList.create(),
      menuItems: new Array<MenuItem>(),
      popularItems: new Array<MenuItem>(),
      enums: EnumList.createEmoty(),
      searchString: "",
      contentHeight: 0,
      isSnackbarOpen: false,
    };
  }

  componentDidMount() {
    if (this.props.id) {
      ApiDataLoader.shared.loadMenu(this.props.id, (status, data, enums) => {
        if (status === LoadStatus.SUCCESS) {
          this.updateStateFromData(data, enums);
        } else {
          this.setState({
            isLoading: false,
            loadStatus: status,
            isError: status === LoadStatus.FAILURE,
          });
        }
      });
    } else {
      this.setState({ isLoading: false, isError: true });
    }
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

    const insets = { left: 0, top: 70 + 48, right: 0, bottom: 52 + 48 };
    return (
      <ResizablePaper
        insets={insets}
        onResize={(height) => this.setState({ contentHeight: height - 99 })}
      >
        {this.renderContent()}
      </ResizablePaper>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.state.isLoading) {
      return (
        <>
          <LoadingIndicator />
          {this.renderSavingProgress(this.props.classes.savingProgress)}
        </>
      );
    }
    if (this.state.isError) {
      return <MasterError type="unknown" />;
    }
    return (
      <>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar style={{ paddingLeft: 12, paddingRight: 8 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <SearchFieldForm
                  version={1}
                  searchString={this.state.searchString}
                  onChange={(value) => this.setState({ searchString: value })}
                />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={6}>
            {this.renderMenuList()}
          </Grid>
          <Grid item xs={6}>
            {this.renderPopularItems()}
          </Grid>
        </Grid>
        {this.renderBottomBar()}
        {this.renderSnackBar()}
      </>
    );
  }

  private renderMenuList(): React.ReactNode {
    const config = {
      height: this.state.contentHeight,
      searchString: this.state.searchString,
      canDrag: () => false,
      onAddClick: (node: any) => this.onMenuListAdd(node),
      onChange: (data: any) => this.onMenuListChange(data),
    };
    return <MenuSortableTree config={config} data={this.state.menuItems} />;
  }

  private renderPopularItems(): React.ReactNode {
    if (this.state.popularItems.length === 0) {
      return "Popular items are empty.";
    }
    const config = {
      height: this.state.contentHeight,
      searchString: this.state.searchString,
      isNodeHidden: (node: any) => !node.isPopularVisible,
      canHide: (node: any) =>
        node.type === TreeDataNodeType.CATEGORY ||
        node.type === TreeDataNodeType.STAGE,
      canDrop: () => true,
      canNodeHaveChildren: () => false,
      onRemoveClick: (node: any) => this.onPopularItemRemove(node),
      onChange: (data: any) => this.onPopularItemsChange(data),
      onHideClick: (node: any) => this.togglePopularItemHidden(node),
    };
    return <MenuSortableTree config={config} data={this.state.popularItems} />;
  }

  private renderBottomBar(): React.ReactNode {
    return (
      <MenuEditBottomBar>
        <MenuEditStatusBox statusMessage={this.state.statusMessage} errorOnly />
        <Button
          variant="contained"
          key="save-and-publish"
          color="primary"
          onClick={() => this.onSaveClick(true)}
        >
          Save and Publish
        </Button>
        <Button
          variant="contained"
          key="save"
          onClick={() => this.onSaveClick(false)}
        >
          Save
        </Button>
        <Button
          variant="contained"
          key="cancel"
          href="/#/content/popular-selection"
        >
          Cancel
        </Button>
      </MenuEditBottomBar>
    );
  }

  private onMenuListAdd(node: any): void {
    if (
      this.state.popularItems.findIndex((item) => item.treeId === node.treeId) <
      0
    ) {
      const newPopularItems = Array.from(this.state.popularItems);
      const title = MenuItemList.namePath(
        node.treeId,
        this.state.menuItems
      ).join(" ");
      newPopularItems.push(
        MenuItemBuilder.fromMenuItem(node)
          .setChildren([])
          .setTitle(title)
          .build()
      );
      this.setState({
        popularItems: newPopularItems,
        statusMessage: undefined,
      });
    }
  }

  private onMenuListChange(data: any): void {
    this.setState({ menuItems: data });
  }

  private onPopularItemsChange(data: any): void {
    this.setState({ popularItems: data });
  }

  private onPopularItemRemove(item: any): void {
    const newPopularItems = this.state.popularItems.filter(
      (i) => i.treeId !== item.treeId
    );
    this.setState({ popularItems: newPopularItems, statusMessage: undefined });
  }

  private togglePopularItemHidden(item: any): void {
    const newItem = MenuItemBuilder.fromMenuItem(item)
      .setIsPopularVisible(item.isPopularVisible !== true)
      .build();
    this.setState((state) => {
      const newPopularItems = Array.from(state.popularItems);
      const index = newPopularItems.findIndex(
        (item) => newItem.treeId === item.treeId
      );
      if (index >= 0) {
        newPopularItems.splice(index, 1, newItem);
      }
      return { popularItems: newPopularItems };
    });
  }

  private onSaveClick(publish: boolean): void {
    const languages = this.state.enums.getLanguages();
    const sportId = Sport.fromCode(this.state.sport);
    const popularItemOrdering = new Map<number, [number, boolean]>();
    this.state.popularItems.forEach((item, index) => {
      popularItemOrdering.set(item.treeId, [index + 1, item.isPopularVisible]);
    });
    const newItemList = this.state.menuItemList
      .mapped((itemBuilder) => {
        const [sortOrderPopular, isPopularVisible] = popularItemOrdering.get(
          itemBuilder.treeId
        ) || [0, false];
        return itemBuilder
          .setIsPopular(sortOrderPopular > 0)
          .setIsPopularVisible(isPopularVisible)
          .setSortOrderPopular(sortOrderPopular);
      })
      .withAppliedLocalizedSortOrders(languages);
    if (sportId) {
      const progressMessages = new Array<string>();
      progressMessages.push("Saving menu data");
      if (publish) {
        progressMessages.push("Publishing menu data");
      }
      this.setState({
        isLoading: true,
        savingProgressMessages: [progressMessages[0]],
      });
      const progress = (index: number) => {
        if (index > 0 && index < progressMessages.length) {
          this.setState({
            savingProgressMessages: progressMessages.slice(0, index + 1),
          });
        }
      };
      const complete = (
        isError: boolean,
        status: number,
        data?: MenuDataPayload,
        message?: string
      ): void => {
        if (!isError && data !== undefined) {
          const statusMessage = {
            message: "Popular selection saved successfully",
            type: 0,
          };
          this.updateStateFromData(data, this.state.enums, statusMessage);
        } else {
          const statusMessage = {
            message: "Error occurred while saving data",
            detail: message,
            type: 1,
          };
          this.setState({
            isLoading: false,
            statusMessage: statusMessage,
            savingProgressMessages: undefined,
            isSnackbarOpen: true,
          });
        }
      };
      this.performSave(
        this.props.id,
        sportId,
        newItemList.serializable(),
        publish,
        undefined,
        progress,
        complete
      );
    }
  }

  private updateStateFromData(
    data?: MenuDataPayload,
    enums?: EnumList,
    statusMessage?: EditStatusMessage
  ): void {
    const payload = this.menuItemListBuilder.fromMenuDataPayload(data);
    const itemList = MenuItemList.from(
      payload.menuItems,
      ConfigUtil.defaultLanguage(),
      payload.localizedSortOrders
    );
    const items = itemList.filteredItems(
      (item) => item.type !== MenuItemType.SEASON
    );
    const popular = itemList.popular();
    this.setState({
      name: data?.name || "",
      sport: !data ? undefined : Sport.code(data.sportId),
      publishUrl: data?.publishUrl,
      isLoading: false,
      menuItemList: itemList,
      menuItems: items,
      popularItems: popular,
      enums: enums || EnumList.createEmoty(),
      statusMessage: statusMessage,
      savingProgressMessages: undefined,
      isSnackbarOpen: true,
      loadStatus: LoadStatus.SUCCESS,
    });
  }
}

export default withRouter(withStyles(styles)(MenuPopularEdit));
