const express = require('express');
const mysql = require('mysql');

const server = new express();
const db_connection = mysql.createConnection({
    host: "localhost", port: "3306",
    user: "admin", password: "225514"
});

db_connection.connect(err => {
    !err && console.log("Соединение с БД установлено");
    db_connection.end();
});


/*
const tipList = [];
tipList.push(
    { date: new Date("2021-04-28T00:00:00.0003"), list: [
        { id: 1, name: "Тестовая заметка 1", date: new Date(), message: "Съешь французских булок 28.04" },
        { id: 2, name: "Тестовая заметка 2", date: new Date(), message: "Выпей кофе 28.04" }
    ]},
    { date: new Date("2021-04-29T00:00:00.0003"), list: [
        { id: 1, name: "Тестовая заметка 1", date: new Date(), message: "Съешь французских булок 29.04" },
        { id: 2, name: "Тестовая заметка 2", date: new Date(), message: "Выпей кофе 29.04" }
    ]}
)

app.get('/', function (req, res) {
    console.log(req);
  res.json(JSON.stringify(tipList));
});
 
app.listen(port, ()=> {
    console.log(`Сервер запущен по адресу http://localhost:${port}`);
})*/