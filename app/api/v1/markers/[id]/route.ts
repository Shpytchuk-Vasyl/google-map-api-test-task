import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { FromItemtoBD } from "../helper";

export async function GET(
  request: Request,
  { params }: { params: any }
): Promise<Response> {
  console.log("GET /api/v1/markers");
  const docRef = doc(db, "markers", params.id);
  const docSnap = await getDoc(docRef);
  return Response.json(
    //@ts-ignore
    FromBDtoItem({ id: docSnap.id, ...docSnap.data() })
  );
}

export async function PUT(
  request: Request,
  { params }: { params: any }
): Promise<Response> {
  const data = await request.json();
  data.timestamp = new Date().toISOString();
  const docRef = doc(db, "markers", params.id || "");
  await setDoc(docRef, FromItemtoBD(data));
  return Response.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: any }
): Promise<Response> {
  console.log("DELETE /api/v1/markers");
  const docRef = doc(db, "markers", params.id);
  await deleteDoc(docRef);
  return Response.json({ id: params.id });
}
