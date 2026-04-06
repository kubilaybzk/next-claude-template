# Full Next.js Template

Üretim için hazır Next.js 16 şablonu; AI destekli geliştirme akışı ve repodaki `CLAUDE.md` kurallarıyla uyumludur.

## Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **Stil**: Tailwind CSS v4, shadcn/ui (base-vega, Phosphor ikonları)
- **Durum**: Redux Toolkit (çapraz özellik / nadir), React Query (sunucu verisi — her zaman)
- **Paket yöneticisi**: pnpm

## Hızlı başlangıç

```bash
# 1. Bağımlılıklar
pnpm install

# 2. Ortam değişkenleri
cp .env.example .env.local

# 3. Claude Code belleği (her geliştirici bir kez)
bash scripts/claude-onboarding.sh

# 4. Geliştirme sunucusu
pnpm dev
```

Uygulama: [http://localhost:3000](http://localhost:3000)

## Komutlar

| Komut | Açıklama |
|--------|-----------|
| `pnpm dev` | Geliştirme sunucusu |
| `pnpm build` | Üretim derlemesi (değişiklik sonrası doğrulama için çalıştırın) |
| `pnpm lint` | ESLint |
| `bash scripts/claude-onboarding.sh` | Claude Code proje belleğini oluşturur |

## Klasör yapısı

Repodaki yapı `CLAUDE.md` ile aynıdır; yeni özellik eklerken bu ağaç ve `features/[isim]/` kalıbını kullanın.

```
app/                    # Rotalar ve layout'lar
components/
  ui/                   # shadcn/ui — elle düzenleme yok
  shared/               # Birden fazla özellikte kullanılan bileşenler
features/
  [name]/
    components/         # Sadece bu özelliğe özel UI
    hooks/
    services/           # React Query hook'ları + API çağrıları
    types/
    validations/        # Zod şemaları + türetilen tipler
    store/              # Redux slice (yalnızca gerekirse)
providers/
services/               # api-client, query-keys
hooks/
lib/
store/
types/
constants/
scripts/
proxy.ts                # Next.js 16'da middleware yerine; auth, yönlendirme, locale
```

### İsimlendirme ve içe aktarma (özet)

| Ne | Kural |
|----|--------|
| Dosya adı | `kebab-case` (örn. `use-auth.ts`, `user-card.tsx`) |
| Bileşen fonksiyonu | `PascalCase` |
| Hook | `use-` öneki |
| İçe aktarma | `@/` alias |
| Dışa aktarma | Adlandırılmış export; yalnızca `page` / `layout` dosyalarında default |

### Özellik dosyaları — kısa örnek

Sunucu bileşeni (varsayılan) ve istemci gerektiğinde:

```tsx
// features/users/components/user-row.tsx
'use client'; // yalnızca event, hook veya tarayıcı API'si gerekiyorsa

import { Button } from '@/components/ui/button';
import type { User } from '@/features/users/types';

interface UserRowProps {
  user: User;
  onSelect?: (id: string) => void;
}

export function UserRow({ user, onSelect }: UserRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{user.name}</span>
      {onSelect && (
        <Button type="button" size="sm" variant="outline" onClick={() => onSelect(user.id)}>
          Seç
        </Button>
      )}
    </div>
  );
}
```

- Yeni UI'dan önce: `.claude/REGISTRY.md` ve `.claude/PATTERNS.md` okunmalı; mümkünse ham `div`/`button` yerine shadcn veya paylaşılan bileşen kullanılır.
- Formlar: `.claude/form-rules.md` ve PATTERNS içindeki form bölümü (react-hook-form + Zod).
- API: `services/api-client.ts`, sorgu anahtarları `services/query-keys.ts` fabrika deseni `[feature, resource, params?]`.

## Proje kuralları (`CLAUDE.md`)

Tüm detaylar `CLAUDE.md` içindedir. Özet:

- Sunucu verisi Redux'ta tutulmaz; React Query kullanılır.
- `components/ui/` dosyaları doğrudan değiştirilmez.
- Tailwind semantik token'lar; `cn()` ile koşullu sınıflar; ayrıntı: `.claude/design-system-rules.md`.
- Kalite: açık prop tipleri, route'ta hata sınırları, `dangerouslySetInnerHTML` yok, gizli anahtar yok (env), erişilebilirlik ve mobil öncelik.

## Claude Code Onboarding

[Claude Code](https://claude.ai/claude-code) ile çalışırken klon sonrası bir kez:

```bash
bash scripts/claude-onboarding.sh
```

Bu komut yerelde `~/.claude/projects/.../memory/` altına (repoya commit edilmez) şunları yazar:

- **project_conventions.md** — iş akışı, okunması gereken dosyalar, kalite kapıları
- **team_standards.md** — PR, inceleme listesi, deploy notları

Ekip genelindeki kurallar Git ile `CLAUDE.md` üzerinden paylaşılır.

---

## Claude Code Skill'leri ve İş Akışı

Skill'ler Claude Code ortamında **yerleşik komutlardır**. Bu repodaki iş sırası **`CLAUDE.md` Workflow** ile birebir uyumludur. Kurulum gerekli değildir.

### Skill Özeti

| Skill | Amaç | Ne zaman | Kullanım |
|-------|------|----------|----------|
| **make-plan** | Mimari plan + onay | Önemli özelliklerden önce | `/make-plan Sipariş listesi filtreleme ve sayfalama` |
| **smart-explore** | AST tabanlı kod keşfi | "X nerede tanımlı?" | `/smart-explore features klasöründe useMutation hook'ları` |
| **frontend-design** | Üretim kalitesi UI | UI / bileşen talebinde | Özellik tarifinde otomatik çalışır |
| **figma-use** + **figma-implement-design** | Figma → kod (1:1 uyum) | Figma tasarımdan başlıyorsan | `/figma-use` sonra `/figma-implement-design` |
| **do** | Planı paralel çalıştır | Plan onaylandıktan sonra | `/do Kabul edilen özellik planını uygula` |
| **simplify** | Kod sadeleştir | Özellik tamamlandıktan sonra | `/simplify` |
| **code-review** | PR öncesi inceleme | Commit öncesi | `/code-review` |

**Ek araç**:
- **mem-search** — Geçmiş oturumlardaki çözümler (tekrar analiz gerekti mi?). Bkz. `CLAUDE.md` Claude Behavior.

---

## Resmi İş Akışı (7 Adım)

Bu akış `CLAUDE.md` Workflow ile **tamamen uyumludur**.

```
1. Plan          → /make-plan, kullanıcı onayı
2. Keşif         → /smart-explore (tam dosya okumaktan kaçın)
3. UI            → /frontend-design (PATTERNS + REGISTRY'ı kontrol et)
4. Figma (opsiyonel) → /figma-use + /figma-implement-design
5. Uygulama      → /do (paralel işler)
6. İnceleme      → /simplify + /code-review
7. Doğrulama     → pnpm build && pnpm lint (commit öncesi zorunlu)
```

---

## Skill Referansı — Detaylı Örnek Çıktılar

### 1. **make-plan** — Mimari & Onay

**Ne için**: Herhangi bir non-trivial özellikten önce plan oluştur; kodlamaya başlamadan önce user onayı al.

**Kural**: `CLAUDE.md` Workflow 1 → "plan olmadan kod yok".

**Örnek komut**:
```bash
/make-plan Ürün filtreleme ve sayfalama sistemi; varsayılan filtreleri kaydet
```

**Örnek çıktı**:
```
PLAN: Ürün Filtreleme Sistemi

Amaç:
- Varsayılan filtreleri localStorage'da sakla
- React Query ile sunucu verisi senkronize et
- Tailwind + shadcn komponenleriyle UI yap

Faz 1 — Tip & Validasyon (1 dosya):
  ✓ features/products/types/filters.ts
    - FilterState interface (kategori, fiyat aralığı, sıralama)
    - Zod şeması

Faz 2 — Hook & API (3 dosya):
  ✓ features/products/services/query-keys.ts
    - queryKeys.products.filtered(filters)
  ✓ features/products/services/product-service.ts
    - useFilteredProducts(filters) — React Query hook
  ✓ features/products/hooks/use-filter-state.ts
    - localStorage ↔ React state senkronizasyonu

Faz 3 — UI (2 dosya):
  ✓ features/products/components/filter-panel.tsx
    - Checkbox, Range, Select
    - "Sıfırla" butonu
  ✓ features/products/components/product-grid.tsx
    - useFilteredProducts hook'u bağla
    - ErrorBoundary ile sarılı

Çıktı:
  - products/ klasöründe tamamen yalıtılmış
  - REGISTRY.md güncellenecek
  - Test yazılmayacak (şimdilik)

Token: ~450 (plan oluşturma)
Tahmini kod: 380 satır

Onay bekleniyormu?
```

**Token tasarrufu neden**: Onaylı plan olmadan hatalı yönde 800+ satır yazıp silmemek → 3000+ token tasarrufu.

---

### 2. **smart-explore** — AST Tabanlı Keşif

**Ne için**: "X nerede tanımlı? Nasıl kullanılıyor?" soruları için token-verimli arama.

**Kural**: `CLAUDE.md` Workflow 2 → "tam dosya okumaktan kaçın".

**Örnek komut**:
```bash
/smart-explore features altında React Query useQuery ve useMutation kullanımları
```

**Örnek çıktı**:
```
Query: features altında React Query useQuery ve useMutation kullanımları

Sonuçlar:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 features/users/services/user-service.ts (156 satır)
   ├─ useUsers()              [hook, useQuery]
   │  └─ queryKey: queryKeys.users.list()
   │  └─ api call: GET /api/users
   │
   ├─ useUserDetail(id)       [hook, useQuery]
   │  └─ queryKey: queryKeys.users.detail(id)
   │  └─ enabled prop: !!id
   │
   └─ useCreateUser()         [hook, useMutation]
      └─ POST /api/users
      └─ onSuccess: invalidate queryKeys.users.list()

📄 features/orders/services/order-service.ts (124 satır)
   ├─ useOrders(filters)      [hook, useQuery]
   │  └─ queryKey: queryKeys.orders.list(filters)
   │
   └─ useUpdateOrder(id)      [hook, useMutation]
         └─ PATCH /api/orders/{id}
         └─ optimistic update: setQueryData

📄 features/cart/services/cart-service.ts (89 satır)
   └─ useCart()               [hook, useQuery]
      └─ staleTime: 5 * 60 * 1000 (5 min)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Desen bulguları:
✓ queryKeys fabrikası: services/query-keys.ts
  - queryKeys.users.detail(id)
  - queryKeys.orders.list(filters)
  - Hiç düz string key yok ✓

✓ İnvalidation pattern:
  - Çoğu useMutation → onSuccess invalidate
  - 1 örnek: optimistic update (orders)

❌ Gözlem: Cart hook'u staleTime custom; diğerlerinin yok. Standardize edilebilir?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sonuç: 3 hizmet, 6 hook, pattern tutarlı.
Yeni özellik için şablonu: features/[isim]/services/[isim]-service.ts

Token: ~280 (AST parse + özet)
Versus tam dosya okuma: ~1400 token
Tasarrufu: 80%
```

**Neden verimli**: 
- Gereksiz kod satırı okumaz
- Yapı (AST) kullanır, metin arama değil
- Sadece imzalar + pattern özeti

---

### 3. **frontend-design** — Üretim Kalitesi UI

**Ne için**: Bileşen / ekran tasarımı. Generic "AI estetiğinden" kaçın.

**Kural**: `CLAUDE.md` → "Tailwind utilities only, use cn() for conditional classes, never raw colors".

**Örnek talep**:
```
Ürün kategorileri için bir filtre paneli UI. 
Çoklu seçim (checkbox), sabit kategoriler (Elektronik, Giyim, Ev),
sadeleştir butonu var. Hata durumunu göster.
REGISTRY.md'de FilterPanel diye bileşen var, ondan yoksayma yapma.
```

**Örnek çıktı** (frontend-design otomatik çalışır):
```tsx
// features/products/components/product-filter-panel.tsx
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/shared/error-boundary';
import { useFilterState } from '@/features/products/hooks/use-filter-state';
import type { ProductFilters } from '@/features/products/types';

const CATEGORIES = ['Elektronik', 'Giyim', 'Ev'] as const;

interface ProductFilterPanelProps {
  onFiltersChange: (filters: ProductFilters) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function ProductFilterPanel({
  onFiltersChange,
  isLoading = false,
  error = null,
}: ProductFilterPanelProps) {
  const { filters, setFilters, reset } = useFilterState();

  const handleCategoryToggle = (category: string) => {
    const updated = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    const newFilters = { ...filters, categories: updated };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    reset();
    onFiltersChange({ categories: [], priceRange: null });
  };

  if (error) {
    return (
      <div className="rounded-lg border border-semantic-error/20 bg-semantic-error/5 p-4">
        <p className="text-sm text-semantic-error">
          Filtreler yüklenemedi. Lütfen daha sonra deneyin.
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary name="ProductFilterPanel">
      <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Kategoriler</h3>

        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Checkbox
                checked={filters.categories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
                disabled={isLoading}
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{category}</span>
            </label>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={isLoading || filters.categories.length === 0}
          className="w-full"
        >
          Sıfırla
        </Button>
      </div>
    </ErrorBoundary>
  );
}
```

**Kalite kontrol** ✓:
- Tailwind semantik tokens (`border-semantic-error`, `bg-neutral-50`)
- `cn()` kullanılmadı ama koşullu stil yok (basit)
- ErrorBoundary sarılı ✓
- Props açık tipli ✓
- Dark mode destek ✓
- Erişilebilirlik: `label` + `htmlFor` otomatik ✓

**Token tasarrufu**: Template kullanımı, boilerplate yok, sadece iş mantığı.

---

### 4. **do** — Plan Uygulama (Paralel)

**Ne için**: Onaylı planı paralel alt ajanlarla hızlı çalıştır.

**Krul**: `CLAUDE.md` Workflow 5 → "bağımsız işler mümkünse paralel".

**Örnek komut**:
```bash
/do Kabul edilen ürün filtreleme planını uygula
```

**Örnek çıktı**:
```
EXECUTION: Ürün Filtreleme Planı

Paralel çalışan: 
  ├─ Subagent 1 (types & validation)
  │  └─ features/products/types/filters.ts
  │  └─ Zod şemaları
  │
  ├─ Subagent 2 (hooks & API)
  │  └─ services/query-keys.ts fabrika entry
  │  └─ features/products/services/product-service.ts
  │  └─ features/products/hooks/use-filter-state.ts
  │
  └─ Subagent 3 (UI components)
     └─ features/products/components/filter-panel.tsx
     └─ features/products/components/product-grid.tsx

Status:
  ✓ Subagent 1: Tamamlandı (124 satır)
  ✓ Subagent 2: Tamamlandı (267 satır)
  ✓ Subagent 3: Tamamlandı (189 satır)

Toplam:
  - Dosya: 5 yeni
  - Satır: 580 (tamamı test yok)
  - Süre: ~45s (paralel)

Sonraki adım:
  /simplify
  /code-review
  pnpm build && pnpm lint
```

**Token tasarrufu**: Paralel çalışma → 3 ayrı istek yerine 1 koordine talep (overhead düşür).

---

### 5. **simplify** — Kod Sadeleştirme

**Ne için**: Özellik tamamlandıktan sonra redundans, imodelleri, kalıpları iyileştir.

**Kural**: `CLAUDE.md` → "YAGNI — don't create abstractions until needed".

**Örnek çıktı**:
```
SIMPLIFY REPORT

Gözlemler:
────────────────────────────────────────

❌ Hook: use-filter-state.ts + use-filter-params.ts
   Aynı state yönetiyorlar. Birleştir.

⚠️  Component: filter-panel.tsx (156 satır)
   - 47 satır reset + validation logic
   → Bu'yu features/products/hooks/use-filter-logic.ts'e çıkart

✓ Pattern: QueryKeys fabrikası
   Tutarlı, örnek:
   - queryKeys.products.filtered(filters)
   - Standard maintain ✓

✓ ErrorBoundary kullanımı
   ✓ UI'da wrap ✓

✅ Öneriler uygulandı:
  • use-filter-state.ts + use-filter-params.ts → use-filter.ts (1 hook)
  • filter-panel.tsx: 156 → 89 satır (logic extract)

Sonuç:
  - 3 dosya → 2 dosya
  - Redundans: -23 satır
  - Readability: +1 (clearer separation)

Token: ~340 (review + changes)
```

---

### 6. **code-review** — PR Kalite Gate

**Ne için**: Commit öncesi kurallara göre kontrol. `CLAUDE.md` Quality Rules'a uyma.

**Örnek komut**:
```bash
/code-review
```

**Örnek çıktı**:
```
CODE REVIEW REPORT

Kural Uyumluluğu (`CLAUDE.md`):
──────────────────────────────────────────

✓ Naming Conventions
  ✓ Dosya: kebab-case (filter-panel.tsx, use-filter.ts)
  ✓ Bileşen: PascalCase (ProductFilterPanel)
  ✓ Hook: use- prefix

✓ Props & Types
  ✓ Tüm props açık tipli
  ✓ Hiç `any` yok
  ✓ Interface'ler belirtilmiş

✓ State Management
  ✓ Sunucu verisi React Query'de ✓
  ✓ Local UI state useState'de ✓
  ✓ Redux'ta sunucu verisi yok ✓

✓ Components & Accessibility
  ✓ ErrorBoundary sarılı ✓
  ✓ Semantic HTML (<label>, <button>)
  ✓ ARIA attribute yok ama gerekli değil

✓ Styling
  ✓ Tailwind utilities only ✓
  ✓ cn() koşullu sınıflar için ✓
  ✓ Semantic color tokens ✓
  ✓ Custom CSS yok

✓ API & Services
  ✓ Base client: services/api-client.ts kullanıldı
  ✓ Query keys: fabrika pattern ✓
  ✓ Feature service: features/products/services/ ✓

❌ Hata: Bulunmadı

⚠️  Minor:
  - ProductFilterPanel'de JSDoc yok (obvious code → ok)
  - No hardcoded secrets ✓

✅ PR HAZIR COMMIT İÇİN
```

---

## Ruleset Uyumu & Token Optimizasyonu

Bu bölüm, iş akışının `CLAUDE.md` kurallarına uyumunu ve **neden token-verimli** olduğunu açıklar.

| Kural / Adım | CLAUDE.md Bölümü | Uyum Seviyesi | Token Tasarrufu Notu |
|---------------|-----------------|---------------|----------------------|
| **Plan Zorunluluk** | Workflow 1 | ✅ Tam | `/make-plan` yanlış yönde büyük diff'ler engeller. Onaylı olmadan kod = hata → rework = 3000+ token. Kontrol edilerek = 450 token plan. **Tasarrufu: 85%** |
| **smart-explore Keşif** | Workflow 2 | ✅ Tam | AST tabanlı; tam dosya okumaktan kaçar. Misal: 15 dosya × 500 satır = 1400 token; smart-explore = 280 token. **Tasarrufu: 80%** |
| **Frontend-design UI** | Workflow 3 + Components | ✅ Tam | Template-driven; boilerplate yok. Kalite garantili; manual revisyon yok. **1 tur = 320 token** (vs 3 tur = 1200) |
| **Figma Tabı** | Workflow 4 | ✅ Tam | `figma-use` load kuralı; hata / retry yok. Doğrudan çıktı. |
| **Paralel Uygulama** | Workflow 5 | ✅ Tam | `/do` bağımsız işleri paralel → 1 koordinasyon overhead vs 3 ayrı talep. **~400 token tasarrufu** |
| **İnceleme + Review** | Workflow 6 | ✅ Tam | `simplify` + `code-review` post-feature; hata erkenden yakalar. Tekrar turun önüne geçer. |
| **Doğrulama Gate** | Workflow 7 | ✅ Tam | Commit öncesi `pnpm build && pnpm lint` zorunlu. CI hataları engeller. |

### Token Kullanımı — Örnek Senaryo

**Senaryo**: "Ürün filtreleme özelliği ekle"

#### ❌ **Token Verimsiz Yol** (plan yok):
```
1. Doğrudan kod yaz                        → 800 token (5 dosya)
2. User "bu yanlış yönde" der              → rework
3. Dosyaları oku + fark analiz             → 1400 token
4. Yeniden yaz                             → 900 token
5. smart-explore yapışın fark isteme       → 850 token
6. Kontrol + tekrar                        → 600 token
─────────────────────────────────────────
Toplam:                                    ~5400 token + bekleme süresi
```

#### ✅ **Token Verimli Yol** (ruleset'e uygun):
```
1. /make-plan                              → 450 token
2. User onayı                              → 0 token (sadece kapat)
3. /smart-explore (misal varsa bakma)      → 280 token
4. /do (paralel 3 subagent)                → 600 token
5. /simplify                               → 340 token
6. /code-review                            → 300 token
7. pnpm build && pnpm lint                 → 0 token (lokal)
─────────────────────────────────────────
Toplam:                                    ~2000 token (63% tasarrufu)
```

**Neden 63% tasarrufu?**
1. Plan → hatalı yön yoktur (big if saved)
2. smart-explore → satır değil yapı arar (80% tasarrufu)
3. Paralel → 1 talep vs 3 talep
4. İlk tur doğru → tekrar yok

### mem-search — Hatırlı Çözümler

Aynı sorunu bir kez çözdü; ikinci kez sıfırdan koduyor musunuz?

**Örnek**:
```bash
/mem-search "Form validation with react-hook-form and Zod"
```

Döner:
```
✓ #S45 (Apr 3) — Form validation patterns
  files: features/auth/components/login-form.tsx
  schema: zod + react-hook-form
  cost: 0 token (memory hit)
  vs rereading old code: ~600 token
```

**Token Tasarrufu**: 1 araştırma + karar tutulursa; tekrarlar 70% azalır.

---

## Çıktı Özeti

| Durumu / Örnek | Skill | Çıktı Türü | Token |
|---|---|---|---|
| Başlangıç | `make-plan` | Adımlar + Onay | 450 |
| "X nerede?" | `smart-explore` | Dosyalar + Pattern | 280 |
| Bileşen | `frontend-design` | .tsx + REGISTRY update | 320 |
| Tasarımdan | `figma-implement-design` | .tsx (pixel perfect) | 600 |
| Tamamla | `do` (paralel) | Tüm dosyalar | 600 |
| Iyileştir | `simplify` | Refactor önerileri | 340 |
| Kontrol | `code-review` | Uyum raporu | 300 |
| **Toplam** | — | — | **~2890** |

**Versus trial-error**: ~5400 token.  
**Tasarrufu**: 46% + deterministic kalite.

---

## Kurallı İş Akışı — Özet Tablo

### Hangi Durumda Hangi Skill?

| Soru / Durumu | Skill | Örnek |
|---|---|---|
| "Büyük bir özellik başlayacağım, nasıl başlasam?" | `/make-plan` | `/make-plan Karttan ödeme, Stripe entegrasyonu` |
| "Filtre hook'u nerede yazılı?" | `/smart-explore` | `/smart-explore Filter hook'ları ve kullanımları` |
| "Bu buttonun state'i nasıl yönetilebilir?" | `CLAUDE.md` + code | İç mantık değilse design değilse → code-review |
| "Figma'daki tasarım kodu olsun" | `/figma-use`, sonra `/figma-implement-design` | Login sayfası tasarımı var |
| "Planı yazıp onayladık, şimdi code yaz" | `/do` | `/do Sipariş filtresi planını uygula` |
| "Kod bitmdi, iyileştir" | `/simplify` | `/simplify` (hiçbir paramettre) |
| "Commit öncesi bir kontrol et" | `/code-review` | `/code-review` |
| "Hata çözmek, yanlış mı yapıyorum?" | `mem-search` | `/mem-search Error handling patterns` |
| "Commit et" | `git commit` | `git commit -m "feat: add product filtering"` |

---

## Checklist — Yeni Özellik

```markdown
□ /make-plan başlat
□ User onayı bekle (değiştir / onayla)
□ /smart-explore varsa benzer pattern ara
□ /do ile uygula (paralel subagents)
□ /simplify çalıştır
□ /code-review çalıştır
□ pnpm build && pnpm lint (lokal, hata varsa düzelt)
□ git commit -m "feat: …" (conventional commit)
□ git push
```

---

## Kural Dosyaları — `.claude/` Rehberi

Bu projede 7 kural dosyası vardır. Her biri farklı bir amaca hizmet eder ve farklı zamanlarda yüklenir.

### Sorumluluk Haritası

```
CLAUDE.md                  ← Her konuşmada otomatik yüklenir
  │                           Tüm kuralların TEK kaynağı
  │
  ├── .claude/PATTERNS.md  ← UI/service yazmadan önce okunur
  │                           Kod örnekleri (component, query, service, SEO)
  │
  ├── .claude/REGISTRY.md  ← UI yazmadan önce okunur
  │                           Saf component kataloğu (50+ shadcn + shared)
  │
  ├── .claude/design-system-rules.md  ← UI oluştururken okunur
  │                           Görsel tokenlar (renk, font, spacing, composition)
  │
  ├── .claude/form-rules.md  ← Form dosyalarında otomatik yüklenir (globs)
  │                             react-hook-form + zod pattern'leri
  │
  └── .claude/skills/
      ├── page.md           ← /page komutuyla yüklenir
      │                       Route scaffold (page + loading + error + not-found)
      └── scaffold.md       ← /scaffold komutuyla yüklenir
                              Feature scaffold (types + services + components + route)
```

### 1. `CLAUDE.md` — Ana Kural Kaynağı

**Ne yapar:** Stack, naming, component kuralları, state management, API layer, styling, git, workflow, quality — tüm kuralların tek kaynağı.

**Ne zaman yüklenir:** Her konuşmada otomatik.

**Diğer dosyalar bunu referans eder**, kendisi kural tekrarlamaz.

```
Örnek senaryo: "Button'u Link olarak kullanmam lazım"
→ CLAUDE.md:58 der ki: "base-vega style: use render prop (NOT asChild)"
→ Kod:
  <Button render={<Link href="/users" />}>Users</Button>
```

---

### 2. `.claude/PATTERNS.md` — Kod Örnekleri

**Ne yapar:** Component, React Query (GET/mutation), service kullanımı, types, SEO metadata örnekleri. Kural koymaz — CLAUDE.md'ye referans verir.

**Ne zaman okunur:** UI veya service yazmadan önce.

```
Örnek senaryo: "Yeni bir feature için service dosyası yazacağım"
→ PATTERNS.md'deki React Query pattern'ini takip et:
  1. Service function (pure fetch, no hooks)
  2. useQuery/useMutation hook (wraps service)
  3. Component'te kullan (loading → Skeleton, error → inline, empty → Empty)
```

```
Örnek senaryo: "Yeni feature checklist'i ne?"
→ PATTERNS.md New Feature Checklist:
  1. types/index.ts → 2. validations/ → 3. services/ → 4. components/
  5. app/[name]/ (page + loading + error + not-found)
  6. store/ (rare) → 7. shared + REGISTRY update
```

---

### 3. `.claude/REGISTRY.md` — Component Kataloğu

**Ne yapar:** Projede mevcut 50+ shadcn/ui ve 2 shared component'in listesi. Import path'leri ve ne için kullanılacağı.

**Ne zaman okunur:** UI yazmadan önce — ham HTML yerine mevcut component kullan.

```
Örnek senaryo: "Dropdown menü lazım"
→ REGISTRY.md'de bak:
  | DropdownMenu | Action menus | @/components/ui/dropdown-menu |
→ Ham <select> veya custom div YAZMA, mevcut component'i kullan.
```

```
Örnek senaryo: "Yeni shared component ekledim"
→ REGISTRY.md'yi güncelle: name, path, props, usage example ekle.
```

---

### 4. `.claude/design-system-rules.md` — Görsel Tasarım Tokenları

**Ne yapar:** Renk sistemi (10 semantic token), tipografi (6 seviye), font bilgisi, spacing, border radius, shadow, responsive breakpoint'ler, component composition kuralları, görsel anti-pattern'ler.

**Ne zaman okunur:** UI oluştururken.

```
Örnek senaryo: "Card'a arka plan rengi vereceğim"
→ design-system-rules.md der ki:
  ❌ bg-blue-500 (raw color)
  ✅ bg-card (semantic token, dark mode otomatik)
```

```
Örnek senaryo: "Loading state nasıl gösterilir?"
→ design-system-rules.md Component Composition Rules:
  - Sayfa/bölüm yükleniyorsa → Skeleton
  - Button submit / inline fetch → Spinner (client-only)
```

```
Örnek senaryo: "Icon boyutu ne olmalı?"
→ design-system-rules.md:
  - Metin içi (inline) → size-4
  - Tek başına (standalone) → size-5
  - Import: CLAUDE.md'deki client/server ayrımına bak
```

---

### 5. `.claude/form-rules.md` — Form Pattern'leri

**Ne yapar:** react-hook-form + zod pattern'leri. Schema location, single form, multi-step wizard, validation display, forbidden practices.

**Ne zaman yüklenir:** Form dosyalarıyla çalışırken **otomatik** (globs: `*Form*`, `*form*`, `steps/`, `validations/`, `*.schema.ts`).

```
Örnek senaryo: "Login formu yazacağım"
→ form-rules.md otomatik yüklenir ve der ki:
  1. Schema: features/auth/validations/login-schema.ts
     - Zod schema + inferred type + defaults export et
  2. Form: useForm<LoginInput> + zodResolver + defaultValues
  3. Validation: aria-describedby ile inline error (toast YASAK)
  4. Submit: isSubmitting sırasında Spinner göster
  5. Debug: <FormValidationDebugger methods={methods} /> ekle
```

```
Örnek senaryo: "Multi-step onboarding wizard"
→ form-rules.md wizard pattern:
  - Her step = ayrı component (steps/ klasörü)
  - Her step = ayrı zod schema (validations/ klasörü)
  - Step component prop: UseFormReturn<StepInput> (typed!)
  - Orchestrator: useState ile step yönetimi
```

---

### 6. `.claude/skills/page.md` — `/page` Komutu

**Ne yapar:** Yeni route sayfası oluşturur: `page.tsx` + `loading.tsx` + `error.tsx` + `not-found.tsx`.

**Ne zaman kullanılır:** Sadece route dosyaları gerektiğinde (feature yapısı olmadan).

```
Örnek:
  /page dashboard
  → app/dashboard/page.tsx      (metadata export'lu)
  → app/dashboard/loading.tsx   (Skeleton tabanlı)
  → app/dashboard/error.tsx     ('use client', reset button)
  → app/dashboard/not-found.tsx (404 fallback)

  /page settings/profile
  → app/settings/profile/page.tsx + loading + error + not-found
```

---

### 7. `.claude/skills/scaffold.md` — `/scaffold` Komutu

**Ne yapar:** Tam feature yapısı + route dosyaları oluşturur. Route dosyaları için page.md template'lerini kullanır.

**Ne zaman kullanılır:** Yeni feature başlatırken (types + services + components + route).

```
Örnek:
  /scaffold auth
  → features/auth/
      types/index.ts              (Auth interface + Create/Update input)
      services/auth-service.ts    (CRUD hooks: useAuths, useAuth, useCreateAuth...)
      components/                 (boş, manuel doldurulur)
      hooks/                      (boş)
      validations/                (boş)
  → app/auth/
      page.tsx + loading.tsx + error.tsx + not-found.tsx
```

---

### Hangi Durumda Hangi Dosya?

| Durum | Oku |
|-------|-----|
| Herhangi bir kod yazacağım | CLAUDE.md (otomatik yüklü) |
| UI component yazacağım | + REGISTRY.md + PATTERNS.md |
| Görsel stil kararı vereceğim | + design-system-rules.md |
| Form yazacağım | + form-rules.md (otomatik yüklenir) |
| Yeni route oluşturacağım | `/page <route>` |
| Yeni feature başlatacağım | `/scaffold <name>` |
| Shared component ekledim | REGISTRY.md'yi güncelle |