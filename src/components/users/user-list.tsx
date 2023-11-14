import React, { ChangeEvent } from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { ApiDataLoader } from "../../api/api-data-loader";
import { LoadStatus } from "../../models/enums/load_status";
import { permissions, Routes } from "../routing";
import MasterError from "../master-error";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { User } from "../../models/user/user";
import LoadingIndicator from "../common/loading-indicator";
import {
  Avatar,
  Grow,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Divider from "@material-ui/core/Divider";
import Popper from "@material-ui/core/Popper";
import UserEditDialog from "./user-edit-dialog";
import { UserFormData } from "../../models/ui/user-form-data";
import { Redirect } from "react-router-dom";
import StatusSnackBar, { StatusMessage } from "../common/status-snack-bar";
import ConfirmDialog from "../common/confirm-dialog";
import { AuthUser, AuthUserContext } from "../login/auth-user-context";
import Chip from "@material-ui/core/Chip";
import LockIcon from "@material-ui/icons/Lock";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: 936,
      margin: "auto",
      overflow: "hidden",
    },
    searchBar: {
      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    },
    searchInput: {
      fontSize: theme.typography.fontSize,
    },
    block: {
      display: "block",
    },
    addUser: {
      marginRight: theme.spacing(1),
    },
    contentWrapper: {
      //margin: "40px 16px",
    },
    userAvatar: {
      alignItems: "baseline",
      backgroundColor: theme.palette.grey["300"],
      "& svg": {
        fontSize: "2.6rem",
        fill: theme.palette.grey["700"],
      },
    },
    userTable: {
      "& tr td": {
        paddingLeft: 0,
      },
      "& tr td:first-child": {
        paddingLeft: 16,
        width: 64,
      },
    },
    noPadding: {
      padding: 0,
    },
    divider: {
      backgroundColor: theme.palette.divider,
    },
  });

interface RProps extends WithStyles<typeof styles> {}

interface Selection {
  user: User;
  existingEmails: Set<string>;
  popperAnchorEl?: any;
}

interface RState {
  loadStatus: number;
  data: User[];
  filterText: string;
  filteredData?: User[];
  selection?: Selection;
  statusMessage?: StatusMessage;
  isRemoveConfirmationOpen: boolean;
  removeConfirmationUserName?: string;
}

class UserList extends React.PureComponent<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      loadStatus: -1,
      data: [],
      isRemoveConfirmationOpen: false,
      filterText: "",
    };
  }

  componentDidMount(): void {
    ApiDataLoader.shared.loadUsers((status, users) => {
      const sortedUsers = (users || []).sort((u1, u2) => u2.id - u1.id);
      this.setState({ loadStatus: status, data: sortedUsers });
    });
  }

  render(): React.ReactNode {
    if (this.state.loadStatus === LoadStatus.UNAUTHENTICATED) {
      return <Redirect to={Routes.Login} />;
    }
    if (this.state.loadStatus === LoadStatus.UNAUTHORIZED) {
      return <MasterError type="unauthorized" />;
    }
    return (
      <Paper className={this.props.classes.paper}>{this.renderContent()}</Paper>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.state.loadStatus < 0) {
      return <LoadingIndicator />;
    }
    if (this.state.loadStatus === LoadStatus.FAILURE) {
      return <MasterError type="unknown" />;
    }
    const isSnackBarOpen = this.state.statusMessage !== undefined;
    return (
      <>
        <AppBar
          className={this.props.classes.searchBar}
          position="static"
          color="default"
          elevation={0}
        >
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <SearchIcon
                  className={this.props.classes.block}
                  color="inherit"
                />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  placeholder="Search by name or email address"
                  value={this.state.filterText}
                  onChange={(event) => this.onFilterTextChange(event)}
                  InputProps={{
                    disableUnderline: true,
                    className: this.props.classes.searchInput,
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  className={this.props.classes.addUser}
                  onClick={() => this.onAddUserClick()}
                >
                  Add user
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <div className={this.props.classes.contentWrapper}>
          {this.renderUserList()}
        </div>
        <StatusSnackBar
          isOpen={isSnackBarOpen}
          message={this.state.statusMessage}
          onClose={() => this.onSnackBarClose()}
        />
      </>
    );
  }

  private renderUserList(): React.ReactNode {
    const data = this.state.filteredData || this.state.data;
    if (data.length === 0) {
      return (
        <Typography color="textSecondary" align="center">
          No users for this project yet
        </Typography>
      );
    }

    const isPopperOpen = this.state.selection?.popperAnchorEl !== undefined;

    return (
      <>
        <Table className={this.props.classes.userTable}>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className={this.props.classes.userAvatar}>
                    <PersonIcon />
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" component="div">
                    {user.name}
                  </Typography>
                  <Typography variant="caption" component="div">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
                <TableCell>{this.renderPermissions(user)}</TableCell>
                <TableCell>
                  {user.locked ? (
                    <Avatar>
                      <LockIcon />
                    </Avatar>
                  ) : null}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(event) =>
                      this.setState({
                        selection: {
                          user: user,
                          existingEmails: new Set<string>(),
                          popperAnchorEl: event.currentTarget,
                        },
                      })
                    }
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Popper
          open={isPopperOpen}
          anchorEl={this.state.selection?.popperAnchorEl}
          transition
          placement="right-start"
          disablePortal={false}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: "left" }}>
              <Paper className={this.props.classes.paper}>
                <ClickAwayListener
                  onClickAway={() => this.setState({ selection: undefined })}
                >
                  <List className={this.props.classes.noPadding}>
                    <ListItem button onClick={() => this.onEditUserClick()}>
                      Edit
                    </ListItem>
                    <Divider className={this.props.classes.divider} />
                    <ListItem button onClick={() => this.onRemoveUserClick()}>
                      Remove
                    </ListItem>
                  </List>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <UserEditDialog
          isOpen={
            this.state.selection !== undefined &&
            this.state.selection.popperAnchorEl === undefined
          }
          data={this.state.selection?.user}
          authUser={this.context}
          existingEmails={
            this.state.selection?.existingEmails || new Set<string>()
          }
          onUpdate={(data) => this.onUserEditDialogUpdate(data)}
          onClose={() => this.onUserEditDialogClose()}
        />
        <ConfirmDialog
          isOpen={this.state.isRemoveConfirmationOpen}
          confirmationMessage={this.renderConfirmationMessage()}
          confirmTitle="Yes"
          cancelTitle="No"
          onConfirm={() => this.onRemoveUserConfirm()}
          onClose={() => this.onRemoveUserCancel()}
        />
      </>
    );
  }

  private renderPermissions(user: User): React.ReactNode {
    const permissionCount = Object.getOwnPropertyNames(permissions)
      .map((key) => (permissions as any)[key] as number)
      .reduce(
        (previous, current) =>
          previous + ((user.permissions & current) > 0 ? 1 : 0),
        0
      );

    const label = permissionCount === 1 ? "Permission" : "Permissions";

    return (
      <Chip
        label={label}
        avatar={<Avatar>{permissionCount}</Avatar>}
        size="small"
      />
    );
  }

  private renderConfirmationMessage(): React.ReactNode {
    if (this.state.removeConfirmationUserName === "yourself") {
      return (
        <>
          Are you sure you want to remove{" "}
          <strong>{this.state.removeConfirmationUserName}</strong>?
        </>
      );
    }
    return `Are you sure you want to remove user ${this.state.removeConfirmationUserName}?`;
  }

  private onUserEditDialogUpdate(data: User) {
    this.setState({ loadStatus: -1 });
    const authUser: AuthUser = this.context;
    ApiDataLoader.shared.saveUser(data, (status, user, message) => {
      const statusMessageText =
        status === LoadStatus.SUCCESS
          ? "User has been saved successfully"
          : message;
      const statusMessage =
        statusMessageText !== undefined
          ? { type: status, text: statusMessageText }
          : undefined;

      if (data.email === authUser.email) {
        this.context.updateAuthUser(data.name, data.email, data.permissions);
      }

      this.setState((state) => {
        const newData = Array.from(state.data);
        let newSelection =
          status === LoadStatus.SUCCESS ? undefined : state.selection;
        if (status === LoadStatus.SUCCESS && user !== undefined) {
          const index = newData.findIndex((u) => u.id === user.id);
          if (index >= 0) {
            newData.splice(index, 1, user);
          } else {
            newData.unshift(user);
          }
        }
        const newFilteredData =
          state.filteredData === undefined
            ? undefined
            : UserList.getFilteredData(newData, state.filterText);
        return {
          loadStatus: status,
          data: newData,
          statusMessage: statusMessage,
          selection: newSelection,
          filteredData: newFilteredData,
        };
      });
    });
  }

  private onUserEditDialogClose() {
    this.setState({ selection: undefined });
  }

  private onAddUserClick(): void {
    this.setState((state) => {
      const existingEmails = new Set<string>(state.data.map((d) => d.email));
      const selection: Selection = {
        user: UserFormData.create().toData(),
        existingEmails: existingEmails,
      };
      return { selection: selection };
    });
  }

  private onEditUserClick(): void {
    this.setState((state) => {
      if (state.selection === undefined) {
        return { selection: undefined };
      }
      const selectedId = state.selection.user.id;
      const existingEmails = new Set<string>(
        state.data.filter((d) => d.id !== selectedId).map((d) => d.email)
      );
      const selection: Selection = {
        user: state.selection.user,
        existingEmails: existingEmails,
      };
      return { selection: selection };
    });
  }

  private onRemoveUserClick(): void {
    //this.setState({selection: undefined});
    this.setState((state) => {
      if (state.selection?.user !== undefined) {
        const removeConfirmationUserName =
          state.selection.user.email === this.context.email
            ? "yourself"
            : state.selection.user.name;
        return {
          selection: state.selection,
          isRemoveConfirmationOpen: true,
          removeConfirmationUserName: removeConfirmationUserName,
        };
      }
      return {
        selection: undefined,
        isRemoveConfirmationOpen: false,
        removeConfirmationUserName: undefined,
      };
    });
  }

  private onRemoveUserConfirm(): void {
    const id = this.state.selection?.user.id;
    const email = this.state.selection?.user.email;
    if (id === undefined || id === 0) {
      this.onRemoveUserCancel();
      return;
    }
    this.setState({
      loadStatus: -1,
      isRemoveConfirmationOpen: false,
      selection: undefined,
    });
    ApiDataLoader.shared.deleteUser(id, (status, message) => {
      const statusMessageText =
        status === LoadStatus.SUCCESS
          ? "User has been removed successfully"
          : message;
      const statusMessage =
        statusMessageText !== undefined
          ? { type: status, text: statusMessageText }
          : undefined;

      if (email === this.context.email) {
        this.context.updateAuthUser("", "", -1);
      }

      this.setState((state) => {
        const newData =
          status === LoadStatus.SUCCESS
            ? state.data.filter((u) => u.id !== id)
            : state.data;
        const newFilteredData =
          state.filteredData === undefined
            ? undefined
            : UserList.getFilteredData(newData, state.filterText);
        return {
          loadStatus: status,
          data: newData,
          statusMessage: statusMessage,
          filteredData: newFilteredData,
        };
      });
    });
  }

  private onRemoveUserCancel(): void {
    this.setState({ selection: undefined, isRemoveConfirmationOpen: false });
  }

  private onSnackBarClose(): void {
    this.setState({ statusMessage: undefined });
  }

  private onFilterTextChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState((state) => {
      const newFilteredData = UserList.getFilteredData(state.data, value);
      return { filterText: value, filteredData: newFilteredData };
    });
  }

  private static getFilteredData(
    data: User[],
    filteredText: string
  ): User[] | undefined {
    if (filteredText.length === 0) {
      return undefined;
    }
    return data.filter(
      (u) =>
        u.name.indexOf(filteredText) >= 0 || u.email.indexOf(filteredText) >= 0
    );
  }
}

UserList.contextType = AuthUserContext;

export default withStyles(styles)(UserList);
