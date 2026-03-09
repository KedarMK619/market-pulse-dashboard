import { useState, useEffect, useRef } from "react";
import { Send, Lightbulb, TrendingUp, BarChart3, Star, Brain, MessageCircle, Zap, RotateCcw, Circle } from "lucide-react";
import { companies, products } from "@/lib/mock/mockData";

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

  const generateAIResponse = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();

    if (promptLower.includes("sector")) {
      return `📊 Sector Performance Analysis
• Technology leads with +3.2% growth
• Healthcare shows -1.1% decline
• Retail gaining +1.7%
• Energy faces -2.4% headwinds

💡 Recommended: Sector Heatmap`;
    } else if (promptLower.includes("apple") || promptLower.includes("microsoft")) {
      return `📈 Company Analysis
• Revenue growth +18% year over year
• Demand score 87/100
• Profit margins improving 3 quarters
• Key risk: increasing competition

💡 Recommended: Line Chart`;
    } else if (promptLower.includes("product") || promptLower.includes("demand")) {
      return `🛍️ Product Demand Insights
• AI Chips demand surge +34%
• EV Batteries up +28%
• Organic Food growing +12%
• Luxury Watches dropped -8%

💡 Recommended: Area Chart`;
    } else if (promptLower.includes("tesla")) {
      return `📉 Tesla Analysis
• Current demand score: 68/100 (down -8.4%)
• Regional strength: North America at 72%
• Challenges: European market declining
• Q3 margin pressure from competition
• Recovery potential in AI/autonomous tech

💡 Recommended: Regional Comparison Chart`;
    } else if (promptLower.includes("compare")) {
      return `⚖️ Comparative Analysis
• Apple: Higher margins, stable growth
• Microsoft: Stronger cloud revenue
• Meta: Higher volatility, growth upside
• Average revenue growth: 14.5%
• Tech sector outperforming market by 2.8%

💡 Recommended: Multi-Line Comparison`;
    } else if (promptLower.includes("market") || promptLower.includes("summary")) {
      return `📊 Market Summary
• Top performers: MSFT (+1.76%), META (+1.76%), AAPL (+1.84%)
• Biggest decliners: RELIANCE (-1.32%), SAMSUNG (-1.33%)
• Market sentiment: 67% bullish, 33% bearish
• Trading volume up 12% vs. average
• Volatility index at moderate levels

💡 Recommended: Market Overview Dashboard`;
    } else {
      return `💡 Market Insights
I can help you analyze stocks, compare companies, track product demand trends, and understand market patterns. Here are some areas I specialize in:

• Company fundamentals & financial metrics
• Sector performance & trends
• Product demand analysis
• Market sentiment & trends
• Comparative company analysis

Try asking me about specific sectors, companies, or products!`;
    }
  };

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

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: `typing-${Date.now()}`,
      type: "ai",
      content: "PulseAI is analyzing...",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    // Simulate 2 second delay
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: "ai",
        content: generateAIResponse(messageText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([]);
    setInputValue("");
  };

  const prompts = [
    {
      id: 1,
      icon: TrendingUp,
      text: "Which sector is performing best this week?",
    },
    {
      id: 2,
      icon: BarChart3,
      text: "Compare Apple vs Microsoft profit trends",
    },
    {
      id: 3,
      icon: Zap,
      text: "What products are seeing demand surge right now?",
    },
    {
      id: 4,
      icon: Star,
      text: "Summarize today's biggest market losers",
    },
    {
      id: 5,
      icon: Brain,
      text: "Predict which industry will grow next quarter",
    },
    {
      id: 6,
      icon: TrendingUp,
      text: "Why is Tesla's demand changing recently?",
    },
  ];

  const recentSessions: ChatSession[] = [
    { id: "1", title: "Apple Q3 Analysis", date: "2 days ago" },
    { id: "2", title: "Tech Sector Overview", date: "5 days ago" },
    { id: "3", title: "Market Summary", date: "1 week ago" },
  ];

  return (
    <div className="h-full flex gap-6">
      {/* LEFT PANEL - SUGGESTED ANALYSIS */}
      <div className="hidden lg:flex flex-col w-[30%] gap-6">
        {/* Suggested Analysis Title */}
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-foreground">Suggested Analysis</h2>
        </div>

        {/* Prompt Cards */}
        <div className="space-y-3 flex-1 overflow-y-auto">
          {prompts.map((prompt) => {
            const IconComponent = prompt.icon;
            return (
              <button
                key={prompt.id}
                onClick={() => handlePromptClick(prompt.text)}
                className="w-full glass-card p-4 text-left hover:border-l-2 hover:border-primary transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="text-primary group-hover:text-primary flex-shrink-0 mt-1">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex-1">
                    {prompt.text}
                  </p>
                  <div className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                    →
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Recent Sessions */}
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Recent Sessions
          </h3>
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <button
                key={session.id}
                className="w-full glass-card p-3 text-left hover:bg-[hsla(var(--glass-bg))] transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{session.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{session.date}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - CHAT INTERFACE */}
      <div className="w-full lg:w-[70%] glass-card p-6 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 border border-primary/30">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">MarketPulse AI</h2>
              <p className="text-xs text-muted-foreground">Powered by Claude AI</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Circle className="h-2.5 w-2.5 text-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 rounded-lg hover:bg-[hsla(var(--glass-bg))] transition-colors text-muted-foreground hover:text-foreground"
            title="Clear chat"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 border-2 border-primary mb-4">
                <span className="text-2xl font-bold text-primary">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">PulseAI</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                Hello! I am PulseAI, your personal market analysis assistant. I can help you analyze stocks,
                track product demand, understand market trends, and provide actionable insights. What would
                you like to analyze today?
              </p>
              <div className="flex gap-3 flex-wrap justify-center">
                <button
                  onClick={() => handlePromptClick("View Market Summary")}
                  className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  📈 View Market Summary
                </button>
                <button
                  onClick={() => handlePromptClick("Analyze a Company")}
                  className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  🔍 Analyze a Company
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  {message.type === "ai" ? (
                    <div className="flex gap-3 max-w-md">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex-shrink-0">
                        {message.isTyping ? (
                          <span className="text-sm">...</span>
                        ) : (
                          <span className="text-base">🤖</span>
                        )}
                      </div>
                      <div className="glass-card p-4 rounded-lg">
                        {message.isTyping ? (
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </div>
                        ) : (
                          <div className="text-sm text-foreground whitespace-pre-wrap">
                            {message.content.split("\n").map((line, i) => (
                              <div key={i} className={line.startsWith("•") ? "ml-4" : ""}>
                                {line.includes("💡") ? (
                                  <div className="text-primary font-semibold mt-2">{line}</div>
                                ) : line.includes("🛍️") || line.includes("📊") || line.includes("📈") || line.includes("📉") || line.includes("⚖️") ? (
                                  <div className="font-bold text-foreground">{line}</div>
                                ) : line.includes("+") && line.includes("%") ? (
                                  <div className="text-green-400">{line}</div>
                                ) : line.includes("-") && line.includes("%") ? (
                                  <div className="text-red-400">{line}</div>
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
                    <div className="max-w-md bg-primary text-white rounded-lg p-4 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                          You
                        </div>
                      </div>
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
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask me anything about markets, stocks, products..."
              className="flex-1 h-11 px-4 rounded-lg bg-[hsla(var(--input))] border border-[hsla(var(--glass-border))] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="h-11 px-4 rounded-lg bg-primary hover:bg-primary/80 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold flex items-center gap-2 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE - Horizontal scroll prompts */}
      <div className="lg:hidden w-full space-y-4">
        <div className="flex items-center gap-2 px-4 pt-4">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-foreground">Suggested Analysis</h2>
        </div>

        <div className="overflow-x-auto px-4 pb-4">
          <div className="flex gap-3 w-max">
            {prompts.map((prompt) => {
              const IconComponent = prompt.icon;
              return (
                <button
                  key={prompt.id}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="glass-card p-3 min-w-max hover:border-l-2 hover:border-primary transition-all duration-300 group cursor-pointer flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4 text-primary flex-shrink-0" />
                  <p className="text-xs font-semibold text-foreground whitespace-nowrap">{prompt.text}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat on mobile */}
        <div className="glass-card m-4 p-4 flex flex-col h-[60vh]">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Brain className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-base font-semibold text-foreground">MarketPulse AI</h2>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="text-sm font-semibold text-foreground mb-2">PulseAI</h3>
                <p className="text-xs text-muted-foreground text-center">What would you like to analyze today?</p>
              </div>
            ) : (
              <>
                {messages.map((message) =>
                  message.type === "user" ? (
                    <div key={message.id} className="flex justify-end">
                      <div className="max-w-xs bg-primary text-white rounded-lg p-3 text-xs">{message.content}</div>
                    </div>
                  ) : (
                    <div key={message.id} className="flex justify-start">
                      <div className="max-w-xs glass-card p-3 rounded-lg text-xs text-foreground">
                        {message.isTyping ? (
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        )}
                      </div>
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="pt-3 border-t border-border flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask about markets..."
              className="flex-1 h-9 px-3 rounded-lg bg-[hsla(var(--input))] border border-[hsla(var(--glass-border))] text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="h-9 px-3 rounded-lg bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-white flex items-center gap-1 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
