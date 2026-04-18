import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function EnquiryView() {
    const [chat, setChat] = useState<any>(null);
    const [enquiry, setEnquiry] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    const fetchData = async () => {
        try {
            setLoading(true);

            const [enquiryRes, chatRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/enquiry/${id}`),
                axios.get(`${BASE_URL}/api/chat/${id}`)
            ]);

            setEnquiry(enquiryRes.data.data);
            setChat(chatRes.data.data);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


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
                                    <div className="h-10 w-10 border rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold">
                                        🤖
                                    </div>
                                )}

                                {/* Message Bubble */}
                                <div
                                    className={`max-w-[85%] px-4 py-2 rounded-md text-sm shadow-sm ${isUser
                                        ? "bg-blue-500 text-white rounded-br-none"
                                        : "bg-background border rounded-bl-none"
                                        }`}
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: (props) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                                            h2: (props) => <h2 className="text-lg font-semibold mt-3 mb-2" {...props} />,
                                            h3: (props) => <h3 className="text-md font-semibold mt-2 mb-1" {...props} />,

                                            p: (props) => <p className="mb-2 leading-relaxed text-[14px]" {...props} />,

                                            ul: (props) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                                            ol: (props) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                                            li: (props) => <li className="ml-1" {...props} />,

                                            strong: (props) => <strong className="font-semibold text-black dark:text-white" {...props} />,

                                            blockquote: (props) => (
                                                <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-600 dark:text-gray-300 my-2">
                                                    {props.children}
                                                </blockquote>
                                            ),

                                            a: (props) => (
                                                <a
                                                    className="text-blue-500 hover:underline break-all"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    {...props}
                                                />
                                            ),

                                            table: (props) => (
                                                <div className="overflow-x-auto my-3">
                                                    <table className="border border-gray-300 w-full text-sm" {...props} />
                                                </div>
                                            ),
                                            thead: (props) => <thead className="bg-gray-100 dark:bg-gray-800" {...props} />,
                                            th: (props) => <th className="border px-3 py-2 text-left font-semibold" {...props} />,
                                            td: (props) => <td className="border px-3 py-2" {...props} />,

                                            hr: () => <hr className="my-4 border-gray-300" />,

                                            code({ inlist, className, children }) {
                                                const match = /language-(\w+)/.exec(className || "");
                                                const codeText = String(children).trim();

                                                // 🔥 Code Block (like ChatGPT)
                                                if (!inlist) {
                                                    return (
                                                        <div className="my-3 rounded-xs overflow-hidden border bg-[#0d1117] text-white text-xs">
                                                            {/* Header */}
                                                            <div className="flex items-center justify-between px-3 py-1 bg-[#161b22] text-gray-400 text-[11px]">
                                                                <span>{match?.[1] || "code"}</span>

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

                                                // 🔹 Inline code
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
                    <p className="text-sm text-center mt-50 font-bold text-gray-400">
                        {loading ? ("Loading ...") : ("No messages found !")}
                    </p>
                )}
            </div>
        </section>
    );
}