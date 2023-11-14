import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import { ApiDataLoader } from "../../../api/api-data-loader";
import { LoadStatus } from "../../../models/enums/load_status";
import ResizablePaper from "../../common/resizable-paper";
import Toolbar from "@material-ui/core/Toolbar";
import {
  FormControlLabel,
  FormHelperText,
  Grid,
  Switch,
  TextField,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import MenuEditBottomBar from "../../common/base-edit-bottom-bar";
import MenuEditStatusBox from "../../menu/edit/menu-edit-status-box";
import Button from "@material-ui/core/Button";
import { EditStatusMessage } from "../../../models/ui/edit-status-message";
import LoadingIndicator from "../../common/loading-indicator";
import { EnumList } from "../../../models/common/enum-list";
import { NewsEntryFormData } from "../../../models/ui/news-entry-form-data";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import WysiwygEditor from "../../common/wysiwyg-editor";
import NewsEntryEditMediaBar from "./news-entry-edit-media-bar";
import Typography from "@material-ui/core/Typography";
import NewsEntryEditMediaDialog from "./news-entry-edit-media-dialog";
import { NewsMediaType } from "../../../models/enums/news-media-type";
import { NewsMedium } from "../../../models/news/news-medium";
import NewsEntryEditTagsBar from "./news-entry-edit-tags-bar";
import NewsEntryEditTagsDialog from "./news-entry-edit-tags-dialog";
import { NewsTag } from "../../../models/news/news-tag";
import StatusSnackBar from "../../common/status-snack-bar";
import { Routes } from "../../routing";
import MasterError from "../../master-error";

const styles = () =>
  createStyles({
    contentWrapper: {
      boxSizing: "border-box",
      padding: "20px 16px",
      overflow: "auto",
    },
    wysiwygFormControl: {
      "& label": {
        position: "absolute",
        top: -8,
        left: 10,
        display: "block",
        padding: "0 3px",
        backgroundColor: "#fff",
        color: "rgba(0, 0, 0, 0.54)",
        fontSize: "0.75rem",
      },
      "&.error label": {
        color: "#f44336",
      },
      position: "relative",
    },
    wysiwygFormControl_focused: {
      "& label": {
        color: "#009be5",
      },
      "&.error label": {
        color: "#f44336",
      },
    },
    wysiwygFormControlContent: {
      border: "1px solid rgba(0, 0, 0, 0.23)",
      borderRadius: 8,
      padding: 1,
      "&:hover": {
        borderColor: "#000",
      },
      "&.error": {
        borderColor: "#f44336",
      },
    },
    wysiwygFormControlContent_focused: {
      borderColor: "#009be5",
      borderWidth: 2,
      padding: 0,
      "&:hover": {
        borderColor: "#009be5",
      },
      "&.error": {
        borderColor: "#f44336",
      },
    },
    wysiwygErrorMessage: {
      margin: "4px 14px 0 14px",
      fontSize: "0.75rem",
      color: "#f44336",
    },
  });

export interface RProps
  extends RouteComponentProps<any>,
    WithStyles<typeof styles> {
  id: number;
}

export interface RState {
  isLoading: boolean;
  isError: boolean;
  loadStatus: number;
  contentHeight: number;
  data: NewsEntryFormData;
  enums: EnumList;
  statusMessage?: EditStatusMessage;
  isEditorFocused: boolean;
  isTagsDialogOpen: boolean;
  mediaDialogSelectedType?: number;
}

class NewsEntryEdit extends React.Component<RProps, RState> {
  private editorRef: any = React.createRef();

  constructor(props: RProps) {
    super(props);
    const formData = NewsEntryFormData.create();
    this.state = {
      isLoading: true,
      isError: false,
      loadStatus: -1,
      contentHeight: 0,
      data: formData,
      enums: EnumList.createEmoty(),
      isEditorFocused: false,
      isTagsDialogOpen: false,
    };
  }

  componentDidMount() {
    ApiDataLoader.shared.loadNewsEntry(this.props.id, (status, data, enums) => {
      if (
        status === LoadStatus.SUCCESS &&
        data !== undefined &&
        enums !== undefined
      ) {
        this.setState({
          isLoading: false,
          data: NewsEntryFormData.from(data, enums),
          enums: enums,
          loadStatus: status,
        });
      } else {
        this.setState({ isLoading: false, isError: true, loadStatus: status });
      }
    });
  }

  render(): React.ReactNode {
    if (
      !this.state.isLoading &&
      this.state.loadStatus === LoadStatus.UNAUTHENTICATED
    ) {
      return <Redirect to={Routes.Login} />;
    }
    if (
      !this.state.isLoading &&
      this.state.loadStatus === LoadStatus.UNAUTHORIZED
    ) {
      return <MasterError type="unauthorized" />;
    }

    const insets = { left: 0, top: 70 + 48, right: 0, bottom: 52 + 96 };
    return (
      <ResizablePaper
        insets={insets}
        onResize={(height) => this.setState({ contentHeight: height - 99 })}
      >
        {this.renderContent()}
      </ResizablePaper>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    if (this.state.isError) {
      return "Error";
    }
    return (
      <>
        {this.renderAppBar()}
        <div
          className={this.props.classes.contentWrapper}
          style={{ height: this.state.contentHeight }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Title"
                variant="outlined"
                value={this.state.data.title}
                error={!this.state.data.validation.isTitleValid}
                helperText={this.state.data.validation.getTitleErrors()}
                onChange={(event) => this.handleTitleChange(event)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Sort ID"
                variant="outlined"
                value={this.state.data.sortId}
                error={!this.state.data.validation.isSortIdValid}
                helperText={this.state.data.validation.getSortIdErrors()}
                onChange={(event) => this.handleSortIdChange(event)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Seo URL"
                variant="outlined"
                value={this.state.data.seoUrl}
                error={!this.state.data.validation.isSeoUrlValid}
                helperText={this.state.data.validation.getSeoUrlErrors()}
                onChange={(event) => this.handleSeoUrlChange(event)}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl
                variant="outlined"
                size="small"
                fullWidth
                error={!this.state.data.validation.isLanguageIdValid}
              >
                <InputLabel>Language</InputLabel>
                <Select
                  fullWidth
                  value={this.state.data.languageId || 0}
                  onChange={(event) => this.handleLanguageChange(event)}
                  label="Sport"
                >
                  {this.state.enums.getLanguages().map((language) => (
                    <MenuItem
                      key={language}
                      value={this.state.enums.getLanguageCode(language) || 0}
                    >
                      {language}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {this.state.data.validation.getLanguageErrors()}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                variant="outlined"
                size="small"
                fullWidth
                error={!this.state.data.validation.isSportIdValid}
              >
                <InputLabel>Sport</InputLabel>
                <Select
                  fullWidth
                  value={this.state.data.sportId || 0}
                  onChange={(event) => this.handleSportChange(event)}
                  label="Sport"
                >
                  {this.state.enums.getSports().map((sport) => (
                    <MenuItem
                      key={sport}
                      value={this.state.enums.getSportId(sport) || 0}
                    >
                      {sport}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {this.state.data.validation.getSportIdErrors()}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                variant="outlined"
                size="small"
                fullWidth
                error={!this.state.data.validation.isProviderIdValid}
              >
                <InputLabel>Provider</InputLabel>
                <Select
                  fullWidth
                  value={this.state.data.providerId || 0}
                  onChange={(event) => this.handleProviderChange(event)}
                  label="Provider"
                >
                  {this.state.enums.getProviders().map((provider) => (
                    <MenuItem
                      key={provider}
                      value={this.state.enums.getProviderId(provider) || 0}
                    >
                      {provider}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormHelperText>
                {this.state.data.validation.getProviderIdErrors()}
              </FormHelperText>
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.data.pinned}
                    onChange={(event) => this.handlePinnedChange(event)}
                    name="enabled"
                    color="primary"
                  />
                }
                label="Pinned"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.data.published}
                    onChange={(event) => this.handlePublishedChange(event)}
                    name="enabled"
                    color="primary"
                  />
                }
                label="Published"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="External link"
                variant="outlined"
                value={this.state.data.externalLink}
                error={!this.state.data.validation.isExternalLinkValid}
                helperText={this.state.data.validation.getArticleAndExternalLinkErrors()}
                onChange={(event) => this.handleExternalLinkChange(event)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Author"
                variant="outlined"
                value={this.state.data.author}
                error={!this.state.data.validation.isAuthorValid}
                helperText={this.state.data.validation.getAuthorErrors()}
                onChange={(event) => this.handleAuthorChange(event)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" component="div">
                Media
              </Typography>
              <NewsEntryEditMediaBar
                images={this.state.data.images}
                videos={this.state.data.videos}
                audios={this.state.data.audios}
                errorMessage={this.state.data.validation
                  .getMediaErrors()
                  .join(", ")}
                onEdit={(type: number) => this.handleMediaBarEdit(type)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" component="div">
                Tags
              </Typography>
              <NewsEntryEditTagsBar
                stageTags={this.state.data.stageTags}
                participantTags={this.state.data.participantTags}
                errorMessage={this.state.data.validation
                  .getTagsErrors()
                  .join(", ")}
                onEdit={() => this.handleTagsBarEdit()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Description"
                variant="outlined"
                multiline
                rows={5}
                value={this.state.data.description}
                error={!this.state.data.validation.isDescriptionValid}
                helperText={this.state.data.validation.getDescriptionErrors()}
                onChange={(event) => this.handleDescriptionChange(event)}
              />
            </Grid>
            <Grid item xs={12}>
              {this.renderEditor()}
            </Grid>
          </Grid>
        </div>
        {this.renderBottomBar()}
        {this.renderMediaDialog()}
        {this.renderTagsDialog()}
        {this.renderStatusSnackBar()}
      </>
    );
  }

  private renderAppBar(): React.ReactNode {
    return (
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar style={{ paddingLeft: 12, paddingRight: 8 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              {this.state.data.title.length === 0
                ? "UNTITLED"
                : this.state.data.title}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }

  private renderEditor(): React.ReactNode {
    const themeOverrides: any = {
      overrides: {
        MUIRichTextEditor: {
          root: { padding: "0 8px" },
          placeHolder: { position: "relative" },
        },
      },
    };
    const containerClasses = [this.props.classes.wysiwygFormControl];
    const contentClasses = [this.props.classes.wysiwygFormControlContent];
    let helperText: React.ReactNode = undefined;
    if (this.state.isEditorFocused) {
      containerClasses.push(this.props.classes.wysiwygFormControl_focused);
      contentClasses.push(this.props.classes.wysiwygFormControlContent_focused);
    }
    if (!this.state.data.validation.isArticleValid) {
      containerClasses.push("error");
      contentClasses.push("error");
      helperText = (
        <p className={this.props.classes.wysiwygErrorMessage}>
          {this.state.data.validation.getArticleAndExternalLinkErrors()}
        </p>
      );
    }
    return (
      <div className={containerClasses.join(" ")}>
        <label>Article</label>
        <div className={contentClasses.join(" ")}>
          <WysiwygEditor
            ref={this.editorRef}
            controls={WysiwygEditor.STANDARD_CONTROLS}
            themeOverrides={themeOverrides}
            data={this.state.data.article}
            label="Article text..."
            onFocus={() => this.handleEditorFocus()}
            onBlur={() => this.handleEditorBlur()}
            onSave={(data) => this.handleEditorSave(data)}
          />
        </div>
        {helperText}
      </div>
    );
  }

  private renderBottomBar(): React.ReactNode {
    return (
      <MenuEditBottomBar>
        <MenuEditStatusBox statusMessage={this.state.statusMessage} />
        <Button
          variant="contained"
          key="save"
          color="primary"
          onClick={() => this.onSaveClick()}
        >
          Save
        </Button>
        <Button
          variant="contained"
          key="cancel"
          type="button"
          onClick={() => this.onCancelClick()}
        >
          Cancel
        </Button>
      </MenuEditBottomBar>
    );
  }

  private renderMediaDialog(): React.ReactNode {
    const isOpen = this.state.mediaDialogSelectedType !== undefined;
    const selectedType =
      this.state.mediaDialogSelectedType ?? NewsMediaType.IMAGE;
    return (
      <NewsEntryEditMediaDialog
        images={this.state.data.images}
        videos={this.state.data.videos}
        audios={this.state.data.audios}
        selectedType={selectedType}
        isOpen={isOpen}
        onUpdate={(images, videos, audios) =>
          this.handleMediaDialogUpdate(images, videos, audios)
        }
        onClose={() => this.handleMediaDialogClose()}
      />
    );
  }

  private renderTagsDialog(): React.ReactNode {
    return (
      <NewsEntryEditTagsDialog
        isOpen={this.state.isTagsDialogOpen}
        stageTags={this.state.data.stageTags}
        participantTags={this.state.data.participantTags}
        onUpdate={(stageTags, participantTags) =>
          this.handleTagsDialogUpdate(stageTags, participantTags)
        }
        onClose={() => this.handleTagsDialogClose()}
      />
    );
  }

  private renderStatusSnackBar(): React.ReactNode {
    const isSnackBarOpen = this.state.statusMessage !== undefined;
    const statusMessage =
      this.state.statusMessage === undefined
        ? undefined
        : {
            type: this.state.statusMessage.type,
            text: this.state.statusMessage.message,
          };
    return (
      <StatusSnackBar
        isOpen={isSnackBarOpen}
        message={statusMessage}
        onClose={() => this.handleSnackBarClose()}
      />
    );
  }

  private onSaveClick(): void {
    if (this.editorRef.current !== null && this.editorRef.current.ref) {
      this.editorRef.current.ref.save();
    } else {
      this.save(this.state.data, this.state.enums);
    }
  }

  private handleTitleChange(event: any) {
    const value = event.target.value;
    this.setState((state) => {
      return { data: state.data.withTitle(value) };
    });
  }

  private handleSortIdChange(event: any) {
    const value = event.target.value;
    this.setState((state) => {
      return { data: state.data.withSortId(value) };
    });
  }

  private handleSeoUrlChange(event: any) {
    const value = event.target.value;
    this.setState((state) => {
      return { data: state.data.withSeoUrl(value) };
    });
  }

  private handleLanguageChange(event: any): void {
    const value = event.target.value;
    this.setState((state) => {
      return { data: state.data.withLanguageId(value, state.enums) };
    });
  }

  private handleSportChange(event: any): void {
    const value = event.target.value;
    this.setState((state) => {
      return { data: state.data.withSportId(value, state.enums) };
    });
  }

  private handleProviderChange(event: any): void {
    const value = event.target.value;
    this.setState((state) => {
      return { data: state.data.withProviderId(value, state.enums) };
    });
  }

  private handlePinnedChange(event: any) {
    const value = event.target.checked;
    this.setState((state) => {
      return { data: state.data.withPinned(value) };
    });
  }

  private handlePublishedChange(event: any) {
    const value = event.target.checked;
    this.setState((state) => {
      return { data: state.data.withPublished(value) };
    });
  }

  private handleExternalLinkChange(event: any) {
    const value = event.target.value;
    this.setState((state) => {
      return { data: state.data.withExternalLink(value) };
    });
  }

  private handleAuthorChange(event: any) {
    const value = event.target.value;
    this.setState((state) => {
      return { data: state.data.withAuthor(value) };
    });
  }

  private handleDescriptionChange(event: any) {
    const value = event.target.value;
    this.setState((state) => {
      return { data: state.data.withDescription(value) };
    });
  }

  private handleEditorFocus() {
    this.setState({ isEditorFocused: true });
  }

  private handleEditorBlur() {
    this.setState({ isEditorFocused: false });
  }

  private handleEditorSave(data: string) {
    this.save(this.state.data.withArticle(data), this.state.enums);
  }

  private handleMediaBarEdit(type: number) {
    this.setState({ mediaDialogSelectedType: type });
  }

  private handleTagsBarEdit() {
    this.setState({ isTagsDialogOpen: true });
  }

  private handleMediaDialogUpdate(
    images: Array<NewsMedium>,
    videos: Array<NewsMedium>,
    audios: Array<NewsMedium>
  ) {
    this.setState((state) => {
      const newData = state.data
        .withImages(images)
        .withVideos(videos)
        .withAudios(audios);
      return { data: newData, mediaDialogSelectedType: undefined };
    });
  }

  private handleMediaDialogClose() {
    this.setState({ mediaDialogSelectedType: undefined });
  }

  private handleTagsDialogUpdate(
    stageTags: Array<[string, NewsTag]>,
    participantTags: Array<[string, NewsTag]>
  ) {
    this.setState((state) => {
      const newData = state.data
        .withStageTags(stageTags)
        .withParticipantTags(participantTags);
      return { data: newData, isTagsDialogOpen: false };
    });
  }

  private handleTagsDialogClose() {
    this.setState({ isTagsDialogOpen: false });
  }

  private handleSnackBarClose() {
    this.setState({ statusMessage: undefined });
  }

  private save(data: NewsEntryFormData, enums: EnumList) {
    const validatedData = data.validated();
    if (validatedData.validation.isValid) {
      this.setState({ isLoading: true });
      ApiDataLoader.shared.saveNewsEntry(
        validatedData.dataPayload(),
        (status, savedData, message) => {
          if (status === LoadStatus.SUCCESS) {
            let newData = validatedData;
            if (savedData !== undefined && savedData.ID !== undefined) {
              newData = NewsEntryFormData.from(savedData, enums);
            }
            const statusMessage = {
              message: "News entry has been saved successfully",
              type: LoadStatus.SUCCESS,
            };
            this.setState({
              isLoading: false,
              data: newData,
              statusMessage: statusMessage,
              loadStatus: status,
            });
          } else {
            const errorMessage = message || "Failed to save news entry";
            const statusMessage = {
              message: errorMessage,
              type: LoadStatus.FAILURE,
            };
            this.setState({
              isLoading: false,
              data: validatedData,
              statusMessage: statusMessage,
              loadStatus: status,
            });
          }
        }
      );
    } else {
      const statusMessage = {
        message: "Validation error(s)",
        type: LoadStatus.FAILURE,
      };
      this.setState({ data: validatedData, statusMessage: statusMessage });
    }
  }

  private onCancelClick() {
    this.props.history.goBack();
  }
}

export default withRouter(withStyles(styles)(NewsEntryEdit));
