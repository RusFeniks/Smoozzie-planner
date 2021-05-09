const Helper = require("./helper");
const mysql2 = require("mysql2");
const moment = require("moment");

class NotesManager {
    
    constructor(database) {
        this.database = database;
    }
    
    //** Создание начальных таблиц в базе данных */
    async initTables() {
        
        const InitSQL = Helper.formatSQL(`

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

        try {
            await this.database.query(InitSQL);
        } catch (error) {
            console.log(error.message);
        }
        
        return true;
    }


    //** Получение всех записей из базы данных за указанную дату */
    async getNotesByDate(_date, _user_id) {

        const date = moment(_date);

        let data, error;
        
        if(date.isValid()) {

            const GET_NOTES_SQL = Helper.formatSQL(`
                SELECT * FROM notes
                    WHERE date = '${date.format('yyyy-MM-DD')}' 
                    AND user_id = ${_user_id};
            `);

            try {
                const response = await this.database.query(GET_NOTES_SQL);
                data = response[0];
            } catch (error) {
                error = error.message;
            }
            
        } else {
            error = "Указанная дата - инвалид";
        }

        return [data, error];
    }


    //** Добавление новой записи */
    async addNote(_note, _user_id) {

        const SET_NOTE_SQL = Helper.formatSQL(`
        
        `);

        return [null, "add"];
    }


    //** Изменение существующей записи */
    async setNote(_id, _note, _user_id) {

        const SET_NOTE_SQL = Helper.formatSQL(`
        
        `);

        return [null, "set"];
    }
}

module.exports = NotesManager;

/*  Я знаю что можно было делать:
    module.exports = class NotesManager {  },
    Не знаю, зачем я пишу это отдельно. Мб мне
    так понятнее... не уверен. */