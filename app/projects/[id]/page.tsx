"use client";
import database from "@/firebase/firestore";
import { Project } from "@/models/project";
import { User } from "@/models/user";
import { DocumentReference, Timestamp, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const [projectDetail, setProjectDetail] = useState<
    Project | null | undefined
  >(undefined);
  useEffect(() => {
    getDoc(doc(database, "projects", params.id)).then(async (value) => {
      if (value.exists()) {
        const temp = value.data();
        let participantsList: Promise<User>[] = [];
        if (temp.participants)
          participantsList = temp.participants.flatMap(
            async (value: DocumentReference, index: any) => {
              return await getDoc(value).then((value) => {
                if (value.exists()) return value.data() as User;
                else return [];
              });
            }
          );
        const resultParticipantList = await Promise.all(participantsList);
        setProjectDetail({
          name: temp.name,
          id: value.id,
          startTime: temp.startTime
            ? Timestamp.fromMillis(temp.startTime.seconds * 1000).toDate()
            : undefined,
          endTime: temp.endTime
            ? Timestamp.fromMillis(temp.endTime.seconds * 1000).toDate()
            : undefined,
          participants: resultParticipantList,
        });
      }
    });
  }, []);
  return (
    <div className="p-5">
      <h1 className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        {projectDetail?.name}
      </h1>
    </div>
  );
}
