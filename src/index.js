const dotenv = require('dotenv');
const moment = require('moment');

const express = require('express');
const bodyParser = require('body-parser');

const mysql = require('mysql2');

const TipsRepo = require('./TipsRepo');


// Получаем переменные окружения
dotenv.config();

/**
 * Создает и проверяет соединение с бд. Возвращает промис,
 * содержащий в себе пул соединений с базой данных.
 * @returns mysql.Pool
 */
async function createDBConnection () {

    const dbConnectionsPoolPromise = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        multipleStatements: true
    }).promise();

    return dbConnectionsPoolPromise.query("select 1")
        .then((res) => {
            console.log("Соединение с базой данных установлено");
            return dbConnectionsPoolPromise;
        })
        .catch((error) => {
            console.error(`Ошибка подключения к базе данных: ${error.message}`);
            return null;
        });
}

/**
 * Временная заглушка, тут будет авторизация
 * @returns userId
 */
function getUserIdByToken () {
    return 1;
}

/**
 * Основная исполняемая функция
 */
async function run () {

    // Получаем пулл соединений с БД
    const dbConnectionsPoolPromise = await createDBConnection();
    if(!dbConnectionsPoolPromise) { return; }

    const tipsRepo = new TipsRepo(dbConnectionsPoolPromise);

    // Инициализация web-сервера
    const server = new express();

    // Необходимо для чтения тела запроса 
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    server.get('/tips', async (req, res) => {
        
        res.set('Content-Type', 'application/json');

        const date = moment.utc(req.query.date);
        const userId = getUserIdByToken(req.query.token);

        try {
            
            if(!userId) {
                res.status(401);
                throw new Error("Unauthorized");
            }

            if(!date.isValid()) {
                res.status(400);
                throw new Error("Date is invalid");
            }

            const data = await tipsRepo.getTipsByDate(
                date.format('yyyy-MM-DD'),
                userId
            );

            res.send(JSON.stringify(data));
            
        } catch(error) {
            res.send(JSON.stringify(error.message));
        }

        res.end();
        return;
    });

    server.post('/tips', async (req, res) => {

        res.set('Content-Type', 'application/json');

        const dateTime = moment(req.body.datetime);
        const id = req.body.id;
        const userId = getUserIdByToken(req.query.token);

        try {

            if(!userId) {
                res.status(401);
                throw new Error("Unauthorized");
            }

            if(!dateTime.isValid()) {
                res.status(400);
                throw new Error("DateTime is invalid");
            }

            if(!req.body.title) {
                res.status(400);
                throw new Error("Title is not set");
            }

            const tip = {
                date: dateTime.format('yyyy-MM-DD'),
                time: dateTime.format('HH:mm:ss'),
                title: req.body.title,
                message: req.body.message
            }

            const result = id ? await tipsRepo.updateTip(id, tip, userId)
                : await tipsRepo.addTip(tip, userId);

            res.send(JSON.stringify(result));

        } catch(error) {
            res.send(JSON.stringify(error.message));
        }

        res.end();
        return;
    });

    const web_port = process.env.WEB_PORT;
    server.listen(web_port, ()=> {
        console.log(`Сервер запущен по адресу http://localhost:${web_port}`);
    });

}

return run();