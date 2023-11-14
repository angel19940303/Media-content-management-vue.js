import React from "react";
import MenuEdit from "../../../components/menu/edit/menu-edit";
import { withRouter } from "react-router-dom";
import { TextUtil } from "../../../utils/text-util";
import BaseAuthPaperbasePage from "../../base-auth-paperbase-page";
import MasterError from "../../../components/master-error";

class ContentMenuStructureEdit extends BaseAuthPaperbasePage<any, any> {
  protected renderContent(): React.ReactNode {
    const params: any = this.props.match.params || {};
    const sport: string | undefined = params.sport;
    const id = TextUtil.parseNumber(params.id);
    const sourceId = TextUtil.parseNumber(params.sourceId);
    if (!sport && !id && !sourceId) {
      return <MasterError type="unknown" />;
    }
    const providerId = TextUtil.parseNumber(params.providerId);
    return (
      <MenuEdit
        sport={sport}
        providerId={providerId}
        id={id}
        sourceId={sourceId}
      />
    );
  }
}

export default withRouter(ContentMenuStructureEdit);
