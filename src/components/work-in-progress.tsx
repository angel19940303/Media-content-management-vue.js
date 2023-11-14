import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import BuildIcon from "@material-ui/icons/Build";

const styles = (theme: Theme) =>
  createStyles({
    wrapper: {
      paddingTop: 100,
      textAlign: "center",
      color: theme.palette.grey["600"],
    },
    icon: {
      fontSize: 60,
    },
  });

class WorkInProgress extends React.Component<WithStyles<typeof styles>> {
  render(): React.ReactNode {
    return (
      <div className={this.props.classes.wrapper}>
        <div>
          <BuildIcon className={this.props.classes.icon} />
        </div>
        <div>Work in progress</div>
      </div>
    );
  }
}

export default withStyles(styles)(WorkInProgress);
