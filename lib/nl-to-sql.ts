export interface NLToSQLResponse {
  sqlQuery: string;
  explanation: string;
}

export async function nlToSql(nlQuery: string, schema: string): Promise<NLToSQLResponse> {
  const prompt = `You are an expert SQL generator. Using the following database schema:\n\n${schema}\n\nConvert the following natural language question into an SQLite query:\n"${nlQuery}"\n\nOnly respond with the SQL query.`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi',
        prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate SQL query');
    }

    const data = await response.json();

    return {
      sqlQuery: data.response.trim(),
      explanation: 'Generated using local model via Ollama'
    };
  } catch (error) {
    console.error('Error generating SQL query:', error);
    throw error;
  }
}