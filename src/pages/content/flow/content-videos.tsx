import React from "react";
import BaseAuthPaperbasePage from "../../base-auth-paperbase-page";
import VideoList from "../../../components/videos/video-list";

class ContentVideos extends BaseAuthPaperbasePage<any, any> {
  protected renderContent(): React.ReactNode {
    return <VideoList />;
  }
}

export default ContentVideos;
