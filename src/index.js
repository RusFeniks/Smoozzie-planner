const dotenv = require('dotenv');
const moment = require('moment');

const express = require('express');
const bodyParser = require('body-parser');

const mysql = require('mysql2');

const TipsRepo = require('./tips/TipsRepository');

const { getTipById, getTipsByDate } = require('./tips/HandlerGetTips');
const addTip = require('./tips/HandlerAddTip');
const updateTip = require('./tips/HandlerUpdateTip');
const deleteTip = require('./tips/HandlerDeleteTip');

const getUserIdByToken = require('./GetUserIdByToken');


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
 * Основная исполняемая функция
 */
async function run () {

    // Получаем пулл соединений с БД
    const dbConnectionsPoolPromise = await createDBConnection();
    if(!dbConnectionsPoolPromise) { return; }

    // Инициализируем репозиторий
    const tipsRepo = new TipsRepo(dbConnectionsPoolPromise);

    // Инициализация web-сервера
    const server = new express();

    // Необходимо для чтения тела запроса 
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    const token = "123abc";

    server.get('/tips', getTipsByDate(tipsRepo, getUserIdByToken(token)));
    server.get('/tips/:id', getTipById(tipsRepo, getUserIdByToken(token)));

    server.put('/tips/:id', updateTip(tipsRepo, getUserIdByToken(token)));
    server.delete('/tips/:id', deleteTip(tipsRepo, getUserIdByToken(token)));

    server.post('/tips', addTip(tipsRepo, getUserIdByToken(token)));

    const web_port = process.env.WEB_PORT || 8080;
    server.listen(web_port, ()=> {
        console.log(`Сервер запущен по адресу http://localhost:${web_port}`);
    });

}

return run();