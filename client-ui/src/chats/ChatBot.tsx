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
import EnquiryForm from "./EnquiryForm";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [enquiry, setEnquiry] = useState<any>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ✅ Get/Create Session ID
  const getSessionId = () => {
    let id = localStorage.getItem("chat_session");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("chat_session", id);
    }
    return id;
  };

  // ✅ Load enquiry
  useEffect(() => {
    const enquiryData = localStorage.getItem("enquiry");
    if (enquiryData) {
      setEnquiry(JSON.parse(enquiryData));
    }
  }, []);

  // ✅ Fetch chat from DB
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/chat/${getSessionId()}`
        );

        if (res.data?.messages?.length) {
          setMessages(res.data.messages);
        } else {
          // ✅ fallback welcome message
          setMessages([
            {
              role: "assistant",
              content: `Hi ${enquiry.name}, how can I help you today? 😊`,
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load chat");

        // fallback message
        setMessages([
          {
            role: "assistant",
            content: `Hi ${enquiry.name}, how can I help you today? 😊`,
          },
        ]);
      }
    };

    if (enquiry) fetchMessages();
  }, [enquiry]);

  // ✅ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/chat`, {
        userId: enquiry._id,
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
          content: "⚠️ Server busy, please try again",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset chat
  const handleReset = () => {
    if (!confirm("Are you sure you want to reset chat?")) return;

    localStorage.removeItem("enquiry");
    localStorage.removeItem("chat_session");

    setEnquiry(null);
    setMessages([]);
    setInput("");
  };

  return (
    <Dialog>
      {/* Floating Button */}
      <DialogTrigger asChild>
        <div className="fixed bottom-5 right-5 z-50 cursor-pointer group">
          <Button
            size="icon"
            className="rounded-full bg-[#6096ff] hover:bg-[#5089fa] shadow-lg h-12 w-12"
          >
            <Bot className="text-white" />
          </Button>

          {/* Notification dot */}
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
        </div>
      </DialogTrigger>

      {/* Dialog */}
      <DialogContent className="sm:max-w-md rounded-md p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">
              {enquiry ? "Chat Assistant" : "Welcome to our Store 🛍️"}
            </p>
          </div>

          <DialogTitle className="text-xs text-gray-500 mt-1">
            {enquiry ? (
              <div className="flex justify-between items-center">
                <p>
                  🤖 Hi{" "}
                  <span className="font-semibold">{enquiry.name}</span>!
                </p>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs"
                >
                  Reset
                </Button>
              </div>
            ) : (
              <p>Please fill the enquiry form to start chatting.</p>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-125">
          {/* 🔥 Conditional UI */}
          {!enquiry ? (
           <div className="h-125">
              <EnquiryForm setEnquiry={setEnquiry} />
           </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm bg-gray-50">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                      }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-md max-w-[75%] ${msg.role === "user"
                          ? "bg-[#6096ff] text-white"
                          : "bg-white border"
                        }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <p className="text-xs text-gray-400 animate-pulse">
                    Thinking...
                  </p>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-3 flex">


                {/* suggested messages */}
                {/* <div className="grid grid-cols-4 absolute w-full bottom-23 py-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("Hi")}
                    className="rounded-none px-2"
                  >
                    Hi
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("How are you?")}
                    className="rounded-none w-full px-2"
                  >
                    How are you?
                  </Button>
                </div> */}

                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 rounded-none focus:ring-0 h-12 focus-visible:ring-0 focus-visible:border-1 "
                />

                <Button
                  onClick={handleSend}
                  disabled={loading}
                  className="rounded-none w-20 h-12 bg-[#6096ff]"
                >
                  Send
                </Button>
              </div>
            </>
          )}

          <div className="text-center pb-3 text-xs text-gray-400">
            Made with ❤️ by Suraj Kumar
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}