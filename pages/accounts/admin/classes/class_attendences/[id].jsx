import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../../../../components/Layout'
import { useRouter } from 'next/router'
import AdminLayout from '../../../../../components/AdminLayout'
import AdminClassesLayout from '../../../../../components/AdminClassesLayout'
import Feedback from '../../../../../components/Feedback'
import Chart from 'react-google-charts'
import db from '../../../../../db'
import Loader from '../../../../../components/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

export default function Page() {
  const router = useRouter()
  const [session, loading] = useSession()
  const [data, setData] = useState([])
  const [className, setClassName] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !session) router.push({ pathname: '/' })
  }, [session])

  useEffect(() => {
    db.classes.dailyAttendences(router.query.id)
    .then((res) => {
      setData(formatData(res.data))
      res.data.length == 0 ? '' : setClassName(res.data[0].class_name)
    })
    .finally(() => setIsLoading(false))
  }, [])

  const formatData = (data) => {
    const today = new Date()
    const thisWeek = data.filter(
      (item) =>
        item.date_day >=
        new Date(
          today.setDate(
            today.getDate() - today.getDay() + (today.getDay() == 0 ? -6 : 1)
          )
        )
          .toJSON()
          .slice(0, 10)
    ).length

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

    let numbers

    thisWeek == '' && thisMonth == '' && lastThreeMonths == '' && thisYear == ''
      ? (numbers = null)
      : (numbers = [
          [
            'Element',
            'Attendences',
            { role: 'style' },
            {
              sourceColumn: 0,
              role: 'annotation',
              type: 'string',
              calc: 'stringify',
            },
          ],
          ['This week', thisWeek, '#F46565', null],
          ['This month', thisMonth, '#FFC765', null],
          ['Last three months', lastThreeMonths, '#8BDD7C', null],
          ['This Year', thisYear, '#83BCFF', null],
        ])

    return numbers
  }

  return (
    <Layout activeTab={'account'}>
      <AdminLayout activeTab={'classes'}>
        <AdminClassesLayout activeTab={'list'}>
          <div className='button-add-class'>
            <button
              className='button-white admin btn-class-attendence'
              onClick={() => {
                router.back()
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft} size='2x' />
            </button>
          </div>
          <div className='chart-container' style={{ width: '100%' }}>
            {isLoading ? <Loader/> : !data ? (
              <Feedback
                iconName='sadface'
                message={`This class has not enough attendances for statistics !`}
              />
            ) : (
              <Chart
                width={'100%'}
                height={'500px'}
                chartType='BarChart'
                loader={<Loader />}
                data={data}
                options={{
                  title: className,
                  bar: { groupWidth: '85%' },
                  hAxis: { gridlines: { count: 4 } },
                  fontName: 'roboto, sans-serif',
                  fontSize: 17,
                  legend: {
                    position: 'none',
                  },
                  titleTextStyle: {
                    fontSize: 20,
                  },
                }}
              />
            )}
          </div>
        </AdminClassesLayout>
      </AdminLayout>
    </Layout>
  )
}
