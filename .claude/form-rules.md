---
globs: ["**/*Form*", "**/*form*", "**/steps/**", "**/validations/**", "**/*.schema.ts", "**/*.validation.ts"]
description: react-hook-form + zod pattern'leri, step wizard, validation schema kuralları
alwaysApply: false
---

# Form Rules

## Stack: react-hook-form + zod (only)

- No other form library allowed
- Schema type inference: `z.infer<typeof schema>`
- Resolver: `@hookform/resolvers/zod`

## Schema Location

- Path: `features/{name}/validations/{schema-name}-schema.ts`
- Every schema file exports: zod schema + inferred type
- Every field must have a default value

```tsx
// features/users/validations/create-user-schema.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'user']),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const createUserDefaults: CreateUserInput = {
  name: '',
  email: '',
  role: 'user',
};
```

## Single Form Pattern

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, createUserDefaults, type CreateUserInput } from '@/features/users/validations/create-user-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { FormValidationDebugger } from '@/components/shared/form-validation-debugger';
import { toast } from 'sonner';

export function CreateUserForm() {
  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: createUserDefaults,
  });

  const onSubmit = methods.handleSubmit(
    (data) => {
      // onValid
      toast.success('User created');
    },
    (errors) => {
      // onInvalid — do NOT use toast for validation errors
    },
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field>
        <Label htmlFor="name">Name</Label>
        <Input id="name" aria-describedby="name-error" {...methods.register('name')} />
        {methods.formState.errors.name && (
          <p id="name-error" className="text-xs text-destructive">{methods.formState.errors.name.message}</p>
        )}
      </Field>

      <Field>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" aria-describedby="email-error" {...methods.register('email')} />
        {methods.formState.errors.email && (
          <p id="email-error" className="text-xs text-destructive">{methods.formState.errors.email.message}</p>
        )}
      </Field>

      <Button type="submit" disabled={methods.formState.isSubmitting}>
        {methods.formState.isSubmitting && <Spinner />}
        Create User
      </Button>

      <FormValidationDebugger methods={methods} />
    </form>
  );
}
```

## Multi-Step Form

- Each step = separate component in `steps/` folder
- Each step = separate zod schema in `validations/` folder
- Step state managed with `useState` in orchestrator (Redux only if requested)
- Step component receives `methods: UseFormReturn<StepInput>` as prop

```tsx
// features/onboarding/components/onboarding-wizard.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StepOne } from '@/features/onboarding/components/steps/step-one';
import { StepTwo } from '@/features/onboarding/components/steps/step-two';
import { stepOneSchema, stepOneDefaults, type StepOneInput } from '@/features/onboarding/validations/step-one-schema';
import { stepTwoSchema, stepTwoDefaults, type StepTwoInput } from '@/features/onboarding/validations/step-two-schema';
import { FormValidationDebugger } from '@/components/shared/form-validation-debugger';

const steps = [
  { schema: stepOneSchema, defaults: stepOneDefaults, component: StepOne },
  { schema: stepTwoSchema, defaults: stepTwoDefaults, component: StepTwo },
];

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const currentConfig = steps[currentStep];

  const methods = useForm({
    resolver: zodResolver(currentConfig.schema),
    defaultValues: currentConfig.defaults,
  });

  const StepComponent = currentConfig.component;

  const handleNext = methods.handleSubmit(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Final submit
    }
  });

  return (
    <form onSubmit={handleNext}>
      <StepComponent methods={methods} />
      <FormValidationDebugger methods={methods} />
    </form>
  );
}
```

```tsx
// features/onboarding/components/steps/step-one.tsx
import type { UseFormReturn } from 'react-hook-form';
import type { StepOneInput } from '@/features/onboarding/validations/step-one-schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field } from '@/components/ui/field';

interface StepOneProps {
  methods: UseFormReturn<StepOneInput>;
}

export function StepOne({ methods }: StepOneProps) {
  return (
    <Field>
      <Label htmlFor="name">Name</Label>
      <Input id="name" aria-describedby="name-error" {...methods.register('name')} />
      {methods.formState.errors.name && (
        <p id="name-error" className="text-xs text-destructive">{methods.formState.errors.name.message}</p>
      )}
    </Field>
  );
}
```

## Validation Display Rules

- Field-level errors: inline `<p id="{field}-error" className="text-xs text-destructive">` below field
- Link error to input via `aria-describedby="{field}-error"` for accessibility
- Never show form validation errors via toast — toast is for mutation results only
- Add `<FormValidationDebugger methods={methods} />` as last child of every form

## Forbidden

- Mixing uncontrolled inputs with react-hook-form
- Forms without a zod schema
- Inline schema definitions (always extract to validations/ folder)
