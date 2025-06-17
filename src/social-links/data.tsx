import { FaDiscord } from "react-icons/fa"
import { Instagram, Facebook, Twitter, Youtube, MessageCircle, Send } from "lucide-react";


export const socialLinks = [
    {
        name: "Instagram",
        icon: <Instagram className="w-5 h-5" />,
      url: "https://www.instagram.com/_tech.nest_/",
        color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
        name: "Facebook",
        icon: <Facebook className="w-5 h-5" />,
      url: "https://www.facebook.com/people/Tech-Nest/61573879135057/",
        color: "bg-blue-600",
    },
    {
        name: "Twitter",
        icon: <Twitter className="w-5 h-5" />,
      url: "http://x.com/TechNest1159276",
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
        icon: <FaDiscord className="w-5 h-5" />,
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

export const mainLinks = [
    {
        title: "Tech Nest Discord Server",
        icon: <FaDiscord className="w-8 h-8 text-indigo-600" />,
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