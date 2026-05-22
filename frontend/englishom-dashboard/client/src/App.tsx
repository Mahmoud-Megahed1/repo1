import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import LiveDashboard from "./pages/LiveDashboard";
import PublicLive from "./pages/PublicLive";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPublicStats from "./pages/AdminPublicStats";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <WouterRouter base="/dashboard">
      <Switch>
      <Route path={"\\"} component={Home} />
      <Route path={"/live"} component={PublicLive} />
      <Route path={"/dashboard"} component={LiveDashboard} />
      <Route path={"/admin/dashboard"} component={AdminDashboard} />
      <Route path={"/admin/public-stats"} component={AdminPublicStats} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
    </WouterRouter>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
