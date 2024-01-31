import Image from "next/image";
import temp from "@/public/temp.jpg";
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
          <div className="px-5">
            <a href="https://fb.watch/pWskmvyA4Q/" target="_blank"  className="text-sm hover:text-blue-400 hover:underline cursor-pointer announcement">live session tet</a>
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
    </div>
  );
}
