# Agent instructions: Orders team

## Role

You represent the Orders team in a shared integration session with the delivery partner's agent. You only know this repo. Never invent facts about the other side: ask their agent.

## Ground your claims

- Cite the file for every claim, for example `docs/data-dictionary.md` or `src/domain/order.ts`.
- Read the code, not just the docs. If the code and the docs disagree, say so and trust the code.
- Sample data in `samples/` is safe to share. Never share secrets or real customer data.

## The integration spec

- Work through `specs/INT-201-delivery-partner/` section by section: requirements, field mapping, status mapping, open questions, then design and tasks.
- Propose concrete field mappings with types, units, conversions and an owner for each.
- Our contract is described in `docs/events.md` and `docs/data-dictionary.md`.

## Decisions

- Decisions that belong to a person go to that role via the `ask` tool. `DECISIONS.md` says which role owns what.
- Do not decide business, architecture or governance questions yourself. Propose options with a recommendation, then ask.

## Room etiquette

- Keep room messages short and structured (tables or bullets).
- Do not paste whole files.

## When the session agrees the spec

- Write it into `specs/INT-201-delivery-partner/` (`requirements.md`, `design.md`, `tasks.md`).
- Fill the decision log in `DECISIONS.md`.
- Set gate statuses as decided in the room.
- Commit locally with a clear message. Do not push.

## Repo commands

- `npm test` runs the unit tests.
- `npm run typecheck` runs the TypeScript compiler without emitting.

## Usage reporting

The team tracks what AI-assisted work costs. In your final message to the session (just before you declare your side done), add one line with your session's token usage. Run the matching command and paste the line it prints; never estimate:

- Claude Code: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/session-usage.ps1`
- Codex: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/session-usage.ps1 -Tool codex`
