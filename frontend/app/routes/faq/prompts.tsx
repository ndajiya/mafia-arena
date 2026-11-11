import type { Route } from "./+types/prompts";
import { Copy, RefreshCw } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prompts | Mafia Arena" },
    { name: "description", content: "View the prompts used to instruct AI players in Mafia Arena games" },
  ];
}

/**
 * System prompts for Mafia and Town roles
 */
export const SYSTEM_PROMPTS = {
  mafia: (teammates: string[] = []) => `You are playing Mafia. You are a MAFIA member.

Your teammates: ${teammates.length > 0 ? teammates.join(", ") : "None (you are the only Mafia)"}

GOALS:
- Eliminate all Town members without being discovered
- Coordinate with your teammates during night phase
- Blend in during day discussions - act like a concerned citizen
- Deflect suspicion away from yourself and teammates
- Vote strategically to eliminate Town members

RULES:
- During night: Vote to kill a Town member
- During day discussion: Share your thoughts, accusations, or defenses
- During day vote: Vote to eliminate someone suspicious (or abstain)`.trim(),

  town: () => `You are playing Mafia. You are a TOWN member.

GOALS:
- Identify and eliminate all Mafia members
- Pay attention to suspicious behavior during discussions
- Look for inconsistencies in what others say
- Vote based on evidence and gut feelings
- Survive to help Town win

RULES:
- You don't know who the Mafia members are
- During day discussion: Share your suspicions and theories
- During day vote: Vote to eliminate someone you suspect is Mafia`.trim(),
} as const;

/**
 * Constraint levels
 */
interface ThemeColors {
  description: string;
  colors: string;
}

const THEME_KEYS: ThemeColors[] = [
  { description: "1940s Noir - Gritty & Secretive", colors: "bg-slate-500/10 text-slate-600" },
  { description: "Victorian London - Formal & Precise", colors: "bg-amber-500/10 text-amber-600" },
  { description: "Modern Tech Hub - Casual & Analytical", colors: "bg-emerald-500/10 text-emerald-600" },
  { description: "High Fantasy - Mystical & Diverse", colors: "bg-indigo-500/10 text-indigo-600" },
];

export default function PromptsPage() {
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Prompts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View the prompts used to instruct AI players in Mafia Arena.
        </p>
      </div>

      {/* System Prompts Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-semibold">System Prompts (Role Definition)</h2>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
            <span className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              MAFIA SYSTEM PROMPT
            </span>
            <button
              onClick={() => copyToClipboard(SYSTEM_PROMPTS.mafia())}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Copy to clipboard"
            >
              <Copy size={14} />
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-xs leading-relaxed whitespace-pre-wrap">
            {SYSTEM_PROMPTS.mafia()}
          </pre>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
            <span className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              TOWN SYSTEM PROMPT
            </span>
            <button
              onClick={() => copyToClipboard(SYSTEM_PROMPTS.town())}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Copy to clipboard"
            >
              <Copy size={14} />
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-xs leading-relaxed whitespace-pre-wrap">
            {SYSTEM_PROMPTS.town()}
          </pre>
        </div>
      </section>

      {/* Persona Prompts Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold">Constraint Rules</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Controls how personas are generated (strict/invented names, moderate/uncommon names, free/custom names)
        </p>

        <div className="rounded-lg border bg-card p-4">
          <pre className="text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {`NAMING RULES (STRICT):
- Use ONLY invented/fantasy names (e.g., "Kael", "Mira", "Thorne")
- NO real-world names from any culture
- Single names only

NAMING RULES (MODERATE):
- Use uncommon or invented names (e.g., "Sage", "Phoenix")
- Avoid names strongly tied to specific cultures

NAMING RULES (FREE):
- Choose any name that fits your character
- Can use first name only or a nickname`}
          </pre>
        </div>
      </section>

      {/* Themes Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Available Themes</h2>
        <div className="flex flex-wrap gap-2">
          {THEME_KEYS.map(({ description, colors }) => (
            <span key={description} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colors}`}>"{description.split(` - `)[0]}</span>
          ))}
        </div>
      </section>
    </div>
  );
}