import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";

const styles = () =>
  createStyles({
    bottomBar: {
      position: "relative",
      height: "50px",
      width: "100%",
      backgroundColor: "#f5f5f5",
      borderTop: "1px solid rgba(0, 0, 0, 0.12)",
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      "& button": {
        marginLeft: 15,
      },
      "& a": {
        marginLeft: 15,
      },
      "& button:first-child": {
        marginLeft: 0,
      },
      "& a:first-child": {
        marginLeft: 0,
      },
    },
    absolute: {
      position: "absolute",
      bottom: "0",
    },
  });

interface MenuOption {
  id: string;
  title: string;
}

interface RProps extends WithStyles<typeof styles> {
  className?: string;
}

class BaseEditBottomBar extends React.Component<RProps, any> {
  render(): React.ReactNode {
    let className = this.props.classes.bottomBar;
    if (this.props.className !== undefined) {
      className += " " + this.props.className;
    }
    return <div className={className}>{this.props.children}</div>;
  }
}

export default withStyles(styles)(BaseEditBottomBar);
