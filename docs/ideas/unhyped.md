# Unhyped

## Problem Statement
How might we let developers, PMs and founders see what AI can *actually* do, where it came from, where each tool fits, and which claims held up, so they stop reacting to "X killed Y" headlines?

## Recommended Direction
Build the cinematic reverse-chronology road described in the PRD, and add two things to it.

- **Personalised road.** After the quiz, the road lights up the eras and segments the user knows and dims their blind spots. The share card becomes *"my road through AI"*, not just a score. This serves the success metric (shares and reach) and reuses the segment-filter mechanics.
- **"Where does this fit?" search.** Users type any tool and the camera flies to it on the road, with its stack position and alternatives. It searches the reviewed dataset only, with no public LLM calls. If a tool isn't on the road, the user is offered "Suggest it", which opens a GitHub issue that then goes through the ingestion pipeline.

The build is solo with Claude, so **data credibility, not rendering, is the critical path**. Quote and link verification runs in parallel with engineering from day one. A 3D performance prototype is done in week 1, before any art polish.

## Key Assumptions to Validate
- [ ] People share a knowledge score and road. *Test:* show a mock share card to 10 target users before launch.
- [ ] Enough Claim vs. Reality quotes survive verbatim verification. *Test:* verify the top 50 against primary sources before launch; if fewer than 30 hold up, rebalance toward "Still alive" data.
- [ ] The 2.5D road reaches 60 fps on a mid-range laptop and 30+ fps on a mid-range phone. *Test:* a week-1 scene prototype with placeholder art and 350 nodes.
- [ ] Open-weight grading is consistent. *Test:* 30 hand-scored anchor answers, with double-grade agreement of at least 80% within ±1.

## MVP Scope
**In:**
- road with 9 eras, the future fork and the campfire ending
- about 5 hero moments
- about 350 verified entries and at least 30 verified Claim vs. Reality pairs
- hover graph card, segment filter and minimap
- dataset-only search
- quiz with User and Builder tracks, a personalised road result and a share card
- "Suggest an edit"
- admin ingestion API that produces draft PRs

**Out:** Atlas view, weekly cron, deep-link OG images per entry (all v1.1); Researcher track; comparison view; accounts.

## Not Doing (and Why)
- **2D-first release.** The user chose to lead with the full 3D experience. The risk is covered by the week-1 performance prototype instead.
- **Public LLM "classify any tool".** It costs money per anonymous visitor and would publish placements nobody reviewed. The dataset search plus "Suggest it" covers the need.
- **Team mode / org dashboards.** It needs accounts and moves the product towards B2B. It can be revisited if individual scores spread.
- **"Talk to the road" chatbot.** It contradicts the thesis and adds cost and nothing new.
- **Hype-meter or single AGI date.** False precision damages credibility.

## Open Questions
- Which open-weight model to pin for grading (benchmark 2–3 candidates during the quiz milestone).
- The final hero-moment art direction per era (settled during the design-skills pass).
- Domain name and launch channel (Product Hunt, X thread, Hacker News "Show HN").
