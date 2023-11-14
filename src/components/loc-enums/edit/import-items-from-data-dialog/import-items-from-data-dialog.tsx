import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { LocEnumSourceType } from "../../../../models/enums/loc-enum-source-type";
import LoadingIndicator from "../../../common/loading-indicator";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { LocEnumItemList } from "../../../../models/loc-enums/loc-enum-item-list";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Sport } from "../../../../models/enums/sport";
import { ApiDataLoader } from "../../../../api/api-data-loader";
import { LoadStatus } from "../../../../models/enums/load_status";
import { LocEnumItemListBuilder } from "../../../../models/loc-enums/builders/loc-enum-item-list-builder";
import LocEnumsStageTeamsDialogContent from "../stage-teams-dialog/loc-enums-stage-teams-dialog-content";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const styles = () =>
  createStyles({
    dialogBody: {
      padding: 0,
      overflow: "hidden",
    },
    dialogBodyContent: {
      padding: "15px 25px",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  sport: string;
  onApply?: (locEnumList: LocEnumItemList, overwriteExisting: boolean) => void;
  onClose?: () => void;
}

interface RState {
  isLoading: boolean;
  isError: boolean;
  isFinished: boolean;
  selectedSourceType?: number;
  isSelectionAvailable: boolean;
  isSelectionConfirmed: boolean;
  locEnumList?: LocEnumItemList;
  overwriteExisting: boolean;
}

class ImportItemsFromDataDialog extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      isFinished: false,
      overwriteExisting: false,
      isSelectionAvailable: false,
      isSelectionConfirmed: false,
    };
  }

  render() {
    return (
      <Dialog
        maxWidth={"sm"}
        fullWidth={true}
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="edit-mapping-dialog-title">
          {this.renderTitle()}
        </DialogTitle>
        <DialogContent className={this.props.classes.dialogBody} dividers>
          {this.renderContent()}
        </DialogContent>
        <DialogActions>{this.renderFooter()}</DialogActions>
      </Dialog>
    );
  }

  private renderTitle() {
    if (
      this.state.selectedSourceType === LocEnumSourceType.PROVIDER_CATEGORIES
    ) {
      return "Import items from provider categories";
    }
    if (this.state.selectedSourceType === LocEnumSourceType.TEAMS_IN_STAGES) {
      return "Import items from teams in stages";
    }
    return "Import items from data";
  }

  private renderFooter() {
    const applyButton =
      this.state.locEnumList === undefined ? null : (
        <Button onClick={() => this.onApply()} color="primary">
          Apply
        </Button>
      );
    const nextButton =
      this.state.selectedSourceType !== LocEnumSourceType.TEAMS_IN_STAGES ||
      this.state.isSelectionConfirmed ||
      this.state.isLoading ? null : (
        <Button
          onClick={() => this.onNext()}
          color="primary"
          disabled={!this.state.isSelectionAvailable}
        >
          Next
        </Button>
      );
    return (
      <>
        {applyButton}
        {nextButton}
        <Button onClick={() => this.onClose()}>Close</Button>
      </>
    );
  }

  private renderContent() {
    if (this.state.isError) {
      return "Error";
    }
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    if (this.state.selectedSourceType === undefined) {
      return this.renderSourceSelect();
    }
    if (this.state.selectedSourceType === LocEnumSourceType.TEAMS_IN_STAGES) {
      return this.renderSourceTeamsInStages();
    }
    if (
      this.state.selectedSourceType === LocEnumSourceType.PROVIDER_CATEGORIES
    ) {
      return this.renderFinished();
    }
    return null;
  }

  private renderSourceSelect() {
    return (
      <Grid
        container
        spacing={2}
        className={this.props.classes.dialogBodyContent}
      >
        <Grid item xs={12}>
          <Typography>Select data source</Typography>
        </Grid>
        {LocEnumSourceType.TYPES.map((type) => (
          <Grid item xs={12} key={type}>
            <Button
              onClick={() => this.onSourceTypeChange(type)}
              variant="contained"
            >
              {LocEnumSourceType.title(type)}
            </Button>
          </Grid>
        ))}
      </Grid>
    );
  }

  private renderSourceTeamsInStages() {
    if (this.state.locEnumList !== undefined) {
      return this.renderFinished();
    }
    return (
      <LocEnumsStageTeamsDialogContent
        sport={this.props.sport}
        selectionConfirmed={this.state.isSelectionConfirmed}
        onChange={(selectedIds) =>
          this.setState({ isSelectionAvailable: selectedIds.length > 0 })
        }
        onSuccess={(locEnumList) => this.setState({ locEnumList: locEnumList })}
        onError={() => this.setState({ isError: true })}
      />
    );
  }

  private renderFinished() {
    return (
      <Grid
        container
        spacing={2}
        className={this.props.classes.dialogBodyContent}
      >
        <Grid item xs={12}>
          <Typography variant="h6" component="p">
            Import finished!
          </Typography>
          <Typography variant="body1" component="p">
            Created {this.state.locEnumList?.items.length || 0} enum item(s)
          </Typography>
          <Typography variant="body1" component="p">
            Click Apply to update the localized enum
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.overwriteExisting}
                onChange={(event) => this.onOverwriteExistingChange(event)}
                color="primary"
              />
            }
            label="Overwrite existing items"
          />
        </Grid>
      </Grid>
    );
  }

  private loadItemsFromProviderCategories() {
    const sport = Sport.fromCode(this.props.sport);
    ApiDataLoader.shared.loadSportStages(this.props.sport, (status, data) => {
      if (!this.props.isOpen) {
        return;
      }
      if (status === LoadStatus.SUCCESS && data !== undefined) {
        const items = LocEnumItemListBuilder.fromProviderCategories(
          data,
          sport
        ).build();
        this.setState({ isLoading: false, locEnumList: items });
      } else {
        this.setState({ isLoading: false, isError: true });
      }
    });
  }

  private onSourceTypeChange(type: number) {
    if (type === LocEnumSourceType.PROVIDER_CATEGORIES) {
      this.setState({ selectedSourceType: type, isLoading: true });
      this.loadItemsFromProviderCategories();
    } else if (type === LocEnumSourceType.TEAMS_IN_STAGES) {
      this.setState({ selectedSourceType: type });
    }
  }

  private onOverwriteExistingChange(event: any) {
    const overwriteExisting = event.target.checked;
    this.setState({ overwriteExisting: overwriteExisting });
  }

  private onApply() {
    if (this.state.locEnumList === undefined) {
      this.onClose();
    } else if (this.props.onApply) {
      this.props.onApply(this.state.locEnumList, this.state.overwriteExisting);
    }
  }

  private onNext() {
    this.setState({ isSelectionConfirmed: true });
  }

  private onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

export default withStyles(styles)(ImportItemsFromDataDialog);
