/*  В общем-то этот способ подключения библиотек пахнет говной.
    В интернете писали что это асинхронно, оптимизировано и вообще круто.
    А на заборе написано что готы не сосут бибу.
    Вообщем-то, я попробовал, почитал сколько там танцев с бубном нужно,
    чтобы оно работало... И передумал)
    Такое будет норм, когда я начну использовать сборщики, вроде Webpack,
    но это вряд-ли будет нужно.

import express from 'express';
import mysql from 'mysql'; */

const express = require('express');
const bodyParser = require('body-parser');

//const moment = require('moment');

const mysql = require('mysql2');
const fs = require("fs");

const Helper = require('./helper');
const NotesManager = require('./NotesManager');



const config = JSON.parse(fs.readFileSync("config.json"));

/* Переменная разрешает производить несколько SQL операций за один запрос.
   Где-то прочитал, что это потанцевальная дыра в безопасности, но мне норм */
config.database.multipleStatements = true;

const database = mysql.createPool(config.database);

/** Пулл соединений преобразованный в промис
 *  для удобства выполнения асинхронных операций */
const promiseDatabase = database.promise();


/*  Со следующим кодом мне нужен совет. Есть варианты как-то разбить его.
    
    Для начала, SQL можно вынести в отдельные файлы и подгружать их через fs.
    Но тогда появляется проблема, я не смогу так удобно использовать ${}
    Придётся писать какую-то функцию, вроде string.format.

    Также есть вариант: вынести всю работу с бд в отдельный класс, например:
    NotesManager, который будет получать\\изменять записи в бд.
    В коде index.js останется только роутинг веб-сервера и вызовы функций
    менеджера записей.
*/


/** Инициализация базы данных, создание таблиц, если их нет */

const DATABASE_INITIALIZATION_SQL = Helper.formatSQL(`
    CREATE DATABASE IF NOT EXISTS ${config.database_name};
    USE ${config.database_name};
`);

/*  Пробуем подключиться к базе данных, проверяем и, в случае отсутсвтия,
    создаем структуру таблиц. */
promiseDatabase.query(DATABASE_INITIALIZATION_SQL)
    .then(async response => {
        console.log("База данных инициализирована");

        const notesManager = new NotesManager(promiseDatabase);
        await notesManager.initTables();

        /* Инициализация web-сервера */
        const server = new express();
        /*  Почему-то у меня в VSCode bodyParser отмечен как устаревший..
            Это действительно так, вот только речь идёт о bodyParser'e
            из библиотеки express. Но я то подключаю его отдельной либой! */
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: true }));

        server.get('/auth', async (req, res) => {

        })

        server.get('/get', async (req, res) => {
            
            /** Ответ сервера, который будет отправлен в формате JSON */
            const answer = {
                error: null,
                data: null
            };

            const user_id = getUserIdByToken(req.query.token);

            [answer.data, answer.error] = await notesManager.getNotesByDate(
                req.query.date, user_id);

            // Отправляем собранный ответ
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(answer));
            res.end();

        });

        server.post('/set', async (req, res) => {
            
            /** Ответ сервера, который будет отправлен в формате JSON */
            const answer = {
                error: null,
                data: null
            };

            const user_id = getUserIdByToken(req.body.toker);

            if (req.body.id) {
                [answer.data, answer.error] = await notesManager.setNote(
                    req.body.id, req.body.note, user_id);
            } else {
                [answer.data, answer.error] = await notesManager.addNote(
                    req.body.note, user_id);
            }

            // Отправляем собранный ответ
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(answer));
            res.end();

        })

        server.listen(config.web_port, ()=> {
            console.log(`
                Сервер запущен по адресу http://localhost:${config.web_port}`);
        });

    })
    .catch(error => {
        console.log(`Ошибка инициализации базы данных: ${error.message}`);
        return;
    });

function getUserIdByToken() {
    return 1;
}

    
/*
    /*  Получение записей пользователя по дате
        (все эти функции я бы тоже вынес в отдельные файлы... пока лень)
        get
         date - дата в формате yyyy-MM-DD
         userid - числовое id пользователя  

    server.get('/get', async function (req, res) {
        
        
        
        
        /* Тут должна быть проверка токена пользователя и получение id *
        const user_id = 1;

        

        
    });


    /*  Добавление новой, либо изменение существующей записи.
        set
         входящие данные - json со структурой:
          {
              token: "...",
              note: {
                  id:
                  date:
                  time:
                  title:
                  message:
              }
          }
         если id не существует в бд, будет добавлена новая запись, иначе
         отредактирована старая
    *
    server.post('/set', async function (req, res) {
        
        /** Ответ сервера, который будет отправлен в формате JSON *
        const answer = {
            error: null,
            data: null
        };
        
        /* Тут должна быть проверка токена пользователя и получение id *
        const user_id = 1;

        const data = req.body.note;
        // тут будет замес
        const note = Note();

        // Отправляем собранный ответ
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(answer));
        res.end();
    });
*/


/*  Если этот комментарий опустится ниже 666-й строки,
    я буду разбивать исходный код по модулям */