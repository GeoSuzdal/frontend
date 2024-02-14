// import './App.css'
import React from 'react'
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import MapView from "./views/MapView.jsx";
import MapViewV2 from "./views-v2/MapView.jsx";



export function App() {

  return (
      <Router>
        <Routes>
          <Route path={'/'} element={<Navigate replace to={'/v2/map'}/>}/>
          <Route path={'/map'} element={<MapView/>}/>
          <Route path={'/v2/map'} element={<MapViewV2/>}/>
        </Routes>
      </Router>
  )
}

