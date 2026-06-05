import { Smartphone, Cpu, Brain, PenLine, Lightbulb, LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  cpu: Cpu,
  brain: Brain,
  "pen-line": PenLine,
  lightbulb: Lightbulb,
};

export function getCategoryIcon(name: string, className = "w-5 h-5"): React.ReactNode {
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}

export const categoryIconHoverMap: Record<string, string> = {
  smartphone: "group-hover:text-blue-500",
  cpu: "group-hover:text-orange-500",
  brain: "group-hover:text-purple-500",
  "pen-line": "group-hover:text-green-500",
  lightbulb: "group-hover:text-yellow-500",
};

