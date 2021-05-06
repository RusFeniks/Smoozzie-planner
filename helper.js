module.exports = class Helper {
    static formatSQL(sqlString) {
        return sqlString.toString().replace(/\s{2,}|\n/g, " ");
    }
}