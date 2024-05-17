import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  // Create the file path by joining the current working directory, "public", and the filename
  const filePath = path.join(
    // Get the current working directory
    process.cwd(),
    // Specifiy the directory
    "public",
    // Specify the filename
    "alvin-quach-resume-fullstack.pdf"
  );
  console.log(filePath);

  // Read the file from the created file path
  const data = await fs.promises.readFile(filePath);

  // Return a new Response object with the file data and appropriate headers
  return new Response(data, {
    // Specify the headers
    // Set the Content-Type header to indicate a PDF document
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
