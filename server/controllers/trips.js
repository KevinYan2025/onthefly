import { pool } from '../config/database.js'
export const createTrip = async (req, res) => {
  try {
      const { title, description, img_url, num_days, start_date, end_date, total_cost, username } = req.body;

      // Check if all required fields are provided
      if (!title || !description || !img_url || !num_days || !start_date || !end_date || !total_cost || !username) {
          return res.status(400).json({ error: 'All fields are required.' });
      }

      // Check if a trip with the same title already exists
      const existingTrip = await pool.query('SELECT * FROM trips WHERE title = $1', [title]);
      if (existingTrip.rows.length > 0) {
          return res.status(409).json({ error: 'A trip with the same title already exists.' });
      }

      // Insert the new trip
      const results = await pool.query(
          `INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost)
          VALUES($1, $2, $3, $4, $5, $6, $7)
          RETURNING *`,
          [title, description, img_url, num_days, start_date, end_date, total_cost]
      );

      // Insert into users_trips
      const tripUser = await pool.query(
          `INSERT INTO users_trips (trip_id, username)
          VALUES($1, $2)
          RETURNING *`,
          [results.rows[0].id, username]
      );

      res.status(201).json(results.rows[0]);
  } catch (error) {
      console.error('Error creating trip:', error);
      res.status(500).json({ error: error.message });
  }
};

export const getTrip = async (req, res) => {
  try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
          return res.status(400).json({ error: 'Invalid trip ID' });
      }

      const results = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
      if (results.rows.length === 0) {
          return res.status(404).json({ error: 'Trip not found' });
      }

      res.status(200).json(results.rows[0]);
  } catch (error) {
      console.error('Unable to get trip:', error);
      res.status(500).json({ error: error.message });
  }
};


  export const updateTrip = async (request, response) => {
    try {
      const { title, description, img_url, num_days, start_date, end_date, total_cost } = req.body
      const id = parseInt(req.params.id)
  
      const results = await pool.query(
        `UPDATE trips
        SET title = $1, description = $2, img_url = $3, num_days = $4, start_date = $5, end_date = $6, total_cost= $7
        WHERE id = $8`,
        [title, description, img_url, num_days, start_date, end_date, total_cost, id]
      )
  
      res.status(200).json(results.rows);
    }
    catch(error){
      res.status(409).json( { error: error.message } )
    }
  }

  export const deleteTrip = async (req, res) => {
    const id = parseInt(req.params.id)
  
    try {

    
    const user_removal = await pool.query(
        `DELETE FROM users_trips
        WHERE trip_id = $1`,
        [id]
    )
    
    const destination_removal = await pool.query(
        `DELETE FROM trips_destinations
        WHERE trip_id = $1`,
        [id]
    )
      const activity_deletion = await pool.query(
        `DELETE FROM activities
        WHERE trip_id = $1`,
        [id]
      )
  
      const results = await pool.query('DELETE FROM trips WHERE id = $1', [id])
      res.status(200).json(results.rows)
    }
    catch(error) {
      res.status(409).json( { error: error.message } )
    }
      
  }
