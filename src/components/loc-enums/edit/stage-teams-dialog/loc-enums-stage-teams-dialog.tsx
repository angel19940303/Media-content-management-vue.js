import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { Typography } from "@material-ui/core";
import { LocEnumItemList } from "../../../../models/loc-enums/loc-enum-item-list";
import LocEnumsStageTeamsDialogContent from "./loc-enums-stage-teams-dialog-content";
import MasterError from "../../../master-error";

const styles = (theme: Theme) =>
  createStyles({
    noPadding: {
      padding: 0,
    },
    stageTeamDialogBody: {
      height: 400,
      padding: 0,
      overflow: "hidden",
    },
    stageTeamDialogStep2Progress: {
      padding: 15,
    },
    stageTeamDialogStep2Result: {
      padding: "15px 25px",
    },
    stageTeamDialogSubMenuItem: {
      backgroundColor: theme.palette.grey["100"],
    },
  });

interface RProps extends WithStyles<typeof styles> {
  sport: string;
  isOpen: boolean;
  onApply?: (enumList: LocEnumItemList) => void;
  onClose?: () => void;
}

interface RState {
  enumList?: LocEnumItemList;
  isError: boolean;
  isSelectionConfirmed: boolean;
  isSelectionAvailable: boolean;
}

class LocEnumsStageTeamsDialog extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      isError: false,
      isSelectionConfirmed: false,
      isSelectionAvailable: false,
    };
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
          Create enum items from Teams
        </DialogTitle>
        <DialogContent
          className={this.props.classes.stageTeamDialogBody}
          dividers
        >
          {this.renderContent()}
        </DialogContent>
        <DialogActions>{this.renderFooter()}</DialogActions>
      </Dialog>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.state.isError) {
      return <MasterError type="unknown" />;
    }
    if (this.state.enumList !== undefined) {
      return (
        <div className={this.props.classes.stageTeamDialogStep2Result}>
          <Typography variant="h6" component="p">
            Import finished!
          </Typography>
          <Typography variant="body1" component="p">
            Created {this.state.enumList.items.length} enum items
          </Typography>
          <Typography variant="body1" component="p">
            Click Apply to create localized enum
          </Typography>
        </div>
      );
    }
    return (
      <LocEnumsStageTeamsDialogContent
        sport={this.props.sport}
        selectionConfirmed={this.state.isSelectionConfirmed}
        onChange={(selectedIds) =>
          this.setState({ isSelectionAvailable: selectedIds.length > 0 })
        }
        onSuccess={(enumList) => this.setState({ enumList: enumList })}
        onError={() => this.setState({ isError: true })}
      />
    );
  }

  private renderFooter(): React.ReactNode {
    const buttons = new Array<React.ReactNode>();
    if (this.state.isSelectionConfirmed) {
      buttons.push(
        <Button
          onClick={() => this.onApply()}
          color="primary"
          disabled={this.state.enumList === undefined}
        >
          Apply
        </Button>
      );
    } else {
      buttons.push(
        <Button
          onClick={() => this.onNext()}
          color="primary"
          disabled={!this.state.isSelectionAvailable}
        >
          Next
        </Button>
      );
    }
    buttons.push(<Button onClick={() => this.onClose()}>Close</Button>);
    return buttons;
  }

  private onNext(): void {
    this.setState({ isSelectionConfirmed: true });
  }

  private onApply(): void {
    if (this.state.enumList === undefined) {
      this.onClose();
    } else if (this.props.onApply) {
      this.props.onApply(this.state.enumList);
    }
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

export default withStyles(styles)(LocEnumsStageTeamsDialog);
