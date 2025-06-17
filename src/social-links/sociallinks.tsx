import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Instagram, Facebook, Twitter, Youtube, MessageCircle, Send, MoreHorizontal, ExternalLink } from "lucide-react"

export default function Component() {
  const socialLinks = [
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: "#",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      url: "#",
      color: "bg-blue-600",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      url: "#",
      color: "bg-black",
    },
    {
      name: "YouTube",
      icon: <Youtube className="w-5 h-5" />,
      url: "#",
      color: "bg-red-600",
    },
    {
      name: "Discord",
      icon: <MessageCircle className="w-5 h-5" />,
      url: "#",
      color: "bg-indigo-600",
    },
    {
      name: "Telegram",
      icon: <Send className="w-5 h-5" />,
      url: "#",
      color: "bg-blue-500",
    },
  ]

  const mainLinks = [
    {
      title: "Tech Nest Discord Server",
      icon: <MessageCircle className="w-8 h-8 text-indigo-600" />,
      url: "#",
      description: "Join our community discussions",
    },
    {
      title: "Tech Nest Telegram",
      icon: <Send className="w-8 h-8 text-blue-500" />,
      url: "#",
      description: "Get instant updates and news",
    },
    {
      title: "YouTube",
      icon: <Youtube className="w-8 h-8 text-red-600" />,
      url: "#",
      description: "Watch our latest tech content",
    },
    {
      title: "Facebook",
      icon: <Facebook className="w-8 h-8 text-blue-600" />,
      url: "#",
      description: "Follow us for daily updates",
    },
    {
      title: "Instagram",
      icon: <Instagram className="w-8 h-8 text-pink-600" />,
      url: "#",
      description: "Behind the scenes content",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Tech Nest Logo" />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                TN
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tech Nest</h1>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            🚀 TechNest Community 📱 Dev Memes |<br />🤓 College & School Vibes 🎁 Giveaways
          </p>

          {/* Social Icons */}
          <div className="flex justify-center gap-3 mb-8">
            {socialLinks.map((social, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className={`w-12 h-12 rounded-full ${social.color} text-white hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg`}
                asChild
              >
                <a href={social.url} target="_blank" rel="noopener noreferrer">
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Links Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">Main Links</h2>

          {mainLinks.map((link, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer border-0 shadow-md"
            >
              <CardContent className="p-4">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">{link.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{link.description}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>© 2024 Tech Nest. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
