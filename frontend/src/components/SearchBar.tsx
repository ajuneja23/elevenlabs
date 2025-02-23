"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchBar() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const validateInput = (input: string) => {
    // Match either a full Kalshi URL or just a market ID
    const urlPattern = /^(?:https?:\/\/)?(?:www\.)?kalshi\.com\/markets\/[a-zA-Z0-9-]+/i
    const marketIdPattern = /^[a-zA-Z0-9-]+$/

    return urlPattern.test(input) || marketIdPattern.test(input.trim())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setError("Please enter a Kalshi market URL or ID")
      return
    }

    if (!validateInput(trimmedUrl)) {
      setError("Please enter a valid Kalshi market URL or ID")
      return
    }

    router.push(`/market?url=${encodeURIComponent(trimmedUrl)}`)
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex rounded-lg border border-gray-700 bg-gray-900">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Kalshi market URL or ID (e.g., kxoscarpic)"
            className="w-full rounded-l-lg bg-transparent px-4 py-2 text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-r-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
          >
            Search
          </button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <p className="text-xs text-gray-500">
          Examples:
          <br />• https://kalshi.com/markets/kxoscarpic
          <br />• www.kalshi.com/markets/kxoscarpic
          <br />• kxoscarpic
        </p>
      </form>
    </div>
  )
}

