import React from 'react'

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }
  if(isError) {
        return(
            <div className='notificationError'>
                {message}
            </div>
        )
  }
  return (
    <div className='notification'>
      {message}
    </div>
  )
}

export default Notification