import { Item } from "./route";
import { GeoPoint, Timestamp } from "firebase/firestore";
type ItemBD = {
  id: string;
  name: string;
  location: GeoPoint;
  timestamp: Timestamp;
};

export function FromBDtoItem(data: ItemBD) {
  return {
    id: data.id,
    name: data.name,
    location: {
      lat: data.location.latitude,
      lng: data.location.longitude,
    },
    timestamp: data.timestamp.toDate().toISOString(),
  };
}

export function FromItemtoBD(item: Item) {
  console.log(item);
  return {
    name: item.name,
    location: new GeoPoint(item.location.lat, item.location.lng),
    timestamp: Timestamp.fromDate(new Date(item.timestamp)),
  };
}
