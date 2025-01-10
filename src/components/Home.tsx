import React, { useEffect, useState } from "react";

interface Token {
    name: string;
    symbol: string;
    priceUsd: number;
    iconPath?: string | null;
}

const Home: React.FC = () => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [sortColumn, setSortColumn] = useState<"name" | "symbol" | "priceUsd">("priceUsd");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await fetch("https://api.energiswap.exchange/v1/assets");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const responseData = await response.json();

                const formattedData: Token[] = await Promise.all(
                    Object.values(responseData).map(async (item: any) => {
                        const iconPath = await getIconPath(item.symbol);
                        return {
                            name: item.name,
                            symbol: item.symbol,
                            priceUsd: parseFloat(item.last_price),
                            iconPath,
                        };
                    })
                );

                setTokens(formattedData);
            } catch (error) {
                console.error("Failed to fetch tokens:", error);
            }
        };

        fetchTokens();
    }, []);

    const getIconPath = async (symbol: string): Promise<string | null> => {
        try {
            const module = await import(`../../assets/icons/${symbol.toUpperCase()}.svg`);
            return module.default;
        } catch (error) {
            console.error(`Icon not found for ${symbol}`);
            return null;
        }
    };


    const sortedTokens = [...tokens].sort((a, b) => {
        if (sortColumn === "priceUsd") {
            return sortDirection === "asc" ? a.priceUsd - b.priceUsd : b.priceUsd - a.priceUsd;
        } else {
            return sortDirection === "asc"
                ? a[sortColumn].localeCompare(b[sortColumn])
                : b[sortColumn].localeCompare(a[sortColumn]);
        }
    });

    const handleSort = (column: "name" | "symbol" | "priceUsd") => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    return (
        <div className="p-4 mt-10 min-h-screen flex justify-center">
            <table className="w-[50%] table-auto border-collapse border rounded-lg overflow-hidden">
                <thead className="text-left">
                    <tr className="border">
                        <th className="pl-5 p-3 cursor-pointer">#</th>
                        <th
                            className="pl-5 p-3 cursor-pointer"
                            onClick={() => handleSort("name")}
                        >
                            Coin {sortColumn === "name" && (sortDirection === "asc" ? "▲" : "▼")}
                        </th>
                        <th
                            className="pl-5 p-3 cursor-pointer"
                            onClick={() => handleSort("symbol")}
                        >
                            Symbol {sortColumn === "symbol" && (sortDirection === "asc" ? "▲" : "▼")}
                        </th>
                        <th
                            className="pl-5 p-3 cursor-pointer"
                            onClick={() => handleSort("priceUsd")}
                        >
                            Price {sortColumn === "priceUsd" && (sortDirection === "asc" ? "▲" : "▼")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTokens.map((token, index) => (
                        <tr key={index} className="border">
                            <td className="p-5"> {index + 1} </td>
                            <td className="p-5">
                                {token.iconPath ? (
                                    <div className="flex items-center gap-2">
                                        <img src={token.iconPath} alt={token.symbol} className="w-6 h-6" />
                                        <span>{token.name}</span>
                                    </div>
                                ) : (<span>N/A</span>)
                                }

                            </td>
                            <td className="p-5">{token.symbol}</td>
                            <td className="p-5">${token.priceUsd.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Home;
