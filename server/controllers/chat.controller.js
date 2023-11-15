import { Configuration, OpenAIApi } from "openai";
import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import dotenv from "dotenv";
import Replicate from "replicate";
import fetch from "cross-fetch";
dotenv.config({path: './../../env'})
const replicate = new Replicate({
  auth: process.env.Rep_key
});
export const text2image = async(req, res) => {
  const model = "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4";
  const input = { prompt: "calgary alberta in canada" };
  const output = await replicate.run(model, { input });
  console.log(output);
}
export const image2text = async(req, res) => {
  const model = "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746";
const input = { image: 'https://replicate.delivery/pbxt/HyuP0vcFyOrRLREINKQ7ccveAfVHvv8R0M2V0hsD3wsRo9RRA/out-0.png' };
const output = await replicate.run(model, { input });
console.log(output);
}
export const text2video = async(req, res) => {
 
  const model = "cjwbw/damo-text-to-video:1e205ea73084bd17a0a3b43396e49ba0d6bc2e754e9283b2df49fad2dcf95755";
  const input = { prompt: "octopus and rabbit" };
  const output = await replicate.run(model, { input });
  console.log(output);

}

export const video2text = async(req, res) => {
 
  const replicate = new Replicate({
    auth: process.env.Rep_key,
    fetch: fetch
  });
  
}



// import fs from "fs";
const filePath = 'data.txt';
const openAIConfig = new Configuration({
  apiKey:process.env.OPENAI_KEY
  // apiKey: process.env.OPENAI_KEY
});
const openapi = new OpenAIApi(openAIConfig);

export const chatCompletion = async (req, res) => {
  {
    
    const inp = req.body.prompt;
    const type = req.body.Type;
    if(type == "Chat"){
      const model = new OpenAI({ openAIApiKey: process.env.OPENAI_KEY, model: "gpt-4-0314" });
      const tools = [new SerpAPI(process.env.SERPAPI_API_KEY), new Calculator()];
      const executor = await initializeAgentExecutorWithOptions(
        tools,
        model,
        { agentType: "zero-shot-react-description", verbose: true}
      );
      console.log("Loaded agent.");
      console.log("--------", inp);
      // " numer  US unemployment rate from  1998 to 2022";
      console.log(`Executing with input "${inp}"...`);
      //Run the agent
      const input = inp;
      const result = await executor.call({ input });
      console.log(`Got output ${result.output}`);
      var data = result.output;
      // res.status(200).json({ response: data });
      res.status(200).json({ response : data, type : "Chat"});
  
  
    console.log("--------------------------------------------------------------------");
  
  
  
    {
      const answer = await openapi.createCompletion({
        model: "text-davinci-003",
        //prompt : '{"prompt": '+prompt+', "format": "json"}'
        // messages: [
        //   { role: "system", content: `You are a python developer.` },
        //   {
        //     role: "assistant",
        //     content: "python code",
        //   },
        //   { role: "user", content: data },
        // ]
  
        prompt:
          // `Your input text goes here.:\n\n${prompt}\n\n Please provide all necessary details and include any specific keywords related to the data you want to extract to json format.`
          // `input is ${data},turn it into  only a JSON response with a list of all the variables and their mean and return it.`
          `Extract JSON data from the following input:\n\n${data}\n\nJSON extraction code,for example`
          + `input is  "if it's raining tomorrow, bring an umbrella, if it's sunny bring sunglasses."
            
                  output is
            
                  {
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
                  also input is "bob's height is 12 when he is 13,13 when he is 14,14 when he is 15" then output is {"name" : "bob" , "height" :[{"age":12,"amount":13},{"age":13,"amount":14},{"age":14,"amount":15}]}
                  also input is  "distance from US if I am in canada or france",then 
                  output is  {
                    "condition": "distance",
                    "from": "US",
                    "destinations": [
                      {
                        "country": "Canada",
                        "km": 2261.43,
                        "miles": 1405.19
                      },
                      {
                        "country": "France",
                        "km": 7685,
                        "miles": 4775
                      }
                    ]
                  }
                  `
        ,
  
        temperature: 0.5,
        max_tokens: 1000
      });
      const text = answer.data.choices[0].text;
      console.log(text, "123123113");
      // res.status(200).json({ response: text });
    }
    // var data = req.body.prompt;
    // data = 'input1 : black , output1: white,input2: front , output2:back,input3:circle,output3:?';
    
    }
    if(type == "Text to image"){
      console.log("fwefwe")
      const model = "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4";
      const input = { prompt: inp };
      const data = await replicate.run(model, { input });
      console.log(data);
      res.status(200).json({ response : data[0], type : "Image"});
    }

    if(type == "Image to text"){
      const model = "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746";
      const input = { image: inp };
      const data = await replicate.run(model, { input });
      res.status(200).json({ response : data, type : "Chat"});
    }
    if(type == "Text to video"){
      const model = "cjwbw/damo-text-to-video:1e205ea73084bd17a0a3b43396e49ba0d6bc2e754e9283b2df49fad2dcf95755";
      const input = { prompt: inp };
      const data = await replicate.run(model, { input });
      res.status(200).json({ response : data, type : "Video"});
    }

  };
  

}

// async function decoder(data){
//   const answer = await openapi.createCompletion({
//     model: "text-davinci-003",
//     //prompt : '{"prompt": '+prompt+', "format": "json"}'

//     prompt:
//       // `Your input text goes here.:\n\n${prompt}\n\n Please provide all necessary details and include any specific keywords related to the data you want to extract to json format.`
//       // `input is ${data},turn it into  only a JSON response with a list of all the variables and their mean and return it.`
//       `Extract plain text data from the following JSON input:\n\n${data}\n\n for example`
//       + 
//       `
//       input is
        
//               {
//                 "datetime" : "tomorrow",
//                 "weather" : [
//                     {
//                       "condition" : " raining",
//                       "action" : "bring",
//                       "item" : "umbrella" 
//                     },
//                     {
//                       "condition" : " sunny",
//                       "action" : "bring",
//                       "item" : "sunglasses" 
//                     }
              
//                   ]
//               },
//       output  is  "if it's raining tomorrow, bring an umbrella, if it's sunny bring sunglasses."
        
              
//               also input  is {"name" : "bob" , "height" :[{"age":12,"amount":13},{"age":13,"amount":14},{"age":14,"amount":15}]}  then output is  "bob's height is 12 when he is 13,13 when he is 14,14 when he is 15",
//               also input is {
//                 "condition": "distance",
//                 "from": "US",
//                 "destinations": [
//                   {
//                     "country": "Canada",
//                     "km": 2261.43,
//                     "miles": 1405.19
//                   },
//                   {
//                     "country": "France",
//                     "km": 7685,
//                     "miles": 4775
//                   }
//                 ]
//               } ,then 
//               output is  "distance from US if I am in canada or france".
//               `
//     ,
//     // 'for example if input is single word, then {word:input data} , like this way, if input is bring the door, then output is {action:bring,item:door},and this is only simple example. if input is complex then output have to implement above confition.',
//     temperature: 0.5,
//     max_tokens: 1000
//   });
//   const text = answer.data.choices[0].text;
//   console.log(text, "123123113");
//   return text;
// }


// async function encoder(data){
//   const answer = await openapi.createCompletion({
//     model: "text-davinci-003",
//     //prompt : '{"prompt": '+prompt+', "format": "json"}'

//     prompt:
//       // `Your input text goes here.:\n\n${prompt}\n\n Please provide all necessary details and include any specific keywords related to the data you want to extract to json format.`
//       // `input is ${data},turn it into  only a JSON response with a list of all the variables and their mean and return it.`
//       `Extract JSON data from the following input:\n\n${data}\n\nJSON extraction code,for example`
//       + `input is  "if it's raining tomorrow, bring an umbrella, if it's sunny bring sunglasses."
        
//               output is
        
//               {
//                 "datetime" : "tomorrow",
//                 "weather" : [
//                     {
//                       "condition" : " raining",
//                       "action" : "bring",
//                       "item" : "umbrella" 
//                     },
//                     {
//                       "condition" : " sunny",
//                       "action" : "bring",
//                       "item" : "sunglasses" 
//                     }
              
//                   ]
//               }
//               also input is "bob's height is 12 when he is 13,13 when he is 14,14 when he is 15" then output is {"name" : "bob" , "height" :[{"age":12,"amount":13},{"age":13,"amount":14},{"age":14,"amount":15}]}
//               also input is  "distance from US if I am in canada or france",then 
//               output is  {
//                 "condition": "distance",
//                 "from": "US",
//                 "destinations": [
//                   {
//                     "country": "Canada",
//                     "km": 2261.43,
//                     "miles": 1405.19
//                   },
//                   {
//                     "country": "France",
//                     "km": 7685,
//                     "miles": 4775
//                   }
//                 ]
//               }
//               `
//     ,
//     // 'for example if input is single word, then {word:input data} , like this way, if input is bring the door, then output is {action:bring,item:door},and this is only simple example. if input is complex then output have to implement above confition.',
//     temperature: 0.5,
//     max_tokens: 1000
//   });
//   const text = answer.data.choices[0].text;
//   console.log(text, "123123113");
//   return text;
  
  
// }