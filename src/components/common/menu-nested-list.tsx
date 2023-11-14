import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import React from "react";
import { MenuItem } from "../../models/menu/menu-item";
import { MenuItemType } from "../../models/enums/menu-item-type";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {
  Checkbox,
  IconButton,
  List,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import MenuListItem from "@material-ui/core/ListItem";
import { FixedSizeList } from "react-window";
import { ConfigUtil } from "../../utils/config-util";

const styles = (theme: Theme) =>
  createStyles({
    noPadding: {
      padding: 0,
    },
    stageTeamDialogSubMenuItem: {
      backgroundColor: theme.palette.grey["100"],
    },
  });

interface RProps extends WithStyles<typeof styles> {
  data: Array<MenuItem>;
  selectedIds: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

interface RState {
  expandedMenuItems: Set<string>;
}

class MenuNestedList extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = { expandedMenuItems: new Set<string>() };
  }

  render(): React.ReactNode {
    const data = this.dataToRender();
    const renderRow = (props: any) => {
      const item = data[props.index];
      const key = item.id;
      return (
        <div key={key} style={props.style}>
          {this.renderMenuRow(item)}
        </div>
      );
    };
    return (
      <List dense className={this.props.classes.noPadding}>
        <FixedSizeList
          itemCount={data.length}
          itemSize={40}
          width="100%"
          height={400}
        >
          {renderRow}
        </FixedSizeList>
      </List>
    );
  }

  private dataToRender(): Array<MenuItem> {
    const data = new Array<MenuItem>();
    this.props.data.forEach((item) => {
      data.push(item);
      if (
        item.id !== undefined &&
        this.state.expandedMenuItems.has(item.id) &&
        item.children !== undefined
      ) {
        data.push(...item.children);
      }
    });
    return data;
  }

  private renderMenuRow(item: MenuItem): React.ReactNode {
    let collapseExpandButton: React.ReactNode = undefined;
    let className =
      item.type === MenuItemType.CATEGORY
        ? ""
        : this.props.classes.stageTeamDialogSubMenuItem;
    if (item.type === MenuItemType.CATEGORY && item.id !== undefined) {
      const icon = this.state.expandedMenuItems.has(item.id) ? (
        <KeyboardArrowUpIcon />
      ) : (
        <KeyboardArrowDownIcon />
      );
      collapseExpandButton = (
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="comments"
            onClick={() => this.onCollapseExpand(item)}
          >
            {icon}
          </IconButton>
        </ListItemSecondaryAction>
      );
    }
    return (
      <MenuListItem className={className}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={this.isItemSelected(item)}
            disableRipple
            onChange={() => this.onCheckboxChange(item)}
          />
        </ListItemIcon>
        <ListItemText
          primary={item.name.locale.get(ConfigUtil.defaultLanguage())?.value}
        />
        {collapseExpandButton}
      </MenuListItem>
    );
  }

  private isItemSelected(item: MenuItem): boolean {
    if (item.type === MenuItemType.STAGE && item.id !== undefined) {
      return this.props.selectedIds.has(item.id);
    }
    if (item.type === MenuItemType.CATEGORY) {
      let isSelected = true;
      if (item.children !== undefined) {
        for (let i = 0; i < item.children.length; i++) {
          if (!this.isItemSelected(item.children[i])) {
            isSelected = false;
            break;
          }
        }
      }
      return isSelected;
    }
    return false;
  }

  private onCheckboxChange(item: MenuItem): void {
    if (item.id === undefined || this.props.onSelectionChange === undefined) {
      return;
    }
    const newSelectedIds = new Set<string>(this.props.selectedIds);
    if (item.type === MenuItemType.STAGE) {
      const id = item.id;
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
    } else if (item.type === MenuItemType.CATEGORY) {
      const children = item.children;
      const isSelected = this.isItemSelected(item);
      if (children !== undefined) {
        children.forEach((child) => {
          if (child.id === undefined) {
            return;
          }
          if (isSelected) {
            newSelectedIds.delete(child.id);
          } else {
            newSelectedIds.add(child.id);
          }
        });
      }
    }
    this.props.onSelectionChange(newSelectedIds);
  }

  private onCollapseExpand(item: MenuItem): void {
    if (item.id !== undefined && item.type === MenuItemType.CATEGORY) {
      const id = item.id;
      this.setState((state) => {
        const newExpandedMenuItems = new Set<string>(state.expandedMenuItems);
        if (newExpandedMenuItems.has(id)) {
          newExpandedMenuItems.delete(id);
        } else {
          newExpandedMenuItems.add(id);
        }
        return { expandedMenuItems: newExpandedMenuItems };
      });
    }
  }
}

export default withStyles(styles)(MenuNestedList);
