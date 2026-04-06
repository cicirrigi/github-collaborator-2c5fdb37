

# Redesign Booking Type Dock - Modern 2026+ Style

## Ce se schimba vizual

```text
ACUM (2015 macOS dock):
┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐
│ → │  │ ↻ │  │ ⏱ │  │ 📅│  │ 🚗│  │ 💎│   ← iconite in cutii dreptunghiulare
└───┘  └───┘  └───┘  └───┘  └───┘  └───┘     care cresc pe hover (magnification)
 One    Ret   Hour   Daily  Fleet  Besp       label-uri separate dedesubt

DUPA (2026 sliding pill):
╭──────────────────────────────────────────────────────╮
│  ╭─────────╮                                         │
│  │→ One Way│  ↻ Return  ⏱ Hourly  📅 Daily  🚗 Fleet│
│  ╰─────────╯                                         │
│     ↑ gold pill care GLISEAZA smooth la click         │
╰──────────────────────────────────────────────────────╯
       glass container cu blur
```

## De ce arata 2026+

1. **Sliding indicator** (ca Linear, Vercel, Arc Browser) - pill-ul auriu gliseaza fluid intre tab-uri cu `layoutId` Framer Motion
2. **Glassmorphism container** - `backdrop-blur-xl` + border subtil, nu cutii opace
3. **Icon + text inline** pe fiecare tab, nu icon separat de label
4. **Zero magnification** - fara efectul ala de "dock macOS" care se umfla; totul e clean, minimal
5. **Gold gradient glow** pe tab-ul activ cu `box-shadow` difuz
6. **Mobile**: horizontal scroll cu snap, nu hamburger menu

## Fisiere modificate

| Fisier | Ce se intampla |
|--------|---------------|
| `IconContainer.tsx` → `DockTab.tsx` | Pill tab cu icon+label, sliding indicator |
| `FloatingDockInline.tsx` | Glass container rounded-full, flex row |
| `FloatingDockMobile.tsx` | Horizontal scroll cu snap |
| `ZustandBookingTypeDock.tsx` | Simplificat - trimite icon component, nu JSX complex |
| `dock.tokens.ts` | Simplificat - scot spring physics, pastrez glass colors |

## Ce NU se modifica

- Zustand store (`useBookingState`) - zero changes
- `booking.types.ts` - intact
- `BookingFloatingDock.modular.tsx` - orchestratorul ramane
- Toata logica de booking - 100% intacta

## Build errors

Erorile existente (~35) sunt pre-existente si nu au legatura cu dock-ul. Le putem fixa separat dupa redesign.

