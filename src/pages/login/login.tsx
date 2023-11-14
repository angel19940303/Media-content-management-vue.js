import React, { ChangeEvent, FormEvent } from "react";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import { Grid, Paper, TextField, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { ApiDataLoader } from "../../api/api-data-loader";
import { LoadStatus } from "../../models/enums/load_status";
import { Redirect } from "react-router-dom";
import LoadingIndicator from "../../components/common/loading-indicator";
import MasterError from "../../components/master-error";
import Link from "@material-ui/core/Link";
import { Routes } from "../../components/routing";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: 300,
      margin: "auto",
      position: "relative",
    },
    loginForm: {
      padding: 20,
      textAlign: "center",
    },
    passwordRecoveryLink: {
      position: "absolute",
      textAlign: "right",
      width: "100%",
      bottom: -25,
    },
    error: {
      color: theme.palette.error.main,
    },
  });

interface LoginProps extends WithStyles<typeof styles> {}
interface LoginState {
  isLoading: boolean;
  loginStatus: number;
  userPermissions?: number;
  email?: string;
  password?: string;
}

export class Login extends React.PureComponent<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = { isLoading: false, loginStatus: -1 };
  }

  componentDidMount(): void {
    ApiDataLoader.shared.loggedInWithPermissions(
      (status, user, permissions) => {
        if (
          status === LoadStatus.UNAUTHENTICATED ||
          status === LoadStatus.UNAUTHORIZED
        ) {
          this.setState({
            isLoading: false,
            loginStatus: -1,
            userPermissions: -1,
          });
        } else if (
          status === LoadStatus.SUCCESS &&
          user !== undefined &&
          permissions !== undefined
        ) {
          this.setState({
            isLoading: false,
            loginStatus: status,
            userPermissions: user.permissions,
          });
        } else {
          this.setState({ isLoading: false, loginStatus: status });
        }
      }
    );
  }

  render(): React.ReactNode {
    if (
      this.state.loginStatus === LoadStatus.SUCCESS &&
      this.state.userPermissions !== undefined &&
      this.state.userPermissions >= 0
    ) {
      return <Redirect to="/" />;
    }

    if (this.state.userPermissions === undefined) {
      if (this.state.loginStatus === LoadStatus.FAILURE) {
        return <MasterError type="unknown" />;
      }

      return <LoadingIndicator position="center" />;
    }

    return (
      <Paper className={this.props.classes.paper}>
        <form
          className={this.props.classes.loginForm}
          onSubmit={(event) => this.onFormSubmit(event)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="email"
                label="E-mail Address"
                variant="outlined"
                size="small"
                disabled={this.state.isLoading}
                fullWidth
                value={this.state.email || ""}
                error={this.state.email === ""}
                onChange={(event) => this.onEmailChange(event)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                size="small"
                disabled={this.state.isLoading}
                fullWidth
                value={this.state.password || ""}
                error={this.state.password === ""}
                onChange={(event) => this.onPasswordChange(event)}
              />
            </Grid>
            {this.renderError()}
            <Grid item xs={12}>
              <Button
                type="submit"
                disabled={this.state.isLoading}
                variant="contained"
                color="primary"
              >
                Log in
              </Button>
            </Grid>
          </Grid>
        </form>
        <div className={this.props.classes.passwordRecoveryLink}>
          <Link
            variant="body2"
            color="textSecondary"
            href={"#" + Routes.PasswordRecovery}
          >
            Forgot password?
          </Link>
        </div>
      </Paper>
    );
  }

  private renderError(): React.ReactNode {
    if (
      this.state.loginStatus === LoadStatus.UNAUTHENTICATED ||
      this.state.loginStatus === LoadStatus.UNAUTHORIZED
    ) {
      return (
        <Grid item xs={12}>
          <Typography
            variant="body2"
            component="div"
            className={this.props.classes.error}
          >
            Login failed! Incorrect e-mail address or password
          </Typography>
        </Grid>
      );
    }
    if (this.state.loginStatus === LoadStatus.FAILURE) {
      return (
        <Grid item xs={12}>
          <Typography
            variant="body2"
            component="div"
            className={this.props.classes.error}
          >
            Login failed with an unexpected error. Try again later
          </Typography>
        </Grid>
      );
    }
    return null;
  }

  private onEmailChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState({ email: value });
  }

  private onPasswordChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState({ password: value });
  }

  private onFormSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const email = this.state.email || "";
    const password = this.state.password || "";
    if (email === "" || password === "") {
      this.setState((state) => {
        return { email: state.email || "", password: state.password || "" };
      });
    } else {
      this.setState({ isLoading: true, loginStatus: -1 });
      ApiDataLoader.shared.logIn(email, password, (status, user) => {
        if (status === LoadStatus.SUCCESS && user !== undefined) {
          console.log("Login successful, redirect to homepage");
          this.setState({
            isLoading: false,
            userPermissions: user.permissions,
            loginStatus: status,
          });
        } else {
          this.setState({ isLoading: false, loginStatus: status });
        }
      });
    }
  }
}

export default withStyles(styles)(Login);
