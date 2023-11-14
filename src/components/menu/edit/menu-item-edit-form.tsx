import React from "react";
import { FormHelperText, Grid } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import { TreeDataNodeType } from "../../../models/enums/tree-data-node-type";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import AddIcon from "@material-ui/icons/Add";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Gender } from "../../../models/enums/gender";
import Button from "@material-ui/core/Button";
import { MenuFormData } from "../../../models/ui/menu-form-data";
import { MenuItem as MenuItemData } from "../../../models/menu/menu-item";
import LocaleInput from "../../common/locale-input";
import { StageMapping } from "../../../models/menu/stage-mapping";
import DateRangePicker from "../../common/date-range-picker";
import StageMappingDialog from "./stage-mapping/stage-mapping-dialog";
import { AssignedSeasonCounter } from "../../../models/ui/assigned-season-counter";
import StageMappingList from "./stage-mapping/stage-mapping-list";
import BaseEditBottomBar from "../../common/base-edit-bottom-bar";
import FlagVariantList from "./flag-variant/flag-variant-list";
import IconButton from "@material-ui/core/IconButton";
import EntryListDialog from "./entry-list/entry-list-dialog";
import RedoIcon from "@material-ui/icons/Redo";
import LanguageIcon from "@material-ui/icons/Language";
import { LocaleBuilder } from "../../../models/common/builders/locale-builder";
import { TextUtil } from "../../../utils/text-util";
import { MenuItemType } from "../../../models/enums/menu-item-type";
import MenuItemAnalyser from "./menu-item-analyser/menu-item-analyser";
import InputAdornmentWithVisibility from "../../common/input-adornment-with-visibility";
import { I18nUtil } from "../../../utils/i18n-util";
import { Locale } from "../../../models/common/locale";
import ImageDialog from "../../common/image-dialog";
import { ConfigUtil } from "../../../utils/config-util";
import { CountryCode } from "../../../models/common/country-code";
import Chip from "@material-ui/core/Chip";
import { MatchRound } from "../../../models/enums/match-round";
import Paper from "@material-ui/core/Paper";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: 936,
      margin: "auto",
      overflow: "hidden",
    },
    searchBar: {
      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    },
    searchInput: {
      fontSize: theme.typography.fontSize,
    },
    block: {
      display: "block",
    },
    addUser: {
      marginRight: theme.spacing(1),
    },
    contentWrapper: {
      boxSizing: "border-box",
      padding: "20px 16px",
    },
    formContainer: {
      position: "relative",
      borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
    },
    fullWidth: {
      width: "100%",
    },
    editForm: {
      overflow: "auto",
    },
    basePathBar: {
      color: "rgba(0, 0, 0, 0.4)",
      "& svg": {
        verticalAlign: "middle",
      },
    },
    narrow: {
      paddingTop: "0!important",
      paddingBottom: "0!important",
    },
    idItem: {
      color: "rgba(0, 0, 0, 0.4)",
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    secondaryPropBoxPaper: {
      padding: 10,
    },
    secondaryPropBoxItemOffset: {
      paddingTop: 10,
    },
  });

interface RProps extends WithStyles<typeof styles> {
  item: MenuItemData;
  siblings: Array<MenuItemData>;
  basePath: Array<string>;
  existingEntryIds: Set<string>;
  assignedSeasonCounter: AssignedSeasonCounter;
  isNew: boolean;
  onSave?: (
    data: MenuFormData,
    assignedSeasonCounter: AssignedSeasonCounter
  ) => void;
  onCancel?: () => void;
  onStageMappingRefresh?: (mapping: StageMapping) => void;
  onError?: (loadStatus: number) => void;
  height: number;
  sport?: string;
  selectedLanguage: string;
  countryCodes: Array<CountryCode>;
}

interface RState {
  data: MenuFormData;
  selectedLanguage: string;
  isStageMappingDialogOpen: boolean;
  isEntryDialogOpen: boolean;
  assignedSeasonCounter: AssignedSeasonCounter;
  selectedStageMappingIndex?: number;
  selectedImageIndex?: number;
}

class MenuItemEditForm extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      data: MenuFormData.from(props.item, props.siblings),
      selectedLanguage: props.selectedLanguage,
      isStageMappingDialogOpen: false,
      isEntryDialogOpen: false,
      assignedSeasonCounter: props.assignedSeasonCounter,
    };
  }

  render(): React.ReactNode {
    const name = this.state.data.name.locale.get(this.state.selectedLanguage);
    const hasName = name !== undefined && name.value.length > 0;
    return (
      <Grid item xs={12} md={6} className={this.props.classes.formContainer}>
        <form
          onSubmit={(event) => this.onSubmit(event)}
          action="/"
          style={{ height: this.props.height }}
          className={this.props.classes.editForm}
        >
          <div
            className={this.props.classes.contentWrapper}
            style={{ height: this.props.height - 50, overflow: "auto" }}
          >
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12}>
                <div className={this.props.classes.basePathBar}>
                  Root
                  <ChevronRightIcon />
                  {this.props.basePath.map((part) => (
                    <React.Fragment key={part}>
                      {part}
                      <ChevronRightIcon />
                    </React.Fragment>
                  ))}
                </div>
                <Typography variant="h5" component="h3">
                  {TreeDataNodeType.titleForType(this.state.data.type)}
                  {this.renderEntryDialogButton()}
                </Typography>
                {this.props.item.id !== undefined ? (
                  <div className={this.props.classes.idItem}>
                    {this.props.item.id}
                  </div>
                ) : (
                  ""
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" size="small">
                  <InputLabel>Language</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
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
                  InputPropsBuilder={(expanded, language) => {
                    return {
                      endAdornment: (
                        <InputAdornmentWithVisibility
                          position="end"
                          visible={hasName}
                        >
                          <IconButton
                            disabled={
                              (this.state.data.name.locale.get(
                                ConfigUtil.defaultLanguage()
                              )?.value || "") === ""
                            }
                            onClick={() =>
                              this.applyTranslationToName(language)
                            }
                            size="small"
                          >
                            <LanguageIcon />
                          </IconButton>
                        </InputAdornmentWithVisibility>
                      ),
                    };
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <LocaleInput
                  label="Short Name"
                  key={"short-name-" + this.state.selectedLanguage}
                  locale={this.state.data.shortName}
                  language={this.state.selectedLanguage}
                  className={this.props.classes.fullWidth}
                  onChange={(locale) =>
                    this.setState({
                      data: this.state.data.withShortName(locale),
                    })
                  }
                  InputPropsBuilder={(expanded, language) => {
                    return {
                      endAdornment: (
                        <InputAdornmentWithVisibility
                          position="end"
                          visible={hasName}
                        >
                          <IconButton
                            disabled={
                              (this.state.data.shortName.locale.get(
                                ConfigUtil.defaultLanguage()
                              )?.value || "") === ""
                            }
                            onClick={() =>
                              this.applyTranslationToShortName(language)
                            }
                            size="small"
                          >
                            <LanguageIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => this.copyNameToShortName(language)}
                            size="small"
                          >
                            <RedoIcon />
                          </IconButton>
                        </InputAdornmentWithVisibility>
                      ),
                    };
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <LocaleInput
                  label="Code"
                  key={"code-" + this.state.selectedLanguage}
                  locale={this.state.data.code}
                  language={this.state.selectedLanguage}
                  className={this.props.classes.fullWidth}
                  error={!this.state.data.validation.isCodeValid}
                  helperText={this.state.data.validation.getCodeErrors()}
                  onChange={(locale) =>
                    this.setState({
                      data: this.state.data.withCode(
                        locale,
                        this.props.siblings
                      ),
                    })
                  }
                  InputPropsBuilder={(expanded, language) => {
                    return {
                      endAdornment: (
                        <InputAdornmentWithVisibility
                          position="end"
                          visible={hasName}
                        >
                          <IconButton
                            onClick={() => this.createCodeFromName(language)}
                            size="small"
                          >
                            <RedoIcon />
                          </IconButton>
                        </InputAdornmentWithVisibility>
                      ),
                    };
                  }}
                />
              </Grid>
              {this.renderGender()}
              {this.renderDateRange()}
              {this.renderCountryCodeSelect()}
              <Grid item xs={12}>
                <Typography variant="h6" component="h4">
                  Properties
                </Typography>
              </Grid>
              {this.renderHiddenSwitch()}
              {this.renderNoTableSwitch()}
              {this.renderNoDrawSwitch()}
              {this.renderNoScorersSwitch()}
              {this.renderNoTeamStatsSwitch()}
              {this.renderNoTrackerSwitch()}
              {this.renderPrimarySwitch()}
              {this.renderDomesticLeagueSwitch()}
              {this.renderHighlightedTournamentSwitch()}
              {this.renderHighlightedMatchListSectionsSwitch()}
              {this.renderStageMappingList()}
              {this.renderFlagVariantList()}
            </Grid>
            {this.renderStageMappingAddDialog()}
            {this.renderEntryListDialog()}
            {this.renderImageDialog()}
            <MenuItemAnalyser
              sportCode={this.props.sport}
              menuItemData={this.state.data}
              onUpdate={(property: number, value: boolean) =>
                this.handleAnalyserUpdate(property, value)
              }
            />
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

  private renderEntryDialogButton(): React.ReactNode {
    if (!this.props.isNew || this.props.item.type === MenuItemType.SEASON) {
      return undefined;
    }
    return (
      <IconButton onClick={() => this.setState({ isEntryDialogOpen: true })}>
        <AddIcon />
      </IconButton>
    );
  }

  private renderStageMappingAddDialog(): React.ReactNode {
    if (!this.state.isStageMappingDialogOpen) {
      return "";
    }
    return (
      <StageMappingDialog
        sport={this.props.sport}
        title="Season Stage Mappings"
        mappings={this.state.data.stageMappings}
        language={this.state.selectedLanguage}
        selectedIndex={this.state.selectedStageMappingIndex}
        assignedSeasonCounter={this.state.assignedSeasonCounter}
        isOpen={this.state.isStageMappingDialogOpen}
        onUpdate={(mappings) => this.onStageMappingListUpdate(mappings)}
        onClose={(assignedSeasonCounter) =>
          this.onAddStageMappingClose(assignedSeasonCounter)
        }
        onError={(loadStatus) => {
          if (this.props.onError !== undefined) {
            this.props.onError(loadStatus);
          }
        }}
      />
    );
  }

  private renderEntryListDialog(): React.ReactNode {
    if (!this.state.isEntryDialogOpen) {
      return "";
    }
    return (
      <EntryListDialog
        isOpen={this.state.isEntryDialogOpen}
        sport={this.props.sport}
        type={this.state.data.type}
        existingEntryIds={this.props.existingEntryIds}
        onClose={() => this.setState({ isEntryDialogOpen: false })}
        onSelect={(item) =>
          this.setState({
            data: MenuFormData.from(item, this.props.siblings),
            isEntryDialogOpen: false,
          })
        }
      />
    );
  }

  private renderImageDialog(): React.ReactNode {
    if (this.state.selectedImageIndex === undefined) {
      return "";
    }
    return (
      <ImageDialog
        isOpen={true}
        selectedImageUrl={this.state.data.flagVariants.get(
          this.state.selectedImageIndex
        )}
        onSelectImage={(imageUrl) => this.onImageSelect(imageUrl)}
        onClose={() => this.setState({ selectedImageIndex: undefined })}
      />
    );
  }

  private renderGender(): React.ReactNode {
    if (this.state.data.type === TreeDataNodeType.STAGE) {
      const onChange = (event: any) =>
        this.setState({ data: this.state.data.withGender(event.target.value) });
      const renderItem = (gender: number) => (
        <MenuItem key={gender} value={gender}>
          {Gender.title(gender)}
        </MenuItem>
      );
      return (
        <Grid item xs={12}>
          <FormControl variant="outlined" size="small">
            <InputLabel id="demo-simple-select-outlined-label">
              Gender
            </InputLabel>
            <Select
              label="Gender"
              value={this.state.data.gender}
              onChange={onChange}
            >
              {Gender.GENDER_LIST.map(renderItem)}
            </Select>
          </FormControl>
        </Grid>
      );
    }
    return undefined;
  }

  private renderDateRange(): React.ReactNode {
    if (this.state.data.type === TreeDataNodeType.SEASON) {
      return (
        <Grid item xs={12}>
          <DateRangePicker
            disableValidation
            error={!this.state.data.validation.isTimeRangeValid}
            start={this.state.data.start}
            end={this.state.data.end}
            helperText={this.state.data.validation.getTimeRangeErrors()}
            onChange={(start, end) =>
              this.setState({ data: this.state.data.withTimeRange(start, end) })
            }
          />
        </Grid>
      );
    }
    return undefined;
  }

  private renderCountryCodeSelect(): React.ReactNode {
    if (
      this.state.data.type === TreeDataNodeType.CATEGORY ||
      this.state.data.type === TreeDataNodeType.STAGE
    ) {
      return (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" component="h4">
              Country codes
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Country codes</InputLabel>
              <Select
                multiple
                label="Country codes"
                value={this.state.data.countryCodes}
                onChange={(event) => this.onCountryCodesChange(event)}
                renderValue={(selected: any) => (
                  <div className={this.props.classes.chips}>
                    {selected.map((value: any) => (
                      <Chip
                        key={value}
                        label={value}
                        className={this.props.classes.chip}
                      />
                    ))}
                  </div>
                )}
              >
                {this.props.countryCodes.map((countryCode) => (
                  <MenuItem
                    key={countryCode.alpha_2_code}
                    value={countryCode.alpha_2_code}
                  >
                    {countryCode.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </>
      );
    }
    return null;
  }

  private renderHiddenSwitch(): React.ReactNode {
    return this.renderSwitch(
      "Hidden",
      "hidden",
      this.state.data.hidden,
      [TreeDataNodeType.CATEGORY, TreeDataNodeType.STAGE],
      undefined,
      (event: any) =>
        this.setState({
          data: this.state.data.withHidden(event.target.checked),
        })
    );
  }

  private renderNoTableSwitch(): React.ReactNode {
    return this.renderSwitch(
      "No League Table",
      "noTable",
      this.state.data.noTable,
      [TreeDataNodeType.STAGE],
      undefined,
      (event: any) =>
        this.setState({
          data: this.state.data.withNoTable(event.target.checked),
        })
    );
  }

  private renderNoScorersSwitch(): React.ReactNode {
    return this.renderSwitch(
      "No Top Scorers",
      "noScorers",
      this.state.data.noScorers,
      [TreeDataNodeType.STAGE],
      undefined,
      (event: any) =>
        this.setState({
          data: this.state.data.withNoScorers(event.target.checked),
        })
    );
  }

  private renderNoTeamStatsSwitch(): React.ReactNode {
    return this.renderSwitch(
      "No Team Stats",
      "noTeamStats",
      this.state.data.noTeamStats,
      [TreeDataNodeType.STAGE],
      undefined,
      (event: any) =>
        this.setState({
          data: this.state.data.withNoTeamStats(event.target.checked),
        })
    );
  }

  private renderNoTrackerSwitch(): React.ReactNode {
    return this.renderSwitch(
      "No Tracker Widget",
      "noTracker",
      this.state.data.noTracker,
      [TreeDataNodeType.STAGE],
      undefined,
      (event: any) =>
        this.setState({
          data: this.state.data.withNoTracker(event.target.checked),
        })
    );
  }

  private renderNoDrawSwitch(): React.ReactNode {
    return this.renderSwitch(
      "No Draw",
      "noDraw",
      this.state.data.noDraw,
      [TreeDataNodeType.STAGE],
      undefined,
      (event: any) =>
        this.setState({
          data: this.state.data.withNoDraw(event.target.checked),
        })
    );
  }

  private renderPrimarySwitch(): React.ReactNode {
    return this.renderSwitch(
      "Primary",
      "primary",
      this.state.data.primary,
      [TreeDataNodeType.SEASON],
      this.state.data.validation.getPrimaryErrors(),
      (event: any) =>
        this.setState({
          data: this.state.data.withPrimary(
            event.target.checked,
            this.props.siblings
          ),
        })
    );
  }

  private renderDomesticLeagueSwitch(): React.ReactNode {
    return this.renderSwitch(
      "Domestic League",
      "domesticLeague",
      this.state.data.domesticLeague,
      [TreeDataNodeType.STAGE],
      undefined,
      (event: any) =>
        this.setState({
          data: this.state.data.withDomesticLeague(event.target.checked),
        })
    );
  }

  private renderHighlightedTournamentSwitch(): React.ReactNode {
    return this.renderSwitch(
      "Highlighted Tournament",
      "highlightedTournament",
      this.state.data.highlightedTournament,
      [TreeDataNodeType.STAGE],
      undefined,
      (event: any) => {
        const isChecked = event.target.checked;
        this.setState((state) => {
          return {
            data: state.data
              .withHighlightedTournament(isChecked)
              .withHighlightedMatchListSections(
                isChecked && state.data.highlightedMatchListSections
              )
              .withHighlightedMatchRounds(
                isChecked ? state.data.highlightedMatchRounds : []
              ),
          };
        });
      }
    );
  }

  //renderHighlightedMatchListSectionsSwitch
  private renderHighlightedMatchListSectionsSwitch(): React.ReactNode {
    if (!this.state.data.highlightedTournament) {
      return null;
    }
    return (
      <Grid item xs={12} className={this.props.classes.narrow}>
        <Paper
          variant="outlined"
          className={this.props.classes.secondaryPropBoxPaper}
        >
          <Grid container alignItems="center">
            {this.renderSwitch(
              "Highlighted Match List Sections",
              "highlightedMatchListSections",
              this.state.data.highlightedMatchListSections,
              [TreeDataNodeType.STAGE],
              undefined,
              (event: any) => {
                const isChecked = event.target.checked;
                this.setState((state) => {
                  return {
                    data: state.data
                      .withHighlightedMatchListSections(isChecked)
                      .withHighlightedMatchRounds(
                        isChecked ? state.data.highlightedMatchRounds : []
                      ),
                  };
                });
              },
              true
            )}
            {!this.state.data.highlightedMatchListSections ? null : (
              <Grid
                item
                xs={12}
                className={this.props.classes.secondaryPropBoxItemOffset}
              >
                <FormControl variant="outlined" size="small">
                  <InputLabel>Filter match rounds</InputLabel>
                  <Select
                    multiple
                    label="Filter match rounds"
                    value={this.state.data.highlightedMatchRounds}
                    onChange={(event) =>
                      this.onHighlightedMatchRoundsChange(event)
                    }
                    renderValue={(selected: any) =>
                      selected.length > 3
                        ? `${selected.length} rounds`
                        : selected
                            .map((s: any) => MatchRound.titleForRound(s))
                            .join(", ")
                    }
                  >
                    {MatchRound.ALL.map((matchRound) => (
                      <MenuItem key={matchRound} value={matchRound}>
                        {MatchRound.titleForRound(matchRound)}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Leave empty to highlight all</FormHelperText>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
    );
  }

  private renderSwitch(
    label: string,
    name: string,
    value: boolean,
    types: Array<number>,
    errors: Array<string> | undefined,
    onChange: (event: any) => void,
    secondary?: boolean
  ): React.ReactNode {
    if (types.indexOf(this.state.data.type) >= 0) {
      const control = (
        <Switch
          checked={value}
          name={name}
          color={secondary === true ? "secondary" : "primary"}
          onChange={onChange}
        />
      );
      const validation =
        errors === undefined ? undefined : (
          <FormHelperText>{errors}</FormHelperText>
        );
      return (
        <Grid item xs={12} className={this.props.classes.narrow}>
          <FormControl error={errors !== undefined && errors.length > 0}>
            <FormControlLabel control={control} label={label} />
            {validation}
          </FormControl>
        </Grid>
      );
    }
    return undefined;
  }

  private renderStageMappingList(): React.ReactNode {
    if (this.state.data.type === TreeDataNodeType.SEASON) {
      return (
        <StageMappingList
          mappings={this.state.data.stageMappings}
          error={!this.state.data.validation.isStageMappingValid}
          helperText={this.state.data.validation.getStageMappingErrors()}
          onOpen={() => this.setState({ isStageMappingDialogOpen: true })}
          onUpdate={(index) =>
            this.setState({
              isStageMappingDialogOpen: true,
              selectedStageMappingIndex: index,
            })
          }
          onRemove={(index) => this.onStageMappingRemove(index)}
          onRefresh={(mapping) => this.onStageMappingRefresh(mapping)}
        />
      );
    }
    return undefined;
  }

  private renderFlagVariantList(): React.ReactNode {
    if (this.state.data.type === TreeDataNodeType.CATEGORY) {
      return (
        <FlagVariantList
          variants={this.state.data.flagVariants}
          validationErrors={this.state.data.validation.getFlagVariantErrors()}
          onChange={(flagVariants) =>
            this.setState({
              data: this.state.data.withFlagVariants(flagVariants),
            })
          }
          onSelectImageClick={(index) =>
            this.setState({ selectedImageIndex: index })
          }
        />
      );
    }
    return undefined;
  }

  private copyNameToShortName(language?: string): void {
    this.setState((state) => {
      const shortNameBuilder = LocaleBuilder.fromLocale(state.data.shortName);
      const primaryLanguage = language || ConfigUtil.defaultLanguage();
      const name = state.data.name.locale.get(primaryLanguage);
      if (name !== undefined) {
        if (language !== undefined) {
          shortNameBuilder.addValueParts(language, name.value, true);
        } else {
          const selectedNameValue = state.data.shortName.locale.get(
            state.selectedLanguage
          );
          state.data.name.locale.forEach((value, language) => {
            const currentNameValue = state.data.shortName.locale.get(language);
            if (
              currentNameValue === undefined ||
              currentNameValue.value.length === 0 ||
              currentNameValue.value === selectedNameValue?.value
            ) {
              shortNameBuilder.addValueParts(language, name.value, true);
            }
          });
        }
      }
      return { data: state.data.withShortName(shortNameBuilder.build()) };
    });
  }

  private createCodeFromName(language?: string): void {
    this.setState((state) => {
      const codeBuilder = LocaleBuilder.fromLocale(state.data.code);
      const primaryLanguage = language || ConfigUtil.defaultLanguage();
      const name =
        state.data.name.locale.get(primaryLanguage) ||
        state.data.name.locale.get(ConfigUtil.defaultLanguage());
      if (name !== undefined) {
        const codeValue = TextUtil.strToUrlCode(name.value);
        if (language !== undefined) {
          codeBuilder.addValueParts(language, codeValue, true);
        } else {
          const selectedCodeValue = state.data.code.locale.get(
            state.selectedLanguage
          );
          state.data.name.locale.forEach((value, language) => {
            const currentCodeValue = state.data.code.locale.get(language);
            if (
              currentCodeValue === undefined ||
              currentCodeValue.value.length === 0 ||
              currentCodeValue.value === selectedCodeValue?.value
            ) {
              codeBuilder.addValueParts(language, codeValue, true);
            }
          });
        }
      }
      console.log(codeBuilder.build());
      return {
        data: state.data.withCode(codeBuilder.build(), this.props.siblings),
      };
    });
  }

  private applyTranslationToName(language?: string): void {
    this.setState((state) => {
      return {
        data: state.data.withName(
          this.applyTranslation(state.data.name, language)
        ),
      };
    });
  }

  private applyTranslationToShortName(language?: string): void {
    this.setState((state) => {
      return {
        data: state.data.withShortName(
          this.applyTranslation(state.data.shortName, language)
        ),
      };
    });
  }

  private applyTranslation(locale: Locale, language?: string): Locale {
    if (language !== undefined) {
      return I18nUtil.applyTranslationToLanguage(locale, language, true);
    }
    return I18nUtil.applyTranslations(locale, false);
  }

  private onSubmit(event: any): void {
    event.preventDefault();
    const data = this.state.data.validated(this.props.siblings);
    if (data.validation.isValid) {
      if (this.props.onSave) {
        this.props.onSave(data, this.state.assignedSeasonCounter);
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

  private handleLanguageChange(event: any): void {
    this.setState({ selectedLanguage: event.target.value });
  }

  private handleAnalyserUpdate(property: number, value: boolean) {
    this.setState({
      data: this.state.data.withValueForProperty(property, value),
    });
  }

  private onStageMappingListUpdate(stageMappings: Array<StageMapping>): void {
    this.setState({ data: this.state.data.withStageMappings(stageMappings) });
  }

  private onStageMappingRemove(index: number): void {
    const mapping = this.state.data.stageMappings[index];
    const newMappings = Array.from(this.state.data.stageMappings);
    const assignedSeasonCounter = this.state.assignedSeasonCounter.decrement(
      mapping.stageId
    );
    newMappings.splice(index, 1);
    const data = this.state.data.withStageMappings(newMappings);
    this.setState({ data: data, assignedSeasonCounter: assignedSeasonCounter });
  }

  private onStageMappingRefresh(mapping: StageMapping): void {
    if (this.props.onStageMappingRefresh) {
      this.props.onStageMappingRefresh(mapping);
    }
  }

  private onAddStageMappingClose(assignedSeasonCounter: AssignedSeasonCounter) {
    this.setState({
      isStageMappingDialogOpen: false,
      assignedSeasonCounter: assignedSeasonCounter,
      selectedStageMappingIndex: undefined,
    });
  }

  private onImageSelect(imageUrl: string): void {
    this.setState((state) => {
      if (state.selectedImageIndex === undefined) {
        return { data: state.data, selectedImageIndex: undefined };
      }
      const newFlagVariants = new Map<number, string>(state.data.flagVariants);
      newFlagVariants.set(state.selectedImageIndex, imageUrl);
      return {
        data: state.data.withFlagVariants(newFlagVariants),
        selectedImageIndex: undefined,
      };
    });
  }

  private onCountryCodesChange(event: any): void {
    const countryCodes: Array<string> = event.target.value || [];
    this.setState((state) => {
      return { data: state.data.withCountryCodes(countryCodes) };
    });
  }

  private onHighlightedMatchRoundsChange(event: any): void {
    const highlightedMatchRounds: string[] = event.target.value || [];
    this.setState((state) => {
      return {
        data: state.data.withHighlightedMatchRounds(highlightedMatchRounds),
      };
    });
  }
}

export default withStyles(styles)(MenuItemEditForm);
