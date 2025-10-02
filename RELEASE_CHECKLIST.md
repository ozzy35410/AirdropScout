# 🚀 Airdrop Scout Release Checklist

## Pre-Deploy (Local)
- [ ] `npm run dev` - Development server runs without errors
- [ ] `npm run build` - Production build succeeds
- [ ] Test key pages: Home, Tasks, Faucets, NFTs
- [ ] Language toggle works (EN ↔ TR)
- [ ] No console errors in browser

## Git & PR
- [ ] Feature branch created from latest `main`
- [ ] Changes committed with clear message
- [ ] PR created using template
- [ ] PR merged to `main` branch

## Deployment
- [ ] Bolt auto-deploy triggered (or manual deploy clicked)
- [ ] Bolt build logs show success (no red errors)
- [ ] Production URL loads correctly
- [ ] Quick smoke test on live site

## Post-Deploy Verification
- [ ] All pages accessible on production
- [ ] Language switching functional
- [ ] No JavaScript errors in browser console
- [ ] Mobile responsiveness intact

---

**⚠️ If any step fails, check WORKFLOW.md troubleshooting section**

**🎯 Success = All checkboxes completed**