import React, {useEffect, useRef, useState} from 'react';
import {getGeoJSONData} from "../services/GeoJSONDataService.js";
import CustomMap from "../components-v2/CustomMap.jsx";
import {Button} from "@geist-ui/core";
import SideMenu from "../components/SideMenu.jsx";

const MapViewV2 = () => {
    const [GeoJSONData, setGeoJSONData] = useState({})
    const selectedFeatureRef = useRef()
    const [addRaster, setAddRaster] = useState(true)
    const [mapCenter, setMapCenter] = useState([0,0])

    useEffect(() => {
        const fetchGeoJSONData = async () => {
            let result = await getGeoJSONData();

            result.features.sort((a, b) => {
                return parseInt(a.properties.id, 10) - parseInt(b.properties.id, 10);
            });

            selectedFeatureRef.current = result.features[0];
            setMapCenter(selectedFeatureRef.current.geometry.coordinates)

            setGeoJSONData(result);
        };

        fetchGeoJSONData();
    }, []);

    function featureNext() {
        //TODO: select next feature in GeoJSONData and put it in selectedFeatureRef. If feature was last, set to the first feature.
        if (GeoJSONData.features && GeoJSONData.features.length > 0) {
            const currentIndex = GeoJSONData.features.indexOf(selectedFeatureRef.current);
            const nextIndex = (currentIndex + 1) % GeoJSONData.features.length; // Wrap to the first feature if currently at the last
            selectedFeatureRef.current = GeoJSONData.features[nextIndex];
        }
        try {
            setMapCenter(selectedFeatureRef.current.geometry.coordinates)
        } catch (e) {
            setMapCenter(selectedFeatureRef.values_.geometry.flatCoordinates)
        }
    }

    function featurePrevious() {
        //TODO: select previous feature in GeoJSONData and put it in selectedFeatureRef. If feature was first, set to the last feature
        if (GeoJSONData.features && GeoJSONData.features.length > 0) {
            const currentIndex = GeoJSONData.features.indexOf(selectedFeatureRef.current);
            const previousIndex = (currentIndex - 1 + GeoJSONData.features.length) % GeoJSONData.features.length; // Wrap to the last feature if currently at the first
            selectedFeatureRef.current = GeoJSONData.features[previousIndex];
        }
        try {
            setMapCenter(selectedFeatureRef.current.geometry.coordinates)
        } catch (e) {
            setMapCenter(selectedFeatureRef.values_.geometry.flatCoordinates)
        }
    }

    function featureSet(feature) {
        //TODO: set selectedFeatureRef to passed feature.
        selectedFeatureRef.current = feature;
        console.log(selectedFeatureRef)

        try {
            setMapCenter(selectedFeatureRef.current.geometry.coordinates)
        } catch (e) {
            setMapCenter(feature.values_.geometry.flatCoordinates)
        }
    }

    function handleRasterClick() {
        setAddRaster(!addRaster)
    }

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
                onClick={featurePrevious}
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
                onClick={featureNext}
            >
                <div style={{position: "absolute", transform: "scale(3)"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="white"
                              d="M10.061 19.061L17.121 12l-7.06-7.061l-2.122 2.122L12.879 12l-4.94 4.939z"/>
                    </svg>
                </div>
            </Button>
            <SideMenu dotInfo={selectedFeatureRef.current} />
            <div style={{
                position: "absolute",
                height: "100dvh",
                right: "45%",
                width: '5%',
                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
                zIndex: 5
            }}/>
        <CustomMap
            GeoJSONData={GeoJSONData}
            selectedFeature={selectedFeatureRef}
            addRaster={addRaster}
            handleRaster={handleRasterClick}
            mapCenter={mapCenter}
            mapWidth={'60vw'}
            setSelectedFeature={featureSet}
        />
        </>
    );
};

export default MapViewV2;