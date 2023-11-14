import React, { ChangeEvent, FormEvent } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { FormHelperText, OutlinedInput } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import CancelIcon from "@material-ui/icons/Cancel";
import FormControl from "@material-ui/core/FormControl";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";

const styles = createStyles({
  smallIcon: {
    fontSize: 18,
  },
});

interface EditableValueFieldProps extends WithStyles<typeof styles> {
  label: string;
  labelWidth: number;
  value: string | undefined;
  errorMessage?: string;
  isEditing: boolean;
  onChange: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: () => void;
  onCancel: () => void;
}

class EditableValueField extends React.PureComponent<
  EditableValueFieldProps,
  any
> {
  render(): React.ReactNode {
    if (this.props.isEditing) {
      return (
        <form onSubmit={(event) => this.props.onSubmit(event)}>
          <FormControl
            variant="outlined"
            size="small"
            error={this.props.errorMessage !== undefined}
          >
            <InputLabel>{this.props.label}</InputLabel>
            <OutlinedInput
              value={this.props.value || ""}
              onChange={this.props.onChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton size="small" type="submit">
                    <CheckIcon />
                  </IconButton>
                  <IconButton size="small" onClick={this.props.onCancel}>
                    <CancelIcon />
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={46}
            />
            {this.props.errorMessage === undefined ? undefined : (
              <FormHelperText>{this.props.errorMessage}</FormHelperText>
            )}
          </FormControl>
        </form>
      );
    }
    return (
      <>
        <Typography variant="caption" component="div">
          {this.props.label}
        </Typography>
        <Typography variant="body1" component="div">
          {this.props.value}
          <IconButton size="small" onClick={this.props.onEdit}>
            <EditIcon className={this.props.classes.smallIcon} />
          </IconButton>
        </Typography>
      </>
    );
  }
}

export default withStyles(styles)(EditableValueField);
