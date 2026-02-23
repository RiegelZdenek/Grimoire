export interface Env {
    AUDIO_BUCKET: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    // The filename is captured by the [file].ts dynamic route
    const file = context.params.file as string;

    if (!file) {
        return new Response('Missing filename', { status: 400 });
    }

    const key = decodeURIComponent(file);
    const object = await context.env.AUDIO_BUCKET.get(key);

    if (object === null) {
        return new Response(`Audio file "${key}" not found in R2 bucket`, { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Accept-Ranges', 'bytes');

    return new Response(object.body, { headers });
};
