import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import BaseAuthPaperbasePage from "../base-auth-paperbase-page";
import UserProfile from "../../components/users/user-profile";

const styles = createStyles({});

interface RProps extends WithStyles<typeof styles> {}

class UserProfileManagement extends BaseAuthPaperbasePage<RProps, any> {
  protected renderContent(): React.ReactNode {
    return <UserProfile />;
  }
}

export default withStyles(styles)(UserProfileManagement);
