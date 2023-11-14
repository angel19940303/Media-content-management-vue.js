import React from "react";
import Main from "./components/dashboard";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { AuthUser } from "./components/login/auth-user-context";
import { UserPermissions } from "./models/user/user-permissions";
import { AuthUserContext } from "./components/login/auth-user-context";

class App extends React.Component<any, AuthUser> {
  constructor(props: any) {
    super(props);
    this.state = {
      userName: "",
      email: "",
      isAdmin: false,
      permissions: -1,
      updateAuthUser: (
        userName,
        email,
        isAdmin,
        permissions,
        availablePermissions
      ) =>
        this.updateAuthUser(
          userName,
          email,
          isAdmin,
          permissions,
          availablePermissions
        ),
    };
  }

  render(): React.ReactNode {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <AuthUserContext.Provider value={this.state}>
          <Main />
        </AuthUserContext.Provider>
      </MuiPickersUtilsProvider>
    );
  }

  private updateAuthUser(
    userName: string,
    email: string,
    isAdmin: boolean,
    permissions: number,
    availablePermissions?: UserPermissions
  ) {
    this.setState({
      userName: userName,
      email: email,
      isAdmin: isAdmin,
      permissions: permissions,
      availablePermissions: availablePermissions,
    });
  }
}

export default App;
