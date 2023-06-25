// app/page.tsx
'use client'
import { useExploreProfiles } from '@lens-protocol/react-web'
import Link from 'next/link'
import { formatPicture } from '../utils'
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'


export default function Home() {
  const { data: profiles } = useExploreProfiles({
    limit: 25
  })


  const [handle, setHandle] = useState<string | null>(null);

  const router = useRouter()


  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    router.push(`/profile/${handle}`)
  };


  
  return (
    <div className='p-20'>
      <h1 className='text-5xl mb-4'>My Lens App</h1>

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
          placeholder='Search user'
          className="px-6 py-4 rounded-sm text-black mr-4"
        />

        <button
          className="bg-white text-black px-14 py-4 rounded-full"
          type="submit"
        >
          Look up
        </button>
      </form>

      {
        profiles?.map((profile, index) => (
          <Link href={`/profile/${profile.handle}`} key={index}>
            <div className='my-14'>
              {
                profile.picture && profile.picture.__typename === 'MediaSet' ? (
                  <img
                    src={formatPicture(profile.picture)}
                    width="120"
                    height="120"
                    alt={profile.handle}
                  />
                ) : <div className="w-14 h-14 bg-slate-500  " />
              }
              <h3 className="text-3xl my-4">{profile.handle}</h3>
              <p className="text-xl">{profile.bio}</p>
            </div>
          </Link>
        ))
      }
    </div>
  )
}
