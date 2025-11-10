import React, { useRef, useState, useEffect } from 'react';
import GameTableCard from '../GameTableCard';
import './index.css';

const GameTableGrid = ({ gameTables, onJoinTable, onInviteFriends }) => {
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Check scroll position to show/hide arrows
    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollPosition();
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkScrollPosition);
            window.addEventListener('resize', checkScrollPosition);
            return () => {
                scrollContainer.removeEventListener('scroll', checkScrollPosition);
                window.removeEventListener('resize', checkScrollPosition);
            };
        }
    }, [gameTables]);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    if (gameTables.length === 0) {
        return null;
    }

    return (
        <div className='game-table-grid-container'>
            {/* Left Navigation Arrow */}
            {showLeftArrow && (
                <button className='table-scroll-button table-scroll-left' onClick={scrollLeft} aria-label="Scroll left">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>
            )}

            {/* Scrollable Table Container */}
            <div className='game-table-grid' ref={scrollContainerRef}>
                {gameTables.map((table, index) => (
                    <GameTableCard 
                        key={table.id || index} 
                        table={table} 
                        onJoinTable={onJoinTable}
                        onInviteFriends={onInviteFriends}
                    />
                ))}
            </div>

            {/* Right Navigation Arrow */}
            {showRightArrow && (
                <button className='table-scroll-button table-scroll-right' onClick={scrollRight} aria-label="Scroll right">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </button>
            )}
        </div>
    );
};

export default GameTableGrid;
