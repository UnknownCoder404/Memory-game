import { Metadata } from "next";
import MemoGame from "./components/MemoGame";

export const metadata: Metadata = {
    title: "Memory igra",
    description:
        "Memory igra za Project Oxygen dizajnirana na temu prevencija pušenja",
};

export const dynamic = "error";

export default async function Home() {
    return <MemoGame />;
}
