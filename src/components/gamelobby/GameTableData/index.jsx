// Game Table Data Service
export const gameTablesData = [
    {
        id: "Table #002",
        status: "Waiting",
        players: [
            { id: 1, avatar: "avatar1.jpg" },
            { id: 2, avatar: "avatar2.jpg" },
            { id: 3, avatar: "avatar3.jpg" },
            { id: 4, avatar: "avatar4.jpg" },
            { id: 5, avatar: "avatar5.jpg" }
        ],
        playerCount: "5/6",
        entryFee: "25 USDT",
        totalPot: "125 USDT",
        network: "TRC20"
    },
    {
        id: "Table #003",
        status: "In Progress",
        players: [
            { id: 1, avatar: "avatar1.jpg" },
            { id: 2, avatar: "avatar2.jpg" },
            { id: 3, avatar: "avatar3.jpg" }
        ],
        playerCount: "3/6",
        entryFee: "15 USDT",
        totalPot: "45 USDT",
        network: "BSC"
    },
    {
        id: "Table #004",
        status: "Waiting",
        players: [
            { id: 1, avatar: "avatar1.jpg" },
            { id: 2, avatar: "avatar2.jpg" }
        ],
        playerCount: "2/6",
        entryFee: "20 USDT",
        totalPot: "40 USDT",
        network: "BSC"
    },
    {
        id: "Table #005",
        status: "Waiting",
        players: [
            { id: 1, avatar: "avatar1.jpg" },
            { id: 2, avatar: "avatar2.jpg" },
            { id: 3, avatar: "avatar3.jpg" },
            { id: 4, avatar: "avatar4.jpg" },
            { id: 5, avatar: "avatar5.jpg" }
        ],
        playerCount: "5/6",
        entryFee: "15 USDT",
        totalPot: "115 USDT",
        network: "TRC20"
    },
    {
        id: "Table #006",
        status: "Waiting",
        players: [
            { id: 1, avatar: "avatar1.jpg" }
        ],
        playerCount: "1/6",
        entryFee: "30 USDT",
        totalPot: "30 USDT",
        network: "BSC"
    }
];

export const getGameTablesByStatus = (status) => {
    if (status === 'All') return gameTablesData;
    return gameTablesData.filter(table => 
        table.status.toLowerCase() === status.toLowerCase()
    );
};

export const getGameTablesByNetwork = (network) => {
    if (network === 'All Network') return gameTablesData;
    return gameTablesData.filter(table => 
        table.network.toLowerCase() === network.toLowerCase()
    );
};
