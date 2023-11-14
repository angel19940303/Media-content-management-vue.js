import React, { Component } from "react";
import { MappedMatch } from "../../models/mapping/mapped-match";
import { ApiDataLoader } from "../../api/api-data-loader";
import { LoadStatus } from "../../models/enums/load_status";

type MappedMatchesProp = {
  matches: Array<MappedMatch>;
};

type MappedMatchesState = {
  matches: Array<MappedMatch>;
};

export class MappedMatches extends Component<{}, MappedMatchesState> {
  state: MappedMatchesState;
  constructor(props: MappedMatchesProp) {
    super(props);
    this.state = { matches: [] };
  }

  // After the component did mount
  componentDidMount(): void {
    ApiDataLoader.shared.loadMappedMatches(
      "soccer",
      "today",
      (status: number, mappedMatches?: Array<MappedMatch>) => {
        if (status === LoadStatus.SUCCESS) {
          this.setState({ matches: mappedMatches || [] });
        }
      }
    );
  }

  // render
  render(): React.ReactNode {
    return <br />;
  }
}
