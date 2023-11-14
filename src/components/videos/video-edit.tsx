import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { Match } from "../../models/api-data/match";
import { MatchVideoFormData } from "../../models/ui/match-video-form-data";
import { ApiDataLoader } from "../../api/api-data-loader";
import { LoadStatus } from "../../models/enums/load_status";
import { EnumList } from "../../models/common/enum-list";
import { MatchVideoCollection } from "../../models/videos/match-video-collection";
import LoadingIndicator from "../common/loading-indicator";
import Paper from "@material-ui/core/Paper";
import {
  Button,
  Grid,
  IconButton,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { VideoType } from "../../models/enums/video-type";
import { DateUtil } from "../../utils/date-util";
import AppBar from "@material-ui/core/AppBar";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import VideoEditDialog from "./video-edit-dialog";
import { MatchVideoEntryFormData } from "../../models/ui/match-video-entry-form-data";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import BaseEditBottomBar from "../common/base-edit-bottom-bar";
import StatusSnackBar, { StatusMessage } from "../common/status-snack-bar";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import { ConfigUtil } from "../../utils/config-util";
import { Routes } from "../routing";
import MasterError from "../master-error";

const styles = () =>
  createStyles({
    paper: {
      maxWidth: 936,
      margin: "auto",
      overflow: "hidden",
    },
    topOffset: {
      marginTop: 40,
    },
    toolbar: {
      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    },
    bottomBar: {
      borderTop: "none",
    },
  });

interface SelectedVideo {
  video: MatchVideoEntryFormData;
  index?: number;
}

interface IndexedVideo {
  video: MatchVideoEntryFormData;
  index: number;
}

interface RProps extends RouteComponentProps, WithStyles<typeof styles> {
  sport: string;
  internalEventId: string;
}

interface RState {
  isMatchLoaded: boolean;
  isDataLoaded: boolean;
  isMatchError: boolean;
  isDataError: boolean;
  loadStatus: number;
  match?: Match;
  data?: MatchVideoFormData;
  enums: EnumList;
  selectedLanguage: string;
  selectedType: number;
  selectedVideo?: SelectedVideo;
  isStatusSnackBarOpen: boolean;
  statusMessage?: StatusMessage;
}

class VideoEdit extends React.PureComponent<RProps, RState> {
  private editDialogRef = React.createRef<any>();

  constructor(props: RProps) {
    super(props);
    this.state = {
      isMatchLoaded: false,
      isMatchError: false,
      isDataLoaded: false,
      isDataError: false,
      loadStatus: -1,
      enums: EnumList.createEmoty(),
      selectedLanguage: ConfigUtil.unknownLanguage(),
      selectedType: VideoType.UNKNOWN,
      isStatusSnackBarOpen: false,
    };
  }

  componentDidMount() {
    this.loadMatch();
    this.loadData();
  }

  private loadMatch(): void {
    ApiDataLoader.shared.loadMatch(
      this.props.sport,
      this.props.internalEventId,
      (status: number, data?: Match) => {
        if (status === LoadStatus.SUCCESS && data !== undefined) {
          this.setState({ isMatchLoaded: true, match: data });
        } else {
          this.setState({ isMatchLoaded: true, isMatchError: true });
        }
      }
    );
  }

  private loadData(): void {
    ApiDataLoader.shared.loadVideoCollection(
      this.props.internalEventId,
      (status: number, data?: MatchVideoCollection[], enums?: EnumList) => {
        if (
          status === LoadStatus.SUCCESS &&
          data !== undefined &&
          enums !== undefined
        ) {
          const formData = MatchVideoFormData.fromData(
            this.props.internalEventId,
            data,
            enums
          );
          this.setState({
            isDataLoaded: true,
            data: formData,
            enums: enums,
            loadStatus: status,
          });
        } else {
          this.setState({
            isDataLoaded: true,
            isDataError: true,
            loadStatus: status,
          });
        }
      }
    );
  }

  render(): React.ReactNode {
    if (
      this.state.isDataLoaded &&
      this.state.loadStatus === LoadStatus.UNAUTHENTICATED
    ) {
      return <Redirect to={Routes.Login} />;
    }
    if (
      this.state.isDataLoaded &&
      this.state.loadStatus === LoadStatus.UNAUTHORIZED
    ) {
      return <MasterError type="unauthorized" />;
    }
    if (!this.state.isMatchLoaded || !this.state.isDataLoaded) {
      return (
        <Paper className={this.props.classes.paper}>
          <LoadingIndicator />
        </Paper>
      );
    }
    if (this.state.isMatchError || this.state.isDataError) {
      return <MasterError type="unknown" />;
    }
    return (
      <>
        {this.renderMatch()}
        {this.renderData()}
        <VideoEditDialog
          enums={this.state.enums}
          video={this.state.selectedVideo?.video}
          innerRef={this.editDialogRef}
          onChange={(video) => this.onSelectedVideoChange(video)}
          onClose={() => this.onVideoEditClose()}
        />
        <StatusSnackBar
          isOpen={this.state.isStatusSnackBarOpen}
          message={this.state.statusMessage}
          onClose={() => this.setState({ isStatusSnackBarOpen: false })}
        />
      </>
    );
  }

  private renderMatch(): React.ReactNode {
    if (this.state.match === undefined) {
      return undefined;
    }
    return (
      <Paper className={this.props.classes.paper}>
        <Typography variant="subtitle1" component="div" align="center">
          {this.state.match.categoryName} {this.state.match.stageName}
        </Typography>
        <Grid container alignItems="center">
          <Grid item xs={4} md={5}>
            <Typography variant="h6" component="div" align="right">
              {this.state.match.homeTeamName()}
            </Typography>
          </Grid>
          <Grid item xs={4} md={2}>
            <Typography variant="h4" component="div" align="center">
              {this.state.match.homeScore()} - {this.state.match.awayScore()}
            </Typography>
          </Grid>
          <Grid item xs={4} md={5}>
            <Typography variant="h6" component="div">
              {this.state.match.awayTeamName()}
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="subtitle2" component="div" align="center">
          {this.state.match.startDate()} {this.state.match.startTime()}
        </Typography>
      </Paper>
    );
  }

  private renderData(): React.ReactNode {
    const content = new Array<React.ReactNode>();
    const filteredData = this.state.data?.videos
      .map((video, index) => {
        const indexedVideo: IndexedVideo = { video: video, index: index };
        return indexedVideo;
      })
      .filter((item) => {
        return (
          (this.state.selectedLanguage === ConfigUtil.unknownLanguage() ||
            item.video.language === this.state.selectedLanguage) &&
          (this.state.selectedType === VideoType.UNKNOWN ||
            item.video.type === this.state.selectedType)
        );
      });
    if (filteredData === undefined || filteredData.length === 0) {
      content.push(
        <TableRow key="empty-row">
          <TableCell colSpan={5}>There are no videos for this match</TableCell>
        </TableRow>
      );
    } else {
      filteredData.forEach((item) => {
        content.push(
          <TableRow key={item.index}>
            <TableCell>{VideoType.titleForType(item.video.type)}</TableCell>
            <TableCell>
              {this.state.enums.languageNameForCode(item.video.language)}
            </TableCell>
            <TableCell>
              {DateUtil.formatDateShort(item.video.date)}{" "}
              {DateUtil.formatStartTime(item.video.date)}
            </TableCell>
            <TableCell>{item.video.url}</TableCell>
            <TableCell align="right">
              <IconButton
                size="small"
                onClick={() => this.onEditClick(item.video, item.index)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => this.onDeleteClick(item.index)}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        );
      });
    }
    return (
      <Paper
        className={`${this.props.classes.paper} ${this.props.classes.topOffset}`}
      >
        {this.renderDataToolbar()}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow key="header-row">
                <TableCell key="type">Type</TableCell>
                <TableCell key="language">Language</TableCell>
                <TableCell key="date">Date</TableCell>
                <TableCell key="url">URL</TableCell>
                <TableCell key="controls" />
              </TableRow>
            </TableHead>
            <TableBody>{content}</TableBody>
          </Table>
        </TableContainer>
        <BaseEditBottomBar className={this.props.classes.bottomBar}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.onSave()}
          >
            Save
          </Button>
          <Button variant="contained" onClick={() => this.onClose()}>
            Close
          </Button>
        </BaseEditBottomBar>
      </Paper>
    );
  }

  private renderDataToolbar(): React.ReactNode {
    return (
      <AppBar
        className={this.props.classes.toolbar}
        position="static"
        color="default"
        elevation={0}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Typography variant="subtitle1">Videos</Typography>
            </Grid>
            <Grid item xs>
              <FormControl>
                <Select
                  value={this.state.selectedType}
                  onChange={(event) => this.onTypeSelect(event)}
                  label="Type"
                  input={<InputBase />}
                >
                  {VideoType.ALL.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type === VideoType.UNKNOWN
                        ? "All types"
                        : VideoType.titleForType(type)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs>
              <FormControl>
                <Select
                  value={this.state.selectedLanguage}
                  onChange={(event) => this.onLanguageSelect(event)}
                  label="Language"
                  input={<InputBase />}
                >
                  {this.state.enums.getLanguages().map((language) => (
                    <MenuItem key={language} value={language}>
                      {language === "UNKNOWN_LANGUAGE"
                        ? "All languages"
                        : this.state.enums.languageNameForCode(language)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.onAddClick()}
              >
                Add video
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }

  private onAddClick(): void {
    if (this.editDialogRef.current !== null) {
      this.editDialogRef.current.reset();
    }
    this.setState({
      selectedVideo: { video: MatchVideoEntryFormData.create() },
    });
  }

  private onEditClick(video: MatchVideoEntryFormData, index: number): void {
    if (this.editDialogRef.current !== null) {
      this.editDialogRef.current.reset();
    }
    this.setState({ selectedVideo: { video: video, index: index } });
  }

  private onDeleteClick(index: number) {
    this.setState((state) => {
      return { data: state.data?.deleteVideoEntry(index) };
    });
  }

  private onSelectedVideoChange(video: MatchVideoEntryFormData): void {
    this.setState((state) => {
      const idx = state.selectedVideo?.index;
      return {
        data:
          idx !== undefined
            ? state.data?.updateVideoEntry(video, idx)
            : state.data?.addVideoEntry(video),
        selectedVideo: undefined,
      };
    });
  }

  private onVideoEditClose(): void {
    this.setState({ selectedVideo: undefined });
  }

  private onTypeSelect(event: any): void {
    const newSelectedType = event.target.value;
    this.setState({ selectedType: newSelectedType });
  }

  private onLanguageSelect(event: any): void {
    const newSelectedLanguage = event.target.value;
    this.setState({ selectedLanguage: newSelectedLanguage });
  }

  private onSave(): void {
    const payload = this.state.data?.localizedCollections();
    if (payload !== undefined) {
      this.setState({ isDataLoaded: false });
      ApiDataLoader.shared.saveVideoCollections(
        payload,
        (status: number, data?: MatchVideoCollection[], message?: string) => {
          if (status === LoadStatus.SUCCESS) {
            const newData = data || payload;
            this.setState((state) => {
              return {
                isDataLoaded: true,
                data: MatchVideoFormData.fromData(
                  this.props.internalEventId,
                  newData,
                  state.enums
                ),
                isStatusSnackBarOpen: true,
                statusMessage: {
                  type: status,
                  text: "Videos successfully stored",
                },
                loadStatus: status,
              };
            });
          } else {
            this.setState({
              isDataLoaded: true,
              isStatusSnackBarOpen: true,
              statusMessage: {
                type: status,
                text: message || "Failed to store videos",
              },
              loadStatus: status,
            });
          }
        }
      );
    }
  }

  private onClose(): void {
    let params = "sport=" + this.props.sport;
    if (
      this.state.match !== undefined &&
      this.state.match.scheduledStartTimestamp !== undefined
    ) {
      params +=
        "&date=" +
        Math.floor(this.state.match.scheduledStartTimestamp / 1000000) *
          1000000;
    }
    this.props.history.push("/content/videos?" + params);
  }
}

export default withRouter(withStyles(styles)(VideoEdit));
