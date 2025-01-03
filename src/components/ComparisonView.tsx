interface Props {
    responses: LLMResponse[];
  }
  
  export function ComparisonView({ responses }: Props) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {responses.map((response) => (
          <div key={response.id} className="border rounded p-4">
            <h3 className="font-bold">{response.llmProvider}</h3>
            <p className="mt-2">{response.response}</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Latency: {response.latency}ms</p>
              <p>Tokens: {response.tokenCount}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }