export function FaqList({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.question} className="py-4">
          <summary className="cursor-pointer font-medium">{item.question}</summary>
          <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
