import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Separator } from "@/components/ui/separator";
// import { Separator } from "@/components/ui/separator";

export default function EnquiryView() {
    const [chat, setChat] = useState<any>(null);
    const [enquiry, setEnquiry] = useState<any>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const { id } = useParams();

    const fetchEnquiry = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/enquiry/${id}`);
            setEnquiry(res.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchChats = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/chat/${id}`);
            setChat(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchChats();
        fetchEnquiry();
    }, []);

    // ✅ auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    return (
        <section className="">
            <div className="flex px-5 sticky top-16 bg-card items-center py-3 justify-between">
                <h1 className="font-bold text-xl">Chats <p className="text-xs font-normal -mt-1 text-gray-400">Chat conversation</p></h1>
                <div className="flex items-center gap-2">
                    {
                        <div className="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                            {enquiry?.name?.[0] || "U"}
                        </div>
                    }
                    <Separator
                        orientation="vertical"
                        className="data-[orientation=vertical]:h-8 data-[orientation=vertical]:w-0.5" />
                    <div>
                        <p className="font-bold">{enquiry?.name}</p>
                        <p className="tex-xs -mt-1">{enquiry?.email}</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 min-h-screen overflow-y-auto p-4 space-y-4 bg-muted">
                {chat?.messages?.length ? (
                    chat.messages.map((msg: any, i: number) => {
                        const isUser = msg.role === "user";

                        return (
                            <div
                                key={i}
                                className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"
                                    }`}
                            >
                                {/* Avatar (Left side for admin) */}
                                {!isUser && (
                                    <div className="h-10 w-10 border rounded-full bg-white flex items-center justify-center text-xs font-bold">
                                        🤖
                                    </div>
                                )}

                                {/* Message Bubble */}
                                <div
                                    className={`max-w-[75%] px-4 py-2 rounded-md text-sm shadow-sm ${isUser
                                        ? "bg-blue-500 text-white rounded-br-none"
                                        : "bg-background border rounded-bl-none"
                                        }`}
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>

                                    {/* Time */}
                                    <div
                                        className={`text-[10px] mt-1 ${isUser ? "text-blue-100" : "text-gray-400"
                                            }`}
                                    >
                                        {new Date(msg.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>

                                {/* Avatar (Right side for user) */}
                                {isUser && (
                                    <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                                        {enquiry?.name?.[0] || "U"}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-center mt-50 font-bold text-gray-400">No messages found !</p>
                )}
            </div>
        </section>
    );
}