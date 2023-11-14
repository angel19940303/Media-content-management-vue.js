import React, { ChangeEvent, FormEvent } from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { User } from "../../models/user/user";
import { UserFormData } from "../../models/ui/user-form-data";
import Grid from "@material-ui/core/Grid";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Switch,
  TextField,
} from "@material-ui/core";
import { permissions } from "../routing";
import { AuthUser } from "../login/auth-user-context";

const styles = (theme: Theme) =>
  createStyles({
    noPadding: {
      paddingLeft: 0,
      paddingRight: 0,
      overflow: "hidden",
    },
    checkbox: {
      padding: "5px 10px",
    },
    section: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      "&:first-child": {
        paddingBottom: 8,
      },
    },
    divider: {
      backgroundColor: theme.palette.divider,
    },
  });

interface RProps extends WithStyles<typeof styles> {
  data: User;
  authUser: AuthUser;
  existingEmails: Set<string>;
  onUpdate?: (data: User) => void;
  onClose?: () => void;
}

interface RState {
  formData: UserFormData;
}

class UserEditDialogContent extends React.PureComponent<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = { formData: UserFormData.create(props.data) };
  }

  render(): React.ReactNode {
    const title =
      (this.state.formData.id !== undefined && this.state.formData.id > 0
        ? "Edit"
        : "Add") + " User";
    return (
      <form onSubmit={(event) => this.onSubmit(event)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers className={this.props.classes.noPadding}>
          {this.renderContent()}
        </DialogContent>
        <DialogActions>
          <Button color="primary" type="submit">
            Save
          </Button>
          <Button onClick={() => this.onClose()} color="default">
            Cancel
          </Button>
        </DialogActions>
      </form>
    );
  }

  private renderContent(): React.ReactNode {
    return (
      <>
        {this.renderUserDetails()}
        {this.renderAdminSwitch()}
        {this.renderPermissions()}
      </>
    );
  }

  private renderUserDetails(): React.ReactNode {
    if (this.props.data.id <= 0) {
      return this.renderNewUserDetails();
    }
    return this.renderExistingUserDetails();
  }

  private renderNewUserDetails(): React.ReactNode {
    return (
      <>
        <Grid container spacing={2} className={this.props.classes.section}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="User name"
              onChange={(event) => this.onUserNameChange(event)}
              error={!this.state.formData.validation.isUserNameValid}
              helperText={this.state.formData.validation
                .getUserNameErrors()
                .join(", ")}
            />
          </Grid>
          {this.renderEditableUserFields()}
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Password"
              type="password"
              onChange={(event) => this.onPasswordChange(event)}
              error={!this.state.formData.validation.isPasswordValid}
              helperText={this.state.formData.validation
                .getPasswordErrors()
                .join(", ")}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Verify password"
              type="password"
              onChange={(event) => this.onSecondPasswordChange(event)}
              error={!this.state.formData.validation.isSecondPasswordValid}
              helperText={this.state.formData.validation
                .getSecondPasswordErrors()
                .join(", ")}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Divider className={this.props.classes.divider} />
          </Grid>
        </Grid>
      </>
    );
  }

  private renderReadOnlyUserFields(): React.ReactNode {
    return (
      <>
        <Grid item xs={12}>
          <Typography variant="caption" component="div">
            Name:
          </Typography>
          <Typography variant="body1" component="div">
            {this.state.formData.name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" component="div">
            E-mail:
          </Typography>
          <Typography variant="body1" component="div">
            {this.state.formData.email}
          </Typography>
        </Grid>
      </>
    );
  }

  private renderEditableUserFields(): React.ReactNode {
    return (
      <>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Name"
            value={this.state.formData.name}
            onChange={(event) => this.onNameChange(event)}
            error={!this.state.formData.validation.isNameValid}
            helperText={this.state.formData.validation
              .getNameErrors()
              .join(", ")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="E-mail"
            value={this.state.formData.email}
            onChange={(event) => this.onEmailChange(event)}
            error={!this.state.formData.validation.isEmailValid}
            helperText={this.state.formData.validation
              .getEmailErrors()
              .join(", ")}
          />
        </Grid>
      </>
    );
  }

  private renderExistingUserDetails(): React.ReactNode {
    const isAuthUser = this.props.data.email === this.props.authUser.email;
    return (
      <>
        <Grid container spacing={2} className={this.props.classes.section}>
          <Grid item xs={12}>
            <Typography variant="caption" component="div">
              User name:
            </Typography>
            <Typography variant="body1" component="div">
              {this.state.formData.userName}
            </Typography>
          </Grid>
          {isAuthUser
            ? this.renderEditableUserFields()
            : this.renderReadOnlyUserFields()}
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Divider className={this.props.classes.divider} />
          </Grid>
        </Grid>
      </>
    );
  }

  private renderAdminSwitch(): React.ReactNode {
    const isAuthUser = this.props.data.email === this.props.authUser.email;
    return (
      <>
        <Grid container spacing={2} className={this.props.classes.section}>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.formData.isAdmin}
                  disabled={isAuthUser}
                  onChange={() =>
                    this.setState((state) => ({
                      formData: state.formData.withIsAdmin(
                        !state.formData.isAdmin
                      ),
                    }))
                  }
                  color="primary"
                />
              }
              label="Admin"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  disabled={isAuthUser}
                  checked={this.state.formData.locked}
                  onChange={() =>
                    this.setState((state) => ({
                      formData: state.formData.withLocked(
                        !state.formData.locked
                      ),
                    }))
                  }
                  color="primary"
                />
              }
              label="Locked"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Divider className={this.props.classes.divider} />
          </Grid>
        </Grid>
      </>
    );
  }

  private renderPermissions(): React.ReactNode {
    const isAuthUser = this.props.data.email === this.props.authUser.email;
    return (
      <>
        <Grid container spacing={2} className={this.props.classes.section}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" component="div">
              Permissions:
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={this.props.classes.section}>
          <Grid item xs={6}>
            {this.renderPermission(permissions.PermUser, "User", isAuthUser)}
          </Grid>
          <Grid item xs={6}>
            {this.renderPermission(
              permissions.PermUserAdmin,
              "User Admin",
              isAuthUser
            )}
          </Grid>
          <Grid item xs={6}>
            {this.renderPermission(
              permissions.PermFlowEditor,
              "Flow Editor",
              isAuthUser
            )}
          </Grid>
          <Grid item xs={6}>
            {this.renderPermission(
              permissions.PermEnumsAdmin,
              "Enums Admin",
              isAuthUser
            )}
          </Grid>
          <Grid item xs={6}>
            {this.renderPermission(
              permissions.PermCompanyAccountAdmin,
              "Company Account Admin",
              isAuthUser
            )}
          </Grid>
          <Grid item xs={6}>
            {this.renderPermission(
              permissions.PermCompanyAccountUser,
              "Company Account User",
              isAuthUser
            )}
          </Grid>
          <Grid item xs={6}>
            {this.renderPermission(
              permissions.PermLocalizedEnumsAdmin,
              "Localized Enums Admin",
              isAuthUser
            )}
          </Grid>
          <Grid item xs={6}>
            {this.renderPermission(
              permissions.PermFlowAdmin,
              "Flow Admin",
              isAuthUser
            )}
          </Grid>
          <Grid item xs={6}>
            {this.renderPermission(
              permissions.PermMenuAdmin,
              "Menu Admin",
              isAuthUser
            )}
          </Grid>
          <Grid item xs={6}>
            {this.renderPermission(
              permissions.PermNewsAdmin,
              "News Admin",
              isAuthUser
            )}
          </Grid>
          <Grid item xs={6}>
            {this.renderPermission(
              permissions.PermNewsEditor,
              "News Editor",
              isAuthUser
            )}
          </Grid>
          <Grid item xs={6}>
            {this.renderPermission(
              permissions.PermVideoEditor,
              "Video Editor",
              isAuthUser
            )}
          </Grid>
          <Grid item xs={6}>
            {this.renderPermission(
              permissions.PermVideoAdmin,
              "Video Admin",
              isAuthUser
            )}
          </Grid>
          {this.state.formData.validation.arePermissionsValid ? null : (
            <Grid item xs={12}>
              <Typography variant="body2" component="div" color="error">
                {this.state.formData.validation
                  .getPermissionsErrors()
                  .join(", ")}
              </Typography>
            </Grid>
          )}
        </Grid>
      </>
    );
  }

  private renderPermission(
    permission: number,
    title: string,
    disabled: boolean
  ): React.ReactNode {
    return (
      <FormControlLabel
        control={
          <Checkbox
            className={this.props.classes.checkbox}
            checked={this.state.formData.hasPermission(permission)}
            disabled={disabled}
            onChange={() => this.onTogglePermission(permission)}
            color="primary"
            size="small"
          />
        }
        label={title}
      />
    );
  }

  private onTogglePermission(permission: number) {
    this.setState((state) => {
      const newPermissions = state.formData.hasPermission(permission)
        ? state.formData.permissions - permission
        : state.formData.permissions | permission;
      return { formData: state.formData.withPermissions(newPermissions) };
    });
  }

  private onUserNameChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState((state) => ({
      formData: state.formData.withUserName(value),
    }));
  }

  private onNameChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState((state) => ({ formData: state.formData.withName(value) }));
  }

  private onEmailChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState((state) => ({
      formData: state.formData.withEmail(value, this.props.existingEmails),
    }));
  }

  private onPasswordChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState((state) => ({
      formData: state.formData.withPassword(value),
    }));
  }

  private onSecondPasswordChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const value = event.target.value;
    this.setState((state) => ({
      formData: state.formData.withSecondPassword(value),
    }));
  }

  private onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.setState((state) => {
      const newFormData = state.formData.validated(this.props.existingEmails);
      if (newFormData.validation.isValid) {
        if (this.props.onUpdate) {
          this.props.onUpdate(newFormData.toData());
        }
      } else {
        console.log(newFormData.validation);
      }
      return { formData: newFormData };
    });
  }

  private onClose() {
    if (this.props.onClose !== undefined) {
      this.props.onClose();
    }
  }
}

export default withStyles(styles)(UserEditDialogContent);
