import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import BaseAuthPaperbasePage from "../base-auth-paperbase-page";
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
} from "@material-ui/core";
import { categories } from "../../components/routing";
import {
  AuthUser,
  AuthUserContext,
} from "../../components/login/auth-user-context";
import { RouteComponentProps, withRouter } from "react-router-dom";

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

export interface HomeProps
  extends RouteComponentProps,
    WithStyles<typeof styles> {}

class Home extends BaseAuthPaperbasePage<HomeProps, any> {
  protected renderContent(): React.ReactNode {
    const context: AuthUser = this.context;
    return (
      <Grid container spacing={2}>
        {categories
          .flatMap((c) => c.children)
          .filter(
            (item) =>
              item.showInHomePage &&
              item.permissions.find((p) => (context.permissions & p) > 0) !==
                undefined
          )
          .map((item) => (
            <Grid item xl={2} lg={3} md={4} sm={6} xs={12} key={item.id}>
              <Card variant="outlined">
                <CardActionArea
                  onClick={() => this.props.history.push(item.path)}
                >
                  <CardHeader
                    avatar={<Avatar>{item.icon}</Avatar>}
                    title={
                      <Typography variant="h6" component="div">
                        {item.title}
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Typography variant="body2" component="div">
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    );
  }
}

Home.contextType = AuthUserContext;

export default withRouter(withStyles(styles)(Home));
