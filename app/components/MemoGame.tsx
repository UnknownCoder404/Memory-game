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
    { id: "dova-image", name: "dova", type: "image" },
    { id: "dova-text", name: "dova", type: "text", text: "Dova Text" },
    { id: "khajit-image", name: "khajit", type: "image" },
    { id: "khajit-text", name: "khajit", type: "text", text: "Khajit Text" },
    { id: "nord-image", name: "nord", type: "image" },
    { id: "nord-text", name: "nord", type: "text", text: "Nord Text" },
    { id: "orc-image", name: "orc", type: "image" },
    { id: "orc-text", name: "orc", type: "text", text: "Orc Text" },
    { id: "potion-image", name: "potion", type: "image" },
    { id: "potion-text", name: "potion", type: "text", text: "Potion Text" },
    { id: "spider-image", name: "spider", type: "image" },
    { id: "spider-text", name: "spider", type: "text", text: "Spider Text" },
    { id: "thief-image", name: "thief", type: "image" },
    { id: "thief-text", name: "thief", type: "text", text: "Thief Text" },
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
                            You Won!!
                        </h1>
                        <Confetti />
                    </>
                )}
                <div className="grid grid-cols-4 gap-5 mt-6">
                    {cards.map((card, index) => (
                        <Card
                            key={card.id}
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
                        Reset Game
                    </button>
                )}
            </div>
        </div>
    );
}

interface CardProps {
    card: { name: string; type: "image" | "text"; id: string; text?: string };
    flipped: boolean;
    solved: boolean;
    onClick: () => void;
}

function Card({ card, flipped, solved, onClick }: CardProps) {
    console.log(card.type === "text" ? card.text : "Card is not text.");
    return (
        <div
            className={`relative w-[20vw] h-[20vw] max-w-[100px] max-h-[100px] cursor-pointer bg-slate-200 
            flex justify-center items-center transition-transform duration-300
            ${flipped && !solved ? "scale-110" : ""}`}
            onClick={onClick}
        >
            {card.type === "image" ? (
                <Image
                    src={`/memo-cards/${card.name}.webp`}
                    alt={`Card ${card.name}`}
                    fill
                    priority
                    style={{
                        display: flipped || solved ? "block" : "none",
                    }}
                    suppressHydrationWarning
                />
            ) : (
                <span
                    className={`text-center ${
                        flipped || solved ? "visible" : "hidden"
                    } text-wrap overflow-hidden text-ellipsis`}
                    style={{
                        maxWidth: "90%", // Ensures the text fits inside the card
                        wordWrap: "break-word", // Prevents long words from overflowing
                        textOverflow: "ellipsis", // Adds ellipsis when text overflows
                    }}
                >
                    {card.text}
                </span>
            )}
            {!flipped && !solved ? (
                <span className="text-4xl font-bold">?</span>
            ) : null}
        </div>
    );
}
