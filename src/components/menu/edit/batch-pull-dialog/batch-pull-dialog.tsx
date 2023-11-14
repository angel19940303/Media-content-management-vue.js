import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { MenuItem } from "../../../../models/menu/menu-item";
import React from "react";
import { ApiDataLoader } from "../../../../api/api-data-loader";
import { LoadStatus } from "../../../../models/enums/load_status";
import { MenuItemList } from "../../../../models/menu/menu-item-list";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import MenuNestedList from "../../../common/menu-nested-list";
import { MenuItemType } from "../../../../models/enums/menu-item-type";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme: Theme) =>
  createStyles({
    pullBatchDialogBody: {
      height: 400,
      padding: 0,
      overflow: "hidden",
    },
    listDivider: {
      backgroundColor: theme.palette.grey["300"],
    },
    resultContainer: {
      padding: 20,
      textAlign: "center",

      "& div": {
        paddingTop: 20,
      },
      "& div:first-child": {
        paddingTop: 0,
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  menuData: MenuItem[];
  isOpen: boolean;
  onClose?: () => void;
  onError?: (loadStatus: number) => void;
}

interface PullingStatus {
  isPulling: boolean;
  isError: boolean;
  message?: string;
}

interface RState {
  selectedStageIds: Set<string>;
  allStageIds: Set<string>;
  pullingStatus: PullingStatus | undefined;
}

class StageDataBatchPullDialog extends React.Component<RProps, RState> {
  private mounted = false;

  constructor(props: RProps) {
    super(props);
    this.state = {
      selectedStageIds: new Set<string>(),
      allStageIds: StageDataBatchPullDialog.allStageIds(props.menuData),
      pullingStatus: undefined,
    };
  }

  private static allStageIds(menuData: MenuItem[]): Set<string> {
    const stageIds = new Set<string>();
    MenuItemList.traverseRecursively(menuData, [], (menuItem) => {
      if (menuItem.type === MenuItemType.STAGE && menuItem.id !== undefined) {
        stageIds.add(menuItem.id);
      }
    });
    return stageIds;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render(): React.ReactNode {
    return (
      <Dialog
        maxWidth={"sm"}
        fullWidth={true}
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="edit-mapping-dialog-title">
          Pull provider stages
        </DialogTitle>
        <DialogContent
          className={this.props.classes.pullBatchDialogBody}
          dividers
        >
          {this.renderContent()}
        </DialogContent>
        <DialogActions>
          {this.state.pullingStatus !== undefined ? null : (
            <Button
              onClick={() => this.onNext()}
              color="primary"
              disabled={this.state.selectedStageIds.size === 0}
            >
              Next
            </Button>
          )}
          <Button onClick={() => this.onClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.state.pullingStatus !== undefined) {
      return this.renderStep2();
    }
    return this.renderStep1();
  }

  private renderStep1(): React.ReactNode {
    const hasSelectedAll =
      this.state.selectedStageIds.size >= this.state.allStageIds.size;
    return (
      <>
        <Grid
          container
          spacing={1}
          alignItems="center"
          justify="space-between"
          style={{ padding: "0 15px" }}
        >
          <Grid item>
            <FormControlLabel
              value="end"
              control={
                <Checkbox
                  checked={hasSelectedAll}
                  size="small"
                  inputProps={{ "aria-label": "checkbox with small size" }}
                  onClick={() =>
                    this.setState((state) => {
                      const selectedIds = hasSelectedAll
                        ? new Set<string>()
                        : new Set<string>(state.allStageIds);
                      return { selectedStageIds: selectedIds };
                    })
                  }
                  style={{ marginRight: 30 }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  component="span"
                  style={{ fontWeight: 500 }}
                >
                  Select all
                </Typography>
              }
              labelPlacement="end"
            />
          </Grid>
          <Grid item>
            Selected {this.state.selectedStageIds.size} of{" "}
            {this.state.allStageIds.size}
          </Grid>
        </Grid>
        <Divider className={this.props.classes.listDivider} />
        <MenuNestedList
          data={this.props.menuData}
          selectedIds={this.state.selectedStageIds}
          onSelectionChange={(selectedIds) =>
            this.setState({ selectedStageIds: selectedIds })
          }
        />
      </>
    );
  }

  private renderStep2(): React.ReactNode {
    if (this.state.pullingStatus === undefined) {
      return null;
    }

    if (this.state.pullingStatus.isError) {
      return (
        <div className={this.props.classes.resultContainer}>
          <div>
            <ErrorOutlineIcon style={{ fontSize: 48 }} />
          </div>
          <div>An error occurred while pulling stages.</div>
          <div>
            <Button onClick={() => this.onNext()} variant="contained">
              Try again
            </Button>
          </div>
        </div>
      );
    }
    if (!this.state.pullingStatus.isPulling) {
      return (
        <div className={this.props.classes.resultContainer}>
          <div>
            <CheckCircleOutlineIcon style={{ fontSize: 48 }} />
          </div>
          <div>Finished! All stages have been pulled.</div>
        </div>
      );
    }
    return (
      <div className={this.props.classes.resultContainer}>
        <div>
          <CircularProgress />
        </div>
        <div>{this.state.pullingStatus.message || "Pulling stages..."}</div>
      </div>
    );
  }

  private onNext(): void {
    this.pullData();
  }

  private providerStageIdsFromSelection(
    selectedIds: Set<string>
  ): [number, string][] {
    const entries = new Array<[number, string]>();
    const cachedEntries = new Set<string>();
    MenuItemList.traverseRecursively(this.props.menuData, [], (menuItem) => {
      if (
        MenuItemType.STAGE === menuItem.type &&
        menuItem.id !== undefined &&
        selectedIds.has(menuItem.id)
      ) {
        const primarySeason = menuItem.children.find(
          (child) => MenuItemType.SEASON === child.type && child.primary
        );
        if (primarySeason !== undefined) {
          primarySeason.stageMappings.forEach((mapping) => {
            const compositeProviderStageId = `${mapping.providerId}-${mapping.stageId}`;
            if (!cachedEntries.has(compositeProviderStageId)) {
              cachedEntries.add(compositeProviderStageId);
              entries.push([mapping.providerId, mapping.stageId]);
            }
          });
        }
      }
    });
    return entries;
  }

  private pullData(): void {
    const stageIdsToPull = this.providerStageIdsFromSelection(
      this.state.selectedStageIds
    );
    const totalStageIdsToPull = stageIdsToPull.length;
    if (totalStageIdsToPull === 0) {
      return;
    }

    const pullSingleStage = (
      stageIdsToPull: [number, string][],
      pulledCount: number
    ) => {
      if (stageIdsToPull.length === 0) {
        this.setState({ pullingStatus: { isPulling: false, isError: false } });
        return;
      }
      const [providerId, stageId] = stageIdsToPull[0];
      this.setState({
        pullingStatus: {
          isPulling: true,
          isError: false,
          message: `Pulling stage ${providerId}-${stageId} (${
            pulledCount + 1
          }/${totalStageIdsToPull})`,
        },
      });
      ApiDataLoader.shared.pullProviderStage(providerId, stageId, (status) => {
        if (!this.mounted) {
          return;
        }
        if (status === LoadStatus.SUCCESS) {
          pullSingleStage(stageIdsToPull.slice(1), pulledCount + 1);
        } else {
          this.setState({ pullingStatus: { isPulling: false, isError: true } });
          if (
            this.props.onError !== undefined &&
            (status === LoadStatus.UNAUTHENTICATED ||
              status === LoadStatus.UNAUTHORIZED)
          ) {
            this.props.onError(status);
          }
        }
      });
    };

    pullSingleStage(stageIdsToPull, 0);
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

export default withStyles(styles)(StageDataBatchPullDialog);
