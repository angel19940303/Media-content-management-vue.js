import React from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import CreateMenuPopper from "../../../components/menu/list/create-menu-popper/create-menu-popper";
import { MenuDataPayload } from "../../../models/menu/menu-data-payload";
import MenuPublisherButton from "../../../components/menu/list/menu-publisher-button/menu-publisher-button";
import {
  BaseMenuList,
  BaseMenuListProps,
  BaseMenuListState,
  baseMenuListStyles,
} from "../../../components/menu/list/base-menu-list";

class ContentMenuStructure extends BaseMenuList<
  BaseMenuListProps,
  BaseMenuListState
> {
  constructor(props: BaseMenuListProps) {
    super(props);
    this.state = BaseMenuList.initialState();
  }

  renderItemActions(item: MenuDataPayload): React.ReactNode {
    return (
      <IconButton href={"/#/content/menu-structure/edit/" + item.id}>
        <EditIcon />
      </IconButton>
    );
  }

  renderToolbarActions(): React.ReactNode {
    return (
      <>
        <CreateMenuPopper menuData={this.state.data} />
        <MenuPublisherButton />
      </>
    );
  }
}

export default withStyles(baseMenuListStyles)(ContentMenuStructure);
