import React from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { StageMapping } from "../../../../models/menu/stage-mapping";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import { Provider } from "../../../../models/enums/provider";
import { DateUtil } from "../../../../utils/date-util";
import { StageMappingBuilder } from "../../../../models/menu/builders/stage-mapping-builder";
import DateRangePicker from "../../../common/date-range-picker";
import { TimeRangeValidator } from "../../../../models/common/time-range";
import LocaleInput from "../../../common/locale-input";
import { LocaleBuilder } from "../../../../models/common/builders/locale-builder";
import { Locale } from "../../../../models/common/locale";
import { ConfigUtil } from "../../../../utils/config-util";
import { ValidationUtil } from "../../../../utils/validation-util";
import InputAdornmentWithVisibility from "../../../common/input-adornment-with-visibility";
import LanguageIcon from "@material-ui/icons/Language";
import { I18nUtil } from "../../../../utils/i18n-util";

const styles = () =>
  createStyles({
    row: {
      height: "60px",
      display: "flex",
      alignItems: "center",
    },
    noPadding: {
      padding: "0",
    },
    narrow: {
      minWidth: "46px",
    },
    inputContainer: {
      /*boxSizing: "border-box",*/
      padding: "16px",
    },
    fullWidth: {
      width: "100%",
    },
  });

interface RProps extends WithStyles<typeof styles> {
  mapping: StageMapping;
  language: string;
  onUpdate?: (mapping: StageMapping, close: boolean) => void;
  onClose?: (mapping: StageMapping) => void;
}

interface RState {
  mapping: StageMapping;
  isDateRangeValid: boolean;
  localizedNameErrors: string[];
}

class StageMappingEdit extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      mapping: StageMappingBuilder.from(props.mapping).build(),
      isDateRangeValid: true,
      localizedNameErrors: [],
    };
  }

  render(): React.ReactNode {
    let dateRangeText: string | undefined = undefined;
    if (this.state.mapping.timeRange) {
      dateRangeText =
        DateUtil.formatApiTimestampDateTime(
          this.state.mapping.timeRange.start
        ) +
        " - " +
        DateUtil.formatApiTimestampDateTime(this.state.mapping.timeRange.end);
    }
    let start = "",
      end = "";
    if (this.state.mapping.timeRange) {
      start = DateUtil.apiTimestampToDatePickerString(
        this.state.mapping.timeRange.start
      );
      end = DateUtil.apiTimestampToDatePickerString(
        this.state.mapping.timeRange.end
      );
    }
    const name = this.state.mapping.localizedName?.locale.get(
      this.props.language
    );
    const hasName = name !== undefined && name.value.length > 0;
    return (
      <>
        <List dense={true} className={this.props.classes.noPadding}>
          <ListItem className={this.props.classes.row}>
            <ListItemAvatar className={this.props.classes.narrow}>
              <Avatar>
                {Provider.initialsForProvider(this.state.mapping.providerId)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={this.state.mapping.fullName}
              secondary={dateRangeText}
            />
            <ListItemSecondaryAction>
              <IconButton
                aria-label="Done"
                onClick={() => this.onCheckClick()}
                disabled={!this.state.isDateRangeValid}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                aria-label="Cancel"
                onClick={() => this.onCloseClick()}
              >
                <CloseIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <div className={this.props.classes.inputContainer}>
          <DateRangePicker
            start={start}
            end={end}
            disableValidation={true}
            error={!this.state.isDateRangeValid}
            onChange={(start, end) => this.onDateRangeChange(start, end)}
          />
        </div>
        <div className={this.props.classes.inputContainer}>
          <LocaleInput
            label="Localized name"
            locale={
              this.state.mapping.localizedName ||
              LocaleBuilder.createEmpty().build()
            }
            language={this.props.language}
            className={this.props.classes.fullWidth}
            error={this.state.localizedNameErrors.length > 0}
            helperText={this.state.localizedNameErrors.join(", ")}
            onChange={(locale) => this.onLocalizedNameChange(locale)}
            InputPropsBuilder={(expanded, language) => {
              return {
                endAdornment: (
                  <InputAdornmentWithVisibility
                    position="end"
                    visible={hasName}
                  >
                    <IconButton
                      disabled={
                        (this.state.mapping.localizedName?.locale.get(
                          ConfigUtil.defaultLanguage()
                        )?.value || "") === ""
                      }
                      onClick={() => this.applyTranslation(language)}
                      size="small"
                    >
                      <LanguageIcon />
                    </IconButton>
                  </InputAdornmentWithVisibility>
                ),
              };
            }}
          />
        </div>
      </>
    );
  }

  private applyTranslation(language?: string): void {
    const localizedName = this.state.mapping.localizedName;
    if (localizedName === undefined) {
      return;
    }
    const translatedLocalizedName =
      language === undefined
        ? I18nUtil.applyTranslations(localizedName, false)
        : I18nUtil.applyTranslationToLanguage(localizedName, language, true);
    this.onLocalizedNameChange(translatedLocalizedName);
  }

  private onDateRangeChange(start: string, end: string): void {
    const isDateRangeValid = TimeRangeValidator.isValid(start, end);
    const mapping = StageMappingBuilder.from(this.state.mapping)
      .setTimeRangePartsStr(start, end)
      .build();
    this.setState({ mapping: mapping, isDateRangeValid: isDateRangeValid });
    if (this.props.onUpdate) {
      this.props.onUpdate(
        isDateRangeValid ? mapping : this.props.mapping,
        false
      );
    }
  }

  private onLocalizedNameChange(localizedName: Locale): void {
    const mapping = StageMappingBuilder.from(this.state.mapping)
      .setLocalizedName(localizedName)
      .build();
    const defaultLanguage = ConfigUtil.defaultLanguage();
    const errors = ValidationUtil.isEmptyLocaleOrHasValueForLanguage(
      localizedName,
      defaultLanguage
    )
      ? []
      : [`Missing localized name for ${defaultLanguage}`];
    this.setState({ mapping: mapping, localizedNameErrors: errors });
    if (this.props.onUpdate) {
      this.props.onUpdate(
        errors.length === 0 ? mapping : this.props.mapping,
        false
      );
    }
  }

  private onCheckClick(): void {
    if (this.props.onUpdate) {
      this.props.onUpdate(this.state.mapping, true);
    }
  }

  private onCloseClick() {
    if (this.props.onUpdate) {
      this.props.onUpdate(this.props.mapping, true);
    }
  }
}

export default withStyles(styles)(StageMappingEdit);
