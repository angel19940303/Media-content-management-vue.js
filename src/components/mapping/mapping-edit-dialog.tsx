import React from "react";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { MappingVariationPayload } from "../../models/mapping/mapping-variation-payload";
import { EnumList } from "../../models/common/enum-list";
import { MappingParticipantSearchResult } from "../../models/ui/mapping-participant-search-result";
import {
  Avatar,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import MappingSearchBar from "./mapping-search-bar";
import { ApiDataLoader } from "../../api/api-data-loader";
import { Provider } from "../../models/enums/provider";
import { Sport } from "../../models/enums/sport";
import { MappingVariation } from "../../models/mapping/mapping-variation";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import { MappingVariationAddForm } from "./mapping-variation-add-form";
import LoadingIndicator from "../common/loading-indicator";
import { MappingVariationPayloadBuilder } from "../../models/mapping/builders/mapping-variation-payload-builder";
import { LoadStatus } from "../../models/enums/load_status";
import { MappingVariationPrePopulation } from "../../models/ui/mapping-variation-prepopulation";
import Typography from "@material-ui/core/Typography";
import MasterError, { ErrorDetail } from "../master-error";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

const styles = () =>
  createStyles({
    content: {
      padding: 0,
      height: 400,
    },
    contentMessage: {
      padding: 8,
    },
    contentWrapper: {
      padding: "12px 24px",
    },
    contentButtonBar: {
      paddingTop: 24,
    },
    formContainer: {
      padding: 10,
      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    },
    loader: {
      padding: "25px",
      "& > div": {
        margin: "10px 0",
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  enums: EnumList;
  isOpen: boolean;
  onClose?: () => void;
  onUpdate?: (status: number, message?: string) => void;
}

interface SearchExpression {
  sport: string | undefined;
  providerId: number | undefined;
  searchString: string;
}

interface SearchResultSelection {
  result: MappingParticipantSearchResult;
  index: number;
  variation?: MappingVariation;
}

interface VariantPrePopulationState {
  isEnabled: boolean;
  isConfirmed: boolean;
}

interface RState {
  isLoading: boolean;
  isErrorNotFound: boolean;
  searchResultSelection?: SearchResultSelection;
  searchResults: MappingParticipantSearchResult[] | undefined;
  searchExpression: SearchExpression;
  prePopulationState: VariantPrePopulationState;
}

class MappingEditDialog extends React.Component<RProps, RState> {
  private scheduledSearchDataLoad: any | null = null;

  constructor(props: RProps) {
    super(props);
    this.state = {
      isLoading: false,
      isErrorNotFound: false,
      searchResultSelection: undefined,
      searchResults: undefined,
      searchExpression: {
        sport: Sport.enumCode(Sport.SOCCER),
        providerId: undefined,
        searchString: "",
      },
      prePopulationState: { isEnabled: false, isConfirmed: false },
    };
  }

  render(): React.ReactNode {
    return (
      <Dialog
        maxWidth={"sm"}
        fullWidth={true}
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        aria-labelledby="stage-data-batch-analysis-dialog-title"
      >
        {this.renderContent()}
        {this.renderActions()}
      </Dialog>
    );
  }

  setPrePopulation(prePopulation: MappingVariationPrePopulation): void {
    const sportCode = this.props.enums.sportName(prePopulation.sport);
    if (sportCode !== undefined) {
      this.setState({ isLoading: true, isErrorNotFound: false });
      ApiDataLoader.shared.loadSearchParticipantMappings(
        sportCode,
        prePopulation.name,
        prePopulation.provider,
        (status, data) => {
          const results = MappingParticipantSearchResult.fromPayloadList(data);
          const index = results.findIndex(
            (result) => result.participantId === prePopulation.participantId
          );
          if (index >= 0) {
            this.setState({
              isLoading: false,
              searchResults: results,
              searchExpression: {
                sport: sportCode,
                providerId: prePopulation.provider,
                searchString: prePopulation.name,
              },
              searchResultSelection: {
                result: results[index],
                index: index,
                variation: prePopulation.variation,
              },
              prePopulationState: { isEnabled: true, isConfirmed: false },
            });
          } else {
            this.setState({ isLoading: false, isErrorNotFound: true });
          }
          if (
            (status === LoadStatus.UNAUTHENTICATED ||
              status === LoadStatus.UNAUTHORIZED) &&
            this.props.onUpdate !== undefined
          ) {
            this.props.onUpdate(status);
          }
        }
      );
    }
  }

  private renderContent(): React.ReactNode {
    if (this.state.isErrorNotFound) {
      const errorDetail: ErrorDetail = {
        icon: <ErrorOutlineIcon fontSize="large" />,
        message: "Not found",
        notes: [
          "No matching team found for the selected item.",
          "Close the dialog to continue.",
        ],
      };
      return (
        <>
          <DialogTitle />
          <DialogContent className={this.props.classes.content}>
            <MasterError type="unknown" detail={errorDetail} />
          </DialogContent>
        </>
      );
    }
    if (this.state.isLoading) {
      return (
        <>
          <DialogTitle />
          <DialogContent className={this.props.classes.content}>
            <LoadingIndicator />
          </DialogContent>
        </>
      );
    }
    if (this.state.searchResultSelection) {
      if (this.state.prePopulationState.isEnabled) {
        if (this.state.prePopulationState.isConfirmed) {
          return this.renderPrePopulatedAndConfirmed();
        }
        return this.renderPrePopulated();
      }
      return this.renderVariationContent();
    }
    return this.renderSearchContent();
  }

  private renderSearchContent(): React.ReactNode {
    return (
      <>
        <DialogTitle>
          <MappingSearchBar
            enums={this.props.enums}
            sport={this.state.searchExpression.sport}
            providerId={this.state.searchExpression.providerId}
            searchString={this.state.searchExpression.searchString}
            onChange={(sport, providerId, searchString, delayLoad) =>
              this.onSearchBarChange(sport, providerId, searchString, delayLoad)
            }
          />
        </DialogTitle>
        <DialogContent dividers className={this.props.classes.content}>
          {this.renderSearchResults()}
        </DialogContent>
      </>
    );
  }

  private renderSearchResults(): React.ReactNode {
    if (this.state.searchResults === undefined) {
      return (
        <div className={this.props.classes.contentMessage}>
          Start by typing at least 3 characters
        </div>
      );
    }
    if (this.state.searchResults.length === 0) {
      return (
        <div className={this.props.classes.contentMessage}>
          No participants found for the given name
        </div>
      );
    }
    return (
      <List dense>
        {this.state.searchResults.map((result, index) => (
          <ListItem
            button
            key={result.id}
            onClick={() => this.onResultClick(result, index)}
          >
            <ListItemAvatar>
              <Avatar>{Provider.initialsForProvider(result.provider)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={result.title} secondary={result.subTitle} />
          </ListItem>
        ))}
      </List>
    );
  }

  private renderVariationContent(): React.ReactNode {
    if (this.state.searchResultSelection === undefined) {
      return null;
    }
    return (
      <>
        <DialogTitle>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar>
                {Provider.initialsForProvider(
                  this.state.searchResultSelection.result.provider
                )}
              </Avatar>
            </Grid>
            <Grid item>
              {this.state.searchResultSelection.result.title} Variations
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers className={this.props.classes.content}>
          {this.renderVariationAddForm()}
          {this.renderVariationList(
            this.state.searchResultSelection.result.variations
          )}
        </DialogContent>
      </>
    );
  }

  private renderVariationList(variations: MappingVariation[]): React.ReactNode {
    if (variations.length === 0) {
      return (
        <div className={this.props.classes.contentMessage}>
          There are no variations for this participant
        </div>
      );
    }
    return (
      <List dense>
        {variations.map((variation) => (
          <ListItem
            key={`${variation.provider_id}-${variation.entity_id}-${variation.name}`}
          >
            <ListItemAvatar>
              <Avatar>
                {Provider.initialsForProvider(variation.provider_id)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={variation.name} />
            {variations.length <= 1 ? null : (
              <ListItemSecondaryAction>
                <IconButton onClick={() => this.onVariationRemove(variation)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))}
      </List>
    );
  }

  private renderVariationAddForm(): React.ReactNode {
    if (this.state.searchResultSelection === undefined) {
      return null;
    }
    return (
      <div className={this.props.classes.formContainer}>
        <MappingVariationAddForm
          enums={this.props.enums}
          providerId={this.state.searchResultSelection.result.provider}
          participantId={this.state.searchResultSelection.result.participantId}
          variation={this.state.searchResultSelection.variation}
          onAdd={(variation) => this.onVariationAdd(variation)}
        />
      </div>
    );
  }

  private renderPrePopulated(): React.ReactNode {
    if (this.state.searchResultSelection?.variation === undefined) {
      return null;
    }
    return (
      <>
        <DialogTitle>Add Variation to Participant</DialogTitle>
        <DialogContent dividers className={this.props.classes.content}>
          <div className={this.props.classes.contentWrapper}>
            <Typography variant="subtitle2" component="div">
              Provider-specific participant info:
            </Typography>
            <div className={this.props.classes.contentWrapper}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar>
                    {Provider.initialsForProvider(
                      this.state.searchResultSelection.variation.provider_id
                    )}
                  </Avatar>
                </Grid>
                <Grid item>
                  <div>
                    {this.state.searchResultSelection.variation.entity_id}
                  </div>
                  <div>{this.state.searchResultSelection.variation.name}</div>
                </Grid>
              </Grid>
            </div>
            <Typography variant="subtitle2" component="div">
              Will be added as a variation to participant:
            </Typography>
            <div className={this.props.classes.contentWrapper}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar>
                    {Provider.initialsForProvider(
                      this.state.searchResultSelection.result.provider
                    )}
                  </Avatar>
                </Grid>
                <Grid item>
                  <div>
                    {this.state.searchResultSelection.result.participantId}
                  </div>
                  <div>{this.state.searchResultSelection.result.title}</div>
                </Grid>
              </Grid>
            </div>
            <Grid
              container
              justify="center"
              spacing={2}
              className={this.props.classes.contentButtonBar}
            >
              <Grid item>
                <Button
                  onClick={() => this.onConfirmClick()}
                  variant="contained"
                  color="primary"
                >
                  Confirm
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => this.onUpdateClick()}
                  variant="contained"
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
      </>
    );
  }

  private renderPrePopulatedAndConfirmed(): React.ReactNode {
    if (this.state.searchResultSelection?.variation === undefined) {
      return null;
    }
    const variation = this.state.searchResultSelection.variation;
    const variationProviderTitle = Provider.titleForProvider(
      variation.provider_id
    );
    const variationName = `${variationProviderTitle} ${variation.name} - ${variation.entity_id}`;

    const participant = this.state.searchResultSelection.result;
    const participantProviderTitle = Provider.titleForProvider(
      participant.provider
    );
    const participantName = `${participantProviderTitle} ${participant.title} - ${participant.participantId}`;
    return (
      <>
        <DialogTitle>Success!</DialogTitle>
        <DialogContent dividers className={this.props.classes.content}>
          <div className={this.props.classes.contentWrapper}>
            <Typography variant="body1" component="div">
              Variation <strong>{variationName}</strong>
              <br />
              has been successfully added to Participant{" "}
              <strong>{participantName}</strong>.
            </Typography>
            <Grid
              container
              justify="center"
              spacing={2}
              className={this.props.classes.contentButtonBar}
            >
              <Grid item>
                <Button
                  onClick={() => this.onClose()}
                  variant="contained"
                  color="primary"
                >
                  Done
                </Button>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
      </>
    );
  }

  private renderActions(): React.ReactNode {
    return (
      <DialogActions>
        {this.state.searchResultSelection === undefined ||
        this.state.prePopulationState.isEnabled ? null : (
          <Button onClick={() => this.onBackClick()}>Back</Button>
        )}
        <Button onClick={() => this.onClose()} color="primary">
          Close
        </Button>
      </DialogActions>
    );
  }

  private onSearchBarChange(
    sport: string | undefined,
    providerId: number | undefined,
    searchString: string,
    delayLoad: boolean
  ): void {
    const searchExpression: SearchExpression = {
      sport: sport,
      providerId: providerId,
      searchString: searchString,
    };
    this.setState({ searchExpression: searchExpression });
    if (this.scheduledSearchDataLoad !== null) {
      clearTimeout(this.scheduledSearchDataLoad);
      this.scheduledSearchDataLoad = null;
    }
    if (delayLoad) {
      this.scheduledSearchDataLoad = setTimeout(
        () => this.loadSearchData(sport, providerId, searchString),
        250
      );
    } else {
      this.loadSearchData(sport, providerId, searchString);
    }
  }

  private onBackClick(): void {
    this.setState({ searchResultSelection: undefined });
  }

  private onConfirmClick(): void {
    if (this.state.searchResultSelection?.variation === undefined) {
      return;
    }
    this.onVariationAdd(this.state.searchResultSelection.variation);
  }

  private onUpdateClick(): void {
    this.setState({
      prePopulationState: { isEnabled: false, isConfirmed: false },
    });
  }

  private onClose(): void {
    this.setState({
      searchExpression: {
        sport: Sport.enumCode(Sport.SOCCER),
        providerId: undefined,
        searchString: "",
      },
      searchResults: undefined,
      searchResultSelection: undefined,
      prePopulationState: { isEnabled: false, isConfirmed: false },
      isLoading: false,
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  private onResultClick(
    result: MappingParticipantSearchResult,
    index: number
  ): void {
    this.setState({ searchResultSelection: { result: result, index: index } });
  }

  private onVariationAdd(variation: MappingVariation): void {
    const payload = this.mappingVariationPayload(variation);
    if (payload === undefined) {
      return;
    }
    this.setState({ isLoading: true });
    ApiDataLoader.shared.saveMappingVariation(
      payload,
      (status, data, message) => {
        this.processVariationUpdate(status, message, (result) =>
          result.withAddedVariation(variation)
        );
      }
    );
  }

  private onVariationRemove(variation: MappingVariation): void {
    const payload = this.mappingVariationPayload(variation);
    if (payload === undefined) {
      return;
    }
    this.setState({ isLoading: true });
    ApiDataLoader.shared.deleteMappingVariation(
      payload,
      (status, data, message) => {
        this.processVariationUpdate(status, message, (result) =>
          result.withRemovedVariation(variation)
        );
      }
    );
  }

  private loadSearchData(
    sport: string | undefined,
    providerId: number | undefined,
    searchString: string
  ): void {
    if (searchString.length < 3) {
      this.setState({ searchResults: undefined });
      return;
    }
    if (sport === undefined) {
      this.setState({ searchResults: [] });
      return;
    }
    const sportCode = sport.toLowerCase();
    ApiDataLoader.shared.loadSearchParticipantMappings(
      sportCode,
      searchString,
      providerId,
      (status, data) => {
        this.setState({
          searchResults: MappingParticipantSearchResult.fromPayloadList(data),
        });
        if (
          (status === LoadStatus.UNAUTHENTICATED ||
            status === LoadStatus.UNAUTHORIZED) &&
          this.props.onUpdate !== undefined
        ) {
          this.props.onUpdate(status);
        }
      }
    );
  }

  private mappingVariationPayload(
    variation: MappingVariation
  ): MappingVariationPayload | undefined {
    if (this.state.searchResultSelection === undefined) {
      return undefined;
    }
    return MappingVariationPayloadBuilder.new()
      .setSportId(this.state.searchResultSelection.result.sport)
      .setGenderId(this.state.searchResultSelection.result.gender)
      .setKind(this.state.searchResultSelection.result.kind)
      .setProviderId(this.state.searchResultSelection.result.provider)
      .setParticipantId(this.state.searchResultSelection.result.participantId)
      .setVariation(variation)
      .build();
  }

  private processVariationUpdate(
    status: number,
    message: string | undefined,
    mapData: (
      data: MappingParticipantSearchResult
    ) => MappingParticipantSearchResult
  ): void {
    if (status !== LoadStatus.SUCCESS) {
      this.setState({ isLoading: false });
      if (this.props.onUpdate) {
        this.props.onUpdate(status, message || "An unknown error occurred");
      }
    } else {
      this.setState((state) => {
        const newSelection =
          state.searchResultSelection === undefined
            ? undefined
            : {
                result: mapData(state.searchResultSelection.result),
                index: state.searchResultSelection.index,
                variation: state.searchResultSelection.variation,
              };
        const newResults =
          state.searchResults === undefined
            ? undefined
            : Array.from(state.searchResults);
        if (
          newResults !== undefined &&
          newSelection !== undefined &&
          newSelection.index < newResults.length
        ) {
          newResults.splice(newSelection.index, 1, newSelection.result);
        }
        const newPrePopulationState = !state.prePopulationState.isEnabled
          ? state.prePopulationState
          : { isEnabled: true, isConfirmed: true };
        return {
          isLoading: false,
          searchResults: newResults,
          searchResultSelection: newSelection,
          prePopulationState: newPrePopulationState,
        };
      });
      if (this.props.onUpdate) {
        this.props.onUpdate(status, "Variations successfully stored");
      }
    }
  }
}

export default withStyles(styles)(MappingEditDialog);
