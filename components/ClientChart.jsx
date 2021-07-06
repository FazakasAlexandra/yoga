import Chart from 'react-google-charts'
import Loader from './Loader'
import Image from 'next/image'

export default function ClientChart({ info }) {
  const pieOptions = {
    title: '',
    slices: [
      {
        color: '#33d460',
      },
      {
        color: '#ff5d23',
      },
      {
        color: '#c32121',
      },
    ],
    legend: {
      position: 'right',
      alignment: 'start',
      textStyle: {
        color: '#646262',
        fontSize: 16,
      },
    },
    pieSliceText: 'none',
    tooltip: {
      showColorCode: true,
      text: 'value',
      textStyle: {
        fontName: 'roboto, sans-serif',
        fontSize: 16,
      },
    },
    chartArea: {
      left: 0,
      top: 20,
      width: '100%',
      height: '100%',
    },
  }

  const attendedClasses = info.filter(
    (element) => element.state == 'present'
  ).length
  const absentClasses = info.filter(
    (element) => element.state == 'absent'
  ).length
  const canceledClasses = info.filter(
    (element) => element.state == 'canceled'
  ).length

  return (
    <div className='client-chart'>
      <h3>Attendences</h3>
      {canceledClasses || absentClasses || attendedClasses ?
        <Chart
          width={'100%'}
          height={'250px'}
          chartType='PieChart'
          loader={<Loader />}
          data={[
            ['Classes', 'Attendence'],
            ['Attended classes', attendedClasses],
            ['Canceled Classes', canceledClasses],
            ['Absent Classes', absentClasses],
          ]}
          options={pieOptions}
          rootProps={{ 'data-testid': '7' }}
        />
        : <div style={{margin:"1rem 0rem 0rem 1rem"}}><Image src='/assets/noData.svg' width={220} height={230} /></div>}
    </div>
  )
}
