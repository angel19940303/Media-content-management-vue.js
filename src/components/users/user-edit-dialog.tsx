import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { User } from "../../models/user/user";
import { UserFormData } from "../../models/ui/user-form-data";
import { LoadStatus } from "../../models/enums/load_status";
import UserEditDialogContent from "./user-edit-dialog-content";
import Dialog from "@material-ui/core/Dialog";
import { AuthUser } from "../login/auth-user-context";

const styles = createStyles({});

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  data?: User;
  authUser: AuthUser;
  existingEmails: Set<string>;
  onUpdate?: (data: User) => void;
  onClose?: () => void;
}

interface RState {
  loadStatus: number;
  formData: UserFormData;
}

class UserEditDialog extends React.PureComponent<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      loadStatus: LoadStatus.SUCCESS,
      formData: UserFormData.create(props.data),
    };
  }

  render(): React.ReactNode {
    return (
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={this.props.isOpen}
        onClose={() => this.onClose()}
      >
        {this.renderContent()}
      </Dialog>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.props.data === undefined) {
      return null;
    }
    return (
      <UserEditDialogContent
        key={this.props.data.id}
        data={this.props.data}
        authUser={this.props.authUser}
        existingEmails={this.props.existingEmails}
        onUpdate={(data) => this.onUpdate(data)}
        onClose={() => this.onClose()}
      />
    );
  }

  private onUpdate(data: User): void {
    if (this.props.onUpdate) {
      this.props.onUpdate(data);
    }
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

export default withStyles(styles)(UserEditDialog);
