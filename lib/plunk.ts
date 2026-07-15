import "server-only";

// La cuenta vive en la infraestructura "next" de Plunk (dashboard next-app.useplunk.com),
// por lo que el endpoint del API es next-api.useplunk.com (no api.useplunk.com).
const PLUNK_ENDPOINT = "https://next-api.useplunk.com/v1/send";

export async function sendTransactional(input: {
  to: string;
  from: string;
  subject: string;
  body: string;
}): Promise<void> {
  const res = await fetch(PLUNK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PLUNK_SECRET_API_KEY}`,
    },
    body: JSON.stringify({
      to: input.to,
      from: input.from,
      subject: input.subject,
      body: input.body,
    }),
  });
  if (!res.ok) throw new Error(`Plunk error ${res.status}: ${await res.text()}`);
}
