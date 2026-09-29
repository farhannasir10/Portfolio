export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  /** Short paragraphs describing the work — no skill chips. */
  details: string[];
};

export const WORK_EXPERIENCE: ExperienceItem[] = [
  {
    id: "tekvill",
    company: "Tekvill",
    role: "AI and Full Stack Engineer",
    period: "Aug 2022 – Present",
    location: "Lahore, Punjab, Pakistan",
    details: [
      "I build production-ready AI and full-stack applications across web, mobile, cloud, and automation systems. Focused on developing scalable products using React, Next.js, TypeScript, Node.js, Python, FastAPI, PostgreSQL, and modern AI tooling. Experienced in LLM integrations, RAG pipelines, vector databases, API automation, dashboards, SaaS platforms, eCommerce systems, and internal tools.",
      "I work across frontend, backend, AI workflows, and DevOps, with hands-on experience in Docker, CI/CD, AWS, GCP, Vercel, and cloud deployments.",
    ],
  },
  {
    id: "dailyremote",
    company: "DailyRemote",
    role: "Software Engineer · Full-time",
    period: "Aug 2019 – Jul 2022",
    location: "Remote",
    details: [
      "Built and maintained remote-first product features for a distributed audience, shipping reliable web experiences end to end—from UI flows to API integrations and release support.",
      "Collaborated asynchronously with designers and stakeholders across time zones, improving delivery cadence through clear specs, iterative releases, and solid debugging practices on production issues.",
      "Owned feature slices across the stack: implementing interfaces, wiring backend endpoints, and tightening performance and stability for day-to-day remote work use cases.",
    ],
  },
];
