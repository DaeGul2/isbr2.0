import React, { useContext } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { TreeContext } from "../../context/TreeContext";
import TreeNode from "./TreeNode";

const Tree = () => {
  const { treeData, updateTreeData } = useContext(TreeContext);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return; // Drag was cancelled

    const moveItem = (nodes, sourceId, destinationId) => {
      let draggedItem = null;

      const removeFromSource = (nodes) => {
        return nodes.filter((node) => {
          if (node.id === sourceId) {
            draggedItem = node;
            return false;
          }
          if (node.children?.length > 0) {
            node.children = removeFromSource(node.children);
          }
          return true;
        });
      };

      const addToDestination = (nodes) => {
        return nodes.map((node) => {
          if (node.id === destinationId) {
            node.children = [...(node.children || []), draggedItem];
          }
          if (node.children?.length > 0) {
            node.children = addToDestination(node.children);
          }
          return node;
        });
      };

      const updatedNodes = addToDestination(removeFromSource(nodes));
      return updatedNodes;
    };

    const updatedTree = moveItem(treeData, source.droppableId, destination.droppableId);
    updateTreeData(updatedTree);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="root" type="depth">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {treeData.map((node, index) => (
              <TreeNode key={node.id} node={node} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Tree;
