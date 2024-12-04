"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Confetti from "./Confetti";

const memoryCards = [
    {
        id: "24-h",
        name: "24-h",
        type: "text",
        text: "24 sati nakon pušenja će",
    },
    {
        id: "24-h",
        name: "24-h",
        type: "text",
        text: "se rizik srčanog udara smanjiti.",
    },
    {
        id: "5-years-without-cigarettes",
        name: "5-years-without-cigarettes",
        type: "text",
        text: "5 godina bez cigareta = 70% manji rizik od srčanih bolesti",
    },
    {
        id: "5-years-without-cigarettes",
        name: "5-years-without-cigarettes",
        type: "image",
        imageExtension: "png",
    },
] as const;

const generateDeck = () => {
    // Shuffle the cards
    const deck = [...memoryCards];
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

export default function MemoGame() {
    const [cards, setCards] = useState(() => generateDeck());
    const [flipped, setFlipped] = useState<number[]>([]);
    const [solved, setSolved] = useState<number[]>([]);
    const [disableAll, setDisableAll] = useState(false);

    useEffect(() => {
        if (flipped.length === 2) {
            setDisableAll(true); // Temporarily disable interactions
            const [firstIndex, secondIndex] = flipped;

            if (cards[firstIndex].name === cards[secondIndex].name) {
                // Cards match
                setTimeout(() => {
                    setSolved((prev) => [...prev, firstIndex, secondIndex]);
                    setFlipped([]);
                    setDisableAll(false); // Re-enable interactions
                }, 1000);
            } else {
                // Cards don't match
                setTimeout(() => {
                    setFlipped([]);
                    setDisableAll(false); // Re-enable interactions
                }, 1000);
            }
        }
    }, [flipped, cards]);

    const handleClick = (index: number) => {
        if (isFlippableCard(index)) setFlipped((prev) => [...prev, index]);
    };

    const isFlippableCard = (index: number) =>
        !disableAll &&
        !flipped.includes(index) &&
        flipped.length < 2 &&
        !solved.includes(index);

    const resetGame = () => {
        setCards(generateDeck());
        setFlipped([]);
        setSolved([]);
        setDisableAll(false);
    };

    const gameOver = solved.length === cards.length;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-[#f4f4f4]">
                    Memory Game
                </h1>
                {gameOver && (
                    <>
                        <h1 className="mt-3 text-3xl text-[#f4f4f4]">
                            Pobijedio si!!
                        </h1>
                        <Confetti />
                    </>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-6">
                    {cards.map((card, index) => (
                        <Card
                            key={index}
                            card={card}
                            flipped={flipped.includes(index)}
                            solved={solved.includes(index)}
                            onClick={() => handleClick(index)}
                        />
                    ))}
                </div>
                {gameOver && (
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={resetGame}
                    >
                        Ponovi igru
                    </button>
                )}
            </div>
        </div>
    );
}

interface CardProps {
    card:
        | {
              name: string;
              type: "text";
              id: string;
              text: string;
          }
        | {
              name: string;
              type: "image";
              id: string;
              imageExtension: string;
          };
    flipped: boolean;
    solved: boolean;
    onClick: () => void;
}
function Card({ card, flipped, solved, onClick }: CardProps) {
    return (
        <div
            className={`
                relative 
                w-24 h-24 
                sm:w-32 sm:h-32 
                md:w-40 md:h-40 
                cursor-pointer 
                bg-white 
                rounded-lg 
                shadow-md 
                flex 
                justify-center 
                items-center 
                transition-all 
                duration-300 
                transform 
                hover:scale-105 
                ${flipped && !solved ? "rotate-y-180" : ""}
                ${solved ? "opacity-50 cursor-default" : ""}
            `}
            onClick={!solved ? onClick : undefined}
        >
            {/* Card Back (Default State) */}
            <div
                className={`
                    absolute 
                    inset-0 
                    bg-gradient-to-br 
                    from-blue-500 
                    to-purple-600 
                    rounded-lg 
                    flex 
                    justify-center 
                    items-center 
                    ${flipped || solved ? "hidden" : ""}
                `}
            >
                <span className="text-4xl font-bold text-white">?</span>
            </div>

            {/* Card Front (Flipped/Solved State) */}
            <div
                className={`
                    absolute 
                    inset-0 
                    flex 
                    justify-center 
                    items-center 
                    p-2 
                    ${!(flipped || solved) ? "hidden" : ""}
                    ${flipped && !solved ? "rotate-y-180" : ""}
                `}
            >
                {card.type === "image" ? (
                    <Image
                        src={`/memo-cards/${card.name}.${card.imageExtension}`}
                        alt={`${card.name}`}
                        fill
                        priority
                        className="object-contain p-2"
                        suppressHydrationWarning
                    />
                ) : (
                    <div
                        className={`
                            text-center 
                            text-sm 
                            sm:text-base 
                            md:text-lg 
                            font-semibold 
                            text-gray-800 
                            line-clamp-3
                            break-words
                        `}
                    >
                        {card.text}
                    </div>
                )}
            </div>
        </div>
    );
}

// You'll need to add some custom CSS for the rotate effect
// Add this to your global CSS file or create a new one
const customCardStyles = `
@keyframes rotateY {
    from { transform: rotateY(0deg); }
    to { transform: rotateY(180deg); }
}

.rotate-y-180 {
    animation: rotateY 0.5s linear;
    transform: rotateY(180deg);
}
`;
