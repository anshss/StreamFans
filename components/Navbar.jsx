import Link from "next/link";

export function Navbar() {
    return(
        <div>
            <ul>
                <Link href="/" ><li>Search</li></Link>
                <Link href="/manage" ><li>Manage</li></Link>
            </ul>
        </div>
    )
}