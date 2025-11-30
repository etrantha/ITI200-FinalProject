require('dotenv').config();
const express = require("express");
const Pool = require('pg').Pool;
const bodyParser = require("body-parser");
const { generateResponse } = require("./openaiService");

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

// connect to database
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password:'postgres',
    port: 5432,
});

app.get("/api/viewGoals", (req, res) => {

    // retrieve goals from database based on userid


    const userID = 1; // change this later!!


    const sql = "SELECT * FROM goals WHERE user_id = $1";

    pool.query(sql, [userID], (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
    });
});

app.post("/api/viewGoals/save", (req, res) => {

    
    // get userID
    const userID = 1; // change this later because it is hardcoded


    // check for goals, can be null meaning there isn't anything there
    const dailyGoal = req.body.dailyGoals || null;
    const shortGoal = req.body.shortTermGoals || null;
    const longGoal = req.body.longTermGoals || null;

    // check if everything is empty (in this case they can't put anything into database)
    if (dailyGoal === "" && shortGoal === "" && longGoal === ""){
        res.status(500).send("invalid");
    };

    // send stuff to database
    const SQL = "INSERT INTO goals (user_id, dailyGoal, shortGoal, longGoal) VALUES($1, $2, $3, $4);";

    const data = [userID, dailyGoal, shortGoal, longGoal];

    pool.query(SQL, data, (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
    });
});

app.delete("/api/viewGoals/delete/:id", (req, res) => {
    // get id from request
    const id = req.params.id;

    // delete from database
    const SQL = "DELETE FROM goals WHERE id = $1";

    pool.query(SQL, [id], (error, results) => {
        if (error) throw error;
        res.status(200).send("Goal deleted");
    });
});

// route to save habits data to database
app.post("/api/habits", async (req, res) => {
    try {
        // get all the form data from request body
        const {
            user_name,
            sleep_hours,
            credit_hours,
            study_hours,
            exercise_hours,
            screen_time,
            habit_ranking
        } = req.body;

        // insert into habits table
        const result = await pool.query(
            `INSERT INTO habits
            (user_name, sleep_hours, credit_hours, study_hours, exercise_hours,
             screen_time, habit_ranking)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                user_name,
                parseInt(sleep_hours, 10),
                parseInt(credit_hours, 10),
                parseInt(study_hours, 10),
                parseInt(exercise_hours, 10),
                parseInt(screen_time, 10),
                JSON.stringify(habit_ranking) // convert array to string for database
            ]
        );

        // send back success message with the new record id
        return res.json({ status: "success", id: result.rows[0].id });
    } catch (error) {
        console.error("Error saving data to habits:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// route to get OpenAI analysis of habits
app.post("/api/habits/analyze", async (req, res) => {
    console.log("Got request for AI analysis");
    try {
        const habitsData = req.body;

        // make sure we have the data we need
        if (!habitsData.user_name || !habitsData.sleep_hours) {
            return res.status(400).json({
                error: "Missing required habit data"
            });
        }

        console.log("Generating AI tips for:", habitsData.user_name);

        // call the OpenAI function from openaiService.js
        const advice = await generateResponse(habitsData);

        console.log("Got response from OpenAI, sending to frontend");

        // send the AI tips back to frontend
        res.json({
            success: true,
            tips: advice,
            user_name: habitsData.user_name
        });

    } catch (error) {
        console.error("Error in /api/habits/analyze:", error);
        res.status(500).json({
            error: "Could not generate personalized advice. Please try again."
        });
    }
});

// start the server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});