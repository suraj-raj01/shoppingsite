import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bot } from "lucide-react";

export default function ChatBot() {
  return (
    <Dialog >
      {/* ✅ Floating Button (Trigger) */}
      <DialogTrigger asChild>
        <div className="fixed bottom-5 right-5 z-50 cursor-pointer group">
          
          {/* Button */}
          <Button
            size="icon"
            className="rounded-full bg-[#6096ff] hover:bg-[#5089fa] shadow-lg h-12 w-12"
          >
            <Bot className="text-white" />
          </Button>

          {/* 🔴 Notification Dot */}
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
        </div>
      </DialogTrigger>

      {/* ✅ Dialog */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>🤖 Chat Assistant</DialogTitle>
        </DialogHeader>

        {/* Chat Body */}
        <div className="flex flex-col gap-3 h-[400px]">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto border rounded-md p-3 text-sm space-y-2">
            <p className="text-gray-500">
              👋 Hi! How can I help you today?
            </p>
          </div>

          {/* Input Area */}
          <div className="flex gap-2 items-center">
            <input
              placeholder="Type your message..."
              className="flex-1 border rounded-xs px-3 py-2 text-sm outline-none"
            />
            <Button className="rounded-xs">Send</Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}