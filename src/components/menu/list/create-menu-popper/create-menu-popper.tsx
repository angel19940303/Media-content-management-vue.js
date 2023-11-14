import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  BaseCreatePopper,
  BaseCreatePopperProps,
  BaseCreatePopperState,
  baseCreatePopperStyles,
  SelectOption,
} from "../../../common/base-create-popper";
import { MenuDataPayload } from "../../../../models/menu/menu-data-payload";
import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Sport } from "../../../../models/enums/sport";
import { Provider } from "../../../../models/enums/provider";

interface RProps extends RouteComponentProps<any>, BaseCreatePopperProps {
  menuData?: Array<MenuDataPayload>;
}

interface RState extends BaseCreatePopperState {
  selectedOption: string;
  selectedMenuId?: number;
  selectedSport: number;
  selectedProvider: number;
}

class CreateMenuPopper extends BaseCreatePopper<RProps, RState> {
  private static readonly CREATE_OPT_MENU = "0";
  private static readonly CREATE_OPT_PROVIDER = "1";
  private static readonly CREATE_OPT_BLANK = "2";

  constructor(props: RProps) {
    super(props);
    let selectedMenuId: number | undefined = undefined;
    let defaultCreateOpt = CreateMenuPopper.CREATE_OPT_PROVIDER;
    if (props.menuData !== undefined && props.menuData.length > 0) {
      selectedMenuId = props.menuData[0].id;
      defaultCreateOpt = CreateMenuPopper.CREATE_OPT_MENU;
    }
    this.state = {
      selectedOption: defaultCreateOpt,
      selectedMenuId: selectedMenuId,
      selectedSport: Sport.SOCCER,
      selectedProvider: Provider.ENET,
    };
  }

  private static titleForMenuItem(menuItemPayload: MenuDataPayload): string {
    return (
      menuItemPayload.id +
      ": " +
      Sport.title(menuItemPayload.sportId) +
      " - " +
      (menuItemPayload.name || "Untitled")
    );
  }

  protected onCreateClick(): void {
    switch (this.state.selectedOption) {
      case CreateMenuPopper.CREATE_OPT_MENU:
        if (this.state.selectedMenuId) {
          const path =
            "/content/menu-structure/clone/" + this.state.selectedMenuId;
          this.props.history.push(path);
        }
        break;
      case CreateMenuPopper.CREATE_OPT_BLANK:
      case CreateMenuPopper.CREATE_OPT_PROVIDER:
        const sportCode = Sport.code(this.state.selectedSport);
        if (sportCode) {
          let path = "/content/menu-structure/create/" + sportCode;
          if (
            this.state.selectedOption === CreateMenuPopper.CREATE_OPT_PROVIDER
          ) {
            path += "/" + this.state.selectedProvider;
          }
          this.props.history.push(path);
        } else {
          this.setState({ popperAnchorEl: undefined });
        }
        break;
    }
  }

  protected renderButtonTitle(): React.ReactNode {
    return "Create menu";
  }

  protected renderContent(): React.ReactNode {
    return (
      <Grid container spacing={2} alignContent="center">
        {this.renderMenuSelect()}
        {this.renderSportSelect()}
        {this.renderProviderSelect()}
      </Grid>
    );
  }

  protected renderOptions(): React.ReactNode {
    return (
      <RadioGroup
        name="create-menu-type"
        value={this.state.selectedOption}
        onChange={(event) =>
          this.setState({
            selectedOption: (event.target as HTMLInputElement).value,
          })
        }
      >
        <FormControlLabel
          value={CreateMenuPopper.CREATE_OPT_MENU}
          control={<Radio size="small" color="primary" />}
          label={<Typography variant="body2">Clone existing menu</Typography>}
          disabled={!this.props.menuData || this.props.menuData.length === 0}
        />
        <FormControlLabel
          value={CreateMenuPopper.CREATE_OPT_PROVIDER}
          control={<Radio size="small" color="primary" />}
          label={<Typography variant="body2">From provider data</Typography>}
        />
        <FormControlLabel
          value={CreateMenuPopper.CREATE_OPT_BLANK}
          control={<Radio size="small" color="primary" />}
          label={<Typography variant="body2">Create blank</Typography>}
        />
      </RadioGroup>
    );
  }

  protected renderTitle(): React.ReactNode {
    return "Create Menu";
  }

  private renderMenuSelect(): React.ReactNode {
    if (
      this.state.selectedOption === CreateMenuPopper.CREATE_OPT_MENU &&
      this.props.menuData &&
      this.state.selectedMenuId
    ) {
      const options: Array<SelectOption<number>> = this.props.menuData.map(
        (item) => {
          return {
            value: item.id || 0,
            title: CreateMenuPopper.titleForMenuItem(item),
          };
        }
      );
      const onChange = (value: number) =>
        this.setState({ selectedMenuId: value });
      return this.renderSelect(
        this.state.selectedMenuId,
        "Menu",
        12,
        options,
        onChange
      );
    }
    return undefined;
  }

  private renderSportSelect(): React.ReactNode {
    if (this.state.selectedOption !== CreateMenuPopper.CREATE_OPT_MENU) {
      const options = Sport.SPORTS.map((sport) => {
        return { value: sport, title: Sport.title(sport) || "" };
      });
      const onChange = (value: any) =>
        this.setState({ selectedSport: parseInt(value, 10) });
      return this.renderSelect(
        this.state.selectedSport,
        "Sport",
        6,
        options,
        onChange
      );
    }
    return undefined;
  }

  private renderProviderSelect(): React.ReactNode {
    if (this.state.selectedOption === CreateMenuPopper.CREATE_OPT_PROVIDER) {
      const options = Provider.PROVIDERS.map((provider) => {
        return { value: provider, title: Provider.titleForProvider(provider) };
      });
      const onChange = (value: number) =>
        this.setState({ selectedProvider: value });
      return this.renderSelect(
        this.state.selectedProvider,
        "Provider",
        6,
        options,
        onChange
      );
    }
    return undefined;
  }
}

export default withRouter(withStyles(baseCreatePopperStyles)(CreateMenuPopper));
