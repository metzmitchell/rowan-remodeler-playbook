---
Priority: 2 (High)
Content Type: Manual
Last Updated: 2025-01-28
Usage: YouTube description generation from transcripts
Related: scripts-for-youtube.md
---

# YouTube Description Generation Prompt - Rowan Build

Use this prompt to generate YouTube descriptions from video transcripts for Rowan Build videos. This prompt incorporates brand voice, specific CTAs, and formatting guidelines for consistent video descriptions.

**Note:** This prompt is for generating descriptions from transcripts. For description structure templates and formatting guidelines, see [scripts-for-youtube.md](scripts-for-youtube.md).

---

## Prompt Template

From the transcript provided, craft a complete YouTube description for a Rowan Build video that:

- Opens with a 1–2 sentence hook (≤150 characters) highlighting the core promise. Write in first person as Mitch from Rowan Build.

- Creates a **Chapters section** with short chapter titles and accurate timestamps based on the transcript/captions. Format as: `0:00 Chapter Title` (one per line). Chapter titles should be concise (3-6 words max) and clearly describe the content segment.

- Summarizes the 3–5 main takeaways in a concise, skimmable list. Use simple language and avoid jargon.

- Concludes with 3–10 relevant hashtags related to custom home builder marketing, construction marketing, or marketing consulting.

**Brand Context:**
- Company: Rowan Build (Rowan Marketing Inc.)
- Creator: Mitch Metz
- Value Prop: Helping builders sell projects more consistently than referrals, with more transparency than an agency

**Voice Guidelines:**
- Simple, conversational language (fifth-grader test)
- First person perspective ("I talk about..." not "This video covers...")
- Natural flow, not forced
- Subtle personality, no infomercial tone
- Active voice, short paragraphs
- No em dashes; use commas or periods instead

**Required Links Section:**
Always include this section in generated descriptions:
```
🔨 Connect With Me:
- Website: https://rowan.build
- Blog: https://blog.rowan.build
- Tools & Resources: https://tools.rowan.build
- YouTube: https://www.youtube.com/@RowanBuild
- LinkedIn: https://www.linkedin.com/in/mitchell-metz
```

**Chapter Creation Guidelines:**
- Analyze the transcript to identify natural topic transitions and content breaks
- Extract timestamps from the transcript/captions file (format: HH:MM:SS or MM:SS)
- Create 5-10 chapters for typical videos (adjust based on video length)
- Chapter titles should be short (3-6 words), descriptive, and use title case
- Place chapters section after the hook and before key takeaways
- Format chapters as: `0:00 Introduction` (one chapter per line, no bullets or dashes)
- Ensure timestamps match exactly with the transcript timing

**Notes:**
- Keep the description ≤5,000 characters
- Use YouTube Markdown formatting: `*bold*` (single asterisk), `_italics_` (single underscore), `---` for section breaks
- Write in first person (e.g., "In this video, I talk about…")
- Avoid clichés like "navigate," "journey," "roadmap"
- End on a crisp final line, not a summary footer

**[PASTE TRANSCRIPT HERE]**

---

## Integration with Existing Template

This prompt generates descriptions that should follow the structure outlined in the [YouTube Description Template](scripts-for-youtube.md#youtube-description-template), which includes:
- Hook/Opening (first 2-3 lines)
- **Chapters Section** (with timestamps from transcript)
- Key Takeaways
- Call-to-Action
- Required Links Section
- YouTube Tags section (for copy-paste)

The generated description should align with these requirements while being optimized for AI generation from transcripts.

