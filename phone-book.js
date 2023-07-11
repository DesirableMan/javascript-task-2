"use strict";

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
const phoneBook = new Map();

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name = "", email = "") {
    const isvalidPhone = /^\d{10}$/.test(phone);
    if (!phoneBook.has(phone) && isvalidPhone && name.length > 0) {
        let user = {
            userName: name,
            userEmail: String(email),
        };
        phoneBook.set(phone, user);

        return true;
    }
    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email = "") {
    if (phoneBook.has(phone) && name.length > 0) {
        let user = {
            userName: name,
            userEmail: String(email),
        };
        phoneBook.set(phone, user);

        return true;
    }
    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let search = find(query);
    for (let item of search) {
        let key = item[1]
            .replace(/(\d{3})\) (\d{3})-(\d{2})-(\d{2})/, "$1$2$3$4")
            .substring(4);
        phoneBook.delete(key);
    }
    return search.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (query === "") {
        return;
    }

    let template = query;
    if (query === "*") {
        template = "";
    }

    let sorted = [...phoneBook.entries()]
        .sort((a, b) => (b[1].userName > a[1].userName ? -1 : 1))
        .map((value) => {
            return [
                value[1].userName,
                value[0].replace(
                    /(\d{3})(\d{3})(\d{2})(\d{2})/,
                    "+7 ($1) $2-$3-$4"
                ),
                value[1].userEmail,
            ].filter((item) => item !== undefined);
        });

    return sorted.filter((item) => item.join("").includes(template));
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    let users = csv.split("\n").map(item => {
        let user = item.split(";");

        return [user[1], user[0], user[2]];
    });

    let counter = 0;
    for (let user of users) {
        if (add(...user) || update(...user)) {
            counter++
        }
    }

    return counter;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar,
};
