import React from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import PanToolIcon from "@material-ui/icons/PanTool";
import { Typography } from "@material-ui/core";

const styles = createStyles({
  errorContainer: {
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    paddingTop: 15,

    "&.positionTop": {
      justifyContent: "start",
    },
  },
  tall: {
    padding: "10px 0",
  },
});

interface MasterErrorProps extends WithStyles<typeof styles> {
  type: "unauthorized" | "unknown";
  position?: "top" | "default";
  detail?: ErrorDetail;
}

export interface ErrorDetail {
  icon: React.ReactNode;
  message: string;
  notes: string[];
}

const errors = {
  unauthorized: {
    icon: <PanToolIcon fontSize="large" />,
    message: "Unauthorized",
    notes: [
      "You are not permitted to perform this action",
      "To gain additional permissions, please contact the administrator.",
    ],
  },
  unknown: {
    icon: <ErrorOutlineIcon fontSize="large" />,
    message: "An unexpected error occurred.",
    notes: [
      "Please try again later. Refresh the page to try again.",
      "If the problem persists, contact the administrator.",
    ],
  },
};

class MasterError extends React.PureComponent<MasterErrorProps, any> {
  render(): React.ReactNode {
    const content: ErrorDetail =
      this.props.detail || errors[this.props.type] || errors.unknown;
    const classes = this.props.classes;

    let className = classes.errorContainer;
    if (this.props.position === "top") {
      className += " positionTop";
    }

    return (
      <div className={className}>
        {content.icon}
        <Typography
          variant="subtitle1"
          component="div"
          className={classes.tall}
        >
          {content.message}
        </Typography>
        {content.notes.map((note, index) => (
          <Typography variant="body2" component="div" key={index}>
            {note}
          </Typography>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(MasterError);
