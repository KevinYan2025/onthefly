import React, { useState } from 'react';
import './CreateTrip.css'

const CreateTrip = ({api_url}) => {

    const [trip, setTrip] = useState({id: 0, title: "", description: "", img_url: "", num_days: 0, start_date: "", end_date: "", total_cost: 0.0 })
    
    const handleChange = (event) => {
        const {name, value} = event.target;
        setTrip( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }
    
    const createTrip = async (event) => {
        event.preventDefault();
    
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trip)
        };
    
        try {
            
            const response = await fetch(`${api_url}/api/trips`, options);
            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error('A trip with the same title already exists.');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            window.location.href = '/';
        } catch (error) {
            console.error('Error creating trip:', error);
            alert(error.message);
        }
    };


    return (
        <div>
            <center><h3> Create New Trip</h3></center>
            <form>
                <label>Title</label> <br />
                <input type="text" id="title" name="title" value={trip.title} onChange={handleChange}/><br />
                <br/>

                <label>Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" value={trip.description} onChange={handleChange}>
                </textarea>
                <br/>

                <label>Image URL </label><br />
                <input type="text" id="img_url" name="img_url" value={trip.img_url} onChange={handleChange}/><br />
                <br/>

                <label>Number of Days</label><br />
                <input type="number" id="num_days" name="num_days" value={trip.num_days} onChange={handleChange}/><br />
                <br/>

                <label>Start Date </label><br />
                <input type="date" id="start_date" name="start_date" value={trip.start_date} onChange={handleChange}/><br />
                <br/>

                <label>End Date </label><br />
                <input type="date" id="end_date" name="end_date" value={trip.end_date} onChange={handleChange}/><br />
                <br/>

                <label>Total Cost</label><br />
                <input type="text" id="total_cost" name="total_cost" value={trip.total_cost} onChange={handleChange}/><br />
                <br/>

                <input type="submit" value="Submit" onClick={createTrip} />
            </form>
        </div>
    )
}

export default CreateTrip