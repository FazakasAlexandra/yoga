import Layout from '../components/Layout'
import EventCard from '../components/EventCard'
import Feedback from '../components/Feedback'
import Loader from '../components/Loader'
import { useState, useEffect } from 'react'
import db from '../db.js'
import { useSession } from 'next-auth/client'

export default function Events() {
  const [session, loading] = useSession()
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)

  useEffect(() => {
    db.events
      .getUpcomingEvents(new Date().toJSON().slice(0, 10))
      .then((res) => {
        setEvents(res.data)
        setEventsLoading(false)
      })
  }, [])

  const getEvents = () => {
    return events.length != 0 ? (
      events.map((event, index) => {
        return <EventCard key={index} event={event} adminInterface={false} />
      })
    ) : (
      <h2 className="no-data-txt">UPCOMING EVENTS NOT FOUND</h2>
    )
  }

  return (
    <Layout activeTab={'events'}>
      <div className='events-layout'>{eventsLoading ? <Loader /> : getEvents()}</div>
    </Layout>
  )
}
