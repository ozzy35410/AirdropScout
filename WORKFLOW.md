# Airdrop Scout - Bolt Deployment Workflow

## 🔥 Bulletproof Git → Bolt Deploy Workflow

### 1. Local Development Setup
```bash
# Initial setup (only once)
cd "c:\Users\ozzy\Desktop\airdrop scout\AirdropScout-main"
npm install

# Daily development
npm run dev
# Test at: http://localhost:5173
```

### 2. Feature Development Flow
```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feat/description-of-change

# Make your changes, then...
git add -A
git commit -m "feat: short description of change"
git push -u origin feat/description-of-change
```

### 3. GitHub PR Process
1. Go to GitHub repo: `ozzy35410/AirdropScout`
2. Create Pull Request: `feat/your-branch` → `main`
3. Use PR template below
4. Self-review or get review
5. **Merge to main** (triggers auto-deploy if enabled)

### 4. Bolt Deployment
- **Auto-deploy ON**: Merge triggers build automatically
- **Auto-deploy OFF**: Go to Bolt dashboard → Click "Deploy" after merge

---

## 📝 PR Template

```markdown
## Summary
- What: [Brief description of change]
- Why: [Reason for change]

## Scope
- **Pages affected**: [e.g., /tasks, /faucets, /home]
- **Config/env changes**: [None / list changes]
- **i18n updates**: [EN/TR translations added/modified]

## Testing
- [ ] `npm run dev` works locally
- [ ] `npm run build` passes without errors
- [ ] All pages load correctly
- [ ] Language switching works (EN/TR)

## Deploy Notes
- [ ] Ready for auto-deploy
- [ ] No env var changes needed
```

---

## ✅ Release Checklist

### Pre-Deploy
- [ ] All changes tested locally (`npm run dev`)
- [ ] Build passes (`npm run build`)
- [ ] PR merged to `main` branch
- [ ] GitHub shows latest commit on main

### Post-Deploy
- [ ] Bolt build succeeded (check build logs)
- [ ] Production site loads: `[your-bolt-url]`
- [ ] Language toggle works (EN ↔ TR)
- [ ] No console errors in browser
- [ ] Key pages load: `/`, `/tasks`, `/faucets`, `/nfts`

---

## 🔧 File Change Guide

| Change Type | Files to Edit |
|-------------|---------------|
| **Text/Copy** | `public/locales/en.json`, `public/locales/tr.json` |
| **Navigation** | `src/components/Layout/Header.tsx` |
| **Pages** | `src/components/Pages/[PageName].tsx` |
| **Branding** | `public/locales/*.json` (brand key), `src/components/Layout/Header.tsx` |
| **Tasks/Config** | `src/config/tasks.ts`, `src/config/networks.ts` |
| **API Endpoints** | `pages/api/*` or `src/pages/api/*` |
| **Referral Logic** | `src/lib/referral.ts` |
| **RPC/Chains** | `src/config/rpc.ts`, `src/config/networks.ts` |

---

## 🚨 Troubleshooting Deploy Failures

### Problem: Build fails on Bolt
**Check:**
1. Bolt build logs for specific error
2. `package.json` has `"build": "vite build"` script
3. All dependencies in `package.json` (not just `devDependencies`)

**Fix:**
```bash
# Test build locally first
npm run build

# If missing deps, add them:
npm install missing-package-name
git add package.json package-lock.json
git commit -m "fix: add missing dependency"
git push
```

### Problem: Supabase/Env errors
**Check:** Bolt dashboard → Environment Variables
**Required vars:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Any other `VITE_*` vars your app uses

### Problem: Wrong branch deploying
**Check:** Bolt settings → Deploy branch = `main`
**Fix:** Change deploy branch in Bolt settings

### Problem: Auto-deploy not working
**Check:** Bolt settings → Auto-deploy on Git push = `ON`
**Fix:** Turn on auto-deploy OR manually click Deploy after merge

### Problem: 404s or routing issues
**Check:** Bolt framework settings = `Vite` (not Next.js)
**Fix:** Update framework setting in Bolt

### Problem: Assets/styles not loading
**Check:** 
1. `vite.config.ts` has correct `base` setting
2. All imports use relative paths
3. Assets in `public/` folder

---

## ⚡ Quick Commands Reference

```bash
# Daily workflow
git checkout main && git pull origin main
git checkout -b feat/my-change
# ... make changes ...
git add -A && git commit -m "feat: description"
git push -u origin feat/my-change

# Emergency hotfix
git checkout main && git pull origin main
git checkout -b hotfix/urgent-fix
# ... make fix ...
git add -A && git commit -m "hotfix: urgent fix"
git push -u origin hotfix/urgent-fix
# Create PR and merge immediately

# Check build locally before pushing
npm run build
npm run preview  # Test production build
```

---

## 🎯 Success Metrics
- PR merged to main ✅
- Bolt build succeeds ✅
- Site loads at production URL ✅
- No console errors ✅
- EN/TR language toggle works ✅