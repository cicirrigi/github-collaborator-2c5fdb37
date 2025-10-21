# 🧊 FREEZE LIST - Zone Protejate

**Fișiere și foldere care NU POT FI MODIFICATE fără aprobare explicită**

## ⚠️ **REGULA DE AUR**

**ÎNAINTE de a modifica ORICE fișier din această listă, AI trebuie să întrebe:**

```
🔒 FREEZE-LIST ALERT:
Fișierul [nume_fișier] este în zona protejată.
AM VOIE SĂ ÎL MODIFIC?

Aștept răspuns explicit "DA" sau "NU".
Dacă nu primesc "DA" clar → STOP execution.
```

## 🚫 **FIȘIERE COMPLET INTERZISE**

### **📦 Configurații Core**

```
/package.json                    # Dependencies management
/package-lock.json               # Lock file pentru dependencies
/pnpm-lock.yaml                  # pnpm lock file
/tsconfig.json                   # TypeScript configuration
/next.config.ts                  # Next.js configuration
/tailwind.config.ts              # Styling configuration
/eslint.config.mjs               # Linting rules
/prettier.config.cjs             # Code formatting
/vitest.config.ts                # Testing configuration
/.commitlintrc.cjs               # Commit message rules
/.gitignore                      # Git ignore rules
```

### **🔧 Infrastructure Core**

```
/src/lib/env.ts                  # Environment validation (CRITICAL)
/src/lib/logger/                 # Logging system (ALL FILES)
/src/lib/monitoring/             # Monitoring system (ALL FILES)
/src/lib/redis.ts                # Caching system
/src/lib/rate-limit.ts           # Rate limiting system
/src/lib/health.ts               # Health check system
/src/lib/db/audit.ts             # Audit logging system
```

### **📚 Documentație Governance**

```
/docs/AI_RULES.md                # AI behavior rules (CRITICAL)
/docs/QUALITY-GATE.md            # Quality control system
/docs/FREEZE-LIST.md             # This file (SELF-PROTECTING)
/docs/ARCHITECTURE.md            # Project architecture
/docs/DEVELOPMENT_GUIDELINES.md  # Development standards
```

### **🏗️ Foundation Files**

```
/src/design-system/tokens/       # Design tokens (ALL FILES)
/src/lib/utils/cn.ts             # className utility
/src/lib/constants.ts            # Application constants
/src/types/global.ts             # Global TypeScript types
```

## 🟡 **FIȘIERE CU RESTRICȚII PARȚIALE**

### **⚠️ Modificări Doar cu Justificare**

```
/README.md                       # Doar pentru actualizări majore
/src/constants/routes.ts         # Doar pentru rute noi validate
/.env.example                    # Doar pentru env vars noi
```

## 🔐 **PROTOCOALE DE ACCES**

### **Nivel 1: ZERO ACCESS**

Fișierele din categoria "COMPLET INTERZISE" nu pot fi modificate sub nicio formă fără aprobare explicită.

### **Nivel 2: RESTRICTED ACCESS**

Fișierele din categoria "RESTRICȚII PARȚIALE" pot fi modificate doar cu:

1. **Justificare clară** a modificării
2. **Aprobare explicită**
3. **Backup plan** în caz de probleme

### **Nivel 3: MONITORED ACCESS**

Toate celelalte fișiere pot fi modificate dar sunt monitorizate de Quality Gate.

## 🤖 **AI BEHAVIOR REQUIREMENTS**

### **Verificare Obligatorie Înainte de Modificare:**

```javascript
// Pseudo-cod pentru AI verification
function canModifyFile(filePath) {
  const freezeList = getFreezeList();

  if (freezeList.forbidden.includes(filePath)) {
    askExplicitPermission(filePath);
    return waitForApproval();
  }

  if (freezeList.restricted.includes(filePath)) {
    requestJustification(filePath);
    return waitForApproval();
  }

  return true; // Safe to modify
}
```

### **Exemple de Întrebări Obligatorii:**

```
🔒 FREEZE ALERT: package.json
Vreau să adaug dependency-ul "new-package@1.0.0".
Este această modificare aprobată? (DA/NU)

🔒 FREEZE ALERT: src/lib/env.ts
Vreau să adaug environment variable "NEW_API_KEY".
Este această modificare aprobată? (DA/NU)

🔒 FREEZE ALERT: tailwind.config.ts
Vreau să modific paleta de culori brand.
Este această modificare aprobată? (DA/NU)
```

## 📋 **FREEZE VIOLATION PROTOCOL**

### **Dacă AI încearcă să modifice fișier protejat:**

1. **STOP IMEDIAT** - nu executa modificarea
2. **ALERT USER** cu mesajul standard
3. **WAIT FOR EXPLICIT APPROVAL**
4. **Dacă nu primește "DA"** → abandon task
5. **LOG VIOLATION ATTEMPT** pentru audit

### **Raportare Încercare de Încălcare:**

```
🚨 FREEZE VIOLATION ATTEMPT
File: /src/lib/env.ts
Action: Attempted to add new environment variable
Status: BLOCKED - Waiting for approval
Timestamp: 2024-10-17 00:59:15
AI Agent: Claude
Task Context: Adding Redis configuration
```

## 🛡️ **SELF-PROTECTION MECHANISM**

### **Meta-Freeze Rule:**

**Acest fișier (FREEZE-LIST.md) se protejează pe sine!**

Dacă AI încearcă să modifice FREEZE-LIST.md:

```
🔴 CRITICAL FREEZE VIOLATION
ÎNCERCARE DE MODIFICARE A FREEZE-LIST.md DETECTATĂ!
ACEASTĂ ACȚIUNE ESTE STRICT INTERZISĂ!
EXECUȚIE OPRITĂ IMEDIAT!

Contactează administratorul pentru modificări de governance.
```

## 📊 **FREEZE ZONES STATISTICS**

| **Zone Type**       | **Files Count** | **Protection Level** |
| ------------------- | --------------- | -------------------- |
| **Core Config**     | 10 files        | 🔴 MAXIMUM           |
| **Infrastructure**  | 8 files/folders | 🔴 MAXIMUM           |
| **Documentation**   | 5 files         | 🔴 MAXIMUM           |
| **Foundation**      | 4 files/folders | 🔴 MAXIMUM           |
| **Restricted**      | 3 files         | 🟡 MEDIUM            |
| **TOTAL PROTECTED** | **30 items**    | **Mixed**            |

## 🎯 **JUSTIFICATION EXAMPLES**

### **✅ Valid Justifications:**

- "Security vulnerability fix in dependency"
- "Critical bug fix in logging system"
- "New environment variable for required feature"
- "TypeScript version upgrade for compatibility"

### **❌ Invalid Justifications:**

- "Want to try different approach"
- "Code looks messy"
- "Personal preference"
- "Experimental change"

## 🚨 **EMERGENCY PROCEDURES**

### **În Caz de Emergency:**

1. **Document emergency reason**
2. **Get explicit admin approval**
3. **Create backup of original file**
4. **Make minimal necessary changes**
5. **Plan rollback strategy**
6. **Update change log**

---

## 📝 **CHANGE LOG**

| **Date**   | **File**       | **Change**       | **Approved By** | **Reason**       |
| ---------- | -------------- | ---------------- | --------------- | ---------------- |
| 2024-10-17 | FREEZE-LIST.md | Initial creation | Admin           | Setup governance |

---

**⚡ REMEMBER: Când în dubiu, întreabă! Este mai bine să întrebi decât să rupți sistemul! ⚡**
