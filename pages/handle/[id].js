/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { client, getProfileById, fetchProfileByHandle } from '../../lens-api'

export default  function Profile() {

    const [ profile, setProfile ] = useState()
    
    const router = useRouter()
    const { id } = router.query;

    useEffect(()=> {
        if (id) {
            fetchProfile()
        }
    }, [id])

    async function fetchProfile() {
        try {
            const response = await client.query(fetchProfileByHandle, { id }).toPromise();
            setProfile(response.data.profiles.items[0])
            console.log(response)

            // const publicationData = await client.query(getProfile, { 
            //     request: {
            //         id
            //     }
            //  }).toPromise();
            //  console.log( {publicationData})
             
        } catch (error) {
            console.log(error)
        }
    }
    
    if (!profile) return (
        <p>Not found</p>
    )
    return (
        <div>
            {
             profile?.picture ? 
                ( <img src={profile?.picture.original.url} width="200px" alt="" /> ) 
                : ( <div style={{ width: '200px', height: '200px' }} /> )
            }
            <div>
                <h4>{profile?.handle}</h4>
                <p>{profile?.bio}</p>
                <p>Followers: {profile?.stats.totalFollowers}</p>
                <p>Following: {profile?.stats.totalFollowing}</p>
            </div>
        </div>
    )
}