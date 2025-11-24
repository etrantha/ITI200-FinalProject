import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPEN_API_KEY });

export async function generateResponse(inputDataResponse) {
    const prompt =
        I have a student named ${user_name}. They are looking for helpful tips to improve thier habits
        based on the following resonses:
        - Sleep Hours: ${sleep_hours} hours per night
        - They are enrolled Credit with ${credit_hours} credit hours
        - Right now they claim to study for ${study_hours} hours per week 
        - They exercise for ${exercise_hours} hours per week
        - Their average screen time is ${screen_time} hours per day
        - They ranked the following habits in order of importance to them: ${habit_ranking.join(", ")}

        Based on this information, provide 2 responses and a list of 5 tips to help them improve their habits. Be sure to 
        curate a response that is meant for a new college student. Try to make it friendly and approachable, add a joke.;

        const response = await client.responses.create({
            model: "gpt-5-nano",
            inputs: prompt
        });

    console.log(response.output_text);
    return response.output_text;
}   