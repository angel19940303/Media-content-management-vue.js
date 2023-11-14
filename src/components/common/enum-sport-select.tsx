import React from "react";
import { EnumList } from "../../models/common/enum-list";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

interface RProps {
  enums: EnumList;
  selectedSport?: string;
  selectedSportId?: number;
  useAllAsDefault?: boolean;
  onChange?: (sport: string) => void;
  onChangeId?: (sportId: number) => void;
}

export class EnumSportSelect extends React.Component<RProps, any> {
  render(): React.ReactNode {
    let selectedSportId = this.props.selectedSportId;
    if (
      selectedSportId === undefined &&
      this.props.selectedSport !== undefined
    ) {
      selectedSportId = this.props.enums.getSportId(this.props.selectedSport);
    }
    return (
      <FormControl variant="outlined" size="small" fullWidth>
        <InputLabel>Sport</InputLabel>
        <Select
          fullWidth
          value={selectedSportId || 0}
          onChange={(event) => this.onSportSelect(event)}
          label="Sport"
        >
          {this.props.enums.getSports().map((sport) => (
            <MenuItem key={sport} value={this.props.enums.getSportId(sport)}>
              {this.props.useAllAsDefault === true && sport === "UNKNOWN_SPORT"
                ? "ALL"
                : sport}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  private onSportSelect(event: any): void {
    const sportId: number = event.target.value;
    if (this.props.onChangeId) {
      this.props.onChangeId(sportId);
    }
    if (this.props.onChange) {
      const sport = this.props.enums.sportName(sportId);
      if (sport !== undefined) {
        this.props.onChange(sport);
      }
    }
  }
}
