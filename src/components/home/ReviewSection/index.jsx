import React from 'react';
import googleLogo from '../../../assets/images/google.png';

const ReviewSection = () => {
    return (
        <div className='review-section'>
            <div className='review-left'>
                <span className='review-text'>Reviewed On</span>
                <div className='google-logo'>
                    <img src={googleLogo} alt="Google" className='google-img' />
                </div>
            </div>
            <div className='review-right'>
                <div className='stars'>
                    <span className='star'>★</span>
                    <span className='star'>★</span>
                    <span className='star'>★</span>
                    <span className='star'>★</span>
                    <span className='star'>★</span>
                </div>
                <span className='rating'>4.9/5.0 (25 Reviews)</span>
            </div>
        </div>
    );
};

export default ReviewSection;
