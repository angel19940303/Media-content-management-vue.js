import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import VideoEdit from "../../../components/videos/video-edit";
import BaseAuthPaperbasePage from "../../base-auth-paperbase-page";
import MasterError from "../../../components/master-error";

class ContentVideoEdit extends BaseAuthPaperbasePage<RouteComponentProps, any> {
  protected renderContent(): React.ReactNode {
    const params: any = this.props.match.params || {};
    const sport: string | undefined = params.sport;
    const internalEventId: string | undefined = params.internalEventId;
    if (!sport || !internalEventId) {
      return <MasterError type="unknown" />;
    }
    return (
      <VideoEdit
        key={internalEventId}
        sport={sport}
        internalEventId={internalEventId}
      />
    );
  }
}

export default withRouter(ContentVideoEdit);
