import express from 'express';
import mysql from 'mysql';

const server = express();

/*  да-да, капитан безопасность палит пароли, теперь кто-то может взломать мой...
    ммм... твитер? не помню, где я ещё юзаю заглушку эту. В любом случае, потом надо вынести их куда-нибудь и получать из конфига */
const database = mysql.createPool({
    host: "localhost", port: "3306",
    user: "kasai", password: "225514"
});

// Тоже на вынос
const db_name = "SMPlanner";


/*  Вот знаешь, тут мне нужен совет. Я без понятия, куда мне выносить такие штуки
    я не хочу, чтобы серверная часть была огромным полотном кода в один файл,
    но как правильно это вынести и вызвать... есть-же какие-то стандарты?
    или я могу просто юзать import и передавать туда объект database? */

const DATABASE_INITIALIZATION_SQL = `
    CREATE DATABASE IF NOT EXISTS '${db_name}';
    USE '${db_name}';

    CREATE TABLE IF NOT EXISTS 'notes' (
        'id' int(11) NOT NULL auto_increment,
        'user_id' int(11) NOT NULL,   
        '[date]' date NOT NULL,
        '[time]' time NOT NULL,
        'title' varchar(255) NOT NULL default '',  
        'message' text NOT NULL default '',
        PRIMARY KEY  ('id')
    );

    CREATE TABLE IF NOT EXISTS 'users' (
        'id' int(11) NOT NULL auto_increment,
        'email' varchar(128) NOT NULL,
        'fullname' varchar(255) NOT NULL default '',
        'password' text NOT NULL
        PRIMARY KEY ('id')
    );
`;

database.query(DATABASE_INITIALIZATION_SQL, (err, response) => {
    err && console.log(err);
    response && console.log(response);
    database.end()
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