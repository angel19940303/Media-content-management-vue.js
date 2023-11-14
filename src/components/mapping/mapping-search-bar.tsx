import React from "react";
import { EnumList } from "../../models/common/enum-list";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { EnumProviderSelect } from "../common/enum-provider-select";
import { EnumSportSelect } from "../common/enum-sport-select";

interface RProps {
  enums: EnumList;
  sport?: string;
  providerId?: number;
  searchString: string;
  onChange?: (
    sport: string | undefined,
    providerId: number | undefined,
    searchString: string,
    delayLoad: boolean
  ) => void;
}

class MappingSearchBar extends React.Component<RProps, any> {
  render(): React.ReactNode {
    return (
      <Grid container spacing={2}>
        <Grid item>
          <EnumSportSelect
            enums={this.props.enums}
            selectedSport={this.props.sport}
            onChange={(sport) => this.onSportSelect(sport)}
          />
        </Grid>
        <Grid item>
          <EnumProviderSelect
            enums={this.props.enums}
            selectedProviderId={this.props.providerId}
            useAllAsDefault
            onChange={(providerId) => this.onProviderSelect(providerId)}
          />
        </Grid>
        <Grid item xs>
          <TextField
            label="Participant Name"
            variant="outlined"
            size="small"
            fullWidth
            value={this.props.searchString || ""}
            onChange={(event) => this.onSearchTextChange(event)}
          />
        </Grid>
      </Grid>
    );
  }

  private onSportSelect(sport: string): void {
    this.notifyChange(
      sport,
      this.props.providerId,
      this.props.searchString,
      false
    );
  }

  private onProviderSelect(providerId: number): void {
    const sanitizedProviderId = providerId === 0 ? undefined : providerId;
    this.notifyChange(
      this.props.sport,
      sanitizedProviderId,
      this.props.searchString,
      false
    );
  }

  private onSearchTextChange(event: any): void {
    const searchString = event.target.value;
    this.notifyChange(
      this.props.sport,
      this.props.providerId,
      searchString,
      true
    );
  }

  private notifyChange(
    sport: string | undefined,
    providerId: number | undefined,
    searchString: string,
    delayLoad: boolean
  ): void {
    if (this.props.onChange) {
      this.props.onChange(sport, providerId, searchString, delayLoad);
    }
  }
}

export default MappingSearchBar;
