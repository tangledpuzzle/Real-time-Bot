import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

async function generateCompletion(prompt) {
  try {
    const apiUrl = 'https://api.openai.com/v1/completions';
    const response = await axios.post(apiUrl, {
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.5,
      model: 'text-davinci-002'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const completion = response.data.choices[0].text;
    return completion;

  } catch (error) {
    console.error(error);
  }
}
export const chatCompletion = async (req, res) => {

  const openAIConfig = new Configuration({
    apiKey: process.env.OPENAI_KEY
  });

  // console.log(openAIConfig)
  const openapi = new OpenAIApi(openAIConfig);

  const { prompt } = req.body;

  try {
    const ASSISTANT = { "role": "system", "content": "How You can help me ?" };
    // console.log(openapi)
    const response = await openapi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are a python developer especially specialized to radar chart.` },
        {
          role: "assistant",
          content: "python code",
        },
        { role: "user", content: prompt },
      ]

      // messages: [
      //     ASSISTANT,
      //     ...prompt
      // ]
    });
    // console.log(response)
    var resp =response.data.choices[0].message.content ;
    
    

    
  try {
    
    console.log("sent to open AI:", process.env.OPENAI_KEY);

    const answer = await openapi.createCompletion({
      model: "text-davinci-003",
      //prompt: `Extract JSON data from the following input:\n\n${prompt}\n\nJSON extraction code`,
	//prompt:`input is ${prompt},Return only a JSON response with a list of all the variables in the input and their values. The variables will be the key and the values the JSON values.`,
      //prompt : `input is ${prompt},Return only a JSON response with a list of all the variables as a value and their mean as a key with tree structure more deeply.`,

prompt:`Extract information in JSON format. Here are some examples. Q: if it's raining tomorrow, bring an umbrella, if it's sunny bring sunglasses. A: {
	"datetime" : "tomorrow",
	"weather" : [
			{
				"condition" : " raining",
				"action" : "bring",
				"item" : "umbrella" 
			},
			{
				"condition" : " sunny",
				"action" : "bring",
				"item" : "sunglasses" 
			}

		]
}
.
Q: when u give me the actual poke, then I will eat rice. A :

{
	"condition" : {"action" : "give", "item" : "actual poke"},
	"action" : "eat rice"
}
.
Q: ${prompt}
A:`,
      temperature: 0.5,
      max_tokens: 100
    });
    const text = answer.data.choices[0].text;
    console.log(text,"123123113");
    res.status(200).json({ response : resp + "\n\n\n\n\n\n\n\n JSON: \n" + text });
  } catch (err) {
    console.log("--------")
    res.status(500).json({
      message: "\n please provide more info if you want to get json from your input"
    });
  }










    // res.status(200).json({ response: response.data.choices[0].message.content });
  } catch (e) {
    console.log({ e });
  }



  // const { prompt } = req.body;
  // generateCompletion(prompt).then((completion) => {
  //   console.log(completion);
  //   res.status(200).json({ completion });
  // });


};







