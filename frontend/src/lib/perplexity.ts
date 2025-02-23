interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function analyzeSentiment(question: string) {
  const prompt = `Conduct a sentiment analysis on social media regarding the following question: "${question}"
  
  Please organize your findings into these categories:
  1. Positive sentiment discussions
  2. Negative sentiment discussions
  3. Neutral or mixed sentiment discussions
  
  Conclude with an overall sentiment direction estimate.
  
  Only show these three sections and the conclusion, no additional information.`

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
    },
    body: JSON.stringify({
      model: 'sonar-medium-online',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse the response into sections
  const sections = content.split('\n\n').filter(Boolean);
  
  // Format sections with color-coded markdown
  return {
    positive: sections.find((s: string) => s.toLowerCase().includes('positive'))
      ?.split('\n')
      .slice(1)
      .join('\n')
      ?.replace(/(.+)/g, '**<span style="color: #22c55e">$1</span>**') || 'No positive sentiment found',
    negative: sections.find((s: string) => s.toLowerCase().includes('negative'))
      ?.split('\n')
      .slice(1)
      .join('\n')
      ?.replace(/(.+)/g, '**<span style="color: #ef4444">$1</span>**') || 'No negative sentiment found',
    neutral: sections.find((s: string) => s.toLowerCase().includes('neutral'))
      ?.split('\n')
      .slice(1)
      .join('\n')
      ?.replace(/(.+)/g, '**<span style="color: #3b82f6">$1</span>**') || 'No neutral sentiment found',
    conclusion: sections.find((s: string) => s.toLowerCase().includes('conclusion') || s.toLowerCase().includes('overall'))
      ?.split('\n')
      .slice(1)
      .join('\n') || 'No conclusion available'
  };
}

export async function getDescription(title: string) {
  const prompt = `Write a detailed analysis of "${title}" in markdown format. Include:
- Key background information
- Main points of discussion
- Current relevance and implications
- Notable statistics or data (if applicable)

Use markdown formatting with:
- Bullet points for lists
- **Bold** for important terms
- ### Headers for sections
Keep it concise but informative.`;

  try {
    console.log('Sending request to Perplexity with title:', title);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides detailed market analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Perplexity API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Perplexity API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in getDescription:', error);
    throw error;
  }
} 