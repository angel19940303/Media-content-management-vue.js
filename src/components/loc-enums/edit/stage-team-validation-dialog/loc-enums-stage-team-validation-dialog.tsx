import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { ApiDataLoader } from "../../../../api/api-data-loader";
import { Sport } from "../../../../models/enums/sport";
import { LoadStatus } from "../../../../models/enums/load_status";
import LoadingIndicator from "../../../common/loading-indicator";
import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { LocEnumItemListBuilder } from "../../../../models/loc-enums/builders/loc-enum-item-list-builder";
import { LocEnumItemList } from "../../../../models/loc-enums/loc-enum-item-list";
import { MappedParticipant } from "../../../../models/mapping/mapped-participant";
import { LocEnumItem } from "../../../../models/loc-enums/loc-enum-item";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import LocaleInput from "../../../common/locale-input";
import { Locale } from "../../../../models/common/locale";
import { LocaleBuilder } from "../../../../models/common/builders/locale-builder";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { ConfigUtil } from "../../../../utils/config-util";
import MasterError from "../../../master-error";

const styles = (theme: Theme) =>
  createStyles({
    noPadding: {
      padding: 0,
    },
    stageTeamDialogBody: {
      height: 400,
      padding: 0,
    },
    stageTeamDialogStep2Progress: {
      padding: 15,
    },
    stageTeamDialogStep2Result: {
      padding: "15px 25px",
    },
    stageTeamDialogSubMenuItem: {
      backgroundColor: theme.palette.grey["100"],
    },
    localeEdit: {
      width: 150,
    },
    noMinWidth: {
      minWidth: "unset",
    },
    successNote: {
      padding: "16px 24px",
    },
  });

interface SelectedLocale {
  index: number;
  locale: Locale;
}

interface RProps extends WithStyles<typeof styles> {
  sport: string;
  providerId: number;
  isOpen: boolean;
  data: Array<LocEnumItem>;
  onApply?: (enumList: LocEnumItemList) => void;
  onClose?: () => void;
}

interface RState {
  data: LocEnumItemList;
  mappedParticipants: Map<string, string>;
  nameDifferences: Array<[string, string, number]>;
  isLoading: boolean;
  isError: boolean;
  selectedLocale?: SelectedLocale;
}

class LocEnumsStageTeamValidationDialog extends React.Component<
  RProps,
  RState
> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      data: LocEnumItemListBuilder.create().setItems(props.data).build(),
      mappedParticipants: new Map<string, string>(),
      nameDifferences: [],
      isLoading: true,
      isError: false,
    };
  }

  componentDidMount(): void {
    this.load();
  }

  private load() {
    const sportId = Sport.fromCode(this.props.sport);
    if (sportId === undefined) {
      this.setState({ isLoading: false, isError: true });
      return;
    }
    ApiDataLoader.shared.loadMappedParticipants(
      this.props.sport,
      this.props.providerId,
      (status, data) => {
        if (status === LoadStatus.SUCCESS && data !== undefined) {
          const mappedParticipants = MappedParticipant.nameListFromData(data);
          const nameDifferences = this.state.data.detectNameDifferences(
            mappedParticipants,
            this.props.providerId
          );
          this.setState({
            isLoading: false,
            mappedParticipants: mappedParticipants,
            nameDifferences: nameDifferences,
          });
        } else {
          this.setState({ isLoading: false, isError: true });
        }
      }
    );
  }

  render(): React.ReactNode {
    return (
      <Dialog
        maxWidth={"sm"}
        fullWidth={true}
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="edit-mapping-dialog-title">
          Validation of localized team names
        </DialogTitle>
        <DialogContent
          className={this.props.classes.stageTeamDialogBody}
          dividers
        >
          {this.renderContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.onApply()} color="primary">
            Apply
          </Button>
          <Button onClick={() => this.onClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    if (this.state.isError) {
      return <MasterError type="unknown" />;
    }
    if (this.state.nameDifferences.length === 0) {
      return (
        <div className={this.props.classes.successNote}>
          <Grid container alignContent="center" alignItems="center">
            <Grid item>
              <CheckCircleOutlineIcon fontSize="large" />
            </Grid>
            <Grid item>
              <Typography variant="h6" component="div">
                All localized names are in sync with mappings.
              </Typography>
            </Grid>
          </Grid>
        </div>
      );
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Mapped name</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.nameDifferences.map(
              ([name, mappedName, index], rowIndex) =>
                this.renderRow(name, mappedName, index, rowIndex)
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  private renderRow(
    name: string,
    mappedName: string,
    index: number,
    rowIndex: number
  ): React.ReactNode {
    const item = this.state.data.items[index];
    return (
      <TableRow key={index}>
        <TableCell>{this.renderItemName(item, index)}</TableCell>
        <TableCell>{mappedName}</TableCell>
        <TableCell>
          <IconButton onClick={() => this.onRowDelete(rowIndex)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  private renderItemName(item: LocEnumItem, index: number): React.ReactNode {
    if (
      this.state.selectedLocale !== undefined &&
      index === this.state.selectedLocale.index
    ) {
      return (
        <Grid container>
          <Grid item>
            <LocaleInput
              locale={this.state.selectedLocale.locale}
              label="Name"
              language={ConfigUtil.defaultLanguage()}
              onChange={(locale: Locale) =>
                this.onNameLocaleInputChange(locale)
              }
              className={this.props.classes.localeEdit}
            />
          </Grid>
          <Grid item>
            <IconButton onClick={() => this.onNameLocaleConfirmClick()}>
              <DoneIcon />
            </IconButton>
          </Grid>
        </Grid>
      );
    }
    return (
      <Button
        className={this.props.classes.noMinWidth}
        onClick={() => this.onNameClick(item, index)}
      >
        {item.title}
      </Button>
    );
  }

  private onNameClick(item: LocEnumItem, index: number): void {
    this.setState({
      selectedLocale: {
        locale: LocaleBuilder.fromLocale(item.name).build(),
        index,
      },
    });
  }

  private onNameLocaleInputChange(locale: Locale): void {
    this.setState((state) => {
      if (state.selectedLocale === undefined) {
        return { selectedLocale: undefined };
      }
      return {
        selectedLocale: { locale: locale, index: state.selectedLocale.index },
      };
    });
  }

  private onNameLocaleConfirmClick(): void {
    this.setState((state) => {
      if (state.selectedLocale !== undefined) {
        const item = state.data.items[state.selectedLocale.index];
        const newData = state.data.update(
          new LocEnumItem(
            item.providerIds,
            item.sportId,
            state.selectedLocale.locale
          ),
          state.selectedLocale.index
        );
        const newRows = newData.detectNameDifferences(
          state.mappedParticipants,
          this.props.providerId
        );
        return {
          data: newData,
          nameDifferences: newRows,
          selectedLocale: undefined,
        };
      }
      return {
        data: state.data,
        nameDifferences: state.nameDifferences,
        selectedLocale: undefined,
      };
    });
  }

  private onRowDelete(rowIndex: number): void {
    this.setState((state) => {
      const row = state.nameDifferences[rowIndex];
      const newData = state.data.remove(row[2]);
      const newRows = newData.detectNameDifferences(
        state.mappedParticipants,
        this.props.providerId
      );
      return {
        data: newData,
        nameDifferences: newRows,
        selectedLocale: undefined,
      };
    });
  }

  private onApply(): void {
    this.resetState();
    if (this.props.onApply) {
      this.props.onApply(
        LocEnumItemListBuilder.create().setItems(this.state.data.items).build()
      );
    }
  }

  private onClose(): void {
    this.resetState();
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  private resetState(): void {
    this.setState({
      isLoading: true,
      isError: false,
    });
  }
}

export default withStyles(styles)(LocEnumsStageTeamValidationDialog);
