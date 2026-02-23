export interface Env {
    AUDIO_BUCKET: R2Bucket;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const key = url.pathname.slice(1);

        if (request.method === "PUT") {
            await env.AUDIO_BUCKET.put(key, request.body);
            return new Response(`Put ${key} successfully!`);
        }

        const object = await env.AUDIO_BUCKET.get(key);
        if (object === null) {
            return new Response("Object not found", { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Accept-Ranges', 'bytes');

        return new Response(object.body, { headers });
    },
};
