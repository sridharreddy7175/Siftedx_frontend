import React, { useEffect, useState } from "react";
interface Props {

}

const Terms: React.FC<Props> = (props: Props) => {
  return (
    <div>
      <div className="px-3 py-5">
        <div className="text-center mb-5">
          <h5 className="fw_8" >Terms of Services</h5>
        </div>
        <div>
          <label className="fw_8 mt-3">THE AGREEMENT:</label> The use of this website and services on this website provided by Siftedx (hereinafter
          referred to as "Company") are subject to the following Terms & Conditions (hereinafter the
          "Agreement"), all parts and sub-parts of which are specifically incorporated by reference here. This
          Agreement shall govern the use of all pages on this website (hereinafter collectively referred to as
          "Website") and any services provided by or on this Website ("Services").
          <br />
          <h6 className="fw_8 my-3">1) DEFINITIONS</h6>
          a) The parties referred to in this Agreement shall be defined as follows:
          <br />
          b) Company, Us, We: The Company, as the creator, operator, and publisher of the Website, makes
          the Website, and certain Services on it, available to users. Siftedx, Company, Us, We, Our, Ours
          and other first-person pronouns will refer to the Company, as well as all employees and affiliates
          of the Company.
          <br />
          c) You, the User, the Client: You, as the user of the Website, will be referred to throughout this
          Agreement with second-person pronouns such as You, Your, Yours, or as User or Client.
          <br />
          d) Parties: Collectively, the parties to this Agreement (the Company and You) will be referred to as
          Parties.
          <br />
          <h6 className="fw_8 my-3">2) ASSENT & ACCEPTANCE</h6>
          By using the Website, You warrant that You have read and reviewed this Agreement and that You agree to
          be bound by it. If You do not agree to be bound by this Agreement, please leave the Website
          immediately. The Company only agrees to provide use of this Website and Services to You if You assent to
          this Agreement.
          <h6 className="fw_8 my-3">3) AGE RESTRICTION</h6>
          You must be at least 18 (eighteen) years of age to use this Website or any Services contained herein. By
          using this Website, You represent and warrant that You are at least 18 years of age and may legally agree
          to this Agreement. The Company assumes no responsibility or liability for any misrepresentation of Your
          age.
          <h6 className="fw_8 my-3">4) LICENSE TO USE WEBSITE</h6>
          The Company may provide You with certain information as a result of Your use of the Website or Services.
          Such information may include but is not limited to, documentation, data, or information developed by
          the Company, and other materials which may assist in Your use of the Website or Services ("Company Materials"). Subject to this Agreement, the Company grants You a non-exclusive, limited,
          non-transferable and revocable license to use the Company Materials solely in connection with Your use
          of the Website and Services. The Company Materials may not be used for any other purpose, and this
          license terminates upon Your cessation of use of the Website or Services or at the termination of this
          Agreement.
          <h6 className="fw_8 my-3">5) INTELLECTUAL PROPERTY</h6>
          You agree that the Website and all Services provided by the Company are the property of the Company,
          including all copyrights, trademarks, trade secrets, patents, and other intellectual property ("Company
          IP"). You agree that the Company owns all right, title and interest in and to the Company IP and that You
          will not use the Company IP for any unlawful or infringing purpose. You agree not to reproduce or
          distribute the Company IP in any way, including electronically or via registration of any new trademarks,
          trade names, service marks or Uniform Resource Locators (URLs), without express written permission
          from the Company.
          <br />
          a) In order to make the Website and Services available to You, You hereby grant the
          Company a royalty-free, non-exclusive, worldwide license to copy, display, use, broadcast,
          transmit and make derivative works of any content You publish, upload, or otherwise
          make available to the Website ("Your Content"). The Company claims no further
          proprietary rights in Your Content.
          <br />
          b) If You feel that any of Your intellectual property rights have been infringed or otherwise
          violated by the posting of information or media by another of Our users, please Contact
          Us and let Us know.
          <br />
          <h6 className="fw_8 my-3">6) USER OBLIGATIONS</h6>
          As a user of the Website or Services, You may be asked to register with Us. When You do so, You will
          choose a user identifier, which may be Your email address or another term, as well as a password. You
          may also provide personal information, including, but not limited to, Your name. You are responsible for
          ensuring the accuracy of this information. This identifying information will enable You to use the Website
          and Services. You must not share such identifying information with any third party, and if You discover
          that your identifying information has been compromised, you agree to notify us immediately in writing.
          An email notification will suffice. You are responsible for maintaining the safety and security of Your
          identifying information as well as keeping Us apprised of any changes to Your identifying information.
          Providing false or inaccurate information or using the Website or Services to further fraud or unlawful
          activity is grounds for immediate termination of this Agreement.
          Also, you should keep in mind that SMEs or Recruiters will not ask for any money for selecting the
          candidate or in any other manner, if anyone is observed doing unethical activities, we find it appropriate
          to investigate, and take action against an illegal activity or suspected prohibited practices or, to uphold
          the right, property and ensure the safety of our customers and the company. Please note that SiftedX is
          not responsible or liable for any sort of unauthorized transactions.
          <h6 className="fw_8 my-3">7) ACCEPTABLE USAGE</h6>
          You agree not to use the Website or Services for any unlawful purpose, or any purpose prohibited under
          this clause. You agree not to use the Website or Services in any way that could damage the Website,
          Services, or general business of the Company.
          <br />
          You further agree not to use the Website or Services:
          <br />
          a) To harass, abuse, or threaten others or otherwise violate any person's legal rights.
          <br />
          b) To violate any intellectual property rights of the Company or any third party;
          <br />
          c) To upload or otherwise disseminate any computer viruses or other software that may damage
          the property of another.
          <br />
          d) To perpetrate any fraud.
          <br />
          e) To engage in or create any unlawful gambling, sweepstakes, pyramid scheme or unauthorized
          financial transactions.
          <br />
          f) To publish or distribute any obscene or defamatory material.
          <br />
          g) To publish or distribute any material that incites violence, hate, or discrimination towards any
          group.
          <br />
          h) To unlawfully gather information about others.
          <br />
          <h6 className="fw_8 my-3">8) AFFILIATE MARKETING & ADVERTISING</h6>
          The Company, through the Website and Services, may engage in affiliate marketing whereby the
          Company receives a commission on or percentage of the sale of services on or through the Website. The
          Company may also accept advertising and sponsorships from commercial businesses or receive other
          forms of advertising compensation. This disclosure is intended to comply with the US Federal Trade
          Commission Rules on marketing and advertising, as well as any other legal requirements which may
          apply.
          <h6 className="fw_8 my-3">9) PRIVACY INFORMATION</h6>
          Through Your Use of the Website and Services, You may provide Us with certain information. By using the
          Website or the Services, You authorize the Company to use Your information in the United States and any
          other country where We may operate.
          <br />
          a) Information We May Collect or Receive: When You register for an account, You provide Us with a
          valid email address and may provide Us with additional information, such as Your name or billing
          information. Depending on how You use Our Website or Services, We may also receive
          information from external applications that You use to access Our Website, or We may receive
          information through various web technologies, such as cookies, log files, clear gifs, web beacons
          or others.
          <br />
          b) How We Use Information: We use the information gathered from You to ensure Your continued
          good experience on Our website, including through email communication. We may also track
          certain aspects of the passive information received to improve Our marketing and analytics, and
          for this, We may work with third-party providers.
          <br />
          c) How You Can Protect Your Information: If You would like to disable Our access to any passive
          information We receive from the use of various technologies, You may choose to disable cookies
          in Your web browser. Please be aware that the Company will still receive information about You
          that You have provided, such as Your email address. The payment and billing information may be
          stored as long as the user account on the website is active so as to assist you with only
          exclusively to assist you only with making future purchases with us and is deleted immediately
          after such account is deleted.
          <h6 className="fw_8 my-3">10) SALES</h6>
          The Company may offer services or allow third parties to offer services on the Website. The Company
          undertakes to be as accurate as possible with all information regarding the services, including product
          descriptions and images. However, the Company does not guarantee the accuracy or reliability of any
          product information, and You acknowledge and agree that You purchase such products at Your own risk.
          For services sold by others, the Company assumes no liability for any product and cannot make any
          warranties about the merchantability, fitness, quality, safety, or legality of these products. For any claim
          You may have against the manufacturer or seller of the product, you agree to pursue that claim directly
          with the manufacturer or seller and not with the Company. You hereby release the Company from any
          claims related to services manufactured or sold by third parties, including any and all warranty or product
          liability claims.
          Please note that SiftedX is a matchmaking platform that matches the subject matter experts with a
          particular job to interview the candidates identified by the recruiters or hiring managers. If the recruiters
          or hiring managers to have any claims against the service or particular subject matter experts, they
          should be pursued directly with the subject matter experts and not SiftedX. Similarly, claims subject
          matter experts may have against hiring managers or recruiters or candidates, should be pursued directly
          with the hiring managers or recruiters or candidate and not SiftedX.
          <h6 className="fw_8 my-3">11) REVERSE ENGINEERING & SECURITY</h6>
          You agree not to undertake any of the following actions:
          <br />
          a) Reverse engineer, or attempt to reverse engineer or disassemble any code or software from or on
          the Website or Services;
          b) Violate the security of the Website or Services through any unauthorized access, circumvention of
          encryption or other security tools, data mining, or interference with any host, user, or network.
          <h6 className="fw_8 my-3"> 12) DATA LOSS</h6>
          The Company does not accept responsibility for the security of Your account or content. You agree that
          Your use of the Website or Services is at Your own risk.
          <h6 className="fw_8 my-3"> 13) INDEMNIFICATION</h6>
          You agree to defend and indemnify the Company and any of its affiliates (if applicable) and hold Us
          harmless against any and all legal claims and demands, including reasonable attorney's fees, which may
          arise from or relate to Your use or misuse of the Website or Services, Your breach of this Agreement, or
          Your conduct or actions. You agree that the Company shall be able to select its own legal counsel and
          may participate in its own defense, if the Company wishes.
          <h6 className="fw_8 my-3">14)SPAM POLICY</h6>
          You are strictly prohibited from using the Website or any of the Company's Services for illegal spam
          activities, including gathering email addresses and personal information from others or sending any mass
          commercial emails.
          <h6 className="fw_8 my-3"> 15) THIRD-PARTY LINKS & CONTENT</h6>
          The Company may occasionally post links to third-party websites or other services. You agree that the
          Company is not responsible or liable for any loss or damage caused as a result of Your use of any
          third-party services linked to Our Website.
          <h6 className="fw_8 my-3"> 16) MODIFICATION & VARIATION</h6>
          The Company may, from time to time and at any time without notice to You, modify this Agreement. You
          agree that the Company has the right to modify this Agreement or revise anything contained herein. You
          further agree that all modifications to this Agreement are in full force and effect immediately upon
          posting on the Website and that modifications or variations will replace any prior version of this
          Agreement unless prior versions are specifically referred to or incorporated into the latest modification or
          variation of this Agreement.
          <br />
          a) To the extent any part or sub-part of this Agreement is held ineffective or invalid by any court of
          law, You agree that the prior, effective version of this Agreement shall be considered enforceable
          and valid to the fullest extent.
          <br />
          b) You agree to routinely monitor this Agreement and refer to the Effective Date posted at the top of
          this Agreement to note modifications or variations. You further agree to clear Your cache when
          doing so to avoid accessing a prior version of this Agreement. You agree that Your continued use of
          the Website after any modifications to this Agreement is a manifestation of Your continued assent
          to this Agreement.
          <br />
          c) In the event that You fail to monitor any modifications to or variations of this Agreement, You agree
          that such failure shall be considered an affirmative waiver of Your right to review the modified
          Agreement.
          <h6 className="fw_8 my-3">17) ENTIRE AGREEMENT</h6>
          This Agreement constitutes the entire understanding between the Parties with respect to any and all use
          of this Website. This Agreement supersedes and replaces all prior or contemporaneous agreements or
          understandings, written or oral, regarding the use of this Website.
          <h6 className="fw_8 my-3">18) SERVICE INTERRUPTIONS</h6>
          The Company may need to interrupt Your access to the Website to perform maintenance or emergency
          services on a scheduled or unscheduled basis. You agree that Your access to the Website may be affected
          by unanticipated or unscheduled downtime, for any reason, but that the Company shall have no liability
          for any damage or loss caused as a result of such downtime.
          <h6 className="fw_8 my-3">19) TERM, TERMINATION & SUSPENSION</h6>
          The Company may terminate this Agreement with You at any time for any reason, with or without cause.
          The Company specifically reserves the right to terminate this Agreement if You violate any of the terms
          outlined herein, including, but not limited to, violating the intellectual property rights of the Company or
          a third party, failing to comply with applicable laws or other legal obligations, and/or publishing or
          distributing illegal material. If You have registered for an account with Us, You may also terminate this
          Agreement at any time by contacting Us and requesting termination. At the termination of this
          Agreement, any provisions that would be expected to survive termination by their nature shall remain in
          full force and effect.
          <h6 className="fw_8 my-3"> 20) NO WARRANTIES</h6>
          You agree that Your use of the Website and Services is at Your sole and exclusive risk and that any
          Services provided by Us are on an "As Is" basis. The Company hereby expressly disclaims any and all
          express or implied warranties of any kind, including, but not limited to the implied warranty of fitness for
          a particular purpose and the implied warranty of merchantability. The Company makes no warranties
          that the Website or Services will meet Your needs or that the Website or Services will be uninterrupted,
          error-free, or secure. The Company also makes no warranties as to the reliability or accuracy of any
          information on the Website or obtained through the Services. You agree that any damage that may occur
          to You, through Your computer system, or as a result of loss of Your data from Your use of the Website or
          Services is Your sole responsibility and that the Company is not liable for any such damage or loss.
          <h6 className="fw_8 my-3">21) LIMITATION ON LIABILITY</h6>
          The Company is not liable for any damages that may occur to You as a result of Your use of the Website or
          Services, to the fullest extent permitted by law. The maximum liability of the Company arising from or
          relating to this Agreement is limited to the greater of one hundred ($100) US Dollars or the amount You
          paid to the Company in the last six (6) months. This section applies to any and all claims by You, including,
          but not limited to, lost profits or revenues, consequential or punitive damages, negligence, strict liability,
          fraud, or torts of any kind.
          <h6 className="fw_8 my-3"> 22) FEE CHANGES:</h6>
          Siftedx, in its sole discretion and at any time, may modify the Subscription fees for the Subscriptions. Any
          Subscription fee change shall become effective at the end of the then-current Billing Cycle.
          Siftedx, shall provide you with reasonable prior notice of any change in Subscription fees to give you an
          opportunity to terminate your Subscription before such modifications become effective.
          Your continued use of the Service after the modification of the Subscription fee comes into effect
          constitutes your agreement to pay the modified Subscription fee amount.
          <h6 className="fw_8 my-3">23) GENERAL PROVISIONS:</h6>
          a) LANGUAGE: All communications made or notices given pursuant to this Agreement shall be
          in the English language.
          <br />
          b) JURISDICTION, VENUE & CHOICE OF LAW: Through Your use of the Website or Services, You
          agree that the laws of the State of Delaware shall govern any matter or dispute relating to
          or arising out of this Agreement, as well as any dispute of any kind that may arise between
          You and the Company, with the exception of its conflict of law provisions. In case any
          litigation specifically permitted under this Agreement is initiated, the Parties agree to
          submit to the personal jurisdiction of the state and federal courts of the following county:
          Delaware. The Parties agree that this choice of law, venue, and jurisdiction provision is not
          permissive, but rather mandatory in nature. You hereby waive the right to any objection of
          venue, including assertion of the doctrine of forum non conveniens or similar doctrine.
          <br />
          c) ARBITRATION: In case of a dispute between the Parties relating to or arising out of this
          Agreement, the Parties shall first attempt to resolve the dispute personally and in good
          faith. If these personal resolution attempts fail, the Parties shall then submit the dispute to
          binding arbitration. The arbitration shall be conducted in the following county: Delaware
          The arbitration shall be conducted by a single arbitrator, and such arbitrator shall have no
          authority to add Parties, vary the provisions of this Agreement, award punitive damages, or
          certify a class. The arbitrator shall be bound by applicable and governing Federal law as well
          as the law of the following state: Delaware. Each Party shall pay their own costs and fees.
          Claims necessitating arbitration under this section include, but are not limited to: contract
          claims, tort claims, claims based on Federal and state law, and claims based on local laws,
          ordinances, statutes or regulations. Intellectual property claims by the Company will not be
          subject to arbitration and may, as an exception to this sub-part, be litigated. The Parties, in
          agreement with this sub-part of this Agreement, waive any rights they may have to a jury
          trial in regard to arbitral claims.
          <br />
          d) ASSIGNMENT: This Agreement, or the rights granted hereunder, may not be assigned, sold,
          leased, or otherwise transferred in whole or part by You. Should this Agreement, or the
          rights granted hereunder, by assigned, sold, leased, or otherwise be transferred by the
          Company, the rights and liabilities of the Company will bind and insure to any assignees,
          administrators, successors, and executors.
          <br />
          e) SEVERABILITY: If any part or sub-part of this Agreement is held invalid or unenforceable by a
          court of law or competent arbitrator, the remaining parts and sub-parts will be enforced to
          the maximum extent possible. In such conditions, the remainder of this Agreement shall
          continue in full force.
          <br />
          f) NO WAIVER: In the event that We fail to enforce any provision of this Agreement, this shall
          not constitute a waiver of any future enforcement of that provision or of any other
          provision. Waiver of any part or sub-part of this Agreement will not constitute a waiver of
          any other part or sub-part.
          <br />
          g) HEADINGS FOR CONVENIENCE ONLY: Headings of parts and subparts under this Agreement
          are for convenience and organization, only. Headings shall not affect the meaning of any
          provisions of this Agreement.
          <br />
          h) NO AGENCY, PARTNERSHIP, OR JOINT VENTURE: No agency, partnership, or joint venture
          has been created between the Parties as a result of this Agreement. No Party has any
          authority to bind the other to third parties.
          <br />
          i) FORCE MAJEURE: The Company is not liable for any failure to perform due to causes beyond
          its reasonable control including, but not limited to, acts of God, acts of civil authorities, acts
          of military authorities, riots, embargoes, acts of nature and natural disasters, and other acts
          which may be due to unforeseen circumstances.
          <br />
          j) ELECTRONIC COMMUNICATIONS PERMITTED: Electronic communications are permitted to
          both Parties under this Agreement, including e-mail or fax. For any questions or concerns,
          please email Us at the following address: info@siftedx.com
          <br />
          <h6 className="fw_8 my-3">24) CHANGES:</h6>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is a
          material, we will try to provide at least 30 days notice prior to any new terms taking effect. What
          constitutes a material change shall be determined at our sole discretion.
          By continuing to access or use our Service after those revisions become effective, you agree to be bound
          by the revised terms. If you do not agree to the new terms, please stop using the Service.
        </div>
      </div >
    </div>
  );
};


export { Terms };