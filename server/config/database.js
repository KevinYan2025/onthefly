import pg from 'pg';

export const pool = new pg.Pool({
    connectionString: 'postgresql://postgres:nEtSwaFHxtUhUVBvSbSxBBvBxpuXHSNv@junction.proxy.rlwy.net:12062/railway'
});

pool.connect()
    .then(client => {
        console.log('Connected successfully');
        client.release(); // Release the client back to the pool
    })
    .catch(err => console.error('Connection error', err.stack));
