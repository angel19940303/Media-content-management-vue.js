import React from "react";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import { Paper } from "@material-ui/core";
import LoadingIndicator from "../../common/loading-indicator";
import { LocEnumItemList } from "../../../models/loc-enums/loc-enum-item-list";
import { LocEnumItem } from "../../../models/loc-enums/loc-enum-item";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import BaseEditBottomBar from "../../common/base-edit-bottom-bar";
import LocEnumsEditDataList from "./loc-enums-edit-data-list";
import LocEnumsEditForm from "./loc-enums-edit-form";
import { LocEnumItemBuilder } from "../../../models/loc-enums/builders/loc-enum-item-builder";
import { Sport } from "../../../models/enums/sport";
import { LocEnumFormData } from "../../../models/ui/loc-enum-form-data";
import { EditStatusMessage } from "../../../models/ui/edit-status-message";
import { ApiDataLoader } from "../../../api/api-data-loader";
import { LocEnumDataPayload } from "../../../models/loc-enums/loc-enum-data-payload";
import { LoadStatus } from "../../../models/enums/load_status";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { LocEnumItemListBuilder } from "../../../models/loc-enums/builders/loc-enum-item-list-builder";
import { LocEnumSourceType } from "../../../models/enums/loc-enum-source-type";
import { FormatListNumberedRtl } from "@material-ui/icons";
import MenuEditActionsPopper from "../../menu/edit/menu-edit-actions-popper";
import { MenuEditAction } from "../../../models/enums/menu-edit-action";
import { CsvUtil } from "../../../utils/csv-util";
import DataImportDialog from "../../menu/edit/data-import/data-import-dialog";
import LocEnumsStageTeamsDialog from "./stage-teams-dialog/loc-enums-stage-teams-dialog";
import LocEnumsStageTeamValidationDialog from "./stage-team-validation-dialog/loc-enums-stage-team-validation-dialog";
import { Provider } from "../../../models/enums/provider";
import MasterError from "../../master-error";
import { categories, Routes } from "../../routing";
import { AuthUserContext } from "../../login/auth-user-context";
import ImportItemsFromDataDialog from "./import-items-from-data-dialog/import-items-from-data-dialog";
import FileSaver from "file-saver";
import BatchTranslateDialog from "../../menu/edit/batch-translate-dialog/batch-translate-dialog";
import { BatchTranslateFormData } from "../../../models/ui/batch-translate-form-data";
import { Locale } from "../../../models/common/locale";
import SearchFieldForm from "../../common/search-field-form";

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
  });

interface RProps extends RouteComponentProps<any>, WithStyles<typeof styles> {
  sport?: string;
  id?: number;
  sourceType?: number;
}

interface RState {
  contentHeight: number;
  innerContentHeight: number;
  isLoading: boolean;
  isError: boolean;
  loadStatus: number;
  sport?: string;
  name?: string;
  data: LocEnumItemList;
  filteredData: any;
  selectedItem?: LocEnumItem;
  searchString: string;
  selectedItemIndex?: number;
  statusMessage?: EditStatusMessage;
  isSnackbarOpen: boolean;
  openDataImportDialogType?: "csv" | "json" | undefined;
  isStageTeamsDialogOpen: boolean;
  isStageTeamValidationDialogOpen: boolean;
  isImportItemsFromDataDialogOpen: boolean;
  isDataBatchTranslateDialogOpen: boolean;
}

class LocEnumsEdit extends React.Component<RProps, RState> {
  private static readonly ACTIONS = [
    MenuEditAction.EXPORT_NAMES_TO_CSV,
    MenuEditAction.EXPORT_TO_JSON,
    MenuEditAction.IMPORT_NAMES_FROM_CSV,
    MenuEditAction.IMPORT_FROM_JSON,
    MenuEditAction.IMPORT_ITEMS_FROM_DATA,
    MenuEditAction.VALIDATE_STAGE_TEAMS,
    MenuEditAction.DATA_BATCH_TRANSLATE,
  ];

  private readonly csvUtil = CsvUtil.create();
  private readonly resizeEventListener: EventListener;

  constructor(props: RProps) {
    super(props);
    const contentHeight = LocEnumsEdit.contentHeight();
    this.state = {
      contentHeight: contentHeight,
      innerContentHeight: contentHeight - 49,
      sport: props.sport,
      data: LocEnumItemListBuilder.create().build(),
      filteredData: [],
      isLoading: true,
      isError: false,
      loadStatus: -1,
      searchString: "",
      isSnackbarOpen: false,
      isStageTeamsDialogOpen:
        props.sourceType === LocEnumSourceType.TEAMS_IN_STAGES,
      isStageTeamValidationDialogOpen: false,
      isImportItemsFromDataDialogOpen: false,
      isDataBatchTranslateDialogOpen: false,
    };
    this.resizeEventListener = () => this.onWindowResize.call(this);
  }

  private static contentHeight(): number {
    return Math.max(window.innerHeight - 70 - 48 - 52 - 48, 0);
  }

  componentDidMount() {
    if (this.props.id !== undefined) {
      ApiDataLoader.shared.loadLocEnum(
        this.props.id,
        (status, data, message) => {
          if (status === LoadStatus.SUCCESS && data !== undefined) {
            const sport = Sport.code(data.sportId);
            const items = LocEnumItemListBuilder.fromPayload(data).build();
            this.setState({
              isLoading: false,
              isError: false,
              name: data.name,
              data: items,
              filteredData: items.items,
              sport: sport,
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
    } else {
      ApiDataLoader.shared.loggedInWithPermissions((status, user) => {
        if (status === LoadStatus.SUCCESS) {
          const userPermissions = user?.permissions ?? this.context.permissions;
          const pagePermissions =
            categories
              .flatMap((c) => c.children)
              .find((child) =>
                this.props.location.pathname.startsWith(child.path)
              )?.permissions || [];
          if (
            pagePermissions.find((p) => (userPermissions & p) > 0) === undefined
          ) {
            this.setState({
              isLoading: false,
              loadStatus: LoadStatus.UNAUTHORIZED,
            });
          } else {
            if (this.props.sport === undefined) {
              this.setState({ isLoading: false, isError: true });
            } else if (
              this.props.sourceType === LocEnumSourceType.PROVIDER_CATEGORIES
            ) {
              const sport = Sport.fromCode(this.props.sport);
              ApiDataLoader.shared.loadSportStages(
                this.props.sport,
                (status, data, message) => {
                  if (status === LoadStatus.SUCCESS && data !== undefined) {
                    const items = LocEnumItemListBuilder.fromProviderCategories(
                      data,
                      sport
                    ).build();
                    this.setState({
                      isLoading: false,
                      isError: false,
                      data: items,
                      filteredData: items.items,
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
            } else {
              this.setState({ isLoading: false });
            }
          }
        } else {
          this.setState({
            isLoading: false,
            loadStatus: status,
            isError: status === LoadStatus.FAILURE,
          });
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
      <>
        <MenuEditActionsPopper
          actions={LocEnumsEdit.ACTIONS}
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
      return <LoadingIndicator />;
    }

    if (this.state.isError) {
      return "Error";
    }

    if (this.state.data === undefined) {
      return "";
    }

    const mediumWidth = this.state.selectedItem ? 6 : 12;

    return (
      <>
        <AppBar
          className={classes.searchBar}
          position="static"
          color="default"
          elevation={0}
        >
          <Toolbar style={{ paddingLeft: 12, paddingRight: 8 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <FormatListNumberedRtl
                  className={classes.block}
                  color="inherit"
                />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  placeholder="Enum Name"
                  value={this.state.name || ""}
                  InputProps={{
                    disableUnderline: true,
                    className: classes.searchInput,
                  }}
                  onChange={(event) =>
                    this.setState({ name: event.target.value })
                  }
                />
              </Grid>
              <Grid item>
                <SearchFieldForm
                  version={1}
                  searchString={this.state.searchString}
                  onChange={(searchString) =>
                    this.setState({
                      searchString: searchString,
                      filteredData: this.state.data.items.filter(
                        (x) =>
                          x.title
                            .toLocaleLowerCase()
                            .indexOf(searchString?.toLowerCase()) > -1
                      ),
                    })
                  }
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.addUser}
                  disabled={this.state.selectedItem !== undefined}
                  onClick={() => this.onAddItem()}
                >
                  Add item
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={12} md={mediumWidth}>
            <LocEnumsEditDataList
              data={this.state.filteredData}
              height={this.state.innerContentHeight - 50}
              onUpdateClick={(item, index) =>
                this.didTriggerUpdate(item, index)
              }
              onRemoveClick={(index) => this.didTriggerRemove(index)}
            />
            {this.renderBottomBar()}
          </Grid>
          {this.renderEditForm()}
          {this.renderCsvImportDialog()}
          {this.renderStageTeamsDialog()}
          {this.renderStageTeamValidationDialog()}
          {this.renderImportItemsFromDataDialog()}
          {this.renderDataBatchTranslateDialog()}
        </Grid>
        {this.renderSnackBar()}
      </>
    );
  }

  private renderBottomBar(): React.ReactNode {
    const content = new Array<React.ReactNode>();
    if (this.state.selectedItem === undefined) {
      content.push(
        <Button
          variant="contained"
          key="save"
          color="primary"
          onClick={() => this.onSaveClick()}
        >
          Save
        </Button>
      );
      content.push(
        <Button variant="contained" key="cancel" href="/#/content/loc-enums">
          Cancel
        </Button>
      );
    }
    return <BaseEditBottomBar>{content}</BaseEditBottomBar>;
  }

  private renderEditForm(): React.ReactNode {
    if (this.state.selectedItem === undefined) {
      return "";
    }
    return (
      <LocEnumsEditForm
        key={this.state.selectedItemIndex}
        height={this.state.innerContentHeight}
        item={this.state.selectedItem}
        isNew={this.state.selectedItemIndex === undefined}
        onSave={(data, createNew) => this.onDataUpdate(data, createNew)}
        onCancel={() => this.onDataEditCancel()}
      />
    );
  }

  private renderCsvImportDialog(): React.ReactNode {
    return (
      <DataImportDialog
        type={this.state.openDataImportDialogType || "csv"}
        isOpen={this.state.openDataImportDialogType !== undefined}
        onApply={(type: string, data: string) =>
          this.onApplyImportedData(type, data)
        }
        onClose={() => this.setState({ openDataImportDialogType: undefined })}
      />
    );
  }

  private renderStageTeamsDialog(): React.ReactNode {
    if (this.props.sport === undefined) {
      return undefined;
    }
    return (
      <LocEnumsStageTeamsDialog
        sport={this.props.sport}
        isOpen={this.state.isStageTeamsDialogOpen}
        onApply={(enumList) => this.onApplyTeamStageDialogData(enumList)}
        onClose={() => this.onCloseTeamStageDialog()}
      />
    );
  }

  private renderStageTeamValidationDialog(): React.ReactNode {
    if (
      this.state.sport === undefined ||
      !this.state.isStageTeamValidationDialogOpen
    ) {
      return undefined;
    }
    return (
      <LocEnumsStageTeamValidationDialog
        sport={this.state.sport}
        providerId={Provider.INTERNAL}
        isOpen={this.state.isStageTeamValidationDialogOpen}
        data={this.state.data.items}
        onApply={(enumList) =>
          this.onApplyTeamStageValidationDialogData(enumList)
        }
        onClose={() => this.onCloseTeamStageValidationDialog()}
      />
    );
  }

  private renderImportItemsFromDataDialog(): React.ReactNode {
    if (
      this.state.sport === undefined ||
      !this.state.isImportItemsFromDataDialogOpen
    ) {
      return undefined;
    }
    return (
      <ImportItemsFromDataDialog
        isOpen={this.state.isImportItemsFromDataDialogOpen}
        sport={this.state.sport}
        onApply={(enumList, overwriteExisting) =>
          this.onApplyImportItemsFromDataDialogData(enumList, overwriteExisting)
        }
        onClose={() => this.onCloseImportItemsFromDataDialog()}
      />
    );
  }

  private renderDataBatchTranslateDialog(): React.ReactNode {
    if (!this.state.isDataBatchTranslateDialogOpen) {
      return undefined;
    }
    return (
      <BatchTranslateDialog
        isOpen={this.state.isDataBatchTranslateDialogOpen}
        data={BatchTranslateFormData.fromLocalizedEnumItemList(this.state.data)}
        onApply={(translations) =>
          this.onApplyTranslationsFromDataBatchTranslateDialog(translations)
        }
        onClose={() => this.onCloseDataBatchTranslateDialog()}
      />
    );
  }

  private renderSnackBar(): React.ReactNode {
    const isOpen =
      this.state.isSnackbarOpen && this.state.statusMessage !== undefined;

    const severity =
      this.state.statusMessage?.type === LoadStatus.SUCCESS
        ? "success"
        : "error";

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
      this.setState({ isSnackbarOpen: false });
    };

    return (
      <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={severity}
          onClose={handleClose}
        >
          {this.state.statusMessage?.message}
        </MuiAlert>
      </Snackbar>
    );
  }

  private onWindowResize(): void {
    const contentHeight = LocEnumsEdit.contentHeight();
    this.setState({
      contentHeight: contentHeight,
      innerContentHeight: contentHeight - 49,
    });
  }

  private onAddItem(): void {
    const sport = Sport.fromCode(this.state.sport);
    if (sport === undefined) {
      return;
    }

    const item = new LocEnumItemBuilder().setSport(sport).build();
    this.setState({ selectedItem: item, selectedItemIndex: undefined });
  }

  private didTriggerUpdate(item: LocEnumItem, index: number): void {
    this.setState({ selectedItem: item, selectedItemIndex: index });
  }

  private didTriggerRemove(index: number): void {
    this.setState((state) => {
      const selectedIndex =
        index === state.selectedItemIndex ? undefined : state.selectedItemIndex;

      let itemIndex = index;
      if (state.filteredData.length > 0) {
        const itemToDelete = state.filteredData[index];
        itemIndex = state.data.items.indexOf(itemToDelete);
        if (index < 0) {
          return {
            data: state.data,
            filteredData: state.filteredData,
            selectedItemIndex: state.selectedItemIndex,
          };
        }
      }
      const newData = state.data.remove(itemIndex);
      return {
        data: newData,
        filteredData: newData.filtered(state.searchString),
        selectedItemIndex: selectedIndex,
      };
    });
  }

  private onDataUpdate(data: LocEnumFormData, createNew: boolean): void {
    this.setState((state) => {
      const newSelectedItem = createNew
        ? new LocEnumItemBuilder().setSport(data.sportId).build()
        : undefined;
      const newData = state.data.store(
        data.locEnumItemBuilder().build(),
        state.selectedItemIndex
      );
      return {
        data: newData,
        selectedItem: newSelectedItem,
        selectedItemIndex: undefined,
        filteredData: newData.filtered(state.searchString),
      };
    });
  }

  private onDataEditCancel(): void {
    this.setState({ selectedItem: undefined, selectedItemIndex: undefined });
  }

  private onSelectEditAction(action: number): void {
    switch (action) {
      case MenuEditAction.EXPORT_NAMES_TO_CSV:
        this.csvUtil.exportLocalizedEnum(this.state.data.items);
        break;
      case MenuEditAction.EXPORT_TO_JSON:
        const blob = new Blob(
          [JSON.stringify(this.state.data.serializable())],
          {
            type: "application/json",
          }
        );
        FileSaver.saveAs(blob, "loc-enum.json");
        break;
      case MenuEditAction.IMPORT_NAMES_FROM_CSV:
        this.setState({ openDataImportDialogType: "csv" });
        break;
      case MenuEditAction.IMPORT_FROM_JSON:
        this.setState({ openDataImportDialogType: "json" });
        break;
      case MenuEditAction.VALIDATE_STAGE_TEAMS:
        this.setState({ isStageTeamValidationDialogOpen: true });
        break;
      case MenuEditAction.IMPORT_ITEMS_FROM_DATA:
        this.setState({ isImportItemsFromDataDialogOpen: true });
        break;
      case MenuEditAction.DATA_BATCH_TRANSLATE:
        this.setState({ isDataBatchTranslateDialogOpen: true });
        break;
    }
  }

  private onApplyImportedCsvData(data: string): void {
    try {
      const newNames = this.csvUtil.importLocEnumNames(data);
      this.setState((state) => {
        const newData = state.data.mapped((itemBuilder, index) => {
          if (index < newNames.length) {
            newNames[index].forEach((name, language) => {
              itemBuilder.addLocalisedName(language, name);
            });
          }
          return itemBuilder;
        });
        return {
          data: newData,
          filteredData: newData.filtered(state.searchString),
          openDataImportDialogType: undefined,
          isSnackbarOpen: true,
          statusMessage: {
            message: "Names updated successfully",
            type: 0,
          },
        };
      });
    } catch (e) {
      this.setState({
        openDataImportDialogType: undefined,
        isSnackbarOpen: true,
        statusMessage: {
          message: "Failed to update names",
          type: 1,
        },
      });
    }
  }

  private onApplyImportedData(type: string, data: string): void {
    if (type === "csv") {
      this.onApplyImportedCsvData(data);
    } else if (type === "json") {
      this.onApplyImportedJsonData(data);
    } else {
      this.setState({ openDataImportDialogType: undefined });
    }
  }

  private onApplyImportedJsonData(data: string): void {
    try {
      const payload: LocEnumDataPayload = {
        sportId: Sport.fromCode(this.props.sport) || 0,
        items: JSON.parse(data),
        name: undefined,
        id: undefined,
      };
      const newData = LocEnumItemListBuilder.fromPayload(payload).build();
      this.setState((state) => {
        return {
          data: state.data.mergedWith(newData, true),
          filteredData: newData.filtered(state.searchString),
          openDataImportDialogType: undefined,
        };
      });
    } catch (e) {
      this.setState({
        openDataImportDialogType: undefined,
        isSnackbarOpen: true,
        statusMessage: {
          message: "Failed to import data",
          type: 1,
        },
      });
    }
  }

  private onCloseTeamStageDialog(): void {
    this.setState({ isStageTeamsDialogOpen: false });
  }

  private onApplyTeamStageDialogData(enumList: LocEnumItemList): void {
    this.setState((state) => {
      const newData = LocEnumItemListBuilder.create()
        .setItems(state.data.items)
        .addItems(enumList.items)
        .build();
      return {
        isStageTeamsDialogOpen: false,
        data: newData,
        filteredData: newData.filtered(state.searchString),
      };
    });
  }

  private onCloseTeamStageValidationDialog(): void {
    this.setState({ isStageTeamValidationDialogOpen: false });
  }

  private onApplyTeamStageValidationDialogData(
    enumList: LocEnumItemList
  ): void {
    this.setState(() => {
      const newData = LocEnumItemListBuilder.create()
        .setItems(enumList.items)
        .build();
      return {
        isStageTeamValidationDialogOpen: false,
        data: newData.validated(),
      };
    });
  }

  private onCloseImportItemsFromDataDialog(): void {
    this.setState({ isImportItemsFromDataDialogOpen: false });
  }

  private onApplyImportItemsFromDataDialogData(
    enumList: LocEnumItemList,
    overwriteExisting: boolean
  ): void {
    this.setState((state) => {
      const newData = state.data
        .mergedWith(enumList, overwriteExisting)
        .validated();
      return {
        isImportItemsFromDataDialogOpen: false,
        data: newData,
        filteredData: newData.filtered(state.searchString),
      };
    });
  }

  private onCloseDataBatchTranslateDialog(): void {
    this.setState({ isDataBatchTranslateDialogOpen: false });
  }

  private onApplyTranslationsFromDataBatchTranslateDialog(
    translations: Map<number, Locale>
  ): void {
    this.setState((state) => {
      const newData = state.data.mapped((itemBuilder, index) => {
        const name = translations.get(index + 1);
        if (name !== undefined) {
          itemBuilder.setName(name);
        }
        return itemBuilder;
      });
      return {
        isDataBatchTranslateDialogOpen: false,
        data: newData,
        filteredData: newData.filtered(state.searchString), //newFilteredData,
      };
    });
  }

  private onSaveClick(): void {
    const validatedData = this.state.data.withFilledTranslations().validated();
    const sport = Sport.fromCode(this.state.sport);
    if (validatedData.validationErrors.length === 0 && sport !== undefined) {
      const payload: LocEnumDataPayload = {
        id: this.props.id,
        sportId: sport,
        name: this.state.name,
        items: validatedData.serializable(),
      };
      this.setState({ isLoading: true });
      ApiDataLoader.shared.saveLocEnum(payload, (status, data, message) => {
        if (status === LoadStatus.SUCCESS && data) {
          if (this.props.id === undefined) {
            this.props.history.push("/content/loc-enums/edit/" + data.id);
          } else {
            this.setState({
              isLoading: false,
              isSnackbarOpen: true,
              statusMessage: {
                message: "Data saved successfully",
                type: 0,
              },
              loadStatus: status,
            });
          }
        } else {
          this.setState({
            isLoading: false,
            isSnackbarOpen: true,
            statusMessage: {
              message: "Error occurred while saving data",
              type: 1,
            },
            loadStatus: status,
          });
        }
      });
    } else {
      let message: string;
      if (validatedData.validationErrors.length === 1) {
        message = validatedData.validationErrors[0];
      } else {
        message =
          "Error: Invalid data (" +
          validatedData.validationErrors.length +
          " issues)";
      }
      this.setState({
        data: validatedData,
        isSnackbarOpen: true,
        statusMessage: {
          message: message,
          type: 1,
        },
      });
    }
  }
}

LocEnumsEdit.contextType = AuthUserContext;

export default withRouter(withStyles(styles)(LocEnumsEdit));
