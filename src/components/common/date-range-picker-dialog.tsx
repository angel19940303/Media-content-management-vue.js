import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DateRangePicker from "./date-range-picker";
import { TimeRangeValidator } from "../../models/common/time-range";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";

const styles = () =>
  createStyles({
    noScroll: {
      overflowY: "hidden",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  start: string;
  end: string;
  name?: string;
  onUpdate?: (start: string, end: string) => void;
}

interface RState {
  numberOfResets: number;
  start: string;
  end: string;
  isValid: boolean;
}

class DateRangePickerDialog extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      numberOfResets: 0,
      start: props.start,
      end: props.end,
      isValid: TimeRangeValidator.isValid(props.start, props.end),
    };
  }

  render(): React.ReactNode {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="edit-mapping-dialog-title">
          {this.props.name}
        </DialogTitle>
        <DialogContent className={this.props.classes.noScroll}>
          <DateRangePicker
            key={this.state.numberOfResets}
            error={!this.state.isValid}
            start={this.state.start}
            end={this.state.end}
            disableValidation={true}
            onChange={(start, end) => this.onChange(start, end)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.onClear()}>Clear</Button>
          <Button onClick={() => this.onReset()}>Reset</Button>
          <Button onClick={() => this.onClose()} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private onChange(start: string, end: string): void {
    if (start !== this.state.start || end !== this.state.end) {
      this.setState({
        start: start,
        end: end,
        isValid: TimeRangeValidator.isValid(start, end),
      });
    }
  }

  private onClear(): void {
    this.setState({
      numberOfResets: this.state.numberOfResets + 1,
      start: "",
      end: "",
    });
  }

  private onReset(): void {
    this.setState({
      numberOfResets: this.state.numberOfResets + 1,
      start: this.props.start,
      end: this.props.end,
    });
  }

  private onClose(): void {
    if (this.props.onUpdate) {
      if (TimeRangeValidator.isValid(this.state.start, this.state.end)) {
        this.props.onUpdate(this.state.start, this.state.end);
      } else {
        this.props.onUpdate("", "");
      }
    }
  }
}

export default withStyles(styles)(DateRangePickerDialog);
