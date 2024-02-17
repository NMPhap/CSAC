import { Activity } from "@/models/activity";
import { motion } from "framer-motion";
import moment from "moment-timezone";
import { useState } from "react";
import style from "./activityContainer.module.css";
export default function ActivityContainer({
  activity,
}: {
  activity: Activity;
}) {
  console.log(activity);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`p-2 rounded-md mb-2 `}>
      <div className="flex justify-between">
        <div className="flex">
          {activity.subtask && activity.subtask.length > 0 ? (
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              height="1.5vw"
              viewBox="0 -960 960 960"
              width="1.5vw"
              initial={{height: "fit-content"}}
              animate={{
                rotate: isOpen ? "0deg" : "-90deg",
              }}
            >
              <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
            </motion.svg>
          ) : (
            <></>
          )}

          <h5
            className="font-semibold cursor-pointer hover:underline"
            onClick={() => setIsOpen(!isOpen)}
          >
            {" "}
            {activity.name}
          </h5>
        </div>
        <p className="text-xs">{`${moment(activity.startDate)
          .tz("Asia/Bangkok")
          .format("LL")} - ${
          activity.endDate
            ? moment(activity.endDate).tz("Asia/Bangkok").format("LL")
            : moment(Date()).tz("Asia/Bangkok").format("LL")
        }`}</p>
      </div>
      <div className="text-sm px-2 ">
        {activity.description}
        <motion.div
          className={`flex overflow-hidden flex-col`}
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
          }}
        >
          <div className="flex flex-col">
            {activity.attachments &&
              activity.attachments.map((attachment, _) => (
                <svg
                  onClick={() => window.open(attachment, "_blank")!.focus()}
                  xmlns="http://www.w3.org/2000/svg"
                  height="7vw"
                  viewBox="0 -960 960 960"
                  width="7vw"
                  className="mr-2"
                  style={{ maxHeight: "4vw", maxWidth: "4vw" }}
                >
                  <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                </svg>
              ))}
            {activity.subtask && activity.subtask.length > 0 ? (
              <h5 className={`${style.headerLine} font-semibold`}>Sub Task</h5>
            ) : (
              <></>
            )}
            {activity.subtask &&
              activity.subtask.map((value, index) =>
                ActivityContainer({ activity: value })
              )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
