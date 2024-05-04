import React from 'react'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'
import ChangeProfilePicture from './ChangeProfilePicture'
import DeleteAccount from './DeleteAccount'

const index = () => {
  return (
    <div>
        <ChangeProfilePicture/>
        <EditProfile/>
        <UpdatePassword/>
        <DeleteAccount/>
    </div>

  )
}

export default index