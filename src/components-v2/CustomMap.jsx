import React, {useEffect, useRef} from 'react';
import {useGeographic} from 'ol/proj';
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import {View} from "ol";
import Map from "ol/Map.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {Icon, Style} from "ol/style";
import {TileWMS} from "ol/source.js";
import 'ol/ol.css'
import {defaults as defaultInteractions, DragRotateAndZoom,} from 'ol/interaction.js';
import {defaults as defaultControls, OverviewMap} from 'ol/control.js';
import './CustomMap.css'

const geoserverEndpoint = import.meta.env.VITE_GEOSERVER_ENDPOINT
const screenWidth = window.innerWidth * 0.01
const screenHeight = window.innerHeight * 0.01
const iconSize = 1

const CustomMap = ({
                       GeoJSONData,
                       mapWidth,
                       selectedFeature,
                       addRaster,
                       handleRaster,
                       mapCenter,
                       setSelectedFeature
                   }) => {
    const mapRef = useRef();
    const mapInstanceRef = useRef();
    useGeographic();

    const styleFunction = (feature) => {
        let isSelected = false
        if (selectedFeature) {
            try {
                isSelected = feature.values_.id === selectedFeature.current.properties.id
            } catch (e) {
                isSelected = feature.values_.id === selectedFeature.current.values_.id
            }
        }


        let iconSrc = isSelected ? '/church_active.svg' : '/church_inactive.svg';
        // Default style using the icon source
        return new Style({
            image: new Icon({
                scale: iconSize, // Adjust scale as necessary
                src: iconSrc,
            }),
            zIndex: isSelected ? 100 : 2
        });
    };

    const oldMapLayer = new TileLayer({
        source: new TileWMS({
            url: `${geoserverEndpoint}/geoserver/vsmr_ws/wms`,
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                'tiled': true,
                'STYLES': '',
                'LAYERS': `vsmr_ws:vsmr_map_1350_3857`,
                'exceptions': 'application/vnd.ogc.se_inimage',
                'tilesOrigin': -20037508.342789244 + "," + -20048966.1040146
            },
        })
    });

    useEffect(() => {
        const OSMLayer = new TileLayer({
            source: new OSM(),
            zIndex: 0
        });
        const miniOSMLayer = new TileLayer({
            source: new OSM(),
            zIndex: 0
        });

        const empireBorders = new TileLayer({
            source: new TileWMS({
                url: `${geoserverEndpoint}/geoserver/vsmr_ws/wms`,
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    'tiled': true,
                    'STYLES': '',
                    'LAYERS': `vsmr_ws:provinces_1897`,
                    'exceptions': 'application/vnd.ogc.se_inimage',
                    'tilesOrigin': -20037508.342789244 + "," + -20048966.1040146
                },
                zIndex: 1
            })
        });


        const view = new View({
            center: mapCenter,
            zoom: 7,
        })
        const overviewView = new View({
            zoom: 7,
            center: mapCenter,
        });

        const overviewMapControl = new OverviewMap({
            className: 'ol-overviewmap ol-custom-overviewmap',
            layers: [
                miniOSMLayer,
                oldMapLayer,
                empireBorders,
            ],
            view: overviewView,
            // collapseLabel: 'overview',
            // label: 'overview',
            collapsed: false,
        });


        if (!mapInstanceRef.current) {
            mapInstanceRef.current = new Map({
                target: mapRef.current,
                layers: [
                    OSMLayer,
                    oldMapLayer,
                    empireBorders,
                ],
                view: view,
                controls: defaultControls().extend([overviewMapControl]),
                interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
            });
        }

        if (Array.isArray(GeoJSONData.features)) {
            const GeoJSONSrc = new VectorSource({
                features: new GeoJSON().readFeatures(GeoJSONData),
            });
            const GeoJSONLayer = new VectorLayer({
                source: GeoJSONSrc,
                style: styleFunction,
            });
            mapInstanceRef.current.addLayer(GeoJSONLayer);
            GeoJSONLayer.setZIndex(2)

            mapInstanceRef.current.on('singleclick', function (evt) {
                const feature = mapInstanceRef.current.forEachFeatureAtPixel(evt.pixel, function (feature) {
                    return feature;
                });
                // feature.
                if (feature) {
                    setSelectedFeature(feature)
                }
            });
        }

    }, [GeoJSONData, addRaster]);

    useEffect(() => {
        console.log(selectedFeature.current)
        if (mapInstanceRef.current) {
            let pt1Len = 500
            let pt2Len = 1000
            let size = mapInstanceRef.current.getSize()
            let mapView = mapInstanceRef.current.getView()
            // mapView.animate(
            //     {
            //         center: [38, 57],
            //         duration: pt1Len,
            //         zoom: 6,
            //     },
            //     {
            //         center: mapCenter,
            //         duration: pt2Len,
            //         // resolution: mapView.getResolution(),
            //         zoom: 8,
            //     }
            // )
            mapInstanceRef.current.getView().centerOn(mapCenter, size, [screenWidth * 27.5, screenHeight * 50])

            // mapInstanceRef.current.getView().setZoom(8)
        }
    }, [mapCenter, selectedFeature]);

    useEffect(() => {
        mapInstanceRef.current.getAllLayers()[1].setOpacity(addRaster ? 1 : 0)
    }, [addRaster])

    return (
        <div style={{position: 'absolute'}}>
            <div ref={mapRef} className={'map'} style={{width: mapWidth, height: '100vh'}}/>
            <button onClick={handleRaster} className={"layerToggleButton"}
                    style={{position: "absolute", left: 0}}>Toggle raster
            </button>
        </div>

    )
};

export default CustomMap;