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
            b.ImagePath, 
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

export async function subscribeNewUser(UserName, Phone, Address, Email, SubscriptionLength){
    if(!await isUserExist(UserName))
        return false;

    await pool.query(
        'INSERT INTO SubscribedUsers (Name, Phone, Address, Email, SubscriptionExpiration) VALUES (?, ?, ?, ?, DATE_ADD(CURDATE(), INTERVAL ? MONTH))',
        [UserName, Phone, Address, Email, SubscriptionLength]);
    return true;
}

// -- books
export async function addNewBook({Title, Author, Summary, ImagePath}){
    // Enforce unique book title.
    const [rows] = await pool.query("SELECT * from Books as b WHERE b.Title = ?;", [Title]);
    if(rows.length > 0) return false;

    await pool.query('INSERT INTO Books (Title, Author, Summary, ImagePath) VALUES (?, ?, ?, ?)', [Title, Author,  Summary || null, ImagePath || null]);
    return true;
}

export async function addNewCopyOfBook(BookID){
    const book = await getBooksById(BookID);
    if(book.length == 0) return false;

    await pool.query(`INSERT INTO BookCopies (BookID) VALUES (?);`, [BookID]);
    return true;
}

// -- books and users
export async function addFavoriteBookToUser(UserName, BookID){
    const user = await getUserByName(UserName)
    if(user.length === 0) return false; // user doesnt exist
    const book = await getBooksById(BookID)
    if(book.length === 0) return false; // book doesnt exist

    const [rows] = await pool.query(
        `SELECT 
            COUNT(*) AS count 
        FROM 
            FavoriteBooks 
        WHERE Name = ? AND BookID = ?`,
        [UserName, BookID]);

    if (rows[0].count === 0){ // the book is not in favorite
        await pool.query(
            'INSERT INTO FavoriteBooks (Name, BookID) VALUES (?, ?);',
            [UserName, BookID]
        );
    }
return true;
}

export async function addBorrowedBookToUser(UserName, CopyID){
    const user = await getUserByName(UserName)
    if(user.length === 0) return false; // user doesnt exist
    // check if the copy exists at all
    // const book = await getBookCopiesByID(CopyID)
    // console.log(book);
    // if(book.length === 0) return false; // copy doesnt exist

    // Check if the copy is already borrowed
    const [rows] = await pool.query(`
    SELECT 
        COUNT(*) AS count 
    FROM 
        BorrowedBooks 
    WHERE CopyID = ? AND ReturnDate IS NULL`,
    [CopyID]);

    if (rows[0].count > 0) return false;

    // Insert the borrow record
    await pool.query(
        'INSERT INTO BorrowedBooks (Name, CopyID, BorrowDate) VALUES (?, ?, CURDATE())',
        [UserName, CopyID]
    );
    return true;
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


export async function updateSubscribedUser(UserName, {Phone, Address, Email, SubscriptionLength}){
    let query = 'UPDATE SubscribedUsers SET ';
    const params_list = [];

    if (Phone !== undefined) {
        query += 'Phone = ?, ';
        params_list.push(Phone);
    }
    if (Address !== undefined) {
        query += 'Address = ?, ';
        params_list.push(Address);
    }
    if (Email !== undefined) {
        query += 'Email = ?, ';
        params_list.push(Email);
    }
    if (SubscriptionLength !== undefined) {
        query += 'SubscriptionExpiration = DATE_ADD(CURDATE(), INTERVAL ? MONTH), ';
        params_list.push(SubscriptionLength);
    }
    console.log(query);
    console.log(params_list);

    if (params_list.length > 0){
        query = query.slice(0, -2) + ' WHERE Name = ?';
        params_list.push(UserName);
    
        console.log(query);
        console.log(params_list);
        // Execute the query
        await pool.query(query, params_list);
    } 
}

// -- books
export async function updateBook(BookID, {Title, Author, Summary, ImagePath}){
    const book = await getBooksById(BookID);
    if(book.length == 0) return 0;

    let query = 'UPDATE Books SET ';
    const params_list = [];

    // Add conditions to the query based on provided parameters
    if (Title !== undefined) {
        query += 'Title = ?, ';
        params_list.push(Title);
    }
    if (Author !== undefined) {
        query += 'Author = ?, ';
        params_list.push(Author);
    }
    if (Summary !== undefined) {
        query += 'Summary = ?, ';
        params_list.push(Summary);
    }
    if (ImagePath !== undefined) {
        query += 'ImagePath = ?, ';
        params_list.push(ImagePath);
    }

    query = query.slice(0, -2) + ' WHERE BookID = ?';
    params_list.push(BookID);
    
    await pool.query(query, params_list);
    return true;
}


// -- books and users
export async function returnBorrowedBookFromUser(UserName, CopyID){
    // Check if the borrow record exists and belongs to the specified user
    const [rows] = await pool.query(
        'SELECT * FROM BorrowedBooks WHERE CopyID = ? AND Name = ? AND ReturnDate IS NULL',
        [CopyID, UserName]
    );
    if (rows.length === 0) return false;

    // Update the ReturnDate to the current date
    await pool.query(
        'UPDATE BorrowedBooks SET ReturnDate = CURDATE() WHERE CopyID = ?',
        [CopyID]
    );

}



// DELETE
// -- users
export async function deleteUser(UserName) {
    await deleteSubscribedUser(UserName);
    await pool.query('DELETE FROM Users WHERE Name = ?', [UserName]);
}

export async function deleteSubscribedUser(UserName){
    await pool.query('DELETE FROM FavoriteBooks WHERE Name = ?', [UserName]);
    await pool.query('DELETE FROM BorrowedBooks WHERE Name = ?', [UserName]);
    await pool.query('DELETE FROM SubscribedUsers WHERE Name = ?', [UserName]);
}

// -- books
export async function deleteBook(BookID){
    // delete the book, it's copies - but first - make sure the book is not already borrowed. 
    // if all its copies are not borrowed - it can be removed, including remobing all the copies and all the borrow history it ever had.
    const [borrowed_copies_count] = await pool.query(`
        SELECT 
            COUNT(*) AS count 
        FROM 
            BorrowedBooks 
        INNER JOIN 
            BookCopies ON BorrowedBooks.CopyID = BookCopies.CopyID 
        WHERE 
            BookCopies.BookID = ? AND BorrowedBooks.ReturnDate IS NULL`,
        [BookID]
    );
    if(borrowed_copies_count[0].count > 0) return false;

    await pool.query('DELETE FROM BorrowedBooks WHERE CopyID IN (SELECT CopyID FROM BookCopies WHERE BookID = ?)', [BookID]);
    await pool.query('DELETE FROM BookCopies WHERE BookID = ?', [BookID]);
    await pool.query('DELETE FROM Books WHERE BookID = ?', [BookID]);
    
    return true;
}

export async function deleteCopyOfBook(CopyID){
    // Check if the copy is currently borrowed
    const [borrowedRows] = await pool.query(`
        SELECT 
            COUNT(*) AS isBorrowed
        FROM 
            BorrowedBooks 
        WHERE CopyID = ? AND ReturnDate IS NULL`,
        [CopyID]);

    if (borrowedRows[0].isBorrowed > 0) return false;

    await pool.query('DELETE FROM BorrowedBooks WHERE CopyID = ?', [CopyID]);
    await pool.query('DELETE FROM BookCopies WHERE CopyID = ?', [CopyID]);
    return true;
}

// -- books and users
export async function deleteFavoriteBookFromUser(UserName, BookID){
    await pool.query(
        'DELETE FROM FavoriteBooks WHERE Name = ? AND BookID = ?',
        [UserName, BookID]
    );
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






