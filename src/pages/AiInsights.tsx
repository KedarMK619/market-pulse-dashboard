import { useState, useEffect, useRef } from "react";
import {
  Send,
  Lightbulb,
  TrendingUp,
  BarChart3,
  Star,
  Brain,
  MessageCircle,
  Zap,
  RotateCcw,
} from "lucide-react";
import { companies, products } from "@/lib/mock/mockData";
import { analyzeMarket } from "@/lib/api/gemini";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  prompt: string;
  date: string;
}

const AiInsights = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText: string = inputValue) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const typingMessage: ChatMessage = {
      id: `typing-${Date.now()}`,
      type: "ai",
      content: "PulseAI is analyzing...",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const history = messages
        .filter((msg) => !msg.isTyping)
        .slice(-6)
        .map((msg) => ({
          role: msg.type,
          content: msg.content,
        }));
      const marketContext = { companies, products, history };
      const aiResponse = await analyzeMarket(messageText, marketContext);

      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: "ai",
        content: `${aiResponse}\n\n⚠️ AI Generated - Educational Only\nPowered by Gemini AI`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      const errorMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: "ai",
        content:
          "Analysis temporarily unavailable. Please try again shortly. ⚠️ Educational project only.\n\n⚠️ AI Generated - Educational Only\nPowered by Gemini AI",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([]);
    setInputValue("");
  };

  const prompts = [
    { id: 1, icon: TrendingUp, text: "Which sector is performing best this week?" },
    { id: 2, icon: BarChart3, text: "Compare Apple vs Microsoft profit trends" },
    { id: 3, icon: Zap, text: "What products are seeing demand surge right now?" },
    { id: 4, icon: Star, text: "Summarize today's biggest market losers" },
    { id: 5, icon: Brain, text: "Predict which industry will grow next quarter" },
    { id: 6, icon: TrendingUp, text: "Why is Tesla's demand changing recently?" },
  ];

  const recentSessions: ChatSession[] = [
    { id: "1", title: "What is MarketPulse?", prompt: "What is MarketPulse?", date: "Project Guide" },
    { id: "2", title: "Explain Profit Margin & P&L", prompt: "What is profit margin?", date: "Concept Basics" },
    { id: "3", title: "Tech Sector Overview", prompt: "Tell me about Technology sector", date: "Market Topic" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-5 min-h-[calc(100vh-11rem)]">
      {/* LEFT PANEL - SUGGESTED ANALYSIS */}
      <div className="hidden lg:flex flex-col w-[32%] gap-5">
        <div className="glass-card p-5 flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFE055] text-[#141416]">
              <Lightbulb className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold text-foreground">Suggested Analysis</h2>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {prompts.map((prompt, idx) => {
              const IconComponent = prompt.icon;
              return (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => handlePromptClick(prompt.text)}
                  className={`w-full p-3.5 text-left transition-all duration-200 group flex items-center gap-3 ${
                    idx === 0
                      ? "bento-highlight shadow-sm"
                      : "bento-tile hover:brightness-110"
                  }`}
                >
                  <IconComponent
                    className={`h-4 w-4 shrink-0 ${
                      idx === 0 ? "text-[#141416]" : "text-[#1BF2B3]"
                    }`}
                  />
                  <p
                    className={`text-xs font-bold flex-1 leading-snug ${
                      idx === 0 ? "text-[#141416]" : "text-foreground"
                    }`}
                  >
                    {prompt.text}
                  </p>
                  <span className={idx === 0 ? "text-[#141416]" : "text-muted-foreground group-hover:text-[#FFE055]"}>
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-[#FFE055]" />
            Quick Topics
          </h3>
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => handlePromptClick(session.prompt)}
                className="w-full bento-tile p-3 text-left hover:brightness-110 flex items-center justify-between"
              >
                <span className="text-xs font-bold text-foreground">{session.title}</span>
                <span className="text-[11px] text-muted-foreground">{session.date}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - CHAT INTERFACE */}
      <div className="w-full lg:w-[68%] glass-card p-5 sm:p-6 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-[#FFE055] text-[#141416]">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground">PulseAI Tutor</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[#1BF2B3] animate-pulse" />
                <span>Online · Educational Purpose Only</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={clearChat}
            className="h-9 w-9 rounded-full bento-tile flex items-center justify-center text-muted-foreground hover:text-foreground"
            title="Clear chat"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Quick Prompts */}
        <div className="lg:hidden overflow-x-auto py-3 border-b border-border">
          <div className="flex gap-2 w-max">
            {prompts.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => handlePromptClick(prompt.text)}
                className="bento-tile px-3 py-1.5 text-xs font-semibold text-foreground whitespace-nowrap hover:bg-[#FFE055] hover:text-[#141416]"
              >
                {prompt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 max-h-[58vh]">
          {messages.length === 0 ? (
            <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center px-3">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-[#FFE055] text-[#141416] mb-4 shadow-md">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground mb-2">PulseAI</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
                Hello! I am PulseAI, your MarketPulse learning assistant. Ask about tracked stocks, product demand,
                market sectors, or basic financial concepts.{" "}
                <span className="font-semibold text-foreground">
                  Educational purpose only — do not use this project to make financial or investment decisions.
                </span>
              </p>
              <div className="flex gap-2.5 flex-wrap justify-center">
                <button
                  type="button"
                  onClick={() => handlePromptClick("View Market Summary")}
                  className="px-4 py-2 rounded-full bg-[#1BF2B3] text-xs font-bold text-[#141416] hover:brightness-105 transition-all"
                >
                  📈 View Market Summary
                </button>
                <button
                  type="button"
                  onClick={() => handlePromptClick("Analyze a Company")}
                  className="px-4 py-2 rounded-full bg-[#FFE055] text-xs font-bold text-[#141416] hover:brightness-105 transition-all"
                >
                  🔍 Analyze a Company
                </button>
                <button
                  type="button"
                  onClick={() => handlePromptClick("What is MarketPulse?")}
                  className="px-4 py-2 rounded-full bg-[#FF7597] text-xs font-bold text-[#141416] hover:brightness-105 transition-all"
                >
                  💡 How MarketPulse Works
                </button>
                <button
                  type="button"
                  onClick={() => handlePromptClick("What is profit margin?")}
                  className="px-4 py-2 rounded-full bento-tile text-xs font-bold text-foreground hover:bg-[#FFE055] hover:text-[#141416] transition-all"
                >
                  📚 Explain Market Terms
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "ai" ? (
                    <div className="flex gap-3 max-w-xl">
                      <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-[#FFE055] text-[#141416] font-bold shrink-0">
                        <Brain className="h-4 w-4" />
                      </div>
                      <div className="bento-tile p-4">
                        {message.isTyping ? (
                          <div className="flex gap-1.5 py-1">
                            <div className="w-2 h-2 bg-[#FFE055] rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                            <div className="w-2 h-2 bg-[#1BF2B3] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <div className="w-2 h-2 bg-[#FF7597] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </div>
                        ) : (
                          <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                            {message.content.split("\n").map((line, i) => (
                              <div key={i} className={line.startsWith("•") ? "ml-2" : ""}>
                                {line.includes("💡") ? (
                                  <div className="text-[#FFE055] font-semibold mt-2">{line}</div>
                                ) : line.includes("⚠️") ? (
                                  <div className="text-[#FF7597] font-semibold mt-1">{line}</div>
                                ) : (
                                  <div>{line}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-md rounded-2xl bg-[#FFE055] text-[#141416] p-4 text-sm font-semibold shadow-sm">
                      {message.content}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Chat Input */}
        <div className="pt-4 border-t border-border">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask anything about MarketPulse, stocks, P&L, or market terms..."
              className="flex-1 h-11 px-4 rounded-full bg-[hsla(var(--input))] border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FFE055]/50 transition-all"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="h-11 px-5 rounded-full bg-[#FFE055] hover:bg-[#ffd62b] disabled:opacity-50 disabled:cursor-not-allowed text-[#141416] font-bold flex items-center gap-2 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
