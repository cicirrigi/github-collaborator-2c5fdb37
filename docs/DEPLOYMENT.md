# 🚀 Deployment Guide - Vantage Lane 2.0

## ✅ **Pre-deployment Checklist**

### **🔍 Quality Gates**

Run these commands to ensure production readiness:

```bash
# 1. Lint check (should be 0 errors)
npm run lint:quiet

# 2. TypeScript check (should be 0 errors)
npm run typecheck

# 3. Production build test
npm run build

# 4. All checks at once
npm run prebuild
```

**✅ Expected Results:**

- ESLint: 0 errors, 0 warnings
- TypeScript: 0 errors
- Build: Successful compilation with static pages

---

## 🚀 **Deployment Options**

### **🔥 Vercel (Recommended)**

**Quick deploy with Vercel CLI:**

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy to production  
npm run deploy:vercel
```

> **Note**: Vercel will auto-detect Next.js and create optimal configuration. No `vercel.json` needed for basic deployments.

### **🌐 Netlify**

**Deploy with Netlify CLI:**

```bash
# Install Netlify CLI globally
npm i -g netlify-cli

# Build and deploy
npm run build
npm run deploy:netlify
```

> **Note**: Netlify configuration will be created during first deployment. Build settings can be configured via Netlify dashboard.

### **🔧 Platform Configuration**

Both platforms will automatically:
- Detect Next.js framework
- Set build command to `npm run build`  
- Configure output directory as `.next`
- Handle environment variables via dashboard

For custom configuration, refer to platform-specific documentation after initial setup.

---

## ⚙️ **Environment Setup**

### **📋 Environment Variables**

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill required values** (see `.env.example` for all options):
   ```bash
   # Essential for deployment
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Set in deployment platform:**
   - **Vercel**: Dashboard → Project → Settings → Environment Variables
   - **Netlify**: Dashboard → Site → Environment variables

> 💡 **Tip**: Never commit `.env.local` to git. Use platform dashboards for production secrets.

---

## 🔧 **Common Issues**

### **Build Failures**
- **ESLint errors**: Run `npm run lint:fix` before build
- **TypeScript errors**: Run `npm run typecheck` to identify issues  
- **Missing dependencies**: Ensure `npm install` completed successfully

### **Deployment Issues**
- **Environment variables**: Verify all required variables are set in platform dashboard
- **Build command**: Platforms should auto-detect, but manually set to `npm run build` if needed
- **Node version**: Ensure platform uses Node.js 20+ (configured in `package.json` engines)

---

## 🎯 **Quick Deployment Checklist**

1. ✅ **Quality checks pass**: `npm run prebuild`
2. ✅ **Environment variables set** in deployment platform  
3. ✅ **Repository connected** to Vercel/Netlify
4. ✅ **Deploy command ready**: `npm run deploy:vercel` or `npm run deploy:netlify`

> 🚀 **Ready to deploy!** Both Vercel and Netlify will handle the rest automatically.
