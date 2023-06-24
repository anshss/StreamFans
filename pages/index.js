// search page to look for fetch profile, redirect to handle<[id]
import { useRouter } from "next/router";
import { useState } from "react";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");

    const router = useRouter()

    function goToProfile() {
      router.push(`/handle/${searchQuery}`)
    }

    return (
        <div>
            <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                name="searchBar"
                type="text"
                placeholder="lensprotocol.test"
            />
            <button onClick={goToProfile}>Look up</button>
        </div>
    );
}
