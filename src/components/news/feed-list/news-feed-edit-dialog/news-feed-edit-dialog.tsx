import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import { NewsFeedDataPayload } from "../../../../models/news/news-feed-data-payload";
import Dialog from "@material-ui/core/Dialog";
import NewsFeedEditDialogContent from "./news-feed-edit-dialog-content";
import { EnumList } from "../../../../models/common/enum-list";
import MasterError from "../../../master-error";

const styles = () =>
  createStyles({
    noPadding: {
      padding: "0",
    },
    narrow: {
      minWidth: "46px",
    },
    rightBorder: {
      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    },
    centerWrapper: {
      height: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  item?: NewsFeedDataPayload;
  enums?: EnumList;
  onUpdate?: (data: NewsFeedDataPayload) => void;
  onClose?: () => void;
}

class NewsFeedEditDialog extends React.Component<RProps, any> {
  render(): React.ReactNode {
    return (
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        aria-labelledby="add-mapping-dialog-title"
      >
        {this.renderContent()}
      </Dialog>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.props.item === undefined || this.props.enums === undefined) {
      return <MasterError type="unknown" />;
    }
    return (
      <NewsFeedEditDialogContent
        key={this.props.item.ID || -1}
        item={this.props.item}
        enums={this.props.enums}
        onUpdate={(data) => this.onUpdate(data)}
        onClose={() => this.onClose()}
      />
    );
  }

  private onUpdate(data: NewsFeedDataPayload): void {
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

export default withStyles(styles)(NewsFeedEditDialog);
