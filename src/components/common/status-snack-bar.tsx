import React from "react";
import { LoadStatus } from "../../models/enums/load_status";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

export interface StatusMessage {
  type: number;
  text: string;
}

interface RProps {
  isOpen: boolean;
  message?: StatusMessage;
  onClose?: () => void;
}

class StatusSnackBar extends React.Component<RProps, any> {
  render(): React.ReactNode {
    const isOpen = this.props.isOpen && this.props.message !== undefined;

    const severity =
      this.props.message?.type === LoadStatus.SUCCESS ? "success" : "error";

    const handleClose = () => {
      if (this.props.onClose) {
        this.props.onClose();
      }
    };

    return (
      <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={severity}
          onClose={handleClose}
        >
          {this.props.message?.text}
        </MuiAlert>
      </Snackbar>
    );
  }
}

export default StatusSnackBar;
