import express from 'express';
import mysql2 from 'mysql2/promise';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const pool = await mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'nyc11214',
    database: 'reviews',
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    port: 3306,
});

try {
    passport.use(new LocalStrategy(async function verify(username, password, cb) {
        try {
            const [rows, fields] = await pool.execute(
                'SELECT * FROM users WHERE username = ? AND password = ?', [username, password]
            );
            if (!rows) {
                return cb(null, false);
            }

            return cb(null, rows[0]);
        } catch (err) { // catch connection.execute ( ... ) errors
            return cb(err);
        }
    }));

    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, {
                id: user.id,
                username: user.username,
                type: user.type,
            });
        });
    });

    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
            console.log('some deserializing');
            return cb(null, user);
        });
    });

} catch ( err ) {
    console.log(err);
}
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

function isLoggedIn(req, res, next) {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        return res.sendStatus(401);
    }
    next();
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(session({
    secret: 'I like pineapple pizza',
    resave: false,
    saveUninitialized: false,
    expires: 1000 * 60 * 60, // 1 hr
    // cookie: { secure: true }, enable in production - HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
    console.log('this is /')
    if (req.user) {
        return res.send('logged in');
    }
    return res.send('please log in');
});

// Authentication

app.get('/auth', function(req, res) {
    console.log('/login is ' + req.isAuthenticated());
    return res.json({
        "loggedIn": req.isAuthenticated()
    })
});

app.get('/auth/aboutUser', function(req, res) {
    return res.json(req.user);
})

app.post('/auth', passport.authenticate('local'), function (req, res) {
    console.log('req.isAuthenticated(): ' + req.isAuthenticated());
    return res.json({
        "loggedIn": req.isAuthenticated()
    });
});

app.post('/register', function (req, res) {
    console.log('/register reached');
    console.log(req.body);
    const { username, password, first_name, last_name, email } = req;
    // try {
    //     pool.execute('INSERT INTO users (username, password, first_name, last_name, email) ' +
    //         'VALUES (?, ?, ?, ?, ?)',
    //         [username, password, first_name, last_name, email]
    //     );
    //     const token = uuidv4();
    //     pool.execute('INSERT INTO verifyEmails (token, userId) VALUES (?, ?)', [token, req.user.id]);
    //     // https://nodemailer.com
    // } catch (err) {
    //     console.log(err);
    // }
    res.sendStatus(201);
})
app.post('/logout', isLoggedIn, function(req, res, next){
    console.log('/logout reached');
    req.logout(function(err) {
        if (err) { return next(err); }
        res.sendStatus(200); // res.redirect will not affect the frontend
    });
});

// Products

app.get('/products', isLoggedIn, async function (req, res) {
    try {
        const [rows, fields] = await pool.execute('SELECT * FROM products');
        return res.json(rows);
    } catch (err) {
        console.log(err);
    }
})

app.get('/products/:id', isLoggedIn, async function (req, res) {
    try {
        const [rows, fields] = await pool.execute('SELECT * FROM products where id = ?', [req.params.id]);
        return res.json(rows[0]);
    } catch (err) {
        console.log(err);
    }
})

// Reviews

app.get('/reviewsFor/:id', isLoggedIn, async function (req, res, next) {
    try {
        const [rows, fields] = await pool.execute('SELECT * FROM reviews where product_id = ?', [req.params.id]);
        return res.json(rows);
    } catch (err) {
        console.log(err);
    }
})

app.post('/reviewsFor/:id', isLoggedIn, async function (req, res) {
    console.log(req.body)
    const reviewer_id = req.user.id;
    const { title, description, stars, product_id } = req.body;

    const date = new Date();
    let month = String(date.getMonth()+1).padStart(2,"0"); // month format to MM,i.e.,08;
    let day = String(date.getDate()).padStart(2, '0');
    let year = date.getFullYear();
    let todayDate = `${year}-${month}-${day}`;
    try {
        pool.execute(
            'INSERT INTO reviews (reviewer_id, reviewer_username, title, description, stars, product_id, date_posted) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?)',
            [reviewer_id, req.user.username, title, description, stars, product_id, todayDate]);
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
    }
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})