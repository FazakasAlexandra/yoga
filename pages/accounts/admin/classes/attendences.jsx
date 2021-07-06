import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../../../components/Layout'
import { useRouter } from 'next/router'
import AdminLayout from '../../../../components/AdminLayout'
import Loader from '../../../../components/Loader'
import AdminClassesLayout from '../../../../components/AdminClassesLayout'
import Feedback from '../../../../components/Feedback'
import Chart from 'react-google-charts'
import db from '../../../../db'

export default function Page() {
  const router = useRouter()
  const [session, loading] = useSession()
  const [attendences, setAttendences] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !session) router.push({ pathname: '/' })
  }, [session])

  useEffect(() => {
    db.classes.dailyAttendences('all')
    .then((res) => {
      setAttendences(
        res.data
          .map((item) => item.class_name)
          .reduce(function (a, b) {
            if (a.indexOf(b) < 0) a.push(b)
            return a
          }, [])
          .sort()
          .map((cls) =>
            [
              cls,
              formatData(res.data.filter((item) => item.class_name == cls)),
            ].flat()
          )
      )
    })
    .finally(() => setIsLoading(false))
  }, [])

  const formatData = (data) => {
    const today = new Date()
    const thisMonth = data.filter(
      (item) =>
        item.date_day >=
        new Date(today.getFullYear(), today.getMonth(), 1).toJSON().slice(0, 10)
    ).length

    const lastThreeMonths = data.filter(
      (item) =>
        item.date_day >=
        new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())
          .toJSON()
          .slice(0, 10)
    ).length

    const thisYear = data.filter(
      (item) =>
        item.date_day >=
        new Date(today.getFullYear(), 0, 1).toJSON().slice(0, 10)
    ).length

    return [thisMonth, lastThreeMonths, thisYear]
  }

  return (
    <Layout activeTab={'account'}>
      <AdminLayout activeTab={'classes'}>
        <AdminClassesLayout activeTab={'attendences'}>
          <div className='chart-container' style={{ width: '100%' }}>
            {
              isLoading ? <Loader/> : attendences.length ?
                <Chart
                  width={'99%'}
                  height={'700px'}
                  chartType='BarChart'
                  loader={<Loader />}
                  data={[
                    ['Class', 'This Month', 'Last Three Months', 'This Year'],
                    ...attendences,
                  ]}
                  options={{
                    title: 'Classes Attendences',
                    bar: { groupWidth: '80%' },
                    colors: ['#8BDD7C', '#83BCFF', '#F46565'],
                    fontName: 'roboto, sans-serif',
                    fontSize: 17,
                    legend: {
                      textStyle: {
                        fontSize: 14,
                      },
                    },
                    titleTextStyle: {
                      fontSize: 20,
                    },
                  }}
                /> :
                <Feedback
                  iconName='sadface'
                  message="Your classes got not enough attendances for statistics !"
                />
            }
          </div>
        </AdminClassesLayout>
      </AdminLayout>
    </Layout>
  )
}
