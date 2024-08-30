import mysql from "mysql2"

import dotenv from 'dotenv'
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// GET functions
// -- users
export async function getUserByName(Name){
    const [rows] = await pool.query("SELECT * from users where Name=?;", [Name]);
    return rows[0];
}

export async function getSubscribedUserByName(Name){
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
        INNER JOIN 
            SubscribedUsers su ON u.Name = su.Name
        WHERE 
            u.Name = ?;
`, [Name]);
    return rows[0];
}
    
// -- books
export async function getBooks(){
    const [rows] = await pool.query("SELECT BookID, Title, Author, ImagePath from books;");
    return rows;
}

export async function getBookById(id){
    const [rows] = await pool.query("SELECT * from books WHERE BookID=?;", [id]);
    return rows[0];
}

export async function getBookByTitle(title){
    const [rows] = await pool.query("SELECT * from books WHERE Title=?;", [title]);
    return rows[0];
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

export async function getSingleBookCopyByID(CopyID){
    const [rows] = await pool.query(`
        SELECT 
            bc.CopyID,
            IF(bb.BorrowDate IS NOT NULL AND bb.ReturnDate IS NULL, 'Borrowed', 'Available') AS Status
        FROM 
            BookCopies bc
        LEFT JOIN 
            BorrowedBooks bb ON bc.CopyID = bb.CopyID
        WHERE bc.CopyID = ?;`, 
        [CopyID]);
    return rows[0];
}

// -- books and users
export async function getUsersFavoriteBooks(Name){
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
            fb.Name = ?;`, [Name]);
    return rows;
}

export async function getUsersBorrowedBooks(Name){
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
            AND bb.ReturnDate IS NULL;`, [Name]);
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
export async function registerNewUser({Name, Password}){
    await pool.query(
        'INSERT INTO Users (Name, Password) VALUES (?, ?)', 
        [Name, Password]);
    return {Name, Password};
}

export async function subscribeNewUser({Name, Phone, Address, Email, SubscriptionExpiration}){
    await pool.query(
        'INSERT INTO SubscribedUsers (Name, Phone, Address, Email, SubscriptionExpiration) VALUES (?, ?, ?, ?, ?)',
        [Name, Phone, Address, Email, new Date(SubscriptionExpiration)]);
}

// -- books
export async function addNewBook({Title, Author, Summary, ImagePath}){
    const [result] = await pool.query('INSERT INTO Books (Title, Author, Summary, ImagePath) VALUES (?, ?, ?, ?)', [Title, Author,  Summary || null, ImagePath || null]);
    return result.insertId;
}

export async function addNewCopyOfBook(BookID){
    const [result] = await pool.query(`INSERT INTO BookCopies (BookID) VALUES (?);`, [BookID]);
    return result.insertId;
}

// -- books and users
export async function addFavoriteBookToUser(UserName, BookID){
    await pool.query(
        'INSERT INTO FavoriteBooks (Name, BookID) VALUES (?, ?);',
        [UserName, BookID]
    );
    return { Name: UserName, BookID};
}

export async function addBorrowedBookToUser({ Name, CopyID }){

    // Insert the borrow record
    await pool.query(
        'INSERT INTO BorrowedBooks (Name, CopyID, BorrowDate) VALUES (?, ?, CURDATE())',
        [Name, CopyID]
    );
    return { Name, CopyID };
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


// PUT
// -- users
export async function updateUser({Name, Password}) {
    
    await pool.query(
        'UPDATE Users SET Password = ? WHERE Name = ?',
        [Password, Name]
    );
    return {Name, Password};
}


export async function updateSubscribedUser({Name, Phone, Address, Email, SubscriptionExpiration}){
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
    if (SubscriptionExpiration !== undefined) {
        query += 'SubscriptionExpiration = ?, ';
        params_list.push(new Date(SubscriptionExpiration));
    }

    if (params_list.length > 0){
        query = query.slice(0, -2) + ' WHERE Name = ?';
        params_list.push(Name);
    
        await pool.query(query, params_list);
    } 
    return {Name, Phone, Address, Email, SubscriptionExpiration};
}

// -- books
export async function updateBook({BookID, Title, Author, Summary, ImagePath}){
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
    console.log(query);
    console.log(params_list);
    return {BookID, Title, Author, Summary, ImagePath};
}


// -- books and users
export async function returnBorrowedBookFromUser(borrowID){
    await pool.query(
        'UPDATE BorrowedBooks SET ReturnDate = CURDATE() WHERE BorrowID = ?',
        [borrowID]
    );

}



// DELETE
// -- users
export async function deleteUser(UserName) {
    await deleteSubscribedUser(UserName);
    await pool.query('DELETE FROM FavoriteBooks WHERE Name = ?', [UserName]);
    await pool.query('DELETE FROM Users WHERE Name = ?', [UserName]);
}

export async function deleteSubscribedUser(UserName){
    await pool.query('DELETE FROM BorrowedBooks WHERE Name = ?', [UserName]);
    await pool.query('DELETE FROM SubscribedUsers WHERE Name = ?', [UserName]);
}

// -- books
export async function deleteBook(BookID){
    await pool.query('DELETE FROM FavoriteBooks WHERE BookID = ?', [BookID]);
    await pool.query('DELETE FROM BorrowedBooks WHERE CopyID IN (SELECT CopyID FROM BookCopies WHERE BookID = ?)', [BookID]);
    await pool.query('DELETE FROM BookCopies WHERE BookID = ?', [BookID]);
    await pool.query('DELETE FROM Books WHERE BookID = ?', [BookID]);
}

export async function deleteCopyOfBook(CopyID){
    await pool.query('DELETE FROM BorrowedBooks WHERE CopyID = ?', [CopyID]);
    await pool.query('DELETE FROM BookCopies WHERE CopyID = ?', [CopyID]);
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
