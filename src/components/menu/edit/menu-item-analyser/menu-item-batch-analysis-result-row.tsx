import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import { Button } from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";

const styles = () =>
  createStyles({
    title: {
      height: 22,
      paddingLeft: 10,
      paddingRight: 10,
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "#fff3cd",
      color: "#664d03",
      height: 22,
      paddingLeft: 10,

      "& span": {
        display: "flex",
        alignItems: "center",

        "& svg": {
          height: 15,
        },
      },

      "& button": {
        padding: 0,
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  data: any;
  onFix?: (id: string, property: number, value: boolean) => void;
  onFixAll?: (property: number, value: boolean) => void;
}

class MenuItemBatchAnalysisResultRow extends React.Component<RProps, any> {
  render(): React.ReactNode {
    const className =
      this.props.data.isTitle === true
        ? this.props.classes.title
        : this.props.classes.row;
    return (
      <div className={className}>
        <span>
          {this.renderIcon()}
          {this.props.data.content}
        </span>
        {this.renderActions()}
      </div>
    );
  }

  private renderIcon(): React.ReactNode {
    if (this.props.data.isTitle === true) {
      return "";
    }
    return <WarningIcon fontSize="small" />;
  }

  private renderActions(): React.ReactNode {
    if (this.props.data.isTitle === true) {
      return "";
    }
    return (
      <div>
        <Button size="small" onClick={() => this.onFix()}>
          Fix
        </Button>
        <Button size="small" onClick={() => this.onFixAll()}>
          Fix all
        </Button>
      </div>
    );
  }

  private onFix() {
    if (this.props.onFix) {
      this.props.onFix(
        this.props.data.id,
        this.props.data.property,
        this.props.data.value
      );
    }
  }

  private onFixAll() {
    if (this.props.onFixAll) {
      this.props.onFixAll(this.props.data.property, this.props.data.value);
    }
  }
}

export default withStyles(styles)(MenuItemBatchAnalysisResultRow);
