import Link from "next/link";

export function Navbar() {
    return(
        <div className="bg-black text-white">
            <ul className="flex justify-around">
                <Link href="/" ><li>Search</li></Link>
                <Link href="/manage" ><li>Manage</li></Link>
            </ul>
        </div>
    )
}