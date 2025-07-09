/** @format */

import React from "react";
import Spreadsheet from "./Spreadsheet";

const App: React.FC = () => {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Spreadsheet View</h1>
      <Spreadsheet />
    </main>
  );
};

export default App;
