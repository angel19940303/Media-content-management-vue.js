import React from "react";
import { createStyles, WithStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export const baseCreatePopperStyles = () =>
  createStyles({
    paper: {
      boxSizing: "border-box",
      width: 550,
    },
    header: {
      borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
      padding: "10px 15px",
    },
    options: {
      padding: "10px 10px 10px 15px",
    },
    content: {
      padding: "10px 15px 10px 10px",
    },
    actions: {
      borderTop: "1px solid rgba(0, 0, 0, 0.2)",
      padding: "10px 15px",
      textAlign: "right",
      "& button": {
        marginLeft: 10,
      },
    },
  });

export interface BaseCreatePopperProps
  extends WithStyles<typeof baseCreatePopperStyles> {}

export interface SelectOption<T> {
  value: T;
  title: string;
}

export interface BaseCreatePopperState {
  popperAnchorEl?: any;
}

export abstract class BaseCreatePopper<
  T extends BaseCreatePopperProps,
  U extends BaseCreatePopperState
> extends React.Component<T, U> {
  render(): React.ReactNode {
    const open = this.state.popperAnchorEl !== undefined;

    const handleClose = () => this.setState({ popperAnchorEl: undefined });

    return (
      <>
        <Button
          variant="contained"
          onClick={(event) =>
            this.setState({ popperAnchorEl: event.currentTarget })
          }
        >
          {this.renderButtonTitle()}
        </Button>
        <Popper
          open={open}
          anchorEl={this.state.popperAnchorEl}
          transition
          placement="bottom-end"
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <Paper className={this.props.classes.paper}>
                <ClickAwayListener onClickAway={handleClose}>
                  <Grid container>
                    <Grid item xs={12} className={this.props.classes.header}>
                      <Typography variant="h6" component="p">
                        {this.renderTitle()}
                      </Typography>
                    </Grid>
                    <Grid item xs={5} className={this.props.classes.options}>
                      {this.renderOptions()}
                    </Grid>
                    <Grid item xs={7} className={this.props.classes.content}>
                      {this.renderContent()}
                    </Grid>
                    <Grid item xs={12} className={this.props.classes.actions}>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.onCreateClick()}
                      >
                        Create
                      </Button>
                    </Grid>
                  </Grid>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </>
    );
  }

  protected abstract renderButtonTitle(): React.ReactNode;
  protected abstract renderTitle(): React.ReactNode;
  protected abstract renderOptions(): React.ReactNode;
  protected abstract renderContent(): React.ReactNode;
  protected abstract onCreateClick(): void;

  protected renderSelect<T extends string | number>(
    value: T,
    title: string,
    gridSize: any,
    options: Array<SelectOption<T>>,
    onChange: (value: T) => void
  ): React.ReactNode {
    return (
      <Grid item xs={gridSize}>
        <Typography variant="body2">
          <strong>{title}</strong>
        </Typography>
        <FormControl variant="outlined" size="small" margin="dense" fullWidth>
          <Select
            native
            value={value}
            onChange={(event) => onChange(event.target.value as T)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.title}
              </option>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }
}
