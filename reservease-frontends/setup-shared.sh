#!/bin/bash
cd /Users/joe/Work/Others/ReservEase/ReservEaseFrontends/nest-navigator-go

# 1. Setup @reservease/config
mkdir -p packages/config
cat << 'JSON' > packages/config/package.json
{
  "name": "@reservease/config",
  "version": "1.0.0",
  "private": true
}
JSON
cp apps/tenant-portal/eslint.config.js packages/config/eslint.config.js
# Could share tsconfig but let's just leave it for now.

# 2. Setup @reservease/ui
cat << 'JSON' > packages/ui/package.json
{
  "name": "@reservease/ui",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "lucide-react": "^0.462.0",
    "class-variance-authority": "^0.7.1"
  },
  "peerDependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
JSON

cat << 'JSON' > packages/ui/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
JSON

mv apps/tenant-portal/src/components/ui packages/ui/src/components/
mv apps/tenant-portal/src/lib packages/ui/src/

# Create an index export
cat << 'TS' > packages/ui/src/index.ts
export * from "./lib/utils";
// We don't export everything to avoid barrel issues, but let's export utils for now.
TS

# Update tenant-portal tailwind mapping to scan packages/ui
sed -i '' 's|content: \[|content: \[ "../../packages/ui/src/**/*.{ts,tsx}", |g' apps/tenant-portal/tailwind.config.ts

# Re-link tenant-portal aliases so @/components/ui points to packages/ui, or add dependency
# Better: Make @reservease/ui an explicit dependency
cd apps/tenant-portal
npm pkg set dependencies.@reservease/ui="workspace:*"
cd ..

