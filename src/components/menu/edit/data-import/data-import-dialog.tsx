import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import LoadingIndicator from "../../../common/loading-indicator";

const styles = () =>
  createStyles({
    noPadding: {
      padding: 0,
    },
    leftOffset: {
      display: "inline-block",
      paddingLeft: 15,
    },
    errorMessage: {
      marginBottom: 15,
      padding: 5,
      backgroundColor: "#ffeeee",
      borderRadius: 5,
      color: "#CC0000",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  type: "csv" | "json";
  onContentLoad?: (content: string) => void;
  onApply?: (type: string, content: string) => void;
  onClose?: () => void;
}

interface ResultFile {
  name: string;
  content: string;
}

interface RState {
  isLoading: boolean;
  errorMessage?: string;
  result?: ResultFile;
}

class DataImportDialog extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = { isLoading: false };
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
            <Grid item sm={12} xs={12}>
              Import {this.props.type.toUpperCase()} file
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers>{this.renderContent()}</DialogContent>
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
    if (this.state.result) {
      return this.state.result.name;
    }
    const accept = this.props.type === "csv" ? "text/csv" : "application/json";
    return (
      <>
        {this.renderError()}
        <label>
          <Button variant="contained" component="label">
            Choose File
            <input
              type="file"
              accept={accept}
              hidden
              onChange={(event) => this.onFileInputChange(event)}
            />
          </Button>
          <span className={this.props.classes.leftOffset}>
            No file selected
          </span>
        </label>
      </>
    );
  }

  private renderError(): React.ReactNode {
    if (!this.state.errorMessage) {
      return "";
    }
    return (
      <div className={this.props.classes.errorMessage}>
        {this.state.errorMessage}
      </div>
    );
  }

  private onApply(result: string): void {
    if (this.props.onApply) {
      this.setState({
        isLoading: false,
        result: undefined,
        errorMessage: undefined,
      });
      this.props.onApply(this.props.type, result);
    }
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.setState({
        isLoading: false,
        result: undefined,
        errorMessage: undefined,
      });
      this.props.onClose();
    }
  }

  private onFileInputChange(event: any) {
    const files = event.target.files;
    if (files === undefined || files.length === 0) {
      return;
    }
    this.readFile(files[0]);
  }

  private readFile(file: File) {
    try {
      const accept =
        this.props.type === "csv" ? "text/csv" : "application/json";
      if (file.type !== accept) {
        this.processError("Error: Unsupported file format " + file.type);
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        if (event.target === null) {
          this.processError("Error: file reader does not exist!");
        } else if (typeof event.target.result !== "string") {
          this.processError("Error: file content is not a string!");
        } else {
          this.processResult(file.name, event.target.result);
        }
      };
      this.setState({ isLoading: true });
      fileReader.readAsText(file);
    } catch (e) {
      console.error(e);
      this.processError("An unexpected error occurred when reading the file");
    }
  }

  private processResult(name: string, result: string) {
    this.onApply(result);
  }

  private processError(errorMessage: string): void {
    this.setState({
      errorMessage: errorMessage,
      result: undefined,
      isLoading: false,
    });
  }
}

export default withStyles(styles)(DataImportDialog);
