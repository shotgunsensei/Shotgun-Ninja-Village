import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Archive from "@/pages/Archive";
import Operators from "@/pages/Operators";
import Grid from "@/pages/Grid";
import Arsenal from "@/pages/Arsenal";
import Intel from "@/pages/Intel";
import Community from "@/pages/Community";
import Merch from "@/pages/Merch";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" as const } },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function Router() {
  const [location] = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Switch key={location}>
          <Route path="/">{() => <AnimatedPage><Home /></AnimatedPage>}</Route>
          <Route path="/archive">{() => <AnimatedPage><Archive /></AnimatedPage>}</Route>
          <Route path="/operators">{() => <AnimatedPage><Operators /></AnimatedPage>}</Route>
          <Route path="/grid">{() => <AnimatedPage><Grid /></AnimatedPage>}</Route>
          <Route path="/arsenal">{() => <AnimatedPage><Arsenal /></AnimatedPage>}</Route>
          <Route path="/intel">{() => <AnimatedPage><Intel /></AnimatedPage>}</Route>
          <Route path="/community">{() => <AnimatedPage><Community /></AnimatedPage>}</Route>
          <Route path="/merch">{() => <AnimatedPage><Merch /></AnimatedPage>}</Route>
          <Route>{() => <AnimatedPage><NotFound /></AnimatedPage>}</Route>
        </Switch>
      </AnimatePresence>
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
