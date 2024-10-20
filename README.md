## Features
1. All routes are protected by Passport.js. If user is not logged in, they will be redirected to the login page and will not be able to communicate with the server.
2. After logging in, the user will stay logged in for 1 day (express-session library).
3. All reviews and users are saved to a MySQL database.

## Upcoming:
#### Account Privileges
1. Admins: accept or deny pending reviews.
2. Super admin: add, remove, or delete accounts.
3. Seller: add or remove products (only theirs).
#### Other
1. Magic Link Support.
2. Verify email after registering.
3. Flesh out reviews page.
4. Add products.
5. Add a notice board?
6. Give admins an unique identifier.

## Screenshots
#### Users are authenticated by server and database. New users are added to database.
![Screenshot of sign in page](README_screenshots/sign_in_page.png)
#### Reviews are saved to database.
![create review page](README_screenshots/create_review_page.png)
#### Products read from MySQL database.
![products_page.png](README_screenshots/products_page.png)
#### Each product has its own reviews. Each review has a title, body, and the reviewer's username. Currently a work in progress.
![reviews page](README_screenshots/reviews_page.png)

### Database Schema
#### Products
![products table databaase](README_screenshots/products_table.png)
#### Users
![users table database](README_screenshots/users_table.png)
#### Reviews
![reviews table database](README_screenshots/reviews_table.png)

#### Verified Emails (Work In Progress)
![verified emails database](README_screenshots/verified_emails_table.png)
