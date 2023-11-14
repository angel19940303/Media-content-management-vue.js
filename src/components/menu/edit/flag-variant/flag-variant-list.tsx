import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { FlagVariant } from "../../../../models/enums/flag-variant";
import { ExpandLess, ExpandMore, PermMedia } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import { InputAdornment } from "@material-ui/core";

const styles = () => createStyles({});

interface RProps extends WithStyles<typeof styles> {
  variants: Map<number, string>;
  validationErrors?: Map<number, string>;
  onChange?: (variants: Map<number, string>) => void;
  onSelectImageClick?: (index: number) => void;
}

interface RState {
  isCollapsed: boolean;
}

class FlagVariantList extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = { isCollapsed: FlagVariantList.isCollapsible(props.variants) };
  }

  private static isCollapsible(variants: Map<number, string>): boolean {
    if (variants.size === 0) {
      return true;
    }
    let isCollapsible = true;
    let basePath: string | undefined = undefined;
    for (let i = 0; i < FlagVariant.VARIANTS.length; i++) {
      const valueBasePath = this.basePathFromValue(
        variants.get(FlagVariant.VARIANTS[i])
      );
      if (basePath === undefined) {
        basePath = valueBasePath;
      }
      isCollapsible =
        isCollapsible && basePath !== undefined && basePath === valueBasePath;
      if (!isCollapsible) {
        break;
      }
    }
    return isCollapsible;
  }

  private static basePathFromValue(value?: string): string | undefined {
    if (value === undefined) {
      return undefined;
    }
    const index = value.lastIndexOf("/");
    if (index < 0) {
      return undefined;
    }
    return value.substring(0, index);
  }

  render(): React.ReactNode {
    const isCollapsible = FlagVariantList.isCollapsible(this.props.variants);
    return (
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs>
                <Typography variant="h6">Flags</Typography>
              </Grid>
              {isCollapsible ? (
                <Grid item>
                  <IconButton
                    size="small"
                    onClick={() =>
                      this.setState((state) => {
                        return { isCollapsed: !state.isCollapsed };
                      })
                    }
                  >
                    {this.state.isCollapsed ? <ExpandMore /> : <ExpandLess />}
                  </IconButton>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          {isCollapsible && this.state.isCollapsed
            ? this.renderVariantsAggregated()
            : FlagVariant.VARIANTS.map((key) => this.renderVariantRow(key))}
        </Grid>
      </Grid>
    );
  }

  private renderVariantsAggregated(): React.ReactNode {
    let error: string | undefined = undefined;
    if (
      this.props.validationErrors !== undefined &&
      this.props.validationErrors.size > 0
    ) {
      const validationErrors = Array.from(this.props.validationErrors.values());
      error = validationErrors[0];
    }
    const isError = error !== undefined;
    const values = Array.from(this.props.variants.values());
    const value = FlagVariantList.basePathFromValue(
      values.length > 0 ? values[0] : undefined
    );
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          error={isError}
          label="Flag base path"
          variant="outlined"
          size="small"
          value={value}
          helperText={error}
          InputProps={{ endAdornment: this.renderButton(-1) }}
          onChange={(event) => this.onChangeAggregated(event.target.value)}
        />
      </Grid>
    );
  }

  private renderVariantRow(key: number): React.ReactNode {
    const title = FlagVariant.title(key);
    const value = this.props.variants.get(key) || "";
    const error = this.props.validationErrors?.get(key);
    const isError = error !== undefined;
    return (
      <Grid item xs={12} key={key}>
        <TextField
          fullWidth
          error={isError}
          label={title}
          variant="outlined"
          size="small"
          value={value}
          helperText={error}
          InputProps={{ endAdornment: this.renderButton(key) }}
          onChange={(event) => this.onChange(key, event.target.value)}
        />
      </Grid>
    );
  }

  private onChangeAggregated(basePathValue: string): void {
    if (this.props.onChange) {
      const newVariants = new Map<number, string>();
      FlagVariant.VARIANTS.forEach((variant) => {
        newVariants.set(
          variant,
          basePathValue + "/" + FlagVariant.fileName(variant)
        );
      });
      this.props.onChange(newVariants);
    }
  }

  private onChange(key: number, value: string): void {
    if (this.props.onChange) {
      const newVariants = new Map<number, string>(this.props.variants);
      newVariants.set(key, value);
      this.props.onChange(newVariants);
    }
  }

  private renderButton(index: number): React.ReactNode {
    if (index < 0) {
      return "";
    }
    return (
      <InputAdornment position="end">
        <IconButton onClick={() => this.onSelectImageClick(index)} size="small">
          <PermMedia />
        </IconButton>
      </InputAdornment>
    );
  }

  private onSelectImageClick(index: number): void {
    if (this.props.onSelectImageClick) {
      this.props.onSelectImageClick(index);
    }
  }
}

export default withStyles(styles)(FlagVariantList);
