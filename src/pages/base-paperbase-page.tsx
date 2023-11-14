import React from "react";
import Paperbase from "../components/layout/paperbase";

abstract class BasePaperbasePage<T, U> extends React.Component<T, U> {
  render(): React.ReactNode {
    return <Paperbase>{this.renderContent()}</Paperbase>;
  }

  protected abstract renderContent(): React.ReactNode;
}

export default BasePaperbasePage;
