import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import Catalog from '../components/Catalog';
import SingleBook from '../components/SingleBook';
import FallBack from '../components/FallBack';
import HomePage from '../components/HomePage';
import PersonalArea from '../components/PersonalArea';
import Subscribe from '../components/Subscribe';

export default function UserRoutes() {
    return (
        <>
            <div>
                navigation bar
            </div>
            <Routes>
                <Route path="/subscribe" element={<Subscribe />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/personalarea" element={<PersonalArea />} />
                <Route path="/catalog">
                    <Route index element={<Catalog />} />
                    <Route path=":bookid" element={<SingleBook />} />
                </Route>

                <Route path="/" element={<Navigate to={`home`} />} />
                <Route path="*" element={<FallBack />} />
            </Routes>
        </>
    )
}
