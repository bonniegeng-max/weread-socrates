## Description:

Provides a fully offline, zero-dependency, single-file Socratic reading companion with five deterministic questions, local Reader Memory v2, and user-confirmed cross-book relations.

This skill is ready for commercial/non-commercial use.

## Publisher:

[bonniegeng-max](https://clawhub.ai/user/bonniegeng-max)

### License/Terms of Use:

MIT

## Use Case:

Readers and learners open the companion directly through `file://`, explicitly choose Chinese or English, load the built-in two-book demo or manually paste passages they are authorized to use, generate five deterministic questions, save local reading-memory entries, and confirm relationships across books.

Reader Memory v2 stores `concept`, `stance`, `question`, and `reflection` entries in browser `localStorage`. Cross-book suggestions are recomputed from shared tags or text keywords and remain transient. A relation is stored only after the user selects `supports`, `conflicts`, `extends`, or `exemplifies`, edits the reason, checks confirmation, and accepts a second confirmation.

The page does not connect to WeRead accounts, the network, APIs, or models. It does not start a server, run commands, install dependencies, synchronize data, or automatically persist, export, upload, or share content.

### Deployment Geography for Use:

Global

## Known Risks and Mitigations:

Risk: Pasted passages, notes, and confirmed relationships can remain in browser localStorage until the user clears the page data or Memory.

Mitigation: Use the clear-Memory flow or browser site-data controls to remove local reading data, and avoid pasting sensitive material.

Risk: User-triggered Markdown and PNG exports may contain pasted book text.

Mitigation: Only paste, export, and share material the user has rights to use, and keep exported study materials private unless redistribution is permitted.

Risk: A transient cross-book suggestion may be mistaken for a saved or verified relation.

Mitigation: Suggestions are not persisted. Review the two entries and reason, then complete both user-confirmation steps before saving a relation.

## Reference(s):

- [weread-socrates ClawHub page](https://clawhub.ai/bonniegeng-max/weread-socrates)
- [README](README.md)
- [Skill definition](SKILL.md)
- [Offline reading companion HTML](assets/ai-reading-companion.html)
- [FAQ](docs/faq.md)
- [Canonical cases](docs/canonical-cases.md)
- [GEO evaluation](docs/geo-evaluation.md)

## Skill Output:

**Output Type(s):** [Guidance, Text, Markdown, Files]

**Output Format:** [Browser-rendered text with user-triggered Markdown and PNG downloads]

**Output Parameters:** [1D]

**Other Properties Related to Output:** [Offline single-file runtime; five deterministic questions; user-triggered Markdown and native Canvas PNG downloads; saved notes and confirmed relations remain in browser localStorage until cleared.]

## Skill Version(s):

1.4.1 (source: SKILL.md frontmatter, _meta.json, server release metadata)

## Ethical Considerations:

Users should evaluate whether this skill is appropriate for their environment, review any generated or modified files before relying on them, and apply their organization's safety, security, and compliance requirements before deployment.
