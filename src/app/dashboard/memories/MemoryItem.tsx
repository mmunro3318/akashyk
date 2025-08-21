"use client";

import { useState } from "react";
import { summarizeMemory } from "../page";

export default function MemoryItem({ memory }: { memory: any }) {
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 250;

  const truncatedContent =
    memory.content.length > MAX_LENGTH
      ? `${memory.content.substring(0, MAX_LENGTH)}...`
      : memory.content;

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <li
      key={memory.id}
      className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-blue-300">{memory.title}</h2>
        <form action={summarizeMemory} className="flex items-center">
          <input type="hidden" name="id" value={memory.id} />
          <input type="hidden" name="content" value={memory.content} />
          <button
            type="submit"
            className="ml-4 px-4 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow transition duration-150 ease-in-out"
            title="Summarize"
          >
            <span className="inline-block align-middle mr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 17l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                />
              </svg>
            </span>
            Summarize
          </button>
        </form>
      </div>
      {memory.summary && (
        <div className="mb-4">
          <span className="block text-sm font-medium text-blue-400 mb-1">
            AI Summary:
          </span>
          <p className="text-blue-200 italic">{memory.summary}</p>
        </div>
      )}
      <p className="text-gray-100 mb-4 whitespace-pre-wrap">
        {expanded ? memory.content : truncatedContent}
      </p>

      {memory.content.length > MAX_LENGTH && (
        <button
          onClick={handleToggleExpand}
          className="text-blue-400 hover:underline text-sm font-semibold"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
      {memory.file_url && (
        <div className="mt-4">
          <a
            href={memory.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline font-medium"
          >
            View Attachment
          </a>
        </div>
      )}
      <span className="text-sm text-gray-400 block mt-2">
        Added on:{" "}
        {new Date(memory.created_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </span>
    </li>
  );
}
