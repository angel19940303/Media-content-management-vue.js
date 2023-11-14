import React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { TextUtil } from "../../../utils/text-util";
import LocEnumsEdit from "../../../components/loc-enums/edit/loc-enums-edit";
import BaseAuthPaperbasePage from "../../base-auth-paperbase-page";

const locEnumStyles = (theme: Theme) => createStyles({});

class ContentLocEnumsEdit extends BaseAuthPaperbasePage<any, any> {
  protected renderContent() {
    const params: any = this.props.match.params || {};
    const sport: string | undefined = params.sport;
    const id = TextUtil.parseNumber(params.id);
    const sourceType = TextUtil.parseNumber(params.sourceType);
    return <LocEnumsEdit sport={sport} id={id} sourceType={sourceType} />;
  }
}

export default withStyles(locEnumStyles)(ContentLocEnumsEdit);
