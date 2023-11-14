import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";

interface RProps {
  isOpen: boolean;
  confirmationMessage: React.ReactNode;
  confirmTitle?: string;
  cancelTitle?: string;
  onConfirm: (event: any) => void;
  onClose: () => void;
}

function ConfirmDialog(props: RProps) {
  const onConfirmClick = (event: any): void => {
    props.onConfirm(event);
  };

  const onCancelClick = (): void => {
    props.onClose();
  };

  return (
    <Dialog open={props.isOpen} onClose={onCancelClick}>
      <DialogContent>{props.confirmationMessage}</DialogContent>
      <DialogActions>
        <Button onClick={onConfirmClick}>
          {props.confirmTitle || "Confirm"}
        </Button>
        <Button onClick={onCancelClick}>{props.cancelTitle || "Cancel"}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
