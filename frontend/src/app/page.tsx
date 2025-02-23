import SearchBar from "@/components/SearchBar"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-24">
      <h1 className="mb-8 text-4xl font-bold text-white">Kalshi Market Research</h1>
      <SearchBar />
    </main>
  )
}

