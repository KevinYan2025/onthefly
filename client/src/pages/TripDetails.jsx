import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import ActivityBtn from '../components/ActivityBtn';
import DestinationBtn from '../components/DestinationBtn';
import './TripDetails.css'

const TripDetails = ({data,api_url}) => {

    const {id} = useParams();
    const [post, setPost] = useState({id: 0, title: "", description: "", img_url: "", num_days: 0, start_date: "", end_date: "", total_cost: 0.0 })
    const [activities, setActivities] = useState([])
    const [destinations, setDestinations] = useState([])
    const [travelers, setTravelers] = useState([])
    const [trip, setTrip] = useState({
        id: 0,
        title: '',
        description: '',
        img_url: '',
        num_days: 0,
        start_date: '',
        end_date: '',
        total_cost: 0.0,
        username: props.user.username
    })
    useEffect(() => {
        const result = data.filter(item => item.id === parseInt(id))[0];
        setPost({id: parseInt(result.id), title: result.title, description: result.description, img_url: result.img_url, num_days: parseInt(result.num_days), start_date: result.start_date.slice(0,10), end_date: result.end_date.slice(0,10), total_cost: result.total_cost});

        const fetchActivities = async () => {

            const response = await fetch(`${api_url}/api/activities/${id}`)
            setActivities(await response.json())
        }

        const fetchDestinations = async () => {
            const response = await fetch(`${api_url}/api/destinations/${id}`)
            setDestinations(await response.json())
            
        }

        const fetchTravelers = async () => {
            const response = await fetch(`${api_url}/api/users-trips/users/${id}`)
            const travelersJson = await response.json()
            setTravelers(travelersJson)
        }
        fetchActivities();
        fetchDestinations();
        fetchTravelers()
    }, [data, id]);


    return (
        <div className="out">
            <div className="flex-container">

                <div className="left-side">
                    <h3>{post.title}</h3>
                    <p>{"🗓️ Duration: " + post.num_days + " days "}</p>
                    <p>{"🛫 Depart: " + post.start_date }</p>
                    <p>{"🛬 Return: " + post.end_date}</p>
                    <p>{post.description}</p>
                </div>

                <div className="right-side" style={{ backgroundImage:`url(${post.img_url})`}}>
                </div>
            </div>

            <div className="flex-container">
                <div className="activities">
                {
                activities && activities.length > 0 ?
                activities.map((activity,index) => 
                    <ActivityBtn id={activity.id} activity={activity.activity} num_votes={activity.num_votes}/>
                ) : ''
                }
                    <br/>
                    <Link to={'../../activity/create/'+ id }><button className="addActivityBtn">+ Add Activity</button></Link>
                </div>
                <div className="destinations">
                {
                destinations && destinations.length > 0 ?
                destinations.map((destination,index) => 
                    <DestinationBtn id={destination.id} destination={destination.destination} />
                ) : ''
                }
                    <br/>
                    <Link to={'../../destination/new/'+id}><button className="addDestinationBtn">+ Add Destination</button></Link>
                </div>
                <div className='travelers'>
    {
        travelers && travelers.length > 0 ?
        travelers.map((traveler, index) => 
            <p key={index} style={{ textAlign: 'center', lineHeight: 0, paddingTop: 20 }}>
                {traveler.username}
            </p>
        ) : ''
    }
    
    <br/>
    <Link to={'/users/add/' + id }><button className='addActivityBtn'>+ Add Traveler</button></Link>
</div>
            </div>
            
        </div>
            


    )
}

export default TripDetails