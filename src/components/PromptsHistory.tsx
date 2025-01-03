import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PromptDetail } from './PromptDetail';

interface HistoryItem {
  id: string;
  content: string;
  systemPrompt: string;
  createdAt: Date;
  responses: Array<{
    llmProvider: string;
    response: string;
    latency: number;
  }>;
}

export function PromptsHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<HistoryItem | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await fetch('/api/prompts');
    const data = await res.json();
    setHistory(data);
  };

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-bold mb-4">Prompt History</h2>
      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="border-b pb-2 cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedPrompt(item)}
          >
            <p className="font-medium truncate">{item.content}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(item.createdAt), 'MMM d, yyyy HH:mm')}
            </p>
          </div>
        ))}
      </div>
      {selectedPrompt && (
        <PromptDetail prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
      )}
    </div>
  );
}