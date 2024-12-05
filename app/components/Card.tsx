import Image from "next/image";

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

export function Card({ card, flipped, solved, onClick }: CardProps) {
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
                    p-0
                    line-clamp-3
                    ${!(flipped || solved) ? "hidden" : ""}
                    ${flipped && !solved ? "rotate-y-180" : ""}
                `}
            >
                {card.type === "image" ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={`/${card.id}.${card.imageExtension}`}
                            alt={`${card.name}`}
                            fill
                            priority
                            className="rounded-lg"
                        />
                    </div>
                ) : (
                    <div
                        className={`
                            text-center 
                            text-sm 
                            sm:text-base 
                            md:text-lg 
                            font-semibold 
                            text-gray-800 
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
