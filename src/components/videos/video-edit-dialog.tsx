import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { MatchVideoEntryFormData } from "../../models/ui/match-video-entry-form-data";
import VideoPreviewComponent from "../common/video-preview-component";
import { FormHelperText, Grid, InputLabel, TextField } from "@material-ui/core";
import { EnumList } from "../../models/common/enum-list";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { DateUtil } from "../../utils/date-util";
import { VideoType } from "../../models/enums/video-type";

const styles = () =>
  createStyles({
    title: {},
    content: {},
    videoPreview: {
      marginBottom: 20,
    },
  });

interface RProps extends WithStyles<typeof styles> {
  enums: EnumList;
  video?: MatchVideoEntryFormData;
  onChange?: (video: MatchVideoEntryFormData) => void;
  onClose?: () => void;
}

interface RState {
  video?: MatchVideoEntryFormData;
  previewUrl?: string;
}

class VideoEditDialog extends React.PureComponent<RProps, RState> {
  private static readonly VIDEO_PREVIEW_UPDATE_DELAY_MS = 500;

  private scheduledPreviewUpdate: any | null = null;

  constructor(props: RProps) {
    super(props);
    this.state = { video: undefined };
  }

  componentWillUnmount(): void {
    this.cancelScheduledPreviewUpdate();
  }

  render(): React.ReactNode {
    return (
      <Dialog
        open={this.props.video !== undefined}
        onClose={() => this.onClose()}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className={this.props.classes.title}>
          Video Detail
        </DialogTitle>
        <DialogContent className={this.props.classes.content} dividers>
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

  reset(): void {
    this.setState({ video: undefined, previewUrl: undefined });
  }

  private renderContent(): React.ReactNode {
    const video = this.state.video || this.props.video;
    if (video === undefined) {
      return undefined;
    }
    const url = this.state.previewUrl || video.url;
    return (
      <>
        <VideoPreviewComponent
          url={url}
          className={this.props.classes.videoPreview}
          height={360}
        />
        {this.renderForm(video)}
      </>
    );
  }

  private renderForm(video: MatchVideoEntryFormData): React.ReactNode {
    return (
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField
            fullWidth
            size="small"
            label="URL"
            variant="outlined"
            error={!video.validation.isUrlValid}
            value={video.url}
            helperText={video.validation.urlErrors}
            onChange={(event) => this.onUrlChange(event)}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={video.type}
              onChange={(event) => this.onTypeSelect(event)}
              label="Type"
            >
              {VideoType.ALL.map((type) => (
                <MenuItem key={type} value={type}>
                  {VideoType.titleForType(type)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <TextField
            label="Date"
            type="datetime-local"
            value={DateUtil.dateToDatePickerString(video.date)}
            variant="outlined"
            size="small"
            onChange={(event) => this.onDateChange(event)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            error={!video.validation.isLanguageValid}
          >
            <InputLabel>Language</InputLabel>
            <Select
              value={video.language}
              onChange={(event) => this.onLanguageSelect(event)}
              label="Language"
            >
              {this.props.enums.getLanguages().map((language) => (
                <MenuItem key={language} value={language}>
                  {this.props.enums.languageNameForCode(language)}
                </MenuItem>
              ))}
            </Select>
            {video.validation.isLanguageValid ? (
              ""
            ) : (
              <FormHelperText>{video.validation.languageErrors}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    );
  }

  private onApply(): void {
    const video = this.state.video || this.props.video;
    if (this.props.onChange && video !== undefined) {
      const validatedVideo = video.validated(this.props.enums);
      if (validatedVideo.validation.isValid) {
        this.props.onChange(validatedVideo);
      } else {
        this.setState({ video: validatedVideo });
      }
    } else {
      this.onClose();
    }
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  private onUrlChange(event: any) {
    const newUrl: string = event.target.value;
    this.setState((state) => {
      const video = state.video || this.props.video;
      const newPreviewUrl = state.previewUrl || video?.url;
      return { video: video?.withUrl(newUrl), previewUrl: newPreviewUrl };
    });
    this.schedulePreviewUpdate();
  }

  private onTypeSelect(event: any): void {
    const newType: number = event.target.value;
    this.setState((state) => {
      const video = state.video || this.props.video;
      return { video: video?.withType(newType) };
    });
  }

  private onLanguageSelect(event: any): void {
    const newLanguage: string = event.target.value;
    this.setState((state) => {
      const video = state.video || this.props.video;
      return { video: video?.withLanguage(newLanguage, this.props.enums) };
    });
  }

  private onDateChange(event: any): void {
    const dateStr = event.target.value;
    const timestamp = DateUtil.datePickerStringToApiTimestamp(dateStr);
    const date =
      timestamp === undefined
        ? undefined
        : DateUtil.apiTimestampToDate(timestamp, false);
    if (date !== undefined) {
      this.setState((state) => {
        const video = state.video || this.props.video;
        return { video: video?.withDate(date) };
      });
    }
  }

  private schedulePreviewUpdate(): void {
    this.cancelScheduledPreviewUpdate();
    this.scheduledPreviewUpdate = setTimeout(() => {
      this.setState((state) => {
        return { previewUrl: state.video?.url };
      });
    }, VideoEditDialog.VIDEO_PREVIEW_UPDATE_DELAY_MS);
  }

  private cancelScheduledPreviewUpdate(): void {
    if (this.scheduledPreviewUpdate !== null) {
      clearTimeout(this.scheduledPreviewUpdate);
      this.scheduledPreviewUpdate = null;
    }
  }
}

export default withStyles(styles)(VideoEditDialog);
