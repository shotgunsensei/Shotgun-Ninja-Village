import React from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (typeof console !== "undefined") {
      console.error("[ErrorBoundary]", error, info);
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        role="alert"
        className="min-h-[100dvh] flex items-center justify-center bg-background text-foreground px-4"
      >
        <div className="max-w-md w-full border border-primary/40 bg-card/40 p-6 backdrop-blur">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-primary" size={22} />
            <h2 className="font-display text-2xl uppercase tracking-widest text-white">
              Signal Lost
            </h2>
          </div>
          <p className="font-mono text-sm text-muted-foreground mb-5">
            The console encountered an unexpected fault. Reset the link or return to base.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={this.handleReload}
              className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-4 py-2 font-display text-sm uppercase tracking-widest"
            >
              Reset Link
            </button>
            <a
              href="/"
              className="clip-diagonal border border-primary/50 text-primary hover:bg-primary/10 px-4 py-2 font-display text-sm uppercase tracking-widest bg-background/50"
            >
              Return to Base
            </a>
          </div>
          {this.state.error?.message && (
            <p className="mt-4 font-mono text-[10px] text-muted-foreground/60 break-all">
              {this.state.error.message}
            </p>
          )}
        </div>
      </div>
    );
  }
}
