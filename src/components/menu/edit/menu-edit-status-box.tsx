import React from "react";
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from "@material-ui/core/styles";
import { EditStatusMessage } from "../../../models/ui/edit-status-message";
import Tooltip from "@material-ui/core/Tooltip";
import { Icon } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

const styles = (theme: Theme) =>
  createStyles({
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
  });

interface RProps extends WithStyles<typeof styles> {
  statusMessage?: EditStatusMessage;
  errorOnly?: boolean;
}

class MenuEditStatusBox extends React.PureComponent<RProps, any> {
  render(): React.ReactNode {
    if (
      !this.props.statusMessage ||
      (this.props.statusMessage.type === 0 && this.props.errorOnly === true)
    ) {
      return "";
    }
    let className = this.props.classes.statusMessage;
    if (this.props.statusMessage.type === 0) {
      className += " " + this.props.classes.statusMessageSuccess;
    } else if (this.props.statusMessage.type === 1) {
      className += " " + this.props.classes.statusMessageError;
    }
    let tooltip: React.ReactNode = undefined;
    if (this.props.statusMessage.detail) {
      tooltip = (
        <Tooltip title={this.props.statusMessage.detail}>
          <Icon className={this.props.classes.statusMessageInfoIcon}>
            <InfoIcon />
          </Icon>
        </Tooltip>
      );
    }
    return (
      <div key="status-message" className={className}>
        {this.props.statusMessage.message}
        {tooltip}
      </div>
    );
  }
}

export default withStyles(styles)(MenuEditStatusBox);
