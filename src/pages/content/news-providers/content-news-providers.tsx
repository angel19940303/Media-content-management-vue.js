import React from "react";
import BaseAuthPaperbasePage from "../../base-auth-paperbase-page";
import NewsFeedList from "../../../components/news/feed-list/news-feed-list";

class ContentNewsProviders extends BaseAuthPaperbasePage<any, any> {
  protected renderContent(): React.ReactNode {
    return <NewsFeedList />;
  }
}

export default ContentNewsProviders;
