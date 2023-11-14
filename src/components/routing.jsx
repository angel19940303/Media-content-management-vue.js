import React from "react";
import { Route } from "react-router-dom";
import { withRouter } from "react-router-dom";

import BannerIcon from "@material-ui/icons/PhotoSizeSelectActual";
import ReorderIcon from "@material-ui/icons/Reorder";
import StarIcon from "@material-ui/icons/Star";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import PolicyIcon from "@material-ui/icons/Policy";
import BarChartIcon from "@material-ui/icons/BarChart";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import PublicIcon from "@material-ui/icons/Public";
import ListIcon from "@material-ui/icons/List";
import DashboardIcon from "@material-ui/icons/Dashboard";
import BusinessIcon from "@material-ui/icons/Business";
import MessageIcon from "@material-ui/icons/Message";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import RssFeedIcon from "@material-ui/icons/RssFeed";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import OndemandSocialIcon from "@material-ui/icons/TagFaces";
import PeopleIcon from "@material-ui/icons/People";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";

import Home from "../pages/home/home";
import ContentMenuStructure from "../pages/content/menu-structure/content-menu-structure";
import ContentNews from "../pages/content/news/content-news";
import ContentNewsProviders from "../pages/content/news-providers/content-news-providers";
import ContentVideos from "../pages/content/videos/content-videos";
import ContentFlowNews from "../pages/content/flow/content-news";
import ContentFlowVideos from "../pages/content/flow/content-videos";
import ContentFlowSocial from "../pages/content/flow/content-social";
import ContentLegalNotices from "../pages/content/legal-notices/content-legal-notices";
import MappingMapped from "../pages/mapping/mapped";
import MappingUnmapped from "../pages/mapping/unmapped";
import AdvertisingOverview from "../pages/advertising/overview/advertising-overview";
import AdvertisingBanners from "../pages/advertising/banners/advertising-banners";
import AdvertisingTypes from "../pages/advertising/types/advertising-types";
import AdvertisingPlacement from "../pages/advertising/placement/advertising-placement";
import AnalyticsOverview from "../pages/analytics/overview/analytics-overview";
import AdvertisingAdvertisers from "../pages/advertising/advertisers/advertising-advertisers";
import PushNotifications from "../pages/messaging/push-notifications/push-notifications";
import ContentMenuStructureEdit from "../pages/content/menu-structure/content-menu-structure-edit";
import LocOverviewEdit from "../pages/content/loc-overview/content-loc-overview-edit";
import ContentPopularSelection from "../pages/content/popular-selection/content-popular-selection";
import ContentPopularSelectionEdit from "../pages/content/popular-selection/content-popular-selection-edit";
import ContentLocEnums from "../pages/content/loc-enums/content-loc-enums";
import ContentLocEnumsEdit from "../pages/content/loc-enums/content-loc-enums-edit";
import LocOverview from "../pages/content/loc-overview/content-loc-overview";
import { FormatListNumberedRtl } from "@material-ui/icons";
import ContentNewsEdit from "../pages/content/news/content-news-edit";
import ContentVideosEdit from "../pages/content/videos/content-video-edit";
import Login from "../pages/login/login";
import PasswordRecovery from "../pages/login/password-recovery";
import Logout from "../pages/login/logout";
import UserProfileManagement from "../pages/users/profile-management";
import UserManagement from "../pages/users/user-management";
import PersonIcon from "@material-ui/icons/Person";

export const Routes = {
  Home: "/",
  Login: "/login",
  Logout: "/logout",
  PasswordRecovery: "/password-recovery",
  Content: {
    MenuStructure: "/content/menu-structure",
    MenuStructureCreate: "/content/menu-structure/create/:sport",
    MenuStructureClone: "/content/menu-structure/clone/:sourceId",
    MenuStructureCreateFromProviderData:
      "/content/menu-structure/create/:sport/:providerId",
    MenuStructureEdit: "/content/menu-structure/edit/:id",
    PopularSelection: "/content/popular-selection",
    PopularSelectionEdit: "/content/popular-selection/edit/:id",
    LocEnums: "/content/loc-enums",
    LocEnumsCreate: "/content/loc-enums/create/:sport",
    LocEnumsCreateFromSource: "/content/loc-enums/create/:sport/:sourceType",
    LocEnumsEdit: "/content/loc-enums/edit/:id",
    NewsProviders: "/content/news-providers",
    News: "/content/news",
    NewsEdit: "/content/news/edit/:id",
    Videos: "/content/videos",
    FlowNews: "/content/flow/news",
    FlowNewsEdit: "/content/flow/news/edit/:id",
    FlowVideos: "/content/flow/videos",
    FlowSocial: "/content/flow/social",
    LocOverview: "/content/loc-overview",
    LocOverviewEdit: "/content/loc-overview/edit/:id",
    VideosEdit: "/content/videos/edit/:sport/:internalEventId",
    LegalNotices: "/content/legal-notices",
  },
  Mapping: {
    Mapped: "/mapping/mapped",
    Unmapped: "/mapping/unmapped",
  },
  Messaging: {
    PushNotifications: "/messaging/push-notifications",
  },
  Advertising: {
    Overview: "/advertising",
    Advertisers: "/advertising/advertisers",
    Types: "/advertising/types",
    Banners: "/advertising/banners",
    Placement: "/advertising/placement",
  },
  Analytics: {
    Overview: "/analytics",
  },
  Users: {
    ProfileManagement: "/user-profile",
    UserManagement: "/users",
  },
};

export const permissions = {
  PermUser: 1,
  PermUserAdmin: 2,
  PermNewsAdmin: 4,
  PermNewsEditor: 8,
  PermVideoAdmin: 16,
  PermVideoEditor: 32,
  PermCompanyAccountUser: 64,
  PermCompanyAccountAdmin: 128,
  PermMenuAdmin: 512,
  PermLocalizedEnumsAdmin: 1024,
  PermEnumsAdmin: 2048,
  PermFlowAdmin: 4096,
  PermFlowEditor: 8192,
};

export const categories = [
  {
    id: "Content",
    children: [
      {
        id: "Menu structure",
        title: "Menu Structure",
        icon: <ReorderIcon />,
        path: Routes.Content.MenuStructure,
        permissions: [permissions.PermMenuAdmin],
        description:
          "Defines all competitions for the individual sports available in the apps as well as their structure,",
        showInHomePage: true,
        showInMenu: true,
      },
      {
        id: "Popular selection",
        title: "Popular Selection",
        icon: <StarIcon />,
        path: Routes.Content.PopularSelection,
        permissions: [permissions.PermMenuAdmin],
        description:
          "Defines selected categories and competitions to appear on top. Can also be presented as a separate section.",
        showInHomePage: true,
        showInMenu: true,
      },
      {
        id: "Localized Enums",
        title: "Localized Enums",
        icon: <FormatListNumberedRtl />,
        path: Routes.Content.LocEnums,
        permissions: [permissions.PermLocalizedEnumsAdmin],
        description:
          "Defines unordered lists of localized strings, each string related to one or more identifiers. Duplicates are allowed.",
        showInHomePage: true,
        showInMenu: true,
      },
      {
        id: "News Feeds",
        title: "News Feeds",
        icon: <RssFeedIcon />,
        path: Routes.Content.NewsProviders,
        permissions: [permissions.PermNewsAdmin],
        description:
          "RSS feeds to provide news data to the apps. Each RSS feed needs to be associated with a specific sport and language.",
        showInHomePage: true,
        showInMenu: true,
      },
      {
        id: "News",
        title: "News",
        icon: <MenuBookIcon />,
        path: Routes.Content.News,
        permissions: [permissions.PermNewsEditor],
        description:
          "Editor for news articles loaded from the RSS feeds. The articles can be pinned, unpublished or even modified.",
        showInHomePage: true,
        showInMenu: true,
      },
      {
        id: "Videos",
        title: "Videos",
        icon: <OndemandVideoIcon />,
        path: Routes.Content.Videos,
        permissions: [permissions.PermVideoEditor],
        description:
          "Defines links to YouTube videos for individual matches. Select a match from the calendar and add YOuTube videos to it.",
        showInHomePage: true,
        showInMenu: true,
      },
      {
        id: "FlowNews",
        title: "Flow News",
        icon: <MenuBookIcon />,
        path: Routes.Content.FlowNews,
        permissions: [permissions.PermNewsEditor],
        description:
            "Editor for news articles loaded from the RSS feeds. The articles can be pinned, unpublished or even modified.",
        showInHomePage: true,
        showInMenu: true,
      },
      {
        id: "FlowVideos",
        title: "FlowVideos",
        icon: <OndemandVideoIcon />,
        path: Routes.Content.FlowVideos,
        permissions: [permissions.PermVideoEditor],
        description:
            "Defines links to YouTube videos for individual matches. Select a match from the calendar and add YOuTube videos to it.",
        showInHomePage: true,
        showInMenu: true,
      },
      {
        id: "FlowSocial",
        title: "FlowSocial",
        icon: <OndemandSocialIcon />,
        path: Routes.Content.FlowSocial,
        permissions: [permissions.PermFlowEditor],
        description:
            "???????",
        showInHomePage: true,
        showInMenu: true,
      },
      {
        id: "Location Overview",
        title: "Location Overview",
        icon: <FilterCenterFocusIcon />,
        path: Routes.Content.LocOverview,
        permissions: [permissions.PermLocalizedEnumsAdmin],
        description:
          "Shows categories and stages prioritized by specific locations.",
        showInHomePage: true,
        showInMenu: true,
      },
      {
        id: "Legal Notices",
        title: "Legal Notices",
        icon: <PolicyIcon />,
        path: Routes.Content.LegalNotices,
        permissions: [permissions.PermMenuAdmin],
        description:
          "Editor for legal notices such as Privacy Policy, Cookie Policy, Terms and Conditions, etc.",
        showInHomePage: false,
        showInMenu: false,
      },
    ],
  },
  {
    id: "Mapping",
    children: [
      {
        id: "Mapped",
        title: "Mapped Items",
        icon: <AccountTreeIcon />,
        path: Routes.Mapping.Mapped,
        permissions: [permissions.PermMenuAdmin],
        description:
          "Shows mappings between matches and provides a possibility to change or break mappings.",
        showInHomePage: false,
        showInMenu: false,
      },
      {
        id: "Unmapped",
        title: "Unmapped items",
        icon: <NewReleasesIcon />,
        path: Routes.Mapping.Unmapped,
        permissions: [permissions.PermMenuAdmin],
        description:
          "Shows relationships between matches of different providers, which are too weak to be considered mappings. Provides a possibility to convert them to mappings.",
        showInHomePage: true,
        showInMenu: true,
      },
    ],
  },
  {
    id: "Messaging",
    children: [
      {
        id: "Push Notifications",
        title: "Push Notifications",
        icon: <MessageIcon />,
        path: Routes.Messaging.PushNotifications,
        permissions: [permissions.PermMenuAdmin],
        description:
          "Sends ad-hoc push notifications to selected apps. Notification content can be localized.",
        showInHomePage: false,
        showInMenu: false,
      },
    ],
  },
  {
    id: "Advertising",
    children: [
      {
        id: "Overview",
        title: "Advertising",
        icon: <DashboardIcon />,
        path: Routes.Advertising.Overview,
        permissions: [permissions.PermUserAdmin],
        description:
          "Provides an overview of all ads configured in the apps and their performance.",
        showInHomePage: false,
        showInMenu: false,
      },
      {
        id: "Advertisers",
        title: "Advertisers",
        icon: <BusinessIcon />,
        path: Routes.Advertising.Advertisers,
        permissions: [permissions.PermUserAdmin],
        description:
          "Overview and maintenance of entities (clients, pertners, etc.), which own ads in the apps.",
        showInHomePage: false,
        showInMenu: false,
      },
      {
        id: "Types",
        title: "Ad Types",
        icon: <ListIcon />,
        path: Routes.Advertising.Types,
        permissions: [permissions.PermUserAdmin],
        description:
          "Defines different types of ads (e.g. 320x50 banner, interstitial, video, etc.), which may behave differently in different products.",
        showInHomePage: false,
        showInMenu: false,
      },
      {
        id: "Creatives",
        title: "Ad Creatives",
        icon: <BannerIcon />,
        path: Routes.Advertising.Banners,
        permissions: [permissions.PermUserAdmin],
        description:
          "Overview and maintenance of the ads content (static or dynamic, local or remote).",
        showInHomePage: false,
        showInMenu: false,
      },
      {
        id: "Placement",
        title: "Ad Placement",
        icon: <PublicIcon />,
        path: Routes.Advertising.Placement,
        permissions: [permissions.PermUserAdmin],
        description:
          "Distribution of ads in the apps. Defines campaigns and rules to fill them with ads.",
        showInHomePage: false,
        showInMenu: false,
      },
    ],
  },
  {
    id: "Analytics",
    children: [
      {
        id: "Overview",
        title: "Analytics",
        icon: <BarChartIcon />,
        path: Routes.Analytics.Overview,
        permissions: [permissions.PermUserAdmin],
        description:
          "Overview of impressions and users and detailed stats from  all the apps.",
        showInHomePage: false,
        showInMenu: false,
      },
    ],
  },
  {
    id: "Settings",
    children: [
      {
        id: "Users and Permissions",
        title: "Users & Permissions",
        icon: <PeopleIcon />,
        path: Routes.Users.UserManagement,
        permissions: [permissions.PermUserAdmin],
        description:
          "User management - creates new users, locks and removes existing user accounts and maintains their permissions.",
        showInHomePage: true,
        showInMenu: true,
      },
      {
        id: "User Profile",
        title: "User Profile",
        icon: <PersonIcon />,
        path: Routes.Users.ProfileManagement,
        permissions: [permissions.PermUser, permissions.PermUserAdmin],
        description:
          "User profile - update basic info, contact details and security properties of your user profile.",
        showInHomePage: false,
        showInMenu: false,
      },
    ],
  },
];

class Routing extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Route path={Routes.Home} exact component={Home} />
        <Route path={Routes.Login} exact component={Login} />
        <Route path={Routes.Logout} exact component={Logout} />
        <Route
          path={Routes.PasswordRecovery}
          exact
          component={PasswordRecovery}
        />
        <Route
          path={Routes.Content.MenuStructure}
          exact
          component={ContentMenuStructure}
        />
        <Route
          path={Routes.Content.MenuStructureCreate}
          exact
          component={ContentMenuStructureEdit}
        />
        <Route
          path={Routes.Content.MenuStructureCreateFromProviderData}
          exact
          component={ContentMenuStructureEdit}
        />
        <Route
          path={Routes.Content.MenuStructureClone}
          exact
          component={ContentMenuStructureEdit}
        />
        <Route
          path={Routes.Content.MenuStructureEdit}
          exact
          component={ContentMenuStructureEdit}
        />
        <Route
          path={Routes.Content.PopularSelection}
          exact
          component={ContentPopularSelection}
        />
        <Route
          path={Routes.Content.PopularSelectionEdit}
          exact
          component={ContentPopularSelectionEdit}
        />
        <Route
          path={Routes.Content.LocEnums}
          exact
          component={ContentLocEnums}
        />
        <Route
          path={Routes.Content.LocEnumsCreate}
          exact
          component={ContentLocEnumsEdit}
        />
        <Route
          path={Routes.Content.LocEnumsCreateFromSource}
          exact
          component={ContentLocEnumsEdit}
        />
        <Route
          path={Routes.Content.LocEnumsEdit}
          exact
          component={ContentLocEnumsEdit}
        />
        <Route
          path={Routes.Content.NewsProviders}
          exact
          component={ContentNewsProviders}
        />
        <Route path={Routes.Content.News} exact component={ContentNews} />
        <Route
          path={Routes.Content.NewsEdit}
          exact
          component={ContentNewsEdit}
        />
        <Route
          path={Routes.Content.LocOverview}
          exact
          component={LocOverview}
        />
        <Route
          path={Routes.Content.LocOverviewEdit}
          exact
          component={LocOverviewEdit}
        />
        <Route path={Routes.Content.Videos} exact component={ContentVideos} />
        <Route
          path={Routes.Content.VideosEdit}
          exact
          component={ContentVideosEdit}
        />
        <Route path={Routes.Content.FlowNews} exact component={ContentFlowNews} />
        <Route path={Routes.Content.FlowVideos} exact component={ContentFlowVideos} />
        <Route path={Routes.Content.FlowSocial} exact component={ContentFlowSocial} />
        <Route
          path={Routes.Content.LegalNotices}
          exact
          component={ContentLegalNotices}
        />
        <Route path={Routes.Mapping.Mapped} exact component={MappingMapped} />
        <Route
          path={Routes.Mapping.Unmapped}
          exact
          component={MappingUnmapped}
        />
        <Route
          path={Routes.Messaging.PushNotifications}
          exact
          component={PushNotifications}
        />
        <Route
          path={Routes.Advertising.Overview}
          exact
          component={AdvertisingOverview}
        />
        <Route
          path={Routes.Advertising.Advertisers}
          exact
          component={AdvertisingAdvertisers}
        />
        <Route
          path={Routes.Advertising.Types}
          exact
          component={AdvertisingTypes}
        />
        <Route
          path={Routes.Advertising.Banners}
          exact
          component={AdvertisingBanners}
        />
        <Route
          path={Routes.Advertising.Placement}
          exact
          component={AdvertisingPlacement}
        />
        <Route
          path={Routes.Analytics.Overview}
          exact
          component={AnalyticsOverview}
        />
        <Route
          path={Routes.Users.UserManagement}
          exact
          component={UserManagement}
        />
        <Route
          path={Routes.Users.ProfileManagement}
          exact
          component={UserProfileManagement}
        />
      </React.Fragment>
    );
  }
}
export default withRouter(Routing);
