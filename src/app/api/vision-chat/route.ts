import { NextRequest, NextResponse } from 'next/server';
import { azureConfig } from '@/lib/azure-config';

// POST /api/vision-chat - Analyze an image via Azure Vision for chat context
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const image = formData.get('image') as File | null;

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        if (!azureConfig.vision.key) {
            return NextResponse.json({ analysis: 'Image received (Vision not configured)', source: 'bypass' });
        }

        const imageBytes = await image.arrayBuffer();

        // v3.2 API — works in ALL regions including Central India
        const visionResponse = await fetch(
            `${azureConfig.vision.endpoint}/vision/v3.2/analyze?visualFeatures=Description,Tags,Objects`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key': azureConfig.vision.key,
                },
                body: imageBytes,
            }
        );

        if (!visionResponse.ok) {
            const errText = await visionResponse.text();
            console.error('[Vision] API error:', visionResponse.status, errText);
            return NextResponse.json({ analysis: 'Image received (analysis unavailable)', source: 'error' });
        }

        const result = await visionResponse.json();

        // v3.2 response schema
        const caption = result.description?.captions?.[0]?.text || '';
        const tags = (result.tags || [])
            .slice(0, 8)
            .map((t: { name: string }) => t.name)
            .join(', ');
        const objects = (result.objects || [])
            .slice(0, 5)
            .map((o: { object: string }) => o.object)
            .filter(Boolean)
            .join(', ');

        const parts: string[] = [];
        if (caption) parts.push(caption);
        if (tags) parts.push(`Visible: ${tags}`);
        if (objects) parts.push(`Objects: ${objects}`);

        const analysis = parts.join('. ') || 'Image received';

        return NextResponse.json({ analysis, caption, tags, objects, source: 'azure-vision' });
    } catch (error: unknown) {
        console.error('[Vision] Exception:', error);
        return NextResponse.json({ analysis: 'Image received (analysis failed)', source: 'error' });
    }
}
