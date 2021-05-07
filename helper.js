class Helper {
    
    /** Функция чистит входящую строку с SQL запросом
     *  от переносов строк, лишних пробелов и т.д. */
    static formatSQL(sqlString) {
        return sqlString.toString().replace(/\s{2,}|\n/g, " ");
    }

}

module.exports = Helper;