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
      {/* <div className="p-6">
        <input
          type="text"
          placeholder="Enter GitHub commit URL"
          value={commitUrl}
          onChange={(e) => setCommitUrl(e.target.value)}
          className="p-2 border rounded w-full mb-4"
        />
        <button
          onClick={handleFetchDiff}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Fetch Diff
        </button>
        {commitData && <DiffViewer {...commitData} />}
      </div> */}

      {/* STATIC */}
      <div className=" mx-auto p-4 text-white ">
        {/* {diffData.map((file, index) => ( */}
        <div
          // key={index}
          className="mb-6 "
        >
          <div className="flex gap-1 cursor-pointer">
            <img
              src="/Group-right.svg" // Toggle icon
              alt="group toggle arrow"
              className="w-5 h-5 transition-transform transform duration-200"
            />
            <p className="text-sm text-[#1C7CD6]">src/main/java</p>
          </div>
          <pre className=" p-1 overflow-x-auto">
            {/* {file.hunks.map((hunk, hunkIndex) => ( */}
            <div
              className="border-1 border-[#E7EBF1] p-1"
              // key= {hunkIndex}
            >
              <div className=" px-2 py-1 text-xs text-[#6D84B0] font-bold">
                {/* {hunk.header} */}
                {"@@ -10,7 +10,7 @@ const Gold = () => {"}
              </div>
              {/* {hunk.lines.map((line, lineIndex) => ( */}
              <div
              // key={lineIndex}

              // className={`whitespace-pre flex text-[#657B83] ${
              //   line.content.startsWith("+")
              //     ? "bg-[#D8FFCB]"
              //     : line.content.startsWith("-")
              //     ? "bg-[#FFE4E9]"
              //     : "bg-white"
              // }`}
              >
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  {/* {line.baseLineNumber || "  "} */}
                </div>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  {/* {line.headLineNumber || "  "} */}
                </div>
                <div>{/* {line.content} */}</div>
              </div>
              <div className={`whitespace-pre flex text-[#657B83] bg-white`}>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  10
                </div>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  10
                </div>
                <div className="ml-4 text-xs text-[#657B83] font-bold ">
                  myHeaders.append("x-access-token",
                  "goldapi-5e4husm1g7y8bx-io");
                </div>
              </div>
              <div className={`whitespace-pre flex text-[#657B83] bg-white`}>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  11
                </div>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  11
                </div>
                <div className="ml-4 text-xs text-[#657B83] font-bold ">
                  {" "}
                  myHeaders.append("Content-Type", "application/json");
                </div>
              </div>
              <div className={`whitespace-pre flex text-[#657B83] bg-white`}>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  12
                </div>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  12
                </div>
                <div className="ml-4 text-xs text-[#657B83] font-bold ">
                  {" "}
                </div>
              </div>
              <div className={`whitespace-pre flex text-[#657B83] bg-[#FFE4E9]`}>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  13
                </div>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  {" "}
                </div>
                <div className="ml-4 text-xs text-[#657B83] font-bold ">
                  {"-  var requestOptions = {"}
                </div>
              </div>
              <div className={`whitespace-pre flex text-[#657B83] bg-[#D8FFCB]`}>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  {" "}
                </div>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  13
                </div>
                <div className="ml-4 text-xs text-[#657B83] font-bold ">
                  {"+  var requestOptions:any = {"}
                </div>
              </div>
              <div className={`whitespace-pre flex text-[#657B83] bg-white`}>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  14
                </div>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  14
                </div>
                <div className="ml-4 text-xs text-[#657B83] font-bold ">
                  method: 'GET',
                </div>
              </div>
              <div className={`whitespace-pre flex text-[#657B83] bg-white`}>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  15
                </div>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  15
                </div>
                <div className="ml-4 text-xs text-[#657B83] font-bold ">
                  headers: myHeaders,
                </div>
              </div>
              <div className={`whitespace-pre flex text-[#657B83] bg-white`}>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  16
                </div>
                <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                  16
                </div>
                <div className="ml-4 text-xs text-[#657B83] font-bold ">
                  redirect: 'follow',
                </div>
              </div>

              {/* ))} */}
            </div>
            {/* ))} */}
          </pre>
        </div>
        {/* ))} */}
      </div>
    </>
  );
}

export default App;
