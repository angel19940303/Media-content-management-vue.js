import React from "react";

export interface ResizableContentHeight {
  total: number;
  inner: number;
}

export interface ResizableContentState {
  contentHeight: ResizableContentHeight;
  contentTopOffset: number;
}

export abstract class ResizableContentComponent<
  T,
  U extends ResizableContentState
> extends React.Component<T, U> {
  private readonly resizeEventListener: EventListener;

  protected constructor(props: T) {
    super(props);
    this.resizeEventListener = () => this.onWindowResize.call(this);
  }

  protected static contentHeight(topOffset?: number): ResizableContentHeight {
    const total =
      Math.max(window.innerHeight - 70 - 48 - 52 - 49, 0) - (topOffset ?? 0);
    const inner = total - 49;
    return { total: total, inner: inner };
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeEventListener);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEventListener);
  }

  private onWindowResize(): void {
    this.setState({
      contentHeight: ResizableContentComponent.contentHeight(
        this.state.contentTopOffset
      ),
    });
  }
}
