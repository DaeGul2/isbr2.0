import React, { useContext } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { TreeContext } from "../../context/TreeContext";
import TreeNode from "./TreeNode";

const Tree = () => {
  const { treeData, updateTreeData } = useContext(TreeContext);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return; // 드래그 취소

    // 동일 Depth에서 순서 변경
    if (source.droppableId === destination.droppableId) {
      const reorderedItems = Array.from(treeData);
      const [movedItem] = reorderedItems.splice(source.index, 1);
      reorderedItems.splice(destination.index, 0, movedItem);
      updateTreeData(reorderedItems);
    }
    // 다른 Depth로 이동 (추가 로직 필요)
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tree" type="depth">
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
