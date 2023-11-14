import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { Stage } from "../../models/api-data/stage";
import React from "react";

const styles = () =>
  createStyles({
    stageHeader: {
      padding: 8,
      backgroundColor: "#efefef",
      display: "flex",
    },
    flag: {
      display: "block",
      width: 20,
      height: 20,
      borderRadius: 10,
      overflow: "hidden",
      marginRight: 5,
      "& img": {
        width: 20,
        height: 20,
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  stage: Stage;
}

class VideoCalendarViewStage extends React.PureComponent<RProps, any> {
  render(): React.ReactNode {
    if (this.props.stage.matches.length === 0) {
      return undefined;
    }
    return (
      <div
        className={this.props.classes.stageHeader}
        key={this.props.stage.stageId}
      >
        <span className={this.props.classes.flag}>
          <img
            src={`https://api.snaptech.dev/flags/2/${this.props.stage.categoryId}/1x1.svg`}
            alt=""
          />
        </span>
        {this.props.stage.categoryName} {this.props.stage.stageName}
      </div>
    );
  }
}

export default withStyles(styles)(VideoCalendarViewStage);
