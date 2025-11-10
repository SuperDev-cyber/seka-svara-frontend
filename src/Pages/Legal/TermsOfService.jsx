import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header/index.jsx';
import Footer from '../../components/layout/Footer/index.jsx';
import TermsOfServiceContent from '../../components/legal/TermsOfServiceContent';
import './LegalPage.css';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="legal-page">
        <div className="legal-page-container">
          <button className="legal-page-back" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <TermsOfServiceContent />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;



