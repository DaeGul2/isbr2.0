import React from "react";
import { TreeProvider } from "./context/TreeContext";
import Home from "./pages/Home";

const App = () => {
  return (
    <TreeProvider>
      <Home />
    </TreeProvider>
  );
};

export default App;
