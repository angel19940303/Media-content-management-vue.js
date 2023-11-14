import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { InputProps as StandardInputProps } from "@material-ui/core/Input/Input";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Provider } from "../../../../models/enums/provider";
import InputAdornment from "@material-ui/core/InputAdornment";
import Avatar from "@material-ui/core/Avatar";

const styles = (theme: Theme) =>
  createStyles({
    expandedRow: {
      paddingBottom: 12,
    },
    selected: {
      "& fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  label: string;
  data: Map<number, string>;
  providerId: number;
  className?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  InputProps?: Partial<StandardInputProps>;
  isExpanded?: boolean;
  onChange?: (data: Map<number, string>) => void;
}

interface RState {
  isExpanded: boolean;
}

class ProviderIdInput extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = { isExpanded: props.isExpanded === true };
  }

  render(): React.ReactNode {
    if (this.state.isExpanded) {
      return this.renderExpanded();
    }
    return this.renderCollapsed();
  }

  private renderCollapsed(): React.ReactNode {
    return (
      <Grid container>
        <Grid item>
          {this.renderTextField(
            this.props.providerId,
            false,
            false,
            this.props.helperText
          )}
        </Grid>
        <Grid item>
          <IconButton onClick={() => this.setState({ isExpanded: true })}>
            <ExpandMore />
          </IconButton>
        </Grid>
      </Grid>
    );
  }

  private renderExpanded(): React.ReactNode {
    const rows = new Array<React.ReactNode>();
    Provider.PROVIDERS.forEach((providerId, index) => {
      const row = new Array<React.ReactNode>();
      const isLast = index === Provider.PROVIDERS.length - 1;
      const helperText = isLast ? this.props.helperText : undefined;
      row.push(this.renderTextField(providerId, true, true, helperText));
      if (rows.length === 0) {
        row.push(
          <IconButton
            key="expandButton"
            onClick={() => this.setState({ isExpanded: false })}
          >
            <ExpandLess />
          </IconButton>
        );
      }
      const key = this.props.label + "_" + providerId;
      rows.push(
        <div key={key} className={this.props.classes.expandedRow}>
          {row}
        </div>
      );
    });
    return rows;
  }

  private renderTextField(
    providerId: number,
    showPrefix: boolean,
    highlightSelected: boolean,
    helperText?: React.ReactNode
  ): React.ReactNode {
    const value = this.props.data.get(providerId) || "";
    const inputProps: Partial<StandardInputProps> = this.props.InputProps || {};
    if (showPrefix) {
      inputProps.startAdornment = (
        <InputAdornment position="start">
          <Avatar>{Provider.initialsForProvider(providerId)}</Avatar>
        </InputAdornment>
      );
    }

    let className = this.props.className || "";
    if (highlightSelected && providerId === this.props.providerId) {
      className += " " + this.props.classes.selected;
    }

    return (
      <TextField
        key="textField"
        label={this.props.label}
        variant="outlined"
        size="small"
        value={value}
        error={this.props.error === true}
        helperText={helperText}
        className={className}
        InputProps={inputProps}
        onChange={(event) => this.handleTextChange(event, providerId)}
      />
    );
  }

  private handleTextChange(event: any, providerId: number) {
    const newData = new Map<number, string>(this.props.data);
    newData.set(providerId, event.target.value);
    if (this.props.onChange) {
      this.props.onChange(newData);
    }
  }
}

export default withStyles(styles)(ProviderIdInput);
