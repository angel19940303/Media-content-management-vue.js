import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { IconButton } from "@material-ui/core";
import { AddCircleOutlined } from "@material-ui/icons";
import { NewsTag } from "../../../models/news/news-tag";
import { NewsTagType } from "../../../models/enums/news-tag-type";

const styles = (theme: Theme) =>
  createStyles({
    chips: {
      listStyleType: "none",
      padding: 0,
      alignItems: "center",
      "& li": {
        display: "inline-block",
        marginRight: 5,
        marginBottom: 5,
      },
      "& li:last-child": {
        marginRight: 0,
      },
    },
    errorMessage: {
      fontSize: "0.75rem",
      color: "#f44336",
      paddingLeft: 15,
    },
  });

interface RProps extends WithStyles<typeof styles> {
  stageTags: Array<[string, NewsTag]> | undefined | null;
  participantTags: Array<[string, NewsTag]> | undefined | null;
  errorMessage?: string;
  onEdit?: () => void;
}

class NewsEntryEditTagsBar extends React.Component<RProps, any> {
  render(): React.ReactNode {
    const chips = this.chips();
    const content = new Array<React.ReactNode>();
    if (chips.length === 0) {
      content.push(<li key="empty-tag">There are no tags</li>);
    } else {
      chips.forEach((chip, index) => {
        const title = `${NewsTagType.title(chip[0])}: ${chip[1]}`;
        content.push(
          <li key={`${chip[0]}-${index}-container`}>
            <Chip
              label={title}
              key={`${chip[0]}-${index}`}
              clickable
              onClick={() => this.handleChipClick()}
            />
          </li>
        );
      });
    }
    return (
      <>
        <ul className={this.props.classes.chips}>
          {content}
          <li>
            <IconButton size="small" onClick={() => this.handleChipClick()}>
              <AddCircleOutlined />
            </IconButton>
          </li>
        </ul>
        {this.renderErrorMessage()}
      </>
    );
  }

  private renderErrorMessage(): React.ReactNode {
    if (this.props.errorMessage === undefined) {
      return undefined;
    }
    return (
      <div className={this.props.classes.errorMessage}>
        {this.props.errorMessage}
      </div>
    );
  }

  private chips(): Array<[number, string]> {
    const chips = new Array<[number, string]>();
    if (this.props.stageTags !== undefined && this.props.stageTags !== null) {
      this.props.stageTags.forEach(([key]) =>
        chips.push([NewsTagType.STAGE, key])
      );
    }
    if (
      this.props.participantTags !== undefined &&
      this.props.participantTags !== null
    ) {
      this.props.participantTags.forEach(([key]) =>
        chips.push([NewsTagType.PARTICIPANT, key])
      );
    }
    return chips;
  }

  private handleChipClick(): void {
    if (this.props.onEdit) {
      this.props.onEdit();
    }
  }
}

export default withStyles(styles)(NewsEntryEditTagsBar);
