interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function analyzeSentiment(question: string) {
  const prompts = {
    positive: `List only the positive social media sentiment about "${question}". Use bullet points and highlight key points in bold.`,
    negative: `List only the negative social media sentiment about "${question}". Use bullet points and highlight key points in bold.`,
    neutral: `List only the balanced/neutral social media sentiment about "${question}". Use bullet points and highlight key points in bold.`
  };

  const makeRequest = async (prompt: string) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const [positive, negative, neutral] = await Promise.all([
    makeRequest(prompts.positive),
    makeRequest(prompts.negative),
    makeRequest(prompts.neutral)
  ]);

  return { positive, negative, neutral };
}

export async function getDescription(title: string) {
  try {
    console.log('Getting description for:', title);
    
    const prompt = `Search the web and write a detailed analysis of "${title}". Include:
- Latest information and developments
- Key statistics and data from reliable sources
- Current market implications and expert opinions
- Background context and relevance

Format your response in markdown with:
- Bullet points for key facts
- **Bold** for important terms
- ### Headers for sections
- Include sources where possible

Keep it concise but informative.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a market analyst with access to current web information. Provide detailed, well-researched analysis with citations where possible.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response data:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI API');
    }

    const content = data.choices[0].message.content;
    console.log('Description content:', content);
    return content;
  } catch (error) {
    console.error('Error in getDescription:', error);
    throw error;
  }
} 