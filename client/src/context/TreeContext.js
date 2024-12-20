// TreeContext.js
import React, { createContext, useState } from "react";
import { initialTreeData } from "../components/Tree/treeData";

export const TreeContext = createContext();

export const TreeProvider = ({ children }) => {
  const [treeData, setTreeData] = useState(initialTreeData);

  return (
    <TreeContext.Provider value={{ treeData, updateTreeData: setTreeData }}>
      {children}
    </TreeContext.Provider>
  );
};
