import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const demoMessages: Omit<Message, "id" | "timestamp">[] = [
  {
    text: "👋 Welcome! I'm your digital assistant. How can I help you today?",
    isBot: true,
  },
  {
    text: "I need a WhatsApp bot for my business",
    isBot: false,
  },
  {
    text: "🚀 Great choice! I can help you with custom bot solutions. Would you like to:",
    isBot: true,
  },
];

const quickReplies = [
  "📋 See our services",
  "💰 Get pricing info",
  "🎮 Try the demo",
  "📞 Talk to human",
];

export default function WhatsAppBotDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (currentMessageIndex < demoMessages.length) {
      const timer = setTimeout(() => {
        const newMessage: Message = {
          ...demoMessages[currentMessageIndex],
          id: currentMessageIndex + 1,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setCurrentMessageIndex(currentMessageIndex + 1);
      }, currentMessageIndex === 0 ? 500 : 2000);

      return () => clearTimeout(timer);
    }
  }, [currentMessageIndex]);

  const handleQuickReply = (reply: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: reply,
      isBot: false,
      timestamp: new Date(),
    };

    const botResponse: Message = {
      id: messages.length + 2,
      text: `Thanks for selecting "${reply}"! Our actual bot has much more sophisticated responses. Would you like to see a live demo?`,
      isBot: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="overflow-hidden shadow-lg">
        {/* WhatsApp Header */}
        <CardHeader className="bg-primary text-primary-foreground p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <i className="fab fa-whatsapp text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium" data-testid="text-bot-name">Achek Bot Assistant</h3>
              <p className="text-sm opacity-90">Online</p>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="p-4 space-y-3 h-80 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  message.isBot
                    ? "bg-white text-gray-800 rounded-bl-md shadow-sm"
                    : "bg-primary text-primary-foreground rounded-br-md"
                }`}
                data-testid={`message-${message.isBot ? "bot" : "user"}-${message.id}`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}

          {/* Quick Reply Buttons */}
          {messages.length >= demoMessages.length && (
            <div className="space-y-2 pt-4">
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-md shadow-sm max-w-xs">
                  <p className="text-sm mb-2">Try these quick options:</p>
                  <div className="space-y-1">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="block w-full text-left bg-accent text-accent-foreground px-2 py-1 rounded text-xs hover:bg-accent/80 transition-colors"
                        data-testid={`button-quick-reply-${reply.replace(/[^\w\s]/gi, '').trim().toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <i className="fas fa-robot"></i>
            <span className="text-sm">Powered by Baileys & Custom AI</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
