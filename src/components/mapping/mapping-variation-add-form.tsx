import React from "react";
import { EnumList } from "../../models/common/enum-list";
import { MappingVariation } from "../../models/mapping/mapping-variation";
import Grid from "@material-ui/core/Grid";
import { EnumProviderSelect } from "../common/enum-provider-select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { MappingVariationFormData } from "../../models/ui/mapping-variation-form-data";

interface RProps {
  enums: EnumList;
  providerId: number;
  participantId: string;
  variation?: MappingVariation;
  onAdd?: (variation: MappingVariation) => void;
}

interface RState {
  formData: MappingVariationFormData;
}

export class MappingVariationAddForm extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    const formData = MappingVariationFormData.fromData(
      props.variation?.provider_id || props.providerId,
      props.variation?.name || "",
      props.variation?.entity_id || "",
      true,
      props.enums
    );
    this.state = { formData: formData };
  }

  render(): React.ReactNode {
    return (
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <EnumProviderSelect
            enums={this.props.enums}
            selectedProviderId={this.state.formData.providerId}
            error={!this.state.formData.validation.isProviderIdValid}
            helperText={this.state.formData.validation
              .getProviderIdErrors()
              .join(", ")}
            onChange={(providerId) => this.onProviderSelect(providerId)}
          />
        </Grid>
        <Grid item xs>
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            fullWidth
            value={this.state.formData.name}
            helperText={this.state.formData.validation
              .getNameErrors()
              .join(", ")}
            error={!this.state.formData.validation.isNameValid}
            onChange={(event) => this.onNameChange(event)}
          />
        </Grid>
        <Grid item>
          <TextField
            label="ID (optional)"
            variant="outlined"
            size="small"
            fullWidth
            value={this.state.formData.entityId}
            helperText={this.state.formData.validation.entityIdErrors.join(
              ", "
            )}
            error={!this.state.formData.validation.isEntityIdValid}
            onChange={(event) => this.onIdChange(event)}
          />
        </Grid>
        <Grid item>
          <Button onClick={() => this.onAddClick()} variant="contained">
            Add
          </Button>
        </Grid>
      </Grid>
    );
  }

  private onProviderSelect(providerId: number): void {
    this.setState((state) => {
      return {
        formData: state.formData.withProviderId(providerId, this.props.enums),
      };
    });
  }

  private onNameChange(event: any): void {
    const name: string = event.target.value;
    this.setState((state) => {
      return { formData: state.formData.withName(name) };
    });
  }

  private onIdChange(event: any): void {
    const entityId: string = event.target.value;
    this.setState((state) => {
      return { formData: state.formData.withEntityId(entityId) };
    });
  }

  private onAddClick(): void {
    const validatedFormData = this.state.formData.validated(this.props.enums);
    if (validatedFormData.validation.isValid) {
      const payload = validatedFormData.payload();
      if (payload.entity_id.length === 0) {
        payload.entity_id = this.props.participantId;
      }
      if (this.props.onAdd !== undefined) {
        this.props.onAdd(payload);
      }
    } else {
      this.setState({ formData: validatedFormData });
    }
  }
}
