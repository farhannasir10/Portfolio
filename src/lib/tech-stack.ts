export type TechCategoryId =
  | "frontend"
  | "backend"
  | "ai"
  | "infra"
  | "desktop";

export type TechItem = {
  id: string;
  name: string;
  category: TechCategoryId;
};

export type TechCategory = {
  id: TechCategoryId;
  title: string;
};

export const TECH_CATEGORIES: TechCategory[] = [
  { id: "frontend", title: "Frontend" },
  { id: "backend", title: "Backend" },
  { id: "ai", title: "AI & Intelligence" },
  { id: "infra", title: "Database & Infrastructure" },
  { id: "desktop", title: "Desktop / 3D" },
];

/** Compact home grid — max 10. */
export const TECH_FEATURED_IDS = [
  "nextjs",
  "nestjs",
  "typescript",
  "nodejs",
  "postgres",
  "openai",
  "langchain",
  "tailwind",
  "docker",
  "aws",
] as const;

/** Full categorized toolkit. */
export const TECH_CATALOG: TechItem[] = [
  { id: "nextjs", name: "Next.js", category: "frontend" },
  { id: "react", name: "React", category: "frontend" },
  { id: "typescript", name: "TypeScript", category: "frontend" },
  { id: "tailwind", name: "Tailwind CSS", category: "frontend" },
  { id: "threejs", name: "Three.js", category: "frontend" },

  { id: "nestjs", name: "NestJS", category: "backend" },
  { id: "nodejs", name: "Node.js", category: "backend" },
  { id: "express", name: "Express.js", category: "backend" },

  { id: "openai", name: "OpenAI", category: "ai" },
  { id: "langchain", name: "LangChain", category: "ai" },
  { id: "langgraph", name: "LangGraph", category: "ai" },
  { id: "huggingface", name: "Hugging Face", category: "ai" },

  { id: "postgres", name: "PostgreSQL", category: "infra" },
  { id: "redis", name: "Redis", category: "infra" },
  { id: "docker", name: "Docker", category: "infra" },
  { id: "aws", name: "AWS", category: "infra" },

  { id: "electron", name: "Electron", category: "desktop" },
  { id: "open3d", name: "Open3D", category: "desktop" },
  { id: "cpp", name: "Multithreaded C++", category: "desktop" },
];

export function getFeaturedTech(): TechItem[] {
  return TECH_FEATURED_IDS.map(
    (id) => TECH_CATALOG.find((t) => t.id === id)!,
  ).filter(Boolean);
}

export function getTechByCategory(categoryId: TechCategoryId): TechItem[] {
  return TECH_CATALOG.filter((t) => t.category === categoryId);
}
