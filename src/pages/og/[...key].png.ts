import type { APIRoute, GetStaticPaths } from 'astro';
import { ogCards, renderOg, type OgCard } from '../../lib/og';

export const getStaticPaths = (async () =>
  (await ogCards()).map((card) => ({ params: { key: card.key }, props: { card } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderOg((props as { card: OgCard }).card), { headers: { 'Content-Type': 'image/png' } });
