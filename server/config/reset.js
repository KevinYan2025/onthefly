import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const tripsData =[
    {
        "title": "Highlights of the United Kingdom",
        "description": "Embark on a guided tour of England, Scotland, and Ireland, which will take you from cosmopolitan London to the medieval city of Edinburgh. Then, pass through the Lake District and Wales as you travel between Scotland and Ireland. After arriving in the Emerald Isle, grab a pint (or a few) with Dubliners and make your way along the scenic Ring of Kerry and Cliffs of Moher, taking in stunning sea views as you go.",
        "img_url": "https://tinyurl.com/bdzy2tjp",
        "num_days": 10,
        "start_date": "2023-07-11",
        "end_date": "2023-07-22",
        "total_cost": 3899.00
    },
    {
        "title": "A Week in Italy: Venice, Florence, & Rome",
        "description": "We've picked three iconic cities at the pulse of Italy's vibrant culture, both past and present. Venice brings romance to the forefront, with sprawling Baroque palaces and meandering, gondola-dotted canals. The Renaissance is tangible in Florence, where the presence of the world's greatest artists can still be felt. The people, the food, the way of life—experience what Italy is all about as you make your way from one city to the next.",
        "img_url": "https://tinyurl.com/5e7kcc5a",
        "num_days": 7,
        "start_date": "2023-03-01",
        "end_date": "2023-03-08",
        "total_cost": 2509.00
    },
    {
        "title": "Egypt & Nile River Cruise",
        "description": "Descend into a world of ancient wonders to discover the lands behind the legends. Walk past towering stone icons, through avenues of sphinxes, and into royal valleys amid the desert sands. Then, cruise down the Nile and anchor at remote islands and beside the Theban Hills. End your adventure in Cairo, where historic mosques mingle with today's modern bustle.",
        "img_url": "https://tinyurl.com/yesanwy8",
        "num_days": 12,
        "start_date": "2024-04-30",
        "end_date": "2024-05-11",
        "total_cost": 3409.00
    },
    {
        "title": "Ecuador & Galápagos Islands",
        "description": "Ecuador puts new meaning behind the saying, \"good things come in small packages.\" In terms of flora, fauna, and opportunities for viewing unique local wildlife, this South American country runs the gamut. Journey to Quito for a taste of Ecuadorean culture and Spanish colonial history. Then, island hop through the Galápagos, where you'll move from mangrove swamps to lava flows to sunny shorelines, encountering scores of exotic creatures along the way.",
        "img_url": "https://tinyurl.com/3f4nzn7z",
        "num_days": 10,
        "start_date": "2023-05-08",
        "end_date": "2023-05-17",
        "total_cost": 4879.00
    }
  ]
// const currentPath = fileURLToPath(import.meta.url)
// const tripsFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'))
// const tripsData = JSON.parse(tripsFile)

const createTripsTable = async () => {
    const createTripsTableQuery = `
        CREATE TABLE IF NOT EXISTS trips (
            id serial PRIMARY KEY,
            title varchar(100) NOT NULL,
            description varchar(500) NOT NULL,
            img_url text NOT NULL,
            num_days integer NOT NULL,
            start_date date NOT NULL,
            end_date date NOT NULL,
            total_cost money NOT NULL
        );
    `
    try {
        const res = await pool.query(createTripsTableQuery)
        console.log('🎉 trips table created successfully')
      }catch (err) {
        console.error('⚠️ error creating trips table', err)
      }
  }

  const createDestinationsTable = async () => {
    const createDestinationsTableQuery = `
        CREATE TABLE IF NOT EXISTS destinations (
            id serial PRIMARY KEY,
            destination varchar(100) NOT NULL,
            description varchar(500) NOT NULL,
            city varchar(100) NOT NULL,
            country varchar(100) NOT NULL,
            img_url text NOT NULL,
            flag_img_url text NOT NULL
        );
    `
    try {
        const res = await pool.query(createDestinationsTableQuery)
  console.log('🎉 destinations table created successfully')
    } catch (error) {
        console.error('⚠️ error creating destinations table', error)

    }
  }

  const createActivitiesTable = async () => {
    const createActivitiesTableQuery = `
        CREATE TABLE IF NOT EXISTS activities (
            id serial PRIMARY KEY,
            trip_id int NOT NULL,
            activity varchar(100) NOT NULL,
            num_votes integer DEFAULT 0,
            FOREIGN KEY(trip_id) REFERENCES trips(id)
        );
    `
    try {
        const res = await pool.query(createActivitiesTableQuery)
        console.log('🎉 activities table created successfully')
      }catch (err) {
        console.error('⚠️ error creating activities table', err)
      }
  }

  const createTripsDestinationsTable = async () => {
    const createTripsDestinationsTableQuery = `
        CREATE TABLE IF NOT EXISTS trips_destinations (
            trip_id int NOT NULL,
            destination_id int NOT NULL,
            PRIMARY KEY (trip_id, destination_id),
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
            FOREIGN KEY (destination_id) REFERENCES destinations(id) ON UPDATE CASCADE
        );
    `
    try {
        const res = await pool.query(createTripsDestinationsTableQuery)
        console.log('🎉 trips_destinations table created successfully')
      }catch (err) {
        console.error('⚠️ error creating trips_destinations table', err)
      }
  }

  const createUsersTable = async () => {
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id serial PRIMARY KEY,
            githubid integer NOT NULL,
            username varchar(100) NOT NULL,
            avatarurl varchar(500) NOT NULL,
            accesstoken varchar(500) NOT NULL
        );
    `
    try {
        const res = await pool.query(createUsersTableQuery)
        console.log('🎉 users table created successfully')
      }catch (error) {
        console.error('⚠️ error creating users table', error)
      }
  }

  const createTripsUsersTable = async () => {
    const createTripsUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS trips_users (
            trip_id int NOT NULL,
            user_id int NOT NULL,
            PRIMARY KEY (trip_id, user_id),
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
        );
    `
    try {
        const res = await pool.query(createTripsUsersTableQuery)
        console.log('🎉 trips_users table created successfully')
      }catch (error) {
        console.error('⚠️ error creating trips_users table', error)
      }
  }

  const seedTripsTable = async () => {
    await createTripsTable()
    tripsData.forEach((trip) => {
        const insertQuery = {
            text: 'INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)'
        }
        const values = [
            trip.title,
            trip.description,
            trip.img_url,
            trip.num_days,
            trip.start_date,
            trip.end_date,
            trip.total_cost
        ]
        pool.query(insertQuery, values, (err, res) => {
            if (err) {
                console.error('⚠️ error inserting trip', err)
                return
            }
        
            console.log(`✅ ${trip.title} added successfully`)
        })
    })
  }
  seedTripsTable()
  createDestinationsTable()
  createActivitiesTable()
  createTripsDestinationsTable()
  createUsersTable()
  createTripsUsersTable()