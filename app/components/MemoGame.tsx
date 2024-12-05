"use client";

import { useEffect, useState } from "react";
import { Card } from "./Card";

const memoryCards = [
    {
        name: "Cigarette with X",
        type: "image",
        id: "cigarrete_with_x",
        imageExtension: "jpg",
    },
    {
        name: "Cigarette with X",
        type: "text",
        id: "cigarette_with_x_text",
        text: "Pušenje uzrokuje rak pluća.",
    },
    {
        name: "Heart Symbol",
        type: "image",
        id: "heart",
        imageExtension: "jpg",
    },
    {
        name: "Heart Symbol",
        type: "text",
        id: "heart_symbol_text",
        text: "Nakon 20 minuta prestanka, srčani ritam se normalizira.",
    },
    {
        name: "Poison Bottle",
        type: "image",
        id: "poison_bottle",
        imageExtension: "webp",
    },
    {
        name: "Poison Bottle",
        type: "text",
        id: "poison_bottle_text",
        text: "Cigarete sadrže više od 70 kancerogenih tvari.",
    },
    {
        name: "Healthy Lungs",
        type: "image",
        id: "healthy_lungs",
        imageExtension: "jpg",
    },
    {
        name: "Healthy Lungs",
        type: "text",
        id: "healthy_lungs_text",
        text: "Nakon 3 mjeseca, funkcija pluća se značajno poboljšava.",
    },
    {
        name: "Wallet",
        type: "image",
        id: "wallet",
        imageExtension: "jpg",
    },
    {
        name: "Wallet",
        type: "text",
        id: "wallet_text",
        text: "Prestankom pušenja ušteđujete stotine eura godišnje.",
    },
    {
        name: "Family Support",
        type: "image",
        id: "family",
        imageExtension: "jpg",
    },
    {
        name: "Family Support",
        type: "text",
        id: "family_support_text",
        text: "Podrška bližnjih ključna je za uspješan prestanak.",
    },
    {
        name: "Diseased Lungs",
        type: "image",
        id: "diseased_lungs",
        imageExtension: "jpg",
    },
    {
        name: "Diseased Lungs",
        type: "text",
        id: "diseased_lungs_text",
        text: "Pušenje povećava rizik od KOPB-a i drugih plućnih bolesti.",
    },
    {
        name: "App Icon",
        type: "image",
        id: "app_icon",
        imageExtension: "png",
    },
    {
        name: "App Icon",
        type: "text",
        id: "app_icon_text",
        text: "Korištenje aplikacija može pomoći u praćenju napretka.",
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
                    </>
                )}
                <div className="grid grid-cols-2 min-[325px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-5 mt-6">
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
