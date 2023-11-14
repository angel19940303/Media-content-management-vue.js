import React from "react";
import BaseAuthPaperbasePage from "../../base-auth-paperbase-page";
import LocEnumsList from "../../../components/loc-enums/list/loc-enums-list";

class ContentLocEnums extends BaseAuthPaperbasePage<any, any> {
  protected renderContent(): React.ReactNode {
    return <LocEnumsList />;
  }
}

export default ContentLocEnums;
