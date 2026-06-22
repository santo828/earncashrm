"use client";

import { Component, ReactNode } from "react";

interface State {
  hasError: boolean;
  error?: Error;
}

export class ViewErrorBoundary extends Component<{ children: ReactNode; name: string }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ViewErrorBoundary:${this.props.name}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E53935]/15 flex items-center justify-center mx-auto mb-4 text-[#E53935]">
            ⚠️
          </div>
          <p className="font-bold text-lg mb-2">View Error: {this.props.name}</p>
          <pre className="text-xs text-left text-[#ff6b6b] bg-black/30 p-4 rounded-xl overflow-auto max-h-60 whitespace-pre-wrap">
            {this.state.error?.message || "Unknown error"}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-4 px-4 py-2 rounded-xl bg-[#E53935] text-white text-sm font-bold"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
