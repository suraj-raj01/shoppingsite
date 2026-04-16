import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bot, Code2, Copy, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import BASE_URL from "@/Config";
import { Input } from "@/components/ui/input";
import EnquiryForm from "./EnquiryForm";
import { toast } from "sonner";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

type Message = {
  [x: string]: string | number | Date;
  role: "user" | "assistant";
  content: string;
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [enquiry, setEnquiry] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

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
          `${BASE_URL}/api/chat/${enquiry._id || getSessionId()}`
        );
        // console.log(res.data,'dataa')
        if (res.data?.data?.messages?.length) {
          setMessages(res.data?.data.messages);
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
  const handleReset = async () => {
    setIsOpen(false);
    toast("Reset chat?", {
      description: "This will clear all your messages permanently.",
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            setLoading(true);

            // ✅ API call
            await axios.delete(`${BASE_URL}/api/chat/${enquiry?._id}`);

            // ✅ Clear storage
            localStorage.removeItem("enquiry");
            localStorage.removeItem("chat_session");

            // ✅ Reset state
            setEnquiry(null);
            setMessages([]);
            setInput("");
            toast.success("Chat reset successfully ✅");
          } catch (error) {
            console.error(error);
            toast.error("Failed to reset chat ❌");
          } finally {
            setLoading(false);
          }
        },
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Floating Button */}
      <DialogTrigger asChild >
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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl">
        <div className="flex flex-col h-[600px]">

          {/* 🔹 Header */}
          <div className="p-4 border-b bg-white flex justify-between items-center">
            <div>
              <p className="font-semibold text-base">
                {enquiry ? "Chat Assistant" : "Welcome 👋"}
              </p>

              <p className="text-xs text-gray-500">
                {enquiry
                  ? `Hi ${enquiry.name}`
                  : "Fill form to start chatting"}
              </p>
            </div>

            <div className="mr-5">
              {enquiry && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* 🔹 Body */}
          {!enquiry ? (
            <div className="flex-1 overflow-y-auto p-4">
              <EnquiryForm setEnquiry={setEnquiry} />
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

                {messages.map((msg, i) => {
                  const isUser = msg.role === "user";

                  return (
                    <div
                      key={i}
                      className={`flex ${isUser ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg text-sm max-w-[90%] shadow-sm ${isUser
                          ? "bg-[#6096ff] text-white rounded-br-none"
                          : "bg-white border rounded-bl-none"
                          }`}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: (props) => (
                              <p className="mb-2 leading-relaxed text-[14px]" {...props} />
                            ),

                            ul: (props) => (
                              <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />
                            ),

                            code({ className, children }) {
                              const match = /language-(\w+)/.exec(className || "");
                              const codeText = String(children).trim();

                              const isBlock = match || codeText.includes("\n");

                              // ✅ BLOCK CODE
                              if (isBlock) {
                                return (
                                  <div className="my-3 max-w-80 rounded-md overflow-hidden border bg-[#0d1117] text-white text-xs">

                                    {/* Header */}
                                    <div className="flex items-center justify-between px-3 py-1 bg-[#161b22] text-gray-400 text-[11px]">

                                      {/* LEFT: Icon + Language */}
                                      <div className="flex items-center gap-2">
                                        <Code2 size={14} />
                                        <span>{match?.[1] || "code"}</span>
                                      </div>

                                      {/* RIGHT: Copy */}
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(codeText);
                                          toast.success("Copied!");
                                        }}
                                        className="flex items-center gap-1 hover:text-white"
                                      >
                                        <Copy size={12} />
                                        Copy
                                      </button>
                                    </div>

                                    {/* Code */}
                                    <pre className="p-3 overflow-x-auto">
                                      <code>{codeText}</code>
                                    </pre>
                                  </div>
                                );
                              }

                              // ✅ INLINE CODE
                              return (
                                <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-[2px] rounded text-sm">
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>

                        {/* Time */}
                        <p
                          className={`text-[10px] -mt-1 ${isUser ? "text-blue-100" : "text-gray-400"
                            }`}
                        >
                          {new Date(enquiry ? (enquiry.createdAt) : (new Date())).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <p className="text-xs text-gray-400 animate-pulse">
                    Typing...
                  </p>
                )}

                <div ref={bottomRef} />
              </div>

              {/* 🔹 Input */}
              <div className="border-t p-3 bg-white flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 h-10"
                />

                <Button
                  onClick={handleSend}
                  disabled={loading}
                  className="h-10 bg-[#6096ff]"
                >
                  <Send size={18} />
                </Button>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 py-2">
            Made with ❤️ By SURAJ KUMAR
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}