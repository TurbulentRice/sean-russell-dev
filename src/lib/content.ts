import { getCollection, type CollectionEntry } from 'astro:content';

type Listed = 'work' | 'lab' | 'notes';

/** A collection without drafts (drafts show in `npm run dev` only), in display order. */
export async function published<C extends Listed>(name: C): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(name, (e) => import.meta.env.DEV || !e.data.draft);
  return entries.sort((a, b) =>
    'order' in a.data && 'order' in b.data
      ? a.data.order - b.data.order
      : (b.data as { date: Date }).date.valueOf() - (a.data as { date: Date }).date.valueOf(),
  );
}
