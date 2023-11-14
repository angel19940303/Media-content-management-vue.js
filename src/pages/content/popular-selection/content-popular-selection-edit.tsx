import React from "react";
import { withRouter } from "react-router-dom";
import { TextUtil } from "../../../utils/text-util";
import MenuPopularEdit from "../../../components/menu/edit/menu-popular-edit";
import BaseAuthPaperbasePage from "../../base-auth-paperbase-page";
import MasterError from "../../../components/master-error";

class ContentPopularSelectionEdit extends BaseAuthPaperbasePage<any, any> {
  protected renderContent(): React.ReactNode {
    const params: any = this.props.match.params || {};
    const id = TextUtil.parseNumber(params.id);
    if (!id) {
      return <MasterError type="unknown" />;
    }
    return <MenuPopularEdit id={id} />;
  }
}

export default withRouter(ContentPopularSelectionEdit);
