import './dotenv.js'
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { pool } from './database.js'; // Ensure you import your database pool

const options = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/github/callback'
};
console.log(options);


const verify = async (accessToken, refreshToken, profile, done) => {
    const { _json: { id, login, avatar_url } } = profile;
    const userData = { githubId: id, username: login, avatarUrl: avatar_url, accessToken };

    try {
        const results = await pool.query('SELECT * FROM users WHERE username = $1', [userData.username]);
        const user = results.rows[0];

        if (!user) {
            const insertResults = await pool.query(
                `INSERT INTO users (githubid, username, avatarurl, accesstoken)
                VALUES($1, $2, $3, $4)
                RETURNING *`,
                [userData.githubId, userData.username, userData.avatarUrl, userData.accessToken]
            );

            const newUser = insertResults.rows[0];
            return done(null, newUser);
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
};

passport.use(new GitHubStrategy(options, verify));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});