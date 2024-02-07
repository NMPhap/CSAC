"use client";
import Image from "next/image";
import temp from "@/public/temp.jpg";
import { useRef } from "react";
import { Carousel } from "antd";
const contentStyle: React.CSSProperties = {
  marginBottom: "0.5vw",
  color: "#000",
  lineHeight: "160px",
  textAlign: "center",
  background: "#fee5d1",
  borderRadius: "1vw"
};
export default function Home() {
  return (
    <div className="pt-2 m-2">
      <div className="flex flex-row ">
        <div className="w-3/5 mr-2 border-solid border-2 rounded p-1">
          <div className="flex text-lg font-semibold justify-between flew-wrap items-center ml-2">
            Announcements{" "}
            <a
              className="block float-right font-light text-sm hover:text-blue-400 hover:underline"
              href="/announcements"
            >
              See more
            </a>
          </div>
          <div className="px-5 flex justify-between">
            <a
              href="https://fb.watch/pWskmvyA4Q/"
              target="_blank"
              className="text-sm hover:text-blue-400 hover:underline cursor-pointer announcement"
            >
              live session tet
            </a>
            <span className="text-sm hover:text-blue-400 hover:underline cursor-pointer">
              20/11/2023
            </span>
          </div>
        </div>
        <div className="w-2/5  rounded p-1">
          <div className="flex text-lg font-semibold justify-between flew-wrap items-center ml-2">
            Memories{" "}
            <a
              className="block float-right font-light text-sm hover:text-blue-400 hover:underline"
              href="/memories"
            >
              See more
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className=" p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <Image src={temp} alt="image" />
            </div>
            <div className=" p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <Image src={temp} alt="image" />
            </div>
            <div className=" p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <Image src={temp} alt="image" />
            </div>
            <div className=" p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <Image src={temp} alt="image" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex text-lg font-semibold justify-between flew-wrap items-center ml-2">
          Projects{" "}
          <a
            className="block float-right font-light text-sm hover:text-blue-400 hover:underline"
            href="/announcements"
          >
            See more
          </a>
        </div>
        <Carousel dotPosition={"top"} autoplay={true}>
          <div>
            <h3 style={contentStyle}>Đang tìm cách xử lý</h3>
          </div>

        </Carousel>
        <div
          className="flex flew-row relative px-5"
          style={{ height: "10vw", overflowX: "scroll" }}
        >
          <div className="absolute moveLeft" style={{ top: "45%" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30"
              viewBox="0 -960 960 960"
              width="30"
            >
              <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
            </svg>
          </div>
          <div className=" p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mr-5 ">
            <Image
              src={temp}
              alt="image"
              className="object-cover h-full w-auto"
            />
          </div>
          <div className="p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mr-5 ">
            <Image
              src={temp}
              alt="image"
              className="object-cover h-full w-auto"
            />
          </div>
          <div className="absolute moveRight" style={{ top: "45%" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30"
              viewBox="0 -960 960 960"
              width="30"
            >
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
