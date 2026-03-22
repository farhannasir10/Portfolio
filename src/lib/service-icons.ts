export const SERVICE_ICON_KEYS = [
  "code",
  "stack",
  "doc",
  "design",
  "mobile",
  "api",
] as const;

export type ServiceIconKey = (typeof SERVICE_ICON_KEYS)[number];

export const SERVICE_ICON_OPTIONS: { value: ServiceIconKey; label: string }[] = [
  { value: "code", label: "Code / dev" },
  { value: "stack", label: "Layers / full-stack" },
  { value: "doc", label: "Document" },
  { value: "design", label: "Design / creative" },
  { value: "mobile", label: "Mobile" },
  { value: "api", label: "API / integration" },
];

export function isServiceIconKey(v: string): v is ServiceIconKey {
  return (SERVICE_ICON_KEYS as readonly string[]).includes(v);
}
