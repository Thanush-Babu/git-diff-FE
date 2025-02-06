import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CommitPage = () => {
  // Extract parameters from the URL
  const [owner, setOwner] = useState(useParams().owner);
  const [repo, setRepo] = useState(useParams().repo);
  const [commitSHA, setCommitSHA] = useState(useParams().commitSHA);

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
          `http://localhost:${
            import.meta.env.VITE_SERVER_PORT
          }/repositories/${owner}/${repo}/commits/${commitSHA}/diff`
        );

        const data = await diff_response.json();
        console.log("Diff Data:", data);
        setDiffData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        setError("Failed to load diff data");
      } finally {
        setLoading(false);
      }
    };

    const fetchCommitInfo = async () => {
      try {
        const commitResponse = await fetch(
          `http://localhost:${import.meta.env.VITE_SERVER_PORT}/repositories/${owner}/${repo}/commits/${commitSHA}`
        );

        const commitData = await commitResponse.json();
        console.log("Commit Data:", commitData);
        setCommitData(Array.isArray(commitData) ? commitData : []);
      } catch (err) {
        setcommitError("Failed to Load Commit Details");
      } finally {
        setCommitLoading(false);
      }
    };
    fetchCommitInfo();
    fetchDiff();
  }, [owner, repo, commitSHA]);

  if (commitLoading || loading) {
    return (
      <div className="">
        <p>Loading Commit Details...</p>
      </div>
    );
  }
  
  if (commitError || error) {
    return (
      <div className="">
        <p>{commitError || error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto my-8 w-full md:w-5/6">
        {commitData?.length > 0 ? (
          commitData.map((commit, index) => {
            const [heading, ...descriptionArray] = commit?.message?.split("\n") || [];
            const description = descriptionArray.join("\n");
            const isCommitterDifferent = commit.committer.name !== commit.author.name || commit.committer.date !== commit.author.date;
            return (
              <div key={commit?.oid || index}>
                <div className=" flex flex-col md:flex-row justify-between items-start py-4">
                  <div className="flex items-start gap-1">
                    <img
                      src={`${commit?.author?.avatar_url}`} // Replace with actual avatar
                      alt="Author Avatar"
                      className="rounded-full w-10 h-10"
                    />
                    <div className="">
                      <div className={`text-[#39496A] text-base font-bold`}>
                        {heading || "No message available"}
                      </div>
                      <div className={`text-[#6D727C] text-sm font-normal`}>
                        Authored by{" "}
                        <span className="text-[#2B3750] font-bold">
                          {" "}
                          {commit?.author?.name || "Unknown Author"}{" "}
                        </span>
                        {(() => {
                          const commitDate = new Date(commit?.author?.date);
                          const now = new Date();
                          const formateDate = (date) => {
                            return date.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric"
                            });
                          };
                          const formattedCommitDate = formateDate(commitDate);
                          const diffInMs = now - commitDate;
                          const diffInDays = Math.floor(
                            diffInMs / (1000 * 60 * 60 * 24)
                          );
                          const diffInWeeks = Math.floor(diffInDays / 7);
                          const diffInMonths = Math.floor(diffInDays / 30.44); // Approximation for months
                          const diffInYears = Math.floor(diffInDays / 365);

                          if (diffInDays === 0) {
                            return "on Today";
                          } else if (diffInDays === 1) {
                            return "on Yesterday";
                          } else if (diffInDays >= 2 && diffInDays <= 6) {
                            return `${diffInDays} days ago`;
                          } else if (diffInDays >= 7 && diffInDays <= 31) {
                            return `${diffInWeeks} ${
                              diffInWeeks > 1 ? "weeks" : "week"
                            } ago on ${formattedCommitDate} `;
                          } else if (diffInDays > 31 && diffInDays <= 365) {
                            return `${diffInMonths} ${
                              diffInMonths > 1 ? "months" : "month"
                            } ago on ${formattedCommitDate} `;
                          } else {
                            return `${diffInYears} ${
                              diffInYears > 1 ? "Years" : "Year"
                            } ago on ${formattedCommitDate} `;
                          }
                        })()}
                      </div>
                      <div className={`text-[#32405D] text-sm font-normal`}>
                        {description || " "}
                      </div>
                    </div>
                  </div>
                  {isCommitterDifferent && (
                    <div className="text-sm text-gray-500 text-right">
                    <p>
                        Committed by <span className="text-blue-600">{commit.committer.name}</span>
                    </p>
                    <p>Commit: <span className="text-gray-800">{commit.oid}</span></p>
                    <p>
                        Parent:{" "}
                        <span className="text-blue-600">
                        {commit.parents[0]?.oid || "No parent available"}
                        </span>
                    </p>
                    </div>
                )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No commit data available</p>
        )}
      </div>

      <div className="mx-auto p-4 w-5/6">
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
