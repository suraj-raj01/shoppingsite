import {
    useEffect,
    useState
} from "react";

import { socket } from "@/lib/socket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
    user: string;
    text: string;
    time?: string;
}

function Chat() {
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // listen server event
        socket.on(
            "receive_message",
            (data: Message) => {
                setMessages(
                    (prev) => [...prev, data]
                );
            }
        );

        return () => {
            socket.off("receive_message");
        }
    }, []);

    const sendMessage = () => {
        const data: Message = {
            user: "Suraj",
            text: message,
            time: new Date().toLocaleTimeString()
        };
        socket.emit(
            "send_message",
            data
        );
        console.log(message)
        setMessage("");
    }

    return (
       <section className="flex items-center justify-end p-5 bg-gray-950">
            <div className="p-5 h-150 w-xl flex flex-col bg-white rounded-xl gap-5">
                <h2 className="font-bold uppercase"> Socket.IO Chat </h2>
                <div className="flex flex-col border rounded-md p-3 gap-2 max-w-xl h-100 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center justify-start">
                                <span className="font-bold bg-blue-700 text-white flex items-center justify-center rounded-full h-8 w-8">{msg.user[0]}</span>
                                <span className="font-bold">{msg.user.toUpperCase()}</span>
                            </div>
                            <span>{msg.text}</span>
                            <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center max-w-xl h-20">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="p-5"
                    />
                    <Button onClick={sendMessage} className="p-5">
                        Send
                    </Button>
                </div>
            </div>
       </section>
    )
}
export default Chat;