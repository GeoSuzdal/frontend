import React, {useEffect, useState} from 'react';
import cls from './SideMenu.module.css'
import {getPointData} from "../services/RecordsService.js";

const SideMenu = ({dotInfo, handleRaster}) => {
    const [info, setInfo] = useState({})

    useEffect(() => {
        console.log(dotInfo)
        const fetchData = async () => {
            let result = {}
            if (dotInfo.values_) {
                result = await getPointData(dotInfo.values_.record_id)
            } else if (dotInfo.properties) {
                result = await getPointData(dotInfo.properties.record_id)
            }
            setInfo(result)
        }
        fetchData()
    }, [dotInfo]);

    const handleRasterBClick = () => {
        handleRaster()
    }

    return (
        <div className={cls.sideMenuContainer}>
            {info.title ?
                <>
                    <button onClick={handleRasterBClick} style={{position: "absolute", left: 0}}>Toggle raster</button>
                    <img src={info.image_url}/>
                    <h1>{info.title}</h1>
                    <p>{info.body}</p>
                </>
                : <p>{JSON.stringify(dotInfo)}</p>
            }
        </div>
    );
};

export default SideMenu;