import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import pool from './db.js';

const app = express();

dotenv.config();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;


//View tasks

app.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM todo ORDER BY id');
        res.status(200).json(data.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


//Insert tasks

app.post('/', async (req, res) => {
    try {
        const { task } = req.body;
        const postTask = await pool.query('INSERT INTO todo (task) VALUES ($1) ORDER BY id', [task]);
        res.status(200).json({task: task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


//Search tasks

app.post('/search', async (req, res) => {
    try {
        const { task } = req.body;
        const searchTask = await pool.query('SELECT * FROM todo WHERE task = $1', [task]);
        if (searchTask.rows.length > 0) {
            res.status(200).json(searchTask.rows);
        }
        else{
            res.status(404).json({ message: 'Task not found' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


//Change status of tasks

app.put('/', async (req, res) => {
    try {
        const { id } = req.body;
        const status = 'completed';
        const updateStatus = await pool.query('UPDATE todo SET status = $1 WHERE id = $2', [status, id]);
        res.status(200).json({ id: id, status: status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


//Delete tasks

app.delete('/', async (req, res) => {
    try {
        const { id } = req.body;
        const deleteTask = await pool.query('DELETE FROM todo WHERE id = $1', [id]);
        res.status(200).json({ id: id, message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
