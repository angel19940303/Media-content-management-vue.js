import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { Provider } from "../../../../models/enums/provider";
import TextField from "@material-ui/core/TextField";
import { StageMappingFilter } from "../../../../models/ui/stage-mapping-filter";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const styles = () =>
  createStyles({
    filterBar: {
      height: "60px",
      boxSizing: "border-box",
      padding: "0 16px",
      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
      display: "flex",
      alignItems: "center",
    },
    filterBarProvider: {
      boxSizing: "border-box",
      paddingRight: "8px",
    },
    filterBarName: {
      boxSizing: "border-box",
      padding: "0 8px",
      flex: "1",
    },
    filterBarHideAssigned: {
      boxSizing: "border-box",
      paddingLeft: "8px",
      fontSize: "12px",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  providerIds: Array<number>;
  hideAssignedChange?: boolean;
  filter?: StageMappingFilter;
  onChange?: (filter?: StageMappingFilter) => void;
}

class StageMappingFilterBar extends React.Component<RProps, any> {
  render(): React.ReactNode {
    return (
      <div className={this.props.classes.filterBar}>
        {this.renderProviderSelect()}
        {this.renderNameTextField()}
        {this.renderHideAssignedSwitch()}
      </div>
    );
  }

  private renderProviderSelect(): React.ReactNode {
    return (
      <div className={this.props.classes.filterBarProvider}>
        <FormControl variant="outlined" size="small" margin="dense">
          <InputLabel>Provider</InputLabel>
          <Select
            value={this.props.filter?.provider ?? -1}
            onChange={(event) => this.onProviderChange(event)}
            label="Provider"
          >
            <MenuItem key={-1} value={-1}>
              All
            </MenuItem>
            {this.props.providerIds.map((pid) => (
              <MenuItem key={pid} value={pid}>
                {Provider.titleForProvider(pid)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }

  private renderNameTextField(): React.ReactNode {
    return (
      <div className={this.props.classes.filterBarName}>
        <TextField
          value={this.props.filter?.name || ""}
          label="Name"
          variant="outlined"
          size="small"
          margin="dense"
          fullWidth={true}
          onChange={(event) => this.onNameChange(event)}
        />
      </div>
    );
  }

  private renderHideAssignedSwitch(): React.ReactNode {
    if (this.props.hideAssignedChange === true) {
      return "";
    }
    const control = (
      <Switch
        checked={this.props.filter?.hideAssigned === true}
        name="hidden"
        color="primary"
        onChange={(event) => this.onHideAssignedChange(event)}
      />
    );
    return (
      <div className={this.props.classes.filterBarHideAssigned}>
        <FormControlLabel control={control} label="Hide assigned" />
      </div>
    );
  }

  private onProviderChange(event: any): void {
    const providerId =
      event.target.value === -1 ? undefined : event.target.value;
    this.onUpdate(
      providerId,
      this.props.filter?.name,
      this.props.filter?.hideAssigned
    );
  }

  private onNameChange(event: any): void {
    const name = event.target.value.length > 0 ? event.target.value : undefined;
    this.onUpdate(
      this.props.filter?.provider,
      name,
      this.props.filter?.hideAssigned
    );
  }

  private onHideAssignedChange(event: any): void {
    const hideAssigned = event.target.checked === true ? true : undefined;
    this.onUpdate(
      this.props.filter?.provider,
      this.props.filter?.name,
      hideAssigned
    );
  }

  private onUpdate(
    providerId?: number,
    name?: string,
    hideAssigned?: boolean
  ): void {
    const filter = new StageMappingFilter(providerId, name, hideAssigned);
    if (this.props.onChange) {
      if (filter.isEmpty()) {
        this.props.onChange(undefined);
      } else {
        this.props.onChange(filter);
      }
    }
  }
}

export default withStyles(styles)(StageMappingFilterBar);
