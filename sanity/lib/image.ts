/**
 * Sanity Image URL Builder
 * ========================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file creates a helper function (urlFor) that generates optimized
 * image URLs from Sanity's image assets.
 *
 * WHY NOT JUST USE THE IMAGE URL DIRECTLY?
 * -----------------------------------------
 * When you upload an image to Sanity, it stores the original file.
 * But displaying that original would be:
 *   - Slow (large file sizes)
 *   - Wasteful (mobile doesn't need 4K images)
 *   - Missing responsive sizes
 *   - No format optimization (WebP, AVIF)
 *
 * The image URL builder lets you request exactly what you need:
 *   - Specific dimensions
 *   - Cropping with hotspot awareness
 *   - Format conversion (auto WebP)
 *   - Quality adjustments
 *
 * HOW SANITY IMAGE URLS WORK:
 * ---------------------------
 *
 * Original upload:
 *   https://cdn.sanity.io/images/{projectId}/{dataset}/{imageId}.jpg
 *
 * With transformations:
 *   https://cdn.sanity.io/images/{projectId}/{dataset}/{imageId}.jpg
 *     ?w=800          // Width: 800px
 *     &h=600          // Height: 600px
 *     &fit=crop       // Crop to fit dimensions
 *     &crop=center    // Crop from center (or use hotspot)
 *     &auto=format    // Auto-convert to WebP/AVIF if supported
 *     &q=80           // Quality: 80%
 *
 * PSEUDOCODE:
 * -----------
 * function urlFor(sanityImageReference):
 *   // Sanity image references look like:
 *   // { _type: "image", asset: { _ref: "image-abc123-800x600-jpg" } }
 *
 *   extract projectId and dataset from config
 *   parse the asset reference to get imageId
 *
 *   return UrlBuilder that can chain methods:
 *     .width(800)     → adds ?w=800
 *     .height(600)    → adds &h=600
 *     .fit('crop')    → adds &fit=crop
 *     .auto('format') → adds &auto=format
 *     .url()          → returns final URL string
 *
 * THE IMAGE PIPELINE:
 * -------------------
 * 1. Content editor uploads image in Sanity Studio
 * 2. Sanity stores original + generates asset reference
 * 3. Your code fetches content with image references
 * 4. urlFor() builds optimized URL with your specifications
 * 5. Browser requests that URL
 * 6. Sanity CDN transforms and serves the optimized image
 *
 * HOTSPOT & CROP EXPLAINED:
 * -------------------------
 * When editors upload images, they can set a "hotspot" - the most
 * important part of the image (e.g., a person's face).
 *
 * When you crop, Sanity uses the hotspot to ensure the important
 * part isn't cut off, even at different aspect ratios.
 *
 * Example: A portrait photo with hotspot on face
 *   - 16:9 crop → face stays visible
 *   - 1:1 crop → face stays centered
 *   - 4:3 crop → face is prioritized
 *
 * USAGE EXAMPLES:
 * ---------------
 *
 * // Basic usage - just get the URL
 * import { urlFor } from '@/sanity/lib/image'
 *
 * const imageUrl = urlFor(project.mainImage).url()
 *
 * // Responsive thumbnail (400px wide)
 * const thumbnail = urlFor(project.mainImage)
 *   .width(400)
 *   .auto('format')  // Serve WebP to supported browsers
 *   .url()
 *
 * // Hero image with specific dimensions and quality
 * const hero = urlFor(project.mainImage)
 *   .width(1200)
 *   .height(630)
 *   .fit('crop')     // Crop to exact dimensions
 *   .quality(85)     // 85% quality
 *   .auto('format')
 *   .url()
 *
 * // Avatar with blur placeholder (for loading states)
 * const avatar = urlFor(profile.photo)
 *   .width(100)
 *   .height(100)
 *   .fit('crop')
 *   .url()
 *
 * const blurPlaceholder = urlFor(profile.photo)
 *   .width(20)       // Tiny version for blur-up effect
 *   .quality(30)
 *   .blur(50)        // Apply blur
 *   .url()
 *
 * // In Next.js Image component
 * <Image
 *   src={urlFor(project.mainImage).width(800).url()}
 *   alt={project.title}
 *   width={800}
 *   height={600}
 * />
 *
 * COMMON METHODS:
 * ---------------
 * .width(n)       - Set width in pixels
 * .height(n)      - Set height in pixels
 * .size(w, h)     - Set both at once
 * .fit('crop')    - crop | clip | fill | fillmax | max | scale | min
 * .crop('center') - Use hotspot or: center, top, bottom, left, right
 * .quality(n)     - 0-100 quality percentage
 * .auto('format') - Auto-convert to best format (WebP/AVIF)
 * .blur(n)        - Apply gaussian blur (0-2000)
 * .sharpen(n)     - Sharpen the image
 * .url()          - Generate the final URL string
 *
 * PERFORMANCE TIPS:
 * -----------------
 * 1. Always specify dimensions for layout stability
 * 2. Use auto('format') for automatic WebP/AVIF
 * 3. Quality 75-85 is usually good enough
 * 4. Generate blur placeholders for loading states
 * 5. Use responsive sizes for different viewports
 *
 * RELATED FILES:
 * --------------
 * - sanity/lib/client.ts: Main Sanity client
 * - sanity/env.ts: Project configuration
 * - components/ (any component using images)
 *
 * DOCUMENTATION:
 * --------------
 * https://www.sanity.io/docs/image-url
 */

import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

/**
 * Create the image URL builder instance
 *
 * The builder is configured with your project's ID and dataset,
 * so it knows where to fetch images from.
 *
 * This is a singleton - we only need one builder for the whole app.
 */
const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * Generate optimized image URLs from Sanity image assets
 *
 * @param source - A Sanity image reference object
 *                 Usually from a GROQ query like: project.mainImage
 *
 * @returns An ImageUrlBuilder instance with chainable methods
 *
 * @example
 * // Simple usage
 * urlFor(image).width(800).url()
 *
 * // With transformations
 * urlFor(image).width(400).height(300).fit('crop').auto('format').url()
 */
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}
