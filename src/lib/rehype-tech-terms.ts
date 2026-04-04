import type { Root, Element, Text, RootContent, ElementContent } from "hast";

const MAX_HIGHLIGHTS_PER_TERM = 2;

/**
 * Known product / stack strings. Longer phrases first (handled by sort).
 * Compounds like “AWS Lambda” must appear before “AWS” so the full phrase wins.
 */
const TECH_TERMS_RAW: string[] = [
  "Hugging Face APIs",
  "Visual Studio Code",
  "Ruby on Rails",
  "Tailwind CSS",
  "Google OAuth",
  "Google Cloud",
  "AWS Lambda",
  "AWS Amplify",
  "Amazon RDS",
  "AWS RDS",
  "AWS ECS",
  "Amazon S3",
  "AWS S3",
  "Brevo SMTP",
  "Ticketmaster",
  "TypeScript",
  "JavaScript",
  "PostgreSQL",
  "Elasticsearch",
  "Kubernetes",
  "Cloudflare",
  "Express.js",
  "WebSocket",
  "Playwright",
  "Storybook",
  "FastAPI",
  "GraphQL",
  "MongoDB",
  "Supabase",
  "Firebase",
  "NextAuth.js",
  "NextAuth",
  "Next.js",
  "Node.js",
  "NestJS",
  "Docker",
  "Prisma",
  "Stripe",
  "Twilio",
  "Vercel",
  "Netlify",
  "Mailchimp",
  "GitHub",
  "GitLab",
  "Linear",
  "Figma",
  "Svelte",
  "Angular",
  "Android",
  "Kotlin",
  "Python",
  "Django",
  "Laravel",
  "WordPress",
  "Shopify",
  "OpenAI",
  "ChatGPT",
  "Cypress",
  "Jest",
  "pnpm",
  "yarn",
  "npm",
  "React",
  "Vue",
  "Swift",
  "Rails",
  "Redis",
  "Kafka",
  "MySQL",
  "SQLite",
  "Terraform",
  "WebRTC",
  "Hugging Face",
  "CI/CD",
  "OAuth 2.0",
  "OAuth",
  "SMTP",
  "SaaS",
  "REST",
  "HTML",
  "CSS",
  "PHP",
  "GCP",
  "AWS",
  "Azure",
  "Brevo",
  "iOS",
];

const TECH_TERMS = [...new Set(TECH_TERMS_RAW)].sort(
  (a, b) => b.length - a.length,
);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Count bucket: canonical slug → times highlighted in this block. */
type LimitBucket = Map<string, number>;

function slugifyTerm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function leftBoundaryOk(value: string, start: number): boolean {
  if (start === 0) return true;
  const prev = value[start - 1];
  return !/[\w]/.test(prev);
}

function mergeAdjacentText(nodes: ElementContent[]): ElementContent[] {
  const out: ElementContent[] = [];
  for (const n of nodes) {
    const last = out[out.length - 1];
    if (n.type === "text" && last?.type === "text") {
      (last as Text).value += (n as Text).value;
    } else {
      out.push(n);
    }
  }
  return out;
}

/**
 * Left-to-right longest match; at most MAX_HIGHLIGHTS_PER_TERM per canonical slug
 * when `limits` is set (per &lt;p&gt; / &lt;li&gt;).
 */
function splitTextWithTechTerms(
  value: string,
  limits: LimitBucket | null,
): ElementContent[] {
  const nodes: ElementContent[] = [];
  let i = 0;

  while (i < value.length) {
    if (!leftBoundaryOk(value, i)) {
      nodes.push({ type: "text", value: value[i] });
      i += 1;
      continue;
    }

    let chosen: { term: string; len: number } | null = null;

    for (const term of TECH_TERMS) {
      const tail = value.slice(i, i + term.length);
      if (tail.length < term.length) continue;
      if (tail.toLowerCase() !== term.toLowerCase()) continue;
      const after = value[i + term.length];
      if (after !== undefined && /[\w]/.test(after)) continue;
      chosen = { term, len: term.length };
      break;
    }

    if (chosen) {
      const slug = slugifyTerm(chosen.term);
      const used = limits?.get(slug) ?? 0;
      const raw = value.slice(i, i + chosen.len);

      if (limits && used >= MAX_HIGHLIGHTS_PER_TERM) {
        nodes.push({ type: "text", value: raw });
      } else {
        if (limits) limits.set(slug, used + 1);
        nodes.push({
          type: "element",
          tagName: "span",
          properties: {
            className: ["tech-term-inline"],
            dataTech: slug,
          },
          children: [{ type: "text", value: raw }],
        });
      }
      i += chosen.len;
      continue;
    }

    nodes.push({ type: "text", value: value[i] });
    i += 1;
  }

  return mergeAdjacentText(nodes);
}

function processChildren(
  children: RootContent[] | undefined,
  limits: LimitBucket | null,
  flags: { inLink: boolean; inStrong: boolean },
): void {
  if (!children?.length) return;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === "text") {
      const t = child as Text;
      const skip = flags.inLink || flags.inStrong;
      const parts = skip
        ? [{ type: "text" as const, value: t.value }]
        : splitTextWithTechTerms(t.value, limits);
      if (
        parts.length === 1 &&
        parts[0].type === "text" &&
        (parts[0] as Text).value === t.value
      ) {
        continue;
      }
      children.splice(i, 1, ...parts);
      i += parts.length - 1;
      continue;
    }
    if (child.type === "element") {
      const el = child as Element;
      if (el.tagName === "pre") continue;
      if (el.tagName === "code") continue;

      const nextLimits =
        el.tagName === "p" ||
        el.tagName === "li" ||
        el.tagName === "td" ||
        el.tagName === "th" ||
        /^h[1-6]$/.test(el.tagName)
          ? new Map<string, number>()
          : limits;

      const nextFlags = {
        inLink: flags.inLink || el.tagName === "a",
        inStrong:
          flags.inStrong || el.tagName === "strong" || el.tagName === "b",
      };

      if (el.children?.length) {
        processChildren(
          (el.children ?? []) as RootContent[],
          nextLimits,
          nextFlags,
        );
      }
    }
  }
}

function isHastRoot(node: unknown): node is Root {
  return (
    typeof node === "object" &&
    node !== null &&
    (node as Root).type === "root" &&
    Array.isArray((node as Root).children)
  );
}

/**
 * Wraps known tech names in orange inline spans; max 2× per term per paragraph
 * or list item. Skips text inside links and bold/emphasis.
 */
export function rehypeTechTerms() {
  return (tree: unknown) => {
    if (!isHastRoot(tree) || !tree.children.length) return;
    processChildren(tree.children, null, {
      inLink: false,
      inStrong: false,
    });
  };
}
