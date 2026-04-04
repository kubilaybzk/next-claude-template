# Component Registry

> **Claude: Read this file before creating any UI component.** Use existing components instead of raw HTML/Tailwind. Never re-implement what already exists.

## shadcn/ui Components (`@/components/ui/`)

Never write raw `<button>`, `<input>`, `<table>`, etc. Use these instead:

| Component | Use For | Import |
|-----------|---------|--------|
| `Button` | All clickable actions, links (use `render={<Link />}`) | `@/components/ui/button` |
| `Input` | Text inputs | `@/components/ui/input` |
| `Textarea` | Multi-line text | `@/components/ui/textarea` |
| `Select` | Dropdowns | `@/components/ui/select` |
| `Checkbox` | Toggle options | `@/components/ui/checkbox` |
| `RadioGroup` | Single choice from options | `@/components/ui/radio-group` |
| `Switch` | On/off toggles | `@/components/ui/switch` |
| `Label` | Form labels | `@/components/ui/label` |
| `Field` | Form field wrapper (label + input + error) | `@/components/ui/field` |
| `Card` | Content containers | `@/components/ui/card` |
| `Alert` | Error/warning/info messages | `@/components/ui/alert` |
| `Badge` | Status indicators, tags | `@/components/ui/badge` |
| `Table` | Data tables | `@/components/ui/table` |
| `Dialog` | Modals | `@/components/ui/dialog` |
| `Sheet` | Side panels | `@/components/ui/sheet` |
| `Drawer` | Bottom drawers (mobile) | `@/components/ui/drawer` |
| `DropdownMenu` | Action menus | `@/components/ui/dropdown-menu` |
| `ContextMenu` | Right-click menus | `@/components/ui/context-menu` |
| `Tabs` | Tab navigation | `@/components/ui/tabs` |
| `Accordion` | Collapsible sections | `@/components/ui/accordion` |
| `Tooltip` | Hover info | `@/components/ui/tooltip` |
| `Popover` | Click-triggered floating content | `@/components/ui/popover` |
| `HoverCard` | Hover-triggered preview | `@/components/ui/hover-card` |
| `Pagination` | Page navigation | `@/components/ui/pagination` |
| `Breadcrumb` | Breadcrumb navigation | `@/components/ui/breadcrumb` |
| `NavigationMenu` | Top nav links | `@/components/ui/navigation-menu` |
| `Sidebar` | App sidebar layout | `@/components/ui/sidebar` |
| `Separator` | Dividers | `@/components/ui/separator` |
| `ScrollArea` | Custom scrollbars | `@/components/ui/scroll-area` |
| `Skeleton` | Loading placeholders | `@/components/ui/skeleton` |
| `Spinner` | Loading spinner (client only) | `@/components/ui/spinner` |
| `Progress` | Progress bars | `@/components/ui/progress` |
| `Slider` | Range inputs | `@/components/ui/slider` |
| `Calendar` | Date picker calendar | `@/components/ui/calendar` |
| `InputOTP` | OTP/verification codes | `@/components/ui/input-otp` |
| `Combobox` | Searchable select | `@/components/ui/combobox` |
| `Command` | Command palette (cmdk) | `@/components/ui/command` |
| `Sonner/Toaster` | Toast notifications (already in providers) | `sonner` → `toast()` |
| `Resizable` | Resizable panels | `@/components/ui/resizable` |
| `Collapsible` | Expandable sections | `@/components/ui/collapsible` |
| `Toggle` | Toggle buttons | `@/components/ui/toggle` |
| `ToggleGroup` | Grouped toggles | `@/components/ui/toggle-group` |
| `Menubar` | Menu bar (desktop apps) | `@/components/ui/menubar` |
| `AspectRatio` | Fixed aspect ratio containers | `@/components/ui/aspect-ratio` |
| `Avatar` | User avatars | `@/components/ui/avatar` |
| `Kbd` | Keyboard shortcut display | `@/components/ui/kbd` |
| `AlertDialog` | Confirmation dialogs (destructive actions) | `@/components/ui/alert-dialog` |
| `ButtonGroup` | Grouped buttons | `@/components/ui/button-group` |
| `Carousel` | Image/content carousels (Embla) | `@/components/ui/carousel` |
| `Chart` | Data visualization (Recharts) | `@/components/ui/chart` |
| `Empty` | Empty state placeholder | `@/components/ui/empty` |
| `InputGroup` | Input with prefix/suffix addons | `@/components/ui/input-group` |
| `Item` | Generic list item | `@/components/ui/item` |
| `NativeSelect` | Native HTML select dropdown | `@/components/ui/native-select` |

**Icons:** Use `@phosphor-icons/react` (client) or `@phosphor-icons/react/dist/ssr` (server).

**Note:** This is `base-vega` style. Use `render` prop instead of `asChild` for polymorphic components.

---

## Shared Components (`@/components/shared/`)

### FormValidationDebugger

**Path:** `@/components/shared/form-validation-debugger`
**Purpose:** Dev-only debug panel showing form state, errors, touched fields, and current values. Hidden in production.
**Props:**
- `methods` — `UseFormReturn` from react-hook-form

**Usage:**
```tsx
import { FormValidationDebugger } from '@/components/shared/form-validation-debugger';

<form onSubmit={onSubmit}>
  {/* form fields */}
  <FormValidationDebugger methods={methods} />
</form>
```

---

### ErrorBoundary

**Path:** `@/components/shared/error-boundary`
**Purpose:** Catches React errors in child components. Dev: shows error details + stack trace. Prod: clean fallback UI.
**Props:**
- `children` — wrapped content
- `name?` — component label shown in error UI
- `fallback?` — custom fallback React node
- `className?` — additional styles

**Usage:**
```tsx
import { ErrorBoundary } from '@/components/shared/error-boundary';

<ErrorBoundary name="UserList">
  <UserList />
</ErrorBoundary>
```
