import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export default function EnquiryView() {
    const [enquiry, setEnquiry] = useState<any>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const { id } = useParams();

    const fetchEnquiry = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/chat/${id}`);
            setEnquiry(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEnquiry();
    }, []);

    // ✅ auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [enquiry]);

    return (
        <div className="p-4 w-full md:max-w-4xl mx-start">
            <div className="border rounded-md h-[600px] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-3 border-b font-semibold bg-gray-50">
                    Chat Conversation
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                    {enquiry?.messages?.length ? (
                        enquiry.messages.map((msg: any, i: number) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`px-3 py-2 rounded-md max-w-[95%] text-sm ${msg.role === "user"
                                            ? "bg-[#6096ff] text-white"
                                            : "bg-white border"
                                        }`}
                                >
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                    </ReactMarkdown>

                                    {/* timestamp */}
                                    <span className="block text-[10px] mt-1 opacity-70">
                                        {new Date(msg.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">No messages found</p>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
}