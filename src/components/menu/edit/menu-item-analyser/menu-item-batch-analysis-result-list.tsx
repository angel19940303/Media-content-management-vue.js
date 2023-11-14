import React from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import { FixedSizeList } from "react-window";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import MenuItemBatchAnalysisResultRow from "./menu-item-batch-analysis-result-row";

const styles = () =>
  createStyles({
    noPadding: {
      padding: "0",
    },
    title: {
      display: "flex",
      alignItems: "center",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  rows: Array<any> | undefined;
  virtualizedWithHeight?: number;
  onFix?: (id: string, property: number, valur: boolean) => void;
  onFixAll?: (property: number, valur: boolean) => void;
}

class MenuItemBatchAnalysisResultList extends React.Component<RProps, any> {
  render(): React.ReactNode {
    return this.renderList();
  }

  private renderList(): React.ReactNode {
    return (
      <List dense={true} className={this.props.classes.noPadding}>
        {this.renderRows()}
      </List>
    );
  }

  private renderRows(): React.ReactNode {
    if (!this.props.rows || this.props.rows.length === 0) {
      return (
        <ListItem>
          <ListItemText secondary="No results are available" />
        </ListItem>
      );
    }
    if (!this.props.virtualizedWithHeight) {
      return this.props.rows.map((row, index) => this.renderRow(row, index));
    }
    const renderRow = (props: any) => this.renderVirtualizedRow(props);
    return (
      <FixedSizeList
        itemCount={this.props.rows.length}
        itemSize={22}
        width="100%"
        height={this.props.virtualizedWithHeight}
      >
        {renderRow}
      </FixedSizeList>
    );
  }

  private renderVirtualizedRow(props: any): any {
    if (!this.props.rows || props.index >= this.props.rows.length) {
      return <div style={props.style} />;
    }
    const mapping = this.props.rows[props.index];
    const key = mapping.providerId + "-" + mapping.stageId;
    return (
      <div key={key} style={props.style}>
        {this.renderRow(mapping, props.index)}
      </div>
    );
  }

  private renderRow(data: any, index: number): any {
    return (
      <MenuItemBatchAnalysisResultRow
        key={index}
        data={data}
        onFix={(id, property, value) => this.onFix(id, property, value)}
        onFixAll={(property, value) => this.onFixAll(property, value)}
      />
    );
  }

  private onFix(id: string, property: number, value: boolean): void {
    if (this.props.onFix) {
      this.props.onFix(id, property, value);
    }
  }

  private onFixAll(property: number, value: boolean): void {
    if (this.props.onFixAll) {
      this.props.onFixAll(property, value);
    }
  }
}

export default withStyles(styles)(MenuItemBatchAnalysisResultList);
