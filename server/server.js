import express from 'express'
import cors from 'cors'
import tripRoutes from './routes/trips.js'
import passport from 'passport'
import session from 'express-session'
import  './config/auth.js'
import authRoutes from './routes/auth.js'
import userTripRoutes from './routes/users-trips.js'
const app = express()
app.use(session({
    secret: 'codepath',
    resave: false,
    saveUninitialized: true
}))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
}))
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})
app.use('/auth', authRoutes)

app.use('/api/users-trips', userTripRoutes)
app.use('/api/trips', tripRoutes)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})