import React, { useRef, useState, useEffect } from 'react';
import GameTableCard from '../GameTableCard';
import './index.css';

const GameTableGrid = ({ gameTables, onJoinTable, onPreviewTable, onInviteFriends }) => {
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [centerIndex, setCenterIndex] = useState(0);

    // Check scroll position to show/hide arrows
    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
            updateCenterIndex();
        }
    };

    // Determine which card is visually centered in the viewport
    const updateCenterIndex = () => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const cards = Array.from(container.children);
        if (!cards.length) return;
        const containerRect = container.getBoundingClientRect();
        const containerCenterX = containerRect.left + containerRect.width / 2;
        let bestIdx = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        cards.forEach((el, idx) => {
            const r = el.getBoundingClientRect();
            const cardCenterX = r.left + r.width / 2;
            const dist = Math.abs(cardCenterX - containerCenterX);
            if (dist < bestDist) {
                bestDist = dist;
                bestIdx = idx;
            }
        });
        setCenterIndex(bestIdx);
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
            scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
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
                        onPreviewTable={onPreviewTable}
                        onInviteFriends={onInviteFriends}
                        isCenter={index === centerIndex}
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
