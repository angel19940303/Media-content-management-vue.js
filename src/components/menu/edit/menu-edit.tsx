import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { MenuItem } from "../../../models/menu/menu-item";
import { AssignedSeasonCounter } from "../../../models/ui/assigned-season-counter";
import { IncrementalIdGenerator } from "../../../models/common/incremental-id-generator";
import { MenuItemPayloadBuilder } from "../../../models/menu/builders/menu-item-payload-builder";
import { ApiDataLoader } from "../../../api/api-data-loader";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import MenuIcon from "@material-ui/icons/Menu";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { TreeDataNodeType } from "../../../models/enums/tree-data-node-type";
import MenuSortableTree from "./menu-sortable-tree";
import MenuEditBottomBar from "../../common/base-edit-bottom-bar";
import MenuItemEditForm from "./menu-item-edit-form";
import { MenuItemBuilder } from "../../../models/menu/builders/menu-item-builder";
import { MenuFormData } from "../../../models/ui/menu-form-data";
import { MenuItemList } from "../../../models/menu/menu-item-list";
import SearchFieldForm from "../../common/search-field-form";
import { Sport } from "../../../models/enums/sport";
import { MenuDataPayload } from "../../../models/menu/menu-data-payload";
import { LoadStatus } from "../../../models/enums/load_status";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import LoadingIndicator from "../../common/loading-indicator";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import { Icon } from "@material-ui/core";
import StageMappingUnassignedDialog from "./stage-mapping/stage-mapping-unassigned-dialog";
import { StageMapping } from "../../../models/menu/stage-mapping";
import { MenuItemType } from "../../../models/enums/menu-item-type";
import { Provider } from "../../../models/enums/provider";
import MenuEditActionsPopper from "./menu-edit-actions-popper";
import { MenuEditAction } from "../../../models/enums/menu-edit-action";
import StageDataBatchAnalyserDialog from "./menu-item-analyser/menu-item-batch-analyser-dialog";
import { CsvUtil } from "../../../utils/csv-util";
import DataImportDialog from "./data-import/data-import-dialog";
import { EnumList } from "../../../models/common/enum-list";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { MenuItem as MenuItemComponent } from "@material-ui/core";
import {
  FullTree,
  NodeData,
  OnMovePreviousAndNextLocation,
} from "react-sortable-tree";
import { LocalizedSortOrderBuilder } from "../../../models/menu/builders/localized-sort-order-builder";
import BaseMenuEdit, { BaseMenuEditState } from "./base-menu-edit";
import StageDataBatchPullDialog from "./batch-pull-dialog/batch-pull-dialog";
import BatchTranslateDialog from "./batch-translate-dialog/batch-translate-dialog";
import { Locale } from "../../../models/common/locale";
import { ConfigUtil } from "../../../utils/config-util";
import RecentInvisibleSeasonOverview from "./recent-invisible-seasons/recent-invisible-seasons-message";
import { AuthUserContext } from "../../login/auth-user-context";
import { categories, Routes } from "../../routing";
import MasterError from "../../master-error";
import SeasonDateRecoveryDialog from "./season-date-recovery/season-date-recovery-dialog";
import OrderRootItemsDialog from "./order-root-items-dialog/order-root-items-dialog";
import { BatchTranslateFormData } from "../../../models/ui/batch-translate-form-data";
import CleanupDialog from "./cleanup-dialog/cleanup-dialog";

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
    addUser: {
      marginRight: theme.spacing(1),
    },
    narrowMenu: {
      float: "left",
      width: "350px",
    },
    statusMessage: {
      position: "absolute",
      paddingLeft: 15,
      left: 0,
      display: "flex",
      alignItems: "center",
    },
    statusMessageSuccess: {
      color: theme.palette.success.main,
    },
    statusMessageError: {
      color: theme.palette.error.main,
    },
    statusMessageInfoIcon: {
      fontSize: "1em",
      width: 22,
      height: 24,
      marginLeft: 3,
      "& svg": {
        verticalAlign: "middle",
        width: 22,
      },
    },
    savingProgress: {
      textAlign: "center",
    },
  });

interface Selection {
  item: MenuItem;
  parentId?: number;
  isNew: boolean;
  siblings: Array<MenuItem>;
  basePath: Array<string>;
  existingEntryIds: Set<string>;
}

export interface RProps
  extends RouteComponentProps<any>,
    WithStyles<typeof styles> {
  sport?: string;
  id?: number;
  providerId?: number;
  sourceId?: number;
}

export interface RState extends BaseMenuEditState {
  id?: number;
  menuItems: MenuItemList;
  selection?: Selection;
  assignedSeasonCounter: AssignedSeasonCounter;
  innerContentHeight: number;
  filterBarHeight: number;
  isStageMappingUnassignedDialogOpen?: boolean;
  stageBatchAnalysisData?: Array<MenuItem>;
  isCsvImportOpen: boolean;
  isStageDataBatchPullOpen: boolean;
  isMenuDataBatchTranslateOpen: boolean;
  isSeasonDateRecoveryDialogOpen: boolean;
  isOrderRootItemsDialogOpen: boolean;
  isCleanupDialogOpen: boolean;
  selectedLanguage: string;
  enums: EnumList;
}

class MenuEdit extends BaseMenuEdit<RProps, RState> {
  private static readonly PROVIDER_IDS_TO_PULL = new Set<number>([2]);
  private static readonly ACTIONS = MenuEditAction.all();

  private readonly csvUtil = CsvUtil.create();
  private readonly treeIdCounter = new IncrementalIdGenerator();
  private readonly assignedMappings = new Map<string, StageMapping>();
  private readonly menuItemListBuilder = new MenuItemPayloadBuilder(
    this.treeIdCounter
  );
  private readonly resizeEventListener: EventListener;

  constructor(props: RProps) {
    super(props);
    const contentHeight = MenuEdit.contentHeight();
    this.state = {
      id: props.id,
      sport: props.sport,
      name: "",
      menuItems: MenuItemList.create(),
      searchString: "",
      assignedSeasonCounter: AssignedSeasonCounter.create(),
      isLoading: true,
      contentHeight: contentHeight,
      innerContentHeight: contentHeight - 49,
      filterBarHeight: 0,
      isSnackbarOpen: false,
      isCsvImportOpen: false,
      isStageDataBatchPullOpen: false,
      isMenuDataBatchTranslateOpen: false,
      isSeasonDateRecoveryDialogOpen: false,
      isOrderRootItemsDialogOpen: false,
      isCleanupDialogOpen: false,
      selectedLanguage: ConfigUtil.defaultLanguage(),
      enums: EnumList.createEmoty(),
      loadStatus: -1,
    };
    this.resizeEventListener = () => this.onWindowResize.call(this);
  }

  private static contentHeight(): number {
    return Math.max(window.innerHeight - 70 - 48 - 52 - 48, 0);
  }

  private static treeContainer(): Element | undefined {
    const wrapper = document.getElementById("menu-item-tree");
    if (wrapper) {
      const containers = wrapper.getElementsByClassName(
        "rst__virtualScrollOverride"
      );
      if (containers && containers.length > 0) {
        return containers[0];
      }
    }
    return undefined;
  }

  componentDidMount() {
    if (this.state.sport && this.props.providerId) {
      ApiDataLoader.shared.loadSportProviderStages(
        this.state.sport,
        this.props.providerId,
        (status, data, enums) => {
          if (status === 0) {
            const payload = this.menuItemListBuilder.fromSportData(
              data?.categories
            );
            this.setState({
              isLoading: false,
              menuItems: MenuItemList.from(
                payload.menuItems,
                this.state.selectedLanguage,
                payload.localizedSortOrders
              ),
              assignedSeasonCounter: AssignedSeasonCounter.from(
                payload.assignedSeasonCounts
              ),
              enums: enums || EnumList.createEmoty(),
            });
          } else {
            console.log("Something went wrong");
            this.setState({ isLoading: false });
          }
        }
      );
    } else {
      ApiDataLoader.shared.loggedInWithPermissions((status, user) => {
        if (status === LoadStatus.SUCCESS) {
          const userPermissions = user?.permissions || this.context.permissions;
          const pagePermissions =
            categories
              .flatMap((c) => c.children)
              .find((c) => this.props.location.pathname.startsWith(c.path))
              ?.permissions || [];
          if (
            pagePermissions.find((p) => (userPermissions & p) > 0) === undefined
          ) {
            this.setState({
              isLoading: false,
              loadStatus: LoadStatus.UNAUTHORIZED,
            });
          } else {
            if (this.props.id || this.props.sourceId) {
              const id = this.props.sourceId || this.props.id || 0;
              ApiDataLoader.shared.loadMenu(id, (status, data, enums) => {
                if (status === LoadStatus.SUCCESS) {
                  const payload = this.menuItemListBuilder.fromMenuDataPayload(
                    data
                  );
                  this.setState({
                    isLoading: false,
                    publishUrl: payload.publishUrl,
                    menuItems: MenuItemList.from(
                      payload.menuItems,
                      this.state.selectedLanguage,
                      payload.localizedSortOrders
                    ),
                    assignedSeasonCounter: AssignedSeasonCounter.from(
                      payload.assignedSeasonCounts
                    ),
                    name: data?.name || "",
                    sport: !data ? undefined : Sport.code(data.sportId),
                    enums: enums || EnumList.createEmoty(),
                  });
                } else {
                  this.setState({ isLoading: false });
                }
              });
            } else {
              this.setState({ isLoading: false });
            }
          }
        } else {
          this.setState({ isLoading: false, loadStatus: status });
        }
      });
    }
    window.addEventListener("resize", this.resizeEventListener);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEventListener);
  }

  render(): React.ReactNode {
    if (
      this.state.isLoading &&
      this.state.loadStatus === LoadStatus.UNAUTHENTICATED
    ) {
      return <Redirect to={Routes.Login} />;
    }
    if (
      this.state.isLoading &&
      this.state.loadStatus === LoadStatus.UNAUTHORIZED
    ) {
      return <MasterError type="unauthorized" />;
    }

    return (
      <>
        <MenuEditActionsPopper
          actions={MenuEdit.ACTIONS}
          onSelect={(action) => this.onSelectEditAction(action)}
        />
        <Paper
          className={this.props.classes.paper}
          style={{ height: this.state.contentHeight }}
        >
          {this.renderContent()}
        </Paper>
      </>
    );
  }

  private renderContent(): React.ReactNode {
    const { classes } = this.props;

    if (this.state.isLoading) {
      return (
        <>
          <LoadingIndicator />
          {this.renderSavingProgress(this.props.classes.savingProgress)}
        </>
      );
    }

    const menuSortableTreeConfig = {
      searchString: this.state.searchString,
      height: this.state.innerContentHeight - 50,
      validationErrors: this.state.menuItems.validationErrors,
      canHide: (node: any) =>
        (node.type === TreeDataNodeType.STAGE ||
          node.type === TreeDataNodeType.CATEGORY) &&
        node.treeId !== this.state.selection?.item.treeId,
      hasPrimary: (node: any) =>
        node.type === TreeDataNodeType.SEASON &&
        this.state.selection === undefined,
      canPull: (node: any) =>
        (node.type === TreeDataNodeType.STAGE &&
          node.children !== undefined &&
          node.children.length > 0) ||
        node.type === TreeDataNodeType.SEASON,
      isNodeHidden: (node: any) =>
        (node.type === TreeDataNodeType.STAGE ||
          node.type === TreeDataNodeType.CATEGORY) &&
        node.hidden === true,
      canBeDomestic: (node?: any) =>
        node?.type === TreeDataNodeType.STAGE ||
        node?.type === TreeDataNodeType.CATEGORY,
      isNodeDomestic: (node: any) =>
        (node.type === TreeDataNodeType.STAGE &&
          node.domesticLeague === true) ||
        (node.type === TreeDataNodeType.CATEGORY &&
          node.children.every((child: any) => child.domesticLeague)),
      isNodePrimary: (node: any) =>
        node.type === TreeDataNodeType.SEASON && node.primary === true,
      onChange: (data: any) => this.onTreeDataChange(data),
      onCreateClick: (nodeType: number, parent?: any) =>
        this.addNode(nodeType, parent),
      onEditClick: (item: any, parent?: any) => this.editItem(item, parent),
      onRemoveClick: (item: any) => this.removeItem(item),
      onHideClick: (item: any) => this.toggleItemHidden(item),
      onDomesticClick: (item: any) => this.toggleItemDomestic(item),
      onPrimaryClick: (item: any) => this.toggleItemPrimary(item),
      onPullClick: (item: any) => this.pullItem(item),
      onMoveNode: (node: NodeData & FullTree & OnMovePreviousAndNextLocation) =>
        this.onTreeDataMoveNode(node),
    };

    const mediumMenuWidth = this.state.selection ? 6 : 12;
    return (
      <>
        <RecentInvisibleSeasonOverview
          menuItemList={this.state.menuItems}
          onUpdate={(primary, visible) =>
            this.onInvisibleSeasonsUpdate(primary, visible)
          }
        />
        <AppBar
          className={classes.searchBar}
          position="static"
          color="default"
          elevation={0}
        >
          <Toolbar style={{ paddingLeft: 12, paddingRight: 8 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <MenuIcon className={classes.block} color="inherit" />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  placeholder="Menu Name"
                  value={this.state.name}
                  InputProps={{
                    disableUnderline: true,
                    className: classes.searchInput,
                  }}
                  onChange={(event) =>
                    this.setState({ name: event.target.value })
                  }
                />
              </Grid>
              <Grid item xs>
                <FormControl variant="outlined" size="small" fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.selectedLanguage}
                    onChange={(event) => this.onLanguageChange(event)}
                    label="Language"
                  >
                    {ConfigUtil.languages().map((lang) => (
                      <MenuItemComponent key={lang.code} value={lang.code}>
                        {lang.name}
                      </MenuItemComponent>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs>
                <SearchFieldForm
                  version={1}
                  searchString={this.state.searchString}
                  onChange={(searchString) =>
                    this.setState({ searchString: searchString })
                  }
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.addUser}
                  disabled={this.state.selection !== undefined}
                  onClick={() => this.addNode(TreeDataNodeType.CATEGORY)}
                >
                  Add category
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={12} md={mediumMenuWidth}>
            <MenuSortableTree
              id="menu-item-tree"
              data={this.state.menuItems.all()}
              config={menuSortableTreeConfig}
            />
            {this.renderBottomBar()}
          </Grid>
          {this.renderEditForm()}
        </Grid>
        {this.renderStageMappingUnassignedDialog()}
        {this.renderStageDataBatchAnalyserDialog()}
        {this.renderStageDataBatchPullDialog()}
        {this.renderMenuDataBatchTranslateDialog()}
        {this.renderCsvImportDialog()}
        {this.renderSeasonDateRecoveryDialog()}
        {this.renderOrderRootItemsDialog()}
        {this.renderCleanupDialog()}
        {this.renderSnackBar()}
      </>
    );
  }

  private renderBottomBar(): React.ReactNode {
    const content = new Array<React.ReactNode>();
    if (
      this.state.statusMessage &&
      this.state.statusMessage.skipBottomBar !== true &&
      this.state.statusMessage.type !== LoadStatus.SUCCESS
    ) {
      let className = this.props.classes.statusMessage;
      if (this.state.statusMessage.type === 0) {
        className += " " + this.props.classes.statusMessageSuccess;
      } else if (this.state.statusMessage.type === 1) {
        className += " " + this.props.classes.statusMessageError;
      }
      let tooltip: React.ReactNode = undefined;
      if (this.state.statusMessage.detail) {
        tooltip = (
          <Tooltip title={this.state.statusMessage.detail}>
            <Icon className={this.props.classes.statusMessageInfoIcon}>
              <InfoIcon />
            </Icon>
          </Tooltip>
        );
      }
      content.push(
        <div key="status-message" className={className}>
          {this.state.statusMessage.message}
          {tooltip}
        </div>
      );
    }
    if (this.state.selection === undefined) {
      let saveButtonColor: "default" | "primary" = "primary";
      if (this.state.id !== undefined && this.state.id > 0) {
        content.push(
          <Button
            variant="contained"
            key="save-and-publish"
            color="primary"
            onClick={() => this.onSaveClick(true)}
          >
            Save and Publish
          </Button>
        );
        saveButtonColor = "default";
      }
      content.push(
        <Button
          variant="contained"
          key="save"
          color={saveButtonColor}
          onClick={() => this.onSaveClick(false)}
        >
          Save
        </Button>
      );
      content.push(
        <Button
          variant="contained"
          key="cancel"
          href="/#/content/menu-structure"
        >
          Cancel
        </Button>
      );
    }
    return <MenuEditBottomBar>{content}</MenuEditBottomBar>;
  }

  private renderEditForm(): React.ReactNode {
    if (!this.state.selection) {
      return "";
    }
    return (
      <MenuItemEditForm
        key={this.state.selection.item.treeId}
        item={this.state.selection.item}
        siblings={this.state.selection.siblings}
        basePath={this.state.selection.basePath}
        existingEntryIds={this.state.selection.existingEntryIds}
        height={this.state.innerContentHeight}
        assignedSeasonCounter={this.state.assignedSeasonCounter}
        isNew={this.state.selection.isNew}
        sport={this.state.sport}
        onSave={(data, assignedSeasonCounter) =>
          this.onDataUpdate(data, assignedSeasonCounter)
        }
        onCancel={() => this.onDataEditCancel()}
        onStageMappingRefresh={(mapping) =>
          this.onStageMappingRefresh([mapping])
        }
        selectedLanguage={this.state.selectedLanguage}
        countryCodes={this.state.enums.getCountryCodes()}
        onError={(loadStatus) => this.setState({ loadStatus: loadStatus })}
      />
    );
  }

  private renderStageMappingUnassignedDialog(): React.ReactNode {
    if (
      this.state.isStageMappingUnassignedDialogOpen !== true ||
      !this.state.sport
    ) {
      return "";
    }
    return (
      <StageMappingUnassignedDialog
        mainProvider={this.sportMainProvider(this.state.sport)}
        sport={this.state.sport}
        menuItems={this.state.menuItems}
        assignedSeasonCounter={this.state.assignedSeasonCounter}
        onSelect={(mapping, item) =>
          this.onUnassignedMappingSelect(mapping, item)
        }
        onClose={() =>
          this.setState({ isStageMappingUnassignedDialogOpen: false })
        }
        onError={(loadStatus) => this.setState({ loadStatus: loadStatus })}
      />
    );
  }

  private sportMainProvider(sport: string): number {
    switch (sport) {
      case Sport.code(Sport.CRICKET):
        return Provider.SCC;
      case Sport.code(Sport.BASEBALL):
      case Sport.code(Sport.AMERICAN_FOOTBALL):
        return Provider.SPORTRADAR;
      default:
        return Provider.ENET;
    }
  }

  private renderStageDataBatchAnalyserDialog() {
    if (
      this.state.stageBatchAnalysisData === undefined ||
      this.state.sport === undefined
    ) {
      return "";
    }
    return (
      <StageDataBatchAnalyserDialog
        sport={this.state.sport}
        menuItems={this.state.menuItems.flatListOfType(MenuItemType.STAGE)}
        onApplyResults={(ids, property, value) =>
          this.onApplyMenuItemBatchAnalysisResults(ids, property, value)
        }
        onClose={() => this.setState({ stageBatchAnalysisData: undefined })}
        onError={(loadStatus) => this.setState({ loadStatus: loadStatus })}
      />
    );
  }

  private renderStageDataBatchPullDialog() {
    if (
      !this.state.isStageDataBatchPullOpen ||
      this.state.sport === undefined ||
      this.props.id === undefined
    ) {
      return "";
    }
    return (
      <StageDataBatchPullDialog
        menuData={this.state.menuItems.all()}
        isOpen={this.state.isStageDataBatchPullOpen}
        onClose={() => this.setState({ isStageDataBatchPullOpen: false })}
        onError={(loadStatus) => this.setState({ loadStatus: loadStatus })}
      />
    );
  }

  private renderMenuDataBatchTranslateDialog() {
    if (!this.state.isMenuDataBatchTranslateOpen) {
      return "";
    }
    return (
      <BatchTranslateDialog
        data={BatchTranslateFormData.fromMenuData(this.state.menuItems.all())}
        isOpen={this.state.isMenuDataBatchTranslateOpen}
        onApply={(translations) =>
          this.onMenuDataBatchTranslateApply(translations)
        }
        onClose={() => this.setState({ isMenuDataBatchTranslateOpen: false })}
      />
    );
  }

  private renderCsvImportDialog() {
    return (
      <DataImportDialog
        type="csv"
        isOpen={this.state.isCsvImportOpen}
        onApply={(type: string, data: string) =>
          this.onApplyImportedCsvData(data)
        }
        onClose={() => this.setState({ isCsvImportOpen: false })}
      />
    );
  }

  private renderSeasonDateRecoveryDialog(): React.ReactNode {
    if (!this.state.isSeasonDateRecoveryDialogOpen) {
      return "";
    }
    return (
      <SeasonDateRecoveryDialog
        isOpen={this.state.isSeasonDateRecoveryDialogOpen}
        sport={this.state.sport}
        menuItems={this.state.menuItems}
        onComplete={(menuItems) =>
          this.setState({
            menuItems: menuItems,
            isSeasonDateRecoveryDialogOpen: false,
          })
        }
        onClose={() => this.setState({ isSeasonDateRecoveryDialogOpen: false })}
      />
    );
  }

  private renderOrderRootItemsDialog(): React.ReactNode {
    return (
      <OrderRootItemsDialog
        isOpen={this.state.isOrderRootItemsDialogOpen}
        menuItemList={this.state.menuItems}
        selectedLanguage={this.state.selectedLanguage}
        onApply={(menuItemList) => {
          this.setState({
            menuItems: menuItemList,
            isOrderRootItemsDialogOpen: false,
          });
        }}
        onClose={() => this.setState({ isOrderRootItemsDialogOpen: false })}
      />
    );
  }

  private renderCleanupDialog(): React.ReactNode {
    if (this.state.sport === undefined || !this.state.isCleanupDialogOpen) {
      return null;
    }
    return (
      <CleanupDialog
        isOpen={this.state.isCleanupDialogOpen}
        sport={this.state.sport}
        menu={this.state.menuItems}
        onApply={(menuItems) => this.onApplyCleanup(menuItems)}
        onClose={() => this.setState({ isCleanupDialogOpen: false })}
      />
    );
  }

  private onTreeDataChange(data: any): void {
    const newItems = MenuItemList.from(
      data,
      this.state.selectedLanguage,
      this.state.menuItems.localizedSortOrders
    );
    if (this.state.selection) {
      let siblings: Array<MenuItem>;
      let basePath: Array<string>;
      if (this.state.selection.isNew) {
        const parent = newItems.find(this.state.selection.parentId);
        siblings = parent?.item.children || data;
        basePath = parent?.path || [];
      } else {
        const node = newItems.find(this.state.selection.item.treeId);
        node?.path.pop();
        siblings = (node?.parent?.children || data).filter(
          (item: any) => item.treeId !== this.state.selection?.item.treeId
        );
        basePath = node?.path || [];
      }
      const newSelection: Selection = {
        item: this.state.selection.item,
        parentId: this.state.selection.parentId,
        isNew: this.state.selection.isNew,
        siblings: siblings,
        basePath: basePath,
        existingEntryIds: this.state.selection.existingEntryIds,
      };
      this.setState({ menuItems: newItems, selection: newSelection });
    } else {
      this.setState({ menuItems: newItems });
    }
  }

  private onTreeDataMoveNode(
    node: NodeData & FullTree & OnMovePreviousAndNextLocation
  ): void {
    const localizedSortOrderBuilder = LocalizedSortOrderBuilder.create().setLocalizedSortOrders(
      this.state.menuItems.localizedSortOrders
    );
    this.updateSortOrdersAtPath(node.prevPath, localizedSortOrderBuilder);
    this.updateSortOrdersAtPath(node.nextPath, localizedSortOrderBuilder);
    this.setState((state) => {
      return {
        menuItems: MenuItemList.from(
          state.menuItems.items,
          state.selectedLanguage,
          localizedSortOrderBuilder.build()
        ),
      };
    });
  }

  private updateSortOrdersAtPath(
    path: Array<number | string>,
    sortOrderBuilder: LocalizedSortOrderBuilder
  ): void {
    if (path.length > 1) {
      const parentId = path[path.length - 2];
      const nodeId = path[path.length - 1];
      if (typeof parentId === "number" && typeof nodeId === "number") {
        const parent = this.state.menuItems.find(parentId)?.item;
        if (parent !== undefined) {
          const childIds = parent.children.map((child) => child.treeId);
          sortOrderBuilder.updateLocalizedSortOrdersFromIds(
            this.state.selectedLanguage,
            childIds,
            nodeId
          );
        }
      }
    }
  }

  private onMenuDataBatchTranslateApply(
    translations: Map<number, Locale>
  ): void {
    this.setState((state) => {
      const newMenuItems = state.menuItems.mapped((itemBuilder) => {
        const newName = translations.get(itemBuilder.treeId);
        if (newName !== undefined) {
          itemBuilder.setName(newName);
          const newTitle = newName.locale.get(this.state.selectedLanguage);
          if (newTitle !== undefined) {
            itemBuilder.setTitle(newTitle.value);
          }
        }
        return itemBuilder;
      });
      return { menuItems: newMenuItems, isMenuDataBatchTranslateOpen: false };
    });
  }

  private addNode(nodeType: number, parent?: MenuItem): void {
    this.setState({
      selection: {
        item: MenuItemBuilder.create()
          .setType(nodeType)
          .setTreeId(this.treeIdCounter.getAndIncrement())
          .build(),
        parentId: parent?.treeId,
        isNew: true,
        siblings: parent?.children || this.state.menuItems.all(),
        basePath: this.state.menuItems.find(parent?.treeId)?.path || [],
        existingEntryIds: this.state.menuItems.entryIds(),
      },
      statusMessage: undefined,
    });
  }

  private editItem(item: MenuItem, parent: MenuItem | undefined): void {
    const siblings = parent?.children || this.state.menuItems.all();
    this.setState({
      selection: {
        item: item,
        parentId: parent?.treeId,
        isNew: false,
        siblings: siblings.filter((n) => n.treeId !== item.treeId),
        basePath: this.state.menuItems.find(parent?.treeId)?.path || [],
        existingEntryIds: this.state.menuItems.entryIds(),
      },
      statusMessage: undefined,
    });
  }

  private removeItem(item: any): void {
    const newItems = this.state.menuItems.remove(item.treeId);
    let selection: Selection | undefined = this.state.selection;
    if (selection) {
      const isSelectionInNewItems =
        (!selection.isNew && !newItems.contains(selection.item.treeId)) ||
        (selection.isNew &&
          selection.parentId !== undefined &&
          !newItems.contains(selection.parentId));
      if (isSelectionInNewItems) {
        selection = undefined;
      } else {
        selection.existingEntryIds = newItems.entryIds();
        selection.siblings = selection.siblings.filter(
          (sibling) => sibling.treeId !== item.treeId
        );
      }
    }
    let assignedSeasonCounter = this.state.assignedSeasonCounter;
    const stageMappingIds = MenuItemList.stageMappingIds([item]);
    if (stageMappingIds.length > 0) {
      assignedSeasonCounter = assignedSeasonCounter.decrementAll(
        stageMappingIds
      );
    }
    this.updateAssignedMappings(item, true);
    this.setState({
      menuItems: newItems,
      assignedSeasonCounter: assignedSeasonCounter,
      selection: selection,
      statusMessage: undefined,
    });
  }

  private updateAssignedMappings(item: MenuItem, remove: boolean): void {
    if (item.stageMappings !== undefined && item.stageMappings.length > 0) {
      item.stageMappings.forEach((mapping) => {
        const compositeStageId = mapping.providerId + "-" + mapping.stageId;
        if (remove) {
          this.assignedMappings.delete(compositeStageId);
        } else {
          this.assignedMappings.set(compositeStageId, mapping);
        }
      });
    }
    if (item.children !== undefined && item.children.length > 0) {
      item.children.forEach((childItem) =>
        this.updateAssignedMappings(childItem, remove)
      );
    }
  }

  private toggleItemHidden(item: any): void {
    const newItem = MenuItemBuilder.fromMenuItem(item)
      .setHidden(item.hidden !== true)
      .build();
    const newItems = this.state.menuItems.update(newItem);
    this.setState({ menuItems: newItems });
  }

  private toggleItemDomestic(item: any): void {
    if (item.type === TreeDataNodeType.STAGE) {
      this.setState((state) => {
        const newItem = MenuItemBuilder.fromMenuItem(item)
          .setDomesticLeague(item.domesticLeague !== true)
          .build();
        const newItems = state.menuItems.update(newItem);
        return { menuItems: newItems };
      });
    } else if (item.type === TreeDataNodeType.CATEGORY) {
      this.setState((state) => {
        let newItems = state.menuItems;
        const isDomestic = item.children.every(
          (child: any) => child.domesticLeague
        );
        item.children.forEach((child: MenuItem) => {
          newItems = newItems.update(
            MenuItemBuilder.fromMenuItem(child)
              .setDomesticLeague(!isDomestic)
              .build()
          );
        });
        return { menuItems: newItems };
      });
    }
  }

  private toggleItemPrimary(item: any): void {
    const newItem = MenuItemBuilder.fromMenuItem(item)
      .setPrimary(item.primary !== true)
      .build();
    this.setState((state) => {
      const newItems = state.menuItems.update(newItem);
      const parent = state.menuItems.find(item.treeId)?.parent;
      if (parent !== undefined) {
        return { menuItems: newItems.update(MenuItemBuilder.rebuild(parent)) };
      }
      return { menuItems: newItems };
    });
  }

  private pullItem(item: MenuItem): void {
    if (item.type === TreeDataNodeType.STAGE) {
      if (item.children !== undefined && item.children.length > 0) {
        const itemToPull =
          item.children.find((child: any) => child.primary) ?? item.children[0];
        this.pullItem(itemToPull);
      }
      return;
    }
    if (
      item.type === TreeDataNodeType.SEASON &&
      item.stageMappings !== undefined &&
      item.stageMappings.length > 0
    ) {
      this.onStageMappingRefresh(item.stageMappings);
    }
  }

  private onDataUpdate(
    data: MenuFormData,
    assignedSeasonCounter: AssignedSeasonCounter
  ): void {
    this.setState((state) => {
      if (!state.selection) {
        return {
          selection: state.selection,
          menuItems: state.menuItems,
          assignedSeasonCounter: assignedSeasonCounter,
        };
      }
      const oldItem = state.selection.item;
      const newItemBuilder = data.menuItemBuilder().setTreeId(oldItem.treeId);

      if (!state.selection.isNew) {
        newItemBuilder.setId(state.selection.item.id);
      }
      const newTitle = data.name.locale.get(state.selectedLanguage)?.value;
      if (newTitle !== undefined) {
        newItemBuilder.setTitle(newTitle);
      }
      const newItem = newItemBuilder.build();
      const newItems = state.menuItems.store(
        newItem,
        state.selection.isNew,
        state.selection.parentId
      );
      if (newItem.type === MenuItemType.SEASON) {
        let hasChangedMappedStages =
          (newItem.stageMappings === undefined &&
            oldItem.stageMappings !== undefined) ||
          (newItem.stageMappings !== undefined &&
            oldItem.stageMappings === undefined) ||
          oldItem.stageMappings?.length !== newItem.stageMappings?.length;
        if (
          !hasChangedMappedStages &&
          newItem.stageMappings !== undefined &&
          oldItem.stageMappings !== undefined
        ) {
          const oldMappedStageIds = new Set<string>(
            oldItem.stageMappings.map((m) => m.providerId + "-" + m.stageId)
          );
          for (let i = 0; i < newItem.stageMappings.length; i++) {
            const stageMapping = newItem.stageMappings[i];
            if (
              !oldMappedStageIds.has(
                stageMapping.providerId + "-" + stageMapping.stageId
              )
            ) {
              hasChangedMappedStages = true;
              break;
            }
          }
        }
        if (hasChangedMappedStages) {
          this.updateAssignedMappings(newItem, false);
        }
      }

      return {
        selection: undefined,
        menuItems: newItems,
        assignedSeasonCounter: assignedSeasonCounter,
      };
    });
  }

  private onDataEditCancel(): void {
    this.setState({ selection: undefined });
  }

  private onUnassignedMappingSelect(
    mapping: StageMapping,
    parentItem: MenuItem
  ): void {
    const createStage = parentItem.type === MenuItemType.CATEGORY;
    const primaryItem =
      parentItem.type === MenuItemType.STAGE
        ? parentItem.children.find((child) => child.primary)
        : undefined;
    const newItem = this.menuItemListBuilder.itemStructureFromStageMapping(
      mapping,
      createStage,
      primaryItem?.title
    );
    let newItems = this.state.menuItems.store(newItem, true, parentItem.treeId);
    if (parentItem.type === MenuItemType.STAGE) {
      newItems = newItems.update(
        MenuItemBuilder.fromMenuItem(parentItem)
          .setHidden(parentItem.hidden && !newItem.primary)
          .build()
      );
    }
    newItems.collapseAllExpandIds(
      new Set<number>([parentItem.treeId, newItem.treeId])
    );
    let newSelection = this.state.selection;
    if (newSelection?.item.treeId === parentItem.treeId) {
      newSelection = undefined;
    }
    this.setState({
      isStageMappingUnassignedDialogOpen: false,
      menuItems: newItems,
      assignedSeasonCounter: this.state.assignedSeasonCounter.increment(
        mapping.stageId
      ),
      selection: newSelection,
    });
    const compositeStageId = mapping.providerId + "-" + mapping.stageId;
    this.assignedMappings.set(compositeStageId, mapping);

    const { offset, hasItem } = newItems.itemTopOffset(parentItem.treeId, 28);
    if (hasItem) {
      MenuEdit.treeContainer()?.scrollTo({ top: offset });
    }
  }

  private onStageMappingRefresh(mappings: StageMapping[]): void {
    const ids: [number, string][] = mappings.map((mapping) => [
      mapping.providerId,
      mapping.stageId,
    ]);
    ApiDataLoader.shared.pullDataForProviderStages(ids, (status) => {
      let message: string;
      if (status === LoadStatus.SUCCESS) {
        message = "Stage data pull triggered successfully";
      } else {
        const titles = ids.map(
          ([pid, sid]) => Provider.titleForProvider(pid) + " stage " + sid
        );
        message = "Failed to trigger data pull for " + titles;
      }
      this.setState({
        isSnackbarOpen: true,
        loadStatus: status,
        statusMessage: {
          type: status,
          message: message,
          skipBottomBar: true,
        },
      });
    });
  }

  private onSelectEditAction(action: number): void {
    switch (action) {
      case MenuEditAction.UNASSIGNED_STAGES:
        this.setState({ isStageMappingUnassignedDialogOpen: true });
        break;
      case MenuEditAction.STAGE_DATA_BATCH_ANALYSIS:
        this.setState({
          stageBatchAnalysisData: this.state.menuItems.flatListOfType(
            MenuItemType.STAGE
          ),
          selection: undefined,
        });
        break;
      case MenuEditAction.EXPORT_NAMES_TO_CSV:
        this.csvUtil.exportMenuItems(this.state.menuItems.items);
        break;
      case MenuEditAction.IMPORT_NAMES_FROM_CSV:
        this.setState({ isCsvImportOpen: true });
        break;
      case MenuEditAction.STAGE_DATA_BATCH_PULL:
        this.setState({ isStageDataBatchPullOpen: true });
        break;
      case MenuEditAction.DATA_BATCH_TRANSLATE:
        this.setState({ isMenuDataBatchTranslateOpen: true });
        break;
      case MenuEditAction.SEASON_DATE_RECOVERY:
        this.setState({ isSeasonDateRecoveryDialogOpen: true });
        break;
      case MenuEditAction.ORDER_ROOT_ITEMS:
        this.setState({ isOrderRootItemsDialogOpen: true });
        break;
      case MenuEditAction.CLEANUP:
        this.setState({ isCleanupDialogOpen: true });
        break;
    }
  }

  private onApplyMenuItemBatchAnalysisResults(
    ids: Set<string>,
    property: number,
    value: boolean
  ): void {
    const newItemList = this.state.menuItems.applyAnalysisResults(
      ids,
      property,
      value
    );
    this.setState({
      menuItems: newItemList,
      stageBatchAnalysisData: newItemList.flatListOfType(MenuItemType.STAGE),
    });
  }

  private onApplyImportedCsvData(data: string) {
    try {
      const newNames = this.csvUtil.importMenuItemNames(data);
      this.setState((state) => {
        const newMenuItems = state.menuItems.mapped((itemBuilder) => {
          if (itemBuilder.id !== undefined) {
            const itemNewNames = newNames.get(itemBuilder.id);
            if (itemNewNames) {
              itemNewNames.forEach(([name, shortName], languageCode) => {
                itemBuilder.upsertName(languageCode, name);
                itemBuilder.upsertShortName(languageCode, shortName);
              });
            }
          }
          return itemBuilder;
        });
        return {
          isCsvImportOpen: false,
          menuItems: newMenuItems,
          statusMessage: {
            message: "Names updated successfully",
            type: LoadStatus.SUCCESS,
          },
          isSnackbarOpen: true,
        };
      });
    } catch (e) {
      this.setState({
        isCsvImportOpen: false,
        statusMessage: {
          message: "Failed to update names",
          type: LoadStatus.FAILURE,
        },
        isSnackbarOpen: true,
      });
    }
  }

  private onApplyCleanup(menuItems: MenuItemList): void {
    this.setState({ menuItems: menuItems, isCleanupDialogOpen: false });
  }

  private onLanguageChange(event: any): void {
    const selectedLanguage: string = event.target.value;
    this.setState((state) => {
      return {
        selectedLanguage: selectedLanguage,
        menuItems: state.menuItems.withUpdatedLanguage(selectedLanguage),
      };
    });
  }

  private onInvisibleSeasonsUpdate(primary: number[], visible: number[]): void {
    this.setState((state) => {
      let menuItems = state.menuItems;
      primary.forEach((id) => {
        const menuItem = menuItems.find(id);
        if (menuItem !== undefined) {
          menuItems = menuItems.update(
            MenuItemBuilder.fromMenuItem(menuItem.item).setPrimary(true).build()
          );
        }
      });
      visible.forEach((id) => {
        const menuItem = menuItems.find(id);
        if (menuItem !== undefined) {
          menuItems = menuItems.update(
            MenuItemBuilder.fromMenuItem(menuItem.item).setHidden(false).build()
          );
        }
      });
      return { menuItems: menuItems };
    });
  }

  private onWindowResize(): void {
    const contentHeight = MenuEdit.contentHeight() - this.state.filterBarHeight;
    this.setState({
      contentHeight: contentHeight,
      innerContentHeight: contentHeight - 49,
    });
  }

  private stageIdsToPull(): Map<number, Set<string>> {
    const idsToPull = new Map<number, Set<string>>();
    this.assignedMappings.forEach((mapping) => {
      if (!MenuEdit.PROVIDER_IDS_TO_PULL.has(mapping.providerId)) {
        return;
      }
      let stageIds = idsToPull.get(mapping.providerId);
      if (stageIds === undefined) {
        stageIds = new Set<string>();
        idsToPull.set(mapping.providerId, stageIds);
      }
      stageIds.add(mapping.stageId);
      console.log(
        "Will pull stage " +
          mapping.providerId +
          "-" +
          mapping.stageId +
          ": " +
          mapping.fullName
      );
    });
    return idsToPull;
  }

  private onSaveClick(publish: boolean) {
    const languages = this.state.enums.getLanguages();
    const validatedItems = this.state.menuItems
      .withUpdatedLanguage(ConfigUtil.defaultLanguage())
      .withFilledTranslations()
      .withAppliedLocalizedSortOrders(languages)
      .validated();
    if (validatedItems.validationErrors.size === 0) {
      const sportId = Sport.fromCode(this.state.sport);
      if (sportId !== undefined) {
        const progressMessages = new Array<string>();
        const stageIdsToPull = publish ? this.stageIdsToPull() : undefined;
        progressMessages.push("Saving menu data");
        if (publish) {
          progressMessages.push("Publishing menu data");
          if (stageIdsToPull !== undefined) {
            let count = 0;
            let totalCount = 0;
            stageIdsToPull.forEach((stageIds) => (totalCount += stageIds.size));
            stageIdsToPull.forEach((stageIds, providerId) => {
              stageIds.forEach((stageId) => {
                count++;
                progressMessages.push(
                  `Pulling data for stage ${providerId}-${stageId} (${count}/${totalCount})`
                );
              });
            });
          }
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
        ) => {
          if (!isError && data) {
            this.treeIdCounter.reset();
            this.assignedMappings.clear();
            const statusMessage = {
              message: "Menu saved successfully",
              type: 0,
            };
            if (this.state.id === undefined) {
              this.props.history.push(
                "/content/menu-structure/edit/" + data.id
              );
              this.setState({
                loadStatus: status,
                statusMessage: statusMessage,
                isSnackbarOpen: true,
                savingProgressMessages: undefined,
                selectedLanguage: ConfigUtil.defaultLanguage(),
              });
            } else {
              const menuItemPayload = this.menuItemListBuilder.fromMenuDataPayload(
                data
              );
              const newItems = MenuItemList.from(
                menuItemPayload.menuItems,
                ConfigUtil.defaultLanguage(),
                menuItemPayload.localizedSortOrders
              );
              this.setState({
                id: data.id,
                menuItems: newItems,
                isLoading: false,
                loadStatus: status,
                statusMessage: statusMessage,
                isSnackbarOpen: true,
                savingProgressMessages: undefined,
                selectedLanguage: ConfigUtil.defaultLanguage(),
              });
            }
          } else {
            const statusMessage = {
              message: "Error occurred while saving data",
              detail: message,
              type: 1,
            };
            this.setState({
              statusMessage: statusMessage,
              isSnackbarOpen: true,
              isLoading: false,
              loadStatus: status,
              savingProgressMessages: undefined,
              selectedLanguage: ConfigUtil.defaultLanguage(),
            });
          }
        };
        this.performSave(
          this.state.id,
          sportId,
          validatedItems.serializable(),
          publish,
          stageIdsToPull,
          progress,
          complete
        );
        return;
      }
      this.setState({
        menuItems: validatedItems,
        statusMessage: undefined,
        savingProgressMessages: undefined,
      });
    } else {
      const issueCount = Array.from(validatedItems.validationErrors.values())
        .map((errors) => errors.length)
        .reduce((prev, cur) => prev + cur);
      const statusMessage = {
        message: "Error: Invalid data (" + issueCount + " issues)",
        type: 1,
      };
      this.setState({
        menuItems: validatedItems,
        statusMessage: statusMessage,
        isSnackbarOpen: true,
        savingProgressMessages: undefined,
      });
    }
  }
}

MenuEdit.contextType = AuthUserContext;

export default withRouter(withStyles(styles)(MenuEdit));
