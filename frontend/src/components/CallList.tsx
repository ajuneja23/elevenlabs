"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Call {
  conversation_id: string;
  number: string;
  summary: string;
}

export default function CallList() {
  const router = useRouter();
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalls = async () => {
      const numbersToCall = ["+13236339447", "+14452082310", "+12244432889"];
      const response = await fetch("http://localhost:5051/api/convos");
      const result = (await response.json()).result;
      let calls = numbersToCall.map((number, i) => ({
        conversation_id: result[i].conversation_id,
        number,
        summary: result[i].summary,
      }));

      setCalls(calls);
      setLoading(false);
    };

    fetchCalls();
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading calls...</div>;
  }

  return (
    <div className="space-y-4">
      {calls.map(call => (
        <div
          key={call.conversation_id}
          className="rounded-lg bg-gray-800 p-4 flex items-start gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">{call.number}</h3>
              <span className="text-sm text-gray-400">
                {new Date().toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-gray-300">{call.summary}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
