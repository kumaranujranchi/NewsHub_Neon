import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import ArticlePage from "@/pages/ArticlePage";
import SearchPage from "@/pages/SearchPage";
import LoginPage from "@/pages/LoginPage";
import CMSDashboard from "@/pages/CMSDashboard";
import CMSArticleEditor from "@/pages/CMSArticleEditor";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/article/:slug" component={ArticlePage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/cms" component={CMSDashboard} />
      <Route path="/cms/article/:id" component={CMSArticleEditor} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
