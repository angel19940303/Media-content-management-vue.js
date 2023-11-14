import React from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import { ValidationUtil } from "../../../utils/validation-util";

const styles = () =>
  createStyles({
    paper: {
      boxSizing: "border-box",
      width: 550,
    },
    header: {
      padding: "10px 15px",
    },
    content: {
      padding: "0 15px",
    },
    actions: {
      padding: "10px 15px",
      textAlign: "right",
      "& button": {
        marginLeft: 10,
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  url?: string;
  onChange?: (url: string | undefined) => void;
}

interface RState {
  url?: string;
  openerAnchorEl?: any;
}

class MenuPublishLinkPopper extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = { url: props.url };
  }

  render(): React.ReactNode {
    const open = this.state.openerAnchorEl !== undefined;
    const isValid = this.hasValidUrl();
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={(event) =>
            this.setState({ openerAnchorEl: event.currentTarget })
          }
        >
          Set Publish URL
        </Button>
        <Popper
          open={open}
          anchorEl={this.state.openerAnchorEl}
          transition
          placement="bottom-end"
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <Paper className={this.props.classes.paper}>
                <ClickAwayListener onClickAway={() => this.close()}>
                  <Grid container>
                    <Grid item xs={12} className={this.props.classes.header}>
                      <Typography variant="h6" component="p">
                        Set Publish URL
                      </Typography>
                    </Grid>
                    <Grid item xs={12} className={this.props.classes.content}>
                      <TextField
                        variant="outlined"
                        value={this.state.url || ""}
                        size="small"
                        fullWidth
                        error={!isValid}
                        helperText={isValid ? undefined : "Not a valid URL"}
                        placeholder="Publish URL"
                        onChange={(event) =>
                          this.setState({ url: event.target.value })
                        }
                        InputProps={{
                          endAdornment: this.renderEndAdornment(),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} className={this.props.classes.actions}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.apply()}
                      >
                        Apply
                      </Button>
                      <Button variant="contained" onClick={() => this.close()}>
                        Cancel
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

  private renderEndAdornment(): React.ReactNode {
    if (this.state.url !== undefined && this.state.url.length > 0) {
      return (
        <InputAdornment position="end">
          <IconButton>
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      );
    }
    return undefined;
  }

  private apply(): void {
    if (this.hasValidUrl() && this.props.onChange) {
      const url =
        this.state.url === undefined || this.state.url.length === 0
          ? undefined
          : this.state.url;
      this.props.onChange(url);
    }
    this.close();
  }

  private close(): void {
    this.setState({ openerAnchorEl: undefined });
  }

  private hasValidUrl(): boolean {
    return (
      this.state.url === undefined ||
      this.state.url.length === 0 ||
      ValidationUtil.isValidUrl(this.state.url) ||
      ValidationUtil.isValidUrlPath(this.state.url)
    );
  }
}

export default withStyles(styles)(MenuPublishLinkPopper);
