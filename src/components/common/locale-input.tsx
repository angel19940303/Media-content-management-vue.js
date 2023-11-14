import React from "react";
import { Locale } from "../../models/common/locale";
import TextField from "@material-ui/core/TextField";
import { LocaleBuilder } from "../../models/common/builders/locale-builder";
import { InputProps as StandardInputProps } from "@material-ui/core/Input/Input";
import IconButton from "@material-ui/core/IconButton";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { InputAdornment } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import { ConfigUtil } from "../../utils/config-util";

const styles = (theme: Theme) =>
  createStyles({
    textFieldRow: {
      display: "flex",
    },
    textFieldRowItem: {
      flex: 1,
    },
    textFieldRowButtonItem: {
      flex: "0 0 40px",
    },
    textFieldRowExpanded: {
      paddingBottom: 12,
    },
    selected: {
      "& fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  label: string;
  locale: Locale;
  language: string;
  className?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  isExpanded?: boolean;
  InputPropsBuilder?: (
    expanded: boolean,
    language?: string
  ) => Partial<StandardInputProps>;
  onChange?: (locale: Locale) => void;
}

interface RState {
  isExpanded: boolean;
}

class LocaleInput extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = { isExpanded: props.isExpanded === true };
  }

  render(): React.ReactNode {
    if (this.state.isExpanded) {
      return this.renderExpanded();
    }
    return this.renderCollapsed();
  }

  private renderCollapsed(): React.ReactNode {
    return (
      <div className={this.props.classes.textFieldRow}>
        <div className={this.props.classes.textFieldRowItem}>
          {this.renderTextField(
            this.props.language,
            undefined,
            false,
            this.props.helperText
          )}
        </div>
        <div className={this.props.classes.textFieldRowButtonItem}>
          <IconButton onClick={() => this.setState({ isExpanded: true })}>
            <ExpandMore />
          </IconButton>
        </div>
      </div>
    );
  }

  private renderExpanded(): React.ReactNode {
    const rows = new Array<React.ReactNode>();
    ConfigUtil.languages().forEach((language, index) => {
      const row = new Array<React.ReactNode>();
      const isLast = index === ConfigUtil.languages().length - 1;
      const helperText = isLast ? this.props.helperText : undefined;
      row.push(
        <div key="textField" className={this.props.classes.textFieldRowItem}>
          {this.renderTextField(
            language.code,
            language.shortCode,
            true,
            helperText
          )}
        </div>
      );
      if (rows.length === 0) {
        row.push(
          <div
            key="button"
            className={this.props.classes.textFieldRowButtonItem}
          >
            <IconButton onClick={() => this.setState({ isExpanded: false })}>
              <ExpandLess />
            </IconButton>
          </div>
        );
      } else {
        row.push(
          <div
            key="button"
            className={this.props.classes.textFieldRowButtonItem}
          />
        );
      }
      const key = this.props.label + "_" + language.code;
      const className =
        this.props.classes.textFieldRow +
        " " +
        this.props.classes.textFieldRowExpanded;
      rows.push(
        <div key={key} className={className}>
          {row}
        </div>
      );
    });
    return rows;
  }

  private renderTextField(
    language: string,
    prefix: string | undefined,
    highlightSelected: boolean,
    helperText?: React.ReactNode
  ): React.ReactNode {
    const value = this.props.locale.locale.get(language)?.value || "";
    const languageArg = this.state.isExpanded ? language : undefined;
    let inputProps: Partial<StandardInputProps> = {};
    if (this.props.InputPropsBuilder) {
      inputProps = this.props.InputPropsBuilder(
        this.state.isExpanded,
        languageArg
      );
    }
    if (prefix !== undefined) {
      inputProps.startAdornment = (
        <InputAdornment position="start">
          <Avatar>{prefix}</Avatar>
        </InputAdornment>
      );
    }

    let className = this.props.className || "";
    if (highlightSelected && language === this.props.language) {
      className += " " + this.props.classes.selected;
    }

    return (
      <TextField
        label={this.props.label}
        variant="outlined"
        size="small"
        value={value}
        error={this.props.error === true}
        helperText={helperText}
        className={className}
        InputProps={inputProps}
        onChange={(event) => this.handleTextChange(event, language)}
      />
    );
  }

  private handleTextChange(event: any, language: string): void {
    if (this.props.onChange) {
      const locale = LocaleBuilder.fromLocale(this.props.locale)
        .addValueParts(language, event.target.value, true)
        .build();
      this.props.onChange(locale);
    }
  }
}

export default withStyles(styles)(LocaleInput);
