import "server-only";

export async function sendTransactional(input: {
  to: string;
  subject: string;
  body: string;
}): Promise<void> {
  const res = await fetch("https://api.useplunk.com/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PLUNK_API_KEY}`,
    },
    body: JSON.stringify({ to: input.to, subject: input.subject, body: input.body }),
  });
  if (!res.ok) throw new Error(`Plunk error ${res.status}: ${await res.text()}`);
}
