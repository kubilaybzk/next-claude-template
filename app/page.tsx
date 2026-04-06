import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RocketLaunch, GitBranch, Palette } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Full Next.js Template',
  description: 'Production-ready Next.js 16 template with AI-assisted development workflow.',
};

export default function HomePage() {
  return (
    <div className="container mx-auto flex flex-1 flex-col items-center justify-center gap-8 py-16">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Full Next.js Template</h1>
        <p className="text-muted-foreground">
          Edit <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">app/page.tsx</code> to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RocketLaunch className="size-5" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Run /scaffold to create your first feature with types, services, and components.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="size-5" />
              Conventions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Check CLAUDE.md and PATTERNS.md for project rules and coding patterns.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="size-5" />
              Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              48+ shadcn/ui components ready to use. See .claude/REGISTRY.md for the full catalog.
            </p>
          </CardContent>
        </Card>
      </div>

      <Button nativeButton={false} render={<Link href="https://nextjs.org/docs" target="_blank" />}>
        Next.js Documentation
      </Button>
    </div>
  );
}
