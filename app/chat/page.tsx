"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, MessageCircle } from "lucide-react"

// Mock users data
const mockUsers = []

export default function ChatDashboard() {
  const [currentUser, setCurrentUser] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const router = useRouter()

  useEffect(() => {
    const username = localStorage.getItem("chatUsername")
    if (!username) {
      router.push("/")
      return
    }
    setCurrentUser(username)
  }, [router])

  useEffect(() => {
    const filtered = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [searchQuery])

  const handleUserClick = (username: string) => {
    router.push(`/chat/${username}`)
  }

  if (!currentUser) return null

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel - User List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chats</h2>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user.username)}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-[1.02] border-l-4 border-transparent hover:border-blue-500"
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {user.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>

              <div className="ml-3 flex-1">
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Empty State */}
      <div className="flex-1 chat-gradient flex items-center justify-center">
        <div className="text-center animate-pulse">
          <MessageCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Select a conversation</h3>
          <p className="text-gray-500">Choose someone from your contacts to start chatting</p>
        </div>
      </div>
    </div>
  )
}
