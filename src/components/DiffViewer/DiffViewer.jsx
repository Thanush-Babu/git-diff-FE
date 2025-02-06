import React, { useState, useEffect } from "react";

const DiffViewer = ({ owner, repo, commitSHA }) => {
  const [diffData, setDiffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openIndex, setOpenIndex] = useState(null); // Track open item

  const toggleVisibility = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle between open/close
  };

  useEffect(() => {
    const fetchDiff = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repositories/${owner}/${repo}/commits/${commitSHA}/diff`
        );
        const data = await response.json();
        console.log("Diff Data:", data);
        setDiffData(data);
      } catch (err) {
        setError("Failed to load diff data");
      } finally {
        setLoading(false);
      }
    };

    fetchDiff();
  }, [owner, repo, commitSHA]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="mx-auto p-4 text-white">
      {diffData.map((file, index) => (
        <div key={index} className="mb-6">
          {/* Clickable Section */}
          <div className="flex gap-1 cursor-pointer" onClick={() => toggleVisibility(index)}>
            <img
              src={openIndex === index ? "/Group-down.svg" : "/Group-right.svg" } // Toggle icon
              alt="group toggle arrow"
              className="w-5 h-5 transition-transform transform duration-200"
            />
            <p className="text-sm text-[#1C7CD6]">{file.headFile.path}</p>
          </div>

          {/* Toggle pre tag visibility */}
          {openIndex === index && (
            <pre className="p-1 overflow-x-auto">
              {file.hunks.map((hunk, hunkIndex) => (
                <div className="border-1 border-[#E7EBF1] p-1" key={hunkIndex}>
                  <div className="px-2 py-1 text-xs text-[#6D84B0] font-bold">
                    {hunk.header}
                  </div>
                  {hunk.lines.map((line, lineIndex) => (
                    <div
                      key={lineIndex}
                      className={`whitespace-pre text-[#657B83] ${
                        line.content.startsWith("+")
                          ? "bg-[#D8FFCB]"
                          : line.content.startsWith("-")
                          ? "bg-[#FFE4E9]"
                          : "bg-white"
                      }`}
                    >
                      <span className="w-12 ml-4 text-right text-xs text-[#6078A9] font-bold">
                        {line.baseLineNumber || "  "}
                      </span>
                      <span className="w-12 ml-4 text-right text-xs text-[#6078A9] font-bold">
                        {line.headLineNumber || "  "}
                      </span>
                      <span className="ml-4 text-xs text-[#657B83] font-bold">
                        {line.content}
                      </span>
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

export default DiffViewer;
