import { FaDiscord, FaLinkedin, } from "react-icons/fa"
import { Send } from "lucide-react";
import { BsFacebook, BsInstagram, BsTelegram, BsYoutube } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";


export const socialLinks = [
  {
    name: "Instagram",
    icon: <BsInstagram className="w-5 h-5" />,
    url: "https://www.instagram.com/_tech.nest__/",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    name: "Facebook",
    icon: <BsFacebook className="w-5 h-5" />,
    url: "https://www.facebook.com/people/Tech-Nest/61573879135057/",
    color: "bg-blue-600",
  },
  {
    name: "Twitter",
    icon: <FaXTwitter className="w-5 h-5" />,
    url: "http://x.com/TechNest1159276",
    color: "bg-black",
  },
  {
    name: "YouTube",
    icon: <BsYoutube className="w-5 h-5" />,
    url: "https://www.youtube.com/@technest-0",
    color: "bg-red-600",
  },
  {
    name: "Discord",
    icon: <FaDiscord className="w-5 h-5" />,
    url: "https://discord.gg/su4PeRgjeq",
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
    url: "https://discord.gg/su4PeRgjeq",
    description: "Join our community for free IT course",
  },
  {
    title: "Tech Nest Telegram",
    icon: <BsTelegram className="w-8 h-8 text-blue-500" />,
    url: "https://t.me/+PVAyjZ9egO4xODJl",
    description: "Get promocodes for free IT course",
  },
  {
    title: "YouTube",
    icon: <BsYoutube className="w-8 h-8 text-red-600" />,
    url: "https://www.youtube.com/@technest-0",
    description: "Watch our podcasts",
  },
  {
    title: "Facebook",
    icon: <BsFacebook className="w-8 h-8 text-blue-600" />,
    url: "https://www.facebook.com/people/Tech-Nest/61573879135057/",
    description: "Follow us for social media updates",
  },
  {
    title: "Instagram",
    icon: <BsInstagram className="w-8 h-8 text-pink-600" />,
    url: "https://www.instagram.com/_tech.nest__/",
    description: "Behind the scenes content and memes",
  },
  {
    title: "Twitter",
    icon: <FaXTwitter className="w-8 h-8 text-black" />,
    url: "http://x.com/TechNest1159276",
    description: "Follow to join the giveaways and more",
  },
  {
    title: "Linkedin",
    icon: <FaLinkedin className="w-8 h-8 text-blue-500" />,
    url: "https://www.linkedin.com/company/tech-nest-hub",
    description: "Follow our company for employement opportunities",
  },
]