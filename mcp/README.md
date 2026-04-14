# MedTech Lab MCP Servers

This folder contains **three MCP servers** (one per lab) that expose:

- `get_status`: read the current simulation state
- `control`: apply actions to change simulation state

## Servers

- `collision-lab-server` → `src/servers/collision.ts`
- `coulombs-law-lab-server` → `src/servers/coulombsLaw.ts`
- `standing-waves-lab-server` → `src/servers/standingWaves.ts`

## Install

```bash
npm --prefix mcp install
```

## Run

```bash
npm --prefix mcp run collision
npm --prefix mcp run coulombs-law
npm --prefix mcp run standing-waves
```

## Tool Contracts

### Collision

- `get_status`
- `control` with actions:
  - `start`, `pause`, `toggle_play`, `restart`, `step`
  - `set_elasticity` (`elastic` | `inelastic`)
  - `set_time_speed` (`normal` | `slow`)
  - `set_body_mass`, `set_body_velocity`, `set_body_position` (requires `bodyIndex` and numeric `value`)

### Coulomb's Law

- `get_status`
- `control` with actions:
  - `reset`
  - `set_distance`, `nudge_distance`
  - `set_charge_a`, `set_charge_b`
  - `nudge_charge_a`, `nudge_charge_b`

### Standing Waves

- `get_status`
- `control` with actions:
  - `play`, `pause`, `toggle_play`, `restart`, `step`
  - `toggle_end`, `set_end` (`fixed` | `loose`)
  - `set_time_speed` (`normal` | `slow`)
  - `set_tension`, `set_damping`, `set_frequency`, `set_amplitude`
  - `toggle_oscillation`, `toggle_rulers`, `toggle_reference_line`

## Notes

- These servers run simulation state in-process and are intended for tool-based control/inspection.
- They do not directly attach to a browser tab; they expose equivalent controllable simulation state via MCP.
