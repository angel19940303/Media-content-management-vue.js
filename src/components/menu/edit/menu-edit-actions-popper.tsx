import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { MenuEditAction } from "../../../models/enums/menu-edit-action";
import { AuthUserContext } from "../../login/auth-user-context";

const styles = () =>
  createStyles({
    actionsBar: {
      paddingBottom: 10,
      textAlign: "right",
      position: "absolute",
      top: 5,
      right: 30,
    },
    actionsPopup: {
      zIndex: 1200,
    },
    rootButton: {
      paddingRight: 8,
    },
  });

interface RProps extends WithStyles<typeof styles> {
  actions: Array<number>;
  onSelect?: (action: number) => void;
}

interface RState {
  anchorEl?: any;
}

class MenuEditActionsPopper extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    const isAdminUser = this.context.isAdmin;
    const isOpen = this.state.anchorEl !== undefined;
    const actions = this.props.actions.filter(
      (action) => !MenuEditAction.ADMIN_ALL.has(action) || isAdminUser
    );
    return (
      <div className={this.props.classes.actionsBar}>
        <Button
          className={this.props.classes.rootButton}
          onClick={(event) => this.setState({ anchorEl: event.currentTarget })}
        >
          Actions
          <ArrowDropDownIcon />
        </Button>
        <Popper
          open={isOpen}
          anchorEl={this.state.anchorEl}
          role={undefined}
          placement="bottom-end"
          transition
          disablePortal
          className={this.props.classes.actionsPopup}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={() => this.handleClose()}>
                  <MenuList id="split-button-menu">
                    {actions.map((action) => (
                      <MenuItem
                        key={action}
                        onClick={() => this.onActionClick(action)}
                      >
                        {MenuEditAction.titleForAction(action)}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }

  private handleClose(): void {
    this.setState({ anchorEl: undefined });
  }

  private onActionClick(action: number): void {
    this.handleClose();
    if (this.props.onSelect) {
      this.props.onSelect(action);
    }
  }
}

MenuEditActionsPopper.contextType = AuthUserContext;

export default withStyles(styles)(MenuEditActionsPopper);
