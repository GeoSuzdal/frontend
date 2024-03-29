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
import {defaults as defaultInteractions, DragRotateAndZoom, Select,} from 'ol/interaction.js';
import {defaults as defaultControls, OverviewMap} from 'ol/control.js';
import './CustomMap.css'

const geoserverEndpoint = import.meta.env.VITE_GEOSERVER_ENDPOINT
const screenWidth = window.innerWidth * 0.01
const screenHeight = window.innerHeight * 0.01

const styleFunction = (feature, isSelected = false) => {
    // let iconSrc = isSelected ? activeIcon : inactiveIcon; // Use conditional logic for the icon source
    // If you placed SVGs in the public folder, construct the path like so:
    let iconSrc = isSelected ? '/church_active.svg' : '/inactive.svg';

    // Default style using the icon source
    return new Style({
        image: new Icon({
            scale: 3, // Adjust scale as necessary
            src: iconSrc,
        }),
    });
};

const select = new Select({
    size: 3,
    zoom: 3,
    style: new Style({
        image: new Icon({
            scale: 3,
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23ff2600' d='M7 7a5 5 0 1 1 6 4.9V17a1 1 0 1 1-2 0v-5.1A5.002 5.002 0 0 1 7 7m2.489 9.1a1 1 0 0 1-.838 1.14c-1.278.195-2.293.489-2.96.815c-.335.164-.534.313-.637.422a.685.685 0 0 0-.021.023c.033.039.09.096.19.169c.28.207.749.435 1.418.644C7.968 19.728 9.863 20 12 20s4.032-.272 5.359-.687c.67-.209 1.138-.437 1.418-.644c.1-.073.157-.13.19-.169a.644.644 0 0 0-.021-.023c-.103-.109-.302-.258-.637-.422c-.667-.326-1.682-.62-2.96-.815a1 1 0 1 1 .301-1.977c1.388.21 2.622.547 3.539.996c.457.224.884.5 1.208.842c.33.347.603.82.603 1.399c0 .811-.524 1.4-1.034 1.777c-.53.392-1.233.702-2.01.945c-1.57.49-3.674.778-5.956.778c-2.282 0-4.387-.288-5.955-.778c-.778-.243-1.48-.553-2.01-.945C3.524 19.9 3 19.311 3 18.5c0-.58.273-1.052.603-1.4c.325-.342.751-.617 1.208-.84c.917-.45 2.152-.786 3.538-.997a1 1 0 0 1 1.14.838Z'/%3E%3C/g%3E%3C/svg%3E"
        })
    })
});


export function CustomMap({
                              GeoJSONData,
                              style,
                              setDotInfoCallback,
                              mapCenter,
                              addRaster,
                              setMapCenter,
                              handleRaster,
                              mapWidth
                          }) {
    const mapRef = useRef();
    const mapInstanceRef = useRef();
    const selectedFeatureRef = useRef(null);

    useGeographic();

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
                },
                zIndex: 1
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
                ukrLineLayer,
                ukrPolygonLayer,
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
                    ukrLineLayer,
                    ukrPolygonLayer,
                ],
                view: view,
                controls: defaultControls().extend([overviewMapControl]),
                interactions: defaultInteractions().extend([new DragRotateAndZoom(), select]),
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
                    if (selectedFeatureRef.current) {
                        selectedFeatureRef.current.setStyle(styleFunction(selectedFeatureRef.current, false))
                    }
                    feature.setStyle(styleFunction(feature, true))
                    selectedFeatureRef.current = feature

                    setDotInfoCallback(feature.getProperties())
                    setMapCenter(feature.values_.geometry.flatCoordinates)
                }
            });
        }

    }, [GeoJSONData, addRaster]);

    useEffect(() => {
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
            mapInstanceRef.current.getView().centerOn(mapCenter, size, [screenWidth * 25, screenHeight * 50])

            // mapInstanceRef.current.getView().setZoom(8)
        }
    }, [mapCenter]);

    useEffect(() => {
        mapInstanceRef.current.getAllLayers()[1].setOpacity(addRaster ? 1 : 0)
    }, [addRaster])

    return (
        <div style={style}>
            <div ref={mapRef} className={'map'} style={{width: mapWidth, height: '100vh'}}/>
            <button
                onClick={handleRaster}
                className={"layerToggleButton"}
                style={{position: "absolute", left: 0}}
            >
                Toggle raster
            </button>
        </div>

    )

}

