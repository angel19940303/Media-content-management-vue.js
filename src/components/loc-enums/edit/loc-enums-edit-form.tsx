import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { LocEnumItem } from "../../../models/loc-enums/loc-enum-item";
import BaseEditBottomBar from "../../common/base-edit-bottom-bar";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import LocaleInput from "../../common/locale-input";
import { LocEnumFormData } from "../../../models/ui/loc-enum-form-data";
import ProviderIdInput from "./provider-ids/provider-id-input";
import { Provider } from "../../../models/enums/provider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ConfigUtil } from "../../../utils/config-util";

const styles = (theme: Theme) =>
  createStyles({
    contentWrapper: {
      overflow: "auto",
      boxSizing: "border-box",
      padding: "20px 16px",
    },
    fullWidth: {
      width: "100%",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  height: number;
  item: LocEnumItem;
  isNew: boolean;
  onSave?: (data: LocEnumFormData, createNew: boolean) => void;
  onCancel?: () => void;
}

interface RState {
  selectedLanguage: string;
  selectedProviderId: number;
  data: LocEnumFormData;
}

class LocEnumsEditForm extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    let selectedProviderId = Provider.INTERNAL;
    if (props.item.providerIds.size > 0) {
      selectedProviderId = Array.from(props.item.providerIds.keys())[0];
    }
    this.state = {
      selectedLanguage: ConfigUtil.defaultLanguage(),
      selectedProviderId: selectedProviderId,
      data: LocEnumFormData.from(props.item),
    };
  }

  render(): React.ReactNode {
    return (
      <Grid item xs={12} md={6}>
        <form onSubmit={(event) => this.onSubmit(event)}>
          <div
            style={{ height: this.props.height - 50 }}
            className={this.props.classes.contentWrapper}
          >
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" component="h4">
                  Name
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" size="small">
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={this.state.selectedLanguage}
                    onChange={(event) => this.handleLanguageChange(event)}
                    label="Language"
                  >
                    {ConfigUtil.languages().map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <LocaleInput
                  label="Name"
                  key={"name-" + this.state.selectedLanguage}
                  locale={this.state.data.name}
                  language={this.state.selectedLanguage}
                  className={this.props.classes.fullWidth}
                  error={!this.state.data.validation.isNameValid}
                  helperText={this.state.data.validation.getNameErrors()}
                  onChange={(locale) =>
                    this.setState({ data: this.state.data.withName(locale) })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" component="h4">
                  IDs per provider
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" size="small">
                  <InputLabel>Provider</InputLabel>
                  <Select
                    value={this.state.selectedProviderId}
                    onChange={(event) => this.handleProviderChange(event)}
                    label="Provider"
                  >
                    {Provider.PROVIDERS.map((providerId) => (
                      <MenuItem key={providerId} value={providerId}>
                        {Provider.titleForProvider(providerId)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <ProviderIdInput
                  label="ID"
                  data={this.state.data.providerIds}
                  providerId={this.state.selectedProviderId}
                  error={!this.state.data.validation.areProviderIdsValid}
                  helperText={this.state.data.validation.getProviderIdErrors()}
                  onChange={(providerIds) =>
                    this.setState({
                      data: this.state.data.withProviderIds(providerIds),
                    })
                  }
                />
              </Grid>
            </Grid>
          </div>
          <BaseEditBottomBar>
            <Button variant="contained" color="primary" type="submit">
              {this.props.isNew ? "Create" : "Update"}
            </Button>
            <Button variant="contained" onClick={() => this.onCancel()}>
              Close
            </Button>
          </BaseEditBottomBar>
        </form>
      </Grid>
    );
  }

  private handleLanguageChange(event: any): void {
    this.setState({ selectedLanguage: event.target.value });
  }

  private handleProviderChange(event: any): void {
    this.setState({ selectedProviderId: event.target.value });
  }

  private onSubmit(event: any) {
    event.preventDefault();
    const data = this.state.data.validated();
    if (data.validation.isValid) {
      if (this.props.onSave) {
        this.props.onSave(data, false);
      }
    } else {
      this.setState({ data: data });
    }
  }

  private onCancel(): void {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }
}

export default withStyles(styles)(LocEnumsEditForm);
