import React from "react";
import { LoadStatus } from "../../../../models/enums/load_status";
import { Button } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { ApiDataLoader } from "../../../../api/api-data-loader";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";

const styles = () =>
  createStyles({
    publishButton: {
      marginLeft: 10,
    },
  });

interface RState {
  isSnackbarOpen: boolean;
  snackbarType: number;
}

export class MenuPublisherButton extends React.Component<
  WithStyles<typeof styles>,
  RState
> {
  constructor(props: WithStyles<typeof styles>) {
    super(props);
    this.state = { isSnackbarOpen: false, snackbarType: LoadStatus.SUCCESS };
  }

  render(): React.ReactNode {
    const severity =
      this.state.snackbarType === LoadStatus.SUCCESS ? "success" : "error";
    const message =
      this.state.snackbarType === LoadStatus.SUCCESS
        ? "Menus have been published successfully"
        : "Failed to publish menus";

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
      this.setState({ isSnackbarOpen: false });
    };

    return (
      <>
        <Button
          variant="contained"
          color="primary"
          className={this.props.classes.publishButton}
          onClick={() => this.publish()}
        >
          Publish
        </Button>
        <Snackbar
          open={this.state.isSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={severity}
            onClose={handleClose}
          >
            {message}
          </MuiAlert>
        </Snackbar>
      </>
    );
  }

  private publish(): void {
    ApiDataLoader.shared.publishMenus((status) => {
      this.setState({ isSnackbarOpen: true, snackbarType: status });
    });
  }
}

export default withStyles(styles)(MenuPublisherButton);
