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
import MenuSortableTree from "../../menu/edit/menu-sortable-tree";
import MenuEditBottomBar from "../../common/base-edit-bottom-bar";
import MenuItemEditForm from "../../menu/edit/menu-item-edit-form";
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
import { StageMapping } from "../../../models/menu/stage-mapping";
import { MenuItemType } from "../../../models/enums/menu-item-type";
import { Provider } from "../../../models/enums/provider";
import { EnumList } from "../../../models/common/enum-list";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { MenuItem as MenuItemComponent } from "@material-ui/core";
import BaseMenuEdit, {
  BaseMenuEditState,
} from "../../menu/edit/base-menu-edit";
import { ConfigUtil } from "../../../utils/config-util";
import RecentInvisibleSeasonOverview from "../../menu/edit/recent-invisible-seasons/recent-invisible-seasons-message";
import { AuthUserContext } from "../../login/auth-user-context";
import { categories, Routes } from "../../routing";
import MasterError from "../../master-error";
import { COUNTRY_CODES } from "../../../models/constants/countryCodes";

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
  id?: number;
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
  selectedLanguage: string;
  enums: EnumList;
}

class LocEdit extends BaseMenuEdit<RProps, RState> {
  private static readonly PROVIDER_IDS_TO_PULL = new Set<number>([2]);

  private readonly treeIdCounter = new IncrementalIdGenerator();
  private readonly assignedMappings = new Map<string, StageMapping>();
  private readonly menuItemListBuilder = new MenuItemPayloadBuilder(
    this.treeIdCounter
  );
  private readonly resizeEventListener: EventListener;

  constructor(props: RProps) {
    super(props);
    const contentHeight = LocEdit.contentHeight();
    this.state = {
      id: props.id,
      name: "",
      menuItems: MenuItemList.create(),
      searchString: "",
      assignedSeasonCounter: AssignedSeasonCounter.create(),
      isLoading: true,
      contentHeight: contentHeight,
      innerContentHeight: contentHeight - 49,
      filterBarHeight: 0,
      isSnackbarOpen: false,
      selectedLanguage: ConfigUtil.defaultLanguage(),
      enums: EnumList.createEmoty(),
      loadStatus: -1,
    };
    this.resizeEventListener = () => this.onWindowResize.call(this);
  }

  private static contentHeight(): number {
    return Math.max(window.innerHeight - 70 - 48 - 52 - 48, 0);
  }

  componentDidMount() {
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
          if (this.props.id) {
            const id = this.props.id || 0;
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
      canDrag: () => false,
      searchString: this.state.searchString,
      height: this.state.innerContentHeight - 50,
      validationErrors: this.state.menuItems.validationErrors,
      canPull: (node: any) =>
        (node.type === TreeDataNodeType.STAGE &&
          node.children !== undefined &&
          node.children.length > 0) ||
        node.type === TreeDataNodeType.SEASON,
      onChange: (data: any) => this.onTreeDataChange(data),
      onEditClick: (item: any, parent?: any) => this.editItem(item, parent),
    };

    const mediumMenuWidth = this.state.selection ? 6 : 12;
    const titleWithCountryList = (title: string, countryCodes: string[]) => {
      const countryList =
        countryCodes?.length > 0
          ? " (" +
            COUNTRY_CODES.filter((country) =>
              countryCodes.includes(country.alpha2Code)
            )
              .map((country) => country.name)
              .join(", ") +
            ")"
          : "";
      return typeof title === "string" && !title?.includes(countryList)
        ? title + countryList
        : title;
    };
    const menuData = this.state.menuItems.all()?.map((el) => {
      return (
        {
          ...el,
          title: titleWithCountryList(el.title, el.countryCodes),
          children: el.children.map((children) => ({
            ...children,
            children: [],
            title: titleWithCountryList(children.title, children.countryCodes),
          })),
        } || []
      );
    });

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
            </Grid>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={12} md={mediumMenuWidth}>
            <MenuSortableTree
              id="menu-item-tree"
              data={menuData}
              config={menuSortableTreeConfig}
            />
            {this.renderBottomBar()}
          </Grid>
          {this.renderEditForm()}
        </Grid>
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
        <Button variant="contained" key="cancel" href="/#/content/loc-overview">
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
    const contentHeight = LocEdit.contentHeight() - this.state.filterBarHeight;
    this.setState({
      contentHeight: contentHeight,
      innerContentHeight: contentHeight - 49,
    });
  }

  private stageIdsToPull(): Map<number, Set<string>> {
    const idsToPull = new Map<number, Set<string>>();
    this.assignedMappings.forEach((mapping) => {
      if (!LocEdit.PROVIDER_IDS_TO_PULL.has(mapping.providerId)) {
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
              this.props.history.push("/content/loc-overview/edit/" + data.id);
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

LocEdit.contextType = AuthUserContext;

export default withRouter(withStyles(styles)(LocEdit));
