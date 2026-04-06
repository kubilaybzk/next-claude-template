# Full Next.js Template

AI destekli geliştirme akışına sahip, üretime hazır Next.js 16 şablonu.

## Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Stil | Tailwind CSS v4, shadcn/ui (base-vega), Phosphor Icons |
| Sunucu Verisi | React Query (TanStack Query) |
| Client State | Redux Toolkit (nadir, çapraz feature) |
| Form | react-hook-form + Zod |
| Paket Yöneticisi | pnpm |

## Hızlı Başlangıç

```bash
pnpm install                          # bağımlılıklar
cp .env.example .env.local            # ortam değişkenleri
bash scripts/claude-onboarding.sh     # Claude Code belleği (bir kez)
pnpm dev                              # http://localhost:3000
```

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `pnpm dev` | Geliştirme sunucusu |
| `pnpm build` | Üretim derlemesi — her değişiklik sonrası çalıştır |
| `pnpm lint` | ESLint kontrolü |
| `bash scripts/claude-onboarding.sh` | Claude Code proje belleğini oluşturur |

---

## Klasör Yapısı

```
app/                        # Next.js rotaları ve layout'lar
components/
  ui/                       # shadcn/ui — elle düzenleme yok
  shared/                   # 2+ feature'da kullanılan ortak bileşenler
features/
  [name]/
    components/             # Feature'a özel UI
    hooks/                  # Feature'a özel hook'lar
    services/               # React Query hook'ları + API çağrıları
    types/                  # Feature'a özel tipler
    validations/            # Zod şemaları + türetilen tipler
    store/                  # Redux slice (yalnızca gerekirse)
providers/                  # App-level context provider'lar
services/                   # Paylaşılan API katmanı (api-client, query-keys)
hooks/                      # Paylaşılan hook'lar
lib/                        # Genel yardımcılar (cn(), vb.)
store/                      # Redux store konfigürasyonu
types/                      # Paylaşılan TypeScript tipleri
constants/                  # Uygulama geneli sabitler
scripts/                    # Geliştirici betikleri
proxy.ts                    # Next.js 16 middleware alternatifi (auth, redirect, locale)
.claude/                    # Claude Code kural dosyaları (aşağıda detaylı)
```

### İsimlendirme Kuralları

| Ne | Kural | Örnek |
|----|-------|-------|
| Dosya adı | `kebab-case` | `use-auth.ts`, `user-card.tsx` |
| Bileşen fonksiyonu | `PascalCase` | `UserCard`, `LoginForm` |
| Hook | `use-` öneki | `use-filter-state.ts` |
| İçe aktarma | Her zaman `@/` alias | `import { Button } from '@/components/ui/button'` |
| Dışa aktarma | Named export | Default yalnızca `page` / `layout` dosyalarında |

---

## Kural Dosyaları — `.claude/` Rehberi

Bu projede 7 kural dosyası vardır. Her biri farklı amaca hizmet eder ve farklı zamanda yüklenir.

### Hiyerarşi

```
CLAUDE.md                           ← Her konuşmada otomatik
│                                      Tüm kuralların TEK kaynağı
│
├── .claude/PATTERNS.md             ← UI/service yazmadan önce
│                                      Kod örnekleri (component, query, service, SEO)
│
├── .claude/REGISTRY.md             ← UI yazmadan önce
│                                      Component kataloğu (50+ shadcn + 4 shared)
│
├── .claude/design-system-rules.md  ← UI oluştururken
│                                      Görsel tokenlar (renk, font, spacing)
│
├── .claude/form-rules.md           ← Form dosyalarında otomatik (globs)
│                                      react-hook-form + zod pattern'leri
│
└── .claude/skills/
    ├── page.md                     ← /page komutuyla
    │                                  Route scaffold'u
    └── scaffold.md                 ← /scaffold komutuyla
                                       Feature scaffold'u
```

### Dosya Detayları

#### 1. `CLAUDE.md` — Ana Kural Kaynağı

Her konuşmada otomatik yüklenir. Stack, naming, component, state, API, styling, git, workflow, quality kurallarının **tek kaynağı**. Diğer tüm dosyalar bunu referans eder.

```
Senaryo: "Button'u Link olarak kullanmam lazım"
→ CLAUDE.md der ki: "base-vega style: use render prop (NOT asChild)"

  ✅ <Button render={<Link href="/users" />}>Users</Button>
  ❌ <Button asChild><Link href="/users">Users</Link></Button>
```

#### 2. `PATTERNS.md` — Kod Örnekleri

UI veya service yazmadan önce okunur. Component, React Query, service kullanımı, types ve SEO metadata **örnekleri**. Kural koymaz, CLAUDE.md'ye referans verir.

```
Senaryo: "Yeni feature için service yazacağım"
→ PATTERNS.md'deki pattern'i takip et:
  1. Service function — pure fetch, hook yok
  2. useQuery/useMutation hook — service'i sarar
  3. Component'te kullan — loading(Skeleton) / error(ErrorMessage) / empty(EmptyState)
```

#### 3. `REGISTRY.md` — Component Kataloğu

UI yazmadan önce okunur. 50+ shadcn/ui ve 4 shared component'in listesi (EmptyState, ErrorMessage, ErrorBoundary, FormValidationDebugger). Ham HTML yazmadan önce mutlaka kontrol et.

```
Senaryo: "Dropdown menü lazım"
→ REGISTRY.md: DropdownMenu | @/components/ui/dropdown-menu
→ Ham <select> veya custom div YAZMA, mevcut component'i kullan
```

#### 4. `design-system-rules.md` — Görsel Tokenlar

UI oluştururken okunur. Renk sistemi (13 semantic token grubu), tipografi (6 seviye), 3 font, spacing, shadow, responsive, component composition kuralları (8 madde).

```
Senaryo: "Card'a arka plan rengi vereceğim"
  ❌ bg-blue-500        (raw renk)
  ✅ bg-card             (semantic token, dark mode otomatik)

Senaryo: "Loading state nasıl?"
  → Sayfa yükleniyorsa → Skeleton
  → Button submit sırasında → Spinner (client-only)

Senaryo: "Icon boyutu?"
  → Metin içi → size-4  |  Tek başına → size-5
```

#### 5. `form-rules.md` — Form Pattern'leri

Form dosyalarıyla çalışırken **otomatik yüklenir** (globs ile). react-hook-form + zod, schema location, validation display, wizard pattern.

```
Senaryo: "Login formu yazacağım"
→ form-rules.md otomatik yüklenir:
  1. Schema → features/auth/validations/login-schema.ts
  2. Form → useForm<LoginInput> + zodResolver + defaultValues
  3. Validation → aria-describedby ile inline error (toast YASAK)
  4. Submit → isSubmitting sırasında Spinner göster
  5. Debug → <FormValidationDebugger methods={methods} /> ekle
```

#### 6. `skills/page.md` — `/page` Komutu

Yeni route sayfası scaffold'u. 4 dosya oluşturur:

```
/page dashboard
→ app/dashboard/
    page.tsx       (metadata export'lu)
    loading.tsx    (Skeleton tabanlı)
    error.tsx      ('use client', reset button)
    not-found.tsx  (404 fallback)
```

#### 7. `skills/scaffold.md` — `/scaffold` Komutu

Tam feature yapısı + route dosyaları oluşturur:

```
/scaffold auth
→ features/auth/
    types/index.ts             (domain modelleri)
    validations/auth-schema.ts (zod + inferred types)
    services/auth-service.ts   (CRUD hooks)
    components/                (boş)
    hooks/                     (boş)
→ app/auth/
    page.tsx + loading.tsx + error.tsx + not-found.tsx
```

### Hangi Durumda Hangi Dosya?

| Durum | Oku |
|-------|-----|
| Herhangi bir kod yazacağım | `CLAUDE.md` (otomatik yüklü) |
| UI component yazacağım | + `REGISTRY.md` + `PATTERNS.md` |
| Görsel stil kararı | + `design-system-rules.md` |
| Form yazacağım | + `form-rules.md` (otomatik yüklenir) |
| Yeni route oluşturacağım | `/page <route>` |
| Yeni feature başlatacağım | `/scaffold <name>` |
| Shared component ekledim | `REGISTRY.md`'yi güncelle |

---

## Geliştirme İş Akışı (8 Adım)

`CLAUDE.md` Workflow bölümüyle birebir uyumludur.

```
1. Plan        → /make-plan          Onay al, sonra kodla
   Claude sana şunları sorar:
   (a) API bilgisi → Endpoint listesi, Swagger URL veya backend kaynak kodu iste
   (b) Tasarım   → Figma dosyası veya referans design var mı?
   → API bilgisi verilmeden tip/servis OLUŞTURULMAZ (tahmin/placeholder yasak)
   → Tasarım verilmezse frontend-design skill ile kendisi tasarlar
2. Keşif       → /smart-explore      AST tabanlı, token-verimli arama
3. Scaffold    → /scaffold veya /page Yapı iskeletini oluştur
4. UI          → frontend-design     Üretim kalitesi bileşenler
5. Figma       → figma-use + figma-implement-design (opsiyonel)
6. Uygulama    → /do                 Paralel subagent'larla çalıştır
7. İnceleme    → /simplify + /code-review
8. Doğrulama   → pnpm build && pnpm lint (commit öncesi zorunlu)
```

---

## Skill'ler

### Skill Özet Tablosu

| Skill | Ne Yapar | Ne Zaman | Örnek |
|-------|----------|----------|-------|
| `/make-plan` | Mimari plan + onay | Feature başlamadan önce | `/make-plan Sipariş filtreleme sistemi` |
| `/smart-explore` | AST tabanlı kod keşfi | "X nerede?" soruları | `/smart-explore useMutation kullanımları` |
| `/scaffold` | Feature iskelet oluştur | Yeni feature | `/scaffold auth` |
| `/page` | Route dosyaları oluştur | Yeni sayfa | `/page dashboard` |
| `frontend-design` | Üretim kalitesi UI | Bileşen talebi | Otomatik çalışır |
| `figma-use` | Figma bağlantısı | Figma'dan başlarken | `/figma-use` (her zaman önce) |
| `figma-implement-design` | Figma → Kod | Tasarım uygulamak | Figma URL'si ile |
| `/do` | Planı paralel çalıştır | Plan onaylandıktan sonra | `/do Planı uygula` |
| `/simplify` | Kod sadeleştir | Feature bittikten sonra | `/simplify` |
| `/code-review` | PR öncesi inceleme | Commit öncesi | `/code-review` |
| `mem-search` | Geçmiş oturum arama | "Bunu çözmüş müydük?" | `/mem-search form validation` |

### Skill Detayları ve Örnekler

#### `/make-plan` — Plan Oluştur

Feature başlamadan önce mimari plan oluşturur. Onay alınmadan kod yazılmaz. **Planlama sırasında Claude sana iki soru sorar:**

1. **API bilgisi** — Endpoint listesi, Swagger URL veya backend kaynak kodu paylaş. Bilgi verilmeden tip/servis oluşturulmaz.
2. **Tasarım** — Figma dosyası veya referans design var mı? Yoksa `frontend-design` ile kendisi tasarlar.

```bash
/make-plan Ürün filtreleme ve sayfalama sistemi
```

Çıktı:
```
❓ API endpoint bilgilerinizi paylaşır mısınız?
   (Swagger URL, endpoint listesi veya backend kaynak kodu)
❓ Kullanmak istediğiniz bir Figma/design var mı?

→ Bilgiler alındıktan sonra:

PLAN: Ürün Filtreleme
├── Faz 1: types + validations (1 dosya)
├── Faz 2: services + hooks (3 dosya)
└── Faz 3: components (2 dosya)

Onay bekleniyor...
```

#### `/smart-explore` — Kod Keşfi

AST tabanlı, token-verimli arama. Tam dosya okumak yerine yapı ve imza özetleri döndürür.

```bash
/smart-explore features altında React Query hook'ları
```

Çıktı:
```
📄 features/users/services/user-service.ts
   ├─ useUsers()         [useQuery]  → GET /api/users
   ├─ useUser(id)        [useQuery]  → enabled: !!id
   └─ useCreateUser()    [useMutation] → invalidate users.list

Token: ~280 (vs tam dosya okuma: ~1400 → %80 tasarruf)
```

#### `/scaffold` — Feature Oluştur

Tam feature yapısı + route dosyaları:

```bash
/scaffold products
```

Çıktı:
```
✓ features/products/types/index.ts
✓ features/products/services/products-service.ts (CRUD hooks)
✓ features/products/validations/products-schema.ts (zod + inferred types)
✓ features/products/components/ (boş)
✓ features/products/hooks/ (boş)
✓ app/products/page.tsx + loading.tsx + error.tsx + not-found.tsx

pnpm build ✓
```

#### `/do` — Paralel Uygulama

Onaylı planı paralel subagent'larla çalıştırır:

```bash
/do Ürün filtreleme planını uygula
```

Çıktı:
```
Paralel:
  ├─ Agent 1 (types)      → ✓ 124 satır
  ├─ Agent 2 (services)   → ✓ 267 satır
  └─ Agent 3 (components) → ✓ 189 satır

Toplam: 5 dosya, 580 satır, ~45s
```

#### `/simplify` — Sadeleştir

Feature tamamlandıktan sonra redundans ve karmaşıklığı azaltır:

```bash
/simplify
```

Çıktı:
```
❌ 2 hook aynı state'i yönetiyor → birleştir
⚠️ Component: 156 → 89 satır (logic extract)
✓ QueryKeys pattern tutarlı
✓ ErrorBoundary kullanımı doğru
```

#### `/code-review` — PR Kontrolü

Commit öncesi `CLAUDE.md` kurallarına göre otomatik review:

```bash
/code-review
```

Çıktı:
```
✓ Naming: kebab-case dosyalar, PascalCase bileşenler
✓ Types: tüm props explicit, any yok
✓ State: sunucu verisi React Query'de, Redux'ta değil
✓ Styling: semantic tokens, custom CSS yok
✓ Accessibility: aria labels, semantic HTML
✅ PR HAZIR
```

---

## Mimari Kararlar

### Component Kuralları

- Varsayılan olarak **server component**. `'use client'` sadece hook, event veya browser API gerektiğinde.
- shadcn/ui **base-vega** stili: polimorfik bileşenlerde `render` prop kullanılır, `asChild` yok.
- 1 yerde kullanılan bileşen → `features/[name]/components/`
- 2+ yerde kullanılan → `components/shared/` + `REGISTRY.md` güncelle
- Feature bölümlerini `<ErrorBoundary name="...">` ile sar.
- Her `page.tsx` dosyası `metadata` export etmeli (SEO).

### State Yönetimi

| Veri Türü | Araç | Nerede |
|-----------|------|--------|
| Sunucu verisi | React Query | `features/[name]/services/` |
| Yerel UI state | useState / useReducer | Component içinde |
| Çapraz feature state | Redux Toolkit (nadir) | `features/[name]/store/` |

**Kural:** Sunucu verisi asla Redux'ta tutulmaz.

### API Katmanı

```
services/api-client.ts      → Native fetch wrapper (get, post, put, patch, delete)
services/query-keys.ts      → Fabrika pattern: [feature, resource, params?]
features/[name]/services/   → React Query hook'ları

Akış: service function → useQuery/useMutation hook → component
```

**Önemli:** Claude asla tahminle tip veya endpoint oluşturmaz. API bilgisi eksikse sana sorar:
- Endpoint listesi (URL, method, request/response shape)
- Swagger/OpenAPI URL
- Backend kaynak kodu

Placeholder tip, TODO endpoint veya mock API shape **yasaktır**. Bilgi olmadan kod yazılmaz. (İstisna: `/scaffold` ve `/page` skill'leri başlangıç noktası olarak minimal TODO placeholder oluşturur — gerçek veriyle hemen doldurulmalıdır.)

### Stil Kuralları

- Yalnızca Tailwind utility class'ları. Custom CSS sadece zorunluysa.
- `cn()` ile koşullu class birleştirme (`@/lib/utils`).
- Semantic token kullanımı zorunlu (`bg-primary`, `text-muted-foreground`).
- Raw renk yasak (`bg-blue-500` gibi).
- Dark mode otomatik (CSS variables) — `dark:` prefix gereksiz.
- İkonlar: Phosphor only. Client: `@phosphor-icons/react`, Server: `@phosphor-icons/react/dist/ssr`.

### Form Kuralları

- **Tek kütüphane:** react-hook-form + zod.
- Schema: `features/{name}/validations/{schema-name}-schema.ts`
- Her schema: zod schema + inferred type + defaults export eder.
- Validation hataları: inline `<p>` + `aria-describedby` (toast yasak).
- Submit sırasında: `<Spinner />` göster.
- Her formda: `<FormValidationDebugger methods={methods} />` ekle.

---

## Yeni Feature Rehberi

### Adım Adım

```
1. /make-plan <feature-adı>              Plan oluştur, onay al
2. /scaffold <feature-adı>               Dosya yapısını oluştur
3. features/[name]/types/index.ts        Veri tiplerini tanımla
4. features/[name]/validations/          Zod şemaları yaz
5. features/[name]/services/             API hook'larını yaz
6. features/[name]/components/           UI bileşenlerini yaz
7. /simplify                             Sadeleştir
8. /code-review                          Kontrol et
9. pnpm build && pnpm lint              Doğrula
10. git commit -m "feat: ..."            Commit
```

### Pratik Örnek: Auth Feature

```bash
# 1. Plan
Sen: "Login, register, şifremi unuttum ve OTP sayfalarını yapalım"

# Claude sana sorar:
# ┌─────────────────────────────────────────────────────────┐
# │ API endpoint bilgilerinizi paylaşır mısınız?            │
# │ Swagger URL, endpoint listesi veya backend kaynak kodu  │
# │ olabilir. Bu bilgi olmadan tipleri ve servisleri         │
# │ oluşturamam.                                            │
# │                                                         │
# │ Ayrıca kullanmak istediğiniz bir Figma tasarımı veya    │
# │ referans design var mı? Yoksa frontend-design ile       │
# │ kendim tasarlayacağım.                                  │
# └─────────────────────────────────────────────────────────┘

# Sen cevaplarsın:
# Swagger: https://api.example.com/docs
# veya endpoint listesi:
#   POST /api/auth/login       → { email, password } → { accessToken, user }
#   POST /api/auth/register    → { name, email, password } → { message }
#   POST /api/auth/verify-otp  → { email, otp } → { accessToken, user }
#   POST /api/auth/forgot      → { email } → { message }
# Figma: https://figma.com/file/xxx (veya "Figma yok, kendin tasarla")

# 2. Claude planı oluşturur (API bilgisine dayalı, tahmin yok)
/make-plan → onay bekler

# 3. Scaffold
/scaffold auth

# 4. Oluşan yapı (gerçek endpoint bilgisinden türetilmiş):
features/auth/
  types/index.ts              → User (domain model only)
  validations/
    login-schema.ts           → email + password, zod schema + LoginInput type + defaults
    register-schema.ts        → name + email + password + confirm, RegisterInput type
    otp-schema.ts             → 6 haneli kod validasyonu, OtpInput type
    forgot-schema.ts          → email validasyonu, ForgotInput type
  services/auth-service.ts    → useLogin, useRegister, useVerifyOtp, useForgotPassword
  components/
    login-form.tsx            → Single form pattern (form-rules.md)
    register-form.tsx         → Single form pattern
    otp-form.tsx              → InputOTP component (REGISTRY.md'den)
    forgot-form.tsx           → Single form pattern
app/auth/
  page.tsx                    → Metadata + Tab navigation (login/register)
  forgot/page.tsx             → Şifremi unuttum sayfası
  verify/page.tsx             → OTP doğrulama sayfası
  loading.tsx                 → Skeleton
  error.tsx                   → Error boundary
  not-found.tsx               → 404

# 5. Doğrulama
/simplify
/code-review
pnpm build && pnpm lint
```

---

## Kalite Kuralları

| Kural | Detay |
|-------|-------|
| Tip güvenliği | Prop tipleri her zaman explicit. `any` yasak (kaçınılmaz değilse). |
| Hata yönetimi | Route segment'lerinde error boundary. Sessiz hata yok. |
| Güvenlik | `dangerouslySetInnerHTML` yasak. Kullanıcı girdisi sanitize edilir. |
| Gizlilik | Hardcoded secret yok. Ortam değişkenleri kullanılır. |
| Erişilebilirlik | Semantic HTML, aria label'lar, klavye navigasyonu. |
| Git | Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:` |
| Branch | `feat/…`, `fix/…`, `chore/…`, `refactor/…`, `docs/…` |

---

## Claude Code Onboarding

Klonlama sonrası bir kez çalıştırılır:

```bash
bash scripts/claude-onboarding.sh
```

Bu komut `~/.claude/projects/.../memory/` altına (repoya commit edilmez) şunları yazar:

- **project_conventions.md** — iş akışı, okunması gereken dosyalar, kalite kapıları
- **team_standards.md** — PR süreci, inceleme listesi, deploy notları

Ekip genelindeki kurallar `CLAUDE.md` üzerinden Git ile paylaşılır.

---

## Deploy

VPS / self-hosted ortam. Vercel/Netlify kullanılmaz.

```bash
pnpm build                    # üretim derlemesi
# Çıktı: .next/ dizini
```
