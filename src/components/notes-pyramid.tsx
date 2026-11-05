import type { FragranceNotes } from "@/types/catalog";

const layers = [
  { key: "top", label: "Salida" },
  { key: "heart", label: "Corazón" },
  { key: "base", label: "Fondo" },
] as const;

export function NotesPyramid({ notes }: { notes: FragranceNotes }) {
  const filled = layers.filter((layer) => notes[layer.key].length > 0);
  if (filled.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {filled.map((layer) => (
        <div key={layer.key} className="rounded-2xl border border-line bg-paper p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gold">{layer.label}</p>
          <p className="mt-2 text-sm leading-6">{notes[layer.key].join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

export function RatingMeter({ label, value }: { label: string; value?: number }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-1 text-sm">{value ? `${value} de 5` : "Sin dato"}</p>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={index < (value ?? 0) ? "h-1.5 w-6 rounded-full bg-champagne" : "h-1.5 w-6 rounded-full bg-line"}
          />
        ))}
      </div>
    </div>
  );
}
