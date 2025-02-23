"use server"

import * as https from 'https'

// Define types for the API response
interface MarketResponse {
  market: {
    title: string;
    description: string;
    yes_bid: number;
    no_bid: number;
    volume_24h: number;
    liquidity: number;
    status: string;
    close_time: string;
    last_price: number;
    volume: number;
    // Add any other fields you want to display
  };
}

async function makeHttpsRequest(options: https.RequestOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];

      res.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks);
        try {
          const data = JSON.parse(body.toString());
          resolve(data);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          reject(new Error('Failed to parse market data'));
        }
      });
    });

    req.on('error', (error: Error) => {
      console.error('Error:', error);
      reject(error);
    });

    req.end();
  });
}

export async function getMarketData(ticker: string): Promise<MarketResponse> {
  const options = {
    method: 'GET',
    hostname: 'api.elections.kalshi.com',
    path: `/trade-api/v2/markets/${ticker}`,
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'KALSHI-KEY': process.env.KALSHI_API_KEY!,
    }
  };

  return makeHttpsRequest(options);
}

export async function getMarketDetails(url: string) {
  try {
    const marketId = await extractMarketId(url)
    const data = await getMarketData(marketId)
    
    return {
      title: data.market.title,
      currentOdds: await calculateCurrentOdds(data.market.yes_bid, data.market.no_bid),
      imageUrl: "/placeholder.svg?height=200&width=300",
      summary: data.market.description,
      status: data.market.status,
      closeTime: new Date(data.market.close_time).toLocaleString(),
      lastPrice: data.market.last_price,
      volume: data.market.volume,
      volume24h: data.market.volume_24h,
      liquidity: data.market.liquidity,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error fetching market details:", error)
    throw error instanceof Error ? error : new Error(`Failed to fetch market details: ${JSON.stringify(error)}`)
  }
}

export async function extractMarketId(url: string): Promise<string> {
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?kalshi\.com\/markets\/([a-zA-Z0-9-]+)(?:\/[^/]*)?/i
  const urlMatch = url.match(urlPattern)
  if (urlMatch && urlMatch[1]) return urlMatch[1].trim()
  
  const marketIdPattern = /^[a-zA-Z0-9-]+$/
  if (marketIdPattern.test(url.trim())) return url.trim()
  
  throw new Error("Invalid Kalshi market URL or ID")
}

export async function calculateCurrentOdds(yesBid: number, noBid: number): Promise<number> {
  if (!yesBid && !noBid) return 50
  const total = yesBid + noBid
  return total > 0 ? (yesBid / total) * 100 : 50
}

