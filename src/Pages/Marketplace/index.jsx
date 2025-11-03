import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import './index.css';

// Import components
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';
import SearchFilterBar from '../../components/marketplace/SearchFilterBar';
import SecondaryFilters from '../../components/marketplace/SecondaryFilters';
import TrendingSection from '../../components/marketplace/TrendingSection';
import Pagination from '../../components/marketplace/Pagination';
import Loading from '../../components/marketplace/Loading';
import EmptyState from '../../components/marketplace/EmptyState';

// Import NFT images
import nft1 from '../../assets/images/NFT-images/nft-1.jpg';
import nft2 from '../../assets/images/NFT-images/nft-2.jpg';
import nft3 from '../../assets/images/NFT-images/nft-3.jpg';
import nft4 from '../../assets/images/NFT-images/nft-4.jpg';
import nft5 from '../../assets/images/NFT-images/nft-5.png';
import nft6 from '../../assets/images/NFT-images/nft-6.jpg';
import nft7 from '../../assets/images/NFT-images/nft-7.jpg';
import nft8 from '../../assets/images/NFT-images/nft-8.jpg';
import nft9 from '../../assets/images/NFT-images/nft-9.png';

const Marketplace = () => {
    const { user } = useAuth();
    const [activeFilter, setActiveFilter] = useState('Featured');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedPrice, setSelectedPrice] = useState('All Prices');
    const [sortBy, setSortBy] = useState('Newest');
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const itemsPerPage = 9;

    useEffect(() => {
        fetchNFTs();
    }, []);

    const fetchNFTs = async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/nfts');
            setNfts(response || []);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
            // Fallback to static data if API fails
            setNfts(getStaticNFTs());
        } finally {
            setLoading(false);
        }
    };

    const getStaticNFTs = () => [
        {
            id: 1,
            title: 'Layla Banks',
            creator: 'TBanks',
            price: '1.29',
            USDTPrice: '$2,574.86',
            likes: 887,
            image: nft1,
            onSale: true
        },
        {
            id: 2,
            title: 'Astronaut #1234',
            creator: 'SpaceArt',
            price: '2.45',
            USDTPrice: '$4,890.12',
            likes: 876,
            image: nft2,
            onSale: true
        },
        {
            id: 3,
            title: 'Abstract Face #567',
            creator: 'DigitalArt',
            price: '0.89',
            USDTPrice: '$1,778.34',
            likes: 245,
            image: nft3,
            onSale: false
        },
        {
            id: 4,
            title: 'Colorful Portrait',
            creator: 'ArtMaster',
            price: '3.12',
            USDTPrice: '$6,224.88',
            likes: 1.2,
            image: nft4,
            onSale: true
        },
        {
            id: 5,
            title: 'Retro Monkey',
            creator: 'VintageNFT',
            price: '1.67',
            USDTPrice: '$3,334.66',
            likes: 543,
            image: nft5,
            onSale: true
        },
        {
            id: 6,
            title: 'Wooden Stick Guy',
            creator: 'ClassicArt',
            price: '0.45',
            USDTPrice: '$898.90',
            likes: 123,
            image: nft6,
            onSale: false
        },
        {
            id: 7,
            title: 'Neon Portrait',
            creator: 'CyberArt',
            price: '4.33',
            USDTPrice: '$8,646.67',
            likes: 2.1,
            image: nft7,
            onSale: true
        },
        {
            id: 8,
            title: 'Hat Monkey',
            creator: 'FunnyNFTs',
            price: '0.78',
            USDTPrice: '$1,556.44',
            likes: 89,
            image: nft8,
            onSale: false
        },
        {
            id: 9,
            title: 'Pink Sunglasses',
            creator: 'StyleNFT',
            price: '2.89',
            USDTPrice: '$5,771.11',
            likes: 456,
            image: nft9,
            onSale: true
        }
    ];


    // Filter and search logic
    const filteredNFTs = nfts.filter(nft => {
        const matchesSearch = nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            nft.creator.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || 
                              nft.category === selectedCategory;
        const matchesPrice = selectedPrice === 'All Prices' || 
                           (selectedPrice === 'Under 1 ETH' && parseFloat(nft.price) < 1) ||
                           (selectedPrice === '1-5 ETH' && parseFloat(nft.price) >= 1 && parseFloat(nft.price) <= 5) ||
                           (selectedPrice === '5+ ETH' && parseFloat(nft.price) > 5);
        
        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort logic
    const sortedNFTs = [...filteredNFTs].sort((a, b) => {
        switch (sortBy) {
            case 'Price: Low to High':
                return parseFloat(a.price) - parseFloat(b.price);
            case 'Price: High to Low':
                return parseFloat(b.price) - parseFloat(a.price);
            case 'Oldest':
                return a.id - b.id;
            case 'Newest':
            default:
                return b.id - a.id;
        }
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedNFTs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNFTs = sortedNFTs.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, selectedPrice, sortBy, activeFilter]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All Categories');
        setSelectedPrice('All Prices');
        setSortBy('Newest');
        setActiveFilter('Featured');
    };

    return (
        <div className='marketplace-page'>
            <div className='marketplace-container'>
                <MarketplaceHeader />
                <SearchFilterBar 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedPrice={selectedPrice}
                    setSelectedPrice={setSelectedPrice}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
                <SecondaryFilters 
                    activeFilter={activeFilter} 
                    setActiveFilter={setActiveFilter} 
                />
                
                {loading ? (
                    <Loading message="Loading NFTs..." />
                ) : currentNFTs.length === 0 ? (
                    <EmptyState 
                        title="No NFTs Found"
                        message="Try adjusting your search or filter criteria"
                        actionText="Reset Filters"
                        onAction={handleResetFilters}
                    />
                ) : (
                    <>
                        <TrendingSection nfts={currentNFTs} />
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                itemsPerPage={itemsPerPage}
                                totalItems={sortedNFTs.length}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
