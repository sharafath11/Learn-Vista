"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { batmanAi } from "@/src/services/APImethods";

const BatmanAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "batman",
      content: "I am Batman. Tell me your doubt... justice will be served."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const res = await batmanAi.askDoubt(input);
    setIsLoading(false);

    if (res.ok) {
      const aiMessage = {
        role: "batman",
        content:
          res.data ||
          "Justice is blind... and so is this AI. Try asking differently."
      };
      setMessages((prev) => [...prev, aiMessage]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "batman",
          content: "Something’s wrong in Gotham. Try again later."
        }
      ]);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full overflow-hidden hover:scale-105 transition-transform duration-300"
      >
        <Image
          src="/images/batman.png"
          alt="Batman Assistant"
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-black text-white shadow-2xl z-[60] flex flex-col rounded-l-3xl overflow-hidden"
          >
            <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-900">
              <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
  <Image
    src="/images/batman.png"
    alt="Batman Logo"
    width={24}
    height={24}
    className="rounded-full object-contain"
  />
  Batman Assistant
</h2>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white"
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>

            <ScrollArea className="relative flex-1 px-4 py-3 space-y-4 bg-gray-950 overflow-y-auto">
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
                <Image
                  src="/images/batman.png"
                  alt="Batman Background"
                  width={220}
                  height={220}
                  className="object-contain"
                />
              </div>
              <div className="relative z-10 flex flex-col space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <Card
                      className={`px-4 py-2 text-sm max-w-[80%] rounded-3xl shadow-md ${
                        msg.role === "user"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      <CardContent className="p-0">{msg.content}</CardContent>
                    </Card>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-center">
                    <video
                      src="/videos/batmangif.mp4"
                      width={120}
                      height={120}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="rounded-2xl shadow-xl"
                    />
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <form
              onSubmit={handleSend}
              className="p-4 border-t border-gray-700 bg-gray-900 flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask like a hero..."
                className="flex-1 rounded-full px-4 py-2 text-white"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-yellow-500 text-black hover:bg-yellow-400"
                disabled={isLoading}
              >
                <SendHorizonal size={18} />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BatmanAssistant;
