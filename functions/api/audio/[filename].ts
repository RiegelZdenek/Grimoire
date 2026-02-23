export const onRequestGet: PagesFunction<{ AUDIO_BUCKET: R2Bucket }> = async (context) => {
    const filename = context.params.filename as string;

    if (!filename) {
        return new Response('Missing filename', { status: 400 });
    }

    // Fetch the file securely from the private R2 bucket using the binding
    const object = await context.env.AUDIO_BUCKET.get(filename);

    if (object === null) {
        return new Response('Audio file not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    // Allow the browser to cache it and scrub through the audio
    headers.set('Accept-Ranges', 'bytes');

    return new Response(object.body, { headers });
};
