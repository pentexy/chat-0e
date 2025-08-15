"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, MoreVertical } from "lucide-react"

// Mock messages data
const mockMessages = []

// Mock users data
const mockUsers = []

export default function ChatView() {
  const [currentUser, setCurrentUser] = useState<string>("")
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const params = useParams()
  const chatUsername = params.username as string

  const chatUser = mockUsers.find((user) => user.username === chatUsername)

  useEffect(() => {
    const username = localStorage.getItem("chatUsername")
    if (!username) {
      router.push("/")
      return
    }
    setCurrentUser(username)
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      sender: "me",
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sent: true,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate typing indicator and response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const response = {
        id: messages.length + 2,
        sender: chatUsername,
        content: "Thanks for your message! This is a demo response.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sent: false,
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  if (!currentUser || !chatUser) return null

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <Button variant="ghost" size="sm" onClick={() => router.push("/chat")} className="mr-3 hover:bg-gray-100">
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
              {chatUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {chatUser.online && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </div>

        <div className="ml-3 flex-1">
          <h2 className="font-semibold text-gray-900">{chatUser.name}</h2>
          <p className="text-sm text-green-600">{chatUser.online ? "Online" : "Offline"}</p>
        </div>

        <Button variant="ghost" size="sm" className="hover:bg-gray-100">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 chat-gradient">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex message-fade-in ${message.sent ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                  message.sent ? "chat-bg-blue text-white rounded-br-md" : "bg-white text-gray-900 rounded-bl-md"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.sent ? "text-blue-100" : "text-gray-500"}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 px-4 py-2 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dots"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full typing-dots"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full typing-dots"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="chat-bg-blue hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 disabled:transform-none"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
