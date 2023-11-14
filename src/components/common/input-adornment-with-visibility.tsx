import React from "react";
import InputAdornment from "@material-ui/core/InputAdornment";

interface RProps {
  visible?: boolean;
  position: "start" | "end";
}

class InputAdornmentWithVisibility extends React.PureComponent<RProps, any> {
  render(): React.ReactNode {
    if (this.props.visible !== true) {
      return null;
    }
    return (
      <InputAdornment position={this.props.position}>
        {this.props.children}
      </InputAdornment>
    );
  }
}

export default InputAdornmentWithVisibility;
