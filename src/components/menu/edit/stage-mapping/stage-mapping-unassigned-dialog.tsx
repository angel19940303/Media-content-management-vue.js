import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import { StageMapping } from "../../../../models/menu/stage-mapping";
import { AssignedSeasonCounter } from "../../../../models/ui/assigned-season-counter";
import { StageMappingCollection } from "../../../../models/ui/stage-mapping-collection";
import { StageMappingFilter } from "../../../../models/ui/stage-mapping-filter";
import { MenuItemList } from "../../../../models/menu/menu-item-list";
import { MenuItem } from "../../../../models/menu/menu-item";
import { ComponentDataState } from "../../../../models/enums/component-data-state";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ApiDataLoader } from "../../../../api/api-data-loader";
import { ProviderCategoryCollection } from "../../../../models/menu/provider-category-collection";
import { LoadStatus } from "../../../../models/enums/load_status";
import StageMappingFilterBar from "./stage-mapping-filter-bar";
import StageMappingList from "./stage-mapping-list";
import { Provider } from "../../../../models/enums/provider";
import { Gender } from "../../../../models/enums/gender";
import MenuSortableTree from "../menu-sortable-tree";
import { MenuItemType } from "../../../../models/enums/menu-item-type";
import SearchFieldForm from "../../../common/search-field-form";
import { DateUtil } from "../../../../utils/date-util";
import { Typography } from "@material-ui/core";

const styles = () =>
  createStyles({
    noPadding: {
      padding: "0",
    },
    centerWrapper: {
      height: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    filterBar: {
      height: "60px",
      boxSizing: "border-box",
      padding: "0 16px",
      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
      display: "flex",
      alignItems: "center",

      "& form": {
        width: "100%",
      },
    },
    titlePart: {
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#efefef",
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  mainProvider?: number;
  sport: string;
  menuItems: MenuItemList;
  assignedSeasonCounter: AssignedSeasonCounter;
  onSelect?: (mapping: StageMapping, parentItem: MenuItem) => void;
  onClose?: () => void;
  onError?: (loadStatus: number) => void;
}

interface RState {
  dataState: number;
  providerIds: Array<number>;
  availableMappings: StageMappingCollection;
  availableMenuItems: Array<MenuItem>;
  assignedSeasonCounter: AssignedSeasonCounter;
  selectedMapping?: StageMapping;
  mappingFilter: StageMappingFilter;
  searchString: string;
  searchStringVersion: number;
}

class StageMappingUnassignedDialog extends React.Component<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = {
      dataState: ComponentDataState.INITIALIZING,
      providerIds: new Array<number>(),
      availableMappings: StageMappingCollection.create(),
      availableMenuItems: props.menuItems.filteredItems(
        (item) => item.type !== MenuItemType.SEASON
      ),
      assignedSeasonCounter: props.assignedSeasonCounter,
      mappingFilter: new StageMappingFilter(
        props.mainProvider ?? Provider.ENET,
        undefined,
        true
      ),
      searchString: "",
      searchStringVersion: 1,
    };
  }

  componentDidMount() {
    ApiDataLoader.shared.loadSportStages(
      this.props.sport,
      (status: number, data?: ProviderCategoryCollection) => {
        if (status === LoadStatus.SUCCESS) {
          const availableMappings = StageMappingCollection.create(
            data?.toStageMappings()
          )
            .updateCounts(this.state.assignedSeasonCounter)
            .applyFilter(this.state.mappingFilter);
          this.setState({
            providerIds: data?.providers || [],
            availableMappings: availableMappings,
            dataState: ComponentDataState.READY,
          });
        } else {
          this.setState({ dataState: ComponentDataState.ERROR });
          if (
            LoadStatus.isAuthError(status) &&
            this.props.onError !== undefined
          ) {
            this.props.onError(status);
          }
        }
      }
    );
  }

  render(): React.ReactNode {
    return (
      <Dialog
        maxWidth={"sm"}
        fullWidth={true}
        open={true}
        onClose={() => this.onClose()}
        aria-labelledby="unassigned-mappings-dialog-title"
      >
        <DialogTitle id="unassigned-mappings-dialog-title">
          {this.title()}
        </DialogTitle>
        <DialogContent className={this.props.classes.noPadding} dividers>
          {this.renderContent()}
        </DialogContent>
        <DialogActions>
          {this.renderBackButton()}
          <Button onClick={() => this.onClose()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private renderBackButton(): React.ReactNode {
    if (this.state.selectedMapping) {
      return (
        <Button onClick={() => this.setState({ selectedMapping: undefined })}>
          Back
        </Button>
      );
    }
    return undefined;
  }

  private renderContent(): React.ReactNode {
    if (this.state.dataState === ComponentDataState.INITIALIZING) {
      return (
        <div className={this.props.classes.centerWrapper}>
          <CircularProgress />
        </div>
      );
    }
    if (this.state.dataState === ComponentDataState.ERROR) {
      return (
        <div className={this.props.classes.centerWrapper}>
          An error occurred when loading data. Please try again later.
        </div>
      );
    }
    if (this.state.selectedMapping) {
      return this.renderMenuItemSelection();
    }
    return this.renderStageMappingSelection();
  }

  private renderStageMappingSelection(): React.ReactNode {
    return (
      <>
        <StageMappingFilterBar
          providerIds={this.state.providerIds}
          filter={this.state.mappingFilter}
          hideAssignedChange
          onChange={(filter) => this.onMappingFilterUpdate(filter)}
        />
        <StageMappingList
          virtualizedWithHeight={340}
          mappings={this.state.availableMappings.list()}
          onSelect={(mapping) => this.onMappingSelect(mapping)}
        />
      </>
    );
  }

  private renderMenuItemSelection(): React.ReactNode {
    if (!this.state.selectedMapping) {
      return "";
    }
    const config = {
      height: 340,
      canDrop: () => false,
      canDrag: () => false,
      onAddClick: (node: any) => {
        this.onMenuItemSelect(node.treeId);
      },
      onChange: (data: any) => {
        this.setState({ availableMenuItems: data });
      },
    };
    return (
      <>
        <div className={this.props.classes.filterBar}>
          <SearchFieldForm
            version={this.state.searchStringVersion}
            searchString={this.state.searchString}
            onChange={(searchString) =>
              this.onMenuItemFilterUpdate(searchString)
            }
          />
        </div>
        <MenuSortableTree
          data={this.state.availableMenuItems}
          config={config}
        />
      </>
    );
  }

  private onMappingFilterUpdate(filter: StageMappingFilter | undefined): void {
    if (filter) {
      this.setState({
        mappingFilter: filter,
        availableMappings: this.state.availableMappings.applyFilter(filter),
      });
    }
  }

  private onMenuItemFilterUpdate(searchString: string): void {
    if (searchString.length === 0) {
      const items = this.props.menuItems.filteredItems((item) => {
        return item.type !== MenuItemType.SEASON;
      });
      this.setState({ searchString: searchString, availableMenuItems: items });
      return;
    }
    const regExp = new RegExp("^(.*)" + searchString + "(.*)$", "i");
    const items = this.props.menuItems.filteredItems(
      (item, path) => {
        return item.type !== MenuItemType.SEASON && regExp.test(path);
      },
      (itemBuilder) => itemBuilder.setExpanded(true)
    );
    this.setState({
      searchString: searchString,
      searchStringVersion: this.state.searchStringVersion + 1,
      availableMenuItems: items,
    });
  }

  private onMappingSelect(mapping: StageMapping): void {
    this.setState({ selectedMapping: mapping });
  }

  private onMenuItemSelect(itemId: number): void {
    if (this.state.selectedMapping && this.props.onSelect) {
      const item = this.props.menuItems.find(itemId);
      if (item) {
        this.props.onSelect(this.state.selectedMapping, item.item);
      }
    }
  }

  private title(): React.ReactNode {
    if (this.state.selectedMapping) {
      const titleParts = new Array<string>();
      titleParts.push(...this.state.selectedMapping.categoryName.split(" "));
      titleParts.push(...this.state.selectedMapping.stageName.split(" "));
      titleParts.push(...this.state.selectedMapping.seasonName.split(" "));
      const genderSuffix = Gender.shortSuffix(
        this.state.selectedMapping.gender
      );
      if (genderSuffix.length > 0) {
        titleParts.push(genderSuffix.trim());
      }
      const handleClick = (part: string) => {
        const searchString =
          (this.state.searchString.length === 0
            ? ""
            : this.state.searchString + " ") + part;
        this.onMenuItemFilterUpdate(searchString);
      };
      return (
        <div>
          <div>
            {titleParts.map((part, index) => (
              <React.Fragment key={index}>
                <span
                  className={this.props.classes.titlePart}
                  onClick={() => handleClick(part)}
                >
                  {part}
                </span>{" "}
              </React.Fragment>
            ))}
          </div>
          <Typography variant="body2">{this.subTitle()}</Typography>
        </div>
      );
    }
    return "Unassigned stage mappings";
  }

  private subTitle(): React.ReactNode {
    if (this.state.selectedMapping === undefined) {
      return undefined;
    }
    let subTitle = Gender.title(this.state.selectedMapping.gender);
    if (this.state.selectedMapping.timeRange !== undefined) {
      subTitle +=
        " | " +
        DateUtil.formatApiTimestampDateTime(
          this.state.selectedMapping.timeRange.start
        ) +
        " - " +
        DateUtil.formatApiTimestampDateTime(
          this.state.selectedMapping.timeRange.end
        );
    }
    return subTitle;
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

export default withStyles(styles)(StageMappingUnassignedDialog);
