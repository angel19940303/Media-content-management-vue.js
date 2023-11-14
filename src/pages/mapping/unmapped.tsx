import React from "react";
import BaseAuthPaperbasePage from "../base-auth-paperbase-page";
import UnmappedMatchList from "../../components/mapping/unmapped-match-list";

class MappingUnmapped extends BaseAuthPaperbasePage<any, any> {
  protected renderContent(): React.ReactNode {
    return <UnmappedMatchList />;
  }
}

export default MappingUnmapped;
