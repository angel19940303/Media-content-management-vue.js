import React from "react";
import {
  ContentState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import {
  createMuiTheme,
  MuiThemeProvider,
  Theme,
} from "@material-ui/core/styles";
import MUIRichTextEditor, { TMUIRichTextEditorRef } from "mui-rte";
import { stateToHTML } from "draft-js-export-html";

interface RProps {
  data?: string;
  label?: string;
  controls?: Array<string>;
  themeOverrides?: any;
  onFocus?: () => void;
  onBlur?: () => void;
  onSave?: (data: string) => void;
}

interface RState {
  editorTheme: Theme;
  contentState: ContentState;
}

class WysiwygEditor extends React.Component<RProps, RState> {
  static readonly STANDARD_CONTROLS = [
    "title",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "undo",
    "redo",
    "link",
    "numberList",
    "bulletList",
    "quote",
    "clear",
  ];

  private ref: TMUIRichTextEditorRef | null = null;

  constructor(props: RProps) {
    super(props);
    const data = props.data || "";
    const contentHTML = convertFromHTML(data);
    const contentState = ContentState.createFromBlockArray(
      contentHTML.contentBlocks,
      contentHTML.entityMap
    );
    const editorTheme = WysiwygEditor.createEditorTheme(props.themeOverrides);
    this.state = { contentState: contentState, editorTheme: editorTheme };
  }

  private static createEditorTheme(overrides?: any): Theme {
    const editorTheme = createMuiTheme();
    if (overrides) {
      Object.assign(editorTheme, overrides);
    }
    return editorTheme;
  }

  render(): React.ReactNode {
    const content = JSON.stringify(convertToRaw(this.state.contentState));
    return (
      <MuiThemeProvider theme={this.state.editorTheme}>
        <MUIRichTextEditor
          key="article_editor"
          ref={(ref) => this.setEditorRef(ref)}
          controls={this.props.controls}
          defaultValue={content}
          label={this.props.label}
          onFocus={() => this.handleEditorFocus()}
          onBlur={() => this.handleEditorBlur()}
          onSave={(data) => this.handleEditorSave(data)}
        />
      </MuiThemeProvider>
    );
  }

  save(): void {
    if (this.ref) {
      this.ref.save();
    } else if (this.props.onSave) {
      const html = stateToHTML(this.state.contentState);
      this.props.onSave(html);
    }
  }

  private setEditorRef(ref: TMUIRichTextEditorRef | null): void {
    this.ref = ref;
  }

  private handleEditorFocus(): void {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  private handleEditorBlur(): void {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  private handleEditorSave(data: string): void {
    if (this.props.onSave) {
      try {
        const rawState = JSON.parse(data);
        const state = convertFromRaw(rawState);
        const html = stateToHTML(state);
        this.props.onSave(html);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export default WysiwygEditor;
