import React, {useEffect, useState} from 'react';
import {getGeoJSONData} from "../services/GeoJSONDataService.js";
import {CustomMap} from "../components/CustomMap.jsx";
import SideMenu from "../components/SideMenu.jsx";

const MapView = () => {

    const [GeoJSONData, setGeoJSONData] = useState({})
    const [dotInfo, setDotInfo] = useState({})
    const [mapCenter, setMapCenter] = useState([0, 0])
    const [addRaster, setAddRaster] = useState(true)

    useEffect(() => {
        const fetchGeoJSONData = async () => {
            let result = await getGeoJSONData();

            // Find the feature with feature.properties.id == 1
            const targetFeature = result.features.find(feature => feature.properties.id === "1");

            if (targetFeature && targetFeature.geometry && targetFeature.geometry.coordinates) {
                // Set map center to the coordinates of the found feature
                setMapCenter(targetFeature.geometry.coordinates)
            }
            setDotInfo(targetFeature)

            setGeoJSONData(result);
        };

        fetchGeoJSONData();
    }, []);

    const handleRaster = () => {
        setAddRaster(!addRaster)
    }

    return (
        <>
            <SideMenu dotInfo={dotInfo} handleRaster={handleRaster}/>
            <CustomMap
                style={{position: "absolute"}}
                GeoJSONData={GeoJSONData}
                setDotInfoCallback={setDotInfo}
                mapCenter={mapCenter}
                addRaster={addRaster}
            />
        </>
    );
};

export default MapView;