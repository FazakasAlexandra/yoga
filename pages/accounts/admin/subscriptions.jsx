import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/AdminLayout'
import SubscriptionCard from '../../../components/SubscriptionCard'
import SubscriptionForm from '../../../components/SubscriptionForm'
import Loader from '../../../components/Loader'
import db from '../../../db'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash'
import Feedback from '../../../components/Feedback'

export default function Page() {
  const router = useRouter()
  const [session, loading] = useSession()
  const [subscriptions, setSubscriptions] = useState([])
  const [subscriptionsForms, setSubscriptionsForms] = useState([]) // [1, 2, 3, ...]
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) router.push({ pathname: '/' })
  }, [session])

  useEffect(() => {
    db.subscriptions
      .getSubscriptions()
      .then((res) => setSubscriptions(res.data))
      .finally(()=> setIsLoading(false))
  }, [])

  const removeSubscription = (id) =>
    setSubscriptions(
      subscriptions.filter((subscription) => +subscription.id != +id)
    )

  const removeForm = (id) =>
    setSubscriptionsForms(subscriptionsForms.filter((form) => form !== id))

  const addNewSubscription = (subscription) =>
    setSubscriptions([subscription, ...subscriptions])

  const getSubscriptions = () => {
    return subscriptions.length == 0 && subscriptionsForms.length === 0 ? (
      <Feedback
        message='There are no subscriptions registered. Add your first subscription today!'
        iconName='smile'
      />
    ) : (
      subscriptions.map((subscription) => {
        return (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            admin={true}
            removeSubscriptionCard={removeSubscription}
          />
        )
      })
    )
  }

  const getSubscriptionForms = () => {
    return subscriptionsForms.map((subscriptionForm) => {
      return (
        <SubscriptionForm
          id={subscriptionForm}
          key={subscriptionForm}
          removeForm={removeForm}
          addNewSubscriptionCard={addNewSubscription}
        />
      )
    })
  }

  return (
    <Layout activeTab={'account'}>
      <AdminLayout activeTab={'subscriptions'}>
        <button
          className='button-white admin'
          style={{ alignSelf: 'baseline' }}
          onClick={() =>
            setSubscriptionsForms([_.uniqueId('form'), ...subscriptionsForms])
          }
        >
          <FontAwesomeIcon icon={faPlus} size='lg' />
        </button>
        <div className='subscriptions-admin'>
          {
            isLoading ? <Loader/> : subscriptions.length || subscriptionsForms.length ?
              <>
                {getSubscriptionForms()}
                {getSubscriptions()}
              </>
              : <Feedback
              message='Time to add some subscriptions !'
              iconName='smile'
            />
          }

        </div>
      </AdminLayout>
    </Layout>
  )
}
