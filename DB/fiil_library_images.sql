select * from libraryimages;
DELETE FROM libraryimages where ImageID in (1, 2, 3, 4, 5, 6);

insert into libraryimages (imagepath)
values 
('https://miro.medium.com/v2/resize:fit:1200/1*6Jp3vJWe7VFlFHZ9WhSJng.jpeg'),
('https://www.cubesmart.com/blog/wp-content/uploads/800X600_Blog09_Hero.jpg'),
('https://www.londonlibrary.co.uk/images/MarketingBA/webtile2.jpg'),
('https://literacybase.com/wp-content/uploads/2016/07/Books.jpg');