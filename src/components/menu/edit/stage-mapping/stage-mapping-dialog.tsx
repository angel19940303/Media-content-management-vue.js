import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import { ApiDataLoader } from "../../../../api/api-data-loader";
import { LoadStatus } from "../../../../models/enums/load_status";
import { StageMapping } from "../../../../models/menu/stage-mapping";
import { ComponentDataState } from "../../../../models/enums/component-data-state";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import StageMappingList from "./stage-mapping-list";
import { StageMappingCollection } from "../../../../models/ui/stage-mapping-collection";
import StageMappingEdit from "./stage-mapping-edit";
import { StageMappingFilter } from "../../../../models/ui/stage-mapping-filter";
import StageMappingFilterBar from "./stage-mapping-filter-bar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AssignedSeasonCounter } from "../../../../models/ui/assigned-season-counter";
import { ProviderCategoryCollection } from "../../../../models/menu/provider-category-collection";

const styles = () =>
  createStyles({
    noPadding: {
      padding: "0",
    },
    narrow: {
      minWidth: "46px",
    },
    rightBorder: {
      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    },
    centerWrapper: {
      height: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  sport?: string;
  title: string;
  language: string;
  mappings?: Array<StageMapping>;
  selectedIndex?: number;
  assignedSeasonCounter: AssignedSeasonCounter;
  onUpdate?: (mappings: Array<StageMapping>) => void;
  onClose?: (assignedSeasonCounter: AssignedSeasonCounter) => void;
  onError?: (loadStatus: number) => void;
}

interface RState {
  dataState: number;
  providerIds: Array<number>;
  availableMappings: StageMappingCollection;
  existingMappings: StageMappingCollection;
  assignedSeasonCounter: AssignedSeasonCounter;
  selectedIndex?: number;
  filter?: StageMappingFilter;
}

class StageMappingDialog extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      dataState: ComponentDataState.INITIALIZING,
      providerIds: new Array<number>(),
      availableMappings: StageMappingCollection.create(),
      existingMappings: StageMappingCollection.create(props.mappings),
      assignedSeasonCounter: props.assignedSeasonCounter,
      selectedIndex: props.selectedIndex,
    };
  }

  componentDidMount(): void {
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
          const availableMappings = StageMappingCollection.create(
            data?.toStageMappings()
          ).updateCounts(this.state.assignedSeasonCounter);
          this.setState({
            providerIds: data?.providers || [],
            availableMappings: availableMappings,
            dataState: ComponentDataState.READY,
          });
        } else {
          this.setState({ dataState: ComponentDataState.ERROR });
          if (
            LoadStatus.isAuthError(status) &&
            this.props.onError !== undefined
          ) {
            this.props.onError(status);
          }
        }
      }
    );
  }

  render(): React.ReactNode {
    return (
      <Dialog
        fullWidth={true}
        maxWidth={false}
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        aria-labelledby="add-mapping-dialog-title"
      >
        <DialogTitle id="add-mapping-dialog-title">
          {this.props.title}
        </DialogTitle>
        <DialogContent className={this.props.classes.noPadding} dividers>
          {this.renderContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.onClose()} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private renderContent(): React.ReactNode {
    if (
      this.props.isOpen &&
      this.state.dataState === ComponentDataState.INITIALIZING
    ) {
      return (
        <div className={this.props.classes.centerWrapper}>
          <CircularProgress />
        </div>
      );
    }
    if (this.state.dataState === ComponentDataState.ERROR) {
      return (
        <div className={this.props.classes.centerWrapper}>
          An error occurred when loading data. Please try again later.
        </div>
      );
    }
    return (
      <Grid container>
        <Grid item xs={6} className={this.props.classes.rightBorder}>
          {this.renderAvailableMappings()}
        </Grid>
        <Grid item xs={6}>
          {this.renderExistingMappings()}
        </Grid>
      </Grid>
    );
  }

  private renderAvailableMappings(): React.ReactNode {
    return (
      <>
        <StageMappingFilterBar
          providerIds={this.state.providerIds}
          filter={this.state.filter}
          onChange={(filter) => this.onFilterUpdate(filter)}
        />
        <StageMappingList
          virtualizedWithHeight={340}
          actionsDisabled={this.state.selectedIndex !== undefined}
          mappings={this.state.availableMappings.list()}
          onAdd={(mapping) => this.onAdd(mapping)}
        />
      </>
    );
  }

  private renderExistingMappings(): React.ReactNode {
    let selectedMapping: StageMapping | undefined = undefined;
    if (this.state.selectedIndex !== undefined) {
      selectedMapping = this.state.existingMappings.get(
        this.state.selectedIndex
      );
    }
    if (selectedMapping) {
      return (
        <StageMappingEdit
          mapping={selectedMapping}
          language={this.props.language}
          onUpdate={(mapping: StageMapping, close: boolean) =>
            this.onUpdate(mapping, close)
          }
        />
      );
    }
    return (
      <StageMappingList
        virtualizedWithHeight={400}
        mappings={this.state.existingMappings.list()}
        onUpdate={(index) => this.onEdit(index)}
        onRemove={(index) => this.onRemove(index)}
      />
    );
  }

  private onFilterUpdate(filter?: StageMappingFilter): void {
    this.setState((prevState) => {
      const availableMappings = prevState.availableMappings.applyFilter(filter);
      return { availableMappings: availableMappings, filter: filter };
    });
  }

  private onAdd(mapping: StageMapping): void {
    const availableMappings = this.state.availableMappings.findAndUpdate(
      mapping,
      (m) => m.incrementAssignmentCount()
    );
    const existingMappings = this.state.existingMappings.add(mapping);
    this.setState({
      availableMappings: availableMappings,
      existingMappings: existingMappings,
      assignedSeasonCounter: this.state.assignedSeasonCounter.increment(
        mapping.stageId
      ),
    });
    if (this.props.onUpdate) {
      this.props.onUpdate(existingMappings.list());
    }
  }

  private onEdit(index: number): void {
    this.setState({ selectedIndex: index });
  }

  private onUpdate(mapping: StageMapping, close: boolean): void {
    if (this.state.selectedIndex !== undefined) {
      const existingMappings = this.state.existingMappings.update(
        this.state.selectedIndex,
        mapping
      );
      const newSelectedIndex = close ? undefined : this.state.selectedIndex;
      this.setState({
        existingMappings: existingMappings,
        selectedIndex: newSelectedIndex,
      });
      if (this.props.onUpdate) {
        this.props.onUpdate(existingMappings.list());
      }
    }
  }

  private onRemove(index: number): void {
    const mapping = this.state.existingMappings.get(index);
    if (mapping) {
      const availableMappings = this.state.availableMappings.findAndUpdate(
        mapping,
        (m) => m.decrementAssignmentCount()
      );
      const existingMappings = this.state.existingMappings.remove(index);
      this.setState({
        availableMappings: availableMappings,
        existingMappings: existingMappings,
        assignedSeasonCounter: this.state.assignedSeasonCounter.decrement(
          mapping.stageId
        ),
      });
      if (this.props.onUpdate) {
        this.props.onUpdate(existingMappings.list());
      }
    }
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose(this.state.assignedSeasonCounter);
    }
    this.setState({
      dataState: ComponentDataState.INITIALIZING,
      filter: undefined,
    });
  }
}

export default withStyles(styles)(StageMappingDialog);
