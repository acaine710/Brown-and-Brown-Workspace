import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, Key, X } from 'lucide-react';
import { QUOTES } from '../data/fakeData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function buildSystemPrompt(): string {
  const active = QUOTES.filter((q) =>
    ['Open', 'Submitted', 'Quoted', 'Stalled'].includes(q.status)
  );
  const stalled = QUOTES.filter((q) => q.isStalled);
  const totalPremium = active.reduce((s, q) => s + q.estimatedPremium, 0);
  const won = QUOTES.filter((q) => q.status === 'Won').length;
  const closed = QUOTES.filter((q) => ['Won', 'Lost'].includes(q.status)).length;
  const hitRatio = closed > 0 ? Math.round((won / closed) * 100) : 0;

  return `You are an AI assistant for Brown & Brown Insurance's quote management platform, powered by GPT-4.1.

Current pipeline snapshot (as of April 23, 2025):
- Active quotes in flight: ${active.length}
- Stalled quotes needing attention: ${stalled.length}
- Total estimated premium in flight: $${totalPremium.toLocaleString()}
- Overall hit ratio (YTD): ${hitRatio}%
- Business lines covered: Personal Lines, P&C Small/Mid/Large Commercial, Employee Benefits, Dealer Services, Surety/Bonds
- Insurance segments: Workers' Comp, Commercial Auto, General Liability, Property, Professional Liability
- Key carriers: Travelers, Chubb, Liberty Mutual, Zurich, The Hartford, Nationwide, Cincinnati Financial

You help producers and account executives with:
- Quote pipeline analysis and prioritization recommendations
- Carrier selection and appetite guidance
- SLA management and deadline tracking
- Hit ratio improvement strategies
- General insurance workflow and best-practice questions

Be concise, professional, and focused on actionable insights. Format lists with bullet points when helpful.`;
}

const WELCOME = `Hello! I'm your AI assistant powered by **GPT-4.1**. I have context about your current quote pipeline and can help with:

• Pipeline analysis & prioritization
• Carrier selection guidance
• SLA deadline management
• Hit ratio improvement strategies

What would you like to know?`;

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(
    import.meta.env.VITE_OPENAI_API_KEY ?? ''
  );
  const [showKeyInput, setShowKeyInput] = useState(
    !import.meta.env.VITE_OPENAI_API_KEY
  );
  const [keyDraft, setKeyDraft] = useState(apiKey);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading || !apiKey) return;

    const updated: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1',
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            ...updated,
          ],
          max_tokens: 800,
          temperature: 0.4,
        }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: { message?: string } };
        throw new Error(err.error?.message ?? `HTTP ${res.status}`);
      }

      const data = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
      const reply = data.choices[0].message.content;
      setMessages([...updated, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          content: `⚠️ ${err instanceof Error ? err.message : 'Unknown error'}. Please verify your OpenAI API key.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col bg-white border border-[#D0DAE8] rounded-lg shadow-sm overflow-hidden">
      {/* Panel header */}
      <div className="px-6 py-4 bg-[#0C2340] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#174F8F] flex items-center justify-center">
          <Bot size={18} className="text-[#4A9EDF]" />
        </div>
        <div>
          <div className="font-semibold text-white text-sm">AI Assistant</div>
          <div className="text-xs text-[#8AAECC]">Powered by GPT-4.1 · Brown & Brown</div>
        </div>
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          title="Configure API key"
          className="ml-auto p-1.5 rounded hover:bg-[#153658] text-[#8AAECC] hover:text-white transition-colors"
        >
          <Key size={16} />
        </button>
      </div>

      {/* API key configuration */}
      {showKeyInput && (
        <div className="px-4 py-3 bg-[#EBF0F8] border-b border-[#D0DAE8] flex gap-2 items-center">
          <input
            type="password"
            value={keyDraft}
            onChange={(e) => setKeyDraft(e.target.value)}
            placeholder="Enter OpenAI API key (sk-…)"
            className="flex-1 text-sm border border-[#D0DAE8] rounded px-3 py-1.5 bg-white text-[#1A2B3C] placeholder-[#7A95AB] focus:outline-none focus:ring-2 focus:ring-[#0078D4]/40"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setApiKey(keyDraft);
                setShowKeyInput(false);
              }
            }}
          />
          <button
            onClick={() => { setApiKey(keyDraft); setShowKeyInput(false); }}
            className="text-xs bg-[#0078D4] hover:bg-[#106EBE] text-white px-3 py-1.5 rounded transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => setShowKeyInput(false)}
            className="p-1.5 text-[#7A95AB] hover:text-[#1A2B3C]"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {!apiKey && !showKeyInput && (
        <div className="px-4 py-2 bg-[#FFF4CE] border-b border-[#CA5010]/30 text-xs text-[#8A5B00] flex items-center gap-2">
          <span>⚠️ No OpenAI API key configured.</span>
          <button
            onClick={() => setShowKeyInput(true)}
            className="underline font-medium hover:text-[#6B4500]"
          >
            Add key
          </button>
        </div>
      )}

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F4F7FA]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[#174F8F] flex items-center justify-center mr-2 mt-0.5 shrink-0">
                <Bot size={14} className="text-[#4A9EDF]" />
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#0078D4] text-white rounded-tr-sm'
                  : 'bg-white text-[#1A2B3C] border border-[#D0DAE8] rounded-tl-sm shadow-sm'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-[#174F8F] flex items-center justify-center mr-2 shrink-0">
              <Bot size={14} className="text-[#4A9EDF]" />
            </div>
            <div className="bg-white border border-[#D0DAE8] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <Loader2 size={16} className="animate-spin text-[#0078D4]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className="px-4 py-3 border-t border-[#D0DAE8] bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder={apiKey ? 'Ask about your pipeline…' : 'Add an API key to start chatting'}
          disabled={!apiKey}
          className="flex-1 text-sm border border-[#D0DAE8] rounded-lg px-3 py-2 bg-white text-[#1A2B3C] placeholder-[#7A95AB] focus:outline-none focus:ring-2 focus:ring-[#0078D4]/40 disabled:opacity-50"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading || !apiKey}
          className="bg-[#0078D4] hover:bg-[#106EBE] disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-colors"
          title="Send"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
