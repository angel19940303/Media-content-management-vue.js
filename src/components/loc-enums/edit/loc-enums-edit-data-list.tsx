import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { LocEnumItem } from "../../../models/loc-enums/loc-enum-item";
import { Provider } from "../../../models/enums/provider";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { FixedSizeList } from "react-window";

const styles = (theme: Theme) =>
  createStyles({
    enumItem: {
      display: "flex",
      alignItems: "center",
      padding: "3px 10px",
    },
    enumItemTitle: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    enumItemChip: {
      marginLeft: 5,
      display: "flex",
      alignItems: "center",
    },
    enumItemChipBadge: {
      display: "inline-block",
      padding: "0 5px",
      height: "20px",
      textAlign: "center",
      lineHeight: "20px",
      backgroundColor: theme.palette.grey.A200,
      overflow: "hidden",
      borderRadius: "10px",
      color: "#fff",
      whiteSpace: "nowrap",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  height: number;
  data: Array<LocEnumItem>;
  onUpdateClick?: (item: LocEnumItem, index: number) => void;
  onRemoveClick?: (index: number) => void;
}

class LocEnumsEditDataList extends React.Component<RProps, any> {
  render(): React.ReactNode {
    const renderRow = (props: any) => {
      const item = this.props.data[props.index];
      const key = props.index;
      return (
        <div key={key} style={props.style}>
          {this.renderItem(item, props.index)}
        </div>
      );
    };

    return (
      <FixedSizeList
        itemSize={32}
        height={this.props.height}
        itemCount={this.props.data.length}
        width="100%"
      >
        {renderRow}
      </FixedSizeList>
    );
  }

  private renderItem(item: LocEnumItem, index: number) {
    const chips = new Array<React.ReactNode>();
    item?.providerIds.forEach((id, providerId) => {
      const key = index + "-" + providerId + "-" + id;
      if (chips.length > 0) {
        chips.push(" ");
      }
      chips.push(
        <span key={key} className={this.props.classes.enumItemChip}>
          <span className={this.props.classes.enumItemChipBadge}>
            {Provider.initialsForProvider(providerId)} {id}
          </span>
        </span>
      );
    });

    return (
      <div key={index} className={this.props.classes.enumItem}>
        <span className={this.props.classes.enumItemTitle}>{item?.title}</span>
        {chips}
        <IconButton
          size="small"
          onClick={() => this.onUpdateClick(item, index)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => this.onRemoveClick(index)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    );
  }

  private onUpdateClick(item: LocEnumItem, index: number): void {
    if (this.props.onUpdateClick) {
      this.props.onUpdateClick(item, index);
    }
  }

  private onRemoveClick(index: number): void {
    if (this.props.onRemoveClick) {
      this.props.onRemoveClick(index);
    }
  }
}

export default withStyles(styles)(LocEnumsEditDataList);
