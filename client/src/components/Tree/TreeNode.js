import React, { useState, useContext } from "react";
import { TreeContext } from "../../context/TreeContext";
import { v4 as uuidv4 } from "uuid";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/TreeNode.css";

// 메모장 노드 컴포넌트
const MemoNode = ({ node }) => {
  const { updateTreeData } = useContext(TreeContext);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(node.title);
  const [content, setContent] = useState(node.content || "");

  const handleSave = () => {
    const updateNode = (nodes) =>
      nodes.map((n) => {
        if (n.id === node.id) {
          return { ...n, title, content };
        }
        if (n.children?.length > 0) {
          return { ...n, children: updateNode(n.children) };
        }
        return n;
      });

    updateTreeData((prev) => updateNode(prev));
    setIsEditing(false);
  };

  return (
    <div className="card shadow-sm mb-4 border-primary node">
      <div className="card-body">
        {isEditing ? (
          <>
            <input
              type="text"
              className="form-control mb-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="메모 제목"
            />
            <textarea
              className="form-control mb-2"
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="메모 내용"
            />
            <button className="btn btn-primary btn-sm d-block" onClick={handleSave}>
              저장
            </button>
          </>
        ) : (
          <>
            <h5 className="card-title text-start">{node.title || "메모 제목 없음"}</h5>
            <p className="text-start">{node.content || "메모 내용 없음"}</p>
            <button
              className="btn btn-outline-secondary btn-sm d-block"
              onClick={() => setIsEditing(true)}
            >
              수정
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// 체크리스트 노드 컴포넌트
const ChecklistNode = ({ node }) => {
  const { updateTreeData } = useContext(TreeContext);
  const [checklist, setChecklist] = useState(node.content || []);
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem.trim()) {
      setChecklist([...checklist, { id: uuidv4(), text: newItem, status: "진행전" }]);
      setNewItem("");
    }
  };

  const handleStatusChange = (itemId, newStatus) => {
    setChecklist(
      checklist.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item))
    );
  };

  const handleSave = () => {
    const updateNode = (nodes) =>
      nodes.map((n) => {
        if (n.id === node.id) {
          return { ...n, content: checklist };
        }
        if (n.children?.length > 0) {
          return { ...n, children: updateNode(n.children) };
        }
        return n;
      });

    updateTreeData((prev) => updateNode(prev));
  };

  return (
    <div className="card shadow-sm mb-4 border-success node">
      <div className="card-body">
        <h5 className="card-title text-start">체크리스트</h5>
        <table className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>항목</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {checklist.map((item) => (
              <tr key={item.id}>
                <td>{item.text}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                  >
                    <option value="진행전">진행전</option>
                    <option value="진행중">진행중</option>
                    <option value="완료">완료</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="input-group input-group-sm mb-2">
          <input
            type="text"
            className="form-control"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="새 항목 추가"
          />
          <button className="btn btn-success" onClick={handleAddItem}>
            추가
          </button>
        </div>
        <button className="btn btn-success btn-sm d-block" onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
};

// TreeNode 메인 컴포넌트
const TreeNode = ({ node }) => {
  const { updateTreeData } = useContext(TreeContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(node.title);

  const handleAddChild = (type) => {
    const newChild = {
      id: uuidv4(),
      title: `새 ${type}`,
      type,
      content: type === "checklist" ? [] : "",
      children: type === "depth" ? [] : undefined,
    };

    const addChild = (nodes) =>
      nodes.map((n) => {
        if (n.id === node.id) {
          return { ...n, children: [...(n.children || []), newChild] };
        }
        if (n.children?.length > 0) {
          return { ...n, children: addChild(n.children) };
        }
        return n;
      });

    updateTreeData((prev) => addChild(prev));
  };

  const handleDeleteNode = () => {
    if (!window.confirm("정말 삭제하시겠습니까? 하위 노드도 모두 삭제됩니다.")) return;

    const deleteNode = (nodes, nodeId) =>
      nodes.filter((n) => n.id !== nodeId).map((n) => {
        if (n.children?.length > 0) {
          return { ...n, children: deleteNode(n.children, nodeId) };
        }
        return n;
      });

    updateTreeData((prev) => deleteNode(prev, node.id));
  };

  const handleSaveTitle = () => {
    const updateNodeTitle = (nodes) =>
      nodes.map((n) => {
        if (n.id === node.id) {
          return { ...n, title: newTitle };
        }
        if (n.children?.length > 0) {
          return { ...n, children: updateNodeTitle(n.children) };
        }
        return n;
      });

    updateTreeData((prev) => updateNodeTitle(prev));
    setIsEditing(false);
  };

  return (
    <div
      className={`card shadow-sm mb-4 ${
        node.depthLevel === 1 ? "no-hover depth1-node" : "node"
      }`}
      style={{ marginLeft: node.depthLevel !== 1 ? "15px" : "0" }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {isEditing ? (
            <>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="form-control form-control-sm"
                style={{ width: "60%" }}
                placeholder="노드 제목"
              />
              <button className="btn btn-primary btn-sm" onClick={handleSaveTitle}>
                저장
              </button>
            </>
          ) : (
            <h5
              className="text-start"
              style={{ cursor: "pointer" }}
              onClick={() => setIsEditing(true)}
            >
              {node.title || "제목 없음"}
            </h5>
          )}
          <div className="btn-group">
            {node.type === "depth" && (
              <>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleAddChild("depth")}
                >
                  + Depth
                </button>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleAddChild("memo")}
                >
                  + 메모장
                </button>
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => handleAddChild("checklist")}
                >
                  + 체크리스트
                </button>
              </>
            )}
            <button className="btn btn-outline-danger btn-sm" onClick={handleDeleteNode}>
              삭제
            </button>
          </div>
        </div>
        {node.type === "memo" && <MemoNode node={node} />}
        {node.type === "checklist" && <ChecklistNode node={node} />}
        {node.children &&
          node.children.map((child) => <TreeNode key={child.id} node={child} />)}
      </div>
    </div>
  );
};

export default TreeNode;
