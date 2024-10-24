import express from 'express'
import {getTrip,createTrip,deleteTrip,updateTrip} from '../controllers/trips.js'

const router = express.Router()

router.get('/', getTrip)
router.get('/:id', getTrip)
router.post('/', createTrip)
router.delete('/:id', deleteTrip)
router.patch('/:id', updateTrip)

export default router