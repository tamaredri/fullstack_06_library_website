import mysql from "mysql2"

import dotenv from 'dotenv'
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getUserById(id){
    const [rows] = await pool.query("SELECT * from users where UserID=?;", [id]);
    return rows;
}

export async function getBooks(){
    const [rows] = await pool.query("SELECT * from books;");
    return rows;
}
