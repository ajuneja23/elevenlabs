import Image from "next/image"
import { getMarketDetails } from "@/lib/kalshi"
import { analyzeSentiment, getDescription } from "@/lib/openai"
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import BackButton from './BackButton'
import DescriptionAudio from './DescriptionAudio'
import AgenticSearchButton from '@/components/AgenticSearchButton'

export default async function MarketDetails({ url }: { url: string }) {
  if (!url) {
    return (
      <div className="mx-auto max-w-6xl">
        <BackButton />
        <div className="rounded-lg bg-red-900/50 p-6 text-white">
          <h1 className="mb-4 text-3xl font-bold text-red-400">Error</h1>
          <p className="text-red-200">No market URL provided</p>
        </div>
      </div>
    )
  }

  try {
    const market = await getMarketDetails(url)
    const sentimentAnalysis = await analyzeSentiment(market.title)
    const description = await getDescription(market.title)
    
    console.log('Market title:', market.title);
    console.log('Description received:', description);

    return (
      <>
        <BackButton />
        <div className="mx-auto max-w-6xl text-white">
          <div className="mb-8 rounded-lg bg-gray-900 p-6">
            <h1 className="mb-4 text-3xl font-bold">{market.title}</h1>
            
            <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Market Stats */}
              <div className="rounded-lg bg-gray-800 p-6">
                <h2 className="mb-2 text-xl font-semibold">Market Stats</h2>
                <div className="grid gap-4">
                  <div>
                    <p className="text-4xl font-bold text-blue-400">
                      {market.currentOdds.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-400">Current Odds</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-300">Status</p>
                      <p className="text-gray-400">{market.status}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-300">Last Price</p>
                      <p className="text-gray-400">${market.lastPrice}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-300">24h Volume</p>
                      <p className="text-gray-400">${market.volume24h.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-300">Total Volume</p>
                      <p className="text-gray-400">${market.volume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-300">Liquidity</p>
                      <p className="text-gray-400">${market.liquidity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-300">Close Time</p>
                      <p className="text-gray-400">{market.closeTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Image */}
              <div className="rounded-lg bg-gray-800 p-6">
                <h2 className="mb-2 text-xl font-semibold">Market Image</h2>
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={market.imageUrl}
                    alt={market.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Sentiment Analysis Section */}
            <div className="mb-8 rounded-lg bg-gray-800 p-6">
              <h2 className="mb-4 text-xl font-semibold">Social Sentiment Analysis</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-green-950/20 p-4 border border-green-900">
                  <h3 className="text-lg font-medium text-green-400 mb-3">Positive</h3>
                  <div className="prose prose-sm prose-invert max-w-none text-green-300">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {sentimentAnalysis.positive}
                    </Markdown>
                  </div>
                </div>
                
                <div className="rounded-lg bg-red-950/20 p-4 border border-red-900">
                  <h3 className="text-lg font-medium text-red-400 mb-3">Negative</h3>
                  <div className="prose prose-sm prose-invert max-w-none text-red-300">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {sentimentAnalysis.negative}
                    </Markdown>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-950/20 p-4 border border-blue-900">
                  <h3 className="text-lg font-medium text-blue-400 mb-3">Neutral</h3>
                  <div className="prose prose-sm prose-invert max-w-none text-blue-300">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {sentimentAnalysis.neutral}
                    </Markdown>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Description */}
            <div className="rounded-lg bg-gray-800 p-6">
              <h2 className="mb-2 text-xl font-semibold">Description</h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                {description ? (
                  <>
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {description}
                    </Markdown>
                    <DescriptionAudio description={description} />
                  </>
                ) : (
                  <p>Loading description...</p>
                )}
              </div>
            </div>

            {/* Add Agentic Search Button */}
            <div className="mt-8 flex justify-center">
              <AgenticSearchButton 
                marketTitle={market.title}
                description={description || ''}
              />
            </div>

            {/* Last Updated */}
            <div className="mt-4 text-right text-sm text-gray-400">
              Last updated: {new Date(market.lastUpdated).toLocaleString()}
            </div>
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error("Error in MarketDetails:", error)
    return (
      <div className="mx-auto max-w-6xl">
        <BackButton />
        <div className="rounded-lg bg-red-900/50 p-6 text-white">
          <h1 className="mb-4 text-3xl font-bold text-red-400">Error</h1>
          <p className="text-red-200">
            {error instanceof Error ? error.message : "An unexpected error occurred while fetching market details."}
          </p>
          <div className="mt-4 text-sm text-red-200">
            <p>Provided URL: {url}</p>
            <p className="mt-2">Error details: {error instanceof Error ? error.stack : JSON.stringify(error)}</p>
          </div>
        </div>
      </div>
    )
  }
}

