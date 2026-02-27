export async function handler(event) {
try {

if (event.httpMethod !== "POST") {
return {
statusCode: 405,
body: JSON.stringify({ reply: "Method Not Allowed" })
};
}

const { text } = JSON.parse(event.body);

if (!text) {
return {
statusCode: 400,
body: JSON.stringify({ reply: "No text provided." })
};
}

const response = await fetch("https://api.openai.com/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
},
body: JSON.stringify({
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
]
})
});

const data = await response.json();

/* Check if OpenAI returned error */
if (data.error) {
return {
statusCode: 500,
body: JSON.stringify({
reply: "⚠️ OpenAI Error: " + data.error.message
})
};
}

/* Check if response is valid */
if (!data.choices || !data.choices[0]) {
return {
statusCode: 500,
body: JSON.stringify({
reply: "⚠️ AI response failed."
})
};
}

return {
statusCode: 200,
body: JSON.stringify({
reply: data.choices[0].message.content
})
};

} catch (error) {
return {
statusCode: 500,
body: JSON.stringify({
reply: "⚠️ Server error occurred."
})
};
}
}
