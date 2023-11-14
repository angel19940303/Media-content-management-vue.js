import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import BaseAuthPaperbasePage from "../base-auth-paperbase-page";
import UserList from "../../components/users/user-list";

const styles = createStyles({});

interface RProps extends WithStyles<typeof styles> {}

class UserManagement extends BaseAuthPaperbasePage<RProps, any> {
  protected renderContent(): React.ReactNode {
    return <UserList />;
  }
}

export default withStyles(styles)(UserManagement);
