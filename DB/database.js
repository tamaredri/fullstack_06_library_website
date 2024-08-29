import mysql from "mysql2"

import dotenv from 'dotenv'
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// GET functions
// -- users
export async function getUserByName(UserName){
    const [rows] = await pool.query("SELECT * from users where Name=?;", [UserName]);
    return rows;
}

export async function getSubscribedUserByName(UserName){
    const [rows] = await pool.query(`
        SELECT 
            u.Name,
            u.Password,
            su.Phone,
            su.Address,
            su.Email,
            su.SubscriptionExpiration
        FROM 
            Users u
        LEFT JOIN 
            SubscribedUsers su ON u.Name = su.Name
        WHERE 
            u.Name = ?;
`, [UserName]);
    return rows;
}
    
// -- books
export async function getBooks(){
    const [rows] = await pool.query("SELECT BookID, Title, Author, ImagePath from books;");
    return rows;
}

export async function getBooksById(id){
    const [rows] = await pool.query("SELECT * from books WHERE BookID=?;", [id]);
    return rows;
}

export async function getBookCopiesByID(BookID){
    const [rows] = await pool.query(`
        SELECT 
            bc.CopyID,
            IF(bb.BorrowDate IS NOT NULL AND bb.ReturnDate IS NULL, 'Borrowed', 'Available') AS Status
        FROM 
            BookCopies bc
        LEFT JOIN 
            BorrowedBooks bb ON bc.CopyID = bb.CopyID
        WHERE bc.BookID = ?;`, 
        [BookID]);
    return rows;
}

// -- books and users
export async function getUsersFavoriteBooks(UserName){
    const [rows] = await pool.query(`
        SELECT 
            b.BookID, 
            b.Title,
            b.Author,
            b.ImagePath
        FROM 
            FavoriteBooks fb 
        JOIN 
            Books b ON b.BookID = fb.BookID 
        WHERE 
            fb.Name = ?;`, [UserName]);
    return rows;
}

export async function getUsersBorrowedBooks(UserName){
    const [rows] = await pool.query(`
        SELECT 
            b.BookID,
            b.Title, 
            b.Author,
            b.ImagePath,
            bb.BorrowID,
            bb.BorrowDate 
        FROM 
            BorrowedBooks bb
        JOIN 
            BookCopies bc ON bb.CopyID = bc.CopyID
        JOIN 
            Books b ON bc.BookID = b.BookID
        WHERE 
            bb.Name = ? 
            AND bb.ReturnDate IS NULL;`, [UserName]);
    return rows;
}

export async function getUsersBorrowHistory(UserID){
    const [rows] = await pool.query(`
        SELECT 
            b.BookID,
            b.Title, 
            b.Author, 
            bb.BorrowDate, 
            bb.ReturnDate
        FROM 
            BorrowedBooks bb
        JOIN 
            BookCopies bc ON bb.CopyID = bc.CopyID
        JOIN 
            Books b ON bc.BookID = b.BookID
        WHERE 
            bb.Name = ?
            AND bb.ReturnDate IS NOT NULL;`, [UserID]);
    return rows;
}

// -- quotes
export async function getAllQuotes(){
    const [rows] = await pool.query("SELECT * from quotes;");
    return rows;
}

export async function getAllImages(){
    const [rows] = await pool.query("SELECT * from LibraryImages;");
    return rows;
}


// POST
// -- users
export async function registerNewUser(UserName, password){
    if(await isUserExist(UserName))
        return false;

    await pool.query(
        'INSERT INTO Users (Name, Password) VALUES (?, ?)', 
        [UserName, password]);
    return true;
}

export async function subscribeNewUser(UserName, Phone, Address, Email, subscriptionLength){
    if(await isUserExist(UserName))
        return false;

    await pool.query(
        'INSERT INTO SubscribedUsers (Name, Phone, Address, Email, SubscriptionExpiration) VALUES (?, ?, ?, ?, ?)',
        [UserName, Phone, Address, Email, subscriptionLength]);
    return true;
}

// -- books
export async function addNewBook([Title, Author, Summary, ImagePath]){
    await pool.query('INSERT INTO Books (Title, Author, Summary, ImagePath) VALUES (?, ?, ?, ?)', [Title, Author, Summary, ImagePath]);
}

export async function addNewCopyOfBook(BookID){

}

// -- books and users
export async function addFavoriteBookToUser(UserName){

}

export async function addBorrowedBookToUser(UserName){

}

// -- quotes
export async function addNewQuote(newQuote){
    await pool.query(`
    INSERT INTO Quotes (Quote) 
    VALUES (?);
    `, [newQuote]);
}

export async function addNewImage(newImagePath){
    await pool.query(`
        INSERT INTO LibraryImages (ImagePath) 
        VALUES (?);
        `, [newImagePath]);
}


// UPDATE
// -- users
export async function updateUser(UserName, newPassword) {
    if(!await isUserExist(UserName))
        return false;
    
    await pool.query(
        'UPDATE Users SET Password = ? WHERE Name = ?',
        [newPassword, UserName]
    );
    return true;
}


export async function updateSubscribedUser(UserName, [Phone, Address, Email]){

}

export async function updateSubscriptionExpirationDateOfUser(UserName, subscriptionLength){

}

// -- books
export async function updateBook(BookID, [Title, Author, Summary, ImagePath]){

    await pool.query('INSERT INTO Books (Title, Author, Summary, ImagePath) VALUES (?, ?, ?, ?)', [Title, Author, Summary, ImagePath]);
}


// -- books and users
export async function returnBorrowedBookFromUser(UserName){

}



// DELETE
// -- users
export async function deleteUser(UserName) {
    await pool.query('DELETE FROM FavoriteBooks WHERE Name = ?', [UserName]);
    await pool.query('DELETE FROM BorrowedBooks WHERE Name = ?', [UserName]);
    await pool.query('DELETE FROM SubscribedUsers WHERE Name = ?', [UserName]);
    await pool.query('DELETE FROM Users WHERE Name = ?', [UserName]);

    return true;
}

export async function deleteSubscribedUser(UserName){
    // delete the subscription and the borrowed books, keep the favorites
}

// -- books
export async function deleteBook(BookID, [Title, Author, Summary, ImagePath]){
    // delete the book, it's copies - but first - make sure the book is not already borrowed. 
    // if all its copies are not borrowed - it can be removed, including remobing all the copies and all the borrow history it ever had.
}

export async function deleteCopyOfBook(BookID){
    // delete the copy only if the copy is not borrowed - remove all borrow information if this copy
}

// -- books and users
export async function deleteFavoriteBookFromUser(UserName){

}

// -- quotes
export async function deleteQuote(QouteID){
    await pool.query(`
        DELETE FROM Quotes
        WHERE QuoteID = (?);
        `, [QouteID]);

}

export async function deleteImage(ImageID){
        await pool.query(`
        DELETE FROM LibraryImages
        WHERE ImageID  = (?);
        `, [ImageID]);
}


// general functions
async function isUserExist(UserName){
    const [rows] = await getUserByName(UserName);
    return rows != undefined; // change return value - marks the user doesn't exists
}



await deleteQuote(12);
let books = await getAllQuotes();
console.log(books);


books = await getAllImages();
console.log(books);
