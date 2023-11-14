import React from "react";
import { withRouter } from "react-router-dom";
import { TextUtil } from "../../../utils/text-util";
import NewsEntryEdit from "../../../components/news/entry-edit/news-entry-edit";
import BaseAuthPaperbasePage from "../../base-auth-paperbase-page";
import MasterError from "../../../components/master-error";

class ContentNewsEdit extends BaseAuthPaperbasePage<any, any> {
  protected renderContent(): React.ReactNode {
    const params: any = this.props.match.params || {};
    const id = TextUtil.parseNumber(params.id);
    if (id === undefined) {
      return <MasterError type="unknown" />;
    }
    return <NewsEntryEdit id={id} />;
  }
}

export default withRouter(ContentNewsEdit);
