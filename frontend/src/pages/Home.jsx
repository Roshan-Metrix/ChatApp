import React, { useContext } from 'react'
import { UserContent } from '../context/UserContext'

const Home = () => {
         
    const { userData } = useContext(UserContent)

  return (
    <div>Hello {userData.name}</div>
  )
}

export default Home