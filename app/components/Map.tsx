"use client";
import React, { useCallback, useState } from "react";
import {
  GoogleMap,
  MarkerClustererF,
  useJsApiLoader,
} from "@react-google-maps/api";
import Marker from "./Marker";
import { useSearchParams } from "next/navigation";
import { Item } from "../api/v1/markers/route";
import { useMarkers } from "../context/Markers";

const containerStyle = {
  width: "100%",
  height: "95vh",
};

const standartCenter = {
  lat: 49.839719597443775,
  lng: 24.029745010293023,
};

const options = {
  mapTypeControl: false,
  scrollwheel: true,
  fullscreenControl: true,
  zoomControl: true,
  streetViewControl: false,
};

export const Map = () => {
  const query = new URLSearchParams(useSearchParams().toString());
  const { markers, addMarker, removeMarker, updateMarker, clearAllMarkers } =
    useMarkers();
  const center = getCenter(query, markers);
  const [newMarker, setNewMarker] = useState<React.ReactNode | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string,
  });

  const onClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return console.error("No latLng");
      const location = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      const marker = {
        id: "-1",
        name: "New Marker",
        location,
        timestamp: new Date().toISOString(),
      };
      setNewMarker(
        <Marker
          key={marker.id}
          marker={marker}
          removeMarker={() => setNewMarker(null)}
          updateMarker={(newMarker) => {
            addMarker(newMarker);
            setNewMarker(null);
          }}
          isNew
        />
      );
    },
    [addMarker]
  );

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        options={options}
        onClick={onClick}
      >
        <MarkerClustererF>
          {(clusterer) => (
            <>
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  marker={marker}
                  removeMarker={removeMarker}
                  updateMarker={updateMarker}
                  clusterer={clusterer}
                />
              ))}
              {newMarker}
            </>
          )}
        </MarkerClustererF>
      </GoogleMap>
      {markers.length !== 0 && (
        <button
          className="fixed left-4 top-4 bg-white hover:bg-gray-100 text-slate-700 hover:text-black py-2 px-4 rounded"
          onClick={clearAllMarkers}
        >
          Clear
        </button>
      )}
    </>
  ) : (
    <></>
  );
};

function getCenter(
  query: URLSearchParams,
  quests: Item[]
): { lat: number; lng: number } {
  if (query.has("lat") && query.has("lng"))
    return {
      lat: Number(query.get("lat")),
      lng: Number(query.get("lng")),
    };

  if (query.has("marker")) {
    const questId = query.get("marker");
    const quest = quests.find((quest) => quest.id === questId);
    console.log(quest, "found quest", quests);
    if (quest) {
      return quest.location;
    }
  }

  return standartCenter;
}
