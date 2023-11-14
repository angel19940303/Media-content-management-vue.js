import React from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { StageMapping } from "../../../../models/menu/stage-mapping";
import StageMappingRow from "./stage-mapping-row";
import List from "@material-ui/core/List";
import { FixedSizeList } from "react-window";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Paper from "@material-ui/core/Paper";
import { FormControl, FormHelperText } from "@material-ui/core";
import MenuList from "@material-ui/core/MenuList";

const styles = () =>
  createStyles({
    noPadding: {
      padding: "0",
    },
    title: {
      display: "flex",
      alignItems: "center",
    },
    addButton: {
      textAlign: "right",
    },
    errorOutline: {
      borderColor: "#f44336",
    },
    errorContent: {
      color: "#f44336",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  mappings: Array<StageMapping> | undefined;
  virtualizedWithHeight?: number;
  actionsDisabled?: boolean;
  onOpen?: () => void;
  onAdd?: (mapping: StageMapping) => void;
  onUpdate?: (index: number) => void;
  onRemove?: (index: number) => void;
  onSelect?: (mapping: StageMapping) => void;
  onRefresh?: (mapping: StageMapping) => void;
  error?: boolean;
  helperText?: React.ReactNode;
}

class StageMappingList extends React.Component<RProps, any> {
  render(): React.ReactNode {
    const paperClassName =
      this.props.error === true ? this.props.classes.errorOutline : undefined;
    if (this.props.onOpen) {
      return (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={9} className={this.props.classes.title}>
              <Typography variant="h6">Mapped provider stages</Typography>
            </Grid>
            <Grid item xs={3} className={this.props.classes.addButton}>
              <IconButton
                aria-label="add mapping"
                component="span"
                onClick={this.props.onOpen}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth={true} error={this.props.error}>
                <Paper variant="outlined" className={paperClassName}>
                  {this.renderList()}
                </Paper>
                <FormHelperText>{this.props.helperText}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      );
    }
    return this.renderList();
  }

  private renderList(): React.ReactNode {
    if (
      this.props.onSelect &&
      this.props.mappings &&
      this.props.mappings.length > 0
    ) {
      return (
        <MenuList dense className={this.props.classes.noPadding}>
          {this.renderRows()}
        </MenuList>
      );
    }
    return (
      <List dense={true} className={this.props.classes.noPadding}>
        {this.renderRows()}
      </List>
    );
  }

  private renderRows(): React.ReactNode {
    if (!this.props.mappings || this.props.mappings.length === 0) {
      return (
        <ListItem>
          <ListItemText secondary="No stage mappings are available in this section" />
        </ListItem>
      );
    }
    if (!this.props.virtualizedWithHeight) {
      return this.props.mappings.map((mapping, index) =>
        this.renderRow(mapping, index)
      );
    }
    const renderRow = (props: any) => this.renderVirtualizedRow(props);
    return (
      <FixedSizeList
        itemCount={this.props.mappings.length}
        itemSize={60}
        width="100%"
        height={this.props.virtualizedWithHeight}
      >
        {renderRow}
      </FixedSizeList>
    );
  }

  private renderVirtualizedRow(props: any): any {
    if (!this.props.mappings || props.index >= this.props.mappings.length) {
      return <div style={props.style} />;
    }
    const mapping = this.props.mappings[props.index];
    const key = mapping.providerId + "-" + mapping.stageId;
    const count = this.props.onAdd ? mapping.assignmentCount : undefined;
    return (
      <div key={key} style={props.style}>
        {this.renderRow(mapping, props.index, count)}
      </div>
    );
  }

  private renderRow(mapping: StageMapping, index: number, count?: number): any {
    return (
      <StageMappingRow
        key={index}
        mapping={mapping}
        index={index}
        count={count}
        actionsDisabled={this.props.actionsDisabled}
        onAdd={this.props.onAdd}
        onUpdate={this.props.onUpdate}
        onRemove={this.props.onRemove}
        onSelect={this.props.onSelect}
        onRefresh={this.props.onRefresh}
      />
    );
  }
}

export default withStyles(styles)(StageMappingList);
