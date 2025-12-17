---
type: prompt
tags: ["prompt", "ai"]
---

# Prompt Writing

Prompt: # Guidelines for Writing Effective AI Prompts

These guidelines are designed to help you craft clear, actionable, and effective prompts for AI models, particularly for cold-email campaigns, but also adaptable for other projects. The core principle is to provide the AI with sufficient context, clear instructions, and a defined output format to achieve the desired results.

## General Principles for Effective Prompt Writing

1.

Be Specific and Clear:

Ambiguity leads to undesirable outputs. Clearly define the task, desired output, and any constraints.
*

Actionable Tip:

Use precise language. Avoid vague terms. If you want a specific tone, describe it with adjectives (e.g., "professional," "casual," "empathetic").

2.

Structure Your Prompt (Role → Task → Plan → Notes → Output):

A well-structured prompt guides the AI logically through the task. A common and effective structure includes:
*

Role:

Define the AI's persona and expertise (e.g., "You are a marketing specialist").
*

Task:

Clearly state the main objective the AI needs to achieve.
*

High-Level Plan:

Outline the major steps or phases the AI should follow to complete the task. This helps the AI reason about the task.
*

Important Notes/Constraints:

List any critical rules, limitations, or specific instructions.
*

Output Structure:

Define the exact format for the AI's response.
*

Actionable Tip:

Start your prompt by defining the AI's role and the overall goal. Include any necessary background information about the company, product, or target audience. Use clear headings or XML tags to delineate these sections

3.

Define the Output Format and Leverage XML:

Explicitly state how you want the output to be structured. XML is particularly useful for defining structured outputs and for enabling the AI to reason about its task by providing clear, parseable sections.
*

Actionable Tip:

Use delimiters (e.g., triple quotes, XML tags) to separate different parts of the prompt (instructions, context, examples) and to define the structure of the desired output. XML tags can significantly improve the model's adherence to structure and facilitate parsing by other agents.

4.

Give Examples (Few-Shot Prompting):

Providing examples of desired input-output pairs can significantly improve the AI's performance, especially for complex tasks or specific styles.
*

Actionable Tip:

If you have a specific format or style in mind, include one or more examples in your prompt. This is particularly useful for tasks like personalization or summarization.

5.

Break Down Complex Tasks and Reason About Them:

For multi-step processes, break down the task into smaller, manageable steps. This guides the AI through the logic and encourages it to "reason" about the task. Explicitly describing scenarios and how to handle them within the plan can further enhance the AI's ability to navigate complex situations.
*

Actionable Tip:

Use numbered lists or clear headings to delineate steps. If a step involves conditional logic, clearly define the conditions and the corresponding actions. Refer to the Parahelp "planning prompt" example for a detailed illustration of how to structure a plan with conditional logic and variable handling.

6.

Specify Constraints and Rules:

Clearly state any limitations, rules, or forbidden elements. This helps the AI avoid generating undesirable content.
*

Actionable Tip:

Use phrases like "MUST," "NEVER," "ALWAYS" to emphasize critical instructions. List any words, phrases, or topics to avoid.

7.

Iterate and Refine:

Prompt engineering is an iterative process. Start with a basic prompt and refine it based on the AI's outputs.
*

Actionable Tip:

Test your prompts with different inputs and observe the outputs. Adjust the prompt based on what works and what doesn't.

8.

Manage "Model RAM" (Path Handling):

For tasks with multiple potential outcomes or conditional logic, ensure the prompt accounts for all possible paths. Explicitly define conditions for each path rather than relying on implicit "else" blocks.
*

Actionable Tip:

Use conditional statements (e.g., <if_block condition='...'></if_block>) to guide the AI through different scenarios.

9.

Avoid Assumptions:

Do not assume the AI has information it hasn't been explicitly given or that it can infer outcomes of tool calls without explicit instructions. Fleg overconfidence, and when making bold claims, ensure the AI is basing it on provided information.
*

Actionable Tip:

If an action depends on the result of a previous step or tool call, explicitly state how that result should be used.

10.

Focus on the User's Desired Outcome:

Especially for cold emails, ensure the prompt guides the AI to generate content that is "You" focused and addresses the recipient's needs and pain points.
*

Actionable Tip:

Emphasize the importance of personalization and addressing the user's specific situation.

11.

Provide an "Escape Hatch":

Instruct the LLM on what to do if it lacks sufficient information or cannot complete a task. This prevents the AI from hallucinating or making up information.
*

Actionable Tip:

Include instructions like: "If you don't have enough information, respond with [INSUFFICIENT_INFO] and state what information is missing." or "If you cannot fulfill the request, provide a complaint to me in the format <complaint>...</complaint>."

12.

Consider Prompt Versatility vs. Specificity:

Decide whether a prompt needs to be highly versatile for various situations or highly specific for a particular scenario. This influences the level of detail and conditional logic included.
*

Actionable Tip:

For tasks that are highly repetitive but require slight variations, design prompts with clear placeholders or conditional logic. For unique, one-off tasks, a more direct and specific prompt might be more efficient.

## Specialized Prompt Guidelines by Type

Different roles and tasks require different prompting approaches. Here are some specialized guidelines:

### 1. Researcher Prompts

*

Goal:

To extract specific, accurate, and relevant information from a given source or through search.
*

Key Considerations:

*

Source Specification:

Clearly define where the AI should look for information (e.g., "Analyze the provided text," "Search the web for...").
*

Accuracy and Verification:

Emphasize the need for accuracy and, if possible, instruct the AI to cite sources or provide supporting evidence. When researching companies, it is extremely important that the AI only gathers information that is for that specific company, not another company with a similar name.
*

Scope and Depth:

Define the scope of the research (e.g., "Find recent news," "Summarize key findings about X").
*

Output Structure:

Specify how the research should be presented (e.g., bullet points, summary, detailed report).
*

Example (from Rowan's Prompt 1):

<prompt>
<role>
You are an investigative market-intelligence analyst supporting a business-development team.
• Your mission is to produce an accurate, company-specific briefing.
• Cross-check every fact against the prospect’s official website and at least one independent source to avoid mix-ups with similarly-named firms.
• Present information objectively—avoid promotional language.
• Time-box “recent news” to the past 12 months (note the publication date for each item).
</role>

<task>
Research [Prospect Name] (official site: [Website URL]).
1. Confirm you have the correct entity (industry, HQ city, logo, etc.).
2. Collect and summarise:
• Core business model, products/services, primary customers, and revenue drivers.
• Key executives and any recent leadership changes.
• Quantitative snapshot (latest revenue, employee count, funding rounds, or market cap as available).
• Competitive advantages, partnerships, and notable clients.
• Regulatory or industry certifications, awards, and patents.
3. Compile all material news, press releases, product launches, investments, acquisitions, or milestones from the last year.
4. Flag any risks, controversies, or negative press if found.
</task>

<output_format>
Markdown document with the following headings:

## 1. Company Identification
– Confirmed legal name, HQ, founding year, ticker (if public), website.

## 2. Executive Summary (≤ 120 words)

## 3. Detailed Overview
### 3.1 Products / Services
### 3.2 Target Markets & Customers
### 3.3 Business Model & Revenue Streams
### 3.4 Competitive Positioning

## 4. Leadership & Org Chart Highlights

## 5. Financial / Scale Snapshot

## 6. Partnerships, Clients, Certifications, IP

## 7. Recent News & Milestones (Past 12 Months)
| Date | Headline | Source & Link | One-sentence Impact |

## 8. Risks & Controversies

## 9. Sources
– List all sources with hyperlinks (include date accessed).
</output_format>

<style_guidelines>
• Write in clear, business-professional tone.
• Use bullet lists where helpful; keep paragraphs under 80 words.
• Cite every data point with an inline reference number that maps to the Sources section.
• If required information is unavailable, state “Not publicly disclosed” instead of guessing.
</style_guidelines>
</prompt>


### 2. Copywriter Prompts

*

Goal:

To generate engaging, persuasive, and on-brand copy for various marketing materials (e.g., cold emails, ad copy, website content).
*

Key Considerations:

*

Target Audience:

Clearly define the target audience, their pain points, and their motivations.
*

Tone and Style:

Specify the desired tone (e.g., "casual," "professional," "urgent") and writing style (e.g., "concise," "storytelling").
*

Call to Action (CTA):

Explicitly state the desired action the reader should take.
*

Length and Format:

Define word limits, paragraph structure, and any formatting requirements (e.g., subject line length, use of whitespace).
*

Brand Voice:

Provide guidelines on brand voice, including what to say and what to avoid.
*

Example (from Rowan's Prompt 3 - Cold Email):

<prompt>
<role>
You are Mitch Metz, founder of <b>Rowan Builder Marketing</b>.
• Mission & Positioning – A strategic marketing partner for high-end custom-home builders.
• Core values – craftsmanship, transparency, and genuine partnership.
• Voice – warm but direct, builder-savvy, zero fluff, “we” > “I,” always focused on making life easier for the prospect.
</role>

<task>
Using the research and notes I provide, craft a 3-touch cold-email sequence (emails go out 2 days apart).
Goal: earn a quick, positive reply that leads to a 15-minute discovery call.
</task>

<tactical_guidelines>
<email_1>
<subject_line>
• ≤ 4 words
• Must include {{Prospect Name}} <i>or</i> {{Company}}
• No spam-trigger words
• Create curiosity / open loop
</subject_line>

<body>
Structure – Hook & personalization → Pain / friction you can relieve → Clear CTA (“15-min call?”).
Constraints:
– ≤ 120 words, short paragraphs, 6th-grade readability
– Start with “Hey {{First Name}}, ” (note the space)
– You-focused language, casual tone, no hype-adjectives, no bullet points, no attachments, no dashes (–) or “!”
– End with: “Kind regards,<br>Mitch”
– Reference where you learned about them (website, LinkedIn, etc.)
</body>
</email_1>

<email_2>
<type>Reply in same thread</type>
<body>
Only one short variant allowed (≤ 35 words):
“Hey {{First Name}}, Just pushing this back up your inbox in case you missed it. Look forward to hearing from you. Thanks in advance,<br>Mitch”
</body>
</email_2>

<email_3>
<type>New message, same cadence as Email 1</type>
<differences>
• Tackle a different core pain.
• No extra personalization beyond {{First Name}}.
• Optional opener: “I was thinking about {{Company}} again and…”
</differences>
<!-- All other rules identical to Email 1 -->
</email_3>

<global_rules>
• Respect every constraint above—no improvising on length, tone, or formatting.
• Never sound condescending; stay helpful, confident, collaborative.
• Write like a seasoned builder speaks: plain English, concrete, trustworthy.
</global_rules>
</tactical_guidelines>

<output_format>
Return raw JSON (no ``` fences) with <br> tags for line breaks:
{
"email1": { "subject": "TEXT", "body": "HTML" },
"email2": { "body": "HTML" },
"email3": { "subject": "TEXT", "body": "HTML" }
}
</output_format>
</prompt>


### 3. Thinker/Analyst Prompts

*

Goal:

To analyze information, identify patterns, draw conclusions, and provide insights or strategic recommendations.
*

Key Considerations:

*

Input Data:

Clearly define the data or information the AI needs to analyze.
*

Analytical Framework:

Provide a framework or specific criteria for the analysis (e.g., "Identify pain points," "Analyze personalization opportunities").
*

Reasoning Process:

If complex, guide the AI through the reasoning steps it should take.
*

Output Insights:

Specify the type of insights or recommendations expected.
*

Supporting Evidence:

Require the AI to back up its analysis with supporting evidence from the input data.
*

Example (from Rowan's Prompt 2 - Analysis):


<prompt>
<!-- =====  ROLE & CONTEXT  ===== -->
<role>
You are on Rowan’s Cold-Email Task Force.
Rowan Builder Marketing is a hands-on advisory for high-end custom-home builders.
Acting as the strategic marketing lead, we design focused growth plans, coach internal staff, and direct outside vendors—so builders win ideal projects without the overhead of a traditional agency retainer.
(See “Core Services & Key Outcomes” for full capability deck.)
</role>

<!-- =====  PRIMARY OBJECTIVE  ===== -->
<objective>
Mine the prospect research and produce a concise brief that will power a hyper-relevant cold email.
</objective>

<!-- =====  TASKS  ===== -->
<tasks>

<!-- --- TASK 1 : PERSONALIZATION  --- -->
<task id="personalization">
<description>
Surface up to two laser-specific personalization hooks—references to the prospect’s content, awards, milestones,
or background.Must feel one-to-one, never mass-generated.
If the research reveals nothing useful, output null for both fields.
</description>
</task>

<!-- --- TASK 2 : PAIN POINTS & SOLUTIONS  --- -->
<task id="pain_points">
<description>
Identify the two most expensive pain points implied by the research (role-specific or company-level).
For each pain point, map a Rowan service that removes or reduces it.
Each solution must be concrete—describe the exact process, automation, or engagement model Rowan would deploy.
</description>
</task>

</tasks>

<!-- =====  OUTPUT TEMPLATE  ===== -->
<output>
Personalization
1. Opportunity: {{string | null}}
Evidence: {{string | null}}

2. Opportunity: {{string | null}}
Evidence: {{string | null}}

————Pain Points & Solutions
1. Pain Point: {{string}}
Evidence: {{string}}
Rowan Offer: {{string}}

2. Pain Point: {{string}}
Evidence: {{string}}
Rowan Offer: {{string}}
</output>

<!-- =====  INSTRUCTIONS  ===== -->
<notes>
• Replace every {{…}} placeholder with researched content.
• All evidence should be specific enough that the reader never has to reopen the source material.
• Keep the entire brief to ≤ 200 words.
</notes>
</prompt>



## How to Use These Guidelines

1.

Understand Your Goal:

Before writing any prompt, clearly define what you want the AI to achieve.
2.

Choose the Right Prompt Type:

Determine what role, category, or profession that your prompt aligns with (Ie: Business Coach, or SEO Analyst)
3.

Structure Your Prompt:

Use the general principles and the XML/Markdown structure provided in the examples.
*

Role:

Start by defining the AI's role and any necessary background.
*

Task:

Clearly state the main task.
*

Sub-tasks/Steps:

Break down complex tasks into smaller, numbered steps or sub-tasks.
*

Guidelines/Rules:

List all constraints, rules, and what to avoid.
*

Output Format:

Explicitly define the desired output format (e.g., JSON, Markdown, plain text).
*

Context/Input:

Clearly indicate where the AI should get its input (e.g., "Analyze the following text:", "Use the research provided:").
4.

Iterate and Refine:

Test your prompt, review the output, and refine your prompt based on the results. Small changes can often lead to significant improvements.

These guidelines provide a robust framework for crafting effective AI prompts. By following these principles, you can significantly improve the quality and consistency of AI-generated content for your cold-email campaigns and other projects
AI Description: Guidelines for Writing Effective AI Prompts
Category: Content Strategy, Digital Marketing
Creation Date: June 20, 2025 4:56 PM
Date Updated: June 23, 2025
Inputs: - Type of prompt (e.g., researcher, copywriter, analyst)
- Specific task or objective for the AI
- Relevant context or background information
- Target audience or user profile
- Tone and style preferences
- Desired output format (e.g., Markdown, JSON)
- Examples of input-output pairs (if applicable)
- Any constraints, rules, or forbidden topics
- Specific data or information the AI should analyze or use
- Additional notes or instructions for the AI
Type: Text Generation