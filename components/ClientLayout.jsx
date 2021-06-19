import ActiveBookingCard from '../components/ActiveBookingCard'
import AdminSubscriptionCard from '../components/AdminSubscriptionCard'
import db from '../db'

export default function ClientLayout({ user, setUser }) {
  const reloadClientInfo = () => {
    db.users.getClients().then((res) => {
      setUser(
        res.data.find((usr) => {
          if (usr.email == user.email) return true
        })
      )
    })
  }

  const myBookings = () => {
    const mybooks = user.history.filter(
      (history) => history.state === 'pending'
    )
    return mybooks != '' ? (
      mybooks.map((history) => {
        return (
          <>
            <ActiveBookingCard
              subscriptions={user.user_subscriptions}
              key={history.booking_id}
              history={history}
              buttonVisible={false}
              reloadClientInfo={reloadClientInfo}
              coverageVisible={false}
              buttonCancel={true}
            />
          </>
        )
      })
    ) : (
      <p>
        <i>No Active Bookings</i>
      </p>
    )
  }

  const pastBookings = () => {
    const pastbooks = user.history.filter(
      (history) => history.state != 'pending'
    )
    return pastbooks != '' ? (
      pastbooks.map((history) => {
        return (
          <>
            <ActiveBookingCard
              subscriptions={user.user_subscriptions}
              key={history.booking_id}
              history={history}
              buttonVisible={false}
              reloadClientInfo={reloadClientInfo}
              coverageVisible={false}
              buttonCancel={false}
            />
          </>
        )
      })
    ) : (
      <p>
        <i>No Past Bookings</i>
      </p>
    )
  }

  const listOfSubscriptions = () => {
    return user.user_subscriptions.map((sub) => {
      return (
        <AdminSubscriptionCard
          key={sub.usersSubscriptionID}
          subscription={sub}
          reloadClientInfo={reloadClientInfo}
        />
      )
    })
  }

  return (
    <div className='client-account-wrapper'>
      <div className='client-account-name-section'>
        <span className='list-initial'>
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      </div>
      <div className='client-account-bookings'>
        <h2>My bookings</h2>
        <div className='client-account-activeb'>{myBookings()}</div>
        <div className='client-account-pastb'>
          <h2>Past bookings</h2>
          {pastBookings()}
        </div>
      </div>
      <div className='client-account-subs-section'>
        <h2>My subscriptions</h2>
        <div className='client-account-subs'>{listOfSubscriptions()}</div>
      </div>
    </div>
  )
}