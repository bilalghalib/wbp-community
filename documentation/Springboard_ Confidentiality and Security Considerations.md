# **Springboard:** 

# **Confidentiality and Security Considerations** 

*This document is a starting point to guide our internal conversations about how we protect the trust of our members while building a digital platform for The Wellbeing Project Community. The intention is to define the principles, boundaries, and technical approaches that will keep everyone’s information safe, respected, and handled with care, security and integrity.*

1\. GUIDING PRINCIPLES

* We protect the privacy and dignity of every person who enters the platform.  
* We do not collect or store information we do not need.  
* We only use data to strengthen wellbeing, learning, and community impact.  
* Transparency comes first, so users always understand what we collect, why, and how it is used.

2\. SURVEYS: CONFIDENTIALITY AND ANONYMITY

* All surveys will be confidential and anonymous.  
* Responses will be aggregated so no individual can be identified.  
* No links between a specific person and their survey answers will be stored or visible.  
* Organizations will never be able to view the personal data or individual responses of their team members.  
* Any insights shared back to organizations will be at a group level only and only when the dataset is large enough to avoid indirect identification, and we will only generate insights when the dataset is large enough to avoid indirect identification  
  * No org-level reports unless there are at least 7 responses  
  * No sector or demographic reporting unless there are 7+ responses per filter  
  * Qualitative / open-text responses will only be shared when sample sizes are 7+   
* (Pending) Deletion: What gets deleted? After how many days? What remains only in aggregated form?

3\. ANALYTICS AND TRACKING

* The platform may track high-level patterns such as page visits, searches, and resource usage to improve the user experience and for additional analysis of the field  
* We will explicitly not track identifiable user behavior (no individual-level search logs or click trails), using anonymous ids for every user log in  
* Only aggregated and non-identifying analytics will be used for reporting.  
* (Pending) Storage: How long user accounts and files are kept after inactivity?, How long analytics logs are stored?, When and how data is deleted permanently?

4\. SERVER SECURITY

* (Pending) How access to the database will be restricted, How backups are handled and who can access them, Where data will be hosted (region, cloud provider, compliance standards), Encryption standards (in transit and at rest).


5\. USER ACCESS AND LOGIN

1. Community User Login  
2. Practitioner (Coach/Therapist) Login  
3. TWP Admin Login

User Rights: The user’s right to access their stored data, request deletion and understand how their information is used.  
(Pending) Possible login methods:

* Username and password  
* Single sign-on through email provider  
* Magic link option (email-based)  
* For practitioners: email and phone number required for verification and communication

We will also need shared clarity on:

* Password strength requirements  
* Security protocols for login attempts  
* Multi-factor authentication (optional or required)  
* Clarify whether any third-party analytics, email providers, or survey tools will be used.  
* Define what data these services can see and what they cannot see.

6\. ROLES AND PERMISSIONS  
Community Users

* Have access to platform with approved email address  
* Demographics are required for research accuracy and is used only in aggregated analysis  
* Identifiable demographic combinations will never be shown if they risk anonymity  
* Contact data (Email) is always separated from demographic data, email and login info are stored separately from survey responses and no technical mechanism exists to re-link them  
* (Pending) What users will explicitly consent to when they enter the platform

Practitioners / Coaches / Therapists

* Email and Phone fields will be public on a practitioner’s profile.  
* No communication with practitioners directly inside the platform  
* Can only update their profile and share resources 

TWP Admin

* View platform-wide aggregate analytics (Pending how analytics will be viewed and in what format)  
* View survey responses in aggregate form (for all orgs)  
* Create and deploy new surveys  
* Send messages into platform inboxes  
* Create or delete users and organizations  
* Manage tags and filters (first phase built on SQL backend with Bilal’s support)  
* Cannot view individual survey responses, view private user data beyond basic account information, or track specific user behavior on platform  
* (Pending) Update of Admin permissions

7\. TBD OPEN QUESTIONS FOR TEAM DISCUSSION

1. What data do we consider essential, and what should we avoid collecting altogether?  
2. How do we ensure transparency for users in simple, clear language / communication? (Consent Form)  
3. What security standards do we adopt for storage, encryption, and access?  
4. How do we structure permissions so no one has unnecessary visibility?  
5. What is our approach to data retention, deletion, and archiving?