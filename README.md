The book library web app, to educate people to understand about web application structure. Very introduction to experience how things work together, why html, CSS, JS, api existing.

structure of app

- book-library
  - web
    - index.html
    - /list
      - index.html
    - js/
      - book-data.js
      - book-library.js
    - styles/
      - library.css
  - api
    - src
      - index.js
    - package.json // we'll use Express js
    - .env

database structure

- book
  - id
  - ISBN
  - title
  - category_id
- category
  - id
  - name
- book_favourite
  - id
  - book_id
  - created_at
- book_rating
  - id
  - book_id
  - rating

features

1. display books and data
2. show as cards
3. show as table
4. click to toggle favourite
5. click to give rating

out of scope:

- paginate data
- prevent double click
- seed database
- ORM
