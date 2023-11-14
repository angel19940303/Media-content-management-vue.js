import React from "react";
import { EditStatusMessage } from "../../../models/ui/edit-status-message";
import { RouteComponentProps } from "react-router-dom";
import { MenuDataPayload } from "../../../models/menu/menu-data-payload";
import { ApiDataLoader } from "../../../api/api-data-loader";
import { LoadStatus } from "../../../models/enums/load_status";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

export interface BaseMenuEditState {
  isLoading: boolean;
  name: string;
  publishUrl?: string;
  sport?: string;
  searchString: string;
  contentHeight: number;
  statusMessage?: EditStatusMessage;
  savingProgressMessages?: Array<string>;
  isSnackbarOpen: boolean;
  loadStatus: number;
}

type ProgressCallback = (index: number) => void;
type CompleteCallback = (
  isError: boolean,
  loadStatus: number,
  data?: any,
  message?: string
) => void;

class BaseMenuEdit<
  T extends RouteComponentProps<any>,
  U extends BaseMenuEditState
> extends React.Component<T, U> {
  protected renderSavingProgress(className: string): React.ReactNode {
    if (
      this.state.savingProgressMessages === undefined ||
      this.state.savingProgressMessages.length === 0
    ) {
      return undefined;
    }
    return (
      <div className={className}>
        {
          this.state.savingProgressMessages[
            this.state.savingProgressMessages.length - 1
          ]
        }
      </div>
    );
  }

  protected renderSnackBar(): React.ReactNode {
    const isOpen =
      this.state.isSnackbarOpen && this.state.statusMessage !== undefined;

    const severity =
      this.state.statusMessage?.type === LoadStatus.SUCCESS
        ? "success"
        : "error";

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
      this.setState({ isSnackbarOpen: false });
    };

    return (
      <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={severity}
          onClose={handleClose}
        >
          {this.state.statusMessage?.message}
        </MuiAlert>
      </Snackbar>
    );
  }

  protected performSave(
    id: number | undefined,
    sportId: number,
    items: any,
    publish: boolean,
    stageIdsToPull: Map<number, Set<string>> | undefined,
    progress: ProgressCallback,
    complete: CompleteCallback
  ): void {
    const payload: MenuDataPayload = {
      id: id,
      publishUrl: this.state.publishUrl,
      name: this.state.name,
      sportId: sportId,
      menu: items,
    };
    const compositeStageIdsToPull = new Array<[number, string]>();
    let completedRequests = 0;

    if (stageIdsToPull) {
      stageIdsToPull.forEach((stageIds, providerId) => {
        stageIds.forEach((stageId) =>
          compositeStageIdsToPull?.push([providerId, stageId])
        );
      });
    }

    const saveMenu = (
      progress: ProgressCallback,
      complete: CompleteCallback
    ) => {
      ApiDataLoader.shared.saveMenu(
        payload,
        undefined,
        (status, data, message) => {
          completedRequests++;
          if (status === LoadStatus.SUCCESS) {
            progress(completedRequests);
            if (publish) {
              publishMenu(progress, (isError, resultData, message) =>
                complete(isError, status, data, message)
              );
            } else {
              complete(false, status, data);
            }
          } else {
            complete(true, status, undefined, message);
          }
        }
      );
    };

    const publishMenu = (
      progress: ProgressCallback,
      complete: CompleteCallback
    ) => {
      ApiDataLoader.shared.publishMenus((status, data, message) => {
        completedRequests++;
        if (status === LoadStatus.SUCCESS) {
          progress(completedRequests);
          pullStageData(compositeStageIdsToPull, progress, complete);
        } else {
          complete(true, status, undefined, message);
        }
      });
    };

    const pullStageData = (
      stageIds: Array<[number, string]>,
      progress: ProgressCallback,
      complete: CompleteCallback
    ) => {
      if (stageIds.length === 0) {
        complete(false, LoadStatus.SUCCESS);
      } else {
        const [providerId, stageId] = stageIds[0];
        ApiDataLoader.shared.pullProviderStage(
          providerId,
          stageId,
          (status, data, message) => {
            completedRequests++;
            if (status === LoadStatus.SUCCESS) {
              progress(completedRequests);
              pullStageData(stageIds.slice(1), progress, complete);
            } else {
              complete(true, status, undefined, message);
            }
          }
        );
      }
    };

    saveMenu(progress, complete);
  }
}

export default BaseMenuEdit;
