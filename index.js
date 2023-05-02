const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

const bd = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '(@7389494072@)yaduvanshiROSHAN',
    database: 'todo'
});


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    bd.query('SELECT * FROM todo', (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
}
);

app.post('/api/insert', (req, res) => {
    const name = req.body.name;
    const description = req.body.description;

    const sqlInsert = "INSERT INTO todo (name, description) VALUES (?, ?)";
    bd.query(sqlInsert, [name, description], (err, result) => {
        res.send(result);
    }, (err) => {
        res.send(err);
    }
    );
});


app.post('/api/delete', (req, res) => {
    const id = req.body.id;

    const sqlDelete = "DELETE FROM todo WHERE id = ?";
    bd.query(sqlDelete, id, (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    });
});





app.listen(port, () => console.log(`App listening on port ${port}!`));
