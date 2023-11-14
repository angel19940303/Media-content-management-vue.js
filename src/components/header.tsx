import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Routes } from "./routing";
import { AuthUserContext } from "./login/auth-user-context";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { TextUtil } from "../utils/text-util";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import {
  Grow,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import Divider from "@material-ui/core/Divider";

const lightColor = "rgba(255, 255, 255, 0.7)";

const styles = (theme: Theme) =>
  createStyles({
    secondaryBar: {
      zIndex: 0,
      height: 252,
    },
    menuButton: {
      marginLeft: -theme.spacing(1),
    },
    iconButtonAvatar: {
      padding: 4,
    },
    link: {
      textDecoration: "none",
      color: lightColor,
      "&:hover": {
        color: theme.palette.common.white,
      },
    },
    button: {
      borderColor: lightColor,
    },
    titleBar: {
      height: "70px",
    },
    paper: {
      boxSizing: "border-box",
      //width: 550,
    },
    noPadding: {
      padding: 0,
    },
    popperDivider: {
      backgroundColor: theme.palette.divider,
    },
    large: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
  });

interface HeaderProps extends WithStyles<typeof styles> {
  onDrawerToggle: () => void;
  category: any | undefined;
}

function Header(props: HeaderProps) {
  const { classes, category, onDrawerToggle } = props;
  const [userPopperAnchorEl, setUserPopperAnchorEl] = React.useState<any>(null);
  const [scrollY, setScrollY] = React.useState<number>(0);
  const isUserPopperOpen = userPopperAnchorEl !== null;

  window.addEventListener("scroll", () => {
    setScrollY(window.scrollY);
  });

  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <React.Fragment>
          <AppBar position="sticky" elevation={scrollY > 0 ? 2 : 0}>
            <Toolbar>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs>
                  <Typography color="inherit" variant="h6" component="h1">
                    {category?.title}
                  </Typography>
                </Grid>
                <Hidden smUp>
                  <Grid item>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={onDrawerToggle}
                      className={classes.menuButton}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Grid>
                </Hidden>
                <Grid item xs />
                <Grid item>
                  <IconButton
                    color="inherit"
                    className={classes.iconButtonAvatar}
                    onClick={(event) =>
                      setUserPopperAnchorEl(event.currentTarget)
                    }
                  >
                    <Avatar>
                      {TextUtil.nameToInitials(authUser.userName)}
                    </Avatar>
                  </IconButton>
                  <Popper
                    open={isUserPopperOpen}
                    anchorEl={userPopperAnchorEl}
                    transition
                    placement="bottom-end"
                    disablePortal
                  >
                    {({ TransitionProps }) => (
                      <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: "right top" }}
                      >
                        <Paper className={classes.paper}>
                          <ClickAwayListener
                            onClickAway={() => setUserPopperAnchorEl(null)}
                          >
                            <List className={classes.noPadding}>
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar className={classes.large}>
                                    {TextUtil.nameToInitials(authUser.userName)}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={authUser.userName}
                                  secondary={authUser.email}
                                />
                              </ListItem>
                              <Divider className={classes.popperDivider} />
                              <ListItem
                                button
                                component={RouterLink}
                                to={Routes.Users.ProfileManagement}
                              >
                                Manage account
                              </ListItem>
                              <ListItem
                                button
                                component={RouterLink}
                                to={Routes.Logout}
                              >
                                Logout
                              </ListItem>
                            </List>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          {category !== undefined ? null : (
            <AppBar
              component="div"
              className={classes.secondaryBar}
              color="primary"
              position="static"
              elevation={0}
            />
          )}
        </React.Fragment>
      )}
    </AuthUserContext.Consumer>
  );
}

export default withStyles(styles)(Header);
