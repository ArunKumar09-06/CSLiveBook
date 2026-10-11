# CSF Livebook — Design System & Visual Specification

## 1. Aesthetic Direction: "Aurora on Deep Space"
CSF Livebook employs a cinematic, dark-first visual language inspired by modern developer products (Linear, Stripe, Vercel) combined with the engaging progression loops of Duolingo.

### Signature Techniques:
- **Base Canvas**: Deep space dark (`#05060F`, `#0B0D1E`, `#12152B`).
- **Glassmorphic Depth**: `background: rgba(255, 255, 255, 0.06)`, `backdrop-filter: blur(20px) saturate(140%)`, 1px subtle borders (`rgba(255, 255, 255, 0.12)`).
- **Luminous Aurora Glows**: Ambient floating blurred gradient spheres providing chromatic depth behind hero, auth, and lesson views.
- **Grain & Micro-texture**: A subtle SVG noise overlay at 3.5% opacity prevents flat digital sterility.
- **3D Parallax & Glare**: Cards feature tilt motion and specular reflections using CSS 3D transforms.

---

## 2. Token Matrix

### 2.1 Base Colors & Canvas
| Token | Dark (Default) | Light Mode |
|---|---|---|
| `--bg-0` | `#05060F` | `#F8FAFC` |
| `--bg-1` | `#0B0D1E` | `#F1F5F9` |
| `--bg-2` | `#12152B` | `#E2E8F0` |
| `--text-primary` | `#F5F7FF` | `#0F172A` |
| `--text-secondary`| `#A9B1D6` | `#475569` |
| `--text-muted` | `#6B7399` | `#94A3B8` |
| `--surface-glass` | `rgba(255, 255, 255, 0.06)` | `rgba(255, 255, 255, 0.75)` |
| `--surface-border`| `rgba(255, 255, 255, 0.12)` | `rgba(0, 0, 0, 0.08)` |

### 2.2 Brand Gradients
- **Brand Aurora**: `linear-gradient(135deg, #7C3AED 0%, #4F46E5 30%, #06B6D4 65%, #34D399 100%)`
- **Hero Text**: `linear-gradient(90deg, #C4B5FD, #60A5FA, #22D3EE)`
- **Primary CTA**: `linear-gradient(135deg, #8B5CF6, #EC4899)` with box-shadow `0 10px 40px -10px rgba(139,92,246,0.6)`
- **Streak Flame**: `linear-gradient(90deg, #FB923C, #F43F5E)`

---

## 3. Per-Subject Color Identifiers
Every subject in the curriculum possesses a unique gradient signature utilized across subject cards, roadmap headers, progress rings, and 3D accent lights:

1. **DBMS & SQL**: Cyan &rarr; Blue (`#22D3EE` &rarr; `#3B82F6`)
2. **Object-Oriented Programming**: Violet &rarr; Fuchsia (`#8B5CF6` &rarr; `#D946EF`)
3. **Operating Systems**: Orange &rarr; Rose (`#FB923C` &rarr; `#F43F5E`)
4. **Computer Networks**: Emerald &rarr; Teal (`#34D399` &rarr; `#14B8A6`)
5. **DevOps & Software Delivery**: Amber &rarr; Orange (`#FBBF24` &rarr; `#F97316`)
6. **Computer Architecture**: Sky &rarr; Slate (`#38BDF8` &rarr; `#64748B`)
7. **System Design Fundamentals**: Indigo &rarr; Purple (`#6366F1` &rarr; `#A855F7`)
8. **GenAI & AI Fundamentals**: Pink &rarr; Violet (`#F472B6` &rarr; `#8B5CF6`)

---

## 4. Typography Scale
- **Display Headings**: **Sora** (bold tracking, geometric clarity, fluid clamp sizing).
- **Body & Explanations**: **Inter** (optimized for dense reading, high x-height, WCAG AA compliant).
- **Code & Technical Data**: **JetBrains Mono** (clear ligatures, unambiguous zero and punctuation).

---

## 5. 3D Visual Standards (React Three Fiber)
1. **Knowledge Galaxy (Landing Hero)**:
   - 8 subject orbs orbiting a luminous core with mouse parallax.
   - Instanced floating CS symbols (`{ }`, `SELECT`, `0/1`, packet arrows).
   - Lazy-loaded via `React.lazy` and `Suspense`; initial page load remains under 200 KB gzipped.
2. **Auth Wireframe Cube**:
   - Rotating glass/wireframe cube with gradient point light behind the login/register glass cards.
3. **Concept Diagrams (VB-1 to VB-6)**:
   - Built with dual representation: Accessible 2D SVG by default, with a "View in 3D" toggle for interactive spatial exploration.
4. **Performance Invariants**:
   - Clamp DPR to `[1, 1.75]`.
   - Render loop pauses when off-screen or tab is hidden.
   - Immediate SVG/CSS fallback when WebGL is unavailable or when `prefers-reduced-motion` is detected.

---

## 6. Motion & Accessibility
- **Page Transitions**: Smooth fade with 12px rise and blur (`cubic-bezier(0.22, 1, 0.36, 1)`).
- **Keyboard Focus**: Prominent `#A855F7` focus rings on all interactive elements (`:focus-visible`).
- **Reduced Motion**: Full support for `@media (prefers-reduced-motion: reduce)` which zeroes animation durations and disables parallax effects.
