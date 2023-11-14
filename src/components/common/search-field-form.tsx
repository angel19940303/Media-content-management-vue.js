import React, { createRef } from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import TextField from "@material-ui/core/TextField";
import { IconButton } from "@material-ui/core";

const styles = () =>
  createStyles({
    searchField: {
      "& fieldset": {
        backgroundColor: "rgba(0, 0, 0, 0.12)",
        borderWidth: 0,
      },
      "& .Mui-focused fieldset": {
        backgroundColor: "inherit",
        borderColor: "#009be5",
        borderWidth: 2,
      },
      "& input": {
        fontSize: "0.9rem",
        fontWeight: 500,
        paddingTop: 9.5,
        paddingBottom: 9.5,
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  version: number;
  searchString?: string;
  onChange?: (searchString: string) => void;
}

interface RState {
  version: number;
  searchString: string;
  focused: boolean;
}

class SearchFieldForm extends React.Component<RProps, RState> {
  private anchorRef: any;

  constructor(props: RProps) {
    super(props);
    this.state = {
      searchString: props.searchString || "",
      focused: false,
      version: props.version,
    };
    this.anchorRef = createRef<HTMLInputElement>();
  }

  render(): React.ReactNode {
    return (
      <form action="/" onSubmit={(event) => this.onSubmit(event)}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search"
          value={this.searchString()}
          className={this.props.classes.searchField}
          inputRef={this.anchorRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: this.renderButton(),
          }}
          onChange={(event) =>
            this.setState({
              searchString: event.target.value,
              version: this.props.version,
            })
          }
          onFocus={() => this.setState({ focused: true })}
          onBlur={() => this.setState({ focused: false })}
        />
      </form>
    );
  }

  private renderButton(): React.ReactNode {
    const searchString = this.searchString();
    const stringFromProps = this.props.searchString || "";
    if (this.state.focused || searchString !== stringFromProps) {
      return (
        <IconButton size="small" type="submit">
          <CheckCircleIcon />
        </IconButton>
      );
    }
    if (searchString.length === 0) {
      return "";
    }
    return (
      <IconButton size="small" onClick={() => this.onClear()}>
        <CancelIcon />
      </IconButton>
    );
  }

  private searchString(): string {
    if (this.props.version > this.state.version) {
      return this.props.searchString || "";
    }
    return this.state.searchString;
  }

  private onSubmit(event: any): void {
    event.preventDefault();
    if (this.anchorRef && this.anchorRef.current) {
      this.anchorRef.current.blur();
    }
    if (this.props.onChange) {
      this.props.onChange(this.state.searchString);
    }
  }

  private onClear(): void {
    if (this.searchString() !== "") {
      this.setState({ searchString: "", version: this.props.version });
      if (this.props.onChange) {
        this.props.onChange("");
      }
    }
  }
}

export default withStyles(styles)(SearchFieldForm);
