"use client";
import firebaseApp from "@/firebase/firebaseApp";
import database from "@/firebase/firestore";
import { Project } from "@/models/project";
import { User } from "@/models/user";
import { compareDates, search } from "@/utils";
import { initializeApp } from "firebase/app";
import {
  DocumentReference,
  Timestamp,
  collection,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import moment from "moment-timezone";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MouseEvent } from "react";

const getProjects = async ({ onChange }: { onChange: (data: any) => void }) => {
  onChange(undefined);
  const projectsSnapshot = await getDocs(collection(database, "projects"));
  const result = projectsSnapshot.docs.map(async (value, index) => {
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
    return {
      ...temp,
      id: value.id,
      startTime: temp.startTime
        ? Timestamp.fromMillis(temp.startTime.seconds * 1000).toDate()
        : undefined,
      endTime: temp.endTime
        ? Timestamp.fromMillis(temp.endTime.seconds * 1000).toDate()
        : undefined,
      participants: resultParticipantList,
    } as Project;
  });
  console.log(result);
  onChange(await Promise.all(result));
};
export default function Projects() {
  const router = useRouter();
  const dropdownToggleRef = useRef(null);
  const [searchParam, setSearchParam] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[] | undefined>([]);
  function handleDropDownItemClick(
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ): void {
    if (dropdownToggleRef.current)
      (dropdownToggleRef.current as HTMLButtonElement).click();
  }
  useEffect(() => {
    getProjects({ onChange: (data: any) => setProjects(data) });
  }, []);
  useEffect(() => {

    setProjects(search([...(projects ?? [])], "name", searchParam));
  }, [searchParam]);
  return (
    <div className={`p-5`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearchParam(new FormData(e.target as HTMLFormElement).get("search")?.toString() ?? "")
        }}
      >
        <div className="flex">
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Your Email
          </label>
          <button
            ref={dropdownToggleRef}
            id="dropdown-button"
            data-dropdown-toggle="dropdown"
            className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            type="button"
          >
            All categories{" "}
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <div
            id="dropdown"
            className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 border-2"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdown-button"
            >
              <li>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={handleDropDownItemClick}
                >
                  Đang hoạt động
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={handleDropDownItemClick}
                >
                  Đã hoàn thành
                </button>
              </li>
            </ul>
          </div>
          <div className="relative w-full">
            <input
              type="search"
              id="search-dropdown"
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
              placeholder="Search for projects"
              required
              name="search"
            />
            <button
              type="submit"
              className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>
      </form>
      <div className={`rounded border-2 flex h-full w-full mt-2`}>
        {projects ? (
          <div className="p-2 w-full">
            {projects.map((value, index) => (
              <div className="border-b-2 my-2 w-full font-semibold cursor-pointer hover:text-blue-400 pb-2" onClick={() => {router.push("/projects/" + value.id)}}>
                <div className="w-full flex justify-between">
                  <div className="font-semibold ">{value.name}</div>{" "}
                  {compareDates(
                    value.endTime
                      ? value.endTime.toISOString()
                      : new Date().toISOString(),
                    new Date().toISOString()
                  ) > 0 ? (
                    <div className="font-light text-green-400 text-xs">
                      Done
                    </div>
                  ) : (
                    <div className="font-light text-yellow-400 text-xs">
                      {" "}
                      Working
                    </div>
                  )}
                </div>
                <div className="w-full font-light text-sm flex justify-between">
                  <div>
                    {value.startTime
                      ? moment(value.startTime).tz("Asia/Bangkok").format("LL")
                      : "Unsettled timeline"}
                  </div>
                  <div>
                    {value.participants.map((value, index) => (
                      <img
                        src={value.photoURL}
                        className="rounded-full w-4"
                        alt="photoURL"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}
