import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import { NewsTag } from "../../../models/news/news-tag";
import { NewsTagType } from "../../../models/enums/news-tag-type";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const styles = () =>
  createStyles({
    noPadding: {
      padding: 0,
    },
    editCell: {
      paddingTop: 10,
      paddingBottom: 5,
    },
    editFieldCell: {
      paddingLeft: 5,
      paddingRight: 5,
    },
    emptyMessage: {
      padding: 20,
    },
    content: {
      padding: 0,
      height: 360,
      overflow: "auto",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  stageTags: Array<[string, NewsTag]>;
  participantTags: Array<[string, NewsTag]>;
  isOpen: boolean;
  onUpdate?: (
    stageTags: Array<[string, NewsTag]>,
    participantTags: Array<[string, NewsTag]>
  ) => void;
  onClose?: () => void;
}

interface RState {
  tags: Array<[string, string, string, number, number]>;
  isIdEdited: boolean;
  isMetaEdited: boolean;
  isKeyEdited: boolean;
  selectedId?: number;
}

class NewsEntryEditTagsDialog extends React.Component<RProps, RState> {
  private id = 0;

  constructor(props: RProps) {
    super(props);
    const tags = new Array<[string, string, string, number, number]>();
    let id = 0;
    if (props.stageTags !== undefined && props.stageTags !== null) {
      props.stageTags.forEach(([key, tag]) =>
        tags.push([tag.ID || "", key, tag.Meta, NewsTagType.STAGE, id])
      );
      id++;
    }
    if (props.participantTags !== undefined && props.participantTags !== null) {
      props.participantTags.forEach(([key, tag]) =>
        tags.push([tag.ID || "", key, tag.Meta, NewsTagType.PARTICIPANT, id])
      );
      id++;
    }
    tags.sort((t1, t2) => (t1[1] === t2[1] ? 0 : t1[1] < t2[1] ? -1 : 1));
    this.state = {
      tags: tags,
      isIdEdited: false,
      isKeyEdited: false,
      isMetaEdited: false,
    };
    this.id = id;
  }

  render(): React.ReactNode {
    return (
      <Dialog
        open={this.props.isOpen}
        maxWidth="sm"
        fullWidth
        onClose={() => this.handleCloseClick()}
      >
        <DialogTitle>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Typography component="h2" variant="h6">
                Tags
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={() => this.handleAddClick()} size="small">
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent className={this.props.classes.content} dividers>
          {this.renderContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleSaveClick()} color="primary">
            Save
          </Button>
          <Button onClick={() => this.handleCloseClick()}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.state.tags.length === 0) {
      return (
        <div className={this.props.classes.emptyMessage}>
          There are no tags available
        </div>
      );
    }
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Key</TableCell>
            <TableCell>Meta</TableCell>
            <TableCell>Type</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.tags.map((tagItem) => this.renderRow(tagItem))}
        </TableBody>
      </Table>
    );
  }

  private renderRow(
    item: [string, string, string, number, number]
  ): React.ReactNode {
    if (
      this.state.selectedId !== undefined &&
      item[4] === this.state.selectedId
    ) {
      return this.renderEditRow(item);
    } else {
      return this.renderListRow(item);
    }
  }

  private renderListRow(
    item: [string, string, string, number, number]
  ): React.ReactNode {
    return (
      <TableRow key={item[4]}>
        <TableCell>{item[0]}</TableCell>
        <TableCell>{item[1]}</TableCell>
        <TableCell>{item[2]}</TableCell>
        <TableCell>{NewsTagType.title(item[3])}</TableCell>
        <TableCell align="right" width={92}>
          <IconButton
            onClick={() => this.handleTagEditClick(item[4])}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => this.handleTagDeleteClick(item[4])}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  private renderEditRow(
    item: [string, string, string, number, number]
  ): React.ReactNode {
    const isIdValid = !this.state.isIdEdited || this.isItemIdValid(item);
    const isKeyValid = !this.state.isKeyEdited || this.isItemKeyValid(item);
    const isMetaValid = !this.state.isMetaEdited || this.isItemMetaValid(item);
    const fieldCellClassName = [
      this.props.classes.editCell,
      this.props.classes.editFieldCell,
    ].join(" ");
    return (
      <TableRow key={item[4]}>
        <TableCell padding="none" valign="top" className={fieldCellClassName}>
          <TextField
            fullWidth
            size="small"
            label="ID"
            variant="outlined"
            error={!isIdValid}
            value={item[0]}
            onChange={(event) => this.handleEditTagIdChange(event)}
          />
        </TableCell>
        <TableCell padding="none" valign="top" className={fieldCellClassName}>
          <TextField
            fullWidth
            size="small"
            label="Key"
            variant="outlined"
            error={!isKeyValid}
            value={item[1]}
            onChange={(event) => this.handleEditTagKeyChange(event)}
          />
        </TableCell>
        <TableCell padding="none" valign="top" className={fieldCellClassName}>
          <TextField
            fullWidth
            size="small"
            label="Meta"
            variant="outlined"
            error={!isMetaValid}
            value={item[2]}
            onChange={(event) => this.handleEditTagMetaChange(event)}
          />
        </TableCell>
        <TableCell padding="none" valign="top" className={fieldCellClassName}>
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={item[3]}
              onChange={(event) => this.handleEditTagTypeChange(event)}
              label="Provider"
            >
              {NewsTagType.all().map((type) => (
                <MenuItem key={type} value={type}>
                  {NewsTagType.title(type)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell
          align="right"
          width={92}
          className={this.props.classes.editCell}
        >
          <IconButton onClick={() => this.handleEditApplyClick()} size="small">
            <CheckIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  private handleAddClick(): void {
    this.setState((state) => {
      const newTags = Array.from(state.tags);
      const id = this.id;
      newTags.unshift(["", "", "", NewsTagType.STAGE, id]);
      this.id++;
      return {
        tags: newTags,
        selectedId: id,
        isIdEdited: false,
        isKeyEdited: false,
        isMetaEdited: false,
      };
    });
  }

  private handleEditTagIdChange(event: any): void {
    this.updateTags(0, event.target.value);
  }

  private handleEditTagKeyChange(event: any): void {
    this.updateTags(1, event.target.value);
  }

  private handleEditTagMetaChange(event: any): void {
    this.updateTags(2, event.target.value);
  }

  private handleEditApplyClick(): void {
    this.setState((state) => {
      if (state.selectedId !== undefined) {
        const item = state.tags.find((item) => item[4] === state.selectedId);
        if (
          item !== undefined &&
          (!this.isItemIdValid(item) ||
            !this.isItemKeyValid(item) ||
            !this.isItemMetaValid(item))
        ) {
          return {
            selectedId: state.selectedId,
            isIdEdited: true,
            isKeyEdited: true,
            isMetaEdited: true,
          };
        }
      }
      return {
        selectedId: undefined,
        isIdEdited: false,
        isKeyEdited: false,
        isMetaEdited: false,
      };
    });
  }

  private updateTags(index: number, value: any): void {
    this.setState((state) => {
      let isIdEdited = state.isIdEdited;
      let isKeyEdited = state.isKeyEdited;
      let isMetaEdited = state.isMetaEdited;
      const newTags = Array.from(state.tags);
      if (state.selectedId !== undefined) {
        const selectedTag = newTags.find(
          (item) => item[4] === state.selectedId
        );
        if (selectedTag !== undefined) {
          selectedTag[index] = value;
          isIdEdited = isIdEdited || index === 0;
          isKeyEdited = isKeyEdited || index === 1;
          isMetaEdited = isMetaEdited || index === 2;
        }
      }
      return {
        tags: newTags,
        isIdEdited: isIdEdited,
        isKeyEdited: isKeyEdited,
        isMetaEdited: isMetaEdited,
      };
    });
  }

  private handleEditTagTypeChange(event: any): void {
    this.updateTags(3, event.target.value);
  }

  private handleTagEditClick(id: number): void {
    this.setState({
      selectedId: id,
      isIdEdited: false,
      isKeyEdited: false,
      isMetaEdited: false,
    });
  }

  private handleTagDeleteClick(id: number): void {
    this.setState((state) => {
      const newTags = state.tags.filter((item) => item[3] !== id);
      return { tags: newTags };
    });
  }

  private handleSaveClick(): void {
    const participantTags = new Array<[string, NewsTag]>();
    const stageTags = new Array<[string, NewsTag]>();
    this.state.tags.forEach(([id, key, meta, type]) => {
      if (id.length > 0 && key.length > 0 && meta.length > 0) {
        const newsTag: NewsTag = { ID: id, Meta: meta };
        if (type === NewsTagType.STAGE) {
          stageTags.push([key, newsTag]);
        } else if (type === NewsTagType.PARTICIPANT) {
          participantTags.push([key, newsTag]);
        }
      }
    });
    this.resetState();
    if (this.props.onUpdate) {
      this.props.onUpdate(stageTags, participantTags);
    }
  }

  private handleCloseClick(): void {
    this.resetState();
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  private resetState(): void {
    this.setState((state) => {
      const newTags = state.tags.filter(
        (tag) => this.isItemIdValid(tag) && this.isItemMetaValid(tag)
      );
      return {
        tags: newTags,
        selectedId: undefined,
        isIdEdited: false,
        isKeyEdited: false,
        isMetaEdited: false,
      };
    });
  }

  private isItemIdValid(
    item: [string, string, string, number, number]
  ): boolean {
    return item[0].length > 0;
  }

  private isItemKeyValid(
    item: [string, string, string, number, number]
  ): boolean {
    return (
      item[1].length > 0 &&
      this.state.tags.filter((i) => i[1] === item[1] && i[3] === item[3])
        .length === 1
    );
  }

  private isItemMetaValid(
    item: [string, string, string, number, number]
  ): boolean {
    return item[2].length > 0;
  }
}

export default withStyles(styles)(NewsEntryEditTagsDialog);
