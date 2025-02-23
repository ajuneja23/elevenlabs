"use client";

import { useRouter } from "next/navigation";
import axios from "axios";

interface AgenticSearchButtonProps {
  marketTitle: string;
  description: string;
}

export default function AgenticSearchButton({
  marketTitle,
  description,
}: AgenticSearchButtonProps) {
  const router = useRouter();

  const handleAgenticSearch = async (market: string) => {
    console.log(market);
    const response = await axios.post("http://localhost:5051/api/data", {
      market: market,
    });

    if (!response.data.ok) {
      throw new Error("Failed to fetch agentic data");
    }

    router.push(
      `/agentic-calls?title=${marketTitle}&description=${encodeURIComponent(
        description
      )}`
    );
  };

  return (
    <div className="space-x-2">
      <button
        onClick={async () => await handleAgenticSearch(marketTitle)}
        className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
        Start Agentic Calls
      </button>
      <button
        onClick={() => router.push(`/agentic-calls`)}
        className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        View Call List
      </button>
    </div>
  );
}
