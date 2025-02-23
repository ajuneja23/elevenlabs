'use client'

import { useState } from 'react'
import { Voice, VoiceSettings } from 'elevenlabs'

interface DescriptionAudioProps {
  description: string
}

export default function DescriptionAudio({ description }: DescriptionAudioProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const generateAudio = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: description }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate audio')
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
    } catch (error) {
      console.error('Error generating audio:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={generateAudio}
        disabled={isLoading}
        className="mb-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating Audio...' : 'Listen to Description'}
      </button>
      
      {audioUrl && (
        <audio controls className="w-full">
          <source src={audioUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  )
} 