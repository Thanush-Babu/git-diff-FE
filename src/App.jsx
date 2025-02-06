import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DiffViewer from "./components/DiffViewer/DiffViewer";
import CommitPage from "./components/CommitPage/CommitPage";


function App() {
  const [commitUrl, setCommitUrl] = useState("");
  const [commitData, setCommitData] = useState(null);

  const handleFetchDiff = () => {
    const urlParts = commitUrl.split("/");
    const owner = urlParts[3];
    const repo = urlParts[4];
    const commitId = urlParts[6];

    if (owner && repo && commitId) {
      setCommitData({ owner, repo, commitId });
    } else {
      alert("Invalid GitHub commit URL");
    }
  };

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/repositories/:owner/:repo/commit/:commitSHA"
            element={<CommitPage />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
