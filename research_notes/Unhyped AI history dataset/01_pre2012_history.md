# Unhyped: the real history of AI, prehistory to Dec 2011 (timeline dataset notes)

How to read these notes:
- Each entry is a YAML record with the requested fields. `source_url` is the primary or authoritative source, usually a DOI, the publisher, a museum or the institution.
- Verification status. In this session I fetched or searched the hype quotes (Section 4) and these entries: Dartmouth, Lighthill, Georgetown-IBM, Prolog, FGCS, Perceptron/NYT. All other entries rely on well-known bibliographic facts and standard DOIs or institutional URLs that I did not fetch one by one. Before publishing, the report writer or a QA pass should spot-check any URL marked `[unfetched-url]`. DOIs are the most reliable, since they resolve even when publisher paths change.
- Era is assigned by capability, not by date: 0 = Tools extend the hand, 1 = Machines follow logic, 2 = Machines follow rules, 3 = Machines learn patterns, 4 = Machines see & hear.
- Edge targets use the ids in this file.

## Q1. Prologue: how humans outsourced thinking to tools (era 0)

### Takeaway
For thousands of years people moved memory (writing), arithmetic (abacus, Pascal, Leibniz), astronomical prediction (Antikythera), combinatorial reasoning (Llull) and control sequences (Jacquard) into artefacts. Babbage and Lovelace joined these ideas in a general-purpose design. Boole, Turing and Shannon then made logic mechanical. None of these devices chose goals for itself. Lovelace said explicitly in 1843 that the Engine could not originate anything.

### Cited Findings

```yaml
- id: stone-tools-and-fire
  title: Earliest stone tools (Lomekwi 3) and controlled fire
  date: "c. 3.3 million years ago (tools); fire c. 1 million years ago"
  type: Event
  era: 0
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Compute & Hardware
  creators: [early hominins]
  description: Knapped stone tools at Lomekwi 3, Kenya, are dated to 3.3 Ma, before the genus Homo. They are the earliest known physical extension of the hand.
  capability_note: Cutting and pounding. Physical leverage only, with no information processing.
  edges: []
  source_url: https://www.nature.com/articles/nature14464   # Harmand et al., Nature 521 (2015)
  hero_moment_candidate: no

- id: cuneiform-writing
  title: Writing (proto-cuneiform, Uruk)
  date: "c. 3200 BCE"
  type: Event
  era: 0
  primary_segment: Language/NLP
  secondary_segments: []
  stack_layer: Data
  creators: [Sumerian scribes, Uruk]
  description: Mesopotamian administrators began keeping accounts and records on clay tablets. This moved memory out of people's heads and into durable storage.
  capability_note: Persistent, transferable storage of symbols and quantities.
  edges: []
  source_url: https://www.metmuseum.org/toah/hd/wrtg/hd_wrtg.htm   [unfetched-url]
  hero_moment_candidate: yes

- id: abacus
  title: Counting boards and the abacus
  date: "c. 300 BCE (Salamis tablet); suanpan c. 2nd c. CE onward"
  type: Event
  era: 0
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Compute & Hardware
  creators: [Babylonian, Greek, Roman and Chinese users]
  description: Positional counting devices let an operator do arithmetic by moving beads or counters.
  capability_note: Faster arithmetic. The person still holds the algorithm.
  edges: [{type: inspired-by, target: cuneiform-writing}]
  source_url: https://www.computerhistory.org/revolution/calculators/1   [unfetched-url]
  hero_moment_candidate: no

- id: antikythera-mechanism
  title: Antikythera mechanism
  date: "c. 150–100 BCE"
  type: Product
  era: 0
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Compute & Hardware
  creators: [unknown Hellenistic Greek makers]
  description: A geared bronze device that modelled solar, lunar and eclipse cycles. It is the oldest known analogue computer.
  capability_note: Predicted the lunar phase, eclipse timing and calendar cycles from a hand crank. It did one fixed computation and could not be reprogrammed.
  edges: []
  source_url: https://www.nature.com/articles/nature05357   # Freeth et al., Nature 444 (2006)
  hero_moment_candidate: yes

- id: llull-ars-magna
  title: Ramon Llull's Ars Magna
  date: "c. 1305"
  type: Paper
  era: 0
  primary_segment: Symbolic & Logic AI
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [Ramon Llull]
  description: A system of rotating paper discs that combined basic concepts mechanically to produce propositions.
  capability_note: Enumerated combinations of concepts. It had no way to evaluate truth beyond the author's rules.
  edges: []
  source_url: https://plato.stanford.edu/entries/llull/
  hero_moment_candidate: no

- id: pascaline
  title: Pascaline
  date: "1642"
  type: Product
  era: 0
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Compute & Hardware
  creators: [Blaise Pascal]
  description: A gear-driven adding machine with automatic carry, built to help with tax calculations.
  capability_note: Addition and subtraction. Multiplication only by repeated addition.
  edges: [{type: successor-of, target: abacus}]
  source_url: https://www.computerhistory.org/revolution/calculators/1/47   [unfetched-url]
  hero_moment_candidate: no

- id: leibniz-stepped-reckoner
  title: Leibniz's stepped reckoner, binary arithmetic and the characteristica universalis
  date: "1673 (design); 1703 (binary paper)"
  type: Person
  era: 0
  primary_segment: Compute & Hardware
  secondary_segments: [Symbolic & Logic AI]
  stack_layer: Algorithms & Research
  creators: [Gottfried Wilhelm Leibniz]
  description: A stepped-drum calculator for all four operations. Leibniz also wrote on binary notation and proposed a calculus of reasoning ("calculemus").
  capability_note: Mechanical multiplication and division, though the machine was unreliable. The logic calculus stayed a programme on paper.
  edges: [{type: successor-of, target: pascaline}, {type: inspired-by, target: llull-ars-magna}]
  source_url: https://plato.stanford.edu/entries/leibniz-logic-influence/
  hero_moment_candidate: no

- id: jacquard-loom
  title: Jacquard loom (punched-card control)
  date: "1804"
  type: Product
  era: 0
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Data
  creators: [Joseph Marie Jacquard]
  description: A chain of punched cards controlled which warp threads the loom lifted, so a pattern could be stored as a program.
  capability_note: Replayed stored weaving patterns automatically. Stored sequence with no branching.
  edges: []
  source_url: https://www.computerhistory.org/revolution/punched-cards/2/2   [unfetched-url]
  hero_moment_candidate: no

- id: babbage-analytical-engine
  title: Babbage's Difference Engine and Analytical Engine
  date: "1822 (Difference Engine); 1837 (Analytical Engine design)"
  type: Person
  era: 0
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Compute & Hardware
  creators: [Charles Babbage]
  description: A design for a general-purpose mechanical computer with a separate "store" (memory) and "mill" (processor), programmed with punched cards. It was never completed in Babbage's lifetime.
  capability_note: On paper, a Turing-complete design. In practice nothing general-purpose was built. The Science Museum built Difference Engine No. 2 in 1991, and it worked.
  edges: [{type: uses, target: jacquard-loom}]
  source_url: https://www.computerhistory.org/babbage/   [unfetched-url]
  hero_moment_candidate: yes

- id: lovelace-note-g
  title: Ada Lovelace's Notes on the Analytical Engine (Note G)
  date: "1843"
  type: Paper
  era: 0
  primary_segment: Compute & Hardware
  secondary_segments: [Symbolic & Logic AI]
  stack_layer: Algorithms & Research
  creators: [Ada Lovelace]
  description: Notes to her translation of Menabrea's paper. They include a procedure for computing Bernoulli numbers, often called the first published program, and the observation that the Engine could manipulate symbols beyond numbers.
  capability_note: A program on paper only; there was no machine to run it. Also the first published sceptical statement about machine originality (see Section 4).
  edges: [{type: built-on, target: babbage-analytical-engine}]
  source_url: https://www.fourmilab.ch/babbage/sketch.html
  hero_moment_candidate: yes

- id: boole-laws-of-thought
  title: Boole, "An Investigation of the Laws of Thought"
  date: "1854"
  type: Paper
  era: 0
  primary_segment: Symbolic & Logic AI
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [George Boole]
  description: Treated logic as an algebra of variables that take the values 0 and 1.
  capability_note: A formal basis that later made logic implementable in circuits (see shannon-1937).
  edges: [{type: inspired-by, target: leibniz-stepped-reckoner}]
  source_url: https://plato.stanford.edu/entries/boole/
  hero_moment_candidate: no

- id: turing-1936-computable-numbers
  title: Turing, "On Computable Numbers"
  date: "1936"
  type: Paper
  era: 1
  primary_segment: Symbolic & Logic AI
  secondary_segments: [Compute & Hardware]
  stack_layer: Algorithms & Research
  creators: [Alan Turing]
  description: Defined the Turing machine and the universal machine, and proved limits on what can be computed (the halting problem).
  capability_note: Theory only. It set out what any mechanical procedure can and cannot compute.
  edges: [{type: inspired-by, target: babbage-analytical-engine}]
  source_url: https://doi.org/10.1112/plms/s2-42.1.230
  hero_moment_candidate: yes

- id: shannon-1937-switching
  title: Shannon's master's thesis, "A Symbolic Analysis of Relay and Switching Circuits"
  date: "1937 (published 1938)"
  type: Paper
  era: 1
  primary_segment: Compute & Hardware
  secondary_segments: [Symbolic & Logic AI]
  stack_layer: Compute & Hardware
  creators: [Claude Shannon, MIT]
  description: Showed that Boolean algebra can describe and design relay circuits.
  capability_note: Made logic physically buildable. This is the foundation of digital circuit design.
  edges: [{type: built-on, target: boole-laws-of-thought}]
  source_url: https://dspace.mit.edu/handle/1721.1/11173   [unfetched-url]
  hero_moment_candidate: no
```

### Inferences
- The prologue supports the dataset's thesis: each step moved a specific cognitive task (remembering, counting, predicting, sequencing) into an artefact. None of them automated setting goals.
- Lovelace's Note G works as a sober counterweight to set against the later hype quotes.

### Gaps
- I did not fetch the museum URLs (CHM, Met) to confirm their current paths. Dates for the abacus and for fire vary widely by source, so show them as ranges.

## Q2. 1943–1979: machines follow logic and rules (entries)

### Takeaway
Between 1943 and 1979 the field produced working theorem provers (Logic Theorist), languages (LISP, Prolog), a trainable pattern classifier (Perceptron), toy-world language systems (ELIZA, SHRDLU), a mobile robot that planned (Shakey), and the first expert systems (DENDRAL, MYCIN). In every case the demonstrated ability was narrow and brittle, and far smaller than the public forecasts. Critical reviews followed: ALPAC 1966, Perceptrons 1969, Lighthill 1973, then funding cuts, the first "AI winter".

### Cited Findings

```yaml
- id: mcculloch-pitts-1943
  title: McCulloch & Pitts, "A Logical Calculus of the Ideas Immanent in Nervous Activity"
  date: "1943"
  type: Paper
  era: 1
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: [Symbolic & Logic AI]
  stack_layer: Algorithms & Research
  creators: [Warren McCulloch, Walter Pitts]
  description: Modelled neurons as binary threshold units and showed that networks of them can compute logical functions.
  capability_note: Theory only. It had no learning rule.
  edges: [{type: inspired-by, target: turing-1936-computable-numbers}, {type: inspired-by, target: boole-laws-of-thought}]
  source_url: https://doi.org/10.1007/BF02478259
  hero_moment_candidate: yes

- id: eniac-1946
  title: ENIAC unveiled
  date: "1946-02-15"
  type: Product
  era: 1
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Compute & Hardware
  creators: [J. Presper Eckert, John Mauchly, University of Pennsylvania, US Army]
  description: A general-purpose electronic digital computer, publicly unveiled in 1946 and originally built for artillery firing tables. (Colossus, 1944, came earlier but was secret and special-purpose.)
  capability_note: About 5,000 additions per second. It was reprogrammed by rewiring panels.
  edges: [{type: inspired-by, target: babbage-analytical-engine}]
  source_url: https://www.seas.upenn.edu/about/history-heritage/eniac/   [unfetched-url]
  hero_moment_candidate: no

- id: transistor-1947
  title: Point-contact transistor
  date: "1947-12-16"
  type: Product
  era: 1
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Compute & Hardware
  creators: [John Bardeen, Walter Brattain, William Shockley, Bell Labs]
  description: A solid-state amplifier and switch that replaced vacuum tubes.
  capability_note: Made reliable, dense and cheap digital logic possible. It underlies all later compute scaling.
  edges: []
  source_url: https://www.computerhistory.org/siliconengine/invention-of-the-point-contact-transistor/   [unfetched-url]
  hero_moment_candidate: no

- id: turing-1950-computing-machinery
  title: Turing, "Computing Machinery and Intelligence" (the imitation game)
  date: "1950-10"
  type: Paper
  era: 1
  primary_segment: Symbolic & Logic AI
  secondary_segments: [Language/NLP, Safety & Alignment]
  stack_layer: Ops/Eval/Safety
  creators: [Alan Turing]
  description: Replaced the question "can machines think?" with a conversational test. The paper answers objections, including "Lady Lovelace's objection", and proposes "learning machines" (a child machine that is educated).
  capability_note: No machine was built. It defined the first proposed evaluation for AI and made a dated prediction (see Section 4).
  edges: [{type: inspired-by, target: lovelace-note-g}, {type: built-on, target: turing-1936-computable-numbers}]
  source_url: https://doi.org/10.1093/mind/LIX.236.433
  hero_moment_candidate: yes

- id: shannon-chess-1950
  title: Shannon, "Programming a Computer for Playing Chess"
  date: "1950-03"
  type: Paper
  era: 1
  primary_segment: RL & Games
  secondary_segments: [Symbolic & Logic AI]
  stack_layer: Algorithms & Research
  creators: [Claude Shannon]
  description: Set out minimax search with an evaluation function, and "Type A" (brute-force) versus "Type B" (selective) strategies.
  capability_note: A blueprint only. The same framework reached Deep Blue in 1997.
  edges: [{type: built-on, target: shannon-1937-switching}]
  source_url: https://doi.org/10.1080/14786445008521796
  hero_moment_candidate: no

- id: snarc-1951
  title: SNARC (Stochastic Neural Analog Reinforcement Calculator)
  date: "1951"
  type: Product
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: [RL & Games]
  stack_layer: Models
  creators: [Marvin Minsky, Dean Edmonds]
  description: A learning machine built from about 40 vacuum-tube "neurons" that simulated a rat learning a maze through reinforcement.
  capability_note: Learned simple maze paths by reinforcement. Hardware-limited and not scalable.
  edges: [{type: inspired-by, target: mcculloch-pitts-1943}]
  source_url: https://ai.stanford.edu/~nilsson/QAI/qai.pdf   # Nilsson, The Quest for AI, ch. 4
  hero_moment_candidate: no

- id: samuel-checkers
  title: Arthur Samuel's checkers program (and the term "machine learning")
  date: "1952 (first program); 1959 (IBM J. paper)"
  type: Paper
  era: 3
  primary_segment: RL & Games
  secondary_segments: [Classical ML]
  stack_layer: Algorithms & Research
  creators: [Arthur Samuel, IBM]
  description: A checkers program on the IBM 701 and later machines. It improved by rote learning and by adjusting its evaluation function through self-play. The 1959 paper popularised "machine learning".
  capability_note: Reached respectable amateur play. In 1962 it won a single game against Robert Nealey, which the press reported as beating a "master". It did not reach world-class play.
  edges: [{type: built-on, target: shannon-chess-1950}]
  source_url: https://doi.org/10.1147/rd.33.0210
  hero_moment_candidate: yes

- id: georgetown-ibm-1954
  title: Georgetown–IBM machine translation demonstration
  date: "1954-01-07"
  type: Event
  era: 2
  primary_segment: Language/NLP
  secondary_segments: []
  stack_layer: Apps & Products
  creators: [Léon Dostert (Georgetown), Cuthbert Hurd (IBM), Paul Garvin]
  description: A public demonstration of Russian-to-English translation on an IBM 701.
  capability_note: Translated more than 60 pre-selected Russian sentences using 6 grammar rules and a 250-word vocabulary. It was a staged demo in a narrow domain. It set up hype about fully automatic translation "within three to five years" (see Section 4).
  edges: []
  source_url: https://aclanthology.org/www.mt-archive.info/00/AMTA-2004-Hutchins.pdf   # Hutchins 2004 (primary historian); details confirmed via https://en.wikipedia.org/wiki/Georgetown%E2%80%93IBM_experiment
  hero_moment_candidate: yes

- id: dartmouth-1956
  title: Dartmouth Summer Research Project on Artificial Intelligence
  date: "1955-08-31 (proposal); summer 1956 (workshop)"
  type: Event
  era: 1
  primary_segment: Symbolic & Logic AI
  secondary_segments: [Neural Networks & Deep Learning, Language/NLP]
  stack_layer: Algorithms & Research
  creators: [John McCarthy, Marvin Minsky, Nathaniel Rochester, Claude Shannon]
  description: The proposal coined the term "artificial intelligence". It proposed "a 2 month, 10 man study" to make machines use language, form abstractions, solve problems and improve themselves.
  capability_note: No breakthrough came out of the summer itself. Newell and Simon brought the already-working Logic Theorist. The event is the founding of the field and a textbook Claim-vs-Reality case.
  edges: [{type: inspired-by, target: turing-1950-computing-machinery}]
  source_url: http://www-formal.stanford.edu/jmc/history/dartmouth/dartmouth.html
  hero_moment_candidate: yes

- id: logic-theorist-1956
  title: Logic Theorist
  date: "1956"
  type: Model
  era: 1
  primary_segment: Symbolic & Logic AI
  secondary_segments: []
  stack_layer: Models
  creators: [Allen Newell, Herbert Simon, Cliff Shaw, RAND / Carnegie Tech]
  description: A program that searched heuristically for proofs of theorems in Whitehead and Russell's Principia Mathematica.
  capability_note: Proved 38 of the first 52 theorems in Principia chapter 2, one with a proof shorter than the original. The domain was narrow and formal.
  edges: [{type: inspired-by, target: turing-1950-computing-machinery}]
  source_url: https://doi.org/10.1109/TIT.1956.1056797   # Newell & Simon, "The logic theory machine", IRE Trans. Info. Theory
  hero_moment_candidate: yes

- id: fortran-1957
  title: FORTRAN
  date: "1957-04"
  type: Product
  era: 1
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Frameworks & SDKs
  creators: [John Backus, IBM]
  description: The first widely adopted high-level programming language, with an optimising compiler.
  capability_note: Scientists could program without writing assembly. This widened who could build software.
  edges: []
  source_url: https://www.ibm.com/history/fortran   [unfetched-url]
  hero_moment_candidate: no

- id: general-problem-solver-1957
  title: General Problem Solver (GPS)
  date: "1957–1959"
  type: Model
  era: 1
  primary_segment: Symbolic & Logic AI
  secondary_segments: []
  stack_layer: Models
  creators: [Allen Newell, Cliff Shaw, Herbert Simon]
  description: Used means-ends analysis as a claimed general method for any problem that can be stated formally.
  capability_note: Solved puzzles such as Tower of Hanoi and logic proofs. It was swamped by combinatorial explosion on real-world problems, so the "general" claim did not hold.
  edges: [{type: successor-of, target: logic-theorist-1956}]
  source_url: https://ai.stanford.edu/~nilsson/QAI/qai.pdf   # Nilsson ch. 5; original RAND report P-1584 (1959)
  hero_moment_candidate: no

- id: perceptron-1958
  title: Rosenblatt's Perceptron (and Mark I Perceptron)
  date: "1957 (Cornell report); 1958-07-07 (Navy demo); 1958 (Psych. Review); 1960 (Mark I hardware)"
  type: Model
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: [Vision]
  stack_layer: Models
  creators: [Frank Rosenblatt, Cornell Aeronautical Laboratory, US Office of Naval Research]
  description: A single-layer trainable classifier with an error-correction learning rule. The Mark I used a 20x20 photocell "retina".
  capability_note: Learned to separate simple visual patterns into two categories. It could not learn functions that are not linearly separable. Press coverage in 1958 claimed far more (see Section 4).
  edges: [{type: built-on, target: mcculloch-pitts-1943}]
  source_url: https://doi.org/10.1037/h0042519
  hero_moment_candidate: yes

- id: lisp-1958
  title: LISP
  date: "1958 (designed); 1960 (CACM paper)"
  type: Paper
  era: 1
  primary_segment: Symbolic & Logic AI
  secondary_segments: []
  stack_layer: Frameworks & SDKs
  creators: [John McCarthy, MIT]
  description: A list-processing language with recursion, garbage collection and code-as-data. It was the dominant AI language for about 30 years.
  capability_note: Made symbolic programs (search, theorem proving, planners, expert systems) practical to write. It later spawned dedicated Lisp machines.
  edges: [{type: inspired-by, target: logic-theorist-1956}]
  source_url: https://doi.org/10.1145/367177.367199
  hero_moment_candidate: yes

- id: integrated-circuit-1958
  title: Integrated circuit
  date: "1958-09-12 (Kilby, TI); 1959 (Noyce planar IC, Fairchild)"
  type: Product
  era: 1
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Compute & Hardware
  creators: [Jack Kilby, Robert Noyce]
  description: Multiple transistors built on one piece of semiconductor.
  capability_note: The start of exponential density scaling.
  edges: [{type: built-on, target: transistor-1947}]
  source_url: https://www.computerhistory.org/siliconengine/timeline/   [unfetched-url]
  hero_moment_candidate: no

- id: hubel-wiesel-1962
  title: Hubel & Wiesel, receptive fields in cat visual cortex
  date: "1959; 1962 (J. Physiol.)"
  type: Paper
  era: 4
  primary_segment: Vision
  secondary_segments: [Neural Networks & Deep Learning]
  stack_layer: Algorithms & Research
  creators: [David Hubel, Torsten Wiesel]
  description: Found "simple" and "complex" cells arranged in a hierarchy that respond to oriented edges.
  capability_note: Neuroscience, not AI. It directly inspired the Neocognitron and CNNs.
  edges: []
  source_url: https://doi.org/10.1113/jphysiol.1962.sp006837
  hero_moment_candidate: no

- id: adaline-1960
  title: ADALINE / LMS (Widrow–Hoff rule)
  date: "1960"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: [Speech & Audio]
  stack_layer: Algorithms & Research
  creators: [Bernard Widrow, Ted Hoff, Stanford]
  description: An adaptive linear neuron trained with least-mean-squares gradient descent.
  capability_note: Pattern classification and adaptive filtering. LMS became standard in echo cancellation and modems, so it was deployed for real.
  edges: [{type: competes-with, target: perceptron-1958}]
  source_url: https://ai.stanford.edu/~nilsson/QAI/qai.pdf   # Nilsson ch. 4; original: Widrow & Hoff, IRE WESCON 1960
  hero_moment_candidate: no

- id: unimate-1961
  title: Unimate industrial robot at GM
  date: "1961"
  type: Product
  era: 2
  primary_segment: Robotics & Embodied
  secondary_segments: []
  stack_layer: Apps & Products
  creators: [George Devol, Joseph Engelberger, Unimation, General Motors]
  description: A programmable hydraulic arm installed on a GM die-casting line.
  capability_note: Repeated taught motion sequences with no perception. It was industrially useful.
  edges: []
  source_url: https://www.computerhistory.org/timeline/ai-robotics/   [unfetched-url]
  hero_moment_candidate: no

- id: moores-law-1965
  title: Moore's "Cramming more components onto integrated circuits"
  date: "1965-04-19"
  type: Paper
  era: 1
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Compute & Hardware
  creators: [Gordon Moore, Fairchild]
  description: Observed that the number of components per chip was doubling about every year; Moore revised this to every two years in 1975.
  capability_note: An empirical trend that held for decades. It is the compute backdrop to every later capability.
  edges: [{type: built-on, target: integrated-circuit-1958}]
  source_url: https://www.computerhistory.org/siliconengine/moores-law-predicts-the-future-of-integrated-circuits/   [unfetched-url]
  hero_moment_candidate: no

- id: gmdh-ivakhnenko-1965
  title: Group Method of Data Handling (deep multilayer nets)
  date: "1965; 1971 (8-layer net)"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: [Classical ML]
  stack_layer: Algorithms & Research
  creators: [Alexey Ivakhnenko, Valentin Lapa]
  description: Trained multilayer polynomial networks layer by layer using regression and pruning on held-out data. Schmidhuber calls these the first deep learning networks.
  capability_note: Small-scale modelling and prediction. Little known outside the USSR at the time.
  edges: [{type: built-on, target: perceptron-1958}]
  source_url: https://arxiv.org/abs/1404.7828   # Schmidhuber, "Deep Learning in Neural Networks: An Overview"
  hero_moment_candidate: no

- id: dendral-1965
  title: DENDRAL
  date: "1965"
  type: Model
  era: 2
  primary_segment: Symbolic & Logic AI
  secondary_segments: []
  stack_layer: Models
  creators: [Edward Feigenbaum, Bruce Buchanan, Joshua Lederberg, Carl Djerassi, Stanford]
  description: Inferred molecular structure from mass-spectrometry data by applying chemists' heuristics. It is widely called the first expert system.
  capability_note: Proposed candidate structures for organic molecules with performance at expert level in a narrow class. Results were published in the chemistry literature.
  edges: [{type: uses, target: lisp-1958}]
  source_url: https://profiles.nlm.nih.gov/spotlight/bb/feature/ai   [unfetched-url]  # NLM Lederberg Papers, "Computers, AI and DENDRAL"
  hero_moment_candidate: no

- id: eliza-1966
  title: ELIZA
  date: "1966-01"
  type: Model
  era: 2
  primary_segment: Language/NLP
  secondary_segments: [Personal Agents]
  stack_layer: Apps & Products
  creators: [Joseph Weizenbaum, MIT]
  description: A keyword-and-template chatbot. The best-known script, DOCTOR, parodied a Rogerian therapist.
  capability_note: Reflected user input back using pattern rules. It had no understanding. Users still attributed understanding to it (the "ELIZA effect"), which led Weizenbaum to become a critic (Computer Power and Human Reason, 1976).
  edges: [{type: uses, target: lisp-1958}]
  source_url: https://doi.org/10.1145/365153.365168
  hero_moment_candidate: yes

- id: alpac-1966
  title: ALPAC report, "Language and Machines"
  date: "1966-11"
  type: Event
  era: 2
  primary_segment: Language/NLP
  secondary_segments: []
  stack_layer: Ops/Eval/Safety
  creators: [Automatic Language Processing Advisory Committee, US National Academy of Sciences]
  description: Found that machine translation was slower, less accurate and costlier than human translation. US MT funding was cut sharply afterwards.
  capability_note: An evaluation event. It was the first formal public check on AI claims, 12 years after Georgetown–IBM.
  edges: [{type: successor-of, target: georgetown-ibm-1954}]
  source_url: https://nap.nationalacademies.org/catalog/9547   [unfetched-url]
  hero_moment_candidate: yes

- id: mac-hack-1967
  title: Mac Hack VI plays in human chess tournaments
  date: "1967"
  type: Model
  era: 1
  primary_segment: RL & Games
  secondary_segments: []
  stack_layer: Models
  creators: [Richard Greenblatt, MIT]
  description: The first chess program to play in human tournaments and receive a rating.
  capability_note: Reached a USCF rating of about 1243 (club-player level) in 1967, against the 1958 forecast of a world champion "within ten years".
  edges: [{type: built-on, target: shannon-chess-1950}]
  source_url: https://chessprogramming.org/Herbert_Simon   # rating context; see also https://www.chessprogramming.org/Mac_Hack
  hero_moment_candidate: no

- id: nearest-neighbor-1967
  title: Cover & Hart, "Nearest neighbor pattern classification"
  date: "1967-01"
  type: Paper
  era: 3
  primary_segment: Classical ML
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [Thomas Cover, Peter Hart]
  description: Proved error bounds for the k-nearest-neighbour classifier.
  capability_note: A simple, non-parametric classifier that became a basic ML baseline.
  edges: []
  source_url: https://doi.org/10.1109/TIT.1967.1053964
  hero_moment_candidate: no

- id: shakey-1966
  title: Shakey the robot
  date: "1966–1972"
  type: Model
  era: 2
  primary_segment: Robotics & Embodied
  secondary_segments: [Symbolic & Logic AI, Vision]
  stack_layer: Harnesses & Agents
  creators: [Charles Rosen, Nils Nilsson, Peter Hart, Bertram Raphael, SRI International]
  description: The first mobile robot to perceive its surroundings, plan with STRIPS and act. It produced A*, STRIPS and the Hough-transform line detector.
  capability_note: Pushed blocks between rooms in a specially prepared environment of plain walls and simple objects. Each action took minutes to hours of computation. LIFE magazine called it the "first electronic person" (1970).
  edges: [{type: uses, target: a-star-1968}, {type: uses, target: lisp-1958}]
  source_url: https://www.sri.com/hoi/shakey-the-robot/   [unfetched-url]
  hero_moment_candidate: yes

- id: a-star-1968
  title: A* search algorithm
  date: "1968-07"
  type: Paper
  era: 1
  primary_segment: Symbolic & Logic AI
  secondary_segments: [Robotics & Embodied]
  stack_layer: Algorithms & Research
  creators: [Peter Hart, Nils Nilsson, Bertram Raphael, SRI]
  description: Best-first graph search with an admissible heuristic that guarantees an optimal path.
  capability_note: Still the standard for pathfinding in games, maps and robotics.
  edges: []
  source_url: https://doi.org/10.1109/TSSC.1968.300136
  hero_moment_candidate: no

- id: perceptrons-book-1969
  title: Minsky & Papert, "Perceptrons"
  date: "1969"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [Marvin Minsky, Seymour Papert, MIT]
  description: A mathematical analysis of the limits of single-layer perceptrons, for example that parity and connectedness cannot be computed with bounded-order predicates.
  capability_note: The proofs were correct for single layers. The book is widely credited with deflating neural-network funding through the 1970s, though historians dispute how much it caused (see Gaps).
  edges: [{type: successor-of, target: perceptron-1958}]
  source_url: https://mitpress.mit.edu/9780262630221/perceptrons/   [unfetched-url]
  hero_moment_candidate: yes

- id: shrdlu-1970
  title: SHRDLU
  date: "1968–1970 (built); 1971 (MIT thesis, AI-TR-235); 1972 (book)"
  type: Model
  era: 2
  primary_segment: Language/NLP
  secondary_segments: [Symbolic & Logic AI]
  stack_layer: Models
  creators: [Terry Winograd, MIT]
  description: A natural-language dialogue system for a simulated "blocks world". It parsed commands, planned actions and answered questions about its own actions.
  capability_note: Handled rich dialogue in a closed micro-world of a few dozen objects. It did not scale beyond that world. Winograd later left this approach.
  edges: [{type: uses, target: lisp-1958}, {type: successor-of, target: eliza-1966}]
  source_url: https://hci.stanford.edu/winograd/shrdlu/   [unfetched-url]
  hero_moment_candidate: yes

- id: linnainmaa-1970
  title: Linnainmaa, reverse-mode automatic differentiation
  date: "1970 (MSc thesis); 1976 (BIT)"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [Seppo Linnainmaa, University of Helsinki]
  description: Described reverse-mode automatic differentiation, which is the algorithm behind backpropagation. It was not applied to neural networks.
  capability_note: Efficient gradients of any composite function.
  edges: []
  source_url: https://doi.org/10.1007/BF01931367
  hero_moment_candidate: no

- id: intel-4004-1971
  title: Intel 4004 microprocessor
  date: "1971-11-15"
  type: Product
  era: 1
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Compute & Hardware
  creators: [Federico Faggin, Ted Hoff, Stanley Mazor, Masatoshi Shima, Intel/Busicom]
  description: The first commercial single-chip CPU.
  capability_note: About 2,300 transistors. It started the path to personal computers.
  edges: [{type: built-on, target: integrated-circuit-1958}]
  source_url: https://www.intel.com/content/www/us/en/history/museum-story-of-intel-4004.html   [unfetched-url]
  hero_moment_candidate: no

- id: prolog-1972
  title: Prolog
  date: "1971 (preliminary version); 1972 (definitive, named); 1974 (Kowalski procedural interpretation)"
  type: Paper
  era: 1
  primary_segment: Symbolic & Logic AI
  secondary_segments: [Language/NLP]
  stack_layer: Frameworks & SDKs
  creators: [Alain Colmerauer, Philippe Roussel (Marseille), Robert Kowalski (Edinburgh)]
  description: A logic-programming language in which programs are Horn clauses and execution is resolution theorem proving. It grew out of a French natural-language question-answering project. Roussel coined the name ("PROgrammation en LOGique").
  capability_note: Made declarative rule-based programs and parsers concise. It became the language of the Japanese Fifth Generation project and of European AI generally.
  edges: [{type: competes-with, target: lisp-1958}]
  source_url: https://doi.org/10.1145/155360.155362   # Colmerauer & Roussel, "The birth of Prolog", HOPL-II
  hero_moment_candidate: yes

- id: mycin-1972
  title: MYCIN
  date: "1972–1976 (Shortliffe thesis 1974); 1979 (JAMA evaluation)"
  type: Model
  era: 2
  primary_segment: Symbolic & Logic AI
  secondary_segments: []
  stack_layer: Models
  creators: [Edward Shortliffe, Bruce Buchanan, Stanford]
  description: A rule-based system of about 600 rules for choosing antibiotics for blood infections and meningitis. It used "certainty factors" for uncertainty and could explain its reasoning.
  capability_note: In a blinded 1979 evaluation on meningitis cases its recommendations were rated acceptable at a rate comparable to or better than Stanford infectious-disease faculty. It was never used in routine clinical care because of integration, liability and data-entry burden.
  edges: [{type: successor-of, target: dendral-1965}, {type: uses, target: lisp-1958}]
  source_url: https://doi.org/10.1001/jama.1979.03300120033020   # Yu et al., JAMA 242(12), 1979; see also Buchanan & Shortliffe 1984 book https://www.shortliffe.net/Buchanan-Shortliffe-1984/MYCIN%20Book.htm
  hero_moment_candidate: yes

- id: lighthill-report-1973
  title: Lighthill Report, "Artificial Intelligence: A General Survey"
  date: "1973"
  type: Event
  era: 2
  primary_segment: Symbolic & Logic AI
  secondary_segments: [Robotics & Embodied, Language/NLP]
  stack_layer: Ops/Eval/Safety
  creators: [Sir James Lighthill, UK Science Research Council]
  description: A review for the SRC that found AI had not met its promises and singled out "combinatorial explosion". It was followed by a televised BBC debate (1973) with Michie, McCarthy and Gregory.
  capability_note: An evaluation event. The UK cut AI support to a few universities.
  edges: []
  source_url: https://rodsmith.nz/wp-content/uploads/Lighthill_1973_Report.pdf   # full text of report; alt archive http://www.chilton-computing.org.uk/inf/literature/reports/lighthill_report/contents.htm
  hero_moment_candidate: yes

- id: werbos-1974
  title: Werbos PhD thesis, "Beyond Regression" (backprop for neural nets)
  date: "1974"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [Paul Werbos, Harvard]
  description: Proposed training multilayer networks by propagating derivatives backwards. It was largely unnoticed until the 1980s.
  capability_note: Theory. Werbos applied it to NNs explicitly in a 1982 paper.
  edges: [{type: built-on, target: linnainmaa-1970}]
  source_url: https://arxiv.org/abs/1404.7828   # Schmidhuber survey, sec. 5.5 (history of backprop)
  hero_moment_candidate: no

- id: first-ai-winter
  title: First AI winter (funding contraction)
  date: "c. 1974–1980"
  type: Event
  era: 2
  primary_segment: Symbolic & Logic AI
  secondary_segments: [Language/NLP, Neural Networks & Deep Learning]
  stack_layer: Ops/Eval/Safety
  creators: [DARPA, UK SRC, US NRC]
  description: Funding fell after ALPAC, Lighthill and the Mansfield Amendments, which pushed DARPA towards mission-oriented research, and after DARPA's disappointment with the Speech Understanding Research programme.
  capability_note: Results in toy domains had not carried over to real-world scale. Combinatorial explosion and missing common-sense knowledge were the core technical limits.
  edges: [{type: successor-of, target: lighthill-report-1973}, {type: successor-of, target: alpac-1966}, {type: successor-of, target: perceptrons-book-1969}]
  source_url: https://ai.stanford.edu/~nilsson/QAI/qai.pdf   # Nilsson, ch. 14 "Speech understanding" & ch. on 1970s funding
  hero_moment_candidate: yes

- id: minsky-frames-1974
  title: Minsky, "A Framework for Representing Knowledge"
  date: "1974-06"
  type: Paper
  era: 2
  primary_segment: Symbolic & Logic AI
  secondary_segments: [Vision, Language/NLP]
  stack_layer: Algorithms & Research
  creators: [Marvin Minsky, MIT AI Lab]
  description: Proposed "frames", structured stereotypes with default slots, as a knowledge representation.
  capability_note: Shaped expert-system shells and object-oriented knowledge representation. It was a design idea, not a system.
  edges: []
  source_url: https://dspace.mit.edu/handle/1721.1/6089   # MIT AI Memo 306
  hero_moment_candidate: no

- id: darpa-sur-harpy-1976
  title: DARPA Speech Understanding Research programme; CMU Harpy and Hearsay-II
  date: "1971–1976"
  type: Event
  era: 2
  primary_segment: Speech & Audio
  secondary_segments: [Language/NLP]
  stack_layer: Models
  creators: [DARPA, CMU (Raj Reddy, Bruce Lowerre), BBN, SRI]
  description: A five-year programme aimed at connected speech understanding with a 1,000-word vocabulary.
  capability_note: Harpy met the 1,000-word target with a constrained grammar and cooperative speakers. DARPA judged the results impractical and did not renew the programme.
  edges: []
  source_url: https://ai.stanford.edu/~nilsson/QAI/qai.pdf   # Nilsson ch. 14
  hero_moment_candidate: no

- id: hmm-speech-1975
  title: Statistical (HMM) speech recognition — Baker's DRAGON, Jelinek at IBM
  date: "1975–1976"
  type: Paper
  era: 3
  primary_segment: Speech & Audio
  secondary_segments: [Classical ML]
  stack_layer: Algorithms & Research
  creators: [James Baker, Janet Baker, Frederick Jelinek, IBM]
  description: Modelled speech as a hidden Markov process and trained from data instead of hand-written rules.
  capability_note: This data-driven approach came to dominate speech recognition until about 2010. Jelinek's line "every time I fire a linguist..." is often quoted, but its wording is disputed and I did not verify it.
  edges: [{type: competes-with, target: darpa-sur-harpy-1976}]
  source_url: https://doi.org/10.1109/PROC.1976.10159   # Jelinek, "Continuous speech recognition by statistical methods", Proc. IEEE 1976
  hero_moment_candidate: no

- id: kurzweil-reading-machine-1976
  title: Kurzweil Reading Machine
  date: "1976-01"
  type: Product
  era: 4
  primary_segment: Vision
  secondary_segments: [Speech & Audio]
  stack_layer: Apps & Products
  creators: [Ray Kurzweil, Kurzweil Computer Products]
  description: Omni-font OCR combined with text-to-speech so blind users could have printed text read aloud.
  capability_note: Read printed books aloud. It was expensive, and early units ran to tens of thousands of dollars.
  edges: []
  source_url: https://www.kurzweiltech.com/kcp.html   [unfetched-url]
  hero_moment_candidate: no

- id: em-algorithm-1977
  title: Expectation–Maximization algorithm (Dempster, Laird, Rubin)
  date: "1977"
  type: Paper
  era: 3
  primary_segment: Classical ML
  secondary_segments: [Speech & Audio]
  stack_layer: Algorithms & Research
  creators: [Arthur Dempster, Nan Laird, Donald Rubin]
  description: A general method for maximum-likelihood estimation with latent variables.
  capability_note: The workhorse for training HMMs and mixture models for decades.
  edges: []
  source_url: https://www.jstor.org/stable/2984875
  hero_moment_candidate: no

- id: bkg-backgammon-1979
  title: BKG 9.8 defeats backgammon world champion Luigi Villa
  date: "1979-07"
  type: Event
  era: 2
  primary_segment: RL & Games
  secondary_segments: []
  stack_layer: Models
  creators: [Hans Berliner, CMU]
  description: The first time a program beat a reigning world champion in any board or card game, in a 7-point exhibition match.
  capability_note: Won 7–1. Berliner acknowledged that the dice were favourable, so it was not proof of superior play.
  edges: []
  source_url: https://doi.org/10.1016/0004-3702(80)90041-7   # Berliner, "Backgammon computer program beats world champion", AIJ 14 (1980)
  hero_moment_candidate: no

- id: stanford-cart-1979
  title: Stanford Cart crosses a chair-filled room
  date: "1979-10"
  type: Model
  era: 4
  primary_segment: Robotics & Embodied
  secondary_segments: [Vision]
  stack_layer: Models
  creators: [Hans Moravec, Stanford AI Lab]
  description: A camera-equipped cart that used stereo vision to map obstacles and plan a path.
  capability_note: Crossed a room of obstacles in about 5 hours, moving roughly 1 m every 10–15 minutes. This is concrete evidence for "Moravec's paradox", that perception and mobility are hard.
  edges: [{type: successor-of, target: shakey-1966}]
  source_url: https://frc.ri.cmu.edu/~hpm/project.archive/robot.papers/1975.cart/1980.html.thesis/   [unfetched-url]
  hero_moment_candidate: no

- id: neocognitron-1980
  title: Fukushima's Neocognitron
  date: "1979 (Japanese); 1980 (Biol. Cybern.)"
  type: Paper
  era: 4
  primary_segment: Vision
  secondary_segments: [Neural Networks & Deep Learning]
  stack_layer: Algorithms & Research
  creators: [Kunihiko Fukushima, NHK]
  description: A hierarchical network of alternating feature-extracting and pooling layers, modelled on Hubel and Wiesel. It is the architectural ancestor of CNNs.
  capability_note: Recognised handwritten characters with some tolerance to shift. It was trained without backpropagation.
  edges: [{type: inspired-by, target: hubel-wiesel-1962}]
  source_url: https://doi.org/10.1007/BF00344251
  hero_moment_candidate: no
```

### Inferences
- In this period a system typically showed something real (theorem proofs, parsing blocks-world English, expert-level antibiotic advice) inside a sealed micro-domain. Forecasts then assumed the result would scale. The gap between micro-world success and real-world scale is the main pattern of 1956–1979.
- Several key learning ideas (reverse-mode AD in 1970, Werbos in 1974, GMDH, the Neocognitron) existed in the 1970s but had no data or compute to show their value. That mismatch between ideas and resources is itself a good "unhyped" theme.

### Gaps
- How much Perceptrons (1969) caused the drop in neural-network funding is disputed. Olazaran's sociology-of-science account is a good source to add, but I did not fetch it.
- I did not verify the exact date of the NYT perceptron article. The Navy demo was 7 July 1958, and The Conversation dates the NYT piece to 7 July, but the print article is often cited as 8 July 1958 ("New Navy Device Learns By Doing").
- The Jelinek "fire a linguist" quote is not verified and should not be used verbatim.

## Q3. 1980–2011: expert-system boom and bust, then machines learn patterns, see and hear (entries)

### Takeaway
The 1980s commercialised rule-based AI (XCON, Lisp machines, national programmes such as Japan's FGCS, the UK's Alvey and DARPA's Strategic Computing). Most of it contracted by 1987–1993, the second AI winter. Meanwhile statistical and connectionist methods matured: Hopfield, Boltzmann, backprop, CNNs, LSTM, SVMs, boosting, Bayes nets and random forests. These produced quiet deployments such as check reading, spam filters and speech dictation, while game milestones (TD-Gammon, Chinook, Deep Blue) drew public attention. From 2006 to 2011 deep belief nets, GPUs through CUDA, ImageNet and deep speech models set up the 2012 break. Watson and Siri in 2011 were the public face of AI but used earlier, pipeline-style technology.

### Cited Findings

```yaml
- id: xcon-r1-1980
  title: R1 / XCON at Digital Equipment Corporation
  date: "1978 (development began); 1980 (in production at DEC); 1982 (AIJ paper)"
  type: Product
  era: 2
  primary_segment: Symbolic & Logic AI
  secondary_segments: []
  stack_layer: Apps & Products
  creators: [John McDermott, CMU, Digital Equipment Corporation]
  description: A production-rule system written in OPS5 that configured VAX computer orders. It was the first commercially successful expert system.
  capability_note: Configured orders with high accuracy and grew to thousands of rules. Maintaining the rules became a major cost, a classic symptom of the knowledge-acquisition bottleneck.
  edges: [{type: successor-of, target: mycin-1972}]
  source_url: https://doi.org/10.1016/0004-3702(82)90021-2   # McDermott, "R1: A rule-based configurer of computer systems", AIJ 19 (1982)
  hero_moment_candidate: yes

- id: symbolics-lisp-machines
  title: Lisp machine companies (Symbolics, LMI) and Lisp-machine hardware
  date: "1979–1980 (founded); 1987 (market collapse)"
  type: Organization
  era: 2
  primary_segment: Compute & Hardware
  secondary_segments: [Symbolic & Logic AI]
  stack_layer: Compute & Hardware
  creators: [Symbolics, Lisp Machines Inc., MIT AI Lab spinoffs, Texas Instruments, Xerox]
  description: Workstations designed specifically to run Lisp for AI development.
  capability_note: Excellent development environments. General-purpose workstations (Sun and others) and PCs running Lisp matched them at a fraction of the price by about 1987, and the specialised market collapsed.
  edges: [{type: uses, target: lisp-1958}]
  source_url: https://ai.stanford.edu/~nilsson/QAI/qai.pdf   # Nilsson, ch. on the AI winter (Lisp-machine collapse)
  hero_moment_candidate: no

- id: fifth-generation-1982
  title: Japan's Fifth Generation Computer Systems project (FGCS / ICOT)
  date: "1982-04 (ICOT founded) – 1992 (final conference)"
  type: Organization
  era: 2
  primary_segment: Symbolic & Logic AI
  secondary_segments: [Compute & Hardware, Language/NLP]
  stack_layer: Compute & Hardware
  creators: [MITI, ICOT, Kazuhiro Fuchi]
  description: A ten-year national programme to build massively parallel "inference machines" with logic programming at the core. It started with Prolog and moved to the concurrent languages GHC and KL1.
  capability_note: Built the PSI sequential and PIM parallel inference machines, which met the target of about 150M logical inferences per second. About 20 application demos ran on PIM in 1992. None were deployed commercially. It triggered Western responses (Alvey, the Strategic Computing Initiative, MCC). A major Claim-vs-Reality case.
  edges: [{type: uses, target: prolog-1972}]
  source_url: https://arxiv.org/abs/2201.10816   # Körner et al., "Fifty Years of Prolog and Beyond" (TPLP 2022), FGCS section; appraisal: https://www.sciencedirect.com/science/article/abs/pii/0167739X93900027
  hero_moment_candidate: yes

- id: hopfield-network-1982
  title: Hopfield networks
  date: "1982-04"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [John Hopfield, Caltech]
  description: A recurrent network with symmetric weights and an energy function. Stored patterns become attractors, which gives content-addressable memory.
  capability_note: Recalled stored patterns from partial or noisy cues, with capacity of about 0.14N patterns. It made neural networks respectable to physicists. Hopfield shared the 2024 Nobel Prize in Physics with Hinton for this line of work.
  edges: [{type: built-on, target: mcculloch-pitts-1943}]
  source_url: https://doi.org/10.1073/pnas.79.8.2554
  hero_moment_candidate: yes

- id: kohonen-som-1982
  title: Kohonen self-organizing maps
  date: "1982"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: [Classical ML]
  stack_layer: Algorithms & Research
  creators: [Teuvo Kohonen, Helsinki University of Technology]
  description: Unsupervised competitive learning that maps high-dimensional data onto a low-dimensional grid while preserving topology.
  capability_note: Clustering and visualisation, and an early "phonetic typewriter" for Finnish speech.
  edges: []
  source_url: https://doi.org/10.1007/BF00337288
  hero_moment_candidate: no

- id: prospector-1982
  title: PROSPECTOR identifies a molybdenum deposit
  date: "1982-09 (Science paper); system developed 1976–1980"
  type: Model
  era: 2
  primary_segment: Symbolic & Logic AI
  secondary_segments: []
  stack_layer: Models
  creators: [Peter Hart, Richard Duda, SRI International, USGS]
  description: A geological expert system that used Bayesian-style inference networks.
  capability_note: Predicted the location of an ore body at Mt. Tolman, Washington, which drilling later confirmed. It is one of the few expert-system results validated in the field.
  edges: [{type: competes-with, target: mycin-1972}]
  source_url: https://doi.org/10.1126/science.217.4563.927
  hero_moment_candidate: no

- id: strategic-computing-initiative-1983
  title: DARPA Strategic Computing Initiative (and UK Alvey Programme)
  date: "1983–1993"
  type: Event
  era: 2
  primary_segment: Symbolic & Logic AI
  secondary_segments: [Compute & Hardware, Robotics & Embodied]
  stack_layer: Compute & Hardware
  creators: [DARPA, UK Alvey Directorate]
  description: About $1B over ten years for machine intelligence, including an autonomous land vehicle, a pilot's associate and battle management, partly in response to FGCS.
  capability_note: Funded the Autonomous Land Vehicle and Navlab lines and parallel hardware such as the Connection Machine. DARPA scaled back the AI goals from about 1987.
  edges: [{type: competes-with, target: fifth-generation-1982}]
  source_url: https://mitpress.mit.edu/9780262182065/strategic-computing/   [unfetched-url]  # Roland & Shiman, "Strategic Computing" (MIT Press 2002)
  hero_moment_candidate: no

- id: cyc-1984
  title: Cyc
  date: "1984 (started at MCC)"
  type: Model
  era: 2
  primary_segment: Symbolic & Logic AI
  secondary_segments: [Language/NLP]
  stack_layer: Data
  creators: [Douglas Lenat, MCC, later Cycorp]
  description: A long-running effort to hand-encode common-sense knowledge as logical assertions.
  capability_note: Accumulated millions of assertions over decades. It never reached the broad common-sense reasoning or self-directed learning its founders aimed for. A long-running Claim-vs-Reality case.
  edges: [{type: successor-of, target: minsky-frames-1974}]
  source_url: https://doi.org/10.1145/219717.219745   # Lenat, "CYC: A large-scale investment in knowledge infrastructure", CACM 1995
  hero_moment_candidate: no

- id: cart-decision-trees-1984
  title: Classification and Regression Trees (CART) and ID3
  date: "1984 (CART book); 1986 (Quinlan ID3, Machine Learning 1:81)"
  type: Paper
  era: 3
  primary_segment: Classical ML
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [Leo Breiman, Jerome Friedman, Richard Olshen, Charles Stone, J. Ross Quinlan]
  description: Methods for learning decision trees from data, which acquire rules automatically instead of from interviews with experts.
  capability_note: Produced readable classifiers from tabular data. This gave a way round the expert-system knowledge bottleneck. C4.5 followed in 1993.
  edges: [{type: competes-with, target: xcon-r1-1980}]
  source_url: https://doi.org/10.1007/BF00116251   # Quinlan, "Induction of decision trees", 1986
  hero_moment_candidate: no

- id: boltzmann-machine-1985
  title: Boltzmann machines
  date: "1983 (Hinton & Sejnowski); 1985 (Cognitive Science paper)"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: [Generative Media]
  stack_layer: Algorithms & Research
  creators: [David Ackley, Geoffrey Hinton, Terrence Sejnowski]
  description: A stochastic recurrent network with hidden units and a learning rule for probabilistic generative models.
  capability_note: Learned internal representations on small problems. Learning was very slow, and the restricted variant (RBM) later became practical in 2006.
  edges: [{type: built-on, target: hopfield-network-1982}]
  source_url: https://doi.org/10.1207/s15516709cog0901_7
  hero_moment_candidate: no

- id: brooks-subsumption-1986
  title: Brooks's subsumption architecture (behaviour-based robotics)
  date: "1986-03"
  type: Paper
  era: 2
  primary_segment: Robotics & Embodied
  secondary_segments: []
  stack_layer: Harnesses & Agents
  creators: [Rodney Brooks, MIT]
  description: Layered reactive behaviours with no central world model, in contrast to Shakey-style sense-plan-act.
  capability_note: Robust insect-like walking and obstacle avoidance (the Genghis hexapod, 1989). It led to iRobot and the Roomba.
  edges: [{type: competes-with, target: shakey-1966}]
  source_url: https://doi.org/10.1109/JRA.1986.1087032
  hero_moment_candidate: no

- id: backprop-1986
  title: Rumelhart, Hinton & Williams, "Learning representations by back-propagating errors" (and the PDP volumes)
  date: "1986-10-09 (Nature); 1986 (PDP volumes, MIT Press)"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [David Rumelhart, Geoffrey Hinton, Ronald Williams, PDP Research Group]
  description: Showed that backpropagation trains multilayer networks whose hidden units learn useful internal representations.
  capability_note: Solved problems a single-layer perceptron cannot, such as XOR and parity, and learned family-tree relations. It was limited to small networks by data and compute. The algorithm had earlier forms (Linnainmaa 1970, Werbos 1974/1982, Parker 1985, LeCun 1985).
  edges: [{type: built-on, target: linnainmaa-1970}, {type: built-on, target: werbos-1974}, {type: successor-of, target: perceptrons-book-1969}]
  source_url: https://doi.org/10.1038/323533a0
  hero_moment_candidate: yes

- id: nettalk-1987
  title: NETtalk
  date: "1986 (tech report); 1987 (Complex Systems)"
  type: Model
  era: 3
  primary_segment: Speech & Audio
  secondary_segments: [Neural Networks & Deep Learning, Language/NLP]
  stack_layer: Models
  creators: [Terrence Sejnowski, Charles Rosenberg, Johns Hopkins]
  description: A backprop network that learned English text-to-phoneme conversion and drove a DECtalk synthesiser.
  capability_note: Learned pronunciation from examples, reaching about 90% phoneme accuracy on training text. It was demonstrated widely, including on NBC's Today show, with audio that sounded like babbling turning into speech.
  edges: [{type: built-on, target: backprop-1986}]
  source_url: https://www.complex-systems.com/abstracts/v01_i01_a10/   [unfetched-url]  # Sejnowski & Rosenberg, "Parallel networks that learn to pronounce English text", Complex Systems 1 (1987)
  hero_moment_candidate: yes

- id: second-ai-winter
  title: Second AI winter (expert-system and Lisp-machine bust)
  date: "c. 1987–1993"
  type: Event
  era: 2
  primary_segment: Symbolic & Logic AI
  secondary_segments: [Compute & Hardware]
  stack_layer: Ops/Eval/Safety
  creators: [industry-wide]
  description: The Lisp-machine market collapsed in 1987. Expert systems proved brittle and costly to maintain. DARPA cut Strategic Computing AI goals, and FGCS ended in 1992 without commercial take-up.
  capability_note: Expert systems stayed in niche use under other names, such as "business rules". The label "AI" became a liability for funding.
  edges: [{type: successor-of, target: symbolics-lisp-machines}, {type: successor-of, target: fifth-generation-1982}, {type: successor-of, target: strategic-computing-initiative-1983}]
  source_url: https://ai.stanford.edu/~nilsson/QAI/qai.pdf   # Nilsson, "The Quest for AI", Part V
  hero_moment_candidate: yes

- id: pearl-bayesian-networks-1988
  title: Pearl, "Probabilistic Reasoning in Intelligent Systems" (Bayesian networks)
  date: "1988"
  type: Paper
  era: 3
  primary_segment: Classical ML
  secondary_segments: [Symbolic & Logic AI]
  stack_layer: Algorithms & Research
  creators: [Judea Pearl, UCLA]
  description: Graphical models for representing uncertain knowledge, with efficient inference by belief propagation.
  capability_note: Replaced ad hoc certainty factors with sound probability. Used in medical diagnosis and fault detection, and Microsoft's spam and troubleshooting tools drew on it. Pearl won the 2011 Turing Award.
  edges: [{type: successor-of, target: mycin-1972}, {type: built-on, target: prospector-1982}]
  source_url: https://amturing.acm.org/award_winners/pearl_2658896.cfm
  hero_moment_candidate: yes

- id: td-learning-q-learning-1988
  title: Temporal-difference learning (Sutton 1988) and Q-learning (Watkins 1989)
  date: "1988 (TD); 1989 (Q-learning thesis); 1992 (convergence proof)"
  type: Paper
  era: 3
  primary_segment: RL & Games
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [Richard Sutton, Chris Watkins, Peter Dayan]
  description: Learning value predictions from the difference between successive estimates, and off-policy action-value learning.
  capability_note: The core RL algorithms behind TD-Gammon and, much later, DQN (2013).
  edges: [{type: inspired-by, target: samuel-checkers}]
  source_url: https://doi.org/10.1007/BF00115009   # Sutton 1988; Watkins & Dayan 1992: https://doi.org/10.1007/BF00992698
  hero_moment_candidate: no

- id: alvinn-navlab-1989
  title: ALVINN / CMU Navlab (neural-network driving) and "No Hands Across America"
  date: "1989 (ALVINN, NIPS 1988 proceedings); 1995-07 (No Hands Across America)"
  type: Model
  era: 4
  primary_segment: Robotics & Embodied
  secondary_segments: [Vision, Neural Networks & Deep Learning]
  stack_layer: Models
  creators: [Dean Pomerleau, Todd Jochem, Chuck Thorpe, CMU]
  description: A small backprop network that mapped camera images straight to steering, an early end-to-end learned driving system.
  capability_note: In 1995 Navlab 5 steered for about 98% of a roughly 2,800-mile trip from Pittsburgh to San Diego. Humans controlled throttle and brakes and took over in hard conditions.
  edges: [{type: built-on, target: backprop-1986}, {type: created-by, target: strategic-computing-initiative-1983}]
  source_url: https://www.cs.cmu.edu/~tjochem/nhaa/nhaa_home_page.html   [unfetched-url]
  hero_moment_candidate: no

- id: universal-approximation-1989
  title: Universal approximation theorem (Cybenko; Hornik, Stinchcombe & White)
  date: "1989"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [George Cybenko, Kurt Hornik, Maxwell Stinchcombe, Halbert White]
  description: Proved that a one-hidden-layer network can approximate any continuous function on a compact set.
  capability_note: A proof that such an approximation exists. It says nothing about learnability or efficiency and is often over-read in popular accounts.
  edges: [{type: built-on, target: backprop-1986}]
  source_url: https://doi.org/10.1007/BF02551274
  hero_moment_candidate: no

- id: lenet-1989
  title: LeCun et al., convolutional network trained by backprop for zip-code digits
  date: "1989"
  type: Paper
  era: 4
  primary_segment: Vision
  secondary_segments: [Neural Networks & Deep Learning]
  stack_layer: Models
  creators: [Yann LeCun, Bernhard Boser, John Denker, et al., AT&T Bell Labs]
  description: A convolutional network with shared weights trained end-to-end with backprop on US Postal Service handwritten zip codes.
  capability_note: About 5% test error on USPS digits. It led to commercial check-reading systems at AT&T/NCR in the 1990s.
  edges: [{type: built-on, target: backprop-1986}, {type: inspired-by, target: neocognitron-1980}]
  source_url: https://doi.org/10.1162/neco.1989.1.4.541
  hero_moment_candidate: yes

- id: elman-srn-1990
  title: Elman, "Finding Structure in Time" (simple recurrent networks)
  date: "1990"
  type: Paper
  era: 3
  primary_segment: Language/NLP
  secondary_segments: [Neural Networks & Deep Learning]
  stack_layer: Algorithms & Research
  creators: [Jeffrey Elman, UCSD]
  description: A recurrent network with context units, trained on next-element prediction in sequences.
  capability_note: Learned word-category structure from next-word prediction on toy corpora. It is an intellectual ancestor of next-token language models.
  edges: [{type: built-on, target: backprop-1986}]
  source_url: https://doi.org/10.1207/s15516709cog1402_1
  hero_moment_candidate: no

- id: loebner-prize-1991
  title: First Loebner Prize (restricted Turing test)
  date: "1991-11-08"
  type: Event
  era: 2
  primary_segment: Language/NLP
  secondary_segments: [LLMOps & Eval]
  stack_layer: Ops/Eval/Safety
  creators: [Hugh Loebner, Cambridge Center for Behavioral Studies]
  description: An annual chatbot contest billed as a Turing test, with topics restricted in the early years.
  capability_note: Winning programs used ELIZA-style tricks such as typos and whimsy. Stuart Shieber criticised the contest as rewarding deception, not intelligence.
  edges: [{type: inspired-by, target: turing-1950-computing-machinery}, {type: successor-of, target: eliza-1966}]
  source_url: https://doi.org/10.1145/175208.175217   # Shieber, "Lessons from a restricted Turing test", CACM 1994
  hero_moment_candidate: no

- id: td-gammon-1992
  title: TD-Gammon
  date: "1992 (v1); 1995 (CACM paper)"
  type: Model
  era: 3
  primary_segment: RL & Games
  secondary_segments: [Neural Networks & Deep Learning]
  stack_layer: Models
  creators: [Gerald Tesauro, IBM Research]
  description: A neural network trained by TD(λ) self-play to evaluate backgammon positions.
  capability_note: Played at or near the level of top human players. It changed expert opening theory, and humans adopted its moves.
  edges: [{type: built-on, target: td-learning-q-learning-1988}, {type: built-on, target: backprop-1986}]
  source_url: https://doi.org/10.1145/203330.203343
  hero_moment_candidate: yes

- id: svm-1992
  title: Support vector machines (Boser, Guyon & Vapnik 1992; Cortes & Vapnik 1995)
  date: "1992-07 (COLT); 1995 (soft-margin, Machine Learning)"
  type: Paper
  era: 3
  primary_segment: Classical ML
  secondary_segments: [Vision, Language/NLP]
  stack_layer: Algorithms & Research
  creators: [Vladimir Vapnik, Bernhard Boser, Isabelle Guyon, Corinna Cortes, AT&T Bell Labs]
  description: Maximum-margin classifiers with the kernel trick for non-linear boundaries. They rest on statistical learning theory.
  capability_note: The state of the art for text classification and many benchmarks from the late 1990s to the late 2000s. They matched or beat neural networks on MNIST in that era.
  edges: [{type: competes-with, target: lenet-1989}]
  source_url: https://doi.org/10.1007/BF00994018   # Cortes & Vapnik 1995; Boser et al. 1992: https://doi.org/10.1145/130385.130401
  hero_moment_candidate: yes

- id: statistical-mt-ibm-1993
  title: IBM statistical machine translation (Candide; "The Mathematics of Statistical MT")
  date: "1990 (first paper); 1993 (Computational Linguistics)"
  type: Paper
  era: 3
  primary_segment: Language/NLP
  secondary_segments: [Classical ML]
  stack_layer: Algorithms & Research
  creators: [Peter Brown, Stephen Della Pietra, Vincent Della Pietra, Robert Mercer, IBM]
  description: Learned translation models (IBM Models 1–5) from parallel text (Canadian Hansard) without hand-written linguistic rules.
  capability_note: Showed that data-driven MT was competitive, reversing the rule-based approach. It led to Google Translate's statistical system in 2006.
  edges: [{type: successor-of, target: alpac-1966}, {type: inspired-by, target: hmm-speech-1975}]
  source_url: https://aclanthology.org/J93-2003/
  hero_moment_candidate: no

- id: penn-treebank-1993
  title: Penn Treebank
  date: "1993"
  type: Paper
  era: 3
  primary_segment: Language/NLP
  secondary_segments: []
  stack_layer: Data
  creators: [Mitchell Marcus, Beatrice Santorini, Mary Ann Marcinkiewicz, UPenn]
  description: A syntactically annotated corpus of about 4.5M words, including Wall Street Journal text.
  capability_note: The standard training and evaluation data for statistical parsing and tagging for about 20 years.
  edges: []
  source_url: https://aclanthology.org/J93-2004/
  hero_moment_candidate: no

- id: apple-newton-1993
  title: Apple Newton MessagePad (handwriting recognition)
  date: "1993-08-02"
  type: Product
  era: 4
  primary_segment: Vision
  secondary_segments: [Personal Agents]
  stack_layer: Apps & Products
  creators: [Apple]
  description: A personal digital assistant marketed on handwriting recognition.
  capability_note: The first version's recognition was widely mocked, including in Doonesbury and The Simpsons. Later versions (Newton OS 2.0 with the Rosetta recogniser) improved a lot. It was discontinued in 1998. A consumer Claim-vs-Reality case.
  edges: []
  source_url: https://www.computerhistory.org/revolution/mobile-computing/18/321   [unfetched-url]
  hero_moment_candidate: no

- id: chinook-1994
  title: Chinook (checkers) — world man-machine champion; checkers solved 2007
  date: "1994 (title); 2007-07-19 (solved, Science)"
  type: Model
  era: 1
  primary_segment: RL & Games
  secondary_segments: [Symbolic & Logic AI]
  stack_layer: Models
  creators: [Jonathan Schaeffer, University of Alberta]
  description: Alpha-beta search with endgame databases.
  capability_note: First program to win a human world championship title. The 1994 match with Tinsley ended after he withdrew ill. In 2007 the team proved that perfect play draws.
  edges: [{type: successor-of, target: samuel-checkers}]
  source_url: https://doi.org/10.1126/science.1144079
  hero_moment_candidate: no

- id: wordnet-1995
  title: WordNet
  date: "1985 (started); 1995 (CACM)"
  type: Open-source repo
  era: 3
  primary_segment: Language/NLP
  secondary_segments: []
  stack_layer: Data
  creators: [George A. Miller, Princeton]
  description: A freely available lexical database of English that groups words into synsets linked by semantic relations.
  capability_note: A widely used NLP resource. Its noun hierarchy later structured ImageNet.
  edges: []
  source_url: https://doi.org/10.1145/219717.219748
  hero_moment_candidate: no

- id: adaboost-1995
  title: AdaBoost
  date: "1995 (EuroCOLT); 1997 (JCSS)"
  type: Paper
  era: 3
  primary_segment: Classical ML
  secondary_segments: [Vision]
  stack_layer: Algorithms & Research
  creators: [Yoav Freund, Robert Schapire]
  description: Combines weak learners into a strong one by reweighting misclassified examples.
  capability_note: Strong off-the-shelf accuracy. It powered the Viola–Jones real-time face detector (2001). Gödel Prize 2003.
  edges: [{type: competes-with, target: svm-1992}]
  source_url: https://doi.org/10.1006/jcss.1997.1504
  hero_moment_candidate: no

- id: deep-blue-1997
  title: IBM Deep Blue defeats Garry Kasparov
  date: "1997-05-11 (final game of rematch; lost 1996-02 match 4–2)"
  type: Event
  era: 1
  primary_segment: RL & Games
  secondary_segments: [Compute & Hardware, Symbolic & Logic AI]
  stack_layer: Compute & Hardware
  creators: [Feng-hsiung Hsu, Murray Campbell, Joseph Hoane, IBM]
  description: A massively parallel alpha-beta search system with 480 custom chess chips and a hand-tuned evaluation function.
  capability_note: Searched about 200 million positions per second and won the six-game match 3.5–2.5. It did little learning, so this was brute-force search as Shannon's Type A predicted. It came 29 years after Simon and Newell's "within ten years" forecast.
  edges: [{type: built-on, target: shannon-chess-1950}, {type: successor-of, target: mac-hack-1967}]
  source_url: https://doi.org/10.1016/S0004-3702(01)00129-1   # Campbell, Hoane & Hsu, "Deep Blue", AIJ 134 (2002); IBM: https://www.ibm.com/history/deep-blue
  hero_moment_candidate: yes

- id: lstm-1997
  title: Long Short-Term Memory (LSTM)
  date: "1997-11-15"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: [Speech & Audio, Language/NLP]
  stack_layer: Algorithms & Research
  creators: [Sepp Hochreiter, Jürgen Schmidhuber, TU Munich / IDSIA]
  description: A recurrent architecture with gated memory cells that addresses the vanishing-gradient problem Hochreiter identified in 1991. Forget gates were added in 2000 (Gers et al.).
  capability_note: Learned dependencies over more than 1,000 time steps on synthetic tasks. By 2009 LSTM/CTC won handwriting-recognition competitions. Later (2015–16) it ran Google speech and translation.
  edges: [{type: successor-of, target: elman-srn-1990}, {type: built-on, target: backprop-1986}]
  source_url: https://doi.org/10.1162/neco.1997.9.8.1735
  hero_moment_candidate: yes

- id: dragon-naturallyspeaking-1997
  title: Dragon NaturallySpeaking (continuous dictation on PCs)
  date: "1997-06"
  type: Product
  era: 4
  primary_segment: Speech & Audio
  secondary_segments: []
  stack_layer: Apps & Products
  creators: [James Baker, Janet Baker, Dragon Systems]
  description: The first consumer software for general-vocabulary continuous-speech dictation, based on HMMs.
  capability_note: Usable dictation after speaker enrolment and training. Accuracy fell with noise and accents.
  edges: [{type: built-on, target: hmm-speech-1975}]
  source_url: https://en.wikipedia.org/wiki/Dragon_NaturallySpeaking   # pointer only; primary press release not located
  hero_moment_candidate: no

- id: lenet5-mnist-1998
  title: LeNet-5 and MNIST ("Gradient-based learning applied to document recognition")
  date: "1998-11"
  type: Paper
  era: 4
  primary_segment: Vision
  secondary_segments: [Neural Networks & Deep Learning]
  stack_layer: Models
  creators: [Yann LeCun, Léon Bottou, Yoshua Bengio, Patrick Haffner, AT&T Labs]
  description: A seven-layer CNN combined with graph transformer networks for document reading. It introduced the MNIST benchmark of 60k training and 10k test digits.
  capability_note: About 0.8–0.95% error on MNIST. It was part of an NCR check-reading system that, by the authors' account, read several percent of US checks (LeCun has cited more than 10% in the late 1990s).
  edges: [{type: successor-of, target: lenet-1989}]
  source_url: https://doi.org/10.1109/5.726791   # dataset: http://yann.lecun.com/exdb/mnist/
  hero_moment_candidate: yes

- id: google-pagerank-1998
  title: Google / PageRank ("Anatomy of a Large-Scale Hypertextual Web Search Engine")
  date: "1998-04 (WWW7); Google Inc. 1998-09-04"
  type: Paper
  era: 3
  primary_segment: Classical ML
  secondary_segments: [Language/NLP]
  stack_layer: Apps & Products
  creators: [Sergey Brin, Larry Page, Stanford]
  description: Ranked web pages using link structure computed at web scale.
  capability_note: Better search relevance. It created the company and data infrastructure (web-scale corpora, clusters) that later drove large-scale ML.
  edges: []
  source_url: http://infolab.stanford.edu/pub/papers/google.pdf
  hero_moment_candidate: no

- id: nvidia-geforce256-1999
  title: NVIDIA GeForce 256 (marketed as the first "GPU")
  date: "1999-08-31 (announced)"
  type: Product
  era: 1
  primary_segment: Compute & Hardware
  secondary_segments: []
  stack_layer: Compute & Hardware
  creators: [NVIDIA]
  description: A consumer graphics chip with hardware transform and lighting.
  capability_note: Graphics only. Researchers soon ran general-purpose "GPGPU" hacks through shaders (for example Oh & Jung 2004 for neural networks). It is the lineage behind CUDA.
  edges: [{type: built-on, target: moores-law-1965}]
  source_url: https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/   [unfetched-url]
  hero_moment_candidate: no

- id: opencv-2000
  title: OpenCV
  date: "2000 (public alpha); 2006 (1.0)"
  type: Open-source repo
  era: 4
  primary_segment: Vision
  secondary_segments: []
  stack_layer: Frameworks & SDKs
  creators: [Gary Bradski, Intel Research, later Willow Garage]
  description: An open-source computer-vision library in C/C++.
  capability_note: Put face detection (Viola–Jones), calibration and feature tracking in the hands of ordinary developers and hobbyists. It was used in Stanley (2005).
  edges: [{type: uses, target: viola-jones-2001}]
  source_url: https://opencv.org/about/   [unfetched-url]
  hero_moment_candidate: no

- id: random-forests-2001
  title: Random forests
  date: "2001-10"
  type: Paper
  era: 3
  primary_segment: Classical ML
  secondary_segments: [Vision]
  stack_layer: Algorithms & Research
  creators: [Leo Breiman, UC Berkeley]
  description: An ensemble of decorrelated decision trees trained on bootstrap samples with random feature selection.
  capability_note: Robust, accurate and needed little tuning. Kinect's body-part recognition (2010–11) used random forests.
  edges: [{type: built-on, target: cart-decision-trees-1984}, {type: competes-with, target: adaboost-1995}]
  source_url: https://doi.org/10.1023/A:1010933404324
  hero_moment_candidate: no

- id: gradient-boosting-2001
  title: Gradient boosting machines (Friedman)
  date: "2001"
  type: Paper
  era: 3
  primary_segment: Classical ML
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [Jerome Friedman, Stanford]
  description: Boosting framed as gradient descent in function space.
  capability_note: Became the dominant method for tabular data. It is the lineage behind XGBoost (2014).
  edges: [{type: successor-of, target: adaboost-1995}]
  source_url: https://doi.org/10.1214/aos/1013203451
  hero_moment_candidate: no

- id: viola-jones-2001
  title: Viola–Jones real-time face detection
  date: "2001-12 (CVPR)"
  type: Paper
  era: 4
  primary_segment: Vision
  secondary_segments: [Classical ML]
  stack_layer: Algorithms & Research
  creators: [Paul Viola, Michael Jones]
  description: A cascade of boosted Haar-feature classifiers computed on integral images.
  capability_note: Detected faces at about 15 frames per second on 2001 hardware. It spread into consumer cameras (face-priority autofocus) in the mid-2000s.
  edges: [{type: uses, target: adaboost-1995}]
  source_url: https://doi.org/10.1109/CVPR.2001.990517
  hero_moment_candidate: no

- id: torch-2002
  title: Torch machine learning library
  date: "2002-10"
  type: Open-source repo
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: [Classical ML]
  stack_layer: Frameworks & SDKs
  creators: [Ronan Collobert, Samy Bengio, Johnny Mariéthoz, IDIAP]
  description: An open-source modular C++ ML library. Torch7 (Lua, 2011) later led to PyTorch (2016).
  capability_note: Gave researchers reusable neural-network and SVM components.
  edges: []
  source_url: https://publications.idiap.ch/downloads/reports/2002/rr02-46.pdf   [unfetched-url]
  hero_moment_candidate: no

- id: roomba-2002
  title: iRobot Roomba
  date: "2002-09"
  type: Product
  era: 2
  primary_segment: Robotics & Embodied
  secondary_segments: []
  stack_layer: Apps & Products
  creators: [iRobot (Colin Angle, Helen Greiner, Rodney Brooks)]
  description: A consumer robot vacuum using behaviour-based control.
  capability_note: Covered floors by reactive bump-and-spiral behaviours with no map in early models. It was the first mass-market home robot, with millions sold by the late 2000s.
  edges: [{type: built-on, target: brooks-subsumption-1986}]
  source_url: https://about.irobot.com/   [unfetched-url]
  hero_moment_candidate: no

- id: bengio-nplm-2003
  title: Bengio et al., "A Neural Probabilistic Language Model"
  date: "2003-02 (JMLR; NIPS 2000 version)"
  type: Paper
  era: 3
  primary_segment: Language/NLP
  secondary_segments: [Neural Networks & Deep Learning, Foundation Models]
  stack_layer: Algorithms & Research
  creators: [Yoshua Bengio, Réjean Ducharme, Pascal Vincent, Christian Jauvin, Université de Montréal]
  description: Learned distributed word representations (embeddings) jointly with a neural next-word predictor.
  capability_note: Beat n-gram perplexity on small corpora but was costly to train. It is the ancestor of word2vec and neural language models.
  edges: [{type: built-on, target: backprop-1986}, {type: inspired-by, target: elman-srn-1990}]
  source_url: https://www.jmlr.org/papers/volume3/bengio03a/bengio03a.pdf
  hero_moment_candidate: no

- id: sift-2004
  title: SIFT features (Lowe)
  date: "1999 (ICCV); 2004 (IJCV)"
  type: Paper
  era: 4
  primary_segment: Vision
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [David Lowe, UBC]
  description: Hand-engineered scale- and rotation-invariant local image descriptors.
  capability_note: Enabled robust object matching, panorama stitching and SLAM. It was the dominant vision feature until CNNs from 2012.
  edges: []
  source_url: https://doi.org/10.1023/B:VISI.0000029664.99615.94
  hero_moment_candidate: no

- id: mapreduce-hadoop-2004
  title: MapReduce (Google) and Apache Hadoop
  date: "2004-12 (OSDI paper); 2006 (Hadoop)"
  type: Paper
  era: 3
  primary_segment: Compute & Hardware
  secondary_segments: [Classical ML]
  stack_layer: Inference & Runtime
  creators: [Jeffrey Dean, Sanjay Ghemawat, Google; Doug Cutting, Mike Cafarella, Yahoo/Apache]
  description: A programming model for batch processing across commodity clusters, released as open source in Hadoop.
  capability_note: Made processing terabyte-scale data routine, the data-infrastructure precondition for web-scale ML.
  edges: [{type: built-on, target: google-pagerank-1998}]
  source_url: https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/   [unfetched-url]
  hero_moment_candidate: no

- id: darpa-grand-challenge-2004
  title: DARPA Grand Challenge 2004 (no finisher)
  date: "2004-03-13"
  type: Event
  era: 4
  primary_segment: Robotics & Embodied
  secondary_segments: [Vision]
  stack_layer: Apps & Products
  creators: [DARPA]
  description: A 142-mile autonomous desert race with a $1M prize.
  capability_note: No vehicle finished. The best, CMU's Sandstorm, covered about 7.4 miles. A clear measure of 2004 limits.
  edges: [{type: successor-of, target: alvinn-navlab-1989}]
  source_url: https://www.darpa.mil/about-us/timeline/-grand-challenge-for-autonomous-vehicles   [unfetched-url]
  hero_moment_candidate: no

- id: stanley-2005
  title: Stanley wins the DARPA Grand Challenge
  date: "2005-10-08"
  type: Model
  era: 4
  primary_segment: Robotics & Embodied
  secondary_segments: [Vision, Classical ML]
  stack_layer: Harnesses & Agents
  creators: [Sebastian Thrun, Stanford Racing Team, Volkswagen ERL]
  description: An autonomous VW Touareg that combined lidar, vision and GPS with probabilistic state estimation and learned terrain classification.
  capability_note: Completed the 132-mile course in 6 h 54 min. Five vehicles finished, against zero the year before. It drove a pre-surveyed desert route, not traffic.
  edges: [{type: successor-of, target: darpa-grand-challenge-2004}, {type: uses, target: opencv-2000}]
  source_url: https://doi.org/10.1002/rob.20147   # Thrun et al., "Stanley: The robot that won the DARPA Grand Challenge", J. Field Robotics 2006
  hero_moment_candidate: yes

- id: mechanical-turk-2005
  title: Amazon Mechanical Turk
  date: "2005-11"
  type: Product
  era: 3
  primary_segment: Classical ML
  secondary_segments: [Vision]
  stack_layer: Data
  creators: [Amazon]
  description: A crowdsourcing marketplace for small "human intelligence tasks".
  capability_note: Made large-scale human labelling cheap. ImageNet's roughly 14M images were labelled through it.
  edges: []
  source_url: https://www.mturk.com/   [unfetched-url]
  hero_moment_candidate: no

- id: deep-belief-nets-2006
  title: Deep belief nets / greedy layer-wise pretraining
  date: "2006-07 (Neural Computation); 2006-07-28 (Science, Hinton & Salakhutdinov)"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: [Generative Media]
  stack_layer: Algorithms & Research
  creators: [Geoffrey Hinton, Simon Osindero, Yee-Whye Teh, Ruslan Salakhutdinov, University of Toronto]
  description: Stacked RBMs trained one layer at a time, then fine-tuned. This showed that deep networks could be trained, and the "deep learning" label followed.
  capability_note: 1.25% MNIST error without convolution, and better dimensionality reduction than PCA (Science paper). Bengio et al. (2007) and Ranzato et al. (2007) extended the approach.
  edges: [{type: built-on, target: boltzmann-machine-1985}, {type: built-on, target: backprop-1986}]
  source_url: https://doi.org/10.1162/neco.2006.18.7.1527   # Science paper: https://doi.org/10.1126/science.1127647
  hero_moment_candidate: yes

- id: netflix-prize-2006
  title: Netflix Prize
  date: "2006-10-02 (launch) – 2009-09-21 (awarded)"
  type: Event
  era: 3
  primary_segment: Classical ML
  secondary_segments: [LLMOps & Eval]
  stack_layer: Ops/Eval/Safety
  creators: [Netflix; winners BellKor's Pragmatic Chaos]
  description: A $1M open competition to improve Netflix's rating predictions (Cinematch) by 10% RMSE, using a public dataset of 100M ratings.
  capability_note: Won with a 10.06% improvement by a large ensemble, with matrix factorisation at its core. Netflix said later (2012) that it did not deploy the full winning ensemble because the engineering cost outweighed the gain. A benchmark-vs-deployment gap.
  edges: []
  source_url: https://www.netflixprize.com/   [unfetched-url]  # 2012 Netflix Tech Blog on non-deployment is post-2011 context
  hero_moment_candidate: no

- id: google-translate-smt-2006
  title: Google Translate switches to statistical MT
  date: "2006-04-28"
  type: Product
  era: 3
  primary_segment: Language/NLP
  secondary_segments: []
  stack_layer: Apps & Products
  creators: [Franz Och, Google]
  description: A free web translation service built on phrase-based SMT trained on large parallel corpora.
  capability_note: Gisty translation for many language pairs at no cost. Quality was uneven, especially between distant languages.
  edges: [{type: built-on, target: statistical-mt-ibm-1993}, {type: uses, target: mapreduce-hadoop-2004}]
  source_url: https://research.google/blog/statistical-machine-translation-live/   [unfetched-url]
  hero_moment_candidate: no

- id: cuda-2007
  title: NVIDIA CUDA
  date: "2006-11 (announced); 2007-06 (CUDA 1.0 SDK)"
  type: Product
  era: 3
  primary_segment: Compute & Hardware
  secondary_segments: [Neural Networks & Deep Learning]
  stack_layer: Frameworks & SDKs
  creators: [NVIDIA (Ian Buck, John Nickolls)]
  description: A C-like programming platform for general-purpose computing on NVIDIA GPUs.
  capability_note: Made GPUs programmable without graphics hacks. Raina et al. (2009) and Cireșan et al. (2010) then showed large speedups for neural networks. It is the base layer of later deep learning.
  edges: [{type: built-on, target: nvidia-geforce256-1999}]
  source_url: https://developer.nvidia.com/cuda-zone   [unfetched-url]
  hero_moment_candidate: yes

- id: darpa-urban-challenge-2007
  title: DARPA Urban Challenge
  date: "2007-11-03"
  type: Event
  era: 4
  primary_segment: Robotics & Embodied
  secondary_segments: [Vision]
  stack_layer: Apps & Products
  creators: [DARPA; winner CMU Tartan Racing "Boss"]
  description: An autonomous driving contest on a mock urban course, with traffic rules and other vehicles.
  capability_note: Six teams finished the roughly 60-mile course. The driving was in a closed former air base. Its people went on to staff Google's self-driving project (2009).
  edges: [{type: successor-of, target: stanley-2005}]
  source_url: https://www.darpa.mil/about-us/timeline/darpa-urban-challenge   [unfetched-url]
  hero_moment_candidate: no

- id: scikit-learn-2007
  title: scikit-learn
  date: "2007 (GSoC start); 2010-02 (first public release); 2011 (JMLR paper)"
  type: Open-source repo
  era: 3
  primary_segment: Classical ML
  secondary_segments: []
  stack_layer: Frameworks & SDKs
  creators: [David Cournapeau, INRIA (Fabian Pedregosa, Gaël Varoquaux, Alexandre Gramfort, et al.)]
  description: A Python library with a consistent API for classical ML: SVMs, forests, boosting, clustering.
  capability_note: Made classical ML routine for ordinary developers and data scientists.
  edges: [{type: uses, target: svm-1992}, {type: uses, target: random-forests-2001}]
  source_url: https://jmlr.org/papers/v12/pedregosa11a.html
  hero_moment_candidate: no

- id: collobert-weston-2008
  title: Collobert & Weston, unified neural architecture for NLP ("NLP (almost) from scratch")
  date: "2008-07 (ICML); 2011 (JMLR)"
  type: Paper
  era: 3
  primary_segment: Language/NLP
  secondary_segments: [Neural Networks & Deep Learning]
  stack_layer: Algorithms & Research
  creators: [Ronan Collobert, Jason Weston, NEC Labs]
  description: A single CNN over word embeddings, pretrained on unlabelled text and then multitask-trained for tagging, chunking, NER and SRL.
  capability_note: Came close to state-of-the-art feature-engineered systems with little task-specific engineering. An early demonstration of pretraining on unlabelled text.
  edges: [{type: built-on, target: bengio-nplm-2003}, {type: uses, target: torch-2002}]
  source_url: https://doi.org/10.1145/1390156.1390177   # JMLR 2011: https://jmlr.org/papers/v12/collobert11a.html
  hero_moment_candidate: no

- id: theano-2008
  title: Theano
  date: "2008 (development); 2010 (SciPy paper)"
  type: Open-source repo
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: [Compute & Hardware]
  stack_layer: Frameworks & SDKs
  creators: [LISA lab / MILA, Université de Montréal (Yoshua Bengio, James Bergstra, et al.)]
  description: A Python library that compiles symbolic maths expressions, with automatic differentiation, to CPU or GPU (CUDA) code.
  capability_note: Gave researchers GPU autodiff without hand-written kernels. It is the template for TensorFlow and PyTorch.
  edges: [{type: uses, target: cuda-2007}, {type: built-on, target: linnainmaa-1970}]
  source_url: https://arxiv.org/abs/1605.02688   # Theano Development Team overview paper (2016) documenting 2008+ history
  hero_moment_candidate: no

- id: raina-gpu-2009
  title: Raina, Madhavan & Ng, "Large-scale Deep Unsupervised Learning using Graphics Processors"
  date: "2009-06 (ICML)"
  type: Paper
  era: 3
  primary_segment: Compute & Hardware
  secondary_segments: [Neural Networks & Deep Learning]
  stack_layer: Compute & Hardware
  creators: [Rajat Raina, Anand Madhavan, Andrew Ng, Stanford]
  description: Trained DBNs and sparse coding on GPUs with CUDA.
  capability_note: Reported training speedups of up to about 70x over a dual-core CPU. It made networks with more than 100M parameters feasible.
  edges: [{type: uses, target: cuda-2007}, {type: built-on, target: deep-belief-nets-2006}]
  source_url: https://doi.org/10.1145/1553374.1553486
  hero_moment_candidate: no

- id: imagenet-2009
  title: ImageNet dataset (and ILSVRC from 2010)
  date: "2009-06 (CVPR); 2010 (first ILSVRC)"
  type: Paper
  era: 4
  primary_segment: Vision
  secondary_segments: []
  stack_layer: Data
  creators: [Jia Deng, Wei Dong, Richard Socher, Li-Jia Li, Kai Li, Fei-Fei Li, Princeton/Stanford]
  description: A large image database organised by WordNet nouns and labelled via Mechanical Turk, with 3.2M images at the 2009 paper and about 14M later.
  capability_note: Enabled supervised training at scale and a common benchmark. The 2010–2011 ILSVRC winners used SIFT/Fisher-vector pipelines with about 26–28% top-5 error, before AlexNet in 2012.
  edges: [{type: uses, target: wordnet-1995}, {type: uses, target: mechanical-turk-2005}]
  source_url: https://doi.org/10.1109/CVPR.2009.5206848
  hero_moment_candidate: yes

- id: google-self-driving-2010
  title: Google self-driving car project disclosed
  date: "2009 (started); 2010-10-09 (announced)"
  type: Organization
  era: 4
  primary_segment: Robotics & Embodied
  secondary_segments: [Vision]
  stack_layer: Apps & Products
  creators: [Google (Sebastian Thrun, Chris Urmson, Anthony Levandowski)]
  description: Google disclosed that its test fleet had driven about 140,000 miles with occasional human intervention.
  capability_note: Drove mapped routes with safety drivers. Timelines for driverless deployment given in the 2010s slipped repeatedly (post-2011 context).
  edges: [{type: successor-of, target: darpa-urban-challenge-2007}, {type: successor-of, target: stanley-2005}]
  source_url: https://googleblog.blogspot.com/2010/10/what-were-driving-at.html   [unfetched-url]
  hero_moment_candidate: no

- id: ciresan-gpu-mlp-2010
  title: Cireșan et al., "Deep, Big, Simple Neural Nets for Handwritten Digit Recognition"
  date: "2010-12 (Neural Computation; arXiv 2010-03)"
  type: Paper
  era: 4
  primary_segment: Vision
  secondary_segments: [Neural Networks & Deep Learning, Compute & Hardware]
  stack_layer: Models
  creators: [Dan Cireșan, Ueli Meier, Luca Gambardella, Jürgen Schmidhuber, IDSIA]
  description: Plain deep MLPs trained with backprop on a GPU, using elastic-distortion data augmentation.
  capability_note: 0.35% MNIST error with no pretraining. GPU CNNs from the same group won several vision contests in 2011, including traffic-sign recognition at IJCNN 2011 with better-than-human accuracy.
  edges: [{type: uses, target: cuda-2007}, {type: successor-of, target: lenet5-mnist-1998}]
  source_url: https://doi.org/10.1162/NECO_a_00052
  hero_moment_candidate: no

- id: relu-2010
  title: Rectified linear units for RBMs (Nair & Hinton) and deep sparse rectifier nets (Glorot, Bordes & Bengio 2011)
  date: "2010-06 (ICML); 2011 (AISTATS)"
  type: Paper
  era: 3
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: []
  stack_layer: Algorithms & Research
  creators: [Vinod Nair, Geoffrey Hinton, Xavier Glorot, Antoine Bordes, Yoshua Bengio]
  description: Replaced sigmoid units with rectified linear units.
  capability_note: Faster, easier training of deep networks. ReLU became the default activation from 2012.
  edges: [{type: built-on, target: deep-belief-nets-2006}]
  source_url: https://www.cs.toronto.edu/~hinton/absps/reluICML.pdf   [unfetched-url]
  hero_moment_candidate: no

- id: kinect-2010
  title: Microsoft Kinect (depth-camera body tracking)
  date: "2010-11-04 (launch); 2011-06 (CVPR best paper)"
  type: Product
  era: 4
  primary_segment: Vision
  secondary_segments: [Classical ML]
  stack_layer: Apps & Products
  creators: [Microsoft Research Cambridge (Jamie Shotton et al.), Xbox, PrimeSense]
  description: A consumer depth sensor with real-time skeletal tracking for gaming.
  capability_note: Tracked 20 body joints at 30 fps by per-pixel random-forest classification of body parts in depth images. It sold millions of units within weeks and became a popular cheap sensor in robotics research.
  edges: [{type: uses, target: random-forests-2001}]
  source_url: https://doi.org/10.1109/CVPR.2011.5995316   # Shotton et al., "Real-time human pose recognition in parts from single depth images"
  hero_moment_candidate: no

- id: deep-speech-dnn-2011
  title: Deep neural networks for speech recognition (Toronto/Microsoft/Google/IBM)
  date: "2009 (Mohamed, Dahl & Hinton TIMIT); 2011-08 (Seide, Li & Yu Switchboard, Interspeech); 2012 (Dahl et al. IEEE TASLP)"
  type: Paper
  era: 4
  primary_segment: Speech & Audio
  secondary_segments: [Neural Networks & Deep Learning]
  stack_layer: Models
  creators: [George Dahl, Abdel-rahman Mohamed, Geoffrey Hinton, Dong Yu, Li Deng, Frank Seide, Microsoft Research]
  description: Context-dependent DNN–HMM hybrids that replaced Gaussian mixture acoustic models.
  capability_note: About 33% relative word-error reduction on the Switchboard benchmark (Seide et al. 2011). Deployed in Android voice search in 2012. This was the first large deep-learning win in a production domain.
  edges: [{type: built-on, target: deep-belief-nets-2006}, {type: successor-of, target: hmm-speech-1975}, {type: uses, target: cuda-2007}]
  source_url: https://doi.org/10.1109/TASL.2011.2134090   # Dahl, Yu, Deng & Acero, "Context-dependent pre-trained DNNs for LVCSR"
  hero_moment_candidate: yes

- id: watson-jeopardy-2011
  title: IBM Watson wins Jeopardy!
  date: "2011-02-14 to 2011-02-16"
  type: Event
  era: 3
  primary_segment: Language/NLP
  secondary_segments: [Classical ML, Compute & Hardware]
  stack_layer: Apps & Products
  creators: [David Ferrucci, IBM Research (DeepQA)]
  description: DeepQA, a pipeline of hundreds of NLP and search components with machine-learned answer scoring on about 2,880 POWER7 cores, beat Ken Jennings and Brad Rutter.
  capability_note: Answered Jeopardy! clues from locally stored text. It had no internet access and received clues as text. It won $77,147 against $24,000 and $21,600. IBM's later commercial Watson Health products underdelivered (post-2011 context).
  edges: [{type: successor-of, target: deep-blue-1997}]
  source_url: https://doi.org/10.1609/aimag.v31i3.2303   # Ferrucci et al., "Building Watson: An Overview of the DeepQA Project", AI Magazine 2010; IBM: https://www.ibm.com/history/watson-jeopardy
  hero_moment_candidate: yes

- id: siri-2011
  title: Siri launches on iPhone 4S
  date: "2011-10-04 (announced); 2011-10-14 (shipped); Siri app 2010-02; Apple acquisition 2010-04"
  type: Product
  era: 4
  primary_segment: Personal Agents
  secondary_segments: [Speech & Audio, Language/NLP]
  stack_layer: Apps & Products
  creators: [Siri Inc. (Dag Kittlaus, Adam Cheyer, Tom Gruber), SRI International (DARPA CALO project), Apple; speech recognition licensed from Nuance]
  description: A voice assistant that combined server-side speech recognition with task-oriented dialogue over web services. Apple launched it as a "beta".
  capability_note: Handled scripted domains (reminders, weather, messages, search) and was brittle outside them. It started the mainstream voice-assistant category.
  edges: [{type: built-on, target: hmm-speech-1975}, {type: successor-of, target: eliza-1966}]   # add {type: acquired-by, target: apple} if an Apple org node is created
  source_url: https://www.apple.com/newsroom/2011/10/04Apple-Launches-iPhone-4S-iOS-5-iCloud/   [unfetched-url]  # origin: https://www.sri.com/hoi/siri/
  hero_moment_candidate: yes

- id: google-brain-2011
  title: Google Brain founded; large-scale unsupervised feature learning (DistBelief)
  date: "2011 (project start); 2011-12-29 (arXiv 1112.6209, 'cat' paper, ICML 2012)"
  type: Organization
  era: 4
  primary_segment: Neural Networks & Deep Learning
  secondary_segments: [Vision, Compute & Hardware]
  stack_layer: Algorithms & Research
  creators: [Andrew Ng, Jeff Dean, Greg Corrado, Quoc Le, Google]
  description: A Google X project that trained very large neural networks on CPU clusters (DistBelief).
  capability_note: A 1-billion-connection network on 16,000 cores learned a "cat"-selective neuron from unlabelled YouTube frames. It reported 15.8% top-1 accuracy on ImageNet 22k, a 70% relative gain at the time.
  edges: [{type: uses, target: mapreduce-hadoop-2004}, {type: built-on, target: deep-belief-nets-2006}, {type: uses, target: imagenet-2009}]
  source_url: https://arxiv.org/abs/1112.6209
  hero_moment_candidate: no
```

Note on edges: Apple has no node yet, so Siri's acquisition (April 2010) is recorded as a comment, not an edge.

### Inferences
- There were two routes: public events (Deep Blue, Watson, Grand Challenges) and quiet deployments (LMS filters, check-reading CNNs, HMM dictation, spam filters, Kinect forests). The quiet deployments were usually the more capable and economically real systems. The public events were often search-plus-engineering rather than learning. Deep Blue did no learning, and Watson was a hand-assembled pipeline.
- The 1980s boom-bust looks like an earlier hype cycle: national programmes and specialised hardware (Lisp machines, PSI/PIM) were bet on one paradigm, and cheaper general-purpose hardware overtook them. The later GPU story is the opposite case, in which general-purpose consumer chips (CUDA) became the AI substrate.
- By Dec 2011 each ingredient of the 2012 deep-learning break was public: backprop (1986), CNNs (1989/98), LSTM (1997), ReLU (2010), CUDA (2007), ImageNet (2009) and GPU nets winning contests (Cireșan 2011). Deep speech was already beating GMMs. A dataset cutoff at 2011 lands just before the break.
- Suggested era-4 ("see & hear") entries before 2012 are those with deployed perception: LeNet check reading, Dragon, Stanley, Kinect, DNN speech and Siri.

### Gaps
- XCON's dollar savings are reported differently across secondary sources (often $25M–$40M a year). I found no primary DEC figure in this session, so I left the number out.
- I did not independently verify the share of US checks read by LeNet in the late 1990s. The ">10%" figure comes from LeCun's own statements.
- I found no primary press release for Dragon NaturallySpeaking's June 1997 launch; I used the Wikipedia pointer.
- Netflix's non-deployment statement is in a 2012 Netflix Tech Blog post, outside the cutoff and not fetched.
- The ICOT/FGCS appraisal (ScienceDirect 0167-739X(93)90002-7) was seen only as a search snippet. Its author was not confirmed in this session.
- Candidates omitted to keep the count near 90, all of which qualify: Soar (1987), C4.5 (1993), HMM-based CMU Sphinx (1988) and its open-source release (2000), RoboCup (1997), Sony AIBO (1999), the Hochreiter vanishing-gradient thesis (1991), the Connection Machine (1985), OPS5 (1981), MCC (1982), LIBSVM (2000), Weka (1997), Google voice search (2008), and Vapnik–Chervonenkis theory (1971).

## Q4. Verbatim hype quotes and what actually happened (Claim vs Reality)

### Takeaway
Named researchers and institutions repeatedly made dated forecasts of general or human-level ability within 3 to 20 years: Dostert in 1954, Simon and Newell in 1958, Simon in 1960/65, Minsky in 1967. Each missed by decades or has still not happened. Official reviews were blunter: ALPAC in 1966 and Lighthill in 1973. Turing's own 2000 forecast was more hedged and was only partly right.

### Cited Findings
- **Lovelace, 1843 (a sceptical baseline).** "The Analytical Engine has no pretensions whatever to originate anything. It can do whatever we know how to order it to perform." Source: Lovelace, Note G, 1843 — [Fourmilab transcription of Menabrea/Lovelace](https://www.fourmilab.ch/babbage/sketch.html) (text from standard knowledge; this page was not fetched in this session). What happened: Turing named this "Lady Lovelace's objection" in 1950.
- **Turing, Oct 1950.** "I believe that at the end of the century the use of words and general educated opinion will have altered so much that one will be able to speak of machines thinking without expecting to be contradicted." The same paper predicts that in about 50 years computers with about 10^9 bits of storage would play the imitation game so well that an average interrogator would have no more than a 70% chance of a correct identification after five minutes. — [Turing 1950, Mind](https://doi.org/10.1093/mind/LIX.236.433) (quote from standard knowledge; not fetched). What happened: by 2000 no system passed an unrestricted test. Loebner Prize winners (1991 onward) used tricks — [Shieber 1994](https://doi.org/10.1145/175208.175217).
- **Dostert (Georgetown–IBM), Jan 1954.** He predicted automatic translation "within three to five years". This is a paraphrase with partial quotation from secondary sources; I did not retrieve his exact wording in this session. — [Wikipedia summary pointing to Hutchins 2004](https://en.wikipedia.org/wiki/Georgetown%E2%80%93IBM_experiment); [Hutchins 2004 (AMTA)](https://aclanthology.org/www.mt-archive.info/00/AMTA-2004-Hutchins.pdf). What happened: the demo used 6 rules, 250 words and more than 60 chosen sentences. ALPAC (1966) found MT slower, less accurate and costlier than humans — [NAP ALPAC report](https://nap.nationalacademies.org/catalog/9547). Usable general MT came with SMT in 2006 (Google Translate), 50+ years later.
- **Dartmouth proposal, 31 Aug 1955.** "We propose that a 2 month, 10 man study of artificial intelligence be carried out during the summer of 1956 at Dartmouth College in Hanover, New Hampshire." — [McCarthy et al. proposal, Stanford](http://www-formal.stanford.edu/jmc/history/dartmouth/dartmouth.html) (fetched and verified). The proposal also says, from standard knowledge (this sentence was not re-verified in the fetch summary): "We think that a significant advance can be made in one or more of these problems if a carefully selected group of scientists work on it together for a summer." What happened: the summer produced no new breakthrough. Language use, abstraction and self-improvement stayed largely unsolved for decades.
- **New York Times on the Perceptron, July 1958.** "The Navy revealed the embryo of an electronic computer today that it expects will be able to walk, talk, see, write, reproduce itself and be conscious of its existence." — [The Conversation, 2024, quoting NYT](https://theconversation.com/weve-been-here-before-ai-promised-humanlike-machines-in-1958-222700); [Fast Company reprint](https://www.fastcompany.com/91043738/ai-history-humanlike-machines). The speaker is the NYT reporter paraphrasing the Navy, not Rosenblatt. What happened: the Mark I learned two-class separation of simple patterns. Minsky and Papert (1969) proved single-layer limits.
- **Simon & Newell, Jan 1958.** They wrote that "within ten years a digital computer will be the world's chess champion". The paper was "Heuristic Problem Solving: The Next Advance in Operations Research", Operations Research 6(1), 1958 — [DOI 10.1287/opre.6.1.1](https://doi.org/10.1287/opre.6.1.1); quoted via [Kuipers, U. Michigan](https://web.eecs.umich.edu/~kuipers/opinions/AI-progress.html) and [Chess Programming Wiki](https://chessprogramming.org/Herbert_Simon). Some sources date it to Simon's 1957 speech. What happened: in 1967 Mac Hack VI was rated about 1243. Deep Blue beat the world champion on 11 May 1997, 39 years later, using brute-force search — [Campbell et al. 2002](https://doi.org/10.1016/S0004-3702(01)00129-1).
- **Herbert Simon, 1960 (reprinted 1965).** "Technologically, as I have argued earlier, machines will be capable, within twenty years, of doing any work that a man can do." Sources: *The New Science of Management Decision* (Harper & Row, 1960), p. 38, and *The Shape of Automation for Men and Management* (1965), pp. 95–96 — [Quote Investigator](https://quoteinvestigator.com/2020/11/11/ai-can-do/) (fetched and verified). Note that the popular form drops "that" and is usually dated 1965. What happened: by 1980 or 1985 machines were doing narrow expert-system tasks (XCON), and industrial robots repeated taught motions.
- **Marvin Minsky, 1967.** "Within a generation, I am convinced, few compartments of intellect will remain outside the machine's realm—the problems of creating 'artificial intelligence' will be substantially solved." Source: *Computation: Finite and Infinite Machines* (Prentice-Hall, 1967), ch. 1, p. 2 — [Quote Investigator](https://quoteinvestigator.com/2021/03/04/ai-solved/) (fetched and verified). Popular versions paraphrase it as "within a generation ... the problem ... will substantially be solved." What happened: by 1982 Minsky himself said AI was "one of the hardest [problems] science has ever undertaken" (per Quote Investigator, same page). A generation later (about 1992) the second AI winter was under way.
- **Lighthill Report, 1973.** "In no part of the field have the discoveries made so far produced the major impact that was then promised." — [Lighthill 1973 report full text](https://rodsmith.nz/wp-content/uploads/Lighthill_1973_Report.pdf); corroborated by [Wikipedia: Lighthill report](https://en.wikipedia.org/wiki/Lighthill_report) and [Royal Society blog 2025](https://royalsociety.org/blog/2025/12/brain-boxes/). What happened: UK AI funding was cut to a few centres, part of the first AI winter.
- **FGCS (1982) as institutional hype.** The goal was parallel inference machines for knowledge-based AI built on logic programming. What happened: PSI/PIM hardware met the planned speed of about 150M logical inferences per second, but "applications were done in demonstration form only (not deployed)". The reasons cited are expensive hardware, the choice of Prolog and the focus on parallelism — [Körner et al., "Fifty Years of Prolog and Beyond"](https://arxiv.org/abs/2201.10816).

### Inferences
- A recurring pattern: a real narrow demonstration (60 sentences, 38 theorems, a two-class perceptron, blocks world) leads to an extrapolated forecast with a fixed timescale (3–20 years), then an official review, then funding cuts. This fits the dataset's Claim-vs-Reality format directly.
- The chess forecast is the cleanest "flop then eventual success" case. It came true 29 years late, and by a method (brute-force search) that the original forecasters regarded as the less "intelligent" route.

### Gaps
- **Minsky in LIFE magazine, 20 Nov 1970.** "In from three to eight years we will have a machine with the general intelligence of an average human being." This is widely attributed to Minsky via Brad Darrach's LIFE article. Minsky later said he was misquoted. I did not verify it against the LIFE scan in this session, so treat it as disputed and do not use it without checking the primary scan (Google Books hosts LIFE archives).
- I did not retrieve Dostert's exact 1954 wording. The Hutchins PDF would not render in the fetch tool.
- I did not fetch the Turing 1950 and Lovelace 1843 quotes in this session. They come from standard texts; confirm against the linked primary sources before publishing.
- I found no verbatim, sourced hype quotes for the 1980s expert-system boom (for example, from Feigenbaum's *The Fifth Generation*, 1983) or for Lenat on Cyc. Both are good targets for a follow-up search.
