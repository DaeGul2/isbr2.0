import React, { useContext } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { TreeContext } from "../../context/TreeContext";
import { v4 as uuidv4 } from "uuid"; // 유니크 ID 생성

const TreeNode = ({ node, index }) => {
  const { treeData, updateTreeData } = useContext(TreeContext);

  // 하위 Depth 추가
  const handleAddChild = () => {
    const newChild = {
      id: uuidv4(),
      title: `New Depth ${node.children.length + 1}`,
      children: [],
    };

    const addChild = (nodes, nodeId) =>
      nodes.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            children: [...n.children, newChild],
          };
        }
        if (n.children.length > 0) {
          return {
            ...n,
            children: addChild(n.children, nodeId),
          };
        }
        return n;
      });

    const updatedTree = addChild(treeData, node.id);
    updateTreeData(updatedTree);
  };

  // 현재 Depth 삭제
  const handleDelete = () => {
    const deleteNode = (nodes, nodeId) =>
      nodes
        .filter((n) => n.id !== nodeId)
        .map((n) => ({
          ...n,
          children: deleteNode(n.children, nodeId),
        }));

    const updatedTree = deleteNode(treeData, node.id);
    updateTreeData(updatedTree);
  };

  return (
    <Draggable draggableId={node.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            padding: "10px",
            margin: "5px 0",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{node.title}</span>
            <button
              onClick={handleAddChild}
              style={{
                marginLeft: "10px",
                padding: "4px",
                cursor: "pointer",
              }}
            >
              ➕
            </button>
            <button
              onClick={handleDelete}
              style={{
                marginLeft: "5px",
                padding: "4px",
                cursor: "pointer",
              }}
            >
              🗑️
            </button>
          </div>
          {/* 하위 Depth */}
          {node.children && node.children.length > 0 && (
            <Droppable droppableId={node.id} type="depth">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ marginLeft: "20px", padding: "10px 0" }}
                >
                  {node.children.map((child, index) => (
                    <TreeNode key={child.id} node={child} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TreeNode;
