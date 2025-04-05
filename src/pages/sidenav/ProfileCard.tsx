import React from 'react'

const ProfileCard = ({userProf}) => {
  console.log(userProf)
  return (
    <div>
        <div>
          <img src="https://xsgames.co/randomusers/avatar.php?g=male" width={75}/>
          <div>
          {userProf.username}
            </div>
        </div>
        <div>
        @{userProf.id}
        </div>
        <div>
            
        </div>
    </div>
  )
}

export default ProfileCard

