require('dotenv').config();
const OpenAI = require("openai");

// make sure the API key is loaded from .env file
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// this function calls OpenAI and gets personalized response for the student
async function generateResponse(habitsData) {
    console.log("Generating response for:", habitsData.user_name);

    try {
        // put together the data inputed by the user
        const {
            user_name,
            sleep_hours,
            credit_hours,
            study_hours,
            exercise_hours,
            screen_time,
            habit_ranking
        } = habitsData;


        const rankings = typeof habit_ranking === 'string'
            ? JSON.parse(habit_ranking)
            : habit_ranking;

        // build the prompt to send to OpenAI
        const prompt =
`I have a student named ${user_name}. They are looking for helpful tips to improve their habits based on the following responses:
- Sleep Hours: ${sleep_hours} hours per night
- They are enrolled with ${credit_hours} credit hours
- Right now they claim to study for ${study_hours} hours per week
- They exercise for ${exercise_hours} hours per week
- Their average screen time is ${screen_time} hours per day
- They ranked the following habits in order of importance to them: ${rankings.join(", ")}

Based on this information, provide 2 brief responses and a list of 5 tips to help them improve their habits. Be sure to
curate a response that is meant for a new college student. Try to make it friendly and approachable, and add a joke`; 

        console.log("Calling OpenAI API...");

        // send request to OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that provides habit improvement tips for college students."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 600,
            temperature: 0.7
        });

        console.log("Got response from OpenAI");

        // return just the text content from the response
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenAI:", error);
        throw error;
    }
}

// export so we can use this in server.js
module.exports = { generateResponse };