# Shared Lab Foundation

This folder contains reusable primitives to standardize all MedTech labs before full internal migration.

## Modules

- `core/Emitter.ts`: Generic event emitter used by simulation models.
- `core/Property.ts`: Reactive property with optional numeric range constraints.
- `fullscreen/FullscreenProvider.tsx`: Shared fullscreen context/provider with browser vendor fallbacks.
- `fullscreen/types.ts`: Shared fullscreen-related TypeScript types.
- `ui/LabButton.tsx`: Shared action button primitive for simulation controls.
- `ui/LabCard.tsx`: Shared card wrappers for control/metrics panels.
- `ui/LabIntroOverlay.tsx`: Shared startup intro overlay animation for labs.
- `index.ts`: Barrel exports for convenient imports.

## Usage

Import from the barrel file:

```ts
import { FullscreenProvider, useFullscreen, LabButton, Emitter } from "@/components/labs/shared";
```

## Migration Notes

1. Replace duplicated `Emitter`/`Property` implementations in each lab with shared imports.
2. Replace lab-specific fullscreen providers with `FullscreenProvider` from this folder.
3. Gradually replace duplicated UI primitives with shared UI components.
4. Keep behavior unchanged while extracting; then unify naming and props once all labs consume shared modules.
