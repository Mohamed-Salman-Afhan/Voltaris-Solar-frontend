import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Github,
  MapPin,
  Phone,
  Mail,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-background pt-16 pb-8 font-[Inter] text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Zap className="h-6 w-6 fill-current" />
              </div>
              <span className="text-xl font-bold text-primary">
                Voltaris Solar
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Revolutionizing solar home management through advanced real-time
              monitoring and predictive insights.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Github].map((Icon, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Zap className="h-5 w-5 text-accent" />
              Solutions
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
              {[
                "Real-time Monitoring",
                "Predictive Analytics",
                "Remote Diagnostics",
                "Performance Optimization",
                "Instant Alerts",
                "Maintenance Planning",
              ].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer transition-colors hover:text-primary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="mb-6 text-lg font-semibold text-foreground">
              Resources
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
              {[
                "Documentation",
                "API Reference",
                "Case Studies",
                "White Papers",
                "Blog",
                "Support Center",
              ].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer transition-colors hover:text-primary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch Column */}
          <div className="flex flex-col gap-6">
            <h4 className="mb-2 text-lg font-semibold text-foreground">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <span>
                  123 Innovation Drive
                  <br />
                  Energy Tech Park
                  <br />
                  Copenhagen, Denmark
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-accent" />
                <span>+45 33 22 11 00</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <span>contact@voltarissolar.com</span>
              </div>
            </div>

            <div className="mt-2">
              <p className="mb-4 text-sm font-medium text-foreground">
                Stay Updated
              </p>
              <div className="flex flex-col gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-muted"
                />
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <div className="flex gap-6">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Cookie Policy",
              "Accessibility",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-primary hover:underline"
              >
                {item}
              </a>
            ))}
          </div>
          <p>© 2026 Voltaris Solar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
