import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { NewsMedium } from "../../../models/news/news-medium";
import { NewsMediaType } from "../../../models/enums/news-media-type";
import Chip from "@material-ui/core/Chip";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import { AddCircleOutlined } from "@material-ui/icons";

const styles = (theme: Theme) =>
  createStyles({
    chips: {
      display: "flex",
      listStyleType: "none",
      padding: 0,
      alignItems: "center",
      "& li": {
        marginRight: 5,
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
  images: Array<NewsMedium> | undefined | null;
  videos: Array<NewsMedium> | undefined | null;
  audios: Array<NewsMedium> | undefined | null;
  errorMessage?: string;
  onEdit?: (type: number) => void;
}

class NewsEntryEditMediaBar extends React.Component<RProps, any> {
  render(): React.ReactNode {
    const chips = this.chips();
    const content = new Array<React.ReactNode>();
    if (chips.length === 0) {
      content.push(<li key="empty-media">There are no media</li>);
    } else {
      chips.forEach((chip) => {
        content.push(
          <li key={chip[0]}>
            <Chip
              label={NewsMediaType.titleWithCount(chip[0], chip[1])}
              deleteIcon={<EditIcon fontSize="small" />}
              clickable
              onDelete={() => this.handleChipClick(chip[0])}
              onClick={() => this.handleChipClick(chip[0])}
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
            <IconButton
              size="small"
              onClick={() => this.handleChipClick(NewsMediaType.IMAGE)}
            >
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

  private chips(): Array<[number, number]> {
    const chips = new Array<[number, number]>();
    if (
      this.props.images !== undefined &&
      this.props.images !== null &&
      this.props.images.length > 0
    ) {
      chips.push([NewsMediaType.IMAGE, this.props.images.length]);
    }
    if (
      this.props.videos !== undefined &&
      this.props.videos !== null &&
      this.props.videos.length > 0
    ) {
      chips.push([NewsMediaType.VIDEO, this.props.videos.length]);
    }
    if (
      this.props.audios !== undefined &&
      this.props.audios !== null &&
      this.props.audios.length > 0
    ) {
      chips.push([NewsMediaType.AUDIO, this.props.audios.length]);
    }
    return chips;
  }

  private handleChipClick(type: number): void {
    if (this.props.onEdit) {
      this.props.onEdit(type);
    }
  }
}

export default withStyles(styles)(NewsEntryEditMediaBar);
