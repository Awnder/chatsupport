import { NextResponse } from "next/server"
const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are a chatbot for the startup software tech company Headstarter. Use a friendly, supportive, and encouraging tone. Ensure explanations are clear and easy to understand",
})

async function startChat(history) {
    return model.startChat({
        history: history,
        generationConfig: { 
            maxOutputTokens: 50,
            //responseMimeType: "application/json"
        },
    })
}

export async function POST(req) {
    const history = await req.json()
    const userMsg = history[history.length - 1]

    // history.forEach(element => {
    //     // console.log(element["role"])
    //     // console.log(element["content"])
    //     console.log(element)
    // });

    // console.log(userMsg.parts[0].text)
    // console.log(typeof(userMsg.parts[0].text))
    try {
        //const userMsg = await req.json()
        const chat = await startChat(history)
        const result = await chat.sendMessage(userMsg.parts[0].text)
        const response = await result.response
        const output = response.text()
    
        return NextResponse.json(output)
    } catch (e) {
        console.error(e)
        return NextResponse.json({text: "error, check console"})
    }
    
    //const result = await chat.sendMessageStream(userMsg); // stream allows returning before entire result is written for faster interaction

    // let text = '';
    // for await (const chunk of result.stream) {
    //     const chunkText = chunk.text();
    //     //console.log(chunkText);
    //     text += chunkText;
    // }
    

}

// export async function continueConversation(history) {
//     const stream = createStreamableValue();
//     const model = google('models/gemini-1.5-flash-latest');

//     (async () => {
//         const { textStream } = await streamText({
//             model: model,
//             messages: history,
//         });

//         for await (const text of textStream) {
//             stream.update(text);
//         }
    
//         stream.done();
//     })().then(() => {});

//     return {
//         messages: history,
//         newMessage: stream.value,
//     };
// }
