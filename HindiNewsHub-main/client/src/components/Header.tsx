import { Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { categories } from "@shared/categories";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  const handleSearchClick = () => {
    navigate("/search");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/">
            <div className="flex items-center gap-2" data-testid="link-home">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-primary cursor-pointer">आपकासमाचार</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  विश्वसनीय हिंदी समाचार
                </p>
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {categories.map((category) => (
            <Link key={category.urlSlug} href={`/category/${category.urlSlug}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                data-testid={`link-category-${category.urlSlug}`}
              >
                {category.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchClick}
            data-testid="button-search"
          >
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          {user ? (
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-user-logout"
              onClick={handleLogout}
              title={`${user.firstName} ${user.lastName}`}
            >
              <User className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-user-login"
              onClick={handleLogin}
            >
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="flex flex-col p-4 gap-2">
            {categories.map((category) => (
              <Link key={category.urlSlug} href={`/category/${category.urlSlug}`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-category-${category.urlSlug}`}
                >
                  {category.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
