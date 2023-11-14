import React from "react";
import {
  Checkbox,
  createStyles,
  FormGroup,
  FormLabel,
  withStyles,
} from "@material-ui/core";
import { WithStyles } from "@material-ui/core/styles";
import { MenuItemList } from "../../../../models/menu/menu-item-list";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { ConfigUtil } from "../../../../utils/config-util";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const styles = () => createStyles({});

interface RProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  menuItemList: MenuItemList;
  selectedLanguage: string;
  onApply?: (menuItemList: MenuItemList) => void;
  onClose?: () => void;
}

interface RState {
  selectedLanguages: Set<string>;
}

class OrderRootItemsDialog extends React.PureComponent<RProps, RState> {
  constructor(props: RProps) {
    super(props);
    this.state = { selectedLanguages: new Set<string>() };
  }

  render() {
    return (
      <Dialog
        maxWidth={"sm"}
        fullWidth={true}
        open={this.props.isOpen}
        onClose={() => this.onClose()}
        aria-labelledby="stage-data-batch-analysis-dialog-title"
      >
        <DialogTitle id="stage-data-batch-analysis-dialog-title">
          Order root menu items
        </DialogTitle>
        <DialogContent dividers>
          <FormControl>
            <FormLabel>Select languages to order:</FormLabel>
            <FormControlLabel
              key="all"
              control={
                <Checkbox
                  name="all"
                  checked={
                    this.state.selectedLanguages.size ===
                    ConfigUtil.languages().length
                  }
                  onChange={(event) => this.onAllLanguagesCheckboxChange(event)}
                />
              }
              label="All"
            />
            <FormGroup>
              {ConfigUtil.languages().map((language) => (
                <FormControlLabel
                  key={language.code}
                  control={
                    <Checkbox
                      name={language.code}
                      checked={this.state.selectedLanguages.has(language.code)}
                      onChange={(event) =>
                        this.onLanguageCheckboxChange(event, language.code)
                      }
                    />
                  }
                  label={language.name}
                />
              ))}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => this.onApply()}
            disabled={this.state.selectedLanguages.size === 0}
            color="primary"
          >
            Apply
          </Button>
          <Button onClick={() => this.onClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  private onLanguageCheckboxChange(event: any, language: string): void {
    const isChecked = event.target.checked;
    this.setState((state) => {
      const newSelectedLanguages = new Set<string>(state.selectedLanguages);
      if (isChecked) {
        newSelectedLanguages.add(language);
      } else {
        newSelectedLanguages.delete(language);
      }
      return { selectedLanguages: newSelectedLanguages };
    });
  }

  private onAllLanguagesCheckboxChange(event: any) {
    const newSelectedLanguages = new Set<string>();
    if (event.target.checked) {
      ConfigUtil.languages().forEach((language) =>
        newSelectedLanguages.add(language.code)
      );
    }
    this.setState({ selectedLanguages: newSelectedLanguages });
  }

  private onApply(): void {
    if (this.props.onApply) {
      const selectedLanguages = Array.from(this.state.selectedLanguages);
      const sortedItemList = this.props.menuItemList.sortedRootItems(
        selectedLanguages,
        this.props.selectedLanguage
      );
      this.props.onApply(sortedItemList);
    }
    this.reset();
  }

  private onClose(): void {
    if (this.props.onClose) {
      this.props.onClose();
    }
    this.reset();
  }

  private reset(): void {
    this.setState({ selectedLanguages: new Set<string>() });
  }
}

export default withStyles(styles)(OrderRootItemsDialog);
