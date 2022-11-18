# mybooks api

## an api serving up a self maintained database of books

this is a fairly basic api hosted currrently built with express, using the passport library to authenticate users, axios to connect to the database


__Endpoints__

this api supports various endpoints for crud functionality

__GET__

/books
endpoint returning json of all books is /books

get request to return individual title
/books/:title append the title

get request to get particular genre info
/books/genre/:name this refers to genre.name

get request to return the author infp
/books/author/:name

get method getting user details
/users/:username

__POST__

post method to add user
/users post a json of the username, password email, and birhtday


post method to add a new title to the existing database
/books has also posts as a json following the format

post method to add a new title to the existing database
/books has also posts as a json following the format

post a users favorite book
/users/username/books/bookId

__PUT__

put method to update user info
/users/:username


__Delete__

 delete users favorite book
  /users/username/books/bookId

 delete user account
  /users/username

