import React from "react";
import clsx from "clsx";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer, { DrawerProps } from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import { Omit } from "@material-ui/types";
import { Link as RouterLink } from "react-router-dom";
import { categories, Routes } from "./routing";
import { useLocation } from "react-router-dom";
import { AuthUserContext } from "./login/auth-user-context";

const styles = (theme: Theme) =>
  createStyles({
    categoryHeader: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    categoryHeaderPrimary: {
      color: theme.palette.common.white,
    },
    item: {
      paddingTop: 1,
      paddingBottom: 1,
      color: "rgba(255, 255, 255, 0.7)",
      "&:hover,&:focus": {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
      },
    },
    itemCategory: {
      backgroundColor: "#232f3e",
      boxShadow: "0 -1px 0 #404854 inset",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    firebase: {
      fontSize: 24,
      color: theme.palette.common.white,
    },
    itemActiveItem: {
      color: "#4fc3f7",
    },
    itemPrimary: {
      fontSize: "inherit",
    },
    itemHeading: {
      height: 48,
      paddingTop: 0,
      paddingBottom: 0,
    },
    itemIcon: {
      minWidth: "auto",
      marginRight: theme.spacing(2),
    },
    divider: {
      marginTop: theme.spacing(2),
    },
  });

const getSelectedPath = (path: string) => {
  let selectedPath = "";
  for (let i = 0; i < categories.length; i++) {
    const category: any = categories[i];
    const children: Array<any> = category.children || [];
    for (let j = 0; j < children.length; j++) {
      const child = children[j];
      if (path.indexOf(child.path) === 0) {
        selectedPath = child.path;
      }
      if (path === child.path) {
        return selectedPath;
      }
    }
  }
  return selectedPath;
};

const categoriesMatchingPermissions = (permissions: number) => {
  if (categories.length === 0) {
    return [];
  }
  const filteredCategories = new Array<typeof categories[0]>();
  categories.forEach(({ id, children }) => {
    const newChildren = children.filter(
      (child) =>
        child.showInMenu &&
        child.permissions.filter((p) => (permissions & p) > 0).length > 0
    );
    if (newChildren.length > 0) {
      filteredCategories.push({ id: id, children: newChildren });
    }
  });
  return filteredCategories;
};

const Logo = (
  <svg viewBox="0 0 223 48" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.12-1.776A3.349,3.349,0,0,0,8.352-2.4a2.03,2.03,0,0,0,.72-1.608A1.838,1.838,0,0,0,8.52-5.4a4.342,4.342,0,0,0-1.752-.888l-1.8-.552a9.915,9.915,0,0,1-1.524-.612A4.713,4.713,0,0,1,2.28-8.268a3.137,3.137,0,0,1-.732-1.1A3.989,3.989,0,0,1,1.3-10.848a3.58,3.58,0,0,1,1.4-2.988,6.04,6.04,0,0,1,3.8-1.092,10,10,0,0,1,1.824.156,6.373,6.373,0,0,1,1.452.432,2.965,2.965,0,0,1,.96.648,1.159,1.159,0,0,1,.348.8,1.229,1.229,0,0,1-.2.708,1.8,1.8,0,0,1-.492.492,5.432,5.432,0,0,0-1.572-.78,6.761,6.761,0,0,0-2.148-.324,3.4,3.4,0,0,0-2.04.528,1.668,1.668,0,0,0-.72,1.416,1.477,1.477,0,0,0,.5,1.164,4.433,4.433,0,0,0,1.656.78L7.464-8.5A7.759,7.759,0,0,1,10.6-6.852a3.706,3.706,0,0,1,1.116,2.844,4.149,4.149,0,0,1-.372,1.764,3.9,3.9,0,0,1-1.068,1.38,4.889,4.889,0,0,1-1.74.888A8.254,8.254,0,0,1,6.168.336,9.8,9.8,0,0,1,4.152.144,7.123,7.123,0,0,1,2.58-.36a3.114,3.114,0,0,1-1.02-.72,1.29,1.29,0,0,1-.36-.864,1.211,1.211,0,0,1,.288-.816,1.861,1.861,0,0,1,.672-.5A6.511,6.511,0,0,0,3.732-2.256,5.457,5.457,0,0,0,6.12-1.776ZM19.416.336A6.357,6.357,0,0,1,17.976.18a5.227,5.227,0,0,1-1.152-.4V4.3a2.461,2.461,0,0,1-.468.132,3.371,3.371,0,0,1-.66.06,1.66,1.66,0,0,1-1.032-.264,1.1,1.1,0,0,1-.336-.912V-9.1a1.659,1.659,0,0,1,.192-.852,1.992,1.992,0,0,1,.72-.636,8.208,8.208,0,0,1,1.644-.684,7.438,7.438,0,0,1,2.2-.3,7.549,7.549,0,0,1,2.328.348,5.043,5.043,0,0,1,1.872,1.068,4.981,4.981,0,0,1,1.248,1.836,6.993,6.993,0,0,1,.456,2.652,7.453,7.453,0,0,1-.42,2.628,5.368,5.368,0,0,1-1.152,1.872A4.594,4.594,0,0,1,21.66-.036,6.506,6.506,0,0,1,19.416.336ZM19.032-1.7A3.27,3.27,0,0,0,21.5-2.652a4.226,4.226,0,0,0,.912-3.012,5.408,5.408,0,0,0-.264-1.8,3.371,3.371,0,0,0-.708-1.212,2.542,2.542,0,0,0-1.056-.672,4.11,4.11,0,0,0-1.308-.2,4.165,4.165,0,0,0-1.308.18,4.965,4.965,0,0,0-.948.42v6.6a3.575,3.575,0,0,0,.96.468A4.017,4.017,0,0,0,19.032-1.7Zm19.44-3.912a7.09,7.09,0,0,1-.408,2.472,5.373,5.373,0,0,1-1.14,1.872A4.968,4.968,0,0,1,35.136-.084a6.314,6.314,0,0,1-2.352.42,6.314,6.314,0,0,1-2.352-.42,4.968,4.968,0,0,1-1.788-1.188A5.373,5.373,0,0,1,27.5-3.144,7.09,7.09,0,0,1,27.1-5.616,7.09,7.09,0,0,1,27.5-8.088,5.281,5.281,0,0,1,28.656-9.96a5.087,5.087,0,0,1,1.8-1.188,6.246,6.246,0,0,1,2.328-.42,6.246,6.246,0,0,1,2.328.42,5.009,5.009,0,0,1,1.8,1.2,5.426,5.426,0,0,1,1.152,1.872A6.989,6.989,0,0,1,38.472-5.616ZM32.784-9.552A2.784,2.784,0,0,0,30.5-8.52a4.485,4.485,0,0,0-.84,2.9,4.526,4.526,0,0,0,.816,2.892,2.782,2.782,0,0,0,2.3,1.02,2.782,2.782,0,0,0,2.3-1.02A4.526,4.526,0,0,0,35.9-5.616a4.54,4.54,0,0,0-.828-2.892A2.763,2.763,0,0,0,32.784-9.552Zm10.9,9.5a2.461,2.461,0,0,1-.468.132,3.371,3.371,0,0,1-.66.06A1.66,1.66,0,0,1,41.52-.12a1.064,1.064,0,0,1-.336-.888V-8.88a1.767,1.767,0,0,1,.24-.972,2.469,2.469,0,0,1,.768-.708,6.606,6.606,0,0,1,1.776-.72,9.209,9.209,0,0,1,2.376-.288q2.112,0,2.112,1.2a1.5,1.5,0,0,1-.1.54,2.55,2.55,0,0,1-.216.444q-.24-.048-.6-.1a5.818,5.818,0,0,0-.768-.048,7.021,7.021,0,0,0-1.752.2,5.547,5.547,0,0,0-1.344.516Zm9.384-3.24a1.4,1.4,0,0,0,.5,1.224,2.406,2.406,0,0,0,1.416.36,3.4,3.4,0,0,0,.864-.12,4.121,4.121,0,0,0,.792-.288,2.435,2.435,0,0,1,.3.432,1.179,1.179,0,0,1,.132.576,1.2,1.2,0,0,1-.636,1.032A3.636,3.636,0,0,1,54.5.336a4.657,4.657,0,0,1-2.868-.8A3.107,3.107,0,0,1,50.568-3.12V-14.328q.168-.048.48-.12a2.984,2.984,0,0,1,.672-.072,1.606,1.606,0,0,1,1.02.264,1.084,1.084,0,0,1,.324.888v2.376h3.72a1.658,1.658,0,0,1,.18.408,1.81,1.81,0,0,1,.084.552Q57.048-9,56.16-9h-3.1Zm21.648-4.1A6.552,6.552,0,0,0,74.3-9.828,4.4,4.4,0,0,0,73.176-11.5a4.608,4.608,0,0,0-1.68-.96,6.64,6.64,0,0,0-2.064-.312,11.044,11.044,0,0,0-2.112.168V-2.016a5.9,5.9,0,0,0,1.068.156q.588.036,1.188.036a4.986,4.986,0,0,0,3.816-1.4A5.873,5.873,0,0,0,74.712-7.392Zm2.64-.024a9.535,9.535,0,0,1-.552,3.4,6.351,6.351,0,0,1-1.572,2.412A6.434,6.434,0,0,1,72.768-.18a10.287,10.287,0,0,1-3.192.468q-.768,0-1.8-.072a8.013,8.013,0,0,1-1.92-.36,1.339,1.339,0,0,1-1.1-1.3V-13.464a.86.86,0,0,1,.228-.636,1.466,1.466,0,0,1,.636-.348A8.478,8.478,0,0,1,67.44-14.8q.984-.084,1.92-.084a10.979,10.979,0,0,1,3.252.456,6.775,6.775,0,0,1,2.532,1.392,6.233,6.233,0,0,1,1.632,2.34A8.589,8.589,0,0,1,77.352-7.416Zm7.056,5.808a5.668,5.668,0,0,0,1.464-.168,2.852,2.852,0,0,0,.888-.36V-5.184l-2.616.264a3.728,3.728,0,0,0-1.656.492,1.28,1.28,0,0,0-.552,1.14,1.451,1.451,0,0,0,.6,1.236A3.164,3.164,0,0,0,84.408-1.608Zm-.048-9.96a5.863,5.863,0,0,1,3.552.972,3.547,3.547,0,0,1,1.32,3.06v5.592a1.289,1.289,0,0,1-.252.852,2.768,2.768,0,0,1-.684.564A6.746,6.746,0,0,1,86.688.1a8.84,8.84,0,0,1-2.28.264,6.282,6.282,0,0,1-3.636-.912A3.066,3.066,0,0,1,79.464-3.24a2.96,2.96,0,0,1,1.02-2.424A5.4,5.4,0,0,1,83.424-6.7l3.336-.336V-7.56A1.745,1.745,0,0,0,86.076-9.1a3.282,3.282,0,0,0-1.908-.48,6.45,6.45,0,0,0-1.848.264,10.594,10.594,0,0,0-1.584.6,1.774,1.774,0,0,1-.408-.468,1.154,1.154,0,0,1-.168-.612,1.067,1.067,0,0,1,.2-.672A1.611,1.611,0,0,1,81-10.92a5.675,5.675,0,0,1,1.536-.492A10.257,10.257,0,0,1,84.36-11.568Zm10.608,8.28a1.4,1.4,0,0,0,.5,1.224,2.406,2.406,0,0,0,1.416.36,3.4,3.4,0,0,0,.864-.12,4.121,4.121,0,0,0,.792-.288,2.435,2.435,0,0,1,.3.432,1.179,1.179,0,0,1,.132.576A1.2,1.2,0,0,1,98.34-.072a3.636,3.636,0,0,1-1.932.408,4.657,4.657,0,0,1-2.868-.8A3.107,3.107,0,0,1,92.472-3.12V-14.328q.168-.048.48-.12a2.984,2.984,0,0,1,.672-.072,1.606,1.606,0,0,1,1.02.264,1.084,1.084,0,0,1,.324.888v2.376h3.72a1.658,1.658,0,0,1,.18.408,1.81,1.81,0,0,1,.084.552Q98.952-9,98.064-9h-3.1Zm10.9,1.68a5.668,5.668,0,0,0,1.464-.168,2.852,2.852,0,0,0,.888-.36V-5.184L105.6-4.92a3.728,3.728,0,0,0-1.656.492,1.28,1.28,0,0,0-.552,1.14,1.451,1.451,0,0,0,.6,1.236A3.164,3.164,0,0,0,105.864-1.608Zm-.048-9.96a5.863,5.863,0,0,1,3.552.972,3.547,3.547,0,0,1,1.32,3.06v5.592a1.289,1.289,0,0,1-.252.852,2.768,2.768,0,0,1-.684.564A6.746,6.746,0,0,1,108.144.1a8.84,8.84,0,0,1-2.28.264,6.282,6.282,0,0,1-3.636-.912A3.066,3.066,0,0,1,100.92-3.24a2.96,2.96,0,0,1,1.02-2.424A5.4,5.4,0,0,1,104.88-6.7l3.336-.336V-7.56a1.745,1.745,0,0,0-.684-1.536,3.282,3.282,0,0,0-1.908-.48,6.45,6.45,0,0,0-1.848.264,10.594,10.594,0,0,0-1.584.6,1.774,1.774,0,0,1-.408-.468,1.154,1.154,0,0,1-.168-.612,1.067,1.067,0,0,1,.2-.672,1.611,1.611,0,0,1,.636-.456,5.675,5.675,0,0,1,1.536-.492A10.257,10.257,0,0,1,105.816-11.568Zm24.072-1.272a1.188,1.188,0,0,1-.228.72,1.39,1.39,0,0,1-.54.456,10.3,10.3,0,0,0-1.428-.768,4.976,4.976,0,0,0-2.028-.36,5.036,5.036,0,0,0-1.932.36,4.171,4.171,0,0,0-1.512,1.056,4.932,4.932,0,0,0-1,1.728,7.2,7.2,0,0,0-.36,2.376,5.687,5.687,0,0,0,1.344,4.1,4.712,4.712,0,0,0,3.552,1.392,5.619,5.619,0,0,0,2.04-.336,7.182,7.182,0,0,0,1.488-.768,1.853,1.853,0,0,1,.492.48,1.188,1.188,0,0,1,.228.72,1.156,1.156,0,0,1-.18.624,1.672,1.672,0,0,1-.588.528,5.647,5.647,0,0,1-1.44.6,8.446,8.446,0,0,1-2.3.264,8.488,8.488,0,0,1-2.856-.468,6.325,6.325,0,0,1-2.3-1.416,6.62,6.62,0,0,1-1.548-2.376,9.086,9.086,0,0,1-.564-3.348,8.868,8.868,0,0,1,.576-3.312,6.944,6.944,0,0,1,1.548-2.4,6.446,6.446,0,0,1,2.268-1.452,7.711,7.711,0,0,1,2.76-.492,8.785,8.785,0,0,1,1.86.18,6.248,6.248,0,0,1,1.416.468,2.76,2.76,0,0,1,.912.672A1.2,1.2,0,0,1,129.888-12.84Zm12.024,9.1a1.63,1.63,0,0,1-.528.288,2.276,2.276,0,0,1-.768.12,2.255,2.255,0,0,1-.876-.156.919.919,0,0,1-.516-.492q-1.1-2.544-1.908-4.512t-1.284-3.288h-.12q-.072,1.7-.132,3.132t-.132,2.8q-.072,1.368-.156,2.784t-.18,3.048a3.251,3.251,0,0,1-.492.132,3.239,3.239,0,0,1-.636.06q-1.3,0-1.3-1.056,0-.312.036-1.1t.1-1.884q.06-1.092.144-2.412t.18-2.676q.1-1.356.192-2.664t.192-2.412a2.424,2.424,0,0,1,.636-.408,2.483,2.483,0,0,1,1.092-.216,2.351,2.351,0,0,1,1.224.276,1.885,1.885,0,0,1,.72.828q.384.84.792,1.812t.816,1.968q.408,1,.792,1.98t.744,1.848h.12q.456-1.2.924-2.376t.912-2.256q.444-1.08.84-2.04t.732-1.728a3.826,3.826,0,0,1,.648-.216,3.253,3.253,0,0,1,.792-.1,2.336,2.336,0,0,1,1.188.24,1.115,1.115,0,0,1,.516.7q.1.432.216,1.428t.24,2.292q.12,1.3.24,2.748t.216,2.808q.1,1.356.168,2.5t.1,1.788a2.1,2.1,0,0,1-.564.252,2.643,2.643,0,0,1-.708.084,1.714,1.714,0,0,1-.876-.216.957.957,0,0,1-.42-.816q-.1-1.632-.18-3.216t-.156-3q-.072-1.416-.132-2.616t-.108-2.04h-.1q-.456,1.224-1.236,3.12ZM156.12-1.776a3.349,3.349,0,0,0,2.232-.624,2.03,2.03,0,0,0,.72-1.608A1.838,1.838,0,0,0,158.52-5.4a4.342,4.342,0,0,0-1.752-.888l-1.8-.552a9.916,9.916,0,0,1-1.524-.612,4.713,4.713,0,0,1-1.164-.816,3.137,3.137,0,0,1-.732-1.1,3.989,3.989,0,0,1-.252-1.476,3.58,3.58,0,0,1,1.4-2.988,6.04,6.04,0,0,1,3.8-1.092,10,10,0,0,1,1.824.156,6.373,6.373,0,0,1,1.452.432,2.965,2.965,0,0,1,.96.648,1.159,1.159,0,0,1,.348.8,1.228,1.228,0,0,1-.2.708,1.8,1.8,0,0,1-.492.492,5.432,5.432,0,0,0-1.572-.78,6.762,6.762,0,0,0-2.148-.324,3.4,3.4,0,0,0-2.04.528,1.668,1.668,0,0,0-.72,1.416,1.477,1.477,0,0,0,.5,1.164,4.433,4.433,0,0,0,1.656.78l1.392.408A7.759,7.759,0,0,1,160.6-6.852a3.706,3.706,0,0,1,1.116,2.844,4.149,4.149,0,0,1-.372,1.764,3.9,3.9,0,0,1-1.068,1.38,4.889,4.889,0,0,1-1.74.888,8.254,8.254,0,0,1-2.364.312,9.8,9.8,0,0,1-2.016-.192,7.124,7.124,0,0,1-1.572-.5,3.114,3.114,0,0,1-1.02-.72,1.29,1.29,0,0,1-.36-.864,1.211,1.211,0,0,1,.288-.816,1.861,1.861,0,0,1,.672-.5,6.511,6.511,0,0,0,1.572,1.008A5.457,5.457,0,0,0,156.12-1.776Z"
      transform="translate(40 30)"
      fill="#fff"
    />
    <path
      d="M-351.231,151.975h0a3.271,3.271,0,0,1-.656-.94,8.349,8.349,0,0,1-.647-1.439,8.764,8.764,0,0,0-2.226-3.241,10.334,10.334,0,0,0-3.355-2.51l-.215-.068-.215.068a10.334,10.334,0,0,0-3.355,2.51,8.764,8.764,0,0,0-2.226,3.241,8.344,8.344,0,0,1-.647,1.439,3.274,3.274,0,0,1-.656.94h0a3.252,3.252,0,0,1-2.307.955A3.262,3.262,0,0,1-371,149.669a3.264,3.264,0,0,1,2.247-3.1,10.258,10.258,0,0,1,1.427-.536,9.84,9.84,0,0,0,3.045-2.291,10.055,10.055,0,0,0,2.379-3.073c.122-.366.243-.69.358-.975h0l0-.018h0a3.265,3.265,0,0,1,2.783-2.647h0l.018,0h0l.109-.012h.1l.051,0h.3l.051,0h.1l.109.012h0a3.264,3.264,0,0,1,2.8,2.667c.115.285.236.609.358.975a10.056,10.056,0,0,0,2.379,3.073,9.84,9.84,0,0,0,3.045,2.291,10.262,10.262,0,0,1,1.427.536,3.264,3.264,0,0,1,2.247,3.1,3.262,3.262,0,0,1-3.262,3.262A3.252,3.252,0,0,1-351.231,151.975Z"
      transform="translate(371 -121.622)"
      fill="#009be5"
    />
  </svg>
);

export interface NavigatorProps
  extends Omit<DrawerProps, "classes">,
    WithStyles<typeof styles> {}

function Navigator(props: NavigatorProps) {
  const { classes, ...other } = props;
  const location = useLocation();
  const selectedPath = getSelectedPath(location.pathname);
  const isSelected = (path: string) => path === selectedPath;

  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <Drawer variant="permanent" {...other}>
          <List disablePadding>
            <ListItem
              className={clsx(
                classes.firebase,
                classes.item,
                classes.itemCategory,
                classes.itemHeading
              )}
            >
              {Logo}
            </ListItem>
            <ListItem
              className={clsx(classes.item, classes.itemCategory)}
              component={RouterLink}
              to={Routes.Home}
            >
              <ListItemIcon className={classes.itemIcon}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                classes={{
                  primary: classes.itemPrimary,
                }}
              >
                Overview
              </ListItemText>
            </ListItem>
            {categoriesMatchingPermissions(authUser.permissions).map(
              ({ id, children }) => (
                <React.Fragment key={id}>
                  <ListItem className={classes.categoryHeader}>
                    <ListItemText
                      classes={{
                        primary: classes.categoryHeaderPrimary,
                      }}
                    >
                      {id}
                    </ListItemText>
                  </ListItem>
                  {children.map(({ id: childId, title, icon, path }) => (
                    <ListItem
                      key={childId}
                      button
                      component={RouterLink}
                      to={path}
                      className={clsx(
                        classes.item,
                        isSelected(path) && classes.itemActiveItem
                      )}
                    >
                      <ListItemIcon className={classes.itemIcon}>
                        {icon}
                      </ListItemIcon>
                      <ListItemText
                        classes={{
                          primary: classes.itemPrimary,
                        }}
                      >
                        {childId}
                      </ListItemText>
                    </ListItem>
                  ))}
                  <Divider className={classes.divider} />
                </React.Fragment>
              )
            )}
          </List>
        </Drawer>
      )}
    </AuthUserContext.Consumer>
  );
}

export default withStyles(styles)(Navigator);