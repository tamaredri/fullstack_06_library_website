import * as db from '../DB/database.js';
import * as validate from './validation.js'
import express from 'express';
const app = express();
app.use(express.json());

// GET
app.get('/', async(req, res) => {
    res.send('data'); // send the images and the quotes
});

// -- users
app.get('/library/users/:userName', async(req, res) => {
    const userName = req.params.userName;
    const user = await db.getUserByName(userName);
    if(!user){
        res.status(404).send("The user doesn't exist");
        return;
    }
    res.send(user);
});

app.get('/library/subscribedUsers/:userName', async(req, res) => {
    const userName = req.params.userName;
    const subscribedUser = await db.getSubscribedUserByName(userName);
    if(!subscribedUser){
        res.status(404).send("The user is not subscribed");
        return;
    }
    res.send(subscribedUser);
});

// -- books
app.get('/library/books', async(req, res) => {
    const books = await db.getBooks();
    res.send(books);
    //with query
});

app.get('/library/books/:bookid', async(req, res) => {
    const bookid = req.params.bookid;
    const book = await db.getBookById(bookid);
    if(!book){
        res.status(404).send("The book doesn't exist");
        return;
    }
    res.send(book);
});

app.get('/library/bookCopies/:bookid', async(req, res) => {
    const bookid = req.params.bookid;
    const book = await db.getBookById(bookid);
    if(!book){
        res.status(404).send("The book doesn't exist"); 
        return;
    }
    const bookCopies = await db.getBookCopiesByID(bookid);
    res.send(bookCopies);
});

// -- books and users
app.get('/library/favoriteBooks/:userName', async(req, res) => {
    const userName = req.params.userName;
    const user = await db.getUserByName(userName);
    if(!user){
        res.status(404).send("The user doesn't exist");
        return;
    }
    const favoriteBooks = await db.getUsersFavoriteBooks(userName);
    res.send(favoriteBooks);
});

app.get('/library/borrowedBooks/:userName', async(req, res) => {
    const userName = req.params.userName;
    const subscribedUser = await db.getSubscribedUserByName(userName);
    if(!subscribedUser){
        res.status(404).send("The user is not subscribed");
        return;
    }
    const borrowesBooks = await db.getUsersBorrowedBooks(userName);
    res.send(borrowesBooks);
}); 

app.get('/library/borrowedBooksHistory/:userName', async(req, res) => {
    const userName = req.params.userName;
    const subscribedUser = await db.getSubscribedUserByName(userName);
    if(!subscribedUser){
        res.status(404).send("The user is not subscribed");
        return;   
    }
    const borrowesBooks = await db.getUsersBorrowHistory(userName);
    res.send(borrowesBooks); 
});

// -- quotes
app.get('/library/quotes', async(req, res) => {
    const quotes = await db.getAllQuotes();
    res.send(quotes);
});

// -- images
app.get('/library/images', async(req, res) => {
    const images = await db.getAllImages();
    res.send(images);
});

// POST

// -- users
app.post('/library/users', async(req, res) => {
    // 1.
    const userName = req.body.UserName;
    const user = await db.getUserByName(userName);
    if (user){
        res.status(400).send("The user already exist");
        return;
    }

    // 2.
    const result = validate.validateUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    // 3.
    const newUser = await db.registerNewUser(req.body);
    res.status(201).send(newUser);
})

app.post('/library/subscribedUsers', async(req, res) => {
    // 1.
    const userName = req.body.Name;
    const user = await db.getUserByName(userName);
    if (!user) {
        res.status(400).send("The user must be register");
        return;
    }

    const subscribedUser = await db.getSubscribedUserByName(userName);
    if(subscribedUser) {
        res.status(400).send("The user already subscribed");
        return;
    }

    // 2.
    const result = validate.validateSubscribedUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // 3.
    await db.subscribeNewUser(req.body);
    const newSubscribedUser = await db.getSubscribedUserByName(userName);
    res.status(201).send(newSubscribedUser);
});


// -- books

app.post('/library/books', async(req, res) => {
    const bookTitle = req.body.Title;
    const book = await db.getBookByTitle(bookTitle);
    if (book) {
        res.status(400).send("The book already exist");
        return;
    }

    // 2.
    const result = validate.validateBook(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    // 3.
    const bookid = await db.addNewBook(req.body);
    const newBook = await db.getBookById(bookid);
    res.status(201).send(newBook);
});

app.post('/library/bookCopies', async(req, res) => {
    const bookid = req.body.BookID;
    const book = await db.getBookById(bookid);
    if (!book) {
        res.status(404).send("The book doesn't exist");
        return;
    }    
    const copyid = await db.addNewCopyOfBook(bookid);
    res.status(201).send({BookID: bookid, CopyID: copyid}); 
}); 

// -- books and users

app.post('/library/favoriteBooks/:userName', async(req, res) => {
    const userName = req.params.userName;
    const user = await db.getUserByName(userName);
    if(!user) {
        res.status(404).send("The user doesn't exist");
        return;
    }

    const bookid = req.body.BookID;
    const book = await db.getBookById(bookid);
    if(!book) {
        res.status(404).send("The book doesn't exist");
        return;
    }

    const favoriteBooks = await db.getUsersFavoriteBooks(userName);
    let favoriteBook = favoriteBooks.find(b => parseInt(b.BookID) === parseInt(bookid));
    if(favoriteBook){
        res.status(200).send(favoriteBook); 
        return;
    }

    favoriteBook = await db.addFavoriteBookToUser(userName, bookid);
    res.status(201).send(favoriteBook);    
});

app.post('/library/borrowedBooks/:userName', async(req, res) => {

    const userName = req.params.userName;
    const user = await db.getUserByName(userName);
    if(!user) {
        res.status(404).send("The user doesn't exist");
        return;
    }

    const bookid = req.body.BookID;
    const book = await db.getBookById(bookid);
    if(!book) {
        res.status(404).send("The book doesn't exist");
        return;
    }

    const bookCopies = await db.getBookCopiesByID(bookid);
    let bookCopy = bookCopies.find(c => c.Status === "Available");
    if(!bookCopy) {
        res.status(404).send("No copies are available");
        return;
    }

    const borrowedBook = await db.addBorrowedBookToUser({Name:userName, CopyID: bookCopy.CopyID});
    res.status(201).send(borrowedBook); 
     
});

// -- quotes
app.post('/library/quotes', async(req, res) => {
    const result = validate.validateQuote(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    await db.addNewQuote(req.body);
    res.status(201).send(req.body);
});
 

// -- images

app.post('/library/images', async(req, res) => {
    const result = validate.validateImage(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    await db.addNewImage(req.body);
    res.status(201).send(req.body);
});



// PUT
app.put('/library/users/:userName', async(req, res) => {
    const userName = req.params.userName;
    const user = await db.getUserByName(userName);
    if(!user) {
        res.status(404).send("The user doesnt exist");
        return;
    }

    const result = validate.validateUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const updatedUser = await db.updateUser(req.body);
    res.send(updatedUser);
})

app.put('/library/subscribedUsers/:userName', async(req, res) => {
const userName = req.params.userName;
    const user = await db.getUserByName(userName);
    if(!user) {
        res.status(404).send("The subscribed user doesnt exist");
        return;
    }

    const result = validate.validateSubscribedUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    await db.updateSubscribedUser(req.body);
    const updatedSubscribedUser = await db.getSubscribedUserByName(userName);
    res.send(updatedSubscribedUser); 
});

// -- books 

app.put('/library/books/:bookid', async(req, res) => {
    const bookid = req.params.bookid;
    const book = await db.getBookById(bookid);
    if(!book) {
        res.status(404).send("The book doesnt exist");
        return;
    }

    const result = validate.validateBook(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const updateBook = await db.updateBook({BookID: bookid, ...req.body});
    res.send(updateBook);
});


app.put('/library/borrowedBooks/:userName', async(req, res) => {
    const userName = req.params.userName;
    const user = await db.getUserByName(userName);
    if(!user) {
        res.status(404).send("The subscribed user doesnt exist");
        return;
    }

    const borrowBookid = req.body.BorrowID;
    const borrowBooks = await db.getUsersBorrowedBooks(userName);
    const book = borrowBooks.find(b => parseInt(b.BorrowID) === parseInt(borrowBookid));
    if(!book) {
        res.status(404).send("The user is not borrowing this copy");
        return;
    }

    await db.returnBorrowedBookFromUser(borrowBookid);
    res.send(req.body);
});


// DELETE

// -- users

app.delete('/library/users/:userName', async(req, res) => {
    const userName = req.params.userName;
    const user = await db.getUserByName(userName);
    if(!user) {res.status(404).send("The user doesnt exist"); return;};

    const borrowBooks = await db.getUsersBorrowedBooks(userName);
    if(borrowBooks.length > 0) {res.status(400).send("The user still has books"); return;};

    await db.deleteUser(userName);
    res.send(user);
})

app.delete('/library/subscribedUsers/:userName', async(req, res) => {
    const subscribedUserName = req.params.userName;
    const subscribedUser = await db.getSubscribedUserByName(subscribedUserName);
    if(!subscribedUser) {res.status(404).send("The subscribed user doesnt exist"); return;};

    const borrowBooks = await db.getUsersBorrowedBooks(subscribedUserName);
    if(borrowBooks.length > 0) {res.status(400).send("The user still has books"); return;};

    await db.deleteSubscribedUser(subscribedUserName);  
    res.send(subscribedUser);
});

app.delete('/library/books/:bookid', async(req, res) => {
    const bookid = req.params.bookid;
    const book = await db.getBookById(bookid);
    if(!book) {res.status(404).send("The book doesnt exist"); return;};

    const bookCopies = await db.getBookCopiesByID(bookid);
    let bookCopy = bookCopies.find(c => c.Status === "Borrowed");
    if(bookCopy) {res.status(400).send("There is a copy of the book that is currently borrowed"); return;};
 
    await db.deleteBook(bookid); 
    res.send(book);
});

app.delete('/library/bookCopies/:copyid', async(req, res) => {
    const copyBookid = req.params.copyid;
    const copyBook = await db.getSingleBookCopyByID(copyBookid);
    if(!copyBook) {res.status(404).send("The copy book doesnt exist"); return;};

    if(copyBook.Status === "Borrowed") {res.status(400).send("Theis copy of the book is currently borrowed"); return;}

    await db.deleteCopyOfBook(copyBookid);
    res.send(copyBook);
});

app.delete('/library/favoriteBooks/:userName', async(req, res) => { 
    const userName = req.params.userName;
    const user = await db.getUserByName(userName);
    if(!user) {
        res.status(404).send("The user doesnt exist"); 
        return;
    }

    const bookid = req.body.BookID;
    const favoriteBooks = await db.getUsersFavoriteBooks(userName);
    const favoriteBook = favoriteBooks.find(b => parseInt(b.BookID) === parseInt(bookid));
    if(!favoriteBook) {res.status(404).send("The book is not in the user's favorite list"); return;};

    await db.deleteFavoriteBookFromUser(userName, bookid);
    res.send(favoriteBook);
});


const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`start.. ${port}`);
})
