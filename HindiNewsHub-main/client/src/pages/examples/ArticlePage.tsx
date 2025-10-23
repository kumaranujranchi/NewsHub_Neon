import ArticlePage from "../ArticlePage";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function ArticlePageExample() {
  return (
    <ThemeProvider>
      <ArticlePage />
    </ThemeProvider>
  );
}
