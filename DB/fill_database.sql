-- Inserting data into Users table
INSERT INTO Users (Name, Password)
VALUES
('Alice Smith', 'password123'),
('Bob Johnson', 'securepass'),
('Charlie Brown', 'pass456'),
('Diana Prince', 'wonderwoman'),
('Eve Adams', 'eve123'),
('Frank Castle', 'punisher'),
('Grace Hopper', 'navycode'),
('Hank Pym', 'antman'),
('Isabella Swan', 'twilightfan'),
('John Doe', 'anonymous');

-- Inserting data into SubscribedUsers table
INSERT INTO SubscribedUsers (Name, Phone, Address, Email, SubscriptionExpiration)
VALUES
('Alice Smith', '123-456-7890', '123 Elm St, Springfield', 'alice@example.com', '2024-12-31'),
('Charlie Brown', '234-567-8901', '456 Oak St, Springfield', 'charlie@example.com', '2025-05-15'),
('Diana Prince', '345-678-9012', '789 Pine St, Springfield', 'diana@example.com', '2024-08-31'),
('Frank Castle', '456-789-0123', '101 Maple St, Gotham', 'frank@example.com', '2025-01-01'),
('Grace Hopper', '567-890-1234', '202 Birch St, Metropolis', 'grace@example.com', '2024-09-01'),
('Hank Pym', '678-901-2345', '303 Cedar St, Star City', 'hank@example.com', '2024-10-15'),
('Isabella Swan', '789-012-3456', '404 Ash St, Forks', 'bella@example.com', '2024-11-30'),
('John Doe', '890-123-4567', '505 Walnut St, Central City', 'john@example.com', '2024-08-15');

-- Inserting data into Books table
INSERT INTO Books (Title, Author, Summary)
VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.'),
('To Kill a Mockingbird', 'Harper Lee', 'A novel about the serious issues of rape and racial inequality.'),
('1984', 'George Orwell', 'A dystopian novel set in a totalitarian society ruled by Big Brother.'),
('Pride and Prejudice', 'Jane Austen', 'A romantic novel that also critiques the British landed gentry at the end of the 18th century.'),
('Moby-Dick', 'Herman Melville', 'The narrative of Captain Ahab’s obsessive quest to kill the giant white sperm whale Moby Dick.'),
('War and Peace', 'Leo Tolstoy', 'A historical novel that tells the story of five families during the Napoleonic Wars.'),
('The Catcher in the Rye', 'J.D. Salinger', 'A novel about a teenage boy, Holden Caulfield, and his disillusionment with the world.'),
('The Hobbit', 'J.R.R. Tolkien', 'A fantasy novel about the adventure of Bilbo Baggins in Middle-earth.'),
('The Odyssey', 'Homer', 'An epic poem that tells the story of Odysseus’s journey home after the Trojan War.'),
('The Divine Comedy', 'Dante Alighieri', 'An epic poem describing Dante’s journey through Hell, Purgatory, and Paradise.');

-- Inserting data into BookCopies table
INSERT INTO BookCopies (BookID)
VALUES
(1), (1), (2), (2), (3), (3), (4), (5), (5), (6);

-- Inserting data into BorrowedBooks table
INSERT INTO BorrowedBooks (Name, CopyID, BorrowDate, ReturnDate)
VALUES
('Alice Smith', 1, '2024-08-01', '2024-08-15'),
('Charlie Brown', 3, '2024-08-10', NULL),  -- Currently borrowed
('Diana Prince', 4, '2024-07-20', '2024-08-01'),
('Frank Castle', 6, '2024-07-15', '2024-07-30'),
('Grace Hopper', 7, '2024-08-05', NULL),  -- Currently borrowed
('Hank Pym', 8, '2024-08-02', '2024-08-12'),
('Isabella Swan', 9, '2024-07-25', '2024-08-05'),
('John Doe', 10, '2024-08-01', NULL);  -- Currently borrowed

-- Inserting data into FavoriteBooks table
INSERT INTO FavoriteBooks (Name, BookID)
VALUES
('Alice Smith', 1),
('Alice Smith', 3),
('Charlie Brown', 2),
('Diana Prince', 5),
('Frank Castle', 4),
('Grace Hopper', 6),
('Hank Pym', 7),
('Isabella Swan', 8),
('John Doe', 9),
('Alice Smith', 10);

-- Inserting data into Quotes table
INSERT INTO Quotes (Quote)
VALUES
('The only thing we have to fear is fear itself.'),
('To be or not to be, that is the question.'),
('I think, therefore I am.'),
('The unexamined life is not worth living.'),
('In the beginning God created the heavens and the earth.'),
('All animals are equal, but some animals are more equal than others.'),
('It was the best of times, it was the worst of times.'),
('Call me Ishmael.'),
('A journey of a thousand miles begins with a single step.'),
('To infinity and beyond!');
