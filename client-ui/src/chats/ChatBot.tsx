import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import BASE_URL from "@/Config";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ✅ session id (important)
  const getSessionId = () => {
    let id = localStorage.getItem("chat_session");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("chat_session", id);
    }
    return id;
  };

  // ✅ auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ send message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/chat`, {
        sessionId: getSessionId(),
        message: input,
      });

      const botMessage: Message = {
        role: "assistant",
        content: res.data.response,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Something went wrong",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog defaultOpen={false}>
      {/* Floating Button */}
      <DialogTrigger asChild>
        <div className="fixed bottom-5 right-5 z-50 cursor-pointer group">
          <Button
            size="icon"
            className="rounded-full bg-[#6096ff] hover:bg-[#5089fa] shadow-lg h-12 w-12"
          >
            <Bot className="text-white" />
          </Button>

          {/* Notification Dot */}
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
        </div>
      </DialogTrigger>

      {/* Dialog */}
      <DialogContent className="sm:max-w-md rounded-md p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>🤖 Chat Assistant</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[450px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm bg-gray-50">
            {messages.length === 0 && (
              <p className="text-gray-500 text-center">
                👋 Hi! How can I help you today?
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    px-3 py-2 rounded-md max-w-[75%]
                    ${
                      msg.role === "user"
                        ? "bg-[#6096ff] text-white"
                        : "bg-white border"
                    }
                  `}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <p className="text-xs text-gray-400">Thinking...</p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-0">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border rounded-xs px-3 py-2 text-sm outline-none"
            />
            <Button
              onClick={handleSend}
              disabled={loading}
              className="rounded-xs w-20"
            >
              Send
            </Button>
          </div>
         <div className="flex items-center justify-center pb-4">
          <p className="text-xs text-gray-400">Made with ❤️ by Suraj Kumar</p>
         </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}