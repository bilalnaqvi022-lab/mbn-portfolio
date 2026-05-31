export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const body = await request.json();

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
        system: body.system || "You are helpful.",
        messages: body.messages || []
      })
    });

    const data = await response.json();

    const text =
      data?.content?.[0]?.text ||
      data?.error?.message ||
      "No response";

    return new Response(
      JSON.stringify({ reply: text }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
