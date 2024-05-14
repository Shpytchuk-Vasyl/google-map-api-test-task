import { db } from "@/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { FromBDtoItem, FromItemtoBD } from "./helper";

export type Item = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
};


export async function GET(request: Request): Promise<Response> {
  const col = collection(db, "markers");
  const snapshot = await getDocs(col);
  return Response.json(
    //@ts-ignore
    snapshot.docs.map((doc) => FromBDtoItem({ id: doc.id, ...doc.data() }))
  );
}

export async function POST(request: Request): Promise<Response> {
  const col = collection(db, "markers");
  const docRef = await addDoc(col, FromItemtoBD(await request.json()));
  const data = await getDoc(doc(col, docRef.id));
  console.log(data);
  //@ts-ignore
  return Response.json(FromBDtoItem({ id: data.id, ...data.data() }));
}

export async function DELETE(request: Request): Promise<Response> {
  const col = collection(db, "markers");
  const docs = await getDocs(col);
  const deletePromises = docs.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  return Response.json([]);
}
