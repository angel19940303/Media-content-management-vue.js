import React from "react";
import { createStyles, Theme, WithStyles } from "@material-ui/core/styles";
import { CircularProgress, IconButton, withStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { ApiDataLoader } from "../../api/api-data-loader";
import { LoadStatus } from "../../models/enums/load_status";
import Dropzone from "react-dropzone";
import {
  FileUploadService,
  UploadTaskEvent,
} from "../../api/file_upload/file-upload-service";
import { ImageResource } from "../../models/ui/image-resource";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import LoadingIndicator from "./loading-indicator";

const styles = (theme: Theme) =>
  createStyles({
    content: {
      padding: 0,
      height: 502,
      overflow: "hidden",
    },
    imagePreview: {
      width: 81,
      height: 81,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      float: "left",
      padding: 3,
      margin: 5,
      border: "1px solid #ddd",
      position: "relative",

      "&:hover": {
        backgroundColor: "#efefef",
        cursor: "pointer",
      },

      "&.selected": {
        borderColor: "green",
      },

      "&:hover.selected": {
        backgroundColor: theme.palette.success.light,
      },

      "& img": {
        maxWidth: 75,
        maxHeight: 75,
      },

      "& .deleteButton": {
        display: "none",
      },

      "&:hover .deleteButton": {
        display: "block",
        position: "absolute",
        right: -12,
        top: -12,
      },

      "& .badge-container": {
        boxSizing: "border-box",
        width: "100%",
        display: "flex",
        position: "absolute",
        left: 0,
        bottom: 0,
        padding: 3,
        justifyContent: "space-between",
      },

      "& .badge": {
        padding: "0 2px",
        fontSize: "75%",
        fontWeight: "bold",
        borderRadius: 5,
        backgroundColor: "#aaa",
        color: "#fff",
        textTransform: "uppercase",
      },

      "& .badge-png": {
        backgroundColor: theme.palette.success.dark,
      },
      "& .badge-svg": {
        backgroundColor: theme.palette.primary.dark,
      },
      "& .badge-jpg": {
        backgroundColor: theme.palette.warning.dark,
      },
      "& .badge-gif": {
        backgroundColor: theme.palette.secondary.dark,
      },
      "& .badge-webp": {
        backgroundColor: theme.palette.error.dark,
      },
    },
    clear: {
      clear: "left",
      display: "block",
      width: 1,
      height: 1,
    },

    dropzone: {
      boxSizing: "border-box",
      padding: 8,
      height: 500,
      overflow: "auto",

      "&.selected": {
        padding: 5,
        border: "3px dashed green",
      },
    },

    contentMessage: {
      padding: "0 18px",

      "&.error": {
        color: theme.palette.error.main,
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  selectedImageUrl?: string;
  onSelectImage?: (image: string) => void;
  onClose?: () => void;
}

interface RState {
  isLoading: boolean;
  isError: boolean;
  showUpload: boolean;
  isDropzoneSelected: boolean;
  images: ImageResource[];
}

class ImageDialog extends React.Component<RProps, RState> {
  private isComponentMounted = false;
  private fileUploadService = new FileUploadService();
  private contentRef = React.createRef<HTMLElement>();

  constructor(props: RProps) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      showUpload: false,
      isDropzoneSelected: false,
      images: [],
    };
  }

  componentDidMount(): void {
    this.isComponentMounted = true;
    this.fileUploadService.on(FileUploadService.getEvents().start, (event) =>
      this.updateResourcesWithEvent(event)
    );
    this.fileUploadService.on(FileUploadService.getEvents().progress, (event) =>
      this.updateResourcesWithEvent(event)
    );
    this.fileUploadService.on(FileUploadService.getEvents().success, (event) =>
      this.updateResourcesWithEvent(event)
    );
    this.fileUploadService.on(FileUploadService.getEvents().failure, (event) =>
      this.updateResourcesWithEvent(event)
    );
    this.fileUploadService.on(
      FileUploadService.getEvents().cancellation,
      (event) => this.removeResourceWithId(event.taskId)
    );
    this.loadImages();
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
    this.fileUploadService.offAll();
  }

  render(): React.ReactNode {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{this.renderControlBar()}</DialogTitle>
        <DialogContent className={this.props.classes.content} dividers>
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

  private renderControlBar(): React.ReactNode {
    return (
      <>
        <Typography variant="h6" component="div">
          Select image
        </Typography>
        <Typography variant="body2" component="div">
          To upload new images drag and drop then over the image list
        </Typography>
      </>
    );
  }

  private renderContent(): React.ReactNode {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    if (this.state.isError) {
      return (
        <Typography
          variant="subtitle1"
          component="div"
          className={`${this.props.classes.contentMessage} error`}
        >
          An error occurred when loading images.
        </Typography>
      );
    }

    return (
      <Dropzone
        onDrop={(acceptedFiles) => this.onDrop(acceptedFiles)}
        onDragEnter={() => this.setState({ isDropzoneSelected: true })}
        onDragLeave={() => this.setState({ isDropzoneSelected: false })}
        onDropAccepted={() => this.setState({ isDropzoneSelected: false })}
        onDropRejected={() => this.setState({ isDropzoneSelected: false })}
      >
        {({ getRootProps, getInputProps }) => (
          <section
            className={`${this.props.classes.dropzone}${
              this.state.isDropzoneSelected ? " selected" : ""
            }`}
            ref={this.contentRef}
          >
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {this.renderDropzoneContent(this.state.images)}
              <span className={this.props.classes.clear} />
            </div>
          </section>
        )}
      </Dropzone>
    );
  }

  private renderDropzoneContent(
    imageResources: ImageResource[]
  ): React.ReactNode {
    if (imageResources.length === 0) {
      return (
        <Typography
          variant="subtitle1"
          component="div"
          className={this.props.classes.contentMessage}
        >
          There are no images currently available
        </Typography>
      );
    }
    return (
      <div>
        {imageResources.map((image, index) => (
          <span
            key={image.fileName || image.id}
            className={`${this.props.classes.imagePreview} ${
              this.props.selectedImageUrl !== undefined &&
              this.props.selectedImageUrl === image.getUrl()
                ? "selected"
                : ""
            }`}
            onClick={(event) => this.onImagePreviewClick(event, image)}
          >
            {this.renderImageListItem(image)}
            <IconButton
              className="deleteButton"
              size="small"
              onClick={(event) => this.onRemoveResourceClick(event, index)}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        ))}
      </div>
    );
  }

  private renderImageListItem(imageResource: ImageResource): React.ReactNode {
    if (imageResource.isError) {
      return <ErrorOutlineIcon fontSize="large" />;
    }
    if (imageResource.isPlaceholder()) {
      return (
        <CircularProgress
          variant="determinate"
          value={imageResource.progress}
        />
      );
    }
    const url = imageResource.getUrl();
    const type = imageResource.getType();
    const aspectRatio = imageResource.getAspectRatio();
    return (
      <>
        <img src={url} alt="" />
        <span className="badge-container">
          {type === undefined ? (
            ""
          ) : (
            <span className={`badge badge-${type}`}>{type}</span>
          )}
          {aspectRatio === undefined ? (
            ""
          ) : (
            <span className={`badge badge-${type || "unknown"}`}>
              {aspectRatio}
            </span>
          )}
        </span>
      </>
    );
  }

  private onClose(): void {
    if (this.props.onClose !== undefined) {
      this.props.onClose();
    }
  }

  private onDrop(acceptedFiles: File[]): void {
    const newImageResources = new Array<ImageResource>();
    acceptedFiles.forEach((file) => {
      const resourceId = this.fileUploadService.add(file);
      newImageResources.push(ImageResource.fromUploadTaskId(resourceId));
    });
    if (this.contentRef.current !== null) {
      this.contentRef.current.scrollTop = 0;
    }
    this.setState((state) => {
      return { images: [...newImageResources.reverse(), ...state.images] };
    });
  }

  private loadImages(): void {
    this.setState({ isLoading: true, isError: false });
    ApiDataLoader.shared.loadImages((status, images, message) => {
      if (!this.isComponentMounted) {
        return;
      }
      if (status === LoadStatus.SUCCESS) {
        this.setState({ isLoading: false, images: images || [] });
      } else {
        this.setState({ isLoading: false, isError: true });
      }
    });
  }

  private updateResourcesWithEvent(event: UploadTaskEvent): void {
    ImageResource.fromUploadTaskEvent(event).then((newImageResource) => {
      this.setState((state) => {
        const newImages = [...state.images];
        const index = newImages.findIndex(
          (imageResource) => imageResource.id === event.taskId
        );
        if (index >= 0) {
          newImages.splice(index, 1, newImageResource);
        }
        return { images: newImages };
      });
    });
  }

  private removeResourceWithId(id: number): void {
    this.setState((state) => {
      return {
        images: state.images.filter((imageResource) => imageResource.id !== id),
      };
    });
  }

  private onImagePreviewClick(event: any, imageResource: ImageResource): void {
    event.preventDefault();
    event.stopPropagation();
    const imageUrl = imageResource.getUrl();
    if (this.props.onSelectImage !== undefined && imageUrl) {
      this.props.onSelectImage(imageUrl);
    }
  }

  private onRemoveResourceClick(event: any, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    const imageResource = this.state.images[index];
    if (imageResource.id !== undefined) {
      this.fileUploadService.cancelTask(imageResource.id);
    } else if (imageResource.fileName !== undefined) {
      const fileName = imageResource.fileName;
      ApiDataLoader.shared.deleteImage(fileName, (status) => {
        if (status === LoadStatus.SUCCESS) {
          this.setState((state) => {
            return {
              images: state.images.filter(
                (imageResource) => imageResource.fileName !== fileName
              ),
            };
          });
        } else {
          this.setState((state) => {
            const newImages = [...state.images];
            newImages.splice(index, 1, imageResource.withIsError(true));
            return { images: newImages };
          });
        }
      });
    } else {
      this.setState((state) => {
        const newImages = [...state.images];
        newImages.splice(index, 1);
        return { images: newImages };
      });
    }
  }
}

export default withStyles(styles)(ImageDialog);
