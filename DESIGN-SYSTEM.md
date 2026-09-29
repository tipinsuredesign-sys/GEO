# TIPINSURE Design System — Portable Spec

A self-contained, copy-paste-ready design system extracted from the TIPINSURE landing pages.
Drop this into any **Next.js (App Router) + TypeScript + Tailwind CSS** project to reproduce
the same look, feel, and component patterns.

> Verified against the live project source: `tailwind.config.ts`, `app/globals.css`,
> `app/layout.tsx`, `components/ui/*`, `components/shared/*`, `package.json`.

---

## 0. Tech Stack

| Concern | Choice | Version (pinned in this project) |
|---|---|---|
| Framework | Next.js (App Router) | `14.2.5` |
| Language | TypeScript | `^5.5.3` |
| Styling | Tailwind CSS | `^3.4.6` |
| Animation | framer-motion | `^11.3.8` |
| Icons | lucide-react | `^0.417.0` |
| Variants | class-variance-authority | `^0.7.0` |
| Class merge | clsx + tailwind-merge | `^2.1.1` / `^2.4.0` |
| Tailwind anim | tailwindcss-animate | `^1.0.7` |
| Primitives | @radix-ui (accordion, dialog, select, slot, label) | see below |
| Font | Noto Sans Thai (Google, via `next/font`) | — |

### Install

```bash
npm i next@14.2.5 react@^18.3.1 react-dom@^18.3.1 \
  framer-motion@^11.3.8 lucide-react@^0.417.0 \
  class-variance-authority@^0.7.0 clsx@^2.1.1 tailwind-merge@^2.4.0 tailwindcss-animate@^1.0.7 \
  @radix-ui/react-accordion@^1.2.0 @radix-ui/react-dialog@^1.1.1 \
  @radix-ui/react-select@^2.1.1 @radix-ui/react-slot@^1.1.0 @radix-ui/react-label@^2.1.0

npm i -D tailwindcss@^3.4.6 postcss@^8.4.39 autoprefixer@^10.4.19 typescript@^5.5.3 \
  @types/node @types/react @types/react-dom
```

---

## 1. Design Tokens

These are the **exact** values from `tailwind.config.ts`. Never hardcode hex in components — always use the token.

### Colors

| Token (class) | Hex | Usage |
|---|---|---|
| `primary` (DEFAULT / 600) | `#1E22AA` | Brand color — links, headings, nav (stuck), brand button |
| `primary-50` | `#eef0ff` | Subtle tint background |
| `primary-100` | `#dfe1ff` | Light labels on dark bg |
| `primary-700` | `#1a1d8c` | Hover of brand |
| `primary-800` | `#14166b` | Active / pressed, ghost text |
| `primary-900` | `#0a0c3a` | Hero overlay, footer, CTA gradient base |
| `accent` (DEFAULT) | `#E1261B` | **Primary CTA (red)**, required `*`, error, badge dot |
| `accent-600` | `#bd1d14` | Hover of accent |
| `accent-soft` | `#fde7e6` | Soft error/alert background |
| `ink` (DEFAULT) | `#0b1020` | Primary text (body, headings) |
| `ink-soft` | `#5b6275` | Secondary text (descriptions, leads) |
| `ink-faint` | `#858ca0` | Faint text (hints, captions) |
| `muted` | `#f5f6fb` | Alternating section background |
| `line` | `#e9ebf2` | Borders, dividers |
| `surface` | `#ffffff` | Card / form background |
| Body background | `#fbfbfd` | Set in `globals.css`, not a token |

> **Key correction vs. common assumption:** the default CTA button is **accent red (`#E1261B`)**, and the blue brand button is the `brand` variant. See §4.1.

### Brand gradient (text)

```css
/* utility: .text-gradient (defined in globals.css) */
background-image: linear-gradient(to right, #1E22AA, #1a1d8c, #E1261B);
-webkit-background-clip: text;
background-clip: text;
color: transparent;
```

### Border radius

| Class | Value |
|---|---|
| `rounded-sm` | `12px` |
| `rounded-md` | `18px` |
| `rounded-lg` | `26px` |
| `rounded-xl` | `34px` |
| `rounded-full` | pill / circle |

### Shadows

| Class | Value | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(16,24,64,.06), 0 2px 6px rgba(16,24,64,.04)` | Resting cards |
| `shadow-md` | `0 10px 30px rgba(16,24,64,.08), 0 2px 8px rgba(16,24,64,.04)` | Hover cards |
| `shadow-lg` | `0 30px 70px rgba(16,24,64,.14), 0 8px 20px rgba(16,24,64,.06)` | Modals, dropdowns |
| `shadow-glow` | `0 24px 60px rgba(30,34,170,.28)` | Featured CTA panel glow |

### Container

- Centered, padding `1.5rem` (24px), max-width `1180px` at `2xl`.
- Use the `container` class on every section wrapper.

---

## 2. Typography

- Font family: **Noto Sans Thai** loaded via `next/font/google` and exposed as CSS var `--font-noto-thai`; Tailwind `font-sans` maps to it.
- Weights loaded: `400, 500, 600, 700, 800`.
- Body sets `font-feature-settings: "ss01"`.

| Role | Classes |
|---|---|
| H1 (hero) | `text-[clamp(2.4rem,5.4vw,4.2rem)] font-extrabold leading-[1.05] tracking-tight` |
| H2 (section) | `text-[clamp(2rem,4.4vw,3.3rem)] font-bold leading-[1.06] tracking-tight` |
| H3 (card) | `text-lg font-bold tracking-tight` (up to `text-xl`) |
| Lead / subtitle | `text-[clamp(1.02rem,1.5vw,1.18rem)] text-ink-soft` |
| Kicker / label | `text-xs font-bold uppercase tracking-[0.14em] text-primary` |
| Body | base 16px, `leading-relaxed` (~1.6–1.75) |

Use `.text-balance` (utility in globals.css) on headings for nicer wrapping.

---

## 3. Config Files (copy verbatim)

### `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1180px" } },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1E22AA", foreground: "#ffffff",
          50: "#eef0ff", 100: "#dfe1ff", 600: "#1E22AA",
          700: "#1a1d8c", 800: "#14166b", 900: "#0a0c3a",
        },
        accent: { DEFAULT: "#E1261B", foreground: "#ffffff", 600: "#bd1d14", soft: "#fde7e6" },
        muted: { DEFAULT: "#f5f6fb", foreground: "#5b6275" },
        ink: { DEFAULT: "#0b1020", soft: "#5b6275", faint: "#858ca0" },
        line: "#e9ebf2",
        surface: "#ffffff",
      },
      fontFamily: { sans: ["var(--font-noto-thai)", "system-ui", "sans-serif"] },
      borderRadius: { sm: "12px", md: "18px", lg: "26px", xl: "34px" },
      boxShadow: {
        sm: "0 1px 2px rgba(16,24,64,.06), 0 2px 6px rgba(16,24,64,.04)",
        md: "0 10px 30px rgba(16,24,64,.08), 0 2px 8px rgba(16,24,64,.04)",
        lg: "0 30px 70px rgba(16,24,64,.14), 0 8px 20px rgba(16,24,64,.06)",
        glow: "0 24px 60px rgba(30,34,170,.28)",
      },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        marquee: { to: { transform: "translateX(-50%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.16,1,.3,1)",
        marquee: "marquee 32s linear infinite",
        float: "float 5s ease-in-out infinite",
        "accordion-down": "accordion-down .25s ease-out",
        "accordion-up": "accordion-up .25s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 8%;
    --border: 228 30% 93%;
    --input: 228 30% 93%;
    --ring: 238 70% 39%;
    --radius: 0.75rem;
  }
  * { @apply border-border; }
  html { scroll-behavior: smooth; }
  body {
    @apply bg-[#fbfbfd] text-ink antialiased;
    font-feature-settings: "ss01";
  }
  ::selection { @apply bg-primary text-white; }
}

@layer utilities {
  .text-balance { text-wrap: balance; }
  .text-gradient { @apply bg-gradient-to-r from-primary via-primary-700 to-accent bg-clip-text text-transparent; }
  .mask-fade-x {
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

### `app/layout.tsx` (font wiring)

```tsx
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-thai",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={notoThai.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

> Swap `Noto_Sans_Thai` for any `next/font` family; just keep the `--font-noto-thai` variable name
> (or rename it in both `layout.tsx` and `tailwind.config.ts`).

### `lib/utils.ts` (the `cn` helper — used everywhere)

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 4. Core Components (copy verbatim)

### 4.1 `components/ui/button.tsx`

Variants: `primary` (red CTA, **default**), `brand` (blue), `ghost`, `light` (on dark), `outline`.
Sizes: `default`, `sm`, `lg`, `icon`. Supports `asChild` (via Radix Slot) to render an `<a>`.

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white shadow-[0_8px_20px_rgba(225,38,27,.28)] hover:bg-accent-600 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(225,38,27,.34)]",
        brand: "bg-primary text-white shadow-[0_8px_20px_rgba(30,34,170,.28)] hover:bg-primary-700 hover:-translate-y-0.5",
        ghost: "bg-primary/[.04] text-primary-800 ring-1 ring-inset ring-line hover:bg-primary/[.07] hover:-translate-y-0.5",
        light: "bg-white/10 text-white ring-1 ring-inset ring-white/15 hover:bg-white/20",
        outline: "border border-line bg-transparent text-ink hover:bg-muted",
      },
      size: {
        default: "h-11 px-5 text-[.98rem]",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 text-[1.05rem]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

Usage:

```tsx
<Button asChild size="lg"><a href="/buy">เช็คราคา</a></Button>       {/* red CTA */}
<Button variant="brand">ดูแผนทั้งหมด</Button>                        {/* blue */}
<Button asChild size="lg" variant="light"><a href="#plans">ดูความคุ้มครอง</a></Button>
```

### 4.2 `components/shared/reveal.tsx` (scroll-in animation)

```tsx
"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Reveal({
  children, className, delay = 0, as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "span" | "figure";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
```

### 4.3 `components/shared/section-head.tsx`

```tsx
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function SectionHead({
  kicker, title, lead, light = false, className,
}: {
  kicker?: string;
  title: React.ReactNode;
  lead?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("mx-auto mb-12 max-w-2xl text-center md:mb-16", className)}>
      {kicker && (
        <span className={cn("mb-4 inline-block text-xs font-bold uppercase tracking-[0.14em]", light ? "text-primary-100" : "text-primary")}>
          {kicker}
        </span>
      )}
      <h2 className={cn("text-balance text-[clamp(2rem,4.4vw,3.3rem)] font-bold leading-[1.06] tracking-tight", light ? "text-white" : "text-ink")}>
        {title}
      </h2>
      {lead && (
        <p className={cn("mt-4 text-[clamp(1.02rem,1.5vw,1.18rem)]", light ? "text-white/75" : "text-ink-soft")}>
          {lead}
        </p>
      )}
    </Reveal>
  );
}
```

### 4.4 Icon convention (lucide-react)

Use a small typed wrapper so data files can reference icons by string name:

```tsx
// components/shared/icon.tsx
import { HeartPulse, Shield, /* ...import what you use */ type LucideProps } from "lucide-react";

const MAP = {
  "heart-pulse": HeartPulse,
  shield: Shield,
  // add each icon you reference from data files
} as const;

export type IconName = keyof typeof MAP;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = MAP[name];
  return <Cmp {...props} />;
}
```

- Feature icons: `strokeWidth={1.6}`, size `h-7 w-7`, in a `h-14 w-14 rounded-md bg-primary/[.07] text-primary` container.
- Inline icons: `h-5 w-5`; small: `h-4 w-4`.
- **Pin lucide-react to `0.417.0`** — some icon names differ across versions (e.g. this version does not export `UserLock`, `HouseWifi`, `DatabaseBackup`, `MessageCircleWarning`).

---

## 5. Reusable Class Recipes

### Card (resting → interactive)

```
rounded-xl border border-line bg-surface p-7 shadow-sm
/* interactive: */ transition-all hover:-translate-y-1.5 hover:shadow-lg
```

### Feature icon chip

```
mb-5 inline-flex h-14 w-14 items-center justify-center rounded-md bg-primary/[.07] text-primary
/* hover on group: */ group-hover:bg-primary group-hover:text-white
```

### Kicker badge (on dark hero)

```
inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15
px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur-sm
```

### Form label + required mark

```tsx
<label className="mb-1.5 block text-sm font-semibold text-ink-soft">
  ชื่อ-นามสกุล <span className="text-accent">*</span>
</label>
```

### Notes / alert box

```
flex items-center gap-3 rounded-lg bg-accent-soft px-4 py-3
  → icon: text-accent, text: text-sm font-medium text-accent
```

### Comparison table (sticky first column + brand header)

```
head row:  bg-gradient-to-r from-primary-900 to-primary-700 text-white
first col: sticky left-0 z-10 (match row bg)
rows:      alternate bg-surface / bg-muted/30
group row: bg-primary/[.06] text-primary font-bold (full-width colSpan)
total row: border-t-2 border-primary/30 bg-accent-soft/40, values text-primary font-extrabold
```

---

## 6. Page Anatomy

Standard landing-page section order (alternate `bg` white ↔ `bg-muted`):

```
StickyNav (fixed, blur when scrolled)
 └ Hero            full-bleed image + primary-900/74 overlay + gradient, max-w-2xl white text, 2 CTAs
 └ Intro + Stats   container, centered copy + 4-up stat grid in a bordered card
 └ Highlights      bg-muted, 4-up card grid (primary/[.03] tinted cards)
 └ Coverage/Feature container, 3-up card grid (hover-lift)
 └ Plans           bg-muted, plan cards (featured card: border-primary/40 ring)
 └ Compare table   container, merged benefit + premium table
 └ Conditions      bg-muted, checklist inside bordered card + accent alert box
 └ FAQ             container, Radix Accordion, max-w-3xl
 └ Advisor / CTA   gradient panel from-primary-900 via-primary-700 to-primary, shadow-glow, lead form
Footer             bg-primary-900, multi-column
```

### Hero recipe

```
section: relative min-h-[640px] lg:min-h-[760px] overflow-hidden
img:     absolute inset-0 h-full w-full object-cover  (loading="eager" fetchPriority="high")
overlay: absolute inset-0 bg-primary-900/74
gradient: absolute inset-0 bg-gradient-to-r from-primary-900/60 via-transparent to-transparent
content: container relative flex items-center pt-28 pb-20  (max-w-2xl text-white)
h1:      text-[clamp(2.4rem,5.4vw,4.2rem)] font-extrabold leading-[1.05] tracking-tight
         [text-shadow:0_2px_24px_rgba(10,12,58,.5)]
entrance: framer-motion initial{opacity:0,y:28} animate{opacity:1,y:0} duration 0.7 ease [0.16,1,0.3,1]
```

### Featured CTA panel recipe

```
relative grid items-center gap-12 overflow-hidden rounded-xl
bg-gradient-to-br from-primary-900 via-primary-700 to-primary p-9 md:p-16 shadow-glow md:grid-cols-2
+ decorative blob: absolute -right-16 -top-24 h-96 w-96 rounded-full
  bg-[radial-gradient(circle,rgba(116,121,242,.35),transparent_65%)] blur-xl
```

---

## 7. Motion Reference

| Effect | Where | Values |
|---|---|---|
| Fade-up on scroll | Section content | `Reveal` (opacity 0→1, y 28→0, 0.7s, ease `[0.16,1,0.3,1]`, once) |
| Hero entrance | Hero text/form | same easing, `animate` (not scroll-triggered) |
| Hover lift | Cards | `hover:-translate-y-1.5 hover:shadow-lg` |
| Accordion | FAQ | `accordion-down/up .25s ease-out` (Radix + keyframes) |
| Float | Decorative | `animation: float 5s ease-in-out infinite` |
| Marquee | Logo strips | `animation: marquee 32s linear infinite` + `.mask-fade-x` |

Always honor `prefers-reduced-motion` (handled globally in `globals.css`).

---

## 8. Responsive Breakpoints

| BP | Min width | Typical shift |
|---|---|---|
| base | — | single column, stacked |
| `sm` | 640px | 2-col grids begin |
| `md` | 768px | larger section padding (`py-20`→`py-28`), `p-9`→`p-16` |
| `lg` | 1024px | 2-col hero, 3–4-col grids, desktop nav |
| `2xl` | 1180px | container max-width caps |

Mobile-first always. Section vertical rhythm: `py-20 md:py-28`.

---

## 9. File / Folder Convention

```
app/
  layout.tsx            ← font + <html>/<body>, global metadata
  globals.css           ← tokens (CSS vars) + base + utilities
  [feature]/
    page.tsx            ← Server component: metadata + <Nav/> + <Content/> + <Footer/>
    content.tsx         ← "use client": interactive sections
components/
  ui/                   ← primitives: button, input, accordion, select, sheet, label
  shared/               ← reveal, section-head, icon, site-nav (reusable across features)
  sections/[feature]/   ← feature-specific composed sections (e.g. sticky-nav)
lib/
  utils.ts              ← cn()
  data-[feature].ts     ← typed content (plans, coverages, FAQs) — no JSX
  data.ts               ← shared types (e.g. IconName)
```

Pattern: **page = server (SEO + shell), content = client (interactions)**; all copy/numbers live in `lib/data-*.ts`, never inline in JSX.

---

## 10. Conventions / Guardrails

**Do**
- Use color tokens only — never raw hex or off-palette Tailwind colors (`blue-500`, `gray-300`).
- Wrap every section body in `container`.
- Alternate section backgrounds white ↔ `bg-muted`.
- Use `Reveal` for scroll reveals and `SectionHead` for section intros.
- Keep prices/labels/FAQs in `lib/data-*.ts`; keep JSX presentational.
- Give hero an image + `primary-900` overlay.
- Pin `lucide-react` to `0.417.0` and register icons in the `Icon` map.

**Don't**
- Hardcode `font-family` (use `font-sans` → the font CSS var).
- Inline styles except truly dynamic values (e.g. `style={{ width: progress% }}`).
- Duplicate a component that already exists in `components/shared` or `components/ui`.
- Ship a section without a mobile layout.

---

## 11. New Page Checklist

1. `app/<feature>/page.tsx` — metadata, `<StickyNav/>`, `<Content/>`, `<Footer/>`.
2. `app/<feature>/content.tsx` — `"use client"`, compose sections.
3. `lib/data-<feature>.ts` — typed data (plans, coverages, FAQs, premium rows).
4. `components/sections/<feature>/sticky-nav.tsx` — section anchor links + buy URL.
5. Follow section order in §6; alternate backgrounds.
6. All prices/labels use real words (e.g. write the currency word after the amount).
7. Verify build + open in browser before shipping.

---

*Portable spec generated from the TIPINSURE project. Copy §3 config files, §4 components, and `lib/utils.ts` into a fresh Next.js app to bootstrap the same design system.*
