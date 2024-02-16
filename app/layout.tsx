"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import logo from "@/public/logo.png";
import { usePathname } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import database from "@/firebase/firestore";

const navList = [
  {
    path: "",
    title: "Homepage",
  },
  {
    path: "/projects",
    title: "Project",
  },
  {
    path: "/memories",
    title: "Memories",
  },
];
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<String | null>("");
  const path = usePathname();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  useEffect(() => {
    setEmail(sessionStorage.getItem("email") ?? null);
  }, []);
  return (
    <html lang="en">
      <head>
        <title>CSAC Homepage</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/flowbite@1.4.5/dist/flowbite.min.css"
        />
      </head>
      <body className={inter.className}>
        <nav
          className="flex items-center justify-between flex-wrap p-6"
          style={{
            backgroundColor: "#fee5d1",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <a
            href="/"
            className="flex items-center flex-shrink-0 text-white mr-6"
          >
            <Image src={logo} alt="logo" width={100} height={100} />
            <span
              className="font-semibold text-xxl tracking-tight"
              style={{ fontSize: "5vw", cursor: "default" }}
            >
              CSAC
            </span>
          </a>
          <div className=" block flex-grow lg:flex lg:items-center lg:w-auto flex">
            <div className="flex lg:flex-grow" style={{ fontSize: "1.2vw" }}>
              {navList.map((value, index) => (
                <a
                  href={value.path == "" ? "/" : value.path}
                  className={`block mt-4 lg:inline-block lg:mt-0s mr-4 ${
                    path.split("/").reverse()[0] == value.path
                      ? "underline"
                      : ""
                  }`}
                >
                  {value.title}
                </a>
              ))}
            </div>
          </div>
          {email && (
            <div className="flex flex-wrap items-center">
              {email}
              <div
                className="rounded-full border-2 border-black border-hidden hover:border-solid p-1"
                style={{ marginLeft: "0.5vw" }}
                onClick={() => setEmail(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                </svg>
              </div>
            </div>
          )}
        </nav>
        {children}
        <div
          id="default-modal"
          aria-hidden="false"
          className={` flex ${
            email ? "hidden" : "show"
          } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Login
                </h3>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                {loading ? (
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
                ) : (
                  <button
                    type="button"
                    className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
                    onClick={() => {
                      setLoading(true);
                      signInWithPopup(auth, provider)
                        .then(async (result) => {
                          // This gives you a Google Access Token. You can use it to access the Google API.
                          const credential =
                            GoogleAuthProvider.credentialFromResult(result);
                          const token = credential!.accessToken;
                          // The signed-in user info.
                          const user = result.user;
                          const userRef = doc(database, "users", user.uid);
                          if (
                            (await getDoc(userRef)).exists()
                          )
                            updateDoc(userRef, {
                              name: user.displayName,
                              photoURL: user.photoURL,
                            });
                          else
                            setDoc(userRef, {
                              email: user.email,
                              name: user.displayName,
                              photoURL: user.photoURL,
                            });
                          // IdP data available using getAdditionalUserInfo(result)
                          // ...
                          sessionStorage.setItem("token", token ?? "");
                          sessionStorage.setItem("userId", user.uid);
                          if (user.email) {
                            sessionStorage.setItem("email", user.email);
                            setEmail(user.email);
                          }
                          const modal =
                            document.getElementById("default-modal");
                          setLoading(false);
                        })
                        .catch((error) => {
                          // Handle Errors here.
                          const errorCode = error.code;
                          const errorMessage = error.message;
                          // The email of the user's account used.
                          const email = error.customData.email;
                          // The AuthCredential type that was used.
                          const credential =
                            GoogleAuthProvider.credentialFromError(error);
                          // ...
                        });
                    }}
                  >
                    <svg
                      className="w-4 h-4 me-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 19"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Sign in with Google
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <script src="https://unpkg.com/flowbite@1.4.5/dist/flowbite.js"></script>
      </body>
    </html>
  );
}
