import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <NavigationMenu orientation="vertical">
              <NavigationMenuList className="flex flex-col space-y-2">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    href="/"
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    href="/about"
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    href="/features"
                  >
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    href="/contact"
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    href="/faq"
                  >
                    FAQ
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-primary-foreground/80">
              <p>123 Service Street</p>
              <p>Sync City, SC 12345</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@servicesync.com</p>
            </address>
          </div>

          {/* Copyright and Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Instagram
              </a>
            </div>
            <p className="text-sm text-primary-foreground/80">
              © {currentYear} ServiceSync. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
