import React from "react";
import LocEdit from "../../../components/loc-overview/edit/loc-overview-edit";
import { withRouter } from "react-router-dom";
import { TextUtil } from "../../../utils/text-util";
import BaseAuthPaperbasePage from "../../base-auth-paperbase-page";
import MasterError from "../../../components/master-error";

class LocOverviewEdit extends BaseAuthPaperbasePage<any, any> {
  protected renderContent(): React.ReactNode {
    const params: any = this.props.match.params || {};
    const id = TextUtil.parseNumber(params.id);
    if (!id) {
      return <MasterError type="unknown" />;
    }
    return <LocEdit id={id} />;
  }
}

export default withRouter(LocOverviewEdit);
