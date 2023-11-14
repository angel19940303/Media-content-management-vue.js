import React from "react";
import { UserPermissions } from "../../models/user/user-permissions";

export interface AuthUser {
  userName: string;
  email: string;
  isAdmin: boolean;
  permissions: number;
  availablePermissions?: UserPermissions;
  updateAuthUser: (
    userName: string,
    email: string,
    isAdmin: boolean,
    permissions: number,
    availablePermissions?: UserPermissions
  ) => void;
}

export const AuthUserContext = React.createContext<AuthUser>({
  userName: "",
  email: "",
  isAdmin: false,
  permissions: -1,
  updateAuthUser: () => {},
});
