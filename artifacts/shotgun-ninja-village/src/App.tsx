import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Archive from "@/pages/Archive";
import Operators from "@/pages/Operators";
import Grid from "@/pages/Grid";
import Arsenal from "@/pages/Arsenal";
import Intel from "@/pages/Intel";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/archive" component={Archive} />
        <Route path="/operators" component={Operators} />
        <Route path="/grid" component={Grid} />
        <Route path="/arsenal" component={Arsenal} />
        <Route path="/intel" component={Intel} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
