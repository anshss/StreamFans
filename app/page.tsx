// app/page.tsx
"use client";
import { useExploreProfiles } from "@lens-protocol/react-web";
import Link from "next/link";
import { formatPicture } from "../utils";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: profiles } = useExploreProfiles({
    limit: 25,
  });

  const [handle, setHandle] = useState<string | null>(null);

  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    router.push(`/profile/${handle}`);
  };

  return (
    <div className="p-20">
      <h1 className="text-5xl mb-4">My Lens App</h1>

      <form onSubmit={onSubmit}>
        <input
          minLength={5}
          maxLength={31}
          required
          value={handle || ""}
          type="text"
          onChange={(e) => {
            setHandle(e.target.value);
          }}
          placeholder="Search user"
          className="px-6 py-4 rounded-sm text-black mr-4"
        />

        <button
          className="bg-white text-black px-14 py-4 rounded-full"
          type="submit"
        >
          Look up
        </button>
      </form>

      <div className="max-w-screen-xl mx-auto p-4">
        <form className="flex items-center" onSubmit={onSubmit}>
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  "
              placeholder="Search a username"
              onChange={(e) => {
                setHandle(e.target.value);
              }}
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5 mr-2 -ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Look up
          </button>

        </form>
      </div>

      {profiles?.map((profile, index) => (
        <Link href={`/profile/${profile.handle}`} key={index}>
          <div className="my-14">
            {profile.picture && profile.picture.__typename === "MediaSet" ? (
              <img
                src={formatPicture(profile.picture)}
                width="120"
                height="120"
                alt={profile.handle}
              />
            ) : (
              <div className="w-14 h-14 bg-slate-500  " />
            )}
            <h3 className="text-3xl my-4">{profile.handle}</h3>
            <p className="text-xl">{profile.bio}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
