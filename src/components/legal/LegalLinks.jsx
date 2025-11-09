import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import './LegalLinks.css';

const LegalLinks = ({ variant = 'inline' }) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  if (variant === 'modal') {
    return (
      <>
        <div className="legal-links-modal">
          By signing in, you agree to our{' '}
          <button 
            className="legal-link-button" 
            onClick={() => setShowTerms(true)}
            type="button"
          >
            Terms of Service
          </button>
          {' '}and{' '}
          <button 
            className="legal-link-button" 
            onClick={() => setShowPrivacy(true)}
            type="button"
          >
            Privacy Policy
          </button>
          .
        </div>
        {showTerms && <TermsOfService onClose={() => setShowTerms(false)} />}
        {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      </>
    );
  }

  return (
    <div className="legal-links-inline">
      By signing in, you agree to our{' '}
      <Link to="/terms-of-service" className="legal-link">
        Terms of Service
      </Link>
      {' '}and{' '}
      <Link to="/privacy-policy" className="legal-link">
        Privacy Policy
      </Link>
      .
    </div>
  );
};

export default LegalLinks;

