import { Suspense } from "react"
import MarketDetails from "@/components/MarketDetails"
import Loading from "@/components/Loading"

export default function MarketPage({
  searchParams,
}: {
  searchParams: { url: string }
}) {
  return (
    <main className="min-h-screen bg-black p-8">
      <Suspense fallback={<Loading />}>
        <MarketDetails url={searchParams.url} />
      </Suspense>
    </main>
  )
}

