import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme: Theme) =>
  createStyles({
    loadingIndicator: {
      textAlign: "center",
      padding: "75px 0",
      margin: "0 auto",

      "&.positionTop": {
        padding: 0,
      },
      "&.positionCenter": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  position?: "top" | "center" | "default";
}

function LoadingIndicator(props: RProps) {
  let className = props.classes.loadingIndicator;
  switch (props.position) {
    case "top":
      className += " positionTop";
      break;
    case "center":
      className += " positionCenter";
      break;
  }
  return (
    <div className={className}>
      <CircularProgress />
    </div>
  );
}

export default withStyles(styles)(LoadingIndicator);
