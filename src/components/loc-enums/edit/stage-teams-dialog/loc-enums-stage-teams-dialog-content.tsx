import React from "react";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { MenuItem } from "../../../../models/menu/menu-item";
import { LocEnumItemList } from "../../../../models/loc-enums/loc-enum-item-list";
import { Sport } from "../../../../models/enums/sport";
import { ApiDataLoader } from "../../../../api/api-data-loader";
import { LoadStatus } from "../../../../models/enums/load_status";
import { MenuItemPayloadBuilder } from "../../../../models/menu/builders/menu-item-payload-builder";
import { IncrementalIdGenerator } from "../../../../models/common/incremental-id-generator";
import { MenuItemList } from "../../../../models/menu/menu-item-list";
import MenuNestedList from "../../../common/menu-nested-list";
import LoadingIndicator from "../../../common/loading-indicator";
import { Box, LinearProgress, Typography } from "@material-ui/core";
import { LocEnumItemListBuilder } from "../../../../models/loc-enums/builders/loc-enum-item-list-builder";

const styles = () =>
  createStyles({
    stageTeamDialogStep2Progress: {
      padding: 15,
    },
  });

interface RProps extends WithStyles<typeof styles> {
  sport: string;
  selectionConfirmed: boolean;
  onChange: (selectedIds: string[]) => void;
  onSuccess: (locEnums: LocEnumItemList) => void;
  onError: () => void;
}

interface RState {
  isLoading: boolean;
  selectedIds: Set<string>;
  menuData?: MenuItem[];
  progress: number;
}

class LocEnumsStageTeamsDialogContent extends React.Component<RProps, RState> {
  private isComponentMounted = false;

  constructor(props: RProps) {
    super(props);
    this.state = {
      isLoading: true,
      selectedIds: new Set<string>(),
      progress: 0,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<RProps>,
    prevState: Readonly<RState>,
    snapshot?: any
  ) {
    if (!prevProps.selectionConfirmed && this.props.selectionConfirmed) {
      this.loadStageTeams(Array.from(this.state.selectedIds));
    }
  }

  componentDidMount() {
    this.isComponentMounted = true;
    this.loadStages();
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    if (this.props.selectionConfirmed) {
      const value = (this.state.progress / this.state.selectedIds.size) * 100;
      return (
        <div className={this.props.classes.stageTeamDialogStep2Progress}>
          Processing...
          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress variant="determinate" value={value} />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">{`${Math.round(
                value
              )}%`}</Typography>
            </Box>
          </Box>
        </div>
      );
    }
    return (
      <MenuNestedList
        data={this.state.menuData || []}
        selectedIds={this.state.selectedIds}
        onSelectionChange={(selectedIds) => this.onSelectionChange(selectedIds)}
      />
    );
  }

  private loadStages() {
    const sportId = Sport.fromCode(this.props.sport);
    if (sportId === undefined) {
      this.setState({ isLoading: false });
      return;
    }
    ApiDataLoader.shared.loadSportInternalCategories(
      this.props.sport,
      (status, data) => {
        if (!this.isComponentMounted) {
          return;
        }
        if (status === LoadStatus.SUCCESS && data !== undefined) {
          const payload = new MenuItemPayloadBuilder(
            new IncrementalIdGenerator()
          ).fromSportData(data?.categories, true);
          this.setState({
            isLoading: false,
            menuData: MenuItemList.flatten(payload.menuItems),
          });
        } else {
          this.onError();
        }
      }
    );
  }

  private onSelectionChange(selectedIds: Set<string>) {
    this.setState({ selectedIds: selectedIds });
    this.props.onChange(Array.from(selectedIds));
  }

  private loadStageTeams(stageIds: string[]) {
    ApiDataLoader.shared.loadSportInternalStages(
      this.props.sport,
      stageIds,
      (status, data) => {
        if (!this.isComponentMounted) {
          return;
        } else if (status === LoadStatus.SUCCESS) {
          this.onSuccess(LocEnumItemListBuilder.fromStages(data).build());
        } else {
          this.onError();
        }
      },
      (index) => {
        if (!this.isComponentMounted) {
          return;
        }
        this.setState({ progress: index });
      }
    );
  }

  private onError() {
    this.props.onError();
  }

  private onSuccess(locEnums: LocEnumItemList) {
    this.props.onSuccess(locEnums);
  }
}

export default withStyles(styles)(LocEnumsStageTeamsDialogContent);
