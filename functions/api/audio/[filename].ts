export interface Env {
    AUDIO_BUCKET: R2Bucket;
}

export const onRequestGet: PagesFunction<{ AUDIO_BUCKET: R2Bucket }> = async (context) => {
    // The filename comes from the [filename].ts dynamic route
    const filename = context.params.filename as string;

    if (!filename) {
        return new Response('Missing filename parameter', { status: 400 });
    }

    // Since in URL it comes as e.g. /api/audio/track.mp3
    // context.params.filename is just "track.mp3"
    // In our bucket we uploaded files to the root, so key is just filename
    const object = await context.env.AUDIO_BUCKET.get(filename);

    if (object === null) {
        return new Response(`Audio file "${filename}" not found in R2 bucket`, { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Accept-Ranges', 'bytes');

    return new Response(object.body, { headers });
};
