import { Component, ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    console.error('Got derived state error', error)
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // good place to send details to sentry or datadog here
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f5" }}>
          <div style={{ textAlign: "center", padding: "20px", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <img height="300" src="https://www.elegantthemes.com/blog/wp-content/uploads/2020/08/000-http-error-codes.png" alt="Error" />
            <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>Oops! Something went wrong.</h1>
            <p style={{ fontSize: "16px", color: "#777" }}>{"We're sorry, but there seems to be an issue."}</p>
          </div>
        </div>)
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
