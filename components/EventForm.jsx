import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@material-ui/core/Button'
import { faRedo, faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import TextField from '@material-ui/core/TextField'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import db from '../db'

export default function EventForm({ setEventsForm, addNewEvent }) {
  const [uploadedImage, setUploadedImage] = useState(false)
  const [image, setImage] = useState('')
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [hour, setHour] = useState('')
  const [link, setLink] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  const style = {
    fontSize: '16px',
    margin: '5px',
    width: '100%',
    background: 'white',
  }

  const emptyFields = () => {
    setImage('')
    setName('')
    setDate('')
    setHour('')
    setLink('')
    setLocation('')
    setDescription('')
  }

  function handleFileInputChange(e) {
    const reader = new FileReader()
    console.log('uploading')
    reader.readAsDataURL(e.target.files[0])
    reader.addEventListener('load', () => {
      setImage(reader.result)
      setUploadedImage(true)
    })
  }

  const fieldsValidation = (name, link, location, description) => {
    return name.length > 100
      ? 'name'
      : location.length > 100
      ? 'location'
      : link.length > 100
      ? 'link'
      : description.length > 200
      ? 'description'
      : ''
  }

  return (
    <form className='event-card'>
      <img
        src={image || `${db.baseURL}/public/assets/placeholder.png`}
      />
      <div className='event-details-section'>
        <div className='event-form'>
          <div className='buttons-eventsform'>
            <label htmlFor='upload-photo'>
              <input
                style={{ display: 'none' }}
                id='upload-photo'
                name='upload-photo'
                type='file'
                onChange={(e) => handleFileInputChange(e)}
                accept='image/png, image/jpeg, image/jpg'
              />
              <Button
                color='primary'
                variant='contained'
                component='span'
                style={{ width: '190px' }}
              >
                Upload Picture
              </Button>
            </label>
            <div>
              <button
                className='button-white'
                onClick={(e) => {
                  e.preventDefault()
                  const arr = [name, date, hour, location, description]
                  let field = fieldsValidation(
                    name,
                    link,
                    location,
                    description
                  )
                  uploadedImage === false
                    ? toast.error('Picture is required!')
                    : arr.findIndex((e) => e === '') > -1
                    ? toast.error('All fields except for link are required!')
                    : field != ''
                    ? toast.error(
                        `Too many characters insterted in ${field} field!`
                      )
                    : addNewEvent(
                        e,
                        name,
                        image,
                        date,
                        hour,
                        link,
                        location,
                        description
                      )
                }}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                className='button-white'
                onClick={(e) => {
                  e.preventDefault()
                  emptyFields()
                }}
              >
                <FontAwesomeIcon icon={faRedo} />
              </button>
              <button
                className='button-white delete-event'
                onClick={() => setEventsForm(false)}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>
          <div className='event-inputs'>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '46% 30% 20%',
                justifyContent: 'space-between',
              }}
            >
              <TextField
                id='standard-basic'
                variant='outlined'
                style={style}
                size='small'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Title of the event'
              />

              <TextField
                id='standard-basic'
                variant='outlined'
                style={style}
                size='small'
                placeholder='Date'
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <TextField
                id='standard-basic'
                variant='outlined'
                style={style}
                size='small'
                placeholder='Hour'
                type='text'
                value={hour}
                onChange={(e) => setHour(e.target.value)}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '46% 52%',
                justifyContent: 'space-between',
              }}
            >
              <TextField
                id='standard-basic'
                variant='outlined'
                style={style}
                size='small'
                placeholder='Location'
                type='text'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <TextField
                id='standard-basic'
                variant='outlined'
                style={style}
                size='small'
                placeholder='Link for online event'
                type='text'
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <TextField
              width='100%'
              id='standard-basic'
              variant='outlined'
              maxlength='10'
              style={style}
              multiline={true}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Description of the event...'
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </form>
  )
}
