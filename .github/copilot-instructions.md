# Copilot Instructions for MedTech Virtual Lab

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Next.js application for a virtual laboratory platform at SMU (Mediterranean Institution of Technology), focusing on STEM education with interactive physics simulations.

## Design Guidelines

- **Primary Color**: #057999 (teal/cyan) - use as `bg-primary-600`, `text-primary-600` etc.
- **Typography**: Use system fonts with good readability
- **Framework**: Next.js 15 with App Router, TypeScript, and Tailwind CSS
- **Component Structure**: Use React functional components with proper TypeScript typing
- **Responsive Design**: Mobile-first approach using Tailwind's responsive utilities

## Code Style Preferences

- Use TypeScript for type safety
- Prefer functional components with hooks
- Use Tailwind CSS classes instead of custom CSS
- Keep components modular and reusable
- Use proper semantic HTML elements
- Implement proper accessibility (ARIA labels, alt text, etc.)

## Key Features to Maintain

- Interactive physics simulations (PhET embeds)
- Lab filtering and search functionality
- Multi-page navigation (Home, About, Labs, Evaluation, Contact)
- Responsive design for all devices
- Educational content presentation

## File Organization

- Pages in `src/app/` using App Router structure
- Components in `src/components/`
- Utilities and types in `src/lib/`
- Static assets in `public/`
- Styles handled through Tailwind CSS

## Performance Considerations

- Use Next.js Image component for optimized images
- Implement proper loading states for embedded content
- Use dynamic imports for heavy components
- Optimize for Core Web Vitals
