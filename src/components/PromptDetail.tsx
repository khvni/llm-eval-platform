import { HistoryItem } from '../types/types';

interface Props {
    prompt: HistoryItem;
    onClose: () => void;
  }
  
  export function PromptDetail({ prompt, onClose }: Props) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-bold">Prompt Details</h3>
            <button onClick={onClose} className="text-gray-500">×</button>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">System Prompt</h4>
              <p className="mt-1">{prompt.systemPrompt}</p>
            </div>
            <div>
              <h4 className="font-medium">User Prompt</h4>
              <p className="mt-1">{prompt.content}</p>
            </div>
            <div>
              <h4 className="font-medium">Responses</h4>
              <div className="mt-2 space-y-4">
                {prompt.responses.map((response, index) => (
                  <div key={index} className="border rounded p-3">
                    <p className="font-medium">{response.llmProvider}</p>
                    <p className="mt-2">{response.response}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Latency: {response.latency}ms
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }