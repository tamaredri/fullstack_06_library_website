import React from 'react'
import { useParams } from 'react-router-dom'

export default function PersonalArea() {
    const {userid} = useParams();

  return (
    <div>
        user: {userid} : personal area
    </div>
  )
}
