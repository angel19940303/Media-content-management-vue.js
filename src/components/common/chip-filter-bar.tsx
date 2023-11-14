import React, { createRef } from "react";
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import FilterListIcon from "@material-ui/icons/FilterList";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

const styles = (theme: Theme) =>
  createStyles({
    wrapper: {
      paddingBottom: theme.spacing(2),
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
    form: {
      "& > div:first-child": {
        paddingTop: 5,
      },
    },
    content: {
      padding: "5px 15px 10px 15px",
      borderTop: "none",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  filters: Array<string>;
  onApply?: (filters: Array<string>, width: number, height: number) => void;
  onResize?: (width: number, height: number) => void;
}

interface RState {
  isOpen: boolean;
  searchText: string;
}

class ChipFilterBar extends React.Component<RProps, RState> {
  private readonly anchorRef: any;
  private readonly popoverAnchorRef: any;

  constructor(props: RProps) {
    super(props);
    this.state = { isOpen: false, searchText: "" };
    this.anchorRef = createRef<HTMLDivElement>();
    this.popoverAnchorRef = createRef<HTMLDivElement>();
  }

  componentDidMount() {
    if (this.props.onResize) {
      const rect = this.anchorRef.current.getBoundingClientRect();
      this.props.onResize(rect.width, rect.height);
    }
  }

  render(): React.ReactNode {
    const id = this.state.isOpen ? "simple-popover" : undefined;
    const handlePopoverOpen = () => this.setState({ isOpen: true });
    const handlePopoverClose = () => {
      this.setState({ isOpen: false });
    };
    const handleApply = (event: any) => {
      event.preventDefault();
      if (this.props.onApply) {
        const rect = this.anchorRef.current.getBoundingClientRect();
        if (this.state.searchText === "") {
          this.props.onApply([...this.props.filters], rect.width, rect.height);
        } else {
          this.props.onApply(
            [...this.props.filters, this.state.searchText],
            rect.width,
            rect.height
          );
        }
        handlePopoverClose();
      }
    };

    return (
      <div ref={this.anchorRef} className={this.props.classes.wrapper}>
        <Chip
          size="small"
          icon={<FilterListIcon />}
          label="Filter"
          innerRef={this.popoverAnchorRef}
          onClick={handlePopoverOpen}
        />
        {this.renderFilterChips()}
        <Popper
          id={id}
          open={this.state.isOpen}
          anchorEl={this.popoverAnchorRef.current}
          placement="bottom-start"
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <ClickAwayListener onClickAway={handlePopoverClose}>
                  <form
                    className={this.props.classes.form}
                    action="/"
                    onSubmit={handleApply}
                  >
                    <DialogContent
                      dividers
                      className={this.props.classes.content}
                    >
                      <TextField
                        label="Search name"
                        type="search"
                        variant="outlined"
                        size="small"
                        margin="dense"
                        inputProps={{ autoFocus: true }}
                        onChange={(event) =>
                          this.setState({ searchText: event.target.value })
                        }
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button size="small" onClick={handlePopoverClose}>
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        type="submit"
                        color="primary"
                      >
                        Apply
                      </Button>
                    </DialogActions>
                  </form>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
    );
  }

  private renderFilterChips(): React.ReactNode {
    const onFilterDelete = (index: number) => {
      if (this.props.onApply) {
        const rect = this.anchorRef.current.getBoundingClientRect();
        const newFilters = [...this.props.filters];
        if (index >= 0 && index < this.props.filters.length) {
          newFilters.splice(index, 1);
        }
        this.props.onApply(newFilters, rect.width, rect.height);
      }
    };
    return this.props.filters.map((filter, index) => {
      return (
        <Chip
          key={index}
          size="small"
          color="primary"
          label={filter}
          onDelete={() => onFilterDelete(index)}
        />
      );
    });
  }
}

export default withStyles(styles)(ChipFilterBar);
