import React, {useEffect, useState} from 'react';
import {getGeoJSONData} from "../services/GeoJSONDataService.js";
import {CustomMap} from "../components/CustomMap.jsx";
import SideMenu from "../components/SideMenu.jsx";
import {Button} from "@geist-ui/core";
import {Icon} from "@iconify/react";

const MapView = () => {

    const [GeoJSONData, setGeoJSONData] = useState({})
    const [dotInfo, setDotInfo] = useState({})
    const [mapCenter, setMapCenter] = useState([38,57])
    const [addRaster, setAddRaster] = useState(true)
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

    const handleRaster = () => {
        setAddRaster(!addRaster)
    }

    const handleButtonLeft = () => {
        const newIndex = currentFeatureIndex > 0 ? currentFeatureIndex - 1 : GeoJSONData.features.length - 1;
        setCurrentFeatureIndex(newIndex);
        updateFeatureInfo(newIndex);
    }

    const handleButtonRight = () => {
        const newIndex = currentFeatureIndex < GeoJSONData.features.length - 1 ? currentFeatureIndex + 1 : 0;
        setCurrentFeatureIndex(newIndex);
        updateFeatureInfo(newIndex);
    }

    const updateFeatureInfo = (index) => {
        const feature = GeoJSONData.features[index];
        if (feature && feature.geometry && feature.geometry.coordinates) {
            setMapCenter(feature.geometry.coordinates);
        }
        setDotInfo(feature);
    }

    useEffect(() => {
        const fetchGeoJSONData = async () => {
            let result = await getGeoJSONData();

            result.features.sort((a, b) => {
                return parseInt(a.properties.id, 10) - parseInt(b.properties.id, 10);
            });

            const targetFeature = result.features[0];

            if (targetFeature && targetFeature.geometry && targetFeature.geometry.coordinates) {
                setMapCenter(targetFeature.geometry.coordinates)
                console.log(targetFeature.geometry.coordinates)

            }
            setDotInfo(targetFeature)

            setGeoJSONData(result);
        };

        fetchGeoJSONData();
    }, []);

    return (
        <>
            <Button
                style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    backgroundColor: "rgba(77,77,77,.5)",
                    width: "8px",
                    height: "64px",
                    minWidth: 0,
                    minHeight: 0,

                }}
                onClick={handleButtonLeft}
            >
                <div style={{position:"absolute", transform: "scale(3)"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="white" d="M13.939 4.939L6.879 12l7.06 7.061l2.122-2.122L11.121 12l4.94-4.939z"/>
                </svg>
                </div>
            </Button>
            <Button
                width={"32px"}
                height={"64px"}
                style={{
                    position: "absolute",
                    top: "50%",
                    right: 0,
                    transform: "translateY(-50%)",
                    zIndex: 100,
                    backgroundColor: "rgba(77,77,77,.5)"
                }}
                onClick={handleButtonRight}
            >
                <div style={{position: "absolute", transform: "scale(3)"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="white"
                              d="M10.061 19.061L17.121 12l-7.06-7.061l-2.122 2.122L12.879 12l-4.94 4.939z"/>
                    </svg>
                </div>
            </Button>
            <SideMenu dotInfo={dotInfo} />
            <div style={{
                position: "absolute",
                height: "100dvh",
                right: "45%",
                width: '5%',
                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
                zIndex: 5
            }}/>
            <CustomMap
                style={{position: "absolute"}}
                GeoJSONData={GeoJSONData}
                setDotInfoCallback={setDotInfo}
                mapCenter={mapCenter}
                setMapCenter={setMapCenter}
                addRaster={addRaster}
                handleRaster={handleRaster}
                mapWidth={"55vw"}
            />
        </>
    );
};

export default MapView;