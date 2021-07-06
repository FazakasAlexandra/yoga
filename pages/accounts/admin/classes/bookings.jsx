import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../../../components/Layout'
import { useRouter } from 'next/router'
import AdminLayout from '../../../../components/AdminLayout'
import AdminClassesLayout from '../../../../components/AdminClassesLayout'
import DayScheduleClass from '../../../../components/DayScheduleClass'
import BookingCard from '../../../../components/BookingCard'
import Loader from '../../../../components/Loader'
import Feedback from '../../../../components/Feedback'
import TextField from '@material-ui/core/TextField'
import db from '../../../../db'
import { formatDate } from '../../../../utilities.js'

export default function Page() {
  const router = useRouter()
  const today = new Date().toISOString().slice(0, 10)
  const [session, loading] = useSession()
  const [date, setDate] = useState(today)
  const [classes, setClasses] = useState([])
  const [bookings, setBookings] = useState([])
  const [activeClass, setActiveClass] = useState(null)
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) router.push({ pathname: '/' })
  }, [session])

  useEffect(() => {
    db.schedules.getDayClasses(today)
      .then((res) => {
        setClasses(res.data)
      })
      .finally(() => setClassesLoading(false))
  }, [])

  useEffect(() => {
    db.schedules.getDayClasses(date)
      .then((res) => {
        setBookings([])
        setActiveClass(false)
        setClasses(res.data)
      })
  }, [date])

  const handleArrowButton = (weekScheduleId) => {
    setBookingsLoading(true);

    const updatedActieClass = classes.map((yogaClass) => {
      if (yogaClass.schedules_weeks_id == weekScheduleId) {
        setActiveClass(yogaClass)
        return { ...yogaClass, active: true }
      }

      return { ...yogaClass, active: false }
    })

    setClasses(updatedActieClass)

    db.bookings.getClassBookings(weekScheduleId)
    .then((res) => {
      setBookings(res.data)
    })
    .finally(() => setBookingsLoading(false))
  }

  const getDayScheduleClasses = () => {
    return classes.map((yogaClass) => {
      return (
        <DayScheduleClass
          key={yogaClass.schedules_weeks_id}
          dayScheduleClass={yogaClass}
          handleArrowButton={handleArrowButton}
          minimal={true}
          active={yogaClass.active}
        />
      )
    })
  }

  const changeStatus = (status, bookingId) => {
    db.getJWT().then((jwt) => {
      db.bookings.changeStatus(jwt.jwtToken, bookingId, status).then((res) => {
        db.bookings
          .getClassBookings(activeClass.schedules_weeks_id)
          .then((res) => {
            setBookings(res.data)
          })
      })
    })
  }

  const getBookings = () => {
    return bookings.map((booking) => {
      return (
        <BookingCard
          booking={booking}
          page='admin'
          changeStatus={changeStatus}
        />
      )
    })
  }

  const displayMessages = () => {
    if (classes.length > 0 && activeClass) {
      return (
        <Feedback iconName='sadface' message='No bookings for this class yet' />
      )
    }

    if (classes.length > 0 && !activeClass) {
      return <Feedback iconName='smile' message='Check bookings for a class' />
    }
  }

  return (
    <Layout activeTab={'account'}>
      <AdminLayout activeTab={'classes'}>
        <AdminClassesLayout activeTab={'bookings'}>
          <div className='admin-bookings'>
            <div>
              <div className='week_schedule-form'>
                <TextField
                  id='date'
                  label='Date'
                  type='date'
                  defaultValue={date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: new Date().toISOString().slice(0, 10),
                  }}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className='day-schedule-cards bookings'>
                {classesLoading ? <Loader /> : classes.length > 0 ? (getDayScheduleClasses()) : (
                  <Feedback
                    iconName='sadface'
                    message={`No classes scheduled for ${formatDate(
                      date,
                      'string'
                    )}`}
                  />
                )}
              </div>
            </div>
            <div className='booking-cards'>
              {bookingsLoading ? <Loader /> : bookings.length > 0 ? getBookings() : displayMessages()}
            </div>
          </div>
        </AdminClassesLayout>
      </AdminLayout>
    </Layout>
  )
}
