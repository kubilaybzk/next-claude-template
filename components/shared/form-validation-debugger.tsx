'use client';

import type { UseFormReturn, FieldValues } from 'react-hook-form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Bug } from '@phosphor-icons/react';

const isDev = process.env.NODE_ENV === 'development';

interface FormValidationDebuggerProps<T extends FieldValues = FieldValues> {
  methods: UseFormReturn<T>;
}

export function FormValidationDebugger<T extends FieldValues>({ methods }: FormValidationDebuggerProps<T>) {
  if (!isDev) return null;

  const { errors, isDirty, isValid, isSubmitting, touchedFields } = methods.formState;
  const errorEntries = Object.entries(errors);

  return (
    <Collapsible className="mt-4 rounded-lg border border-border bg-muted/50 p-3">
      <CollapsibleTrigger className="flex w-full items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
        <Bug className="size-4" />
        <span>Form Debug</span>
        <div className="ml-auto flex gap-1.5">
          <Badge variant={isValid ? 'default' : 'destructive'} className="text-[10px] px-1.5 py-0">
            {isValid ? 'Valid' : `${errorEntries.length} error${errorEntries.length !== 1 ? 's' : ''}`}
          </Badge>
          {isDirty && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">Dirty</Badge>
          )}
          {isSubmitting && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">Submitting</Badge>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {errorEntries.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-destructive">Errors:</p>
            {errorEntries.map(([field, error]) => (
              <p key={field} className="font-mono text-[10px] text-destructive">
                {field}: {(error as { message?: string })?.message ?? 'invalid'}
              </p>
            ))}
          </div>
        )}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground">Touched:</p>
          <p className="font-mono text-[10px] text-muted-foreground">
            {Object.keys(touchedFields).join(', ') || 'none'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground">Values:</p>
          <pre className="max-h-32 overflow-auto rounded bg-muted p-1.5 font-mono text-[10px] text-muted-foreground">
            {JSON.stringify(methods.watch(), null, 2)}
          </pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
