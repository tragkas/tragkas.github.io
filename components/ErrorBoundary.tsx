"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || "An unexpected error occurred.",
    };
  }

  componentDidCatch(error: Error) {
    console.error("Application ErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex items-center justify-center p-8 bg-[#fafafa]">
          <div className="max-w-md w-full bg-white border border-neutral-200 rounded-xl p-6 text-center space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              Something went wrong
            </h2>
            <p className="text-sm text-neutral-600 break-words">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, message: "" })}
              className="px-4 py-2 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
