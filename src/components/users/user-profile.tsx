import React, { ChangeEvent, FormEvent } from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { ApiDataLoader } from "../../api/api-data-loader";
import { LoadStatus } from "../../models/enums/load_status";
import { Redirect } from "react-router-dom";
import { Routes } from "../routing";
import MasterError from "../master-error";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { User } from "../../models/user/user";
import { Avatar, Button, TextField } from "@material-ui/core";
import { TextUtil } from "../../utils/text-util";
import { PasswordChangeFormData } from "../../models/ui/password-change-form-data";
import StatusSnackBar, { StatusMessage } from "../common/status-snack-bar";
import { UserFormData } from "../../models/ui/user-form-data";
import EditableValueField from "../common/editable-value-field";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: 936,
      margin: "auto",
      marginBottom: 16,
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
      margin: 16,
    },
    smallIcon: {
      fontSize: 18,
    },
  });

interface RProps extends WithStyles<typeof styles> {}

interface RState {
  loadStatus: number;
  data?: User;
  userFormData?: UserFormData;
  isEditingEmail?: boolean;
  passwordChangeData?: PasswordChangeFormData;
  statusMessage?: StatusMessage;
}

class UserProfile extends React.PureComponent<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = { loadStatus: -1 };
  }

  componentDidMount(): void {
    ApiDataLoader.shared.loggedInWithPermissions((status, user) => {
      this.setState({ loadStatus: status, data: user });
    });
  }

  render(): React.ReactNode {
    if (this.state.loadStatus === LoadStatus.UNAUTHENTICATED) {
      return <Redirect to={Routes.Login} />;
    }
    if (this.state.loadStatus === LoadStatus.UNAUTHORIZED) {
      return <MasterError type="unauthorized" />;
    }
    return this.renderContent();
  }

  private renderContent(): React.ReactNode {
    if (this.state.loadStatus < 0) {
    }
    if (this.state.loadStatus === LoadStatus.FAILURE) {
      return <MasterError type="unknown" />;
    }
    const classes = this.props.classes;
    const isStatusSnackBarOpen = this.state.statusMessage !== undefined;
    return (
      <>
        <Paper className={classes.paper}>
          <div className={classes.contentWrapper}>
            <Grid container spacing={2} alignItems="center">
              {this.renderBasicInfoContent()}
            </Grid>
          </div>
        </Paper>
        <Paper className={classes.paper}>
          <div className={classes.contentWrapper}>
            <Grid container spacing={2}>
              {this.renderContactInfoContent()}
            </Grid>
          </div>
        </Paper>
        <Paper className={classes.paper}>
          <div className={classes.contentWrapper}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" component="div">
                  Password
                </Typography>
              </Grid>
              {this.renderPasswordContent()}
            </Grid>
          </div>
        </Paper>
        <StatusSnackBar
          isOpen={isStatusSnackBarOpen}
          message={this.state.statusMessage}
          onClose={() => this.onStatusSnackBarClose()}
        />
      </>
    );
  }

  private renderBasicInfoContent(): React.ReactNode {
    return (
      <>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            Basic info
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="caption" component="div">
            User Name
          </Typography>
          <Typography variant="body1" component="div">
            {this.state.data?.userName}
          </Typography>
        </Grid>
        <Grid item xs>
          <EditableValueField
            label="Name"
            labelWidth={44}
            value={
              this.state.userFormData
                ? this.state.userFormData.name
                : this.state.data?.name
            }
            errorMessage={
              this.state.userFormData?.validation.isNameValid === true
                ? undefined
                : this.state.userFormData?.validation.nameErrors.join(", ")
            }
            isEditing={
              this.state.userFormData !== undefined &&
              this.state.isEditingEmail !== true
            }
            onChange={(event) => this.onNameChange(event)}
            onSubmit={(event) => this.onUserDataSubmit(event)}
            onEdit={() => this.onDetailEditClick(false)}
            onCancel={() => this.onDetailEditCancelClick()}
          />
        </Grid>
        <Grid item>
          <Avatar>
            {TextUtil.nameToInitials(this.state.data?.name || "")}
          </Avatar>
        </Grid>
      </>
    );
  }

  private renderContactInfoContent(): React.ReactNode {
    return (
      <>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            Contact info
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <EditableValueField
            label="Email"
            labelWidth={46}
            value={
              this.state.userFormData
                ? this.state.userFormData.email
                : this.state.data?.email
            }
            errorMessage={
              this.state.userFormData?.validation.isEmailValid === true
                ? undefined
                : this.state.userFormData?.validation.emailErrors.join(", ")
            }
            isEditing={
              this.state.userFormData !== undefined &&
              this.state.isEditingEmail === true
            }
            onChange={(event) => this.onEmailChange(event)}
            onSubmit={(event) => this.onUserDataSubmit(event)}
            onEdit={() => this.onDetailEditClick(true)}
            onCancel={() => this.onDetailEditCancelClick()}
          />
        </Grid>
      </>
    );
  }

  private renderPasswordContent(): React.ReactNode {
    if (this.state.passwordChangeData === undefined) {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={() => this.onPasswordChangeClick()}
            >
              Change password
            </Button>
          </Grid>
        </Grid>
      );
    }
    return (
      <form onSubmit={(event) => this.onPasswordChangeSubmit(event)}>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <TextField
              variant="outlined"
              size="small"
              type="password"
              label="Old password"
              fullWidth
              value={this.state.passwordChangeData.oldPassword}
              onChange={(event) => this.onOldPasswordChange(event)}
              error={
                !this.state.passwordChangeData.validation.isOldPasswordValid
              }
              helperText={this.state.passwordChangeData.validation
                .getOldPasswordErrors()
                .join(", ")}
            />
          </Grid>
          <Grid item sm={6} />
          <Grid item sm={6} xs={12}>
            <TextField
              variant="outlined"
              size="small"
              type="password"
              label="New password"
              fullWidth
              value={this.state.passwordChangeData.newPassword}
              onChange={(event) => this.onNewPasswordChange(event)}
              error={
                !this.state.passwordChangeData.validation.isNewPasswordValid
              }
              helperText={this.state.passwordChangeData.validation
                .getNewPasswordErrors()
                .join(", ")}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              variant="outlined"
              size="small"
              type="password"
              label="Verify new password"
              fullWidth
              value={this.state.passwordChangeData?.secondPassword}
              onChange={(event) => this.onSecondPasswordChange(event)}
              error={
                !this.state.passwordChangeData?.validation.isSecondPasswordValid
              }
              helperText={this.state.passwordChangeData.validation
                .getSecondPasswordErrors()
                .join(", ")}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Change
            </Button>
            &nbsp;
            <Button
              variant="contained"
              onClick={() => this.onPasswordChangeCancelClick()}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }

  private onDetailEditClick(isEmailEdit: boolean): void {
    this.setState((state) => {
      return {
        userFormData: UserFormData.create(state.data),
        isEditingEmail: isEmailEdit,
        passwordChangeData: undefined,
      };
    });
  }

  private onDetailEditCancelClick(): void {
    this.setState({ userFormData: undefined, isEditingEmail: false });
  }

  private onPasswordChangeClick(): void {
    this.setState((state) => {
      if (state.data === undefined) {
        return { passwordChangeData: undefined };
      }
      return {
        userFormData: undefined,
        isEditingEmail: undefined,
        passwordChangeData: PasswordChangeFormData.create(state.data.email),
      };
    });
  }

  private onPasswordChangeCancelClick(): void {
    this.setState({ passwordChangeData: undefined });
  }

  private onUserDataSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (this.state.userFormData === undefined) {
      return;
    }
    const validatedUserFormData = this.state.userFormData.validated(
      new Set<string>()
    );
    if (validatedUserFormData.validation.isValid) {
      this.setState({ loadStatus: -1 });
      ApiDataLoader.shared.saveUser(
        validatedUserFormData.toData(),
        (status, user, message) => {
          const statusMessageText =
            status === LoadStatus.SUCCESS
              ? "User profile updated successfully"
              : message;
          const statusMessage =
            statusMessageText === undefined
              ? undefined
              : { type: status, text: statusMessageText };
          const newUserFormData =
            status === LoadStatus.SUCCESS ? undefined : validatedUserFormData;
          this.setState((state) => ({
            loadStatus: status,
            isEditingEmail:
              state.isEditingEmail && status !== LoadStatus.SUCCESS,
            data: user,
            userFormData: newUserFormData,
            statusMessage: statusMessage,
          }));
        }
      );
    } else {
      this.setState({ userFormData: validatedUserFormData });
    }
  }

  private onPasswordChangeSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (this.state.passwordChangeData === undefined) {
      return;
    }
    const validatedPasswordChangeData = this.state.passwordChangeData.validated();
    if (validatedPasswordChangeData.validation.isValid) {
      this.setState({ loadStatus: -1 });
      ApiDataLoader.shared.changePassword(
        validatedPasswordChangeData.toData(),
        (status, message) => {
          const statusMessageText =
            status === LoadStatus.SUCCESS
              ? "Password changed successfully"
              : message;
          const statusMessage =
            statusMessageText === undefined
              ? undefined
              : { type: status, text: statusMessageText };
          const newPasswordChangeData =
            status === LoadStatus.SUCCESS
              ? undefined
              : validatedPasswordChangeData;
          this.setState({
            loadStatus: status,
            passwordChangeData: newPasswordChangeData,
            statusMessage: statusMessage,
          });
        }
      );
    } else {
      this.setState({ passwordChangeData: validatedPasswordChangeData });
    }
  }

  private onStatusSnackBarClose() {
    this.setState({ statusMessage: undefined });
  }

  private onNameChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState((state) => ({
      userFormData: state.userFormData?.withName(value),
    }));
  }

  private onEmailChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState((state) => ({
      userFormData: state.userFormData?.withEmail(value, new Set<string>()),
    }));
  }

  private onOldPasswordChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState((state) => ({
      passwordChangeData: state.passwordChangeData?.withOldPassword(value),
    }));
  }

  private onNewPasswordChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState((state) => ({
      passwordChangeData: state.passwordChangeData?.withNewPassword(value),
    }));
  }

  private onSecondPasswordChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState((state) => ({
      passwordChangeData: state.passwordChangeData?.withSecondPassword(value),
    }));
  }
}

export default withStyles(styles)(UserProfile);
