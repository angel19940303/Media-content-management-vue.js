import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";

import Navigator from "../navigator";
import Header from "../header";
import { categories } from "../routing";
import { useLocation } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © SnapTech "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 256;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      minHeight: "100vh",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    app: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "#eaeff1",
    },
    main: {
      flex: 1,
      padding: theme.spacing(6, 4),
      position: "relative",
    },
    mainExtended: {
      marginTop: -252,
    },
    footer: {
      padding: theme.spacing(2),
      background: "#eaeff1",
    },
  });

const findCategory = (path: string) => {
  for (let i = 0; i < categories.length; i++) {
    const category: any = categories[i];
    const children: Array<any> = category.children || [];
    for (let j = 0; j < children.length; j++) {
      const child = children[j];
      if (path.indexOf(child.path) === 0) {
        return child;
      }
      if (path === child.path) {
        return category;
      }
    }
  }
};

export interface PaperbaseProps
  extends WithStyles<typeof styles>,
    React.PropsWithChildren<any> {}

function Paperbase(props: PaperbaseProps) {
  const { classes } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const category = findCategory(location.pathname);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const classNames: string[] = [classes.main];
  if (category === undefined) {
    classNames.push(classes.mainExtended);
  }

  return (
    <>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="js">
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        </Hidden>
        <Hidden xsDown implementation="css">
          <Navigator PaperProps={{ style: { width: drawerWidth } }} />
        </Hidden>
      </nav>
      <div className={classes.app}>
        <Header onDrawerToggle={handleDrawerToggle} category={category} />
        <main className={classNames.join(" ")}>{props.children}</main>
        <footer className={classes.footer}>
          <Copyright />
        </footer>
      </div>
    </>
  );
}

export default withStyles(styles)(Paperbase);
