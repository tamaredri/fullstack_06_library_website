-- Inserting dummy data into Users table
INSERT INTO Users (Name, Password)
VALUES
('Alice Smith', 'password123'),
('Bob Johnson', 'securepass'),
('Charlie Brown', 'pass456'),
('Diana Prince', 'wonderwoman'),
('Eve Adams', 'eve123');

-- Inserting dummy data into SubscribedUsers table
INSERT INTO SubscribedUsers (SubscribedUserID, Phone, Address, Email, SubscriptionExpiration)
VALUES
(1, '123-456-7890', '123 Elm St, Springfield', 'alice@example.com', '2024-12-31'),
(3, '234-567-8901', '456 Oak St, Springfield', 'charlie@example.com', '2025-05-15'),
(4, '345-678-9012', '789 Pine St, Springfield', 'diana@example.com', '2024-08-31');

-- Inserting dummy data into Books table without ImagePath
INSERT INTO Books (Title, Author, Summary)
VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.'),
('To Kill a Mockingbird', 'Harper Lee', 'A novel about the serious issues of rape and racial inequality.'),
('1984', 'George Orwell', 'A dystopian novel set in a totalitarian society ruled by Big Brother.'),
('Pride and Prejudice', 'Jane Austen', 'A romantic novel that also critiques the British landed gentry at the end of the 18th century.'),
('Moby-Dick', 'Herman Melville', 'The narrative of Captain Ahab’s obsessive quest to kill the giant white sperm whale Moby Dick.');

-- Inserting dummy data into BookCopies table
INSERT INTO BookCopies (BookID)
VALUES
(1),
(1),
(2),
(3),
(4),
(5);

-- Inserting dummy data into BorrowedBooks table
INSERT INTO BorrowedBooks (UserID, CopyID, BorrowDate, ReturnDate)
VALUES
(1, 2, '2024-08-01', '2024-08-15'),
(3, 5, '2024-08-10', NULL);  -- NULL indicates the book is still borrowed

-- Inserting dummy data into FavoriteBooks table
INSERT INTO FavoriteBooks (UserID, BookID)
VALUES
(1, 3),
(1, 4),
(3, 1),
(4, 5);

-- Inserting dummy data into Quotes table
INSERT INTO Quotes (Quote)
VALUES
('The only thing we have to fear is fear itself.'),
('To be or not to be, that is the question.'),
('I think, therefore I am.'),
('The unexamined life is not worth living.'),
('In the beginning God created the heavens and the earth.');

-- Inserting dummy data into LibraryImages table without ImagePath
INSERT INTO LibraryImages (ImagePath)
VALUES
(NULL),
(NULL),
(NULL),
(NULL),
(NULL);
