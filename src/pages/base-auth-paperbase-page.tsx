import React from "react";
import BasePaperbasePage from "./base-paperbase-page";
import AuthWrapper from "../components/login/auth-wrapper";

abstract class BaseAuthPaperbasePage<T, U> extends BasePaperbasePage<T, U> {
  render(): React.ReactNode {
    return <AuthWrapper>{super.render()}</AuthWrapper>;
  }
}

export default BaseAuthPaperbasePage;
