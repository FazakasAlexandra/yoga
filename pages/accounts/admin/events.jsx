import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/AdminLayout'
import EventCard from '../../../components/EventCard'
import EventForm from '../../../components/EventForm'
import Feedback from '../../../components/Feedback'
import Loader from '../../../components/Loader'
import db from '../../../db'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default function Page() {
  const router = useRouter()
  const [session, loading] = useSession()
  const [events, setEvents] = useState([])
  const [eventsForm, setEventsForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) router.push({ pathname: '/' })
  }, [session])

  useEffect(() => {
    db.events.getEvents()
    .then((res) => setEvents(res.data.reverse()))
    .finally(() => setIsLoading(false))
  }, [])

  const getEvents = () => {
    let content = []
    eventsForm
      ? (content = [
        <EventForm setEventsForm={setEventsForm} addNewEvent={addNewEvent} />,
        events.map((event, index) => {
          return <EventCard key={index} event={event} adminInterface={true} />
        }),
      ])
      : (content = [
        events.map((event, index) => {
          return (
            <EventCard
              key={index}
              event={event}
              adminInterface={true}
              deleteEvent={deleteEvent}
            />
          )
        }),
      ])
    return content
  }

  const addNewEvent = (
    e,
    name,
    image,
    date,
    hour,
    link,
    location,
    description
  ) => {
    e.preventDefault()
    const newEvent = {
      name: name,
      image: image,
      date: date,
      hour: hour,
      link: link,
      location: location,
      description: description,
    }

    db.getJWT().then((jwt) => {
      db.events.postEvent(jwt, newEvent).then((res) => {
        setEventsForm(false)
        db.events.getEvents().then((res) => setEvents(res.data.reverse()))
      })
    })
  }

  const deleteEvent = (ev, img) => {
    db.getJWT().then(({ jwtToken }) => {
      db.events
        .deleteEvent(jwtToken, ev, img)
        .then((res) => setEvents(res.data.reverse()))
    })
  }

  return (
    <Layout activeTab={'account'}>
      <AdminLayout activeTab={'events'}>
        <div style={{ width: "100%" }}>
          <div className='button-add-class'>
            <button
              className='button-white admin'
              style={{
                margin: '15px 0 0 30px ',
              }}
              onClick={() => {
                setEventsForm(true)
              }}
            >
              <FontAwesomeIcon icon={faPlus} size='lg' />
            </button>
          </div>
          <div className='events-layout'>{getEvents()}</div>
          {
            isLoading ? <Loader/> : !eventsForm && !events.length ?
            <Feedback
              message='Time to add some events !'
              iconName='smile'
            /> : null
          }
        </div>
      </AdminLayout>
    </Layout>
  )
}
