import React, {useEffect, useRef, useState} from 'react';
import {useGeographic} from 'ol/proj';
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import {View} from "ol";
import Map from "ol/Map.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {Fill, Stroke, Style, Circle, Text, IconImage, Icon} from "ol/style";
import {TileWMS, XYZ} from "ol/source.js";

const geoserverEndpoint = import.meta.env.VITE_GEOSERVER_ENDPOINT

const styleFunction = (feature) => {
    switch (feature.values_.icon) {

        case "house":
            return new Style({
                image: new Icon( {
                    scale: 3,
                        src: "https://api.iconify.design/fluent-emoji-flat/house.svg"
                    }),
            });
        case "hotel":
            return new Style({
                image: new Icon( {
                    scale: 3,
                    src: "https://api.iconify.design/fluent-emoji-flat/hotel.svg"
                }),
            });
        case "ship":
            return new Style({
                image: new Icon({
                    scale: 3,
                    src: "https://api.iconify.design/fluent-emoji-flat/ship.svg"
                })
            })
        default:
            return new Style({
                image: new Circle({
                    radius: 15,
                    fill: new Fill({color: 'red'}),
                    stroke: new Stroke({color: 'white', width: 3})
                }),
                text: new Text({
                    text: "Default", // Assuming 'name' is a property of your features
                    fill: new Fill({color: '#000'}),
                    stroke: new Stroke({color: '#fff', width: 2})
                })
            });
    }

};


export function CustomMap({GeoJSONData, style, setDotInfoCallback, mapCenter, addRaster}) {
    const mapRef = useRef();
    const oldMapLayerRef = useRef(); // Ref for the old map layer
    const [newMap, setNewMap] = useState(null);
    const [featureProperties, setFeatureProperties] = useState(null);

    useGeographic();

    useEffect(() => {
        const OSMLayer = new TileLayer({source: new OSM()});

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
                visible: addRaster
            })
        });

        oldMapLayerRef.current = oldMapLayer;

        const ukrPolygonLayer = new TileLayer({
            source: new TileWMS({
                url: `${geoserverEndpoint}/geoserver/vsmr_ws/wms`,
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    'tiled': true,
                    'STYLES': '',
                    'LAYERS': `vsmr_ws:vsmr_polygon`,
                    'exceptions': 'application/vnd.ogc.se_inimage',
                    'tilesOrigin': -20037508.342789244 + "," + -20048966.1040146
                }
            })
        });

        const ukrLineLayer = new TileLayer({
            source: new TileWMS({
                url: `${geoserverEndpoint}/geoserver/vsmr_ws/wms`,
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    'tiled': true,
                    'STYLES': '',
                    'LAYERS': `vsmr_ws:vsmr_line`,
                    'exceptions': 'application/vnd.ogc.se_inimage',
                    'tilesOrigin': -20037508.342789244 + "," + -20048966.1040146
                }
            })
        });

        const map = new Map({
            target: mapRef.current,
            layers:[
                OSMLayer,
                oldMapLayer,
                ukrLineLayer,
                ukrPolygonLayer
            ],
            view: new View({
                center: mapCenter,
                zoom: 7,
            }),
        });


        if (Array.isArray(GeoJSONData.features)) {
            const GeoJSONSrc = new VectorSource({
                features: new GeoJSON().readFeatures(GeoJSONData),
            });
            const GeoJSONLayer = new VectorLayer({
                source: GeoJSONSrc,
                style: styleFunction,
            });
            newMap.addLayer(GeoJSONLayer);

            newMap.on('singleclick', function (evt) {
                const feature = newMap.forEachFeatureAtPixel(evt.pixel, function (feature) {
                    return feature;
                });

                setDotInfoCallback(feature)
                newMap.getView().setCenter(feature.values_.geometry.flatCoordinates)

            });
        }

        setNewMap(map);

        if (!addRaster) {
            if (map) {
                map.removeLayer(oldMapLayer)
            }
        }

    }, [mapCenter, GeoJSONData]);

    useEffect(() => {
        if (newMap) {
            const layers = newMap.getLayers().getArray();
            const oldLayer = layers.find(layer => layer === oldMapLayerRef.current);
            if (oldLayer) {
                oldLayer.setVisible(addRaster);
            }
        }
    }, [addRaster, newMap]);

    if (newMap) {
        newMap.getView().setCenter(mapCenter)
        newMap.getView().setZoom(8)
    }

    return (
        <div style={style}>
            <style>
                {`.ol-overlaycontainer-stopevent {
                display: none;
            }`}
            </style>
            <div ref={mapRef} style={{width: '50vw', height: '100vh'}}/>
        </div>

    )

}

