import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import { DatePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

const styles = () =>
  createStyles({
    noPadding: {
      padding: 0,

      "&:first-child": {
        paddingTop: 0,
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  date: Date | undefined;
  onChange?: (date: Date) => void;
  onClose?: () => void;
}

class DatePickerDialog extends React.PureComponent<RProps, any> {
  render(): React.ReactNode {
    return (
      <Dialog
        className={this.props.classes.noPadding}
        open={this.props.isOpen}
        onClose={() => this.onClose()}
      >
        <DialogContent className={this.props.classes.noPadding}>
          <DatePicker
            disableToolbar
            variant="static"
            value={this.props.date || new Date()}
            onChange={(date) => this.onChange(date)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  private onChange(date: MaterialUiPickersDate | undefined): void {
    if (this.props.onChange) {
      if (date === undefined || date === null) {
        this.props.onChange(new Date());
        return;
      }
      this.props.onChange(new Date(date.getTime()));
    }
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

export default withStyles(styles)(DatePickerDialog);
