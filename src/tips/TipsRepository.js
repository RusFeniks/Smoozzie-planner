class TipsRepo {
    
    constructor(database) {
        this.database = database;
    }

    /**
     * Применяет sql запрос к базе данных
     * @param {string} sql запрос
     * @returns результат
     */
    async appendSQL(sql) {
        const response = await this.database.query(sql);
        return response[0];
    }

    /**
     * Получает из базы данных конкретную запись, используя её Id
     * @param {number} tipId id записи 
     * @param {number} userId пользователь, для которого получаем запись 
     * @returns массив, содержащий полученную запись
     */
    async getTipById(tipId, userId) {
        const sql = `SELECT * FROM tips
        WHERE id = ${tipId} 
        AND user_id = ${userId};`;
        
        return this.appendSQL(sql);
    }

    /**
     * Получает из базы данных записи за указанную дату
     * @param {string} date дата
     * @param {number} userId пользователь, для которого получаем записи
     * @return массив записей
     */
    async getTipsByDate(date, userId) {
        const sql = `SELECT * FROM tips
        WHERE date = '${date}'
        AND user_id = ${userId};`;
        
        return this.appendSQL(sql);
    }

    /**
     * Добавляет в базу данных новую запись для указанного пользователя
     * @param {object} tip объект с информацией новой записи
     * @param {number} userId пользователь, для которого добавляем запись
     * @return результат выполнения запроса
     */
    async addTip(tip) {
        const sql = `
            INSERT INTO tips (user_id, date, time, title, message)
            VALUES (
                ${tip.user_id},
                '${tip.date}',
                '${tip.time}',
                '${tip.title}',
                '${tip.message}'
            );`;

        return this.appendSQL(sql);
    }

    /**
     * Обновляет в базе данных запись с указанным id
     * @param {object} tip объект с информацией новой записи
     * @return результат выполнения запроса
     */
    async updateTip(tip) {
        const sql = `UPDATE tips SET
                date = '${tip.date}',
                time = '${tip.time}',
                title = '${tip.title}',
                message = '${tip.message}'
            WHERE id = ${tip.id} AND user_id = ${tip.user_id};`;

        return this.appendSQL(sql);
    }

    /**
     * Удаляет запись из базы
     * @param {number} id id записи
     * @param {number} userId id пользователя
     * @returns результат выполнения запроса
     */
    async deleteTip(id, userId) {
        const sql = `DELETE FROM tips
            WHERE id = ${id} AND user_id = ${userId};`;
        
        return this.appendSQL(sql)
    }

}

module.exports = TipsRepo;