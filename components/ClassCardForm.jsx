import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { TextField } from '@material-ui/core'
import { useState } from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import { ToastContainer, toast } from 'react-toastify'

export default function ClassCardForm({ setClassForm, addNewClass }) {
  const [nameClass, setNameClass] = useState('')
  const [onlinePrice, setOnlinePrice] = useState('')
  const [offlinePrice, setOfflinePrice] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState('')

  const handleChange = (event) => {
    setLevel(event.target.value)
  }

  const subscriptionList = () => {
    const levels = ['intermediate', 'beginner', 'advanced']
    return levels.map((lev, index) => {
      return (
        <MenuItem key={index} value={lev} style={{ background: 'white' }}>
          {lev}
        </MenuItem>
      )
    })
  }

  const fieldsValidation = (name, description) => {
    return name.length > 80
      ? 'name'
      : description.length > 110
      ? 'description'
      : ''
  }

  const style = {
    fontSize: '16px',
    margin: '3px',
    width: '100%',
    background: 'white',
  }

  return (
    <div className='class-card'>
      <form>
        <div className='buttons-classform'>
          <button
            className='button-white'
            onClick={(e) => {
              const arr = [
                nameClass,
                level,
                onlinePrice,
                offlinePrice,
                description,
              ]
              let field = fieldsValidation(nameClass, description)
              arr.findIndex((e) => e === '') > -1
                ? toast.error('All fields are required!')
                : field != ''
                ? toast.error(
                    `Too many characters insterted in ${field} field!`
                  )
                : addNewClass(
                    e,
                    nameClass,
                    level,
                    onlinePrice,
                    offlinePrice,
                    description
                  )
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button
            className='button-white'
            onClick={() => {
              setClassForm(false)
            }}
          >
            <FontAwesomeIcon icon={faTimes} className='info-icon' />
          </button>
        </div>
        <TextField
          id='standard-basic'
          variant='outlined'
          style={style}
          size='medium'
          value={nameClass}
          onChange={(e) => setNameClass(e.target.value)}
          placeholder='Class name'
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <TextField
            id='standard-basic'
            variant='outlined'
            style={style}
            size='small'
            placeholder='Online price'
            type='number'
            value={onlinePrice}
            onChange={(e) => setOnlinePrice(e.target.value)}
          />
          <TextField
            id='standard-basic'
            variant='outlined'
            style={style}
            size='small'
            placeholder='Offline price'
            type='number'
            value={offlinePrice}
            onChange={(e) => setOfflinePrice(e.target.value)}
          />
        </div>
        <FormControl
          variant='outlined'
          style={{
            background: 'white',
            margin: '3px',
            width: '100%',
          }}
        >
          <InputLabel>Level</InputLabel>
          <Select
            required
            value={level ?? ''}
            name='selectlevel'
            onChange={handleChange}
          >
            {subscriptionList()}
          </Select>
        </FormControl>
        <TextField
          width='100%'
          id='standard-basic'
          variant='outlined'
          style={style}
          multiline={true}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Class description'
        />
      </form>
      <ToastContainer />
    </div>
  )
}
