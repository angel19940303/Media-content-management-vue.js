import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { MenuItemList } from "../../../../models/menu/menu-item-list";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import WarningIcon from "@material-ui/icons/Warning";
import {
  Avatar,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";

const styles = () =>
  createStyles({
    messageContainer: {
      position: "absolute",
      top: 0,
      width: "calc(100% - 164px)",
      paddingTop: 4,
    },
    messageBox: {
      display: "flex",
      flex: 1,
      alignItems: "center",
      borderRadius: 8,
      backgroundColor: "#fff3cd",
      color: "#664d03",
      //border: "1px solid #664d03",
      boxShadow:
        "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
      height: 40,
      boxSizing: "border-box",
      padding: "3px 3px 3px 10px",
      overflow: "hidden",
      justifyContent: "space-between",
    },
    messageContent: {
      display: "flex",
      alignItems: "center",
    },
    noPadding: {
      padding: 0,
    },
  });

interface RProps extends WithStyles<typeof styles> {
  menuItemList: MenuItemList;
  onUpdate?: (primary: number[], visible: number[]) => void;
}

interface RState {
  isDialogOpen: boolean;
  selectedNonPrimary: Set<number>;
  selectedHidden: Set<number>;
}

class RecentInvisibleSeasonOverview extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      isDialogOpen: false,
      selectedNonPrimary: new Set<number>(),
      selectedHidden: new Set<number>(),
    };
  }

  render(): React.ReactNode {
    const [
      nonPrimarySeasons,
      hiddenStages,
    ] = this.props.menuItemList.getRecentInvisibleSeasons();
    if (nonPrimarySeasons.length === 0 && hiddenStages.length === 0) {
      return null;
    }

    let message = "";
    if (nonPrimarySeasons.length === 1) {
      message += `1 season with recent matches is not marked as primary`;
    } else if (nonPrimarySeasons.length > 0) {
      message += `${nonPrimarySeasons.length} seasons with recent matches are not marked as primary`;
    }
    if (hiddenStages.length === 1) {
      message += `${
        message.length === 0 ? "" : ", "
      }1 stage with recent matches is hidden`;
    } else if (hiddenStages.length > 0) {
      message += `${message.length === 0 ? "" : ", "}${
        hiddenStages.length
      } stages with recent matches are hidden`;
    }
    return (
      <>
        <div className={this.props.classes.messageContainer}>
          <div className={this.props.classes.messageBox}>
            <span className={this.props.classes.messageContent}>
              <WarningIcon fontSize="small" />
              {message}
            </span>
            <span>
              <Button
                size="small"
                onClick={() => this.setState({ isDialogOpen: true })}
              >
                Details
              </Button>
              <Button
                size="small"
                onClick={() =>
                  this.applyUpdate(nonPrimarySeasons, hiddenStages)
                }
              >
                Fix all
              </Button>
            </span>
          </div>
        </div>
        <Dialog
          maxWidth={"sm"}
          fullWidth={true}
          open={this.state.isDialogOpen}
          onClose={() => this.onDialogClose()}
        >
          <DialogTitle>Invisible items with recent matches</DialogTitle>
          <DialogContent className={this.props.classes.noPadding} dividers>
            <List dense>
              {nonPrimarySeasons.map(([id, name]) =>
                this.renderListItem(id, name, true)
              )}
              {hiddenStages.map(([id, name]) =>
                this.renderListItem(id, name, false)
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                this.onDialogApply(nonPrimarySeasons, hiddenStages)
              }
              color="primary"
            >
              Apply
            </Button>
            <Button onClick={() => this.onDialogClose()} color="default">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  private renderListItem(
    id: number,
    name: string,
    isSeason: boolean
  ): React.ReactNode {
    const avatar = isSeason ? "SE" : "ST";
    const isSelected = isSeason
      ? this.state.selectedNonPrimary.has(id)
      : this.state.selectedHidden.has(id);
    const onToggleSelect = (id: number) => {
      if (isSeason) {
        this.togglePrimarySelect(id);
      } else {
        this.toggleHiddenSelect(id);
      }
    };
    return (
      <ListItem key={id} button>
        <ListItemAvatar>
          <Avatar>{avatar}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={name} />
        <ListItemSecondaryAction>
          <Checkbox
            edge="end"
            onChange={() => onToggleSelect(id)}
            checked={isSelected}
          />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  private togglePrimarySelect(id: number): void {
    this.setState((state) => {
      const newSet = new Set<number>(state.selectedNonPrimary);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { selectedNonPrimary: newSet };
    });
  }

  private toggleHiddenSelect(id: number): void {
    this.setState((state) => {
      const newSet = new Set<number>(state.selectedHidden);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { selectedHidden: newSet };
    });
  }

  private applyUpdate(
    primary: [number, string][],
    visible: [number, string][]
  ): void {
    if (this.props.onUpdate) {
      this.props.onUpdate(
        primary.map(([id]) => id),
        visible.map(([id]) => id)
      );
    }
  }

  private onDialogApply(
    primary: [number, string][],
    visible: [number, string][]
  ): void {
    const primaryToFix = primary.filter(([id]) =>
      this.state.selectedNonPrimary.has(id)
    );
    const visibleToFix = visible.filter(([id]) =>
      this.state.selectedHidden.has(id)
    );
    this.onDialogClose();
    this.applyUpdate(primaryToFix, visibleToFix);
  }

  private onDialogClose(): void {
    this.setState({
      isDialogOpen: false,
      selectedNonPrimary: new Set<number>(),
      selectedHidden: new Set<number>(),
    });
  }
}

export default withStyles(styles)(RecentInvisibleSeasonOverview);
