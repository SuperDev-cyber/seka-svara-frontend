import React from 'react';
import './LegalContent.css';

const PrivacyPolicyContent = () => {
  return (
    <div className="legal-content-page">
      <h1>Privacy Policy</h1>
      <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

      <section>
        <h3>1. Introduction</h3>
        <p>
          Seka Svara ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our gaming platform and services.
        </p>
        <p>
          By using the Platform, you consent to the data practices described in this Privacy Policy.
        </p>
      </section>

      <section>
        <h3>2. Information We Collect</h3>
        
        <h4>2.1 Information You Provide</h4>
        <p>When you connect your Web3Auth wallet, we may collect:</p>
        <ul>
          <li>Wallet address (blockchain address)</li>
          <li>Email address (if provided through Web3Auth Google login)</li>
          <li>Username (generated or provided)</li>
          <li>Game statistics and preferences</li>
        </ul>

        <h4>2.2 Automatically Collected Information</h4>
        <p>We automatically collect certain information when you use the Platform:</p>
        <ul>
          <li>IP address and device information</li>
          <li>Browser type and version</li>
          <li>Usage data and game activity</li>
          <li>Transaction history (on-chain and Platform Score)</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h4>2.3 Blockchain Information</h4>
        <p>
          Since we use blockchain technology, certain information is publicly available on the blockchain:
        </p>
        <ul>
          <li>Wallet addresses</li>
          <li>Transaction hashes</li>
          <li>Transaction amounts (for deposits/withdrawals)</li>
        </ul>
        <p>
          This information is immutable and publicly accessible on blockchain explorers.
        </p>
      </section>

      <section>
        <h3>3. How We Use Your Information</h3>
        <p>We use the collected information for:</p>
        <ul>
          <li><strong>Service Provision:</strong> To provide and maintain the gaming platform</li>
          <li><strong>Account Management:</strong> To create and manage your account</li>
          <li><strong>Transaction Processing:</strong> To process deposits, withdrawals, and game transactions</li>
          <li><strong>Game Functionality:</strong> To enable gameplay, matchmaking, and game statistics</li>
          <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security threats</li>
          <li><strong>Communication:</strong> To send you updates, notifications, and support responses</li>
          <li><strong>Analytics:</strong> To analyze usage patterns and improve our services</li>
          <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
        </ul>
      </section>

      <section>
        <h3>4. Web3Auth Integration</h3>
        <p>
          Our Platform uses Web3Auth for wallet authentication. When you connect your wallet:
        </p>
        <ul>
          <li>Web3Auth handles the authentication process</li>
          <li>We receive your wallet address and optional email (if using Google login)</li>
          <li>We do not have access to your private keys</li>
          <li>Web3Auth's privacy practices apply to their services</li>
        </ul>
        <p>
          For more information about Web3Auth's privacy practices, please review their Privacy Policy.
        </p>
      </section>

      <section>
        <h3>5. Blockchain and Wallet Information</h3>
        <p>
          <strong>Important:</strong> When you use blockchain features:
        </p>
        <ul>
          <li>Your wallet address is stored on our servers for account linking</li>
          <li>Transaction data is recorded on the blockchain (publicly visible)</li>
          <li>We do not store your private keys</li>
          <li>You are responsible for wallet security</li>
        </ul>
        <p>
          We cannot recover lost wallets or private keys. Please keep your wallet secure.
        </p>
      </section>

      <section>
        <h3>6. Information Sharing and Disclosure</h3>
        <p>We may share your information in the following circumstances:</p>
        
        <h4>6.1 Service Providers</h4>
        <p>We may share information with third-party service providers who perform services on our behalf:</p>
        <ul>
          <li>Web3Auth (authentication services)</li>
          <li>Blockchain infrastructure providers</li>
          <li>Cloud hosting and storage providers</li>
          <li>Analytics and monitoring services</li>
        </ul>

        <h4>6.2 Legal Requirements</h4>
        <p>We may disclose information if required by law or in response to:</p>
        <ul>
          <li>Court orders or legal processes</li>
          <li>Government requests</li>
          <li>Enforcement of our Terms of Service</li>
          <li>Protection of rights, property, or safety</li>
        </ul>

        <h4>6.3 Business Transfers</h4>
        <p>
          In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
        </p>

        <h4>6.4 With Your Consent</h4>
        <p>
          We may share information with your explicit consent or at your direction.
        </p>
      </section>

      <section>
        <h3>7. Data Security</h3>
        <p>
          We implement appropriate technical and organizational measures to protect your information:
        </p>
        <ul>
          <li>Encryption of sensitive data in transit and at rest</li>
          <li>Secure authentication and access controls</li>
          <li>Regular security assessments and updates</li>
          <li>Limited access to personal information on a need-to-know basis</li>
        </ul>
        <p>
          However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h3>8. Cookies and Tracking Technologies</h3>
        <p>
          We use cookies and similar tracking technologies to:
        </p>
        <ul>
          <li>Maintain your session and authentication state</li>
          <li>Remember your preferences</li>
          <li>Analyze platform usage and performance</li>
          <li>Provide personalized experiences</li>
        </ul>
        <p>
          You can control cookies through your browser settings, but disabling cookies may affect Platform functionality.
        </p>
      </section>

      <section>
        <h3>9. Your Rights and Choices</h3>
        <p>Depending on your jurisdiction, you may have the following rights:</p>
        <ul>
          <li><strong>Access:</strong> Request access to your personal information</li>
          <li><strong>Correction:</strong> Request correction of inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your information (subject to legal requirements)</li>
          <li><strong>Portability:</strong> Request transfer of your data</li>
          <li><strong>Objection:</strong> Object to certain processing activities</li>
          <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
        </ul>
        <p>
          To exercise these rights, please contact us through the Platform's support system.
        </p>
      </section>

      <section>
        <h3>10. Data Retention</h3>
        <p>
          We retain your information for as long as necessary to:
        </p>
        <ul>
          <li>Provide our services</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes</li>
          <li>Enforce our agreements</li>
        </ul>
        <p>
          Blockchain transaction data is immutable and permanently recorded on the blockchain.
        </p>
      </section>

      <section>
        <h3>11. Children's Privacy</h3>
        <p>
          The Platform is not intended for users under 18 years of age. We do not knowingly collect information from children. If you believe we have collected information from a child, please contact us immediately.
        </p>
      </section>

      <section>
        <h3>12. International Data Transfers</h3>
        <p>
          Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using the Platform, you consent to such transfers.
        </p>
      </section>

      <section>
        <h3>13. Third-Party Links and Services</h3>
        <p>
          The Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
        </p>
      </section>

      <section>
        <h3>14. Changes to This Privacy Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. Material changes will be notified through the Platform or via email. Your continued use of the Platform after changes constitutes acceptance of the updated Privacy Policy.
        </p>
      </section>

      <section>
        <h3>15. Contact Us</h3>
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us through the Platform's support system.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyContent;

