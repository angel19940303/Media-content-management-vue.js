import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import WorkInProgress from "../../../components/work-in-progress";
import BaseAuthPaperbasePage from "../../base-auth-paperbase-page";

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
      margin: "40px 16px",
    },
  });

export interface RProps extends WithStyles<typeof styles> {}

class ContentLegalNotices extends BaseAuthPaperbasePage<RProps, any> {
  protected renderContent(): React.ReactNode {
    return <WorkInProgress />;
  }
}

export default withStyles(styles)(ContentLegalNotices);
