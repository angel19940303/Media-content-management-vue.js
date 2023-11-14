import React from "react";
import {
  createStyles,
  withStyles,
  Theme,
  WithStyles,
} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { EnumProviderSelect } from "../common/enum-provider-select";
import { EnumList } from "../../models/common/enum-list";
import FilterListIcon from "@material-ui/icons/FilterList";
import { MappingFilter } from "../../models/ui/mapping-filter";
import { IconButton, InputBase } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

const styles = (theme: Theme) =>
  createStyles({
    filterIcon: {
      "& svg": {
        verticalAlign: "middle",
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  enums: EnumList;
  filter?: MappingFilter;
  onChange?: (filter?: MappingFilter) => void;
}

class MappingFilterBar extends React.Component<RProps, any> {
  render(): React.ReactNode {
    return (
      <Grid container spacing={2} alignItems="center">
        <Grid item className={this.props.classes.filterIcon}>
          <FilterListIcon />
        </Grid>
        <Grid item xs>
          <EnumProviderSelect
            enums={this.props.enums}
            simple
            useAllAsDefault
            selectedProviderId={this.props.filter?.sourceProviderId || 0}
            label="Source provider"
            onChange={(providerId) => this.onSourceProviderChange(providerId)}
          />
        </Grid>
        <Grid item xs>
          <EnumProviderSelect
            enums={this.props.enums}
            simple
            useAllAsDefault
            selectedProviderId={this.props.filter?.targetProviderId || 0}
            label="Target provider"
            onChange={(providerId) => this.onTargetProviderChange(providerId)}
          />
        </Grid>
        <Grid item xs>
          <InputBase
            fullWidth
            value={this.props.filter?.stageName || ""}
            placeholder="Stage Name"
            onChange={(event) => this.onStageNameChange(event)}
          />
        </Grid>
        <Grid item xs>
          <InputBase
            fullWidth
            value={this.props.filter?.teamName || ""}
            placeholder="Team Name"
            onChange={(event) => this.onTeamNameChange(event)}
          />
        </Grid>
        <Grid item>
          <IconButton
            size="small"
            disabled={this.props.filter === undefined}
            onClick={() => this.onClearClick()}
          >
            <ClearIcon />
          </IconButton>
        </Grid>
      </Grid>
    );
  }

  private onSourceProviderChange(providerId: number): void {
    this.emitChange({ sourceProviderId: providerId });
  }

  private onTargetProviderChange(providerId: number): void {
    this.emitChange({ targetProviderId: providerId });
  }

  private onStageNameChange(event: any): void {
    this.emitChange({ stageName: event.target.value });
  }

  private onTeamNameChange(event: any): void {
    this.emitChange({ teamName: event.target.value });
  }

  private onClearClick(): void {
    if (this.props.onChange) {
      this.props.onChange(undefined);
    }
  }

  private emitChange(values: Partial<MappingFilter>): void {
    if (this.props.onChange) {
      const filter = this.createMappingFilter(values);
      this.props.onChange(filter);
    }
  }

  private createMappingFilter(
    values: Partial<MappingFilter>
  ): MappingFilter | undefined {
    const sourceProviderId =
      values.sourceProviderId !== undefined
        ? values.sourceProviderId === 0
          ? undefined
          : values.sourceProviderId
        : this.props.filter?.sourceProviderId;
    const targetProviderId =
      values.targetProviderId !== undefined
        ? values.targetProviderId === 0
          ? undefined
          : values.targetProviderId
        : this.props.filter?.targetProviderId;
    const stageName =
      values.stageName !== undefined
        ? values.stageName === ""
          ? undefined
          : values.stageName
        : this.props.filter?.stageName;
    const teamName =
      values.teamName !== undefined
        ? values.teamName === ""
          ? undefined
          : values.teamName
        : this.props.filter?.teamName;
    if (
      sourceProviderId === undefined &&
      targetProviderId === undefined &&
      stageName === undefined &&
      teamName === undefined
    ) {
      return undefined;
    }
    return {
      sourceProviderId: sourceProviderId,
      targetProviderId: targetProviderId,
      stageName: stageName,
      teamName: teamName,
    };
  }
}

export default withStyles(styles)(MappingFilterBar);
