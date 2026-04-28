import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="EMMYFAD" className="h-8 w-8" />
          <span className="text-lg font-bold text-primary tracking-tight">EMMYFAD</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/admin" className="ml-4">
            <Button variant="outline" size="sm">Admin Portal</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}