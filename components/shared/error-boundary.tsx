'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Warning, Copy, ArrowClockwise } from '@phosphor-icons/react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showStack: boolean;
}

const isDev = process.env.NODE_ENV === 'development';

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, showStack: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, showStack: false });
  };

  private handleCopy = () => {
    const { error } = this.state;
    if (!error) return;
    const text = `${error.name}: ${error.message}\n${error.stack ?? ''}`;
    navigator.clipboard.writeText(text);
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    const { error, showStack } = this.state;
    const { name } = this.props;

    if (!isDev) {
      return (
        <Card className={cn('text-center', this.props.className)}>
          <CardContent className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Something went wrong{name ? ` in ${name}` : ''}.
            </p>
            <Button size="sm" onClick={this.handleReset}>
              <ArrowClockwise />
              Try again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Alert variant="destructive" className={cn(this.props.className)}>
        <Warning />
        <AlertTitle>Component Error{name ? `: ${name}` : ''}</AlertTitle>
        <AlertDescription>
          <p className="font-mono text-xs">
            {error?.name}: {error?.message}
          </p>

          {error?.stack && (
            <>
              <Button
                size="sm"
                variant="link"
                onClick={() => this.setState({ showStack: !showStack })}
                className="mt-2 h-auto p-0 text-xs"
              >
                {showStack ? 'Hide' : 'Show'} Stack Trace
              </Button>
              {showStack && (
                <pre className="mt-2 max-h-48 overflow-auto rounded bg-muted p-2 font-mono text-xs text-muted-foreground">
                  {error.stack}
                </pre>
              )}
            </>
          )}

          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={this.handleReset}>
              <ArrowClockwise />
              Try Again
            </Button>
            <Button size="sm" variant="outline" onClick={this.handleCopy}>
              <Copy />
              Copy Error
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
}
