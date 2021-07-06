import SubscriptionCard from '../components/SubscriptionCard'
import Layout from '../components/Layout'
import Loader from '../components/Loader'
import { useState, useEffect } from 'react'
import db from '../db.js'

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    db.subscriptions.getSubscriptions()
    .then((res) => {
      setSubscriptions(res.data)
    })
    .finally(() => setIsLoading(false))
  }, [])

  const getSubscriptions = () => {
    return subscriptions.map((subscription) => {
      return (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      )
    })
  }

  return (
    <Layout activeTab={'subscriptions'}>
      <div className='subscriptions'>
        <div className='color'></div>
        <div className='radius'></div>
        {
          isLoading ? <Loader /> :
            subscriptions.length ? getSubscriptions() :
              <h2 className="no-data-txt">NO SUBSCRIPTIONS AVAILABLE</h2>
        }
      </div>
    </Layout>
  )
}
