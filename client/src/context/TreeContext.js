import React, { createContext, useState } from "react";

export const TreeContext = createContext();

export const TreeProvider = ({ children }) => {
  const [treeData, setTreeData] = useState([
    {
      id: "1",
      title: "Depth 1",
      children: [
        {
          id: "2",
          title: "Depth 2-1",
          children: [],
        },
      ],
    },
  ]);

  const updateTreeData = (newData) => {
    setTreeData(newData);
  };

  return (
    <TreeContext.Provider value={{ treeData, updateTreeData }}>
      {children}
    </TreeContext.Provider>
  );
};
