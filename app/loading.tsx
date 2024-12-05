import SpinnerDotted from "./components/SpinnerDotted";

export default function Loading() {
    return (
        <div className="bg-gray-900 w-screen h-screen p-0 m-0 flex justify-center items-center">
            <SpinnerDotted />
        </div>
    );
}
