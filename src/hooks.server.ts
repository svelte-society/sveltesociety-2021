import PocketBase from 'pocketbase';
import { PUBLIC_API_URL } from '$env/static/public';
import { sequence } from '@sveltejs/kit/hooks';
import type { TypedPocketBase } from '$lib/pocketbase-types';
import { redirect, type Handle } from '@sveltejs/kit';

const protect_routes: Handle = async ({ event, resolve }) => {
    // Protexted Routes go here in the future

    return resolve(event)
}

const add_pocketbase_client: Handle = async ({ event, resolve }) => {
    const pb: TypedPocketBase = new PocketBase(PUBLIC_API_URL);
    event.locals.pb = pb
    
    return resolve(event);
  }


export const handle = sequence(add_pocketbase_client, protect_routes)