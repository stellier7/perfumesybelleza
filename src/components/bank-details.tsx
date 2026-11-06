import { bank } from "@/config";

const rows = [
  ["Banco", bank.bankName],
  ["Titular", bank.accountName],
  ["Tipo de cuenta", bank.accountType],
  ["Número de cuenta", bank.accountNumber],
  ["Identidad", bank.identity],
] as const;

export function BankDetails() {
  return (
    <dl className="divide-y divide-line rounded-3xl border border-line bg-paper shadow-soft">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline justify-between gap-4 px-5 py-3">
          <dt className="text-sm text-muted">{label}</dt>
          <dd className="text-right font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
