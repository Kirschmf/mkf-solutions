export function projectUrl(href: string, id: string | null) {
  const url = new URL(href);
  if (id) { url.searchParams.set('projeto', id); url.hash = 'portfolio'; }
  else url.searchParams.delete('projeto');
  return url.href;
}
export function projectIdFromUrl(href: string): string | null {
  return new URL(href).searchParams.get('projeto') || null;
}
