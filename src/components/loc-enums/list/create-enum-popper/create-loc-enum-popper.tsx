import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { Sport } from "../../../../models/enums/sport";
import {
  BaseCreatePopper,
  BaseCreatePopperProps,
  BaseCreatePopperState,
  baseCreatePopperStyles,
} from "../../../common/base-create-popper";
import { LocEnumSourceType } from "../../../../models/enums/loc-enum-source-type";
import { RouteComponentProps, withRouter } from "react-router-dom";

interface Selection {
  sourceType: number;
  sport: number;
  option: string;
}

interface RProps extends BaseCreatePopperProps, RouteComponentProps<any> {}

interface RState extends BaseCreatePopperState {
  selection: Selection;
}

class CreateLocEnumPopper extends BaseCreatePopper<RProps, RState> {
  private static readonly CREATE_OPT_SOURCE = "0";
  private static readonly CREATE_OPT_BLANK = "2";

  constructor(props: RProps) {
    super(props);
    this.state = {
      selection: {
        sport: Sport.SOCCER,
        option: CreateLocEnumPopper.CREATE_OPT_SOURCE,
        sourceType: LocEnumSourceType.PROVIDER_CATEGORIES,
      },
    };
  }

  protected onCreateClick(): void {
    const sportCode = Sport.code(this.state.selection.sport);
    if (sportCode !== undefined) {
      let path = "/content/loc-enums/create/" + sportCode;
      if (
        this.state.selection.option === CreateLocEnumPopper.CREATE_OPT_SOURCE
      ) {
        path += "/" + this.state.selection.sourceType;
      }
      this.props.history.push(path);
    }
    this.setState({ popperAnchorEl: undefined });
  }

  protected renderButtonTitle(): React.ReactNode {
    return "Create enum";
  }

  protected renderContent(): React.ReactNode {
    return (
      <Grid container spacing={2} alignContent="center">
        {this.renderSourceTypeSelect()}
        {this.renderSportSelect()}
      </Grid>
    );
  }

  protected renderOptions(): React.ReactNode {
    return (
      <RadioGroup
        name="create-menu-type"
        value={this.state.selection.option}
        onChange={(event) => {
          event.persist();
          this.setState((state) => {
            return {
              selection: {
                option: (event.target as HTMLInputElement).value,
                sport: state.selection.sport,
                sourceType: state.selection.sourceType,
              },
            };
          });
        }}
      >
        <FormControlLabel
          value={CreateLocEnumPopper.CREATE_OPT_SOURCE}
          control={<Radio size="small" color="primary" />}
          label={<Typography variant="body2">From source data</Typography>}
        />
        <FormControlLabel
          value={CreateLocEnumPopper.CREATE_OPT_BLANK}
          control={<Radio size="small" color="primary" />}
          label={<Typography variant="body2">Create blank</Typography>}
        />
      </RadioGroup>
    );
  }

  protected renderTitle(): React.ReactNode {
    return "Create enum";
  }

  private renderSourceTypeSelect(): React.ReactNode {
    if (this.state.selection.option !== CreateLocEnumPopper.CREATE_OPT_SOURCE) {
      return undefined;
    }
    const options = LocEnumSourceType.TYPES.map((type) => {
      return { value: type, title: LocEnumSourceType.title(type) || "" };
    });
    const onChange = (value: any) =>
      this.setState((state) => {
        return {
          selection: {
            option: state.selection.option,
            sport: state.selection.sport,
            sourceType: parseInt(value, 10),
          },
        };
      });
    return this.renderSelect(
      this.state.selection.sourceType,
      "Source type",
      6,
      options,
      onChange
    );
  }

  private renderSportSelect(): React.ReactNode {
    const options = Sport.SPORTS.map((sport) => {
      return { value: sport, title: Sport.title(sport) || "" };
    });
    const onChange = (value: any) =>
      this.setState((state) => {
        return {
          selection: {
            option: state.selection.option,
            sport: parseInt(value, 10),
            sourceType: state.selection.sourceType,
          },
        };
      });
    return this.renderSelect(
      this.state.selection.sport,
      "Sport",
      6,
      options,
      onChange
    );
  }
}

export default withRouter(
  withStyles(baseCreatePopperStyles)(CreateLocEnumPopper)
);
