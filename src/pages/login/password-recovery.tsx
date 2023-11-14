import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { Container, Link, Typography } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Routes } from "../../components/routing";

const styles = createStyles({
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

class PasswordRecovery extends React.PureComponent<RProps, any> {
  render(): React.ReactNode {
    return (
      <Container fixed maxWidth="xs">
        <Typography
          variant="h6"
          component="h1"
          className={this.props.classes.marginBottom}
        >
          Password recovery
        </Typography>
        <Typography
          variant="body1"
          component="p"
          className={this.props.classes.marginBottom}
        >
          To reset a forgotten password please contact your administrator.
        </Typography>
        <Link
          variant="body1"
          href={"#" + Routes.Login}
          className={this.props.classes.backLink}
        >
          <ArrowBackIosIcon fontSize="small" />
          Back to Login
        </Link>
      </Container>
    );
  }
}

export default withStyles(styles)(PasswordRecovery);
