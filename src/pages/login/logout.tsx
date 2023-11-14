import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { ApiDataLoader } from "../../api/api-data-loader";
import { LoadStatus } from "../../models/enums/load_status";
import LoadingIndicator from "../../components/common/loading-indicator";
import { Container, Link, Typography } from "@material-ui/core";
import { Routes } from "../../components/routing";
import MasterError from "../../components/master-error";
import {
  AuthUser,
  AuthUserContext,
} from "../../components/login/auth-user-context";

const styles = createStyles({
  loadingWrapper: {
    margin: "0 auto",
  },
  backLink: {
    display: "flex",
    alignItems: "center",
    "& svg": {
      fontSize: "1rem",
    },
  },
  marginBottom: {
    marginBottom: 10,
  },
});

interface RProps extends WithStyles<typeof styles> {}

interface RState {
  loadStatus: number;
}

class Logout extends React.PureComponent<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = { loadStatus: -1 };
  }

  componentDidMount() {
    const authUser: AuthUser = this.context;
    ApiDataLoader.shared.loggedInWithPermissions((status) => {
      if (status === LoadStatus.SUCCESS) {
        ApiDataLoader.shared.logOut((status) => {
          if (status === LoadStatus.SUCCESS) {
            authUser.updateAuthUser("", "", false, -1, undefined);
            this.setState({ loadStatus: LoadStatus.UNAUTHENTICATED });
          } else {
            this.setState({ loadStatus: status });
          }
        });
      } else {
        this.setState({ loadStatus: status });
      }
    });
  }

  render(): React.ReactNode {
    if (this.state.loadStatus < 0) {
      return <LoadingIndicator />;
    }

    if (this.state.loadStatus !== LoadStatus.UNAUTHENTICATED) {
      return <MasterError type="unknown" position="top" />;
    }

    return (
      <Container fixed maxWidth="xs">
        <Typography
          variant="h6"
          component="h1"
          className={this.props.classes.marginBottom}
        >
          Logout
        </Typography>
        <Typography
          variant="body1"
          component="p"
          className={this.props.classes.marginBottom}
        >
          You have been logged out successfully
        </Typography>
        <Link
          variant="body1"
          href={"#" + Routes.Login}
          className={this.props.classes.backLink}
        >
          Log in again
        </Link>
      </Container>
    );
  }
}

Logout.contextType = AuthUserContext;

export default withStyles(styles)(Logout);
