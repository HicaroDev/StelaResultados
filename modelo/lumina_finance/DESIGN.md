---
name: Lumina Finance
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#fbabff'
  on-tertiary: '#580065'
  tertiary-container: '#e14ef6'
  on-tertiary-container: '#4d0059'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffd6fd'
  tertiary-fixed-dim: '#fbabff'
  on-tertiary-fixed: '#36003e'
  on-tertiary-fixed-variant: '#7c008e'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-padding: 64px
---

## Brand & Style

The brand identity centers on "Illuminated Intelligence"—the idea of bringing clarity to complex financial data through a high-tech, immersive interface. The design system targets tech-forward investors and financial analysts who value precision and a premium aesthetic.

The visual style is a fusion of **Glassmorphism** and **Corporate Modernism**. It utilizes deep layers to create a sense of vast space, where data floats on translucent surfaces. The emotional response is one of sophisticated control, security, and forward-thinking innovation. The UI avoids "flatness," instead using light refraction and depth to guide the user's eye toward critical financial insights.

## Colors

The palette is optimized for a high-contrast dark mode environment. The foundation is a **Deep Indigo** (`#020617`), providing a stable, expansive base that reduces eye strain.

- **Primary (Electric Violet):** Used for primary CTAs and critical status indicators. It signifies action and energy.
- **Secondary (Neon Cyan):** Reserved for growth metrics, success states, and interactive data points.
- **Tertiary (Magenta Spark):** Used sparingly for secondary data series or alerts to ensure visual distinction in complex charts.
- **Surface Tints:** Use varying opacities of the neutral palette to create the glass effect, typically ranging from 40% to 60% opacity with a heavy background blur.

## Typography

This design system employs a dual-font strategy to balance character with utility. **Plus Jakarta Sans** is used for headlines to provide a modern, slightly geometric personality that feels tech-centric. **Inter** is used for all body text, labels, and data displays due to its exceptional legibility at small sizes and its neutral, "systematic" tone.

For financial figures and data tables, use the `data-mono` style with tabular numbers (tnum) enabled to ensure vertical alignment of digits across rows, which is essential for rapid scanning of balance sheets and tickers.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for dashboard views, transitioning to a centralized fixed-width column for settings or document-heavy pages. 

The spacing rhythm is built on an **8px base unit**. Dashboards should prioritize generous "negative space" between glass cards to prevent the UI from feeling cluttered. Use `stack-lg` for separating major functional groups and `stack-md` for internal component spacing. Margins should remain consistent at 24px on desktop to provide a "breathable" frame for the floating elements.

## Elevation & Depth

Depth is the defining characteristic of this design system. We use a **Glassmorphism** model rather than traditional shadows:

1.  **Backdrop Blur:** Every card and modal must apply a `blur(12px)` to the content beneath it.
2.  **Translucency:** Surfaces use a background color of `rgba(30, 41, 59, 0.5)`.
3.  **Inner Glow:** To define edges without heavy borders, use a 1px top and left inner border (stroke) in a high-opacity white or primary color (e.g., `rgba(255, 255, 255, 0.1)`) to simulate light hitting the edge of the glass.
4.  **Shadows:** Use very large, very soft ambient shadows (`blur: 40px`, `spread: -10px`) with a slight indigo tint (`#000000` at 40% opacity) to lift cards off the background.

## Shapes

The shape language is consistently **Rounded**, reflecting a friendly yet professional demeanor. Standard components like input fields and small buttons use a 0.5rem radius. Larger "glass" containers and dashboard cards use a 1rem (`rounded-lg`) radius to emphasize their structural importance. 

Avoid sharp corners entirely, as they conflict with the soft light-refraction properties of the glass effects. Decorative elements or "tags" may use the pill-shape for maximum distinction.

## Components

### Buttons & CTAs
- **Primary:** Solid gradient from Neon Purple to Cyan. High contrast, white text.
- **Secondary:** Transparent background with a 1px Electric Violet border and subtle hover glow.
- **Ghost:** No border, Plus Jakarta Sans medium weight, used for low-priority navigation.

### Glass Cards
The primary container. Must feature a subtle 1px border (`rgba(255,255,255,0.05)`) and a background blur. Header sections within cards should be separated by a thin, low-opacity divider.

### Data Visualization
- **Line Charts:** Use "Neon Cyan" for the primary data line with a "Glow" effect (a drop shadow of the same color). Area charts should use a vertical gradient from the line color to transparent.
- **Bar Graphs:** Use rounded caps (radius: 4px) on the top of bars. Use "Electric Violet" for the primary series.
- **Tooltips:** Miniature glass cards with `label-sm` typography.

### Inputs & Selects
Dark backgrounds (`#0F172A`) with a subtle 1px border. On focus, the border should glow with the "Primary" color and the box-shadow should expand slightly.

### Progress & Status
Use "Neon Cyan" for positive growth/success and "Magenta Spark" for alerts or negative trends. Status chips should be semi-transparent with highly saturated text for readability.