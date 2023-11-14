import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { MenuDataPayload } from "../../../models/menu/menu-data-payload";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import {
  BaseMenuList,
  BaseMenuListProps,
  BaseMenuListState,
  baseMenuListStyles,
} from "../../../components/menu/list/base-menu-list";
import MenuPublisherButton from "../../../components/menu/list/menu-publisher-button/menu-publisher-button";

class LocOverview extends BaseMenuList<BaseMenuListProps, BaseMenuListState> {
  constructor(props: BaseMenuListProps) {
    super(props);
    this.state = BaseMenuList.initialState();
  }

  renderItemActions(item: MenuDataPayload): React.ReactNode {
    return (
      <IconButton href={"/#/content/loc-overview/edit/" + item.id}>
        <EditIcon />
      </IconButton>
    );
  }

  renderToolbarActions(): React.ReactNode {
    return <MenuPublisherButton />;
  }
}

export default withStyles(baseMenuListStyles)(LocOverview);
