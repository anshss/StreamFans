// create profile
// manage followers
// manage streams
import { useState } from "react"
import { CreateProfile } from "@/components/CreateProfile"
import { CreatePost } from "@/components/CreatePost"
import { ManageFollowers } from "@/components/ManageFollowers"
import { ManageStreams } from "@/components/ManageStreams"

export default function Manage() {
    const [isLogged, setIsLogged] = useState(false)
    const [selectedTab, setSelectedTab] = useState("Create Post")
    

    return(
      <div>
        fetching..

        {/* {if (selectedTab == "Create Profile") {CreateProfile}}
        {if (selectedTab == "Create Post") {CreatePost}}
        {if (selectedTab == "Manage Followers") {ManageFollowers}}
        {if (selectedTab == "Manage Streams") {ManageStreams}} */}
      </div>
    ) 
  }