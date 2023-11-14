import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { ValidationUtil } from "../../utils/validation-util";

const styles = () =>
  createStyles({
    center: {
      margin: "0 auto",
    },
    videoPreview: {
      textAlign: "center",
      backgroundColor: "#111111",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
      borderRadius: 8,
      overflow: "hidden",
    },
    emptyMsg: {
      fontWeight: "bold",
      color: "#CCCCCC",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  url: string | undefined;
  height: number;
  width?: number;
  className?: string;
}

class VideoPreviewComponent extends React.PureComponent<RProps, any> {
  private static readonly BASE_YOUTUBE_EMBED_URL =
    "https://www.youtube.com/embed/";

  private static youtubeEmbedUrl(url: string): string {
    if (url.indexOf("embed") >= 0) {
      return url;
    }
    const urlParts = new URL(url);
    let videoId = urlParts.searchParams.get("v");
    if (videoId === null) {
      videoId = urlParts.searchParams.get("vi");
    }
    if (videoId === null) {
      const pathParts = urlParts.pathname
        .split("/")
        .filter((part) => part.length > 0);
      if (pathParts.length > 0) {
        videoId = pathParts[pathParts.length - 1];
        const index = videoId.indexOf("&");
        if (index >= 0) {
          videoId.substring(0, index);
        }
      }
    }
    if (videoId === null || videoId.length === 0) {
      return url;
    }
    return this.BASE_YOUTUBE_EMBED_URL + videoId;
  }

  render(): React.ReactNode {
    let className = this.props.classes.videoPreview;
    if (this.props.className !== undefined) {
      className += " " + this.props.className;
    }
    return (
      <div className={className} style={{ height: this.props.height }}>
        {this.renderContent()}
      </div>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.props.url !== undefined) {
      if (ValidationUtil.isYoutubeUrl(this.props.url)) {
        const width =
          this.props.width || Math.round((this.props.height / 9) * 16);
        return (
          <iframe
            id="ytplayer"
            title="Youtube player"
            width={width}
            height={this.props.height}
            key={this.props.url}
            src={VideoPreviewComponent.youtubeEmbedUrl(this.props.url)}
            frameBorder="0"
            className={this.props.classes.center}
          />
        );
      }
      if (ValidationUtil.isValidUrl(this.props.url)) {
        return (
          <video
            controls
            height={this.props.height}
            width={this.props.width}
            key={this.props.url}
            className={this.props.classes.center}
          >
            <source src={this.props.url} />
          </video>
        );
      }
    }
    return (
      <div className={this.props.classes.emptyMsg}>
        Video preview is not available
      </div>
    );
  }
}

export default withStyles(styles)(VideoPreviewComponent);
