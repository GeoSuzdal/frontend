// import './App.css'
import React from 'react'
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import MapView from "./views/MapView.jsx";



export function App() {

  return (
      <Router>
        <Routes>
          <Route path={'/'} element={<Navigate replace to={'/map'}/>}/>
          <Route path={'/map'} element={<MapView/>}/>
        </Routes>
      </Router>
  )
}

