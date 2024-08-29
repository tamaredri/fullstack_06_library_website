-- Create database
CREATE DATABASE LibraryDB;
USE LibraryDB;

-- Table for all users
CREATE TABLE Users (
    Name VARCHAR(100) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL
);

-- Table for subscribed users' additional information
CREATE TABLE SubscribedUsers (
    Name VARCHAR(100),
    Phone VARCHAR(15) NOT NULL,
    Address VARCHAR(255),
    Email VARCHAR(100) NOT NULL,
    SubscriptionExpiration DATE NOT NULL,
    PRIMARY KEY (Name),
    FOREIGN KEY (Name) REFERENCES Users(Name)
);

-- Table for books
CREATE TABLE Books (
    BookID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Author VARCHAR(100) NOT NULL,
    Summary TEXT,
    ImagePath VARCHAR(255)
);

-- Table for book copies
CREATE TABLE BookCopies (
    CopyID INT AUTO_INCREMENT PRIMARY KEY,
    BookID INT,
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);

-- Table to manage borrowed books by subscribed users
CREATE TABLE BorrowedBooks (
    BorrowID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    CopyID INT,
    BorrowDate DATE NOT NULL,
    ReturnDate DATE,
    FOREIGN KEY (Name) REFERENCES Users(Name),
    FOREIGN KEY (CopyID) REFERENCES BookCopies(CopyID)
);

-- Table to manage favorite books by subscribed users
CREATE TABLE FavoriteBooks (
    Name VARCHAR(100),
    BookID INT,
    PRIMARY KEY (Name, BookID),
    FOREIGN KEY (Name) REFERENCES Users(Name),
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);

-- Table for quotes
CREATE TABLE Quotes (
    QuoteID INT AUTO_INCREMENT PRIMARY KEY,
    Quote TEXT NOT NULL
);

-- Table for library images
CREATE TABLE LibraryImages (
    ImageID INT AUTO_INCREMENT PRIMARY KEY,
    ImagePath VARCHAR(255) NOT NULL
);
