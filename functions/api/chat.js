export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const body = await request.json();

    const messages = body.messages || [];
    const system = body.system || "You are a helpful assistant about Bilal.";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 800,
        system,
        messages
      })
    });

    const data = await response.json();

    // IMPORTANT: return only text safely
    const text =
      data?.content?.[0]?.text ||
      data?.error?.message ||
      "No response from Claude";

    return new Response(JSON.stringify({ reply: text }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
