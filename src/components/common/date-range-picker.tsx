import React from "react";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { TimeRangeValidator } from "../../models/common/time-range";

const styles = () =>
  createStyles({
    fullWidth: {
      width: "100%",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  className?: string;
  start: string;
  end: string;
  onChange?: (start: string, end: string, isValid: boolean) => void;
  disableValidation?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
}

interface RState {
  start: string;
  end: string;
  isValid: boolean;
}

class DateRangePicker extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    const start = props.start;
    const end = props.end;
    this.state = {
      start: start,
      end: end,
      isValid: TimeRangeValidator.isValid(start, end),
    };
  }

  render(): React.ReactNode {
    return (
      <>
        {this.renderDatePicker(this.state.start, false)}
        {this.renderDatePicker(this.state.end, true)}
      </>
    );
  }

  private renderDatePicker(value: string, isEnd: boolean): React.ReactNode {
    const isValid =
      this.props.disableValidation === true ||
      (this.state.start.length === 0 && this.state.end.length === 0) ||
      (this.state.start.length > 0 &&
        this.state.end.length > 0 &&
        this.state.start <= this.state.end);
    const label = isEnd ? "To" : "From";
    const helperText = isEnd ? this.props.helperText : undefined;
    return (
      <Grid container spacing={4} className={this.props.className}>
        <Grid item xs={12}>
          <TextField
            error={!isValid || this.props.error === true}
            label={label}
            type="datetime-local"
            value={value}
            variant="outlined"
            size="small"
            className={this.props.classes.fullWidth}
            onChange={(event) => this.onUpdate(event.target.value, isEnd)}
            helperText={helperText}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
    );
  }

  private onUpdate(value: string, isEnd: boolean): void {
    let start, end: string;
    if (isEnd) {
      start = this.state.start;
      end = value;
    } else {
      start = value;
      end = this.state.end;
    }
    const isValid = TimeRangeValidator.isValid(start, end);
    this.setState({ start: start, end: end, isValid: isValid });
    if (this.props.onChange) {
      if (isValid || this.props.disableValidation === true) {
        this.props.onChange(start, end, isValid);
      } else {
        this.props.onChange("", "", true);
      }
    }
  }
}

export default withStyles(styles)(DateRangePicker);
