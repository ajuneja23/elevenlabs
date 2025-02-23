import CallList from "@/components/CallList";
export default function AgenticCallsPage() {
  return (
    <main className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-white">Agentic Calls</h1>
        <CallList />
      </div>
    </main>
  );
}
