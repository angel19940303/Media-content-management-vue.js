import React from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const styles = () =>
  createStyles({
    resizablePaper: {
      maxWidth: "100%",
      margin: "auto",
      overflow: "hidden",
    },
  });

export interface ResizablePaperInsets {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface RProps extends WithStyles<typeof styles> {
  insets: ResizablePaperInsets;
  className?: string;
  onResize?: (height: number) => void;
}

export interface RState {
  contentHeight: number;
}

class ResizablePaper extends React.Component<RProps, RState> {
  private readonly resizeEventListener: EventListener;

  constructor(props: RProps) {
    super(props);
    this.resizeEventListener = () => this.onWindowResize.call(this);
    this.state = { contentHeight: ResizablePaper.contentHeight(props.insets) };
  }

  private static contentHeight(insets: ResizablePaperInsets): number {
    return Math.max(window.innerHeight - insets.top - insets.bottom, 0);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeEventListener);
    if (this.props.onResize) {
      this.props.onResize(this.state.contentHeight);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEventListener);
  }

  render(): React.ReactNode {
    let className = this.props.classes.resizablePaper;
    if (this.props.className) {
      className += " " + this.props.className;
    }
    return (
      <Paper className={className} style={{ height: this.state.contentHeight }}>
        {this.props.children}
      </Paper>
    );
  }

  private onWindowResize(): void {
    const contentHeight = ResizablePaper.contentHeight(this.props.insets);
    this.setState({ contentHeight: contentHeight });
    if (this.props.onResize) {
      this.props.onResize(contentHeight);
    }
  }
}

export default withStyles(styles)(ResizablePaper);
