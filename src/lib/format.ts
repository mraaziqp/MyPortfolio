const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "10/2024" -> { y: 2024, m: 9 }; also accepts "2024-10" and "2024". */
function parse(value?: string | null): { y: number; m: number } | null {
  if (!value) return null;
  let match = /^(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (match) return { y: Number(match[2]), m: Number(match[1]) - 1 };
  match = /^(\d{4})-(\d{1,2})/.exec(value.trim());
  if (match) return { y: Number(match[1]), m: Number(match[2]) - 1 };
  match = /^(\d{4})$/.exec(value.trim());
  if (match) return { y: Number(match[1]), m: 0 };
  return null;
}

export function formatMonth(value?: string | null): string {
  const d = parse(value);
  return d ? `${MONTHS[d.m]} ${d.y}` : value || '';
}

/** Inclusive month count rendered as "1 yr 4 mos". */
export function formatDuration(start: string, end?: string | null, now = new Date()): string {
  const a = parse(start);
  const b = end ? parse(end) : { y: now.getFullYear(), m: now.getMonth() };
  if (!a || !b) return '';
  const months = Math.max(1, (b.y - a.y) * 12 + (b.m - a.m) + 1);
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr${y > 1 ? 's' : ''}` : '', m ? `${m} mo${m > 1 ? 's' : ''}` : ''].filter(Boolean).join(' ');
}

export const hostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};
