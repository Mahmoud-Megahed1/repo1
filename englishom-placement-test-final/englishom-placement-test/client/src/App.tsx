import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import PublicQuestionInput from "@/pages/PublicQuestionInput";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TestProvider } from "./contexts/TestContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Results from "./pages/Results";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import QuestionInputPanel from "./pages/QuestionInputPanel";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <WouterRouter base="/test1">
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/test"} component={Test} />
        <Route path={"/results"} component={Results} />
        <Route path={"/admin"} component={AdminDashboard} />
        <Route path={"/admin/login"} component={AdminLogin} />
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
        switchable
      >
        <LanguageProvider>
          <TestProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </TestProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
