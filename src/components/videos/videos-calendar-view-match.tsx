import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import React from "react";
import { Match } from "../../models/api-data/match";
import { MatchVideoCollection } from "../../models/videos/match-video-collection";
import PersonalVideoIcon from "@material-ui/icons/PersonalVideo";

const styles = (theme: Theme) =>
  createStyles({
    matchRow: {
      position: "relative",
      height: 50,
      "&:hover": {
        backgroundColor: "#f6f6f6",
        cursor: "pointer",
      },
    },
    matchContent: {
      marginLeft: 8,
      marginRight: 8,
      paddingTop: 5,
      paddingBottom: 5,
      borderBottom: "1px solid #eee",
    },
    lastMatchContent: {
      borderBottom: "none",
    },
    status: {
      width: 50,
      display: "block",
      position: "absolute",
      "& span": {
        display: "block",
      },
    },
    teams: {
      marginLeft: 50,
      marginRight: 30,
      display: "block",
      "& span": {
        display: "block",
      },
    },
    scores: {
      top: 5,
      right: 8,
      width: 30,
      display: "block",
      position: "absolute",
      textAlign: "right",
      "& span": {
        display: "block",
      },
    },
    videoCount: {
      display: "block",
      position: "absolute",
      top: 14,
      right: 40,
      height: 24,
      width: 24,
    },
    videoCountContent: {
      display: "block",
      position: "absolute",
      width: 24,
      height: 24,
      lineHeight: "24px",
      fontSize: 11,
      textAlign: "center",
      top: 0,
      fontWeight: 500,
    },
  });

interface RProps extends WithStyles<typeof styles> {
  match: Match;
  isLast?: boolean;
  videos?: MatchVideoCollection;
  onSelect?: (id: string) => void;
}

class VideoCalendarViewMatch extends React.PureComponent<RProps, any> {
  render(): React.ReactNode {
    let className = this.props.classes.matchContent;
    if (this.props.isLast === true) {
      className += " " + this.props.classes.lastMatchContent;
    }
    return (
      <div className={this.props.classes.matchRow}>
        <div className={className} onClick={() => this.handleClick()}>
          <span className={this.props.classes.status}>
            <span>{this.props.match.startTime()}</span>
          </span>
          <span className={this.props.classes.teams}>
            <span>{this.props.match.homeTeamName()}</span>
            <span>{this.props.match.awayTeamName()}</span>
          </span>
          <span className={this.props.classes.scores}>
            <span>{this.props.match.homeScore()}</span>
            <span>{this.props.match.awayScore()}</span>
          </span>
          {this.renderVideoCount()}
        </div>
      </div>
    );
  }

  private renderVideoCount(): React.ReactNode {
    if (
      this.props.videos === undefined ||
      this.props.videos.videos.length === 0
    ) {
      return undefined;
    }
    return (
      <span className={this.props.classes.videoCount}>
        <PersonalVideoIcon />
        <span className={this.props.classes.videoCountContent}>
          {this.props.videos.videos.length}
        </span>
      </span>
    );
  }

  private handleClick(): void {
    if (this.props.onSelect) {
      this.props.onSelect(this.props.match.id);
    }
  }
}

export default withStyles(styles)(VideoCalendarViewMatch);
