# 🧪 Development Demos & Tests

**📁 Acest folder conține toate paginile demo și test mutate din root pentru organizare.**

> ⚠️ **ATENȚIE:** Aceste pagini sunt pentru development/testing și nu ar trebui să fie în producție.

## 🎯 **PAGINA PRINCIPALĂ CU BUTOANE:**

**👉 [http://localhost:3002/dev-demos](http://localhost:3002/dev-demos) - Pagină cu butoane pentru toate demo-urile**

## 📋 **Pagini Disponibile:**

### **🎯 BOOKING DEMOS:**

- `demo-booking-pro/` → http://localhost:3002/dev-demos/demo-booking-pro
- `demo-booking-stepper/` → http://localhost:3002/dev-demos/demo-booking-stepper
- `demo-travel-pro/` → http://localhost:3002/dev-demos/demo-travel-pro

### **⚡ DOCK TESTS:**

- `dock-modular-test/` → http://localhost:3002/dev-demos/dock-modular-test

### **🎨 UI TESTS:**

- `grid-test/` → http://localhost:3002/dev-demos/grid-test
- `theme-test/` → http://localhost:3002/dev-demos/theme-test

### **👥 FOOTER/SOCIAL TESTS:**

- `footer-icons-test/` → http://localhost:3002/dev-demos/footer-icons-test
- `footer-updated-test/` → http://localhost:3002/dev-demos/footer-updated-test

### **📋 SERVICES & TESTIMONIALS:**

- `services-dropdown-test/` → http://localhost:3002/dev-demos/services-dropdown-test
- `test-benefits/` → http://localhost:3002/dev-demos/test-benefits
- `test-testimonials/` → http://localhost:3002/dev-demos/test-testimonials

### **🧪 GENERAL:**

- `test/` → http://localhost:3002/dev-demos/test

---

## 🚨 **Pagini Șterse (Problematice):**

- ~~social-icons-test~~ - Șters
- ~~dock-comparison~~ - Șters (avea console.log errors)
- ~~dock-test~~ - Șters
- ~~test-dock~~ - Șters
- ~~flip-test~~ - Șters

---

## 🔧 **Pentru Producție:**

Când faci deploy în producție, poți exclude acest folder prin:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingExcludes: {
      '*': ['./src/app/_dev-demos/**/*'],
    },
  },
};
```

**Toate demo-urile sunt organizate și accesibile prin prefix `/_dev-demos/`** 🎯
