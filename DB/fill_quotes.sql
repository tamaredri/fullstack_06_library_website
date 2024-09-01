select * from quotes;
DELETE FROM quotes where QuoteID in (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

insert into quotes (Quote)
values 
('"A room without books is like a body without a soul."
– Marcus Tullius Cicero'),
('"So many books, so little time."
– Frank Zappa'),
('"I have always imagined that Paradise will be a kind of library."
– Jorge Luis Borges'),
('"It is our choices, Harry, that show what we truly are, far more than our abilities."
– J.K. Rowling, Harry Potter and the Chamber of Secrets'),
('"You can never get a cup of tea large enough or a book long enough to suit me."
– C.S. Lewis'),
('"Books are a uniquely portable magic."
– Stephen King'),
('"There is no friend as loyal as a book."
– Ernest Hemingway'),
('"Until I feared I would lose it, I never loved to read. One does not love breathing."
– Harper Lee, To Kill a Mockingbird'),
('"The only way out of the labyrinth of suffering is to forgive."
– John Green, Looking for Alaska'),
('"Not all those who wander are lost."
– J.R.R. Tolkien, The Fellowship of the Ring');