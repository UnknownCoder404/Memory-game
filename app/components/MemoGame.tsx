"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Confetti from "./Confetti";

const memoryCards = [
    "arrow",
    "dova",
    "khajit",
    "nord",
    "orc",
    "potion",
    "spider",
    "thief",
];

const generateDeck = () => {
    const deck = [...memoryCards, ...memoryCards];
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

export default function MemoGame() {
    const [cards, setCards] = useState(generateDeck());
    const [flipped, setFlipped] = useState<number[]>([]);
    const [solved, setSolved] = useState<number[]>([]);

    useEffect(() => {
        if (flipped.length === 2) {
            const [first, second] = flipped;
            setTimeout(() => {
                if (cards[first] === cards[second]) {
                    setSolved((prev) => [...prev, first, second]);
                }
                setFlipped([]);
            }, 1000);
        }
    }, [flipped]);

    const handleClick = (index: number) => {
        if (isFlippableCard(index)) setFlipped((prev) => [...prev, index]);
    };

    const isFlippableCard = (index: number) =>
        !flipped.includes(index) &&
        flipped.length < 2 &&
        !solved.includes(index);

    const resetGame = () => {
        setCards(generateDeck());
        setFlipped([]);
        setSolved([]);
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
                            key={index}
                            card={card}
                            flipped={flipped.includes(index)}
                            solved={solved.includes(index)}
                            onClick={() => handleClick(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface CardProps {
    card: string;
    flipped: boolean;
    solved: boolean;
    onClick: () => void;
}

function Card({ card, flipped, solved, onClick }: CardProps) {
    return (
        <div
            className={`relative w-[20vw] h-[20vw] max-w-[100px] max-h-[100px] cursor-pointer bg-slate-200 
            flex justify-center items-center text-4xl font-bold transition-transform duration-300 ${
                flipped || solved ? "rotate-180" : ""
            }`}
            onClick={onClick}
        >
            <Image
                className="rotate-180"
                src={`/memo-cards/${card}.webp`}
                alt={`Card ${card}`}
                fill
                priority
                style={{
                    display: flipped || solved ? "block" : "none",
                }}
                suppressHydrationWarning
            />
            {flipped || solved ? null : <span>?</span>}
        </div>
    );
}
