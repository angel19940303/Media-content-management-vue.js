import React from "react";
import { EnumList } from "../../models/common/enum-list";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { FormHelperText, InputBase } from "@material-ui/core";

interface RProps {
  enums: EnumList;
  label?: string;
  selectedProviderId?: number;
  useAllAsDefault?: boolean;
  error?: boolean;
  helperText?: string;
  onChange?: (providerId: number) => void;
  simple?: boolean;
}

export class EnumProviderSelect extends React.Component<RProps, any> {
  render(): React.ReactNode {
    const label = this.props.label || "Provider";
    const isSimple = this.props.simple === true;
    if (isSimple) {
      return this.renderContent(label, isSimple);
    }
    return (
      <FormControl
        variant="outlined"
        size="small"
        fullWidth
        error={this.props.error}
      >
        <InputLabel>{label}</InputLabel>
        {this.renderContent(label, isSimple)}
        {this.props.helperText === undefined ? null : (
          <FormHelperText>{this.props.helperText}</FormHelperText>
        )}
      </FormControl>
    );
  }

  private renderContent(label: string, isSimple: boolean): React.ReactNode {
    const input = isSimple ? <InputBase /> : undefined;
    return (
      <Select
        fullWidth
        value={this.props.selectedProviderId || 0}
        onChange={(event) => this.onProviderSelect(event)}
        label={label}
        input={input}
      >
        {this.props.enums.getProviders().map((provider) => (
          <MenuItem
            key={provider}
            value={this.props.enums.getProviderId(provider) || 0}
          >
            {this.props.useAllAsDefault === true &&
            provider === "UNKNOWN_PROVIDER"
              ? "ALL"
              : provider}
          </MenuItem>
        ))}
      </Select>
    );
  }

  private onProviderSelect(event: any): void {
    const selectedProviderId = event.target.value;
    if (this.props.onChange) {
      this.props.onChange(selectedProviderId);
    }
  }
}
