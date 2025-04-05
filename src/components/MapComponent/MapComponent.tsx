import React, { useState, useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { useGeographic } from "ol/proj";
import { createStringXY } from "ol/coordinate.js";
import { defaults as defaultControls } from "ol/control/defaults.js";
import { NominatimReverseResponse } from "@/utility/util";
import "ol/ol.css";
import { getAddressFromLatLng } from "@/utility/util";
import MousePosition from "ol/control/MousePosition.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";
import Overlay from "ol/Overlay.js";
import { PostProps } from "../Post";
import PopoverCard from "../PopoverCard";

interface HoverContent extends PostProps {
  footer?: JSX.Element;
}

interface MapComponentProps {
  clickMapHandler?: (
    address: Promise<NominatimReverseResponse>,
    coord?: number[]
  ) => void;
  height?: string;
  width?: string;
  showDot?: boolean;
  initialMarkers?: number[][];
  hoverContent?: HoverContent[];
  zoom?: number;
  center?: boolean;
  showHover?: boolean;
  disableControls?: boolean;
}

const MapComponent = ({
  clickMapHandler,
  height,
  width,
  showDot = false,
  initialMarkers = [],
  zoom = 11,
  center = false,
  showHover = false,
  hoverContent = [],
  disableControls = false,
}: MapComponentProps) => {
  const mapRef = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer | null>(null);
  const currentOverlay = useRef<Overlay | null>(null);
  const [overlayIndex, setOverlayIndex] = useState<number>(-1);
  const popOverRef = useRef<HTMLDivElement | null>(null);
  const [showPopover, setShowPopover] = useState<boolean>(false);

  useGeographic();

  useEffect(() => {
    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    });

    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: "EPSG:4326",
      className: "custom-mouse-position",
      target: document.getElementById("mouse-position") || undefined,
    });

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      controls: disableControls
        ? []
        : defaultControls().extend([mousePositionControl]),
      interactions: disableControls ? [] : undefined,
      target: "uniqueMap",
      layers: [osmLayer, vectorLayer],
      view: new View({
        center:
          center && initialMarkers
            ? initialMarkers[0]
            : [-73.92475163156223, 40.7021485032154],
        zoom,
      }),
    });

    mapRef.current = map;
    vectorLayerRef.current = vectorLayer;

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      initialMarkers.forEach((marker, index) => {
        addDotToMap(marker[1], marker[0]);
      });

      mapRef.current.addEventListener("click", (event: any) => {
        clickMapHandler?.(
          getAddressFromLatLng(event.coordinate[0], event.coordinate[1]),
          [event.coordinate[0], event.coordinate[1]]
        );
        if (showDot) {
          clearDots();
          addDotToMap(event.coordinate[1], event.coordinate[0]);
        }
      });

      mapRef.current.addEventListener("pointermove", (event: any) => {
        const feature = mapRef.current?.forEachFeatureAtPixel(
          event.pixel,
          (feature) => feature
        );
        if (feature) {
          const featureCoords = feature?.getGeometry()?.getExtent() || [];
          const findIndex = initialMarkers.findIndex(
            (pointArr) =>
              pointArr[0] === featureCoords[0] &&
              pointArr[1] === featureCoords[1]
          );
          if (findIndex >= 0) {
            setOverlayIndex(findIndex);
            if (popOverRef.current) {
              if (currentOverlay.current) {
                mapRef.current?.removeOverlay(currentOverlay.current);
              }
              const overlay = new Overlay({
                element: popOverRef.current,
                positioning: "top-center",
                id: findIndex,
                position: initialMarkers[findIndex],
              });
              setShowPopover(true);
              mapRef.current?.addOverlay(overlay);
              currentOverlay.current = overlay;
              overlay.setPosition(initialMarkers[findIndex]);
            }
          }
        } else {
          setShowPopover(false);
          if (currentOverlay.current) {
            mapRef.current?.removeOverlay(currentOverlay.current);
            currentOverlay.current = null;
          }
        }
      });
    }

    return () => {
      mapRef.current?.removeEventListener("click", () => {});
      mapRef.current?.removeEventListener("pointermove", () => {});
    };
  }, [mapRef.current, popOverRef.current, initialMarkers]);

  const addDotToMap = (lat: number, lon: number) => {
    if (!mapRef.current || !vectorLayerRef.current) return;

    const point = new Point([lon, lat]);
    const feature = new Feature({
      geometry: point,
    });

    feature.setStyle(
      new Style({
        image: new Icon({
          src: "https://openlayers.org/en/latest/examples/data/dot.png",
          scale: 0.75,
          color: [60, 179, 113], //rgba
        }),
      })
    );

    const vectorSource = vectorLayerRef.current.getSource();
    vectorSource?.addFeature(feature);
  };

  const clearDots = () => {
    if (!mapRef.current || !vectorLayerRef.current) return;
    const vectorSource = vectorLayerRef.current.getSource();
    vectorSource?.clear();
  };

  const closeModal = () => {
    if (mapRef.current && currentOverlay.current) {
      mapRef.current.removeOverlay(currentOverlay.current);
    }
    setShowPopover(false);
  };

  const htmlMapRef = useRef(null);

  const {
    title,
    description,
    files,
    coverImg,
    footer,
    id: postId,
  } = hoverContent?.[overlayIndex] || {};

  return (
    <>
      <div
        style={{
          height: height ? height : "500px",
          width: width ? width : "100%",
        }}
        id="uniqueMap"
        className="map-container"
        ref={htmlMapRef}
      />
      {showHover && htmlMapRef.current && mapRef.current && (
        <PopoverCard
          title={title}
          display={showPopover ? "flex" : "none"}
          description={description}
          footer={footer}
          postId={postId}
          coverImage={coverImg}
          onClose={closeModal}
          ref={popOverRef}
        />
      )}
    </>
  );
};

export default MapComponent;
