import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import ListItem from "@material-ui/core/ListItem";
import MenuListItem from "@material-ui/core/MenuItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import { Provider } from "../../../../models/enums/provider";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SyncIcon from "@material-ui/icons/Sync";
import { green } from "@material-ui/core/colors";
import { StageMapping } from "../../../../models/menu/stage-mapping";
import { DateUtil } from "../../../../utils/date-util";
import { Gender } from "../../../../models/enums/gender";

const styles = () =>
  createStyles({
    row: {
      height: "60px",
      display: "flex",
      alignItems: "center",
    },
    rowActions: {
      display: "flex",
      alignItems: "center",
    },
    narrow: {
      minWidth: "46px",
    },
    countBadge: {
      display: "inline-block",
      padding: "3px 5px",
      borderRadius: "26px",
      boxSizing: "border-box",
      minWidth: "26px",
      textAlign: "center",
      marginRight: "5px",
      backgroundColor: green[500],
      color: "#ffffff",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  mapping: StageMapping;
  index: number;
  count?: number;
  actionsDisabled?: boolean;
  onAdd?: (mapping: StageMapping) => void;
  onUpdate?: (index: number) => void;
  onRemove?: (index: number) => void;
  onSelect?: (mapping: StageMapping) => void;
  onRefresh?: (mapping: StageMapping) => void;
  onClose?: () => void;
}

class StageMappingRow extends React.Component<RProps, any> {
  render(): React.ReactNode {
    if (this.props.onSelect) {
      return (
        <MenuListItem
          className={this.props.classes.row}
          onClick={() => this.onSelect()}
        >
          {this.renderContent()}
        </MenuListItem>
      );
    }
    return (
      <ListItem className={this.props.classes.row}>
        {this.renderContent()}
      </ListItem>
    );
  }

  private renderContent(): React.ReactNode {
    const primaryText =
      this.props.mapping.fullName +
      Gender.suffix(this.props.mapping.gender || Gender.UNKNOWN);
    let secondaryText = this.props.mapping.stageId;
    if (this.props.mapping.timeRange) {
      secondaryText +=
        " | " +
        Gender.title(this.props.mapping.gender) +
        " | " +
        DateUtil.formatApiTimestampDateTime(
          this.props.mapping.timeRange.start
        ) +
        " - " +
        DateUtil.formatApiTimestampDateTime(this.props.mapping.timeRange.end);
    }
    return (
      <>
        <ListItemAvatar className={this.props.classes.narrow}>
          <Avatar>
            {Provider.initialsForProvider(this.props.mapping.providerId)}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={primaryText} secondary={secondaryText} />
        {this.renderActions()}
      </>
    );
  }

  private renderActions(): React.ReactNode {
    const actions = new Array<React.ReactNode>();
    if (this.props.count && this.props.count > 0) {
      actions.push(
        <span key="count" className={this.props.classes.countBadge}>
          {this.props.count}
        </span>
      );
    }
    if (this.props.onAdd) {
      actions.push(
        <IconButton
          key="add"
          onClick={() => this.onAdd()}
          disabled={this.props.actionsDisabled}
        >
          <AddIcon />
        </IconButton>
      );
    }
    if (this.props.onRefresh) {
      actions.push(
        <IconButton
          key="refresh"
          onClick={() => this.onRefresh()}
          disabled={this.props.actionsDisabled}
        >
          <SyncIcon />
        </IconButton>
      );
    }
    if (this.props.onUpdate) {
      actions.push(
        <IconButton
          key="edit"
          onClick={() => this.onEdit()}
          disabled={this.props.actionsDisabled}
        >
          <EditIcon />
        </IconButton>
      );
    }
    if (this.props.onRemove) {
      actions.push(
        <IconButton
          key="remove"
          onClick={() => this.onRemove()}
          disabled={this.props.actionsDisabled}
        >
          <DeleteIcon />
        </IconButton>
      );
    }
    if (actions.length === 0) {
      return undefined;
    }
    return (
      <ListItemSecondaryAction className={this.props.classes.rowActions}>
        {actions}
      </ListItemSecondaryAction>
    );
  }

  private onAdd(): void {
    if (this.props.onAdd) {
      this.props.onAdd(this.props.mapping);
    }
  }

  private onRefresh(): void {
    if (this.props.onRefresh) {
      this.props.onRefresh(this.props.mapping);
    }
  }

  private onEdit(): void {
    if (this.props.onUpdate) {
      this.props.onUpdate(this.props.index);
    }
  }

  private onRemove(): void {
    if (this.props.onRemove) {
      this.props.onRemove(this.props.index);
    }
  }

  private onSelect(): void {
    if (this.props.onSelect) {
      this.props.onSelect(this.props.mapping);
    }
  }
}

export default withStyles(styles)(StageMappingRow);
