import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import { NewsFeedDataPayload } from "../../../../models/news/news-feed-data-payload";
import { NewsFeedFormData } from "../../../../models/ui/news-feed-form-data";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { EnumList } from "../../../../models/common/enum-list";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import {
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  Switch,
} from "@material-ui/core";

const styles = () =>
  createStyles({
    noPadding: {
      padding: "0",
    },
    narrow: {
      minWidth: "46px",
    },
    rightBorder: {
      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    },
    centerWrapper: {
      height: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  item: NewsFeedDataPayload;
  enums: EnumList;
  onUpdate?: (data: NewsFeedDataPayload) => void;
  onClose?: () => void;
}

interface RState {
  data: NewsFeedFormData;
}

class NewsFeedEditDialogContent extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = { data: NewsFeedFormData.fromData(this.props.item) };
  }

  render(): React.ReactNode {
    const title =
      (this.state.data.id !== undefined && this.state.data.id > 0
        ? "Edit"
        : "Add") + " News Feed";
    return (
      <form onSubmit={(event) => this.onSubmit(event)}>
        <DialogTitle id="add-mapping-dialog-title">{title}</DialogTitle>
        <DialogContent dividers>{this.renderContent()}</DialogContent>
        <DialogActions>
          <Button color="primary" type="submit">
            Save
          </Button>
          <Button onClick={() => this.onClose()} color="default">
            Cancel
          </Button>
        </DialogActions>
      </form>
    );
  }

  private renderContent(): React.ReactNode {
    let sportHelperText: React.ReactNode = "";
    let languageHelperText: React.ReactNode = "";

    if (!this.state.data.validation.isSportValid) {
      sportHelperText = (
        <FormHelperText>
          {this.state.data.validation.getSportErrors()}
        </FormHelperText>
      );
    }
    if (!this.state.data.validation.isLanguageValid) {
      languageHelperText = (
        <FormHelperText>
          {this.state.data.validation.getLanguageErrors()}
        </FormHelperText>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            variant="outlined"
            size="small"
            fullWidth
            error={!this.state.data.validation.isSportValid}
          >
            <InputLabel>Sport</InputLabel>
            <Select
              fullWidth
              value={this.state.data.sportId || 0}
              onChange={(event) => this.handleSportChange(event)}
              label="Sport"
            >
              {this.props.enums.getSports().map((sport) => (
                <MenuItem
                  key={sport}
                  value={this.props.enums.getSportId(sport) || 0}
                >
                  {sport}
                </MenuItem>
              ))}
            </Select>
            {sportHelperText}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl
            variant="outlined"
            size="small"
            fullWidth
            error={!this.state.data.validation.isLanguageValid}
          >
            <InputLabel>Language</InputLabel>
            <Select
              fullWidth
              value={this.state.data.languageCode || "UNKNOWN_LANGUAGE"}
              onChange={(event) => this.handleLanguageChange(event)}
              label="Language"
            >
              {this.props.enums.getLanguages().map((language) => (
                <MenuItem
                  key={language}
                  value={this.props.enums.getLanguageCode(language) || 0}
                >
                  {language}
                </MenuItem>
              ))}
            </Select>
            {languageHelperText}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel>Provider</InputLabel>
            <Select
              fullWidth
              value={this.state.data.providerId || 0}
              onChange={(event) => this.handleProviderChange(event)}
              label="Provider"
            >
              {this.props.enums.getProviders().map((provider) => (
                <MenuItem
                  key={provider}
                  value={this.props.enums.getProviderId(provider) || 0}
                >
                  {provider}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="URL"
            variant="outlined"
            size="small"
            value={this.state.data.url || ""}
            onChange={(event) => this.handleUrlChange(event)}
            error={!this.state.data.validation.isUrlValid}
            helperText={this.state.data.validation.getUrlErrors()}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Update frequency"
            variant="outlined"
            size="small"
            type="number"
            value={this.state.data.frequency}
            onChange={(event) => this.handleFrequencyChange(event)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">minutes</InputAdornment>
              ),
            }}
            error={!this.state.data.validation.isFrequencyValid}
            helperText={this.state.data.validation.getFrequencyErrors()}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Source name"
            variant="outlined"
            size="small"
            value={this.state.data.source}
            onChange={(event) => this.handleSourceChange(event)}
            error={!this.state.data.validation.isSourceValid}
            helperText={this.state.data.validation.getSourceErrors()}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.data.enabled}
                onChange={(event) => this.handleEnabledChange(event)}
                name="enabled"
                color="primary"
              />
            }
            label="Enabled"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.data.externalLinks}
                onChange={(event) => this.handleExternalLinksChange(event)}
                name="external_links"
                color="primary"
              />
            }
            label="External links"
          />
        </Grid>
      </Grid>
    );
  }

  private onSubmit(event: any): void {
    event.preventDefault();
    const validatedData = this.state.data.validated(this.props.enums);
    if (validatedData.validation.isValid) {
      if (this.props.onUpdate) {
        this.props.onUpdate(this.state.data.toData());
      }
    } else {
      this.setState({ data: validatedData });
    }
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  private handleSportChange(event: any): void {
    this.setState((state) => {
      return {
        data: state.data.withSportId(event.target.value, this.props.enums),
      };
    });
  }

  private handleProviderChange(event: any): void {
    this.setState((state) => {
      return { data: state.data.withProviderId(event.target.value) };
    });
  }

  private handleLanguageChange(event: any): void {
    this.setState((state) => {
      return {
        data: state.data.withLanguageCode(event.target.value, this.props.enums),
      };
    });
  }

  private handleUrlChange(event: any): void {
    const value = event.target.value;
    this.setState((state) => {
      return { data: state.data.withUrl(value) };
    });
  }

  private handleFrequencyChange(event: any): void {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      this.setState((state) => {
        return { data: state.data.withFrequency(value) };
      });
    }
  }

  private handleSourceChange(event: any): void {
    const value = event.target.value;
    this.setState((state) => {
      return { data: state.data.withSource(value) };
    });
  }

  private handleEnabledChange(event: any): void {
    const value = event.target.checked;
    this.setState((state) => {
      return { data: state.data.withEnabled(value) };
    });
  }

  private handleExternalLinksChange(event: any): void {
    const value = event.target.checked;
    this.setState((state) => {
      return { data: state.data.withExternalLinks(value) };
    });
  }
}

export default withStyles(styles)(NewsFeedEditDialogContent);
