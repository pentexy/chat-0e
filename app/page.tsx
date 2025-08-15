"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function UsernameSetup() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    // Store username in localStorage for demo purposes
    localStorage.setItem("chatUsername", username.trim())

    // Simulate loading and then navigate
    setTimeout(() => {
      router.push("/chat")
    }, 500)
  }

  return (
    <div className="min-h-screen chat-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background circles */}
      <div className="floating-circle w-32 h-32 top-10 left-10 animation-delay-0"></div>
      <div className="floating-circle w-24 h-24 top-32 right-20 animation-delay-1000"></div>
      <div className="floating-circle w-40 h-40 bottom-20 left-1/4 animation-delay-2000"></div>
      <div className="floating-circle w-20 h-20 bottom-32 right-10 animation-delay-3000"></div>

      <Card className="w-full max-w-md p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome to Chat</h1>
          <p className="text-gray-600">Enter your username to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full h-12 text-lg chat-bg-blue hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 disabled:transform-none"
          >
            {isLoading ? "Getting Started..." : "Get Started"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
