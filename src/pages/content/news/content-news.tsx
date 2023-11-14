import React from "react";
import BaseAuthPaperbasePage from "../../base-auth-paperbase-page";
import NewsEntryList from "../../../components/news/entry-list/news-entry-list";

class ContentNews extends BaseAuthPaperbasePage<any, any> {
  protected renderContent(): React.ReactNode {
    return <NewsEntryList />;
  }
}

export default ContentNews;
