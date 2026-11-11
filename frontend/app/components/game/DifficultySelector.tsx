import { type ReactNode } from "react";
import {
  Crown,
  Swords,
  Users,
  Ghost,
  Tag,
} from "lucide-react";

export interface DifficultyOption {
  value: 'easy' | 'medium' | 'hard';
  label: string;
  description: string;
  mafiaCount: number;
  townCount: number;
  totalPlayers: number;
  icon: string;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    value: 'easy',
    label: 'Easy',
    description: '1 Mafia, 5 Towns (6 total)',
    mafiaCount: 1,
    townCount: 5,
    totalPlayers: 6,
    icon: Ghost,
  },
  {
    value: 'medium',
    label: 'Medium',
    description: '2 Mafia, 9 Towns (11 total)',
    mafiaCount: 2,
    townCount: 9,
    totalPlayers: 11,
    icon: Swords,
  },
  {
    value: 'hard',
    label: 'Hard',
    description: '3 Mafia, 13 Towns (16 total)',
    mafiaCount: 3,
    townCount: 13,
    totalPlayers: 16,
    icon: Crown,
  },
];

export default function DifficultySelector({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: DifficultyOption) => void;
}): ReactNode {
  const selected = DIFFICULTY_OPTIONS.find((d) => d.value === value);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Game Mode
      </label>

      <div className="grid grid-cols-3 gap-2">
        {DIFFICULTY_OPTIONS.map((option) => {
          const ActiveIcon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onChange?.(option)}
              className={`relative p-2 rounded-md border text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-muted hover:border-muted-foreground/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-1.5">
                  <ActiveIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-xs font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {option.label}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground truncate">
                  {option.description}
                </span>
              </div>

              {isSelected && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-2 p-2 text-xs text-muted-foreground rounded-md bg-muted/30 border border-dashed">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            <span className="truncate">{selected.description}</span>
          </div>
        </div>
      )}
    </div>
  );
}