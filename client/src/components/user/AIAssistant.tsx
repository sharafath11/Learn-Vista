"use client"
import { useState, useEffect, useRef, useMemo } from "react"
import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, SendHorizonal } from "lucide-react"
import { Button } from "@/src/components/shared/components/ui/button"
import { Input } from "@/src/components/shared/components/ui/input"
import { ScrollArea } from "@/src/components/shared/components/ui/scroll-area"
import { Card, CardContent } from "@/src/components/shared/components/ui/card"
import Image from "next/image"
import { batmanAi } from "@/src/services/APImethods"

const CHAT_WINDOW_WIDTH = 350
const CHAT_WINDOW_HEIGHT = 500
const INITIAL_RIGHT_OFFSET = 24
const INITIAL_BOTTOM_OFFSET = 6

const BatmanAssistant = () => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { role: "batman", content: "I am Batman. Tell me your doubt... justice will be served." },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const res = await batmanAi.askDoubt(input)
      setIsLoading(false)

      if (res.ok) {
        const aiMessage = {
          role: "batman",
          content: res.data || "Justice is blind... and so is this AI. Try asking differently.",
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        setMessages((prev) => [...prev, { role: "batman", content: "Something’s wrong in Gotham. Try again later." }])
      }
    } catch (error) {
      setIsLoading(false)
      setMessages((prev) => [
        ...prev,
        { role: "batman", content: "An unexpected error occurred. The Joker must be involved." },
      ])
    }
  }

  const dragConstraints = useMemo(() => {
    const initialLeft = windowDimensions.width - CHAT_WINDOW_WIDTH - INITIAL_RIGHT_OFFSET
    const initialTop = windowDimensions.height - CHAT_WINDOW_HEIGHT - INITIAL_BOTTOM_OFFSET

    return {
      left: -initialLeft,
      right: windowDimensions.width - CHAT_WINDOW_WIDTH - initialLeft,
      top: -initialTop,
      bottom: windowDimensions.height - CHAT_WINDOW_HEIGHT - initialTop,
    }
  }, [windowDimensions])

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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-6 right-24 z-[60] w-[350px] h-[500px] bg-black text-white shadow-2xl flex flex-col rounded-xl overflow-hidden"
            drag
            dragConstraints={dragConstraints}
            dragElastic={0.2}
            dragMomentum={false}
          >
            <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-900 cursor-grab">
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
                className="rounded-full text-white hover:bg-gray-700"
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
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <Card
                      className={`px-4 py-2 text-sm max-w-[80%] rounded-3xl shadow-md ${
                        msg.role === "user" ? "bg-yellow-500 text-black" : "bg-gray-800 text-white"
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

            <form onSubmit={handleSend} className="p-4 border-t border-gray-700 bg-gray-900 flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask like a hero..."
                className="flex-1 rounded-full px-4 py-2 text-white bg-gray-800 border-gray-700 focus:border-yellow-500"
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
  )
}

export default BatmanAssistant
