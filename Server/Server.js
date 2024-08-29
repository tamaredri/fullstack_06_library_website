import * as db from '../DB/database.js';
import * as validate from './validation.js'
import express from 'express';
const app = express();
app.use(express.json());

// GET
app.get('/', async(req, res) => {
    
});

// -- users
app.get('/library/users/:userName', async(req, res) => {
    const userName = req.params.userName;
    const user = await db.getUserByName(userName);
    if(!user)
        res.status(404).send("The user doesn't exist");
    res.send(user);
});

app.get('/library/subscribedUsers/:userName', async(req, res) => {
    const userName = req.params.userName;
    const subscribedUser = await db.getSubscribedUserByName(userName);
    if(!subscribedUser)
        res.status(404).send("The user is not subscribed");

    //if(subscribedUser.??? < now) res.status(400).send("The user is not subscribed");
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
    if(!book)
        res.status(404).send("The book doesn't exist");
    res.send(book);
});

app.get('/library/bookCopies/:bookid', async(req, res) => {
    const bookid = req.params.bookid;
    const bookCopies = await db.getBookCopies(bookid);
    res.send(bookCopies);
});

// -- books and users
app.get('/library/favoriteBooks/:userName', async(req, res) => {
    const userName = req.params.userName;
    const favoriteBooks = await db.getFavoriteBooks(userName);
    res.send(favoriteBooks);
});

app.get('/library/borrowedBooks/:userName', async(req, res) => {
    const userName = req.params.userName;
    const borrowesBooks = await db.getBorrowedBooks(userName);
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
    const userName = req.body.userName;
    const user = getUserByName(userName);
    if (user) res.status(400).send("The user already exist");

    // 2.
    const result = validate.validateUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    // 3.
    await db.registerNewUser(req.body);
    res.send(req.body);
})

app.post('/library/subscribedUsers', async(req, res) => {
    // 1.UserName, Phone, Address, Email, subscriptionLength
    const userName = req.body.userName;
    const user = getUserByName(userName);
    if (!user) res.status(400).send("The user must be register");

    const subscribedUser = getSubscribedUserByName(userName);
    if(subscribedUser) res.status(400).send("The user already subscribed");

    // 2.
    const result = validate.validateSubscribedUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    // 3.
    await db.subscribeNewUser(req.body);
    res.send(req.body);
});


// -- books

app.post('/library/books', async(req, res) => {
    // האם ספר צריך להיות ייחודי????
    // 1. Title, Author, Summary, ImagePath
    const book = req.body.userName;
    const user = getUserByName(userName);
    if (user) res.status(400).send("The user already exist");

    // 2.
    const result = validate.validateUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    // 3.
    await db.registerNewUser(req.body);
    res.send(req.body);
});

app.post('/library/copyBooks', (req, res) => {
    
});

// -- books and users

app.post('/library/favoriteBooks', (req, res) => {
    
});

app.post('/library/borrowedBooks', (req, res) => {
    
});

// -- quotes
app.post('/library/quotes', async(req, res) => {
    // 1.
    const result = validate.validateQuote(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    // 2.
    await db.addNewQuote(req.body);
    res.send(req.body);
});


// -- images

app.post('/library/images', async(req, res) => {
    // 1.
    const result = validate.validateImage(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    // 2.
    await db.addNewImage(req.body);
    res.send(req.body);
});



// PUT
app.put('/library/users/:userName', async(req, res) => {
    const userName = req.params.userName;
    const user = db.getUserByName(userName);
    if(!user) res.status(404).send("The user doesnt exist");

    const result = validate.validateUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    await db.updateUser(req.body);
    res.send(req.body);
})

app.put('/library/subscribedUsers/:userName', async(req, res) => {
    const userName = req.params.userName;
    const user = db.getUserByName(userName);
    if(!user) res.status(404).send("The subscribed user doesnt exist");

    const result = validate.validateSubscribedUser(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    await db.updateSubscribedUser(req.body);
    res.send(req.body);
});

// -- books

app.put('/library/books/:bookid', async(req, res) => {
    const bookid = req.params.bookid;
    const book = db.getBooksById(bookid);
    if(!book) res.status(404).send("The book doesnt exist");

    const result = validate.validateBook(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    await db.updateBook(req.body);
    res.send(req.body);
});

app.put('/library/borrowedBooks/:userName', async(req, res) => {
    
});


// DELETE

// -- users

app.delete('/library/users/:userName', async(req, res) => {
    const userName = req.params.userName;
    const user = db.getUserByName(userName);
    if(!user) res.status(404).send("The user doesnt exist");

    await db.deleteUser(userName);
    res.send(user);
})

app.delete('/library/subscribedUsers/:userName', async(req, res) => {
    const subscribedUserName = req.params.userName;
    const subscribedUser = db.getSubscribedUserByName(subscribedUserName);
    if(!subscribedUser) res.status(404).send("The subscribed user doesnt exist");

    await db.deleteSubscribedUser(subscribedUserName);
    res.send(subscribedUser);
});

app.delete('/library/books/:bookid', async(req, res) => {
    const bookid = req.params.bookid;
    const book = db.getBooksById(bookid);
    if(!book) res.status(404).send("The book doesnt exist");

    await db.deleteBook(bookid);
    res.send(book);
});

app.delete('/library/bookCopies/:bookid', async(req, res) => {
    const copyBookid = req.params.bookid;
    const copyBook = db.getBooksById(copyBookid);
    if(!copyBook) res.status(404).send("The copy book doesnt exist");

    await db.deleteCopyOfBook(copyBookid);
    res.send(copyBook);
});

app.delete('/library/favoriteBooks/:userName', async(req, res) => {
    const userName = req.params.userName;
    const user = db.getUserByName(userName);
    if(!copyBook) res.status(404).send("The copy book doesnt exist");

    await db.deleteCopyOfBook(copyBookid);
    res.send(copyBook);
});

app.delete('/library/borrowedBooks/:userid/:bookid', (req, res) => {
    
});


const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`start.. ${port}`);
})
