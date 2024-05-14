"use client";
import React, { useCallback, useState } from "react";
import { MarkerF as GoogleMarker, InfoWindowF } from "@react-google-maps/api";
import { Item } from "../api/v1/markers/route";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

type Props = {
  marker: Item;
  removeMarker: (marker: Item) => void;
  updateMarker: (marker: Item) => void;
  isNew?: boolean;
  clusterer?: any;
};

const Marker = ({
  marker,
  removeMarker,
  updateMarker,
  isNew,
  clusterer,
}: Props) => {
  const [isOpen, setIsOpen] = useState(isNew || false);
  const [isEdit, setIsEdit] = useState(isNew || false);
  const [newName, setNewName] = useState(marker.name);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onOpen = () => {
    if (!isNew) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("marker", marker.id);
      router.push(pathname + "?" + params.toString());
    }
    setIsOpen(true);
  };

  const onClose = useCallback(() => {
    if (isNew) removeMarker(marker);

    setIsOpen(false);
    setIsEdit(false);
  }, [isNew, marker, removeMarker]);

  const onEdit = useCallback(() => {
    setIsEdit(true);
  }, []);

  const onCancel = useCallback(() => {
    if (isNew) removeMarker(marker);

    setIsEdit(false);
  }, [isNew, marker, removeMarker]);

  const onSave = useCallback(() => {
    updateMarker({ ...marker, name: newName });
    setIsEdit(false);
  }, [marker, newName, updateMarker]);

  const onDelete = useCallback(() => {
    removeMarker(marker);
    setIsOpen(false);
  }, [marker, removeMarker]);

  const onDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return console.error("No latLng");
      updateMarker({
        ...marker,
        location: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
      });
    },
    [marker, updateMarker]
  );

  return (
    <>
      <GoogleMarker
        position={marker.location}
        onClick={onOpen}
        draggable
        onDragEnd={onDragEnd}
        label={{
          text: marker.name.split(" ").slice(-1)[0] || "",
          color: "white",
          fontSize: "16px",
        }}
        clusterer={clusterer}
      >
        {isOpen && (
          <InfoWindowF position={marker.location} onCloseClick={onClose}>
            <div className="flex flex-col gap-3 w-56 p-2">
              {isEdit ? (
                <input
                  className="border border-gray-300 rounded-md p-1 focus:outline-none"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  defaultValue={marker.name}
                />
              ) : (
                <h2 className="font-bold">{marker.name}</h2>
              )}
              <LastUpdated lastUpdated={marker.timestamp} />
              <div className="flex justify-between items-center">
                {isEdit ? (
                  <>
                    <button
                      className="bg-white hover:bg-gray-100 text-slate-700 hover:text-black py-2 px-4 rounded"
                      onClick={onSave}
                      disabled={!newName}
                    >
                      Save
                    </button>
                    <button
                      className="bg-white hover:bg-gray-100 text-slate-700 hover:text-black py-2 px-4 rounded"
                      onClick={onCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-white hover:bg-gray-100 text-slate-700 hover:text-black py-2 px-4 rounded"
                      onClick={onEdit}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-white hover:bg-gray-100 text-slate-700 hover:text-black py-2 px-4 rounded"
                      onClick={onDelete}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMarker>
    </>
  );
};

export default Marker;

const LastUpdated = ({ lastUpdated }: { lastUpdated: string }) => {
  const formattedLastUpdated = formatDistanceToNow(new Date(lastUpdated), {
    addSuffix: true,
  });
  return <p>Last updated {formattedLastUpdated}</p>;
};
