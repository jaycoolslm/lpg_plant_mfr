import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import massBalance from '$lib/massBalance/massBalance';

export const GET = (({ url }) => {
    const iterations = Number(url.searchParams.get('iterations') ?? '8');

    const data = massBalance(iterations);

    return json(data);
}) satisfies RequestHandler;