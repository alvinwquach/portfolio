const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = "2023-10-01"; // Sanity API version
const baseUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;

export async function fetchSanity<T>(query: string): Promise<T> {
  const token = process.env.SANITY_API_READ_TOKEN; // server-only
  const res = await fetch(`${baseUrl}?query=${encodeURIComponent(query)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Sanity fetch error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.result;
}