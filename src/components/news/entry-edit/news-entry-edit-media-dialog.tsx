import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { NewsMedium } from "../../../models/news/news-medium";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  OutlinedInput,
  Tab,
  Tabs,
  TextField,
} from "@material-ui/core";
import { NewsMediaType } from "../../../models/enums/news-media-type";
import DeleteIcon from "@material-ui/icons/Delete";
import { Audiotrack, Videocam, YouTube } from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import { ValidationUtil } from "../../../utils/validation-util";
import FormControl from "@material-ui/core/FormControl";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const styles = () =>
  createStyles({
    noPadding: {
      padding: 0,
    },
    listContainer: {
      height: 250,
      overflow: "auto",
    },
    emptyMessage: {
      padding: 15,
    },
    imgAvatar: {
      width: 50,
      height: 50,
    },
    imagePreview: {
      width: "100%",
      height: 360,
      overflow: "auto",
      textAlign: "center",
      backgroundColor: "#333",
      "& img": {
        verticalAlign: "middle",
      },
    },
    videoPreview: {
      width: "100%",
      height: 360,
      backgroundColor: "#333",
      textAlign: "center",
      "& iframe": {
        height: 360,
        verticalAlign: "middle",
      },
      "& video": {
        height: 360,
        verticalAlign: "middle",
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  selectedType: number;
  images: Array<NewsMedium>;
  videos: Array<NewsMedium>;
  audios: Array<NewsMedium>;
  onUpdate?: (
    images: Array<NewsMedium>,
    videos: Array<NewsMedium>,
    audios: Array<NewsMedium>
  ) => void;
  onClose?: () => void;
}

interface Selection {
  item: NewsMedium;
  index: number;
  url: string;
  type: string;
  isValidUrl: boolean;
  isEdited: boolean;
}

interface RState {
  images: Array<NewsMedium>;
  videos: Array<NewsMedium>;
  audios: Array<NewsMedium>;
  selectedType?: number;
  selection?: Selection;
}

class NewsEntryEditMediaDialog extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      images: props.images,
      videos: props.videos,
      audios: props.audios,
    };
  }

  private static isYoutubeUrl(url: string): boolean {
    return (
      url.indexOf("://youtube.") >= 0 ||
      url.indexOf("://www.youtube.") >= 0 ||
      url.indexOf("://youtu.be") >= 0 ||
      url.indexOf("://www.youtu.be") >= 0
    );
  }

  render(): React.ReactNode {
    return (
      <Dialog
        open={this.props.isOpen}
        maxWidth="md"
        fullWidth
        onClose={() => this.handleCloseClick()}
      >
        {this.state.selection !== undefined
          ? this.renderEdit()
          : this.renderList()}
      </Dialog>
    );
  }

  private renderList(): React.ReactNode {
    const selectedType = this.selectedType();
    return (
      <>
        <DialogTitle className={this.props.classes.noPadding}>
          <Grid container alignItems="center">
            <Grid item>
              <Tabs
                value={selectedType}
                onChange={(event, newValue) => this.handleTabChange(newValue)}
              >
                {NewsMediaType.all().map((type) => (
                  <Tab
                    label={NewsMediaType.title(type)}
                    id={`news-media-dialog-tab-${type}`}
                    aria-controls={`news-media-dialog-tab-panel-${type}`}
                    key={`tab-${type}`}
                  />
                ))}
              </Tabs>
            </Grid>
            <Grid item>
              <IconButton size="small" onClick={() => this.handleAddClick()}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent className={this.props.classes.noPadding} dividers>
          {NewsMediaType.all().map((type) => (
            <div
              key={`tab-panel-${type}`}
              role="tabpanel"
              id={`news-media-dialog-tab-panel-${type}`}
              aria-labelledby={`news-media-dialog-${type}`}
              hidden={type !== selectedType}
              className={this.props.classes.listContainer}
            >
              {this.renderTabContent(type)}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleSaveClick()} color="primary">
            Save
          </Button>
          <Button onClick={() => this.handleCloseClick()}>Close</Button>
        </DialogActions>
      </>
    );
  }

  private renderEdit(): React.ReactNode {
    if (this.state.selection === undefined) {
      return undefined;
    }
    const isValidUrl =
      !this.state.selection.isEdited || this.state.selection.isValidUrl;
    let errorMessage: string | undefined = undefined;
    if (!isValidUrl) {
      errorMessage = "url is invalid";
    }
    return (
      <>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {this.renderEditPreview(this.state.selection.item)}
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant="outlined"
                size="small"
                fullWidth
                error={!isValidUrl}
              >
                <InputLabel>URL</InputLabel>
                <OutlinedInput
                  value={this.state.selection.url || ""}
                  onChange={(event) => this.handleEditUrlChange(event)}
                  onBlur={() => this.handleEditUrlBlur()}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="toggle password visibility"
                        edge="end"
                        onClick={() => this.handleEditUrlBlur()}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={28}
                />
                <FormHelperText>{errorMessage}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Type"
                variant="outlined"
                value={this.state.selection.type || ""}
                onChange={(event) => this.handleEditTypeChange(event)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleEditApplyClick()} color="primary">
            Apply
          </Button>
          <Button onClick={() => this.handleEditCancelClick()}>Cancel</Button>
        </DialogActions>
      </>
    );
  }

  private renderEditPreview(item: NewsMedium): React.ReactNode {
    const isValidUrl = ValidationUtil.isValidUrl(item.URL);
    switch (this.selectedType()) {
      case NewsMediaType.IMAGE:
        return (
          <div className={this.props.classes.imagePreview}>
            {isValidUrl ? <img src={item.URL} alt="" /> : ""}
          </div>
        );
      case NewsMediaType.VIDEO:
        let content: React.ReactNode = undefined;
        if (isValidUrl && NewsEntryEditMediaDialog.isYoutubeUrl(item.URL)) {
          content = (
            <iframe
              id="ytplayer"
              title="Youtube player"
              width="640"
              height="360"
              key={item.URL}
              src={item.URL}
              frameBorder="0"
            />
          );
        } else if (isValidUrl) {
          content = (
            <video controls height={360} key={item.URL}>
              <source src={item.URL} />
            </video>
          );
        }
        return <div className={this.props.classes.videoPreview}>{content}</div>;
      case NewsMediaType.AUDIO:
        return (
          <div>
            {isValidUrl ? (
              <audio controls key={item.URL}>
                <source src={item.URL} />
              </audio>
            ) : (
              ""
            )}
          </div>
        );
    }
    return undefined;
  }

  private renderTabContent(type: number): React.ReactNode {
    const data = this.dataForType(type);
    if (data.length === 0) {
      return (
        <div className={this.props.classes.emptyMessage}>
          There are no {NewsMediaType.title(type).toLowerCase()} available
        </div>
      );
    }
    return (
      <div>
        <List dense>
          {data.map((item: NewsMedium, index: number) => {
            return (
              <ListItem
                key={index}
                button
                onClick={() => this.handleItemClick(item, index)}
              >
                <ListItemAvatar>
                  {type === NewsMediaType.IMAGE ? (
                    <Avatar
                      src={item.URL}
                      variant="rounded"
                      className={this.props.classes.imgAvatar}
                    />
                  ) : (
                    <Avatar variant="rounded">
                      {type === NewsMediaType.VIDEO ? (
                        NewsEntryEditMediaDialog.isYoutubeUrl(item.URL) ? (
                          <YouTube />
                        ) : (
                          <Videocam />
                        )
                      ) : (
                        <Audiotrack />
                      )}
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText primary={item.URL} secondary={item.Type} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => this.handleItemDeleteClick(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }

  private handleTabChange(newValue: any): void {
    this.setState({ selectedType: newValue });
  }

  private handleAddClick(): void {
    this.setState({
      selection: {
        item: { ID: undefined, URL: "", Type: "" },
        index: -1,
        url: "",
        type: "",
        isValidUrl: false,
        isEdited: false,
      },
    });
  }

  private handleItemClick(item: NewsMedium, index: number): void {
    this.setState({
      selection: {
        item: { ...item },
        index: index,
        url: item.URL,
        type: item.Type,
        isValidUrl: ValidationUtil.isValidUrl(item.URL),
        isEdited: false,
      },
    });
  }

  private handleItemDeleteClick(index: number): void {
    this.setState((state) => {
      switch (this.selectedType(state)) {
        case NewsMediaType.IMAGE:
          const newImages = Array.from(state.images);
          newImages.splice(index, 1);
          return {
            images: newImages,
            videos: state.videos,
            audios: state.audios,
          };
        case NewsMediaType.VIDEO:
          const newVideos = Array.from(state.videos);
          newVideos.splice(index, 1);
          return {
            images: state.images,
            videos: newVideos,
            audios: state.audios,
          };
        case NewsMediaType.AUDIO:
          const newAudios = Array.from(state.audios);
          newAudios.splice(index, 1);
          return {
            images: state.images,
            videos: state.videos,
            audios: newAudios,
          };
      }
      return {
        images: state.images,
        videos: state.videos,
        audios: state.audios,
      };
    });
  }

  private handleSaveClick(): void {
    if (this.props.onUpdate) {
      const images = Array.from(this.state.images);
      const videos = Array.from(this.state.videos);
      const audios = Array.from(this.state.audios);
      this.props.onUpdate(images, videos, audios);
      this.setState({ selectedType: undefined });
    } else {
      this.handleCloseClick();
    }
  }

  private handleCloseClick(): void {
    this.setState({ selectedType: undefined, selection: undefined });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  private handleEditUrlChange(event: any): void {
    const value = event.target.value;
    this.setState((state) => {
      if (state.selection === undefined) {
        return {};
      }
      const newSelection = { ...state.selection };
      newSelection.url = value;
      newSelection.isValidUrl = ValidationUtil.isValidUrl(value);
      newSelection.isEdited = true;
      return { selection: newSelection };
    });
  }

  private handleEditUrlBlur(): void {
    this.setState((state) => {
      if (state.selection === undefined) {
        return {};
      }
      const newSelection = { ...state.selection };
      const newItem = { ...state.selection.item };
      newItem.URL = newSelection.url;
      newSelection.item = newItem;
      return { selection: newSelection };
    });
  }

  private handleEditTypeChange(event: any): void {
    const value = event.target.value;
    this.setState((state) => {
      if (state.selection === undefined) {
        return {};
      }
      const newSelection = { ...state.selection };
      newSelection.type = value;
      return { selection: newSelection };
    });
  }

  private handleEditApplyClick(): void {
    this.setState((state) => {
      const selectedType = this.selectedType(state);
      const data = Array.from(this.dataForType(selectedType, state));
      if (state.selection !== undefined) {
        const newItem: NewsMedium = {
          ID: state.selection.item.ID,
          URL: state.selection.url,
          Type: state.selection.type,
        };
        if (state.selection.index < 0 || state.selection.index > data.length) {
          data.push(newItem);
        } else {
          data.splice(state.selection.index, 1, newItem);
        }
      }
      const newState: Pick<
        RState,
        "images" | "audios" | "videos" | "selection"
      > = {
        images: state.images,
        videos: state.videos,
        audios: state.audios,
        selection: undefined,
      };
      switch (selectedType) {
        case NewsMediaType.IMAGE:
          newState.images = data;
          break;
        case NewsMediaType.VIDEO:
          newState.videos = data;
          break;
        case NewsMediaType.AUDIO:
          newState.audios = data;
          break;
      }
      return newState;
    });
  }

  private handleEditCancelClick(): void {
    this.setState({ selection: undefined });
  }

  private selectedType(state?: RState): number {
    const currentState = state || this.state;
    return currentState.selectedType !== undefined
      ? currentState.selectedType
      : this.props.selectedType;
  }

  private dataForType(type: number, state?: RState): Array<NewsMedium> {
    const currentState = state || this.state;
    switch (type) {
      case NewsMediaType.IMAGE:
        return currentState.images;
      case NewsMediaType.VIDEO:
        return currentState.videos;
      case NewsMediaType.AUDIO:
        return currentState.audios;
    }
    return [];
  }
}

export default withStyles(styles)(NewsEntryEditMediaDialog);
