import React from "react";
import "./Map.css";
import {
  MapContainer,
  Map as LeafLetMap,
  TileLayer,
  useMap,
} from "react-leaflet";
import { showDataOnMap } from "./helper";

function ChangeView({ center, zoom, change }) {
  const map = useMap();
  if (change) {
    console.log(change);
    if (change) map.setView(center, zoom);
  }

  return null;
}

function Map({ countries, casesType, center, zoom, change }) {
  return (
    <div className="map">
      <MapContainer>
        <ChangeView center={center} zoom={zoom} change={change} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, casesType)}
      </MapContainer>
    </div>
  );
}

export default Map;
