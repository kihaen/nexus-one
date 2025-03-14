// MapComponent.js
import React, { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Google from 'ol/source/Google.js';
import {useGeographic} from 'ol/proj';
import {createStringXY} from 'ol/coordinate.js';
import {defaults as defaultControls} from 'ol/control/defaults.js';
import { NominatimReverseResponse } from '@/utility/util';
import 'ol/ol.css';
import { getAddressFromLatLng } from '@/utility/util';
import MousePosition from 'ol/control/MousePosition.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { StadiaMaps } from 'ol/source';

interface MapComponentProps  {
    clickMapHandler?  : ( address : Promise<NominatimReverseResponse>, coord? : number[]) => void
    height? : string
    width? : string
    showDot? : boolean
    initialMarkers? :  number[][]
}

const MapComponent = ({clickMapHandler, height, width, showDot = false, initialMarkers = []} : MapComponentProps)=> {
    const [map, setMap] = useState<Map | null>(null);
    const [vectorLayer, setVectorLayer] = useState<VectorLayer | null>(null);
    useGeographic();

    useEffect(() => {
      console.log("mapComponent initialize was called")
        // const source = new Google({
        //   key : process.env.NEXT_PUBLIC_GOOGLE_MAP_TILE_KEY || "",
        //   scale: 'scaleFactor2x',
        //   highDpi: true,
        // });

        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new StadiaMaps({
              layer : "osm_bright"
            })
        });

        const mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:4326',
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position') || undefined,
        });

        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        const map = new Map({
            controls: defaultControls().extend([mousePositionControl]),
            target: "uniqueMap",
            layers: [osmLayer, vectorLayer],
            view: new View({
                center: [-73.92475163156223, 40.7021485032154],
                zoom: 11,
            }),
        });

        setMap(map);
        setVectorLayer(vectorLayer);

        return () => {
            map.setTarget(undefined);
            
        };
    }, []);

    useEffect(() => {
      if (map) {
        console.log( initialMarkers, "initial markers")
          initialMarkers.forEach((marker)=> { // paint initial markers
            addDotToMap(marker[1], marker[0])
          })
          map.addEventListener('click', (event : any)=>{ // TODO : update typing here
            console.log(event.coordinate[0], event.coordinate[1])
            clickMapHandler?.(getAddressFromLatLng(event.coordinate[0], event.coordinate[1]), [event.coordinate[0], event.coordinate[1]])
            if (showDot){
              clearDots()
              addDotToMap(event.coordinate[1], event.coordinate[0])
            } 
        });
      }
      return ()=>{
        map?.removeEventListener('click', ()=>{});
      }
    }, [map]);

    const addDotToMap = (lat: number, lon: number) => {
        if (!map || !vectorLayer) return;

        const point = new Point([lon, lat]);
        const feature = new Feature({
            geometry: point,
        });

        feature.setStyle(new Style({
            image: new Icon({
                src: 'https://openlayers.org/en/latest/examples/data/dot.png',
                scale: .75,
                color : [60, 179, 113] //rgba
            }),
        }));

        const vectorSource = vectorLayer.getSource()
        vectorSource?.addFeature(feature);
    };

    const clearDots = () =>{
      if (!map || !vectorLayer) return;
      const vectorSource = vectorLayer.getSource()
      vectorSource?.clear()
    }

    return (
        <div style={{height: height ? height : '500px', width: width ? width : '100%', margin: '30px 0 20px 0'}} id="uniqueMap" className="map-container" />
    );
}

export default MapComponent;