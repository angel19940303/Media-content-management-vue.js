import React from "react";
import { ApiDataLoader } from "../../api/api-data-loader";
import { LoadStatus } from "../../models/enums/load_status";
import { AuthUser, AuthUserContext } from "./auth-user-context";
import { Redirect } from "react-router-dom";
import LoadingIndicator from "../common/loading-indicator";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import MasterError from "../master-error";

const styles = createStyles({
  center: {
    margin: "0 auto",
  },
});

interface AuthWrapperProps
  extends React.PropsWithChildren<any>,
    WithStyles<typeof styles> {}
interface AuthWrapperState {
  loadStatus: number;
}

class AuthWrapper extends React.Component<AuthWrapperProps, AuthWrapperState> {
  private authCheckInterval: any | null = null;

  constructor(props: AuthWrapperProps) {
    super(props);
    this.state = { loadStatus: -1 };
  }

  componentDidMount(): void {
    this.startAuthRefresh();
    const authUser: AuthUser = this.context;
    if (authUser.permissions >= 0) {
      this.setState({ loadStatus: LoadStatus.SUCCESS });
    } else {
      this.loadAuth();
    }
  }

  componentWillUnmount(): void {
    this.stopAuthRefresh();
  }

  render(): React.ReactNode {
    if (this.state.loadStatus === LoadStatus.SUCCESS) {
      return this.props.children;
    } else if (this.state.loadStatus === LoadStatus.UNAUTHENTICATED) {
      return <Redirect to="/login" />;
    } else if (
      this.state.loadStatus === LoadStatus.UNAUTHORIZED ||
      this.state.loadStatus === LoadStatus.FAILURE
    ) {
      return <MasterError type="unknown" />;
    } else {
      return (
        <div className={this.props.classes.center}>
          <LoadingIndicator />
        </div>
      );
    }
  }

  private startAuthRefresh(): void {
    this.stopAuthRefresh();
    this.authCheckInterval = window.setInterval(
      () => this.refreshAuth(true),
      10 * 60 * 1000
    );
  }

  private stopAuthRefresh(): void {
    if (this.authCheckInterval !== null) {
      window.clearInterval(this.authCheckInterval);
      this.authCheckInterval = null;
    }
  }

  private loadAuth(): void {
    const authUser: AuthUser = this.context;
    ApiDataLoader.shared.loggedInWithPermissions(
      (status, user, availablePermissions) => {
        if (
          status === LoadStatus.SUCCESS &&
          user !== undefined &&
          availablePermissions !== undefined
        ) {
          authUser.updateAuthUser(
            user.name,
            user.email,
            user.isAdmin,
            user.permissions,
            availablePermissions
          );
        }
        this.setState({ loadStatus: status });
      }
    );
  }

  private refreshAuth(ignoreFailures: boolean): void {
    const authUser: AuthUser = this.context;
    ApiDataLoader.shared.loggedIn((status, user) => {
      if (status === LoadStatus.SUCCESS && user !== undefined) {
        const availablePermissions = authUser.availablePermissions;
        authUser.updateAuthUser(
          user.name,
          user.email,
          user.isAdmin,
          user.permissions,
          availablePermissions
        );
      }
    });
  }
}

AuthWrapper.contextType = AuthUserContext;

export default withStyles(styles)(AuthWrapper);
