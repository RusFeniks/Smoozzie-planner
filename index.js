/*  В общем-то этот способ подключения библиотек пахнет говной.
    В интернете писали что это асинхронно, оптимизировано и вообще круто.
    А на заборе написано что готы не сосут бибу.
    Вообщем-то, я попробовал, почитал сколько там танцев с бубном нужно,
    чтобы оно работало... И передумал)
    Такое будет норм, когда я начну использовать сборщики, вроде Webpack,
    но это будет, когда я доберусь до докера.

import express from 'express';
import mysql from 'mysql'; */

const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const mysql = require('mysql2');
const helper = require('./helper');
const Note = require('./note');


/*  да-да, капитан безопасность палит пароли, теперь кто-то может взломать мой...
    ммм... твитер? не помню, где я ещё юзаю заглушку эту.
    В любом случае, потом надо вынести их куда-нибудь и получать из конфига */
const database = mysql.createPool({
    host: "localhost", port: "3306",
    user: "kasai", password: "225514",
    multipleStatements: true
});

/*  Не до конца понимаю что такое промис, но он позволяет
    адекватно использовать асинхронные функции в работе с бд. */
promiseDatabase = database.promise();

// Тоже на вынос
const db_name = "SMPlanner";
const web_port = 8082;


/*  Вот знаешь, тут мне нужен совет. Я без понятия, куда мне выносить такие штуки
    я не хочу, чтобы серверная часть была огромным полотном кода в один файл,
    но как правильно это вынести и вызвать... есть-же какие-то стандарты?
    или я могу просто юзать import\\require и передавать туда объект database? */

/*
    Есть ваще идея на миллион: создать класс DataBase и при его инициализации
    уже передавать все параметры бд.
    Тут оставить только роутинг (и то, его функции наверное надо вынести тоже)
    Вопрос только в том, как базу данных в функции роутинга передавать?
    Передавать экземпляр класса DataBase? Пахнет тупой реализацией. Его как-то
    надо сделать статичным и глобальным.
*/


/** Инициализация базы данных, создание таблиц, если их нет */
const DATABASE_INITIALIZATION_SQL = helper.formatSQL(`
    CREATE DATABASE IF NOT EXISTS ${db_name};
    USE ${db_name};

    CREATE TABLE IF NOT EXISTS notes (
        id int(11) NOT NULL auto_increment,
        user_id int(11) NOT NULL,   
        date date NOT NULL,
        time time NOT NULL,
        title varchar(255) NOT NULL,  
        message text NOT NULL,
        PRIMARY KEY (id)
    );

    CREATE TABLE IF NOT EXISTS users (
        id int(11) NOT NULL auto_increment,
        email varchar(128) NOT NULL,
        fullname varchar(255) NOT NULL,
        password text NOT NULL,
        PRIMARY KEY (id)
    );
`);

database.query(DATABASE_INITIALIZATION_SQL, (err, response) => {
    err && console.log(err) || console.log("База данных инициализирована");

    /* Инициализация web-сервера */
    const server = new express();
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))

    /*  Получение записей пользователя по дате
        (все эти функции я бы тоже вынес в отдельные файлы... пока лень)
        get
         date - дата в формате yyyy-MM-DD
         userid - числовое id пользователя  
    */
    server.get('/get', async function (req, res) {
        
        /** Ответ сервера, который будет отправлен в формате JSON */
        const answer = {
            /* Ошибки мб стоит отправлять как коды, чтобы клиент сам их
               расшифровывал, как умеет. Но где я эти коды возьму?
               Придумывать у меня мозг лопнет (если только не 001, 002),
               спорить 10 часов на тему 403 или 400 я тоже не хочу.
               Присылать ошибку через http-хедер не вижу смысла т.к. в теории
               мы не знаем, умеет-ли конечное приложение их читать, оно может
               получать тупо json, через третий сервис
               Если делать через коды, то вообще есть варик поменять
               error на status, чтобы в случае успеха, также об этом сообщать */
            error: null,
            data: null
        };
        
        /* Тут должна быть проверка токена пользователя и получение id */
        const user_id = 1;

        const date = moment(req.query.date);
        if(date.isValid()) {

            const GET_NOTES_SQL = helper.formatSQL(`SELECT * FROM notes
                WHERE date = '${date.format('yyyy-MM-DD')}' 
                AND user_id = ${user_id};`);

            try {
                const response = await promiseDatabase.query(GET_NOTES_SQL);
                answer.data = response[0];
            } catch (error) {
                answer.error = error.message;
            }
            
        } else {
            answer.error = "Указанная дата - инвалид";
        }

        // Отправляем собранный ответ
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(answer));
        res.end();
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
    */
    server.post('/set', async function (req, res) {
        
        /** Ответ сервера, который будет отправлен в формате JSON */
        const answer = {
            error: null,
            data: null
        };
        
        /* Тут должна быть проверка токена пользователя и получение id */
        const user_id = 1;

        const data = req.body.note;
        // тут будет замес
        const note = Note();

        // Отправляем собранный ответ
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(answer));
        res.end();
    });

    server.listen(web_port, ()=> {
        console.log(`Сервер запущен по адресу http://localhost:${web_port}`);
    });
});


/*  Если этот комментарий опустится ниже 666-й строки,
    я буду разбивать исходный код по модулям */