import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { MenuItem } from "../../../../models/menu/menu-item";
import { MenuEntryCollection } from "../../../../models/ui/menu-entry-collection";
import { ApiDataLoader } from "../../../../api/api-data-loader";
import { Sport } from "../../../../models/enums/sport";
import { LoadStatus } from "../../../../models/enums/load_status";
import LoadingIndicator from "../../../common/loading-indicator";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import { FixedSizeList } from "react-window";
import MenuListItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { InputAdornment } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";

const styles = () =>
  createStyles({
    noPadding: {
      padding: 0,
    },
  });

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  type: number;
  sport?: string;
  existingEntryIds: Set<string>;
  onSelect?: (menuItem: MenuItem) => void;
  onError?: (loadStatus: number) => void;
  onClose?: () => void;
}

interface RState {
  isLoading: boolean;
  isError: boolean;
  entries: MenuEntryCollection;
  filter?: string;
}

class EntryListDialog extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      entries: MenuEntryCollection.create(),
      isLoading: true,
      isError: false,
    };
  }

  componentDidMount() {
    const sportId = Sport.fromCode(this.props.sport);
    if (sportId) {
      ApiDataLoader.shared.loadAllMenuEntries(
        sportId,
        (status: number, data?: Array<MenuItem>) => {
          if (status === LoadStatus.SUCCESS) {
            this.setState({
              isLoading: false,
              entries: MenuEntryCollection.create(
                data,
                this.props.existingEntryIds
              ),
            });
          } else {
            this.setState({ isLoading: false, isError: true });
            if (
              LoadStatus.isAuthError(status) &&
              this.props.onError !== undefined
            ) {
              this.props.onError(status);
            }
          }
        }
      );
    } else {
      this.setState({ isLoading: false, isError: true });
    }
  }

  render(): React.ReactNode {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Grid container alignContent="center" alignItems="center">
            <Grid item sm={6} xs={12}>
              Entry list
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Filter"
                fullWidth
                value={this.state.filter || ""}
                onChange={(event) =>
                  this.setState({ filter: event.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterListIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent className={this.props.classes.noPadding} dividers>
          {this.renderContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.onClose()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    const entryList = this.state.entries.list(
      this.props.type,
      this.state.filter
    );
    let content: React.ReactNode;
    if (entryList.length === 0) {
      content = (
        <ListItem>
          <ListItemText secondary="There are no items available for this selection" />
        </ListItem>
      );
    } else {
      content = this.renderRows(entryList);
    }
    return (
      <MenuList dense className={this.props.classes.noPadding}>
        {content}
      </MenuList>
    );
  }

  private renderRows(data: Array<MenuItem>): React.ReactNode {
    const renderRow = (props: any) => {
      const item = data[props.index];
      const key = item.id;
      return (
        <div key={key} style={props.style}>
          {this.renderRow(item)}
        </div>
      );
    };
    return (
      <FixedSizeList
        itemCount={data.length}
        itemSize={30}
        width="100%"
        height={250}
      >
        {renderRow}
      </FixedSizeList>
    );
  }

  private renderRow(data: MenuItem): React.ReactNode {
    return (
      <MenuListItem onClick={() => this.onSelect(data)}>
        {this.state.entries.name(data.id)}
      </MenuListItem>
    );
  }

  private onSelect(item: MenuItem): void {
    if (this.props.onSelect) {
      this.props.onSelect(item);
    }
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

export default withStyles(styles)(EntryListDialog);
