/**
 * Sanity Webhook Revalidation Endpoint
 * =====================================
 * Handles on-demand ISR revalidation when content changes in Sanity.
 *
 * Setup in Sanity:
 * 1. Go to sanity.io/manage → your project → API → Webhooks
 * 2. Create webhook with URL: https://yourdomain.com/api/revalidate
 * 3. Set secret to match SANITY_WEBHOOK_SECRET env variable
 * 4. Select document types to trigger: project, knowledgeNode, profile, etc.
 */

import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

// Sanity webhook payload structure
interface SanityWebhookPayload {
  _type: string;
  _id: string;
  slug?: {
    current: string;
  };
}

// Map Sanity document types to cache tags
const TYPE_TO_TAGS: Record<string, string[]> = {
  project: ['projects', 'landing'],
  knowledgeNode: ['knowledgeNodes', 'knowledgeGraph'],
  profile: ['profile', 'landing'],
  skill: ['skills'],
  experience: ['experiences'],
  education: ['educations'],
  testimonial: ['testimonials', 'landing'],
  tag: ['tags', 'knowledgeNodes'],
};

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const secret = request.headers.get('x-sanity-webhook-secret');
    const expectedSecret = process.env.SANITY_WEBHOOK_SECRET;

    if (!expectedSecret) {
      console.warn('SANITY_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      console.warn('Invalid webhook secret received');
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const payload: SanityWebhookPayload = await request.json();
    const { _type, _id, slug } = payload;

    if (!_type) {
      return NextResponse.json(
        { error: 'Missing document type' },
        { status: 400 }
      );
    }

    // Get cache tags to revalidate
    const tagsToRevalidate = TYPE_TO_TAGS[_type] || [];

    // Add specific document tag if it has a slug
    if (slug?.current) {
      if (_type === 'project') {
        tagsToRevalidate.push(`project:${slug.current}`);
      } else if (_type === 'knowledgeNode') {
        tagsToRevalidate.push(`knowledgeNode:${slug.current}`);
      }
    }

    // Revalidate all relevant tags
    // In Next.js 16+, revalidateTag requires a second argument for cache profile
    // Using { expire: 0 } for webhook-triggered immediate expiration
    const revalidatedTags: string[] = [];
    for (const tag of tagsToRevalidate) {
      try {
        revalidateTag(tag, { expire: 0 });
        revalidatedTags.push(tag);
      } catch (error) {
        console.error(`Failed to revalidate tag: ${tag}`, error);
      }
    }

    console.log(`Revalidated tags for ${_type} (${_id}):`, revalidatedTags);

    return NextResponse.json({
      success: true,
      revalidated: revalidatedTags,
      documentType: _type,
      documentId: _id,
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}

// Optionally support GET for testing (remove in production)
export async function GET() {
  return NextResponse.json({
    message: 'Sanity revalidation webhook endpoint',
    method: 'POST required',
    headers: {
      'x-sanity-webhook-secret': 'Required - must match SANITY_WEBHOOK_SECRET',
    },
    body: {
      _type: 'Document type (project, knowledgeNode, etc.)',
      _id: 'Document ID',
      slug: { current: 'Optional slug for specific page revalidation' },
    },
  });
}
