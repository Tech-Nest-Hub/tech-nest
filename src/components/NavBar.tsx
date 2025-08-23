import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

// Import dropdown components (assuming these are from your UI library)
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Import sheet/drawer components for mobile menu
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/technest" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/technest" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/technest" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/technest" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@technest" },
  ];

  // Navigation handler (would integrate with your router in a real app)
  const handleNavigation = (path:any) => {
    setCurrentPath(path);
    // In a real app, you would use your router here:
    // window.history.pushState({}, "", path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div onClick={() => handleNavigation("/")} className="cursor-pointer">
              <h1 className="text-2xl font-black font-montserrat gradient-text">Tech Nest</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.href);
                  }}
                  className={`px-3 py-2 text-sm font-medium font-open-sans transition-colors ${
                    currentPath === item.href
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-foreground hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Social Media Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 bg-transparent"
                >
                  Socials <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <DropdownMenuItem key={social.name} asChild>
                      <a href={social.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <Icon className="mr-2 h-4 w-4" />
                        {social.name}
                      </a>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Work With Us Button */}
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/contact");
              }}
            >
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                Work With Us
              </Button>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(item.href);
                      }}
                      className={`px-3 py-2 text-lg font-medium font-open-sans transition-colors ${
                        currentPath === item.href
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-foreground hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    >
                      {item.name}
                    </a>
                  ))}

                  <div className="pt-4 border-t border-border">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Follow Us</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {socialLinks.map((social) => {
                        const Icon = social.icon;
                        return (
                          <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-2 rounded-md hover:bg-muted transition-colors"
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {social.name}
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <a
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/contact");
                    }}
                  >
                    <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 mt-4 w-full">
                      Work With Us
                    </Button>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}