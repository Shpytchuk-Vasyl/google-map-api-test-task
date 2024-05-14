"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Item } from "../api/v1/markers/route";

export interface MarkerContextType {
  markers: Item[];
  setMarkers: (markers: Item[]) => void;
  addMarker: (marker: Item) => void;
  removeMarker: (marker: Item) => void;
  updateMarker: (marker: Item) => void;
  clearAllMarkers: () => void;
}

const MarkersContext = createContext<MarkerContextType>({
  markers: [],
  setMarkers: () => {},
  clearAllMarkers: () => {},
  addMarker: () => {},
  removeMarker: () => {},
  updateMarker: () => {},
});

export const useMarkers = () => {
  return useContext(MarkersContext);
};

type Props = {
  children: React.ReactNode;
};

export const MarkersProvider = ({ children }: Props) => {
  const [markers, setMarkers] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/v1/markers")
      .then((response) => response.json())
      .then((data) => {
        setMarkers(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const addMarker = useCallback((marker: Item) => {
    fetch("/api/v1/markers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(marker),
    })
      .then((response) => response.json())
      .then((data) => {
        setMarkers((prev) => [...prev, data]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const removeMarker = useCallback((marker: Item) => {
    fetch(`/api/v1/markers/${marker.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setMarkers((prev) => prev.filter((m) => m.id != data.id));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const updateMarker = useCallback((marker: Item) => {
    fetch(`/api/v1/markers/${marker.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(marker),
    })
      .then((response) => response.json())
      .then((data) => {
        setMarkers((prev) => prev.map((m) => (m.id == data.id ? data : m)));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const clearAllMarkers = useCallback(() => {
    fetch("/api/v1/markers", {
      method: "DELETE",
    })
      .then(() => {
        setMarkers([]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <MarkersContext.Provider
      value={{
        markers,
        setMarkers,
        addMarker,
        removeMarker,
        updateMarker,
        clearAllMarkers,
      }}
    >
      {children}
    </MarkersContext.Provider>
  );
};
