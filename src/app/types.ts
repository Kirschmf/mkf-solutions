export type NeedId = 'sites' | 'automations' | 'apps' | 'ecommerce' | 'operations';
export type BriefDraft = { need: NeedId; name: string; objective: string };
export type ProjectRecord = {
  id: string; name: string; category: string; status: string; description: string;
  details?: string; role?: string | null; tags?: string[]; url?: string | null;
  image?: string | null; gallery?: {src: string; label: string}[];
  captureNote?: string | null; visualType?: string; domain?: string | null;
  mediaState?: 'verified' | 'demo' | 'unavailable'; needIds?: NeedId[];
  featured?: boolean; theme?: string; kindLabel?: string; short?: string;
};
