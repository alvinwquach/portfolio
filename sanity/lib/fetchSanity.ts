const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = "2025-01-01"; // Sanity API version
const baseUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;

export async function fetchSanity<T>(query: string): Promise<T> {
  const res = await fetch(`${baseUrl}?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.result;
}
