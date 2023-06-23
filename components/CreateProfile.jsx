import { useState } from "react";

export function CreateProfile() {
    const [handle, setHandle] = useState("");

    async function createProfile () {}

    return (
        <div>
            <input
                name="handle"
                placeholder="alex03"
                required
                onChange={(e) => setHandle(e)}
            />
            <button onClick={createProfile}>Create</button>
        </div>
    );
}
