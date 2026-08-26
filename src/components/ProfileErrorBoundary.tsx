import { Component, type ReactNode } from "react";

export class ProfileErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="h-full overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-xl rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
            <h1 className="text-xl font-semibold text-[var(--color-text)]">Profile</h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Profile details are unavailable right now. Try refreshing after the latest deployment finishes.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
