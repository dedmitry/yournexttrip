import React from "react";
import { Routes, Route } from "react-router-dom";


import Main from "@pages/Main";
import TripDetails from "@/pages/TripDetails";
import NotFound from "@pages/404";


const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;
