import React, { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";

import { Layout } from "@/components/layout/Layout";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const Home = lazy(() => import("@/pages/Home"));
const Archive = lazy(() => import("@/pages/Archive"));
const Operators = lazy(() => import("@/pages/Operators"));
const Grid = lazy(() => import("@/pages/Grid"));
const Arsenal = lazy(() => import("@/pages/Arsenal"));
const Intel = lazy(() => import("@/pages/Intel"));
const Community = lazy(() => import("@/pages/Community"));
const CommunityBoard = lazy(() => import("@/pages/CommunityBoard"));
const CommunityTopic = lazy(() => import("@/pages/CommunityTopic"));
const CommunityOperator = lazy(() => import("@/pages/CommunityOperator"));
const Account = lazy(() => import("@/pages/Account"));
const Merch = lazy(() => import("@/pages/Merch"));
const Legal = lazy(() => import("@/pages/Legal"));
const Alignment = lazy(() => import("@/pages/Alignment"));
const NotFound = lazy(() => import("@/pages/not-found"));

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.12, ease: "easeIn" as const },
  },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[60dvh] flex items-center justify-center"
    >
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest animate-pulse">
        Loading transmission...
      </p>
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <AnimatePresence mode="wait">
            <Switch key={location}>
              <Route path="/">
                {() => (
                  <AnimatedPage>
                    <Home />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/archive">
                {() => (
                  <AnimatedPage>
                    <Archive />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/operators">
                {() => (
                  <AnimatedPage>
                    <Operators />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/grid">
                {() => (
                  <AnimatedPage>
                    <Grid />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/arsenal">
                {() => (
                  <AnimatedPage>
                    <Arsenal />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/intel">
                {() => (
                  <AnimatedPage>
                    <Intel />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/community">
                {() => (
                  <AnimatedPage>
                    <Community />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/community/topic/:id">
                {() => (
                  <AnimatedPage>
                    <CommunityTopic />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/community/operator/:callsign">
                {() => (
                  <AnimatedPage>
                    <CommunityOperator />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/community/:slug">
                {() => (
                  <AnimatedPage>
                    <CommunityBoard />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/account">
                {() => (
                  <AnimatedPage>
                    <Account />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/merch">
                {() => (
                  <AnimatedPage>
                    <Merch />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/legal">
                {() => (
                  <AnimatedPage>
                    <Legal />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/legal/:section">
                {() => (
                  <AnimatedPage>
                    <Legal />
                  </AnimatedPage>
                )}
              </Route>
              <Route path="/alignment">
                {() => (
                  <AnimatedPage>
                    <Alignment />
                  </AnimatedPage>
                )}
              </Route>
              <Route>
                {() => (
                  <AnimatedPage>
                    <NotFound />
                  </AnimatedPage>
                )}
              </Route>
            </Switch>
          </AnimatePresence>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
