import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // you could also send this to analytics
    console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100 p-6">
          <div className="max-w-2xl w-full bg-neutral-800 p-6 rounded-lg border border-neutral-700">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <pre className="text-xs text-neutral-300 whitespace-pre-wrap">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
