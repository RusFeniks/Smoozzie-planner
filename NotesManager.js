const Helper = require("./helper");
const mysql2 = require("mysql2");

class NotesManager {
    
    constructor(database) {
        this.database = database;
    }
    
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

        const result = await this.database.query(InitSQL)
            .catch((error) => {
                console.log(error.message);
            });
        
        return true;
    }
}

module.exports = NotesManager;

/*  Я знаю что можно было делать:
    module.exports = class NotesManager {  },
    Не знаю, зачем я пишу это отдельно. Мб мне
    так понятнее... не уверен. */