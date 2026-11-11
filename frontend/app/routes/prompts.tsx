import React from 'react';
import { Copy, RefreshCw } from "lucide-react";

export function meta({}: { params: { prompts_path: string }; loader?: any }) {
  return [
    { title: "Prompts | Mafia Arena" },
    { name: "description", content: "View the prompts used to instruct AI players in Mafia Arena games" },
    { property: "og:title", content: "Prompts | Mafia Arena" },
    { property: "og:description", content: "View the prompts used to instruct AI players in Mafia Arena games" },
  ];
}

/**
 * Persona constraints levels
 */
type CONSTRAINT = 'strict' | 'moderate' | 'free';

/**
 * System prompts for Mafia and Town roles
 */
export const SYSTEM_PROMPTS = {
  mafia: (teammates: string[] = []) => `You are playing Mafia. You are a MAFIA member.

Your teammates: ${teammates.length > 0 ? teammates.join(', ') : 'None (you are the only Mafia)'}

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
-Vote based on evidence and gut feelings
- Survive to help Town win

RULES:
- You don't know who the Mafia members are
- During day discussion: Share your suspicions and theories
- During day vote: Vote to eliminate someone you suspect is Mafia`.trim(),
} as const;

/**
 * Persona constraint rules
 */
export const PERSONA_CONSTRAINT_RULES: Record<CONSTRAINT, string> = {
  strict: `NAMING RULES (STRICT):
- Use ONLY invented/fantasy names (e.g., "Kael", "Mira", "Thorne", "Vex", "Nyx")
- NO real-world names from any culture
- Single names only (no full names)
- Gender-neutral names preferred

BACKGROUND RULES:
- Keep completely abstract - NO specific locations, institutions, or time periods
- Focus ONLY on personality traits and motivations
- Example: "A careful observer who trusts evidence over intuition"

PERSONALITY OPTIONS:
Analytical, Emotional, Cautious, Bold, Diplomatic, Direct, Skeptical, Trusting, Reserved, Expressive`.trim(),

  moderate: `NAMING RULES (MODERATE):
- Use uncommon or invented names (e.g., "Sage", "River", "Ash", "Phoenix")
- Avoid names strongly tied to specific cultures
- Single names preferred

BACKGROUND RULES:
- Keep somewhat abstract - avoid specific real-world references
- Focus on personality and approach to the game
- Example: "Someone who believes in building trust before making accusations"

PERSONALITY OPTIONS:
Analytical, Emotional, Cautious, Bold, Diplomatic, Direct, Skeptical, Trusting, Reserved, Expressive`.trim(),

  free: `NAMING RULES (FREE):
- Choose any name that fits your character
- Can use first name only or a nickname

BACKGROUND RULES:
- Create a brief backstory that feels authentic
- Can reference general concepts but keep it game-relevant

PERSONALITY:
- Define your communication style however you see fit`.trim(),
} as const;

/**
 * Game difficulty settings
 */
interface Difficulty {
  name: string;
  players: number;
  mafia: number;
  town: number;
}

const DIFFICULTY_SETS: Record<string, Difficulty> = {
  easy: { name: 'Easy', players: 6, mafia: 1, town: 5 },
  medium: { name: 'Medium', players: 11, mafia: 2, town: 9 },
  hard: { name: 'Hard', players: 16, mafia: 3, town: 13 },
};

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

function ThemeIcon({ theme }: { theme: string }): JSX.Element {
  const colors: Record<string, string> = {
    noir: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    victorian: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    modern: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    fantasy: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-medium ${colors[theme] || 'bg-gray-500/10'}`}>
      {theme}
    </span>
  );
}

export default function PromptsPage() {
  const [constraint, setConstraint] = React.useState<CONSTRAINT>('moderate');
  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard'>('medium');
  const dia = DIFFICULTY_SETS[difficulty];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Prompts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View the prompts used to instruct AI players in Mafia Arena. Select a constraint level to customize persona generation.
        </p>
      </div>

      {/* Constraint Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Constraint Level:</span>
        <div className="flex items-center gap-1">
          {(['strict', 'moderate', 'free'] as CONSTRAINT[]).map((c) => (
            <button
              key={c}
              onClick={() => setConstraint(c)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                constraint === c
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                  : 'bg-muted text-muted-foreground hover:bg-muted-foreground/80'
              }`}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
          <span className="text-xs text-muted-foreground ml-2 flex items-center gap-1">
            <Copy size={12} /> click to toggle
          </span>
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Preset:</span>
        <div className="flex items-center gap-1">
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                difficulty === d
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                  : 'bg-muted text-muted-foreground hover:bg-muted-foreground/80'
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Info */}
      <div className="text-sm text-muted-foreground">
        Current preset: <span className="font-medium text-foreground">{dia.name}</span> ({dia.players} players: {dia.mafia} Mafia vs {dia.town} Town)
      </div>

      {/* Constraint Rules Display */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold">
            Constraint Rules ({constraint})
          </h2>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <pre className="text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {PERSONA_CONSTRAINT_RULES[constraint]}
          </pre>
          <button
            onClick={() => copyToClipboard(PERSONA_CONSTRAINT_RULES[constraint])}
            className="mt-3 text-xs text-primary hover:underline flex items-center gap-1"
          >
            <Copy size={12} /> Copy constraint rules to clipboard
          </button>
        </div>
      </section>

      {/* System Prompts Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-semibold">System Prompts (Role Definition)</h2>
        </div>

        {/* Mafia System Prompt */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
            <span className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              MAFIA SYSTEM PROMPT ({dia.mafia} Mafia total - teammates shown below)
            </span>
            <button
              onClick={() => copyToClipboard(SYSTEM_PROMPTS.mafia(difficulty === 'easy' ? [] : difficulty === 'medium' ? ['Mafia 2', 'Mafia 3'] : ['Mafia 2', 'Mafia 3', 'Mafia 4'])))}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Copy to clipboard"
            >
              <Copy size={14} />
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-xs leading-relaxed whitespace-pre-wrap">
            {SYSTEM_PROMPTS.mafia(difficulty === 'easy' ? [] : difficulty === 'medium' ? ['Mafia 2', 'Mafia 3'] : ['Mafia 2', 'Mafia 3', 'Mafia 4'])}
          </pre>
        </div>

        {/* Town System Prompt */}
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
          <h2 className="text-lg font-semibold">Persona Generation Prompts (Pre-game)</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          These prompts create player identities BEFORE the game starts, using pre-assigned names and archetypes from themes.
        </p>

        <div className="flex flex-wrap gap-2">
          {Object.entries({
            noir: { description: "1940s Noir - Gritty & Secretive", colors: "bg-slate-500/10 text-slate-600" },
            victorian: { description: "Victorian London - Formal & Precise", colors: "bg-amber-500/10 text-amber-600" },
            modern: { description: "Modern Tech Hub - Casual & Analytical", colors: "bg-emerald-500/10 text-emerald-600" },
            fantasy: { description: "High Fantasy - Mystical & Diverse", colors: "bg-indigo-500/10 text-indigo-600" },
          }).map(([theme, { colors }]) => (
            <span key={theme} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colors}`}>"{theme}"</span>
          ))}
        </div>

        {/* Mafia Persona Prompt */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
            <span className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              MAFIA PERSONA PROMPT (with archetype)
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

        {/* Town Persona Prompt */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
            <span className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              TOWN PERSONA PROMPT (with archetype)
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
    </div>
  );
}