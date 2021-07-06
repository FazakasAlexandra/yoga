import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../../../components/Layout'
import { useRouter } from 'next/router'
import AdminLayout from '../../../../components/AdminLayout'
import AdminClassesLayout from '../../../../components/AdminClassesLayout'
import ClassCard from '../../../../components/ClassCard'
import ClassCardForm from '../../../../components/ClassCardForm'
import db from '../../../../db.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Feedback from '../../../../components/Feedback'
import Loader from '../../../../components/Loader'

export default function Page() {
  const router = useRouter()
  const [session, loading] = useSession()
  const [classesData, setClassesData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [cardsPerPage, setCardsPerPage] = useState(6)
  const [classForm, setClassForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) router.push({ pathname: '/' })
  }, [session])

  useEffect(() => {
    db.classes.getClasses()
    .then((res) => setClassesData(res.data.reverse()))
    .finally(() => setIsLoading(false))
  }, [])

  const deleteClass = (id) => {
    db.classes.deleteClass(id).then((res) => {
      db.classes.getClasses()
      .then((res) => setClassesData(res.data.reverse()))
    })
  }

  const addNewClass = (
    e,
    nameClass,
    level,
    onlinePrice,
    offlinePrice,
    description
  ) => {
    e.preventDefault()
    const newClass = {
      name: nameClass,
      level: level,
      online: onlinePrice,
      offline: offlinePrice,
      description: description,
    }

    db.getJWT().then((jwt) => {
      db.classes.postNewClass(jwt, newClass).then((res) => {
        setClassForm(false)
        db.classes
          .getClasses()
          .then((res) => setClassesData(res.data.reverse()))
      })
    })
  }

  const indexOfLastCard = currentPage * cardsPerPage
  const indexOfFirstCard = indexOfLastCard - cardsPerPage
  const currentCards = classesData.slice(indexOfFirstCard, indexOfLastCard)

  const classesCards = () => {
    return classForm == 'true' && currentPage == 1
      ? [
          <ClassCardForm
            setClassForm={setClassForm}
            addNewClass={addNewClass}
          />,
          currentCards.map((classesData) => {
            return (
              <ClassCard
                key={classesData.id}
                id={classesData.id}
                name={classesData.name}
                level={classesData.level}
                offprice={classesData.offline_price}
                onprice={classesData.online_price}
                attend={classesData.attendences}
                deletion={deleteClass}
              />
            )
          }),
        ]
      : [
          currentCards.map((classesData) => {
            return (
              <ClassCard
                key={classesData.id}
                id={classesData.id}
                name={classesData.name}
                level={classesData.level}
                offprice={classesData.offline_price}
                onprice={classesData.online_price}
                attend={classesData.attendences}
                deletion={deleteClass}
              />
            )
          }),
        ]
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const Pagination = ({ cardsPerPage, totalCards, paginate }) => {
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(totalCards / cardsPerPage); i++) {
      pageNumbers.push(i)
    }

    return (
      <div className='bottomPagination'>
        <ul className='pagination'>
          {pageNumbers.map((number) => (
            <li key={number} className='page-item'>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  paginate(number)
                }}
                id={`pagination${number}`}
                style={
                  +number === +currentPage
                    ? { background: 'rgba(237, 236, 244, 1)' }
                    : { background: 'white' }
                }
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <Layout activeTab={'account'}>
      <AdminLayout activeTab={'classes'}>
        <AdminClassesLayout activeTab={'list'}>
          {currentPage == 1 ? (
            <div className='button-add-class'>
              <button
                className='button-white admin'
                style={{
                  margin: '15px 0 0 30px ',
                }}
                onClick={() => {
                  setClassForm('true')
                }}
              >
                <FontAwesomeIcon icon={faPlus} size='lg' />
              </button>
            </div>
          ) : (
            ''
          )}
          <div className='class-body-list'>{classesCards()}</div>
          {isLoading ? <Loader/> : !classesData.length && !classForm ? (
            <Feedback message='Time to add some classes !' iconName='smile' />
          ) : (
            <Pagination
              cardsPerPage={cardsPerPage}
              totalCards={classesData.length}
              paginate={paginate}
            />
          )}
        </AdminClassesLayout>
      </AdminLayout>
    </Layout>
  )
}
