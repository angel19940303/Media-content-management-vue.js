import React from "react";
import SortableTree, {
  FullTree,
  NodeData,
  OnMovePreviousAndNextLocation,
  TreeItem,
} from "react-sortable-tree";
import { TreeDataNodeType } from "../../../models/enums/tree-data-node-type";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ErrorIcon from "@material-ui/icons/Error";
import MultipleChoiceButton from "../../common/multiple-choice-button";
import { Icon } from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import IconVisibility from "@material-ui/icons/Visibility";
import IconVisibilityOff from "@material-ui/icons/VisibilityOff";
import IconSync from "@material-ui/icons/Sync";
import IconStar from "@material-ui/icons/Star";
import IconStarOutline from "@material-ui/icons/StarBorder";
import IconDomain from "@material-ui/icons/Domain";
import IconDomainDisabled from "@material-ui/icons/DomainDisabled";

const styles = () =>
  createStyles({
    errorIcon: {
      fontSize: "0.875rem",
      "& svg": {
        fontSize: "1.1rem",
        verticalAlign: "middle",
      },
    },
    nodeHidden: {
      color: "#999",
      "& svg": {
        color: "#999",
      },
      "& .rst__rowSubtitle": {
        backgroundColor: "#999",
      },
    },
  });

interface RProps extends WithStyles<typeof styles> {
  data: Array<TreeItem>;
  config?: EditableSortableTreeConfig;
  id?: string;
}

interface EditableSortableTreeConfig {
  searchString?: string;
  height?: number;
  validationErrors?: Map<number, Array<string>>;
  canDrag?: (node?: any) => boolean;
  canDrop?: (node?: any) => boolean;
  canHide?: (node?: any) => boolean;
  canPull?: (node?: any) => boolean;
  canBeDomestic?: (node?: any) => boolean;
  hasPrimary?: (node?: any) => boolean;
  canNodeHaveChildren?: (node: any) => boolean;
  isNodeHidden?: (node: any) => boolean;
  isNodeDomestic?: (node: any) => boolean;
  isNodePrimary?: (node: any) => boolean;
  onChange?: (data: any) => void;
  onAddClick?: (node: any) => void;
  onCreateClick?: (nodeType: number, parent?: any) => void;
  onEditClick?: (node: any, parent?: any) => void;
  onRemoveClick?: (node: any) => void;
  onHideClick?: (node: any) => void;
  onDomesticClick?: (node: any) => void;
  onPrimaryClick?: (node: any) => void;
  onPullClick?: (node: any) => void;
  onMoveNode?: (
    node: NodeData & FullTree & OnMovePreviousAndNextLocation
  ) => void;
}

class MenuSortableTree extends React.Component<RProps, any> {
  render(): React.ReactNode {
    return (
      <div
        style={{ width: "100%", height: this.props.config?.height || 0 }}
        id={this.props.id}
      >
        <SortableTree
          treeData={this.props.data}
          canDrag={(node) =>
            this.props.config?.canDrag === undefined ||
            this.props.config.canDrag(node)
          }
          canDrop={(data) => this.canDrop(data)}
          canNodeHaveChildren={(data) => this.canNodeHaveChildren(data)}
          generateNodeProps={(data) => this.generateNodeProps(data)}
          rowHeight={28}
          scaffoldBlockPxWidth={50}
          getNodeKey={(data) => data.node.treeId}
          searchMethod={(event) => MenuSortableTree.customSearchMethod(event)}
          searchQuery={this.props.config?.searchString}
          searchFocusOffset={0}
          onlyExpandSearchedNodes={true}
          onChange={(data) => this.onChange(data)}
          onMoveNode={(node) => this.onMoveNode(node)}
        />
      </div>
    );
  }

  private static customSearchMethod(event: any): boolean {
    return (
      event.searchQuery &&
      event.searchQuery.length > 0 &&
      event.node &&
      (event.node.title.toLowerCase().indexOf(event.searchQuery.toLowerCase()) >
        -1 ||
        (event.node.type === TreeDataNodeType.SEASON &&
          event.searchQuery.match(/^[0-9]+$/) !== null &&
          event.node.stageMappings.find(
            (mapping: any) => mapping.stageId.indexOf(event.searchQuery) > -1
          ) !== undefined))
    );
  }

  private canDrop(data: any): boolean {
    if (data.node) {
      if (this.props.config?.canDrop) {
        return this.props.config.canDrop(data.node);
      }
      const nextParentType = !data.nextParent
        ? undefined
        : data.nextParent.type;
      switch (data.node.type) {
        case TreeDataNodeType.CATEGORY:
          return (
            nextParentType === undefined ||
            nextParentType === TreeDataNodeType.CATEGORY
          );
        case TreeDataNodeType.STAGE:
          return nextParentType === TreeDataNodeType.CATEGORY;
        case TreeDataNodeType.SEASON:
          return nextParentType === TreeDataNodeType.STAGE;
      }
    }
    return false;
  }

  private canNodeHaveChildren(node: any): boolean {
    if (this.props.config?.canNodeHaveChildren) {
      return this.props.config.canNodeHaveChildren(node);
    }
    return node.type !== TreeDataNodeType.SEASON;
  }

  private generateNodeProps(data: any): any {
    if (!data.node) {
      return {};
    }
    const items = new Array<any>();
    if (data.node.type === TreeDataNodeType.CATEGORY) {
      items.push({ value: TreeDataNodeType.CATEGORY, content: "Category" });
      items.push({ value: TreeDataNodeType.STAGE, content: "Stage" });
    } else if (data.node.type === TreeDataNodeType.STAGE) {
      items.push({ value: TreeDataNodeType.SEASON, content: "Season" });
    }

    let style: any | undefined = undefined;
    if (this.props.config?.validationErrors?.has(data.node.treeId) === true) {
      style = { boxShadow: `0 0 0 3px red` };
    }

    const canHide = this.props.config?.canHide
      ? this.props.config.canHide(data.node)
      : false;
    const isNodeHidden = this.props.config?.isNodeHidden
      ? this.props.config.isNodeHidden(data.node)
      : false;
    const canBeDomestic = this.props.config?.canBeDomestic
      ? this.props.config.canBeDomestic(data.node)
      : false;
    const isNodeDomestic = this.props.config?.isNodeDomestic
      ? this.props.config.isNodeDomestic(data.node)
      : false;
    const canPull = this.props.config?.canPull
      ? this.props.config.canPull(data.node)
      : false;
    const hasPrimary = this.props.config?.hasPrimary
      ? this.props.config.hasPrimary(data.node)
      : false;
    const isNodePrimary = this.props.config?.isNodePrimary
      ? this.props.config.isNodePrimary(data.node)
      : false;
    const className = isNodeHidden ? this.props.classes.nodeHidden : undefined;

    const actions = new Array<React.ReactNode>();

    actions.push(this.renderErrorIndicator(data.node.treeId));

    if (canHide && this.props.config?.onHideClick) {
      actions.push(
        <IconButton title="Remove" onClick={() => this.onHideClick(data.node)}>
          {isNodeHidden ? (
            <IconVisibilityOff fontSize="small" />
          ) : (
            <IconVisibility fontSize="small" />
          )}
        </IconButton>
      );
    }

    if (hasPrimary && this.props.config?.onPrimaryClick) {
      actions.push(
        <IconButton
          title="Primary"
          onClick={() => this.onPrimaryClick(data.node)}
        >
          {isNodePrimary ? (
            <IconStar fontSize="small" />
          ) : (
            <IconStarOutline fontSize="small" />
          )}
        </IconButton>
      );
    }

    if (canBeDomestic && this.props.config?.onDomesticClick) {
      actions.push(
        <IconButton
          title="Is Domestic"
          onClick={() => this.onDomesticClick(data.node)}
        >
          {isNodeDomestic ? (
            <IconDomain fontSize="small" />
          ) : (
            <IconDomainDisabled fontSize="small" />
          )}
        </IconButton>
      );
    }

    if (canPull && this.props.config?.onPullClick) {
      actions.push(
        <IconButton title="Pull" onClick={() => this.onPullClick(data.node)}>
          <IconSync fontSize="small" />
        </IconButton>
      );
    }

    if (this.props.config?.onCreateClick) {
      actions.push(
        <MultipleChoiceButton
          items={items}
          onSelect={(value) => this.onCreateClick(value, data.node)}
        >
          <AddIcon fontSize="small" />
        </MultipleChoiceButton>
      );
    }

    if (this.props.config?.onAddClick) {
      actions.push(
        <IconButton title="Add" onClick={() => this.onAddClick(data.node)}>
          <AddIcon fontSize="small" />
        </IconButton>
      );
    }

    if (this.props.config?.onEditClick) {
      actions.push(
        <IconButton
          title="Edit"
          onClick={() => this.onEditClick(data.node, data.parentNode)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      );
    }

    if (this.props.config?.onRemoveClick) {
      actions.push(
        <IconButton
          title="Remove"
          onClick={() => this.onRemoveClick(data.node)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      );
    }

    return {
      style: style,
      buttons: actions,
      className: className,
    };
  }

  private renderErrorIndicator(treeId: number): React.ReactNode {
    const errors = this.props.config?.validationErrors?.get(treeId);
    if (!errors || errors.length === 0) {
      return "";
    }

    return (
      <Tooltip title={errors.join("\n")}>
        <Icon className={this.props.classes.errorIcon}>
          <ErrorIcon color="error" />
        </Icon>
      </Tooltip>
    );
  }

  private onChange(data: any): void {
    if (this.props.config?.onChange) {
      this.props.config.onChange(data);
    }
  }

  private onMoveNode(
    node: NodeData & FullTree & OnMovePreviousAndNextLocation
  ): void {
    if (this.props.config?.onMoveNode) {
      this.props.config.onMoveNode(node);
    }
  }

  private onCreateClick(nodeType: number, node: any): void {
    if (this.props.config?.onCreateClick) {
      this.props.config.onCreateClick(nodeType, node);
    }
  }

  private onAddClick(node: any): void {
    if (this.props.config?.onAddClick) {
      this.props.config.onAddClick(node);
    }
  }

  private onEditClick(node: any, parent?: any): void {
    if (this.props.config?.onEditClick) {
      this.props.config.onEditClick(node, parent);
    }
  }

  private onRemoveClick(node: any): void {
    if (this.props.config?.onRemoveClick) {
      this.props.config.onRemoveClick(node);
    }
  }

  private onHideClick(node: any): void {
    if (this.props.config?.onHideClick) {
      this.props.config.onHideClick(node);
    }
  }

  private onPrimaryClick(node: any): void {
    if (this.props.config?.onPrimaryClick) {
      this.props.config.onPrimaryClick(node);
    }
  }

  private onPullClick(node: any): void {
    if (this.props.config?.onPullClick) {
      this.props.config.onPullClick(node);
    }
  }

  private onDomesticClick(node: any): void {
    if (this.props.config?.onDomesticClick) {
      this.props.config.onDomesticClick(node);
    }
  }
}

export default withStyles(styles)(MenuSortableTree);
