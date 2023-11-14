import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import FilterListIcon from "@material-ui/icons/FilterList";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { InputBase } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { EnumList } from "../../../models/common/enum-list";
import Button from "@material-ui/core/Button";

const styles = () =>
  createStyles({
    fullWidth: {
      width: "100%",
    },
    fullFlexWidth: {
      flex: 1,
    },
    block: {
      display: "block",
    },
    hidden: {
      display: "none",
    },
    buttonBar: {
      "& button": {
        marginLeft: 10,
      },
      "& button:first-child": {
        marginLeft: 0,
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  sport: number;
  provider?: number;
  language?: number;
  title?: string;
  enums: EnumList;
  onChange?: (
    sport: number,
    provider?: number,
    language?: number,
    title?: string
  ) => void;
}

interface RState {
  sport: number;
  provider?: number;
  language?: number;
  title?: string;
}

class NewsEntryListFilterToolbar extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      sport: props.sport,
      provider: props.provider,
      language: props.language,
      title: props.title,
    };
  }

  render(): React.ReactNode {
    return (
      <Toolbar>
        <form
          onSubmit={(event) => this.onSubmit(event)}
          onReset={(event) => this.onReset(event)}
          className={this.props.classes.fullWidth}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <FilterListIcon
                className={this.props.classes.block}
                color="inherit"
              />
            </Grid>
            <Grid item>
              <FormControl>
                <Select
                  value={this.state.sport || 0}
                  onChange={(event) => this.onSportFilterChange(event)}
                  label="Sport"
                  input={<InputBase />}
                >
                  {this.props.enums.getSports().map((sport) => (
                    <MenuItem
                      key={sport}
                      value={this.props.enums.getSportId(sport) || 0}
                    >
                      {sport === "UNKNOWN_SPORT" ? "All sports" : sport}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Select
                value={this.state.language || 0}
                onChange={(event) => this.onLanguageFilterChange(event)}
                label="Language"
                input={<InputBase />}
              >
                {this.props.enums.getLanguages().map((language) => (
                  <MenuItem
                    key={language}
                    value={this.props.enums.getLanguageId(language) || 0}
                  >
                    {language === "UNKNOWN_LANGUAGE"
                      ? "All languages"
                      : language}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item>
              <Select
                value={this.state.provider || 0}
                onChange={(event) => this.onProviderFilterChange(event)}
                label="Provider"
                input={<InputBase />}
              >
                {this.props.enums.getProviders().map((provider) => (
                  <MenuItem
                    key={provider}
                    value={this.props.enums.getProviderId(provider) || 0}
                  >
                    {provider === "UNKNOWN_PROVIDER"
                      ? "All providers"
                      : provider}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item className={this.props.classes.fullFlexWidth}>
              <InputBase
                fullWidth
                value={this.state.title || ""}
                placeholder="Title"
                onChange={(event) => this.onTitleFilterChange(event)}
              />
            </Grid>
            <Grid item className={this.props.classes.buttonBar}>
              <Button variant="contained" type="submit" color="primary">
                Filter
              </Button>
              <Button
                variant="contained"
                type="reset"
                className={
                  this.hasActiveSelection() ? "" : this.props.classes.hidden
                }
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </Toolbar>
    );
  }

  private onSportFilterChange(event: any): void {
    this.setState({ sport: event.target.value });
  }

  private onLanguageFilterChange(event: any): void {
    this.setState({ language: event.target.value });
  }

  private onProviderFilterChange(event: any): void {
    this.setState({ provider: event.target.value });
  }

  private onTitleFilterChange(event: any): void {
    this.setState({ title: event.target.value });
  }

  private onSubmit(event: any): void {
    event.preventDefault();
    if (this.props.onChange) {
      this.props.onChange(
        this.state.sport,
        this.state.provider,
        this.state.language,
        this.state.title
      );
    }
  }

  private onReset(event: any): void {
    event.preventDefault();
    const sport = this.props.enums.defaultSport();
    if (sport !== undefined && this.props.onChange) {
      this.props.onChange(sport, undefined, undefined, undefined);
    }
  }
  private hasActiveSelection(): boolean {
    const defaultSport = this.props.enums.defaultSport();
    return (
      (defaultSport !== undefined && this.state.sport !== defaultSport) ||
      (this.state.language !== undefined && this.state.language !== 0) ||
      (this.state.provider !== undefined && this.state.provider !== 0) ||
      (this.state.title !== undefined && this.state.title !== "")
    );
  }
}

export default withStyles(styles)(NewsEntryListFilterToolbar);
