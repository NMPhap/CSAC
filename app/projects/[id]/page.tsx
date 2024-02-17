"use client";
import database from "@/firebase/firestore";
import { Activity } from "@/models/activity";
import { Project } from "@/models/project";
import { User } from "@/models/user";
import moment from "moment-timezone";
import {
  DocumentReference,
  Timestamp,
  addDoc,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { loadingFiler, removeLoadingFilter, search } from "@/utils";
import { toast } from "react-toastify";
import ActivityContainer from "@/components/activityContainer";
import { Song } from "@/models/song";
async function getActivity(
  activity: DocumentReference
): Promise<Activity | Activity[]> {
  const value = await getDoc(activity);
  if (value.exists()) {
    const activityData = value.data();
    const subtaskList = activityData.subTask
      ? await Promise.all(
          (activityData.subTask as DocumentReference[]).flatMap(
            async (value, index) => {
              return await getActivity(value);
            }
          )
        )
      : [];
    return {
      ...activityData,
      startDate: activityData.startDate
        ? Timestamp.fromMillis(activityData.startDate.seconds * 1000).toDate()
        : undefined,
      endDate: activityData.endDate
        ? Timestamp.fromMillis(activityData.endDate.seconds * 1000).toDate()
        : undefined,
      subtask: subtaskList,
    } as Activity;
  } else return [];
}
async function getSongs(value: DocumentReference) {
  const song = await getDoc(value);
  if (song.exists()) {
    const songData = song.data();
    let performerList = (songData.performers as DocumentReference[]).flatMap(
      async (user: DocumentReference, index: any) => {
        return await getDoc(user).then((userDoc) => {
          if (userDoc.exists()) return userDoc.data() as User;
          else return [];
        });
      }
    );
    const resultPerformerList = await Promise.all(performerList);
    return { ...songData, performers: resultPerformerList } as Song;
  } else return [];
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const [projectDetail, setProjectDetail] = useState<
    Project | null | undefined
  >(undefined);
  useEffect(() => {
    getDoc(doc(database, "projects", params.id)).then(async (value) => {
      if (value.exists()) {
        const temp = value.data();
        console.log(temp);
        //Get participants data from DocumentReference
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
        //Get activity data from DocumentReference
        let activityList: Promise<Activity>[] = [];
        if (temp.activities)
          activityList = temp.activities.flatMap(
            async (value: DocumentReference, index: any) => {
              return await getActivity(value);
            }
          );
        const resultActivityList = await Promise.all(activityList);
        console.log(resultActivityList);
        //Get songs data from DocumentReference
        let songList: Promise<Song>[] = [];
        if (temp.songs)
          songList = temp.songs.flatMap(
            async (value: DocumentReference, index: any) => {
              return await getSongs(value);
            }
          );
        const songs = await Promise.all(songList);
        console.log(songs);
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
          activities: resultActivityList,
          songs: songs,
        });
      }
    });
  }, []);
  //Add Marquee className to p if the email-name is too long
  useEffect(() => {
    if (projectDetail) {
      projectDetail.participants.forEach((element, index) => {
        const emailText = document.getElementById(`emailText-${index}`);
        if (
          emailText &&
          emailText.scrollWidth > emailText.parentElement!.offsetWidth
        )
          emailText.className += " marquee";
      });
    }
  }, [projectDetail]);
  return (
    <div className="p-5">
      <div className="relative">
        <h1 className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          {projectDetail?.name}
        </h1>
        {projectDetail &&
          search(
            projectDetail?.participants,
            "email",
            sessionStorage.getItem("email")
          ).length <= 0 && (
            <button
              onClick={async () => {
                loadingFiler(document.body);
                await updateDoc(doc(database, "projects", params.id), {
                  participants: arrayUnion(
                    doc(
                      database,
                      "users",
                      sessionStorage.getItem("userId") ?? ""
                    )
                  ),
                })
                  .then((res) => {
                    toast("Joined successfully");
                    location.reload();
                  })
                  .catch((error) => {
                    console.log(error);
                    toast("Something went wrong!!!");
                  });
                removeLoadingFilter(document.body);
              }}
              type="button"
              className="absolute top-0 right-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Join
            </button>
          )}
      </div>
      <div id="contentContainer" style={{ width: "100%", height: "100%" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div style={{ width: "59%" }}>
            <a
              href="#"
              className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              style={{ height: "33vw" }}
            >
              <h3
                style={{
                  fontWeight: 600,
                  fontSize: "2vw",
                  textAlign: "center",
                }}
              >
                Danh sach tiet muc
              </h3>
              <div style={{ paddingTop: "1vw" }}>
                {projectDetail?.songs &&
                  projectDetail.songs.map((value, index) => (
                    <div className="overflow-x-hidden w-full ">
                      <div
                        className="marquee"
                        style={{
                          display: "inline-flex",
                          whiteSpace: "nowrap",
                          fontSize: "1.5vw",
                          height: "3vw",
                        }}
                      >
                        {`${value.name.toUpperCase()} -\xa0`}{" "}
                        {value.performers.map((value, index, array) => {
                          if (index != array.length - 1) {
                            return (
                              <p>{`${value.name
                                .split(" ")
                                .map(
                                  (s, index) =>
                                    s[0].toUpperCase() +
                                    s.toLowerCase().slice(1)
                                )
                                .join(" ")},\xa0`}</p>
                            );
                          } else {
                            return <p>{`${value.name}. `}</p>;
                          }
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </a>
          </div>
          <div style={{ width: "40%" }}>
            <a
              href="#"
              className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              style={{ height: "33vw" }}
            >
              <h3
                style={{
                  fontWeight: 600,
                  fontSize: "2vw",
                  textAlign: "center",
                }}
              >
                Danh sach thanh vien
              </h3>
              <div className="flex grow flex-col">
                {projectDetail &&
                  projectDetail.participants.map((value, index) => (
                    <div className=" flex border-stale-400 w-full whitespace-nowrap ">
                      <div className="h-full flex content-center m-0 flex-wrap self-center">
                        <img
                          src={value.photoURL}
                          className=" rounded-full mr-1 p-1"
                          style={{
                            height: "3.5vw",
                            minWidth: "fit-content",
                          }}
                        />
                      </div>
                      <div className="flex w-full overflow-x-hidden">
                        <p
                          id={`emailText-${index}`}
                          className={`whitespace-nowrap h-fit self-center`}
                          style={{ fontSize: "1.5vw" }}
                        >{`${value.name} - ${value.email}`}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </a>
          </div>
        </div>
        <div style={{ marginTop: "1vw" }}>
          <div className="block w-full p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h3
              style={{
                fontWeight: 600,
                fontSize: "2vw",
                textAlign: "center",
              }}
            >
              Danh sach hoat dong
            </h3>
            {projectDetail &&
              projectDetail.activities?.map((value, _) => (
                <ActivityContainer activity={value} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
