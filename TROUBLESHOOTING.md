# Troubleshooting White Screen on GitHub Pages

## Correct URL
Make sure you're accessing:
- ✅ `https://cs571-f25.github.io/p117/`
- ✅ `https://cs571-f25.github.io/p117/#/`
- ❌ NOT `https://cs571-f25.github.io/` (missing `/p117/`)

## Steps to Fix

1. **Check Browser Console (F12)**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for red error messages
   - Share any errors you see

2. **Verify GitHub Pages Settings**
   - Go to: https://github.com/CS571-F25/p117/settings/pages
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/docs`
   - Click Save

3. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear cache in browser settings

4. **Check if Files are Committed**
   ```bash
   git status
   git add .
   git commit -m "Fix deployment"
   git push origin main
   ```

5. **Wait for GitHub Pages**
   - After pushing, wait 1-2 minutes
   - GitHub Pages takes time to update

## Common Issues

- **404 Error**: Wrong URL or GitHub Pages not configured
- **White Screen**: JavaScript error (check console)
- **Assets not loading**: Base path mismatch

## Test Locally First

```bash
npm run build
npm run preview
```

Then visit: `http://localhost:4173/p117/`

