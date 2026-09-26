import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            background: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            margin: "20px",
            borderRadius: "5px",
            fontFamily: "sans-serif",
          }}
        >
          <h2>Something went wrong in the UI.</h2>
          <details style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              Click for error details
            </summary>
            <br />
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
