import OpenAI from "openai";

export async function handler(event) {
try {

const { text } = JSON.parse(event.body);

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

const completion = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content: "You are a professional AI assistant that corrects grammar and improves business writing."
},
{
role: "user",
content: text
}
],
});

return {
statusCode: 200,
body: JSON.stringify({
reply: completion.choices[0].message.content
})
};

} catch (error) {
return {
statusCode: 500,
body: JSON.stringify({
error: "AI processing failed."
})
};
}
}
