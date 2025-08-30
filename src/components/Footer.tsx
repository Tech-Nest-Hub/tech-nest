import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  // In a real app, you would get this from your router
  const [currentPath, setCurrentPath] = useState("/");

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/people/Tech-Nest/61573879135057/" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/technest" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/technest" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/technest" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@technest" },
  ];

  const quickLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ];

  // Navigation handler (would integrate with your router in a real app)
  const handleNavigation = (path: any) => {
    setCurrentPath(path);
    // In a real app, you would use your router here:
    // window.history.pushState({}, "", path);
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div onClick={() => handleNavigation("/")} className="cursor-pointer">
                <h2 className="text-2xl font-black font-montserrat bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tech Nest</h2>
              </div>
              <p className="text-muted-foreground font-open-sans">
                Empowering businesses with cutting-edge technology solutions. 
                We turn your digital dreams into reality.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-montserrat">Navigation</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(item.href);
                      }}
                      className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-open-sans"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-montserrat">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(item.href);
                      }}
                      className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-open-sans"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-montserrat">Get In Touch</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="font-open-sans">hello@technest.com</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="font-open-sans">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="font-open-sans">San Francisco, CA</span>
                </div>
              </div>
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/contact");
                }}
              >
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 w-full">
                  Work With Us
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground font-open-sans">
              © 2025 Tech Nest. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/privacy");
                }}
                className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-open-sans"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/terms");
                }}
                className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-open-sans"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>


    </footer>
  );
}