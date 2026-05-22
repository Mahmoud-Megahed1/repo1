import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocalizationProvider } from "./contexts/LocalizationContext";
import ReadingProgressBar from "./components/ReadingProgressBar";
import Home from "./pages/Home";
import BlogHome from "./pages/blog/BlogHome";
import BlogArticle from "./pages/blog/BlogArticle";
import BlogCategory from "./pages/blog/BlogCategory";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Favorites from "./pages/blog/Favorites";
import { useAuth } from "@/_core/hooks/useAuth";

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      {/* More specific routes first */}
      <Route path="/blog/favorites" component={Favorites} />
      <Route path="/blog/category/:slug" component={BlogCategory} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/blog" component={BlogHome} />
      {user?.role === "admin" && <Route path="/admin" component={AdminDashboard} />}
      {/* Home page last */}
      <Route path={""} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <LocalizationProvider>
          <TooltipProvider>
            <ReadingProgressBar />
            <Toaster />
            <Router />
          </TooltipProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;