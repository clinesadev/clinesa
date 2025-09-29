# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run check` - Run linting and TypeScript type checking

## Architecture Overview

This is a Next.js 15 application with App Router, built for a clinical management system called "clinesa".

### Tech Stack

- **Framework**: Next.js 15 with App Router and React Server Components
- **UI**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand stores
- **Language**: TypeScript with strict mode
- **Styling**: CSS-in-JS with Tailwind, dark mode support

### Project Structure

- **App Router**: Uses the `src/app` directory structure
  - Root layout in `src/app/layout.tsx` (fonts, global styles)
  - Dashboard layout in `src/app/(dashboard)/layout.tsx` (sidebar + main content)
  - Dashboard routes: `/dashboard`, `/patients`, `/billing`, `/settings`
- **Components**: Located in `src/components/`
  - UI components in `src/components/ui/` (shadcn/ui based)
  - Navigation components in `src/components/nav/`
- **State Management**: Zustand stores in `src/lib/stores/`
  - `usePlanStore` - Manages subscription plans (FREE/PRO)
  - `useUIStore` - Handles loading states and toast notifications
- **Styling**: Tailwind config supports dark mode with 'class' strategy

### Key Patterns

- Uses TypeScript path aliases (`@/` maps to `src/`)
- shadcn/ui components configured with default style and slate base color
- Dashboard uses a grid layout with fixed 240px sidebar
- Navigation uses Spanish labels ("Pacientes", "Suscripción", "Ajustes")
- Toast system with auto-removal after 5 seconds
- State stores follow Zustand patterns with typed interfaces

### Configuration Files

- `components.json` - shadcn/ui configuration
- `tailwind.config.js` - Tailwind with dark mode and content paths
- `tsconfig.json` - TypeScript with path aliases and strict settings
- Prettier configured with import sorting and Tailwind plugin
