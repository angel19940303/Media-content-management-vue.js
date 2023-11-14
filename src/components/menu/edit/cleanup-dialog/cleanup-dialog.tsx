import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { ApiDataLoader } from "../../../../api/api-data-loader";
import { LoadStatus } from "../../../../models/enums/load_status";
import { MenuItemList } from "../../../../models/menu/menu-item-list";
import { MenuCleanupUtil } from "../../../../utils/menu-cleanup-util";
import LoadingIndicator from "../../../common/loading-indicator";
import Typography from "@material-ui/core/Typography";
import { MenuItemType } from "../../../../models/enums/menu-item-type";

const styles = (theme: Theme) =>
  createStyles({
    body: {},
  });

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  sport: string;
  menu: MenuItemList;
  onApply?: (menu: MenuItemList) => void;
  onClose?: () => void;
}

interface RState {
  isLoading: boolean;
  isError: boolean;
  data: MenuCleanupUtil;
  errorMessage?: string;
}

class CleanupDialog extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      data: new MenuCleanupUtil().withMenu(this.props.menu),
    };
  }

  componentDidMount() {
    ApiDataLoader.shared.loadSportStages(
      this.props.sport,
      (status, result, message) => {
        if (status === LoadStatus.SUCCESS) {
          this.setState((state) => {
            return { isLoading: false, data: state.data.withData(result) };
          });
        } else {
          this.setState({
            isLoading: false,
            isError: true,
            errorMessage: message,
          });
        }
      }
    );
  }

  render(): React.ReactNode {
    return (
      <Dialog
        maxWidth={"sm"}
        fullWidth={true}
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="edit-mapping-dialog-title">
          Cleanup outdated items
        </DialogTitle>
        <DialogContent className={this.props.classes.body} dividers>
          {this.renderContent()}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.onApply()}>
            Apply
          </Button>
          <Button onClick={() => this.onClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderContent(): React.ReactNode {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    if (this.state.isError) {
      return (
        <div>
          <Typography>An error occurred while loading data</Typography>
          <Typography>{this.state.errorMessage || "Unknown error"}</Typography>)
        </div>
      );
    }

    const removedItems = this.state.data.removedItems();
    const removedCategories = removedItems.get(MenuItemType.CATEGORY) || [];
    const removedStages = removedItems.get(MenuItemType.STAGE) || [];
    const removedSeasons = removedItems.get(MenuItemType.SEASON) || [];
    const removedItemCount =
      removedCategories.length + removedStages.length + removedSeasons.length;
    return (
      <div>
        <Typography>{`${this.titleForType(
          MenuItemType.UNKNOWN,
          removedItemCount
        )} will be cleaned up`}</Typography>
        <br />
        {this.renderItemList(MenuItemType.CATEGORY, removedCategories)}
        {this.renderItemList(MenuItemType.STAGE, removedStages)}
        {this.renderItemList(MenuItemType.SEASON, removedSeasons)}
      </div>
    );
  }

  private renderItemList(type: number, items: string[]): React.ReactNode {
    if (items.length === 0) {
      return null;
    }
    return (
      <>
        <Typography>{this.titleForType(type, items.length)}</Typography>
        <ul>
          {items.map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
      </>
    );
  }

  private titleForType(type: number, count: number): string {
    switch (type) {
      case MenuItemType.CATEGORY:
        return `${count} ${count === 1 ? "category" : "categories"}`;
      case MenuItemType.STAGE:
        return `${count} ${count === 1 ? "stage" : "stages"}`;
      case MenuItemType.SEASON:
        return `${count} ${count === 1 ? "season" : "seasons"}`;
      default:
        return `${count} ${count === 1 ? "item" : "items"}`;
    }
  }

  private onApply(): void {
    if (this.props.onApply) {
      this.props.onApply(this.state.data.cleanedUpMenu());
    }
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

export default withStyles(styles)(CleanupDialog);
