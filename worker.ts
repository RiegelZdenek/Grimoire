import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export interface Env {
    AUDIO_BUCKET: R2Bucket;
    __STATIC_CONTENT: any;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // 1. Intercept /api/audio/* requests to securely proxy from R2
        if (url.pathname.startsWith('/api/audio/')) {
            const key = decodeURIComponent(url.pathname.replace('/api/audio/', ''));

            if (!key) {
                return new Response('Missing filename', { status: 400 });
            }

            const object = await env.AUDIO_BUCKET.get(key);
            if (object === null) {
                return new Response(`Audio file "${key}" not found in R2 bucket`, { status: 404 });
            }

            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('etag', object.httpEtag);
            headers.set('Accept-Ranges', 'bytes');

            return new Response(object.body, { headers });
        }

        // 2. Fallback: serve static assets from the React build (dist/)
        try {
            return await getAssetFromKV(
                {
                    request,
                    waitUntil: ctx.waitUntil.bind(ctx),
                },
                {
                    ASSET_NAMESPACE: env.__STATIC_CONTENT,
                    ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
                }
            );
        } catch (e) {
            // If the React app's static file isn't found, fallback to index.html (SPA routing)
            try {
                const notFoundResponse = await getAssetFromKV(
                    {
                        request: new Request(new URL('/', request.url)),
                        waitUntil: ctx.waitUntil.bind(ctx),
                    },
                    {
                        ASSET_NAMESPACE: env.__STATIC_CONTENT,
                        ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
                    }
                );
                return new Response(notFoundResponse.body, {
                    ...notFoundResponse,
                    status: 200, // Return 200 so React Router handles the 404 visually
                });
            } catch (e) {
                return new Response("An unexpected error occurred", { status: 500 });
            }
        }
    }
};
