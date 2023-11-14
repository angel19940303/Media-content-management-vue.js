import React, { createRef } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    items: {
      zIndex: 1000,
    },
  });

interface RProps extends WithStyles<typeof styles> {
  items: Array<MultipleChoiceButtonItem>;
  onSelect?: (value: number) => void;
}

interface RState {
  isOpen: boolean;
}

interface MultipleChoiceButtonItem {
  value: number;
  content: React.ReactNode;
}

class MultipleChoiceButton extends React.Component<RProps, RState> {
  private readonly anchorRef: any;

  constructor(props: RProps) {
    super(props);
    this.state = { isOpen: false };
    this.anchorRef = createRef<HTMLDivElement>();
  }

  render(): React.ReactNode {
    if (this.props.items.length === 0) {
      return "";
    }
    return (
      <>
        <IconButton
          onMouseDown={() => this.handleMainButtonClick()}
          ref={this.anchorRef}
        >
          {this.props.children}
        </IconButton>
        <Popper
          open={this.state.isOpen}
          anchorEl={this.anchorRef.current}
          role={undefined}
          className={this.props.classes.items}
        >
          <Paper>
            <ClickAwayListener
              mouseEvent="onMouseDown"
              onClickAway={() => this.handleClose()}
            >
              {this.renderMenuList()}
            </ClickAwayListener>
          </Paper>
        </Popper>
      </>
    );
  }

  private renderMenuList(): React.ReactNode {
    return (
      <MenuList id="split-button-menu">
        {this.props.items.map((item, index) => (
          <MenuItem
            key={item.value}
            onClick={() => this.handleItemButtonClick(item.value)}
          >
            {item.content}
          </MenuItem>
        ))}
      </MenuList>
    );
  }

  private handleMainButtonClick(): void {
    if (this.props.items.length === 1 && this.props.onSelect) {
      this.props.onSelect(this.props.items[0].value);
    } else if (this.props.items.length > 1) {
      const isOpen = this.state.isOpen;
      this.setState({ isOpen: !isOpen });
    }
  }

  private handleItemButtonClick(value: number): void {
    if (this.props.onSelect) {
      this.props.onSelect(value);
    }
    this.handleClose();
  }

  private handleClose(): void {
    this.setState({ isOpen: false });
  }
}

export default withStyles(styles)(MultipleChoiceButton);
