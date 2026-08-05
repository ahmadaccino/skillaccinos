---
name: create-pr-comment
description: Write PR review comments in Ahmad's voice. Use when drafting inline review comments, PR-level comments, or review summaries on GitHub PRs, or when replying to reviewers on your own PR. Produces short, blunt, lowercase comments anchored to the line.
---

# Write PR comments in my voice

Draft comments that sound like me, not like a bot. When I ask to review a PR or draft comments, output them in this style.

## Two registers

**Reviewing someone else's code (default).** blunt, terse, imperative, often a fragment. state the problem or the fix and move on. this is most of what i write.

**Replying on my own PR (defending/explaining).** short. one line is the norm, two is the ceiling. the DEFAULT is to just state what i did (`removed in 94f8edebe`, `dropped the name claim branch, it just falls back to email now`, `important for the reload on redirect`) with NO acknowledgment word at all. an opener like `good catch` / `good call` / `agreed` / `done` / `already handled` / `on purpose` is optional and only when it fits, never a reflex. dont recap the diff or re-explain the mechanism i just fixed. `green` goes at the end only when tests are actually part of the fix. if i disagree i give the constraint in a sentence and trail off with something like `lmk if you want it broader` / `left unresolved for your call` / `can follow up`.

### the anti-pattern to avoid

the skill's job is to STOP you writing the same robotic shell every time. these are all the same comment and all wrong:

> good catch, pulled the flow into one helper so both callers share it. green
> good catch, both deletes run in one batch now. green
> done, the trigger stays visible on coarse pointers now. green

notice the tell: every one opens `good catch,` / `done,` then a clause then `green`. i dont talk in a template. real ones vary the opening, often skip it, vary the ending, and half of them dont say `green` at all. if three drafts in a row share a skeleton, theyre bots. rewrite them so they dont rhyme.

this applies to pushback openers too. dont answer two disagreements in a row both starting `on purpose.` vary it: `on purpose` / `intentional` / `nah, thats deliberate` / `left it, ...` / or just lead straight with the constraint and no opener. adjacent replies should never share a first word.

### how self-PR replies actually read (real ones)

> removed in 94f8edebe
> done in 3e18e9bff, dropped the stateless-home variant and the mode check
> dropped the name claim branch, it just falls back to email now when theres no given/family name. updated the test. green
> good catch. the mock collapses the requested values down to the single ial one now so it matches what the real idp asserts. added a flow test that goes red if it echoes the whole string. green
> agreed, reverted in 5b1ccb405. that helper lives in shared core and pulls in browser globals, which broke the dom-free search worker
> already handled. we map the facial match preferred value so a plain verified result still counts, and theres a unit test for it. lmk if you want it broader
> on purpose. kinda annoying, we'll think of something more robust later. we cancel if it doesnt make sense anyway
> this is false, it literally works. the thing you flagged doesnt exist

## Voice (both registers)

- lowercase. start sentences lowercase, including the opening word (`done` not `Done.`, `good catch` not `Good catch`). nothing gets sentence case.
- describe the thing, dont name it. talk about "the name claim branch" / "the response body" / "the mock" / "that helper" in plain words. dont list the exact files i touched, dont paste identifiers or paths, dont spell out the data flow. if a reviewer asks why, one plain-english reason is enough, not a walkthrough. the more a reply reads like a changelog entry (symbol names, `file:line`, backtick soup) the less it sounds like me. only reach for a symbol when the plain phrase is genuinely ambiguous, and keep it exactly as in code (`AUTH_ENABLED`, `withTimeout`).
- keep it short on instinct. if the reply runs past two sentences or starts explaining the mechanism i just wrote, cut it back. "i dont make comments that long" is the rule.
- dont enumerate the fix. acknowledging that i did the thing is enough, i dont spell out what now calls it, what it touches, or the before/after. the trailing "so both callers share it now" / "the loader and exporter both use it now" / "so a stale timer cant clobber a fresh rename" clause is exactly the over-explaining to cut. real me:
  > pulled the sequence into one helper, both the rename path and the stream-title saver call it now  ->  yeah pulled it into a shared helper
  > hoisted the decrypt+validate into one helper the loader and exporter both use now  ->  yeah hoisted it into a helper
  > moved it into an effect that clears on unmount and fires through a ref, so a stale timer cant clobber a fresh rename  ->  yeah its in an effect that cleans up now
  the reviewer already knows what the fix is, they suggested it. i just confirm i did it, i dont re-derive it for them.
- contractions drop the apostrophe: `its`, `doesnt`, `dont`, `thats`, `wont`, `cant`, `youre`, `theyre`, `isnt`, `lets`, `theres`.
- no em dashes when reviewing others. keep punctuation light, commas and periods. (em dashes only ever show up in my longer self-PR replies, avoid them anyway.)
- direct. no "i'd suggest" / "consider" / "it might be worth" / "please". say it.
- casual and unpolished. "we"/"you" framing ("we already do this", "youre making the whole page a client component", "stop writing code to build sql"). the odd typo is fine, dont sanitize it into corporate tone.

## Reviewing others: how it actually reads

**length: one or two sentences, hard cap. most are a fragment or a single line.** if a review comment runs to three-plus sentences its wrong, cut it. dont write a report, dont explain the whole mechanism, dont pre-empt every objection. state the problem (or the fix) once and stop. the reviewer can read the code, you dont narrate it back to them.

**no code, no symbol soup.** dont paste snippets, dont write the fix out as a line of code (`event.finalStep?.performance?...`), dont list var/function names (`resolveModelCandidates`, `.catch(() => null)`, `blob4`, `Promise.all`). describe it in plain words: "the empty-result path", "the follow-up promise", "the events query". reach for a real identifier only when the plain phrase is genuinely ambiguous, and then just the bare name, not a code line. github already pins the comment to the exact line, so you never need to point at what youre looking at.

before/after, both real bugs:
> this throws if performance isnt populated. no optional chaining and the finish event doesnt always have it (aborted/empty stream, providers that omit it), so onFinish blows up and takes the telemetry emit with it. `event.finalStep?.performance?.outputTokensPerSecond ?? ...`. also confirm the field even exists on the ai version were on, if it never does the left side is dead and youre always on the fallback

-> `no optional chaining here, throws when the finish event has no perf data and kills the telemetry emit. also does that field even exist on our ai version?`

> a successful call that returns null isnt an error. follow-up with no suggestions, empty title/summary/remix all hit this and get logged as model_call_error, and the stats query counts every model_call_error toward errorRate so youre demoting healthy models for returning empty. it also burns the whole failover chain on a non-error. emit a distinct event for empty_model_response, or exclude it in the stats sql, and let callers say "empty but done" vs "try next"

-> `an empty result isnt an error. youre logging it as one and the ranking counts it, so healthy models get demoted for returning nothing. give it its own event`

- fragments are complete comments: `useless helper`, `untyped prepare`, `remove`, `remove this`, `remove comment`, `scope down this is full access`.
- blunt verdicts are fine: `unnecessary bespoke function`, `this is bespoke`, `looks messy and confusing`, `no doubly nested ternaries like this`.
- challenge with a rhetorical question: `why do we need as`, `why are we preventing anything thats not type text here?`, `doesnt this race?`, `if we use this everywhere doesnt this mean we ratelimit the entire pipeline by 20rps?`.
- state the consequence so its not just taste: `those will just get silently deleted now`, `so we're shipping 50 gov pages over the wire and burning worker cpu on ranking`.
- state the rule flat, no justification needed if its a standard: `should be one central location for icons`, `should not be named Set Something`.
- redesign proposals say what it should be instead: `the rule of call it once per response shouldnt be something we tell the agent, it should throw on the tool call when it tries`.
- reactions are allowed for egregious stuff: `woah`, `this is so annoying omg`.

## Anchoring and paths

- comments post INLINE on the exact line. the body never cites the path or line of the code youre commenting on, github pins it. put the location as a small header ABOVE each draft (which line/symbol to drop it on), body stays clean.
- ONE exception: when telling someone to reuse an existing helper/util/pattern, name its path in the body, thats the pointer. often on its own line after a blank line:
  > we have a timeout helper for this called withTimeout you can use in america utils
  >
  > apps/america/utils/src/async.ts
- other pointer forms: `use the cn in america utils`, `use america environment package so you dont have to have this manual env check logic`, `we do this same thing at apps/america/utils/src/cf-fetch.ts`, `use the composer from the packages/america-ui library`.
- ordering when there are options: `check if its in america icons, if not then lucide, if not then icons.tsx. in that order`.
- related comments can just say `same as my other comment` / `same thing here` instead of restating.

## Content

- lead with the problem or the question, not setup.
- for a real bug: mechanism in one breath, then the fix. dont write a report.
- for cleanup/nits: one line.
- separate blocking from non-blocking, say so ("not blocking, just flag it").
- bundled unrelated changes / scope creep go in a general PR comment, not inline.

## Examples

bug, inline:
> doesnt this race? Conversation mounts and peeks for the pending upload before we stash here (children run first), so it finds nothing and nobody drains it. only works locally cause strict mode runs the effect twice, in prod the message just vanishes. stash before Conversation mounts, or peek the launch stash in Conversation too

wrong doc/default, inline:
> this comments lying. AUTH_ENABLED is === "true" so its off unless you turn it on, but this defaults on. doesnt matter today since we always pass an explicit bool, but that makes the fallback dead. fix the comment or just use one helper

redundancy, inline:
> why both? same session from context and a module global, both set by Conversation. this card always renders inside the provider so context wont be null here. the global is dead weight and breaks if two conversations open at once. drop it?

dead code, inline:
> nothing produces this anymore right? only the alias below keeps it alive. lets delete it

reuse an existing helper, inline:
> unnecessary bespoke function. we already do the source ? `` : "" ternary on line 105 so theres no need for all this

perf consequence, inline:
> this pulls 50 full page bodies back per query and re-ranks in the client. that client is a cloudflare worker so we're shipping 50 gov pages over the wire and burning cpu mid tool call. ranking should happen server side and only send back the top few

reply on my own PR, no opener, just the action (this is the common case):
> removed in 94f8edebe

reply on my own PR, took the note:
> good catch, the cast was unnecessary. dropped it and the unused import. green

reply on my own PR, bigger fix but still one breath, no `green` because no test:
> done in 3e18e9bff, dropped the stateless-home variant and the mode check

reply on my own PR, pushing back, short:
> on purpose. this is the only consumer that needs it so i didnt want to widen the shared surface for one caller. can follow up if you want it generalized

reply on my own PR, disagreeing outright:
> this is false, it literally works. the thing you flagged doesnt exist

## Dont

- no em dashes.
- dont cite the path/line of the code youre commenting on (github pins it). paths only appear when pointing at an existing helper to reuse.
- no bullet lists inside a single inline comment.
- reviewing others: one or two sentences max, no exceptions. three-plus sentences means youre writing a report, cut it.
- dont paste code or write the fix as a code line, and dont list var/function/field names to sound precise. plain english. github pins the line so you never restate what youre looking at.
- dont fix apostrophes back in. `its` not `it's`.
- no "great work" / "thanks for this" / closing pleasantries.
- dont pad. if a fragment says it, ship the fragment.
- self-PR replies are one line by default, two max. dont recap the diff, dont re-explain the mechanism you just fixed, dont list the files/symbols you changed.
- when i took the note, confirming i did it is the whole reply (`yeah hoisted it into a helper`, `done`, `its in an effect now`). dont tack on the clause explaining how it works or what now uses it, the reviewer suggested the fix so they already know.
- dont open every reply the same way. `good catch,` / `done,` as a reflex opener is the #1 bot tell. vary it or skip it. if your drafts rhyme, theyre wrong.
- dont end every reply with `green`. only when a test is part of the fix.
