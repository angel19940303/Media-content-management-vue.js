import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import React from "react";
import { BatchTranslateFormData } from "../../../../models/ui/batch-translate-form-data";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { Locale } from "../../../../models/common/locale";
import { AutoSizer, Column, Table } from "react-virtualized";
import {
  Grid,
  Input,
  InputBase,
  MenuItem,
  Select,
  TableCell,
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import { ConfigUtil } from "../../../../utils/config-util";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { CompareArrows, Highlight } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";

const Diff = require("diff");

const styles = (theme: Theme) =>
  createStyles({
    content: {
      height: 600,
      padding: 0,
      overflow: "hidden",
    },
    row: {},
    column: {
      flex: 1,
      marginLeft: 0,
      marginRight: 0,
      "&:first-of-type": {
        marginLeft: 0,
        marginRight: 0,
      },
    },
    cell: {
      display: "block",
      padding: "0 5px",
      fontSize: 14,
      borderRight: `1px solid rgba(224, 224, 224, 1)`,
      boxSizing: "border-box",
      "&:last-child": {
        paddingRight: 5,
      },
    },
    indexCell: {
      textAlign: "center",
      backgroundColor: `rgba(240, 240, 240, 1)`,
    },
    addedPart: {
      backgroundColor: `rgba(255, 255, 0, 1)`,
    },
    removedPart: {
      padding: 1,
      backgroundColor: `rgba(255, 192, 0, 1)`,
    },
    head: {
      display: "block",
      padding: "0 5px",
      fontSize: 14,
      backgroundColor: `rgba(224, 224, 224, 1)`,
      boxSizing: "border-box",
      "&:last-child": {
        paddingRight: 5,
      },
    },
    input: {
      fontSize: 14,

      "& input": {
        padding: 0,
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  data: BatchTranslateFormData;
  isOpen: boolean;
  onApply?: (data: Map<number, Locale>) => void;
  onClose?: () => void;
}

interface Selection {
  id: number;
  language: string;
  value: string;
}

interface RState {
  data: BatchTranslateFormData;
  filteredData?: BatchTranslateFormData;
  enabledLanguages: string[];
  selection?: Selection;
  highlightDifferences: boolean;
}

class BatchTranslateDialog extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    const filteredData = props.data.filteredDiffs(new Set<string>());
    this.state = {
      data: props.data,
      filteredData: filteredData,
      enabledLanguages: ConfigUtil.languages().map((lang) => lang.code),
      highlightDifferences: false,
    };
  }

  render(): React.ReactNode {
    return (
      <Dialog
        maxWidth="xl"
        fullWidth={true}
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="edit-mapping-dialog-title">
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              Batch data translation
            </Grid>
            <Grid item>
              <FormControl>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={this.state.enabledLanguages}
                  onChange={(event: any) => this.onLanguageChange(event)}
                  input={<Input />}
                >
                  {ConfigUtil.languages().map((language) => (
                    <MenuItem key={language.code} value={language.code}>
                      {language.shortCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <ToggleButtonGroup>
                <Tooltip title="Highlight differences">
                  <ToggleButton
                    value="highlight-diffs"
                    selected={this.state.highlightDifferences}
                    size="small"
                    onClick={() => this.onHighlightDiffSwitchChange()}
                  >
                    <Highlight />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title="Only show rows with differences">
                  <ToggleButton
                    value="hide-identical"
                    selected={this.state.filteredData !== undefined}
                    size="small"
                    onClick={() => this.onFilterSwitchChange()}
                  >
                    <CompareArrows />
                  </ToggleButton>
                </Tooltip>
              </ToggleButtonGroup>
            </Grid>
            <Grid item>
              <Button
                onClick={() => this.onTranslateSelectedClick()}
                variant="contained"
                color="primary"
              >
                Translate
              </Button>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers className={this.props.classes.content}>
          {this.renderContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.onApply()}>Apply</Button>
          <Button onClick={() => this.onClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  private renderContent(): React.ReactNode {
    const data = this.state.filteredData || this.state.data;
    const defaultLanguage = ConfigUtil.defaultLanguage();
    return (
      <AutoSizer>
        {({ width, height }) => (
          <Table
            rowCount={data.all().length}
            headerHeight={21}
            rowHeight={21}
            height={height}
            width={width}
            rowGetter={({ index }) => data.get(index)}
            rowClassName={this.props.classes.row}
          >
            <Column
              key="index"
              width={40}
              minWidth={40}
              maxWidth={40}
              dataKey="index"
              label="Row"
              headerRenderer={(props) => this.renderTableHeader(props.label)}
              cellRenderer={(props) =>
                this.renderIndexTableCell(props.cellData, props.rowData.id)
              }
              className={this.props.classes.column}
              headerClassName={this.props.classes.column}
            />
            {this.state.enabledLanguages.map((language) => {
              return (
                <Column
                  key={language}
                  width={600}
                  dataKey={language}
                  label={language}
                  headerRenderer={(props) =>
                    this.renderTableHeader(props.label)
                  }
                  cellRenderer={(props) =>
                    this.renderTableCell(
                      props.cellData,
                      props.dataKey,
                      props.rowData.id,
                      props.dataKey === defaultLanguage
                        ? undefined
                        : props.rowData[defaultLanguage] || ""
                    )
                  }
                  className={this.props.classes.column}
                  headerClassName={this.props.classes.column}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }

  private renderTableHeader(label: React.ReactNode): React.ReactNode {
    return (
      <TableCell
        component="div"
        variant="head"
        height={21}
        size="small"
        className={this.props.classes.head}
      >
        {label}
      </TableCell>
    );
  }

  private renderIndexTableCell(
    cellData: number,
    id: number | undefined
  ): React.ReactNode {
    const classNames = [this.props.classes.cell, this.props.classes.indexCell];
    if (id !== undefined && this.state.selection?.id === id) {
      classNames.push("selected");
    }
    return (
      <TableCell
        component="div"
        variant="body"
        height={21}
        size="small"
        className={classNames.join(" ")}
      >
        {cellData}
      </TableCell>
    );
  }

  private renderTableCell(
    cellData: string | undefined,
    columnData: string,
    id: number | undefined,
    refText: string | undefined
  ): React.ReactNode {
    return (
      <TableCell
        component="div"
        variant="body"
        height={21}
        onMouseDown={() => this.onCellClick(id, columnData, cellData)}
        size="small"
        className={this.props.classes.cell}
      >
        {this.state.selection !== undefined &&
        this.state.selection.id === id &&
        this.state.selection.language === columnData ? (
          <InputBase
            fullWidth
            value={this.state.selection.value}
            onChange={(event) => this.onSelectionEditChange(event)}
            onBlur={() => this.onSelectionEditBlur()}
            autoFocus={true}
            className={this.props.classes.input}
            onPaste={(event) => this.onPaste(event, id, columnData)}
          />
        ) : (
          this.renderCellValue(cellData, refText) || <>&nbsp;</>
        )}
      </TableCell>
    );
  }

  private renderCellValue(
    value: string | undefined,
    refText: string | undefined
  ): React.ReactNode {
    if (
      !this.state.highlightDifferences ||
      refText === undefined ||
      value === refText
    ) {
      return value;
    }
    const diffs = Diff.diffChars(refText, value || "");
    if (diffs.length === 1) {
      return value;
    }
    const valueParts = new Array<React.ReactNode>();
    diffs.forEach(
      (
        diff: {
          count: number;
          added: boolean | undefined;
          removed: boolean | undefined;
          value: string;
        },
        index: number
      ) => {
        if (diff.removed === true) {
          valueParts.push(
            <span
              className={this.props.classes.removedPart}
              key={"removed-" + index}
            />
          );
        } else if (diff.added === true) {
          valueParts.push(
            <span
              className={this.props.classes.addedPart}
              key={"added-" + index}
            >
              {diff.value}
            </span>
          );
        } else {
          valueParts.push(diff.value);
        }
      }
    );
    return valueParts;
  }

  private onApply(): void {
    if (this.props.onApply) {
      this.props.onApply(this.state.data.toLocales());
    }
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  private onSelectionEditChange(event: any): void {
    const value: string = event.target.value;
    this.setState((state) => {
      if (state.selection === undefined) {
        return { selection: undefined };
      }
      return {
        selection: {
          id: state.selection.id,
          language: state.selection.language,
          value: value,
        },
      };
    });
  }

  private onSelectionEditBlur(): void {
    this.setState((state) => {
      let newData = state.data;
      let newFilteredData = state.filteredData;
      if (state.selection !== undefined) {
        newData = newData.withTranslation(
          state.selection.id,
          state.selection.language,
          state.selection.value
        );
        if (newFilteredData !== undefined) {
          newFilteredData = newData.filteredDiffs(
            new Set<string>(state.enabledLanguages)
          );
        }
      }
      return { data: newData, filteredData: newFilteredData };
    });
  }

  private onCellClick(
    id: number | undefined,
    key: string,
    value: string | undefined
  ): void {
    this.setState((state) => {
      let newData = state.data;
      let newFilteredData = state.filteredData;
      if (state.selection !== undefined) {
        if (state.selection.id === id && state.selection.language === key) {
          return {
            data: newData,
            filteredData: newFilteredData,
            selection: state.selection,
          };
        }
        newData = newData.withTranslation(
          state.selection.id,
          state.selection.language,
          state.selection.value
        );
        if (newFilteredData !== undefined) {
          newFilteredData = newData.filteredDiffs(
            new Set<string>(state.enabledLanguages)
          );
        }
      }
      const newSelection =
        id !== undefined
          ? { id: id, language: key, value: value || "" }
          : undefined;
      return {
        data: newData,
        filteredData: newFilteredData,
        selection: newSelection,
      };
    });
  }

  private onLanguageChange(event: any): void {
    const newEnabledLanguages = event.target.value;
    this.setState((state) => {
      const newFilteredData = state.data.filteredDiffs(
        new Set<string>(newEnabledLanguages)
      );
      return {
        enabledLanguages: newEnabledLanguages,
        filteredData: newFilteredData,
      };
    });
  }

  private onTranslateSelectedClick(): void {
    this.setState((state) => {
      const newData = state.data.withTranslatedLanguages(
        state.enabledLanguages
      );
      const newFilteredData =
        state.filteredData === undefined
          ? undefined
          : newData.filteredDiffs(new Set<string>(state.enabledLanguages));
      return { data: newData, filteredData: newFilteredData };
    });
  }

  private onHighlightDiffSwitchChange(): void {
    this.setState((state) => {
      return { highlightDifferences: !state.highlightDifferences };
    });
  }

  private onFilterSwitchChange(): void {
    this.setState((state) => {
      const newFilteredData =
        state.filteredData === undefined
          ? state.data.filteredDiffs(new Set<string>(state.enabledLanguages))
          : undefined;
      return { filteredData: newFilteredData };
    });
  }

  private onPaste(
    event: any,
    id: number | undefined,
    language: string | undefined
  ): void {
    if (id === undefined || language === undefined) {
      return;
    }
    const windowObj: any = window;
    const clipboardData = event.clipboardData || windowObj.clipboardData;
    if (clipboardData === undefined || clipboardData === null) {
      return;
    }
    const pasteText: string | undefined | null = clipboardData.getData("text");
    if (pasteText === undefined || pasteText === null) {
      return;
    }
    const pasteRows = pasteText.trimEnd().split("\n");
    if (pasteRows.length <= 1) {
      return;
    }
    event.preventDefault();
    this.setState((state) => {
      const newData = state.data.withTranslationBatch(id, language, pasteRows);
      const newFilteredData =
        state.filteredData === undefined
          ? undefined
          : newData.filteredDiffs(new Set<string>(state.enabledLanguages));
      return {
        data: newData,
        filteredData: newFilteredData,
        selection: undefined,
      };
    });
  }
}

export default withStyles(styles)(BatchTranslateDialog);
