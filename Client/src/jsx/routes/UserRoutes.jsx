import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import UserHome from '../components/UserHome';
import Catalog from '../components/Catalog';
import SingleBook from '../components/SingleBook';
import PersonalArea from '../components/PersonalArea';
import FallBack from '../components/FallBack';

export default function UserRoutes() {

    return (
        <>
            <div>
                navigation bar
            </div>
            <Routes>
                <Route path="/home" element={<UserHome />} />
                <Route path="/personalarea" element={<PersonalArea />} />
                <Route path="/catalog">
                    <Route index element={<Catalog />} />
                    <Route path=":bookid" element={<SingleBook />} />
                </Route>

                <Route path="/" element={<Navigate to={`personalarea`} />} />
                <Route path="*" element={<FallBack />} />
            </Routes>
        </>
    )
}
