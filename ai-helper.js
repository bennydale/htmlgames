
const config = require("./private-config.js");

const API_KEY = config.API_KEY;

// basic node app to handle request:
const http = require('http');
const port = 3000;
const OpenAI = require('openai');
const { parse } = require("path");

const openai = new OpenAI({
    apiKey:API_KEY
});
var express = require('express');
var app = express();
app.use(express.json());

// create express server:
app.post('/getAsciImage', async (req, res) => {    
    const chatCompletion = await getAsciImage(req.body)
    console.log(chatCompletion.choices[0].message.content);
    res.send(chatCompletion);
});
app.get('/', function (req, res) {
    // server up static html file
    res.sendFile(__dirname + '/make-ai.html');
});
app.listen(3000);

const getAsciImage = async (body) => {    
    const msgPromot =  `Please draw a 22x18 ASCII image. Use . for empty space and # for filled pixeles
Return only the asci text and nothing else.
Here is one Example of a 22x22 ASCII image of ${body.sampleImageName} 
${body.sampleImage}

Please now draw ${body.imagePromt}`
    
    console.log(msgPromot);

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ 
            role: "user", 
            content: msgPromot
        }],
        model: "gpt-4-1106-preview",
    });

    return chatCompletion;
}