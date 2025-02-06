import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CommitPage = () => {
  // Extract parameters from the URL
  const { owner, repo, commitSHA } = useParams();
  console.log(owner, repo, commitSHA);
  const [diffData, setDiffData] = useState([]);
  const [commitData, setCommitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commitLoading, setCommitLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commitError, setcommitError] = useState(null);

  const [openIndex, setOpenIndex] = useState(null); // Track open item

  const toggleVisibility = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle between open/close
  };

  useEffect(() => {
    const fetchDiff = async () => {
      try {
        const diff_response = await fetch(
          `http://localhost:5000/repositories/${owner}/${repo}/commits/${commitSHA}/diff`
        );

        const data = await diff_response.json();
        console.log("Diff Data:", data);
        setDiffData(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load diff data");
      } finally {
        setLoading(false);
      }

    //   try {
    //     const commitResponse = await fetch(
    //       `http://localhost:5000/repositories/${owner}/${repo}/commits/${commitSHA}`
    //     );

    //     const commitData = await commitResponse.json();
    //     console.log("Commit Data:", commitData);
    //     setCommitData(Array.isArray(commitData) ? data : []);
    //   } catch (err) {
    //     setcommitError("Failed to Load Commit Details");
    //   } finally {
    //     setCommitLoading(false);
    //   }
    };

    const fetchCommitInfo = async () => {
      try {
        const commitResponse = await fetch(
          `http://localhost:5000/repositories/${owner}/${repo}/commits/${commitSHA}`
        );

        const commitData = await commitResponse.json();
        console.log("Commit Data:", commitData);
        setCommitData(commitData);
      } catch (error) {
        setcommitError("Failed to Load Commit Details");
      } finally {
        setCommitLoading(false);
      }
    };
    fetchCommitInfo();
    fetchDiff();
  }, [owner, repo, commitSHA]);

    // if (commitLoading) return <p>Loading Commit Details...</p>;
    // if (commitError) return <p>{commitError}</p>;
//   if (loading) return <p>Loading Differences...</p>;
//   if (error) return <p>{error}</p>;

  return (
    <>
      {/* <div className="">
      {Array.isArray(commitData) && commitData.length > 0 ? (
        commitData.map((commit) => 
          (
            <div key={commit?.oid} className="p-4 border-b">
              <h2 className="text-lg font-bold">
                Commit ID: {commit?.oid || "N/A"}
              </h2>

              <p>
                <strong>Message:</strong> {commit?.message || "No message available"}
              </p>

              {commit?.author && typeof commit.author === "object" ? (
                <div className="mt-2">
                  <p className="font-semibold">Author:</p>
                  <p>Name: {commit.author?.name || "Unknown"}</p>
                  <p>Email: {commit.author?.email || "No email provided"}</p>
                  <p>Date: {commit.author?.date || "No date available"}</p>
                </div>
              ) : (
                <p className="text-gray-500">No author information available.</p>
              )}

              {commit?.committer && typeof commit.committer === "object" ? (
                <div className="mt-2">
                  <p className="font-semibold">Committer:</p>
                  <p>Name: {commit.committer?.name || "Unknown"}</p>
                  <p>Email: {commit.committer?.email || "No email provided"}</p>
                  <p>Date: {commit.committer?.date || "No date available"}</p>
                </div>
              ) : (
                <p className="text-gray-500">No committer information available.</p>
              )}

              <div className="mt-2">
                <p className="font-semibold">Parent Commits:</p>
                {Array.isArray(commit?.parents) && commit.parents.length > 0 ? (
                  commit.parents.map((parent, parentIndex) => (
                    <p key={parent?.oid || parentIndex}>
                      Parent OID: {parent?.oid || "N/A"}
                    </p>
                  ))
                ) : (
                  <p>No parent commits available</p>
                )}
              </div>
            </div>
          )
        )
      ) : (
        <p className="text-red-500">No commit data available.</p>
      )}

        </div> */}
      <div>
        {commitData?.map((commit, index) => (
          <div key={commit.oid || index}>
            <p>Message: {commit.message}</p>
            <br />
            <br />
            <p>Email: {commit.author?.email}</p>
            <br />
            <p>Date: {commit.author?.date}</p>
            <br />
            <br />
            <p>Author: {commit?.author?.name}</p>
            <br />
            <p>Commiter: {commit?.committer?.name}</p>
            <h2>Commit ID: {commit?.oid}</h2>
            <p>parent oid: {commit?.parents?.[0]?.oid}</p>
          </div>
        ))}
      </div>
      <br />
      <br />
      <div>
        <h1>Commit Details</h1>
        <p>
          <strong>Owner:</strong> {owner}
        </p>
        <p>
          <strong>Repository:</strong> {repo}
        </p>
        <p>
          <strong>Commit SHA:</strong> {commitSHA}
        </p>
      </div>
      <div className="mx-auto p-4 text-white">
        {diffData.map((file, index) => (
          <div key={index} className="mb-6">
            <div
              className="flex gap-1 cursor-pointer"
              onClick={() => toggleVisibility(index)}
            >
              <img
                src={
                  openIndex === index ? "/Group-down.svg" : "/Group-right.svg"
                }
                alt="group toggle arrow"
                className="w-5 h-5 transition-transform transform duration-200"
              />
              <p className="text-sm text-[#1C7CD6]">{file.headFile.path}</p>
            </div>

            {openIndex === index && (
              <pre className="p-1 overflow-x-auto">
                {file.hunks.map((hunk, hunkIndex) => (
                  <div
                    className="border-1 border-[#E7EBF1] p-1"
                    key={hunkIndex}
                  >
                    <div className="px-2 py-1 text-xs text-[#6D84B0] font-bold">
                      {hunk.header}
                    </div>
                    {hunk.lines.map((line, lineIndex) => (
                      <div
                        key={lineIndex}
                        className={`whitespace-pre flex text-[#657B83] ${
                          line.content.startsWith("+")
                            ? "bg-[#D8FFCB]"
                            : line.content.startsWith("-")
                            ? "bg-[#FFE4E9]"
                            : "bg-white"
                        }`}
                      >
                        <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                          {line.baseLineNumber || "  "}
                        </div>
                        <div className="w-9 text-right text-xs text-[#6078A9] font-bold">
                          {line.headLineNumber || "  "}
                        </div>
                        <div className="pl-4 text-xs text-[#657B83] font-bold">
                          {line.content}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default CommitPage;
