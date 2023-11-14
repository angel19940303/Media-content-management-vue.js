import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { Stage } from "../../models/api-data/stage";
import { MatchVideoCollectionList } from "../../models/videos/match-video-collection-list";
import React from "react";
import VideoCalendarViewStage from "./videos-calendar-view-stage";
import { AutoSizer, List } from "react-virtualized";
import VideoCalendarViewMatch from "./videos-calendar-view-match";

const styles = () =>
  createStyles({
    dateBarItem: {
      display: "block",
      width: "14.28%",
      float: "left",
      "& > span": {
        display: "block",
      },
      boxSizing: "border-box",
      border: "none",
      borderRadius: 0,
      backgroundColor: "inherit",
      height: 40,
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#f9f9f9",
      },
    },
    dateBarItemSelected: {
      fontWeight: "bold",
    },
    clear: {
      clear: "left",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  date: Date;
  videos: MatchVideoCollectionList;
  height: number;
  stages?: Stage[];
  onMatchSelect?: (id: string) => void;
}

class VideoCalendarView extends React.PureComponent<RProps, any> {
  private listRef: any | undefined = undefined;

  render(): React.ReactNode {
    return (
      <div>
        <div className={this.props.classes.clear}>{this.renderStages()}</div>
      </div>
    );
  }

  componentDidUpdate() {
    console.log("Component did update");
    if (this.props.stages !== undefined && this.props.stages.length > 0) {
      this.listRef?.measureAllRows();
    }
    this.listRef?.recomputeRowHeights();
  }

  private renderStages(): React.ReactNode {
    if (this.props.stages === undefined || this.props.stages.length === 0) {
      return <div>There are no matches for this date</div>;
    }

    const rowIndexPaths = this.getRowIndexPaths();

    const rowRenderer = ({ index, key, style }: any) => {
      return (
        <div key={key} style={style}>
          {this.renderContentForIndexPath(rowIndexPaths[index])}
        </div>
      );
    };

    return (
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            ref={(ref) => this.setListRef(ref)}
            rowCount={rowIndexPaths.length}
            rowHeight={(index) => this.getRowHeight(rowIndexPaths[index.index])}
            width={width}
            height={this.props.height}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    );
  }

  private renderContentForIndexPath(
    indexPath: [number, number]
  ): React.ReactNode {
    const [section, row] = indexPath;
    if (
      this.props.stages !== undefined &&
      section >= 0 &&
      section < this.props.stages.length
    ) {
      const stage = this.props.stages[section];
      if (row < 0) {
        return <VideoCalendarViewStage stage={stage} />;
      } else if (stage.matches !== undefined && row < stage.matches.length) {
        const match = stage.matches[row];
        const videoCollection = this.props.videos.get(match.id);
        return (
          <VideoCalendarViewMatch
            match={match}
            videos={videoCollection}
            isLast={row === stage.matches.length - 1}
            onSelect={(id) => this.onMatchSelect(id)}
          />
        );
      }
    }
    return undefined;
  }

  private onMatchSelect(id: string): void {
    if (this.props.onMatchSelect) {
      this.props.onMatchSelect(id);
    }
  }

  private getRowIndexPaths(): [number, number][] {
    const indexPaths = new Array<[number, number]>();
    if (this.props.stages !== undefined) {
      for (let i = 0; i < this.props.stages.length; i++) {
        indexPaths.push([i, -1]);
        const stage = this.props.stages[i];
        if (stage.matches !== undefined) {
          for (let j = 0; j < stage.matches.length; j++) {
            indexPaths.push([i, j]);
          }
        }
      }
    }
    return indexPaths;
  }

  private getRowHeight(rowIndexPath: [number, number]): number {
    if (
      this.props.stages !== undefined &&
      this.props.stages.length > rowIndexPath[0]
    ) {
      if (rowIndexPath[1] < 0) {
        return 36;
      }
      const stage = this.props.stages[rowIndexPath[0]];
      if (
        stage.matches !== undefined &&
        stage.matches.length > rowIndexPath[1]
      ) {
        return 50;
      }
    }
    return 0;
  }

  private setListRef(listRef: any | undefined): void {
    if (
      listRef &&
      this.props.stages !== undefined &&
      this.props.stages.length > 0
    ) {
      listRef.measureAllRows();
    }
    this.listRef = listRef;
  }
}

export default withStyles(styles)(VideoCalendarView);
