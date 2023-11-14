import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { ApiDataLoader } from "../../../../api/api-data-loader";
import { ProviderCategoryCollection } from "../../../../models/menu/provider-category-collection";
import { LoadStatus } from "../../../../models/enums/load_status";
import { ComponentDataState } from "../../../../models/enums/component-data-state";
import { MenuItemList } from "../../../../models/menu/menu-item-list";
import { MenuItemType } from "../../../../models/enums/menu-item-type";
import { TimeRange } from "../../../../models/common/time-range";
import { StageMappingBuilder } from "../../../../models/menu/builders/stage-mapping-builder";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import LoadingIndicator from "../../../common/loading-indicator";

const styles = () =>
  createStyles({
    body: {
      padding: 20,
      textAlign: "center",
    },
    icon: {
      fontSize: 80,
    },
  });

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  sport?: string;
  menuItems: MenuItemList;
  onComplete?: (menuItems: MenuItemList) => void;
  onClose?: () => void;
}

interface RState {
  dataState: number;
  menuItems: MenuItemList;
  providerData?: ProviderCategoryCollection;
}

class SeasonDateRecoveryDialog extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      dataState: ComponentDataState.INITIALIZING,
      menuItems: props.menuItems,
    };
  }

  componentDidMount() {
    if (this.props.sport === undefined) {
      this.setState({ dataState: ComponentDataState.ERROR });
      return;
    }
    ApiDataLoader.shared.loadSportStages(
      this.props.sport,
      (status: number, data?: ProviderCategoryCollection) => {
        if (!this.props.isOpen) {
          return;
        }
        if (status === LoadStatus.SUCCESS) {
          this.setState({
            dataState: ComponentDataState.READY,
            menuItems: this.recoverSeasonTimeRanges(data),
          });
        } else {
          this.setState({ dataState: ComponentDataState.ERROR });
        }
      }
    );
  }

  render() {
    return (
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        aria-labelledby="add-mapping-dialog-title"
      >
        <DialogTitle id="add-mapping-dialog-title">
          Recover season dates
        </DialogTitle>
        <DialogContent className={this.props.classes.body} dividers>
          {this.renderContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.onApply()} color="primary">
            Apply
          </Button>
          <Button onClick={() => this.onClose()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private renderContent() {
    if (this.state.dataState === ComponentDataState.INITIALIZING) {
      return <LoadingIndicator />;
    }
    if (this.state.dataState !== ComponentDataState.READY) {
      return <HighlightOffIcon className={this.props.classes.icon} />;
    }
    return <CheckCircleOutlineIcon className={this.props.classes.icon} />;
  }

  private timeRangesFromProviderData(
    data?: ProviderCategoryCollection
  ): Map<string, TimeRange> {
    const result = new Map<string, TimeRange>();
    if (data !== undefined) {
      data.categories.forEach((category) => {
        if (category.stages !== undefined) {
          category.stages.forEach((stage) => {
            if (
              stage.pid !== undefined &&
              stage.st_id !== undefined &&
              stage.start !== undefined
            ) {
              const stageId = `${stage.pid}-${stage.st_id}`;
              result.set(stageId, {
                start: stage.start,
                end: stage.end || stage.start,
              });
            }
          });
        }
      });
    }
    return result;
  }

  private recoverSeasonTimeRanges(data?: ProviderCategoryCollection) {
    const timeRanges = this.timeRangesFromProviderData(data);
    return this.props.menuItems.mapped((itemBuilder) => {
      if (itemBuilder.type === MenuItemType.SEASON) {
        let start = -1;
        let end = -1;
        const stageMappings = itemBuilder.stageMappings.map((stageMapping) => {
          const stageId = `${stageMapping.providerId}-${stageMapping.stageId}`;
          const timeRange = timeRanges.get(stageId) || stageMapping.timeRange;
          if (timeRange !== undefined) {
            if (start < 0 || timeRange.start < start) {
              start = timeRange.start;
            }
            if (end < 0 || timeRange.end < end) {
              end = timeRange.end;
            }
          }
          return StageMappingBuilder.from(stageMapping)
            .setTimeRange(timeRange)
            .build();
        });
        itemBuilder.setStageMappings(stageMappings);
        if (start >= 0) {
          itemBuilder.setTimeRange({
            start: start,
            end: end > start ? end : start,
          });
        }
      }
      return itemBuilder;
    });
  }

  private onApply() {
    if (this.props.onComplete) {
      this.props.onComplete(this.state.menuItems);
    }
  }

  private onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

export default withStyles(styles)(SeasonDateRecoveryDialog);
