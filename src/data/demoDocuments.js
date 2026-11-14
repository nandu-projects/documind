/**
 * Built-in Demo Documents for DocuMind
 * Realistic, verified multi-page campus and institutional documents for College Exhibition and demonstrations.
 */

export const SAMPLE_QUESTIONS = [
  {
    id: 'q1',
    question: 'What is the minimum attendance requirement?',
    expectedDoc: 'Campus_Academic_Policies_2026.pdf',
    category: 'Academics',
    tag: 'Attendance',
  },
  {
    id: 'q2',
    question: 'What are the project submission guidelines?',
    expectedDoc: 'Senior_Capstone_Project_Guidelines.pdf',
    category: 'Projects',
    tag: 'Submissions',
  },
  {
    id: 'q3',
    question: 'What are the library opening hours?',
    expectedDoc: 'Central_University_Library_Regulations.pdf',
    category: 'Facilities',
    tag: 'Library',
  },
  {
    id: 'q4',
    question: 'What are the student security rules?',
    expectedDoc: 'Campus_Security_and_Safety_Protocols.pdf',
    category: 'Safety',
    tag: 'Security',
  },
  {
    id: 'q5',
    question: 'What is the acceptable plagiarism limit for capstone projects?',
    expectedDoc: 'Senior_Capstone_Project_Guidelines.pdf',
    category: 'Research',
    tag: 'Integrity',
  },
  {
    id: 'q6',
    question: 'What is the overdue fine for library books?',
    expectedDoc: 'Central_University_Library_Regulations.pdf',
    category: 'Finance',
    tag: 'Circulation',
  },
];

export const DEMO_DOCUMENTS = [
  {
    id: 'demo_doc_academics_01',
    name: 'Campus_Academic_Policies_2026.pdf',
    size: 245760,
    pageCount: 3,
    totalWords: 780,
    uploadDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    isDemo: true,
    pages: [
      {
        pageNum: 1,
        wordCount: 260,
        text: `DEPARTMENT OF ACADEMIC AFFAIRS — INSTITUTIONAL POLICIES 2026
SECTION 1: ENROLLMENT AND ATTENDANCE POLICIES

1.1 Mandatory Attendance Regulation:
All registered undergraduate and postgraduate students are strictly required to maintain a minimum attendance requirement of 75% in each theory and practical subject across the entire academic semester. Attendance is tracked bi-hourly via biometric and faculty ERP systems.

1.2 Condonation for Medical or Extenuating Emergencies:
Students possessing attendance between 65% and 74.9% may apply for attendance condonation subject to submission of valid official medical certificates attested by the University Chief Medical Officer within 5 business days of resuming classes. Condonation is granted strictly at the discretion of the Academic Dean.

1.3 Disqualification and Course Detention:
Students with attendance falling below 65% are strictly disqualified from appearing in the Semester End Examinations (SEE). Such candidates will receive a 'Detained' (DE) grade and must re-register and repeat the coursework in the subsequent academic year. No exceptions or waivers are permitted under university bylaws.`,
      },
      {
        pageNum: 2,
        wordCount: 270,
        text: `SECTION 2: CONTINUOUS EVALUATION AND GRADING SCALE

2.1 Continuous Internal Assessment (CIA):
The academic evaluation structure comprises 50% weightage for Continuous Internal Assessment (CIA) and 50% weightage for Semester End Examinations (SEE). The CIA breakdown includes two mid-semester written assessments (30 marks total), surprise quizzes and assignments (10 marks), and active laboratory performance (10 marks).

2.2 Passing Standards and Minimum Thresholds:
To successfully clear a course, a candidate must obtain a minimum of 40% marks in the Semester End Examination (20 out of 50 marks) and an aggregate combined total of at least 50% across internal assessments and final examinations.

2.3 Ten-Point Letter Grading System:
Performance is classified on a 10-point scale:
- Outstanding (O): 90% - 100% (Grade Point: 10.0)
- Excellent (A+): 80% - 89% (Grade Point: 9.0)
- Very Good (A): 70% - 79% (Grade Point: 8.0)
- Good (B+): 60% - 69% (Grade Point: 7.0)
- Above Average (B): 55% - 59% (Grade Point: 6.0)
- Pass (C): 50% - 54% (Grade Point: 5.0)
- Fail (F): Below 50% (Grade Point: 0.0)`,
      },
      {
        pageNum: 3,
        wordCount: 250,
        text: `SECTION 3: RE-EVALUATION, MAKE-UP EXAMINATIONS, AND DEGREE CONFERRAL

3.1 Verification and Paper Re-Evaluation:
Students seeking re-evaluation of answer scripts must submit an online application within 10 days of results declaration along with the prescribed administrative fee of $25 per course. If the revised score differs by more than 15%, the script is referred to a third independent external examiner.

3.2 Supplementary and Make-up Examinations:
Make-up examinations are held exclusively for students with approved institutional sports leave or severe hospitalizations during regular exam schedules. Supplementary examinations for backlogs are conducted annually during the summer recess.

3.3 Degree Conferment & Honors Classification:
A student qualifies for the Bachelor of Technology Degree with First Class with Distinction if they achieve a Cumulative Grade Point Average (CGPA) of 8.50 or higher without any backlogs throughout the 8 semesters. Regular First Class requires a CGPA of 6.75 or higher.`,
      },
    ],
  },
  {
    id: 'demo_doc_capstone_02',
    name: 'Senior_Capstone_Project_Guidelines.pdf',
    size: 312000,
    pageCount: 3,
    totalWords: 840,
    uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    isDemo: true,
    pages: [
      {
        pageNum: 1,
        wordCount: 280,
        text: `OFFICE OF UNDERGRADUATE RESEARCH — CAPSTONE PROJECT DIRECTIVE
CHAPTER 1: PROJECT FORMATION, PROPOSAL, AND SUPERVISION

1.1 Team Formation Criteria:
The senior capstone project must be executed in collaborative teams of minimum 3 and maximum 4 students. Inter-disciplinary teams combining Computer Science, Artificial Intelligence, and Electronics are highly encouraged. Solo projects are strictly prohibited unless authorized under special entrepreneurial incubator tracks.

1.2 Faculty Guide Allocation:
Each capstone team is paired with an assigned faculty supervisor based on the domain expertise matching the submitted synopsis. A faculty member may supervise a maximum of 3 capstone batches per academic cycle.

1.3 Synopsis Submission Guidelines:
The initial project synopsis must be submitted by the end of Week 3 of the seventh semester. The synopsis must adhere strictly to the university template: Problem Statement, Research Objectives, Literature Survey of at least 10 peer-reviewed papers, Proposed System Architecture diagram, and Feasibility Matrix.`,
      },
      {
        pageNum: 2,
        wordCount: 290,
        text: `CHAPTER 2: PROJECT MILESTONES, REVIEWS, AND RUBRICS

2.1 Phase-1 Review (Seventh Semester Milestone):
Phase-1 accounts for 30% of total project marks. Assessment is conducted by an internal department committee based on:
- Depth of Literature Review (20%)
- Clarity of System Architecture and Design Specifications (30%)
- Preliminary Proof of Concept / Prototype Implementation (30%)
- Oral Presentation and Viva-Voce (20%)

2.2 Phase-2 Review & Final Evaluation (Eighth Semester Milestone):
Phase-2 accounts for 70% of total marks and requires complete product engineering. Deliverables include a fully functional software/hardware prototype, test coverage reports exceeding 80%, complete user documentation, and a working live demonstration before an external industry evaluator.

2.3 Plagiarism Check & Academic Integrity Policy:
The capstone project submission guidelines strictly dictate an acceptable plagiarism limit below 15% similarity index on Turnitin or Urkund, excluding standard IEEE reference bibliographies. Any submission exceeding 15% similarity will face immediate rejection, and the team will be awarded a grade deduction.`,
      },
      {
        pageNum: 3,
        wordCount: 270,
        text: `CHAPTER 3: FINAL THESIS FORMAT AND ARCHIVAL SUBMISSION

3.1 Thesis Formatting Guidelines:
The final report must be prepared strictly in standard IEEE double-column format using LaTeX or MS Word. Specifications:
- Font: Times New Roman, 12pt for body text, 1.5 line spacing.
- Margins: Left margin 1.5 inches (for binding allowance), Right/Top/Bottom margins 1.0 inch.
- Color coding: Chapter headings in Navy Blue (#002060).

3.2 Submission Deliverables and Deadlines:
Every team must submit two hard-bound thesis copies with golden embossed departmental insignia, signed Guide Approval certificates, and an indexed CD/USB containing source code, test suites, architecture schemas, and demonstration video recordings.

3.3 Intellectual Property & Open-Source Repository:
Source code must be published to a dedicated public GitHub repository with comprehensive README documentation, MIT or Apache 2.0 license, and reproducible setup scripts.`,
      },
    ],
  },
  {
    id: 'demo_doc_library_03',
    name: 'Central_University_Library_Regulations.pdf',
    size: 218000,
    pageCount: 3,
    totalWords: 750,
    uploadDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    isDemo: true,
    pages: [
      {
        pageNum: 1,
        wordCount: 240,
        text: `CENTRAL UNIVERSITY LIBRARY — USER HANDBOOK & OPERATING POLICIES
SECTION 1: OPERATING HOURS AND FACILITY ACCESS

1.1 Standard Library Opening Hours:
The Central University Library operates on the following schedule:
- Regular Academic Weekdays (Monday through Friday): 8:00 AM to 10:00 PM
- Weekends (Saturday and Sunday): 9:00 AM to 5:00 PM
- National and Gazetted Holidays: 9:00 AM to 1:00 PM (Reading Room only)
- Extended Examination Period Hours: Open until 12:00 Midnight during mid-term and semester final examination weeks.

1.2 24/7 Digital Portal Access:
The university's online digital repository and academic databases remain accessible 24 hours a day, 7 days a week from any on-campus or remote VPN connection at library.univ.edu.

1.3 Entry Protocols:
Entry to the library premises requires tapping an active RFID-enabled student smart identity card at the turnstiles. Personal bags, overcoats, and food items must be deposited in the personal locker zone at the reception counter.`,
      },
      {
        pageNum: 2,
        wordCount: 260,
        text: `SECTION 2: CIRCULATION, BORROWING QUOTAS, AND OVERDUE FINES

2.1 Borrowing Quotas by Member Category:
- Undergraduate Students: Up to 4 general circulation books for a duration of 14 calendar days.
- Postgraduate & Master's Students: Up to 6 books for a duration of 21 calendar days.
- Ph.D. Research Scholars: Up to 10 books for 30 calendar days.
- Faculty Members: Up to 15 books for the entire academic semester.

2.2 Overdue Fines and Penalties:
Failure to return borrowed books within the stipulated due date incurs an overdue fine of $1.00 per book per business day for the first 7 days, and $2.50 per book per day thereafter until returned.

2.3 Damaged and Lost Book Policy:
In the event of a lost or severely defaced volume, the borrower must replace the item with a new copy of the exact or latest edition plus an administrative processing surcharge of $10.00. Borrowing privileges are temporarily suspended until the fine is cleared.`,
      },
      {
        pageNum: 3,
        wordCount: 250,
        text: `SECTION 3: RESEARCH FACILITIES AND CODE OF CONDUCT

3.1 Digital Research Lab & Subscription Databases:
The 3rd floor digital pavilion houses 60 high-performance computer workstations providing direct, authenticated institutional access to premier subscription indices including IEEE Xplore, ACM Digital Library, SpringerLink, ScienceDirect, JSTOR, and Scopus.

3.2 Research Cubicles and Group Discussion Rooms:
Postgraduate students and research scholars may reserve collaborative discussion rooms for up to 3 hours per session via the online library portal.

3.3 Silence Zone and Ethics:
Absolute silence must be observed throughout the main reading floors. Cell phones must be switched to silent mode. Talking on mobile devices, smoking, consumption of edibles, and unauthorized photography are strictly prohibited and subject to immediate eviction and forfeiture of membership.`,
      },
    ],
  },
  {
    id: 'demo_doc_security_04',
    name: 'Campus_Security_and_Safety_Protocols.pdf',
    size: 280000,
    pageCount: 3,
    totalWords: 810,
    uploadDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    isDemo: true,
    pages: [
      {
        pageNum: 1,
        wordCount: 270,
        text: `DIRECTORATE OF CAMPUS SAFETY AND RESIDENCE PROTOCOLS
CHAPTER 1: STUDENT SECURITY RULES AND ACCESS CONTROLS

1.1 Mandatory Student Security Rules:
All enrolled students must prominently display and wear their authorized institutional RFID Smart Identity Card at all times while present within university academic buildings, laboratories, sports complexes, and hostel premises. Security personnel are mandated to deny entry to individuals without visible credential verification.

1.2 Campus Emergency Helpline & Response Team:
The Campus Security Control Room operates 24/7/365. For immediate medical, fire, or personal safety emergencies, students must contact the Central Emergency Helpline:
- Internal Intercom: Ext. 5555
- Toll-Free External Phone: 1-800-SAFE-EDU (1-800-723-3338)
- Mobile Security SOS: Dedicated dispatch via the Campus Shield mobile app.

1.3 Residential Curfew and Visitor Regulations:
All student residential hostels have an enforced night curfew of 10:30 PM on weekdays and 11:00 PM on weekends. Late entry requires prior formal biometric authorization and written parental notification via the warden's portal. External day visitors are restricted to administrative lobby areas only and must register with official government photo ID.`,
      },
      {
        pageNum: 2,
        wordCount: 270,
        text: `CHAPTER 2: LABORATORY AND HAZARD SAFETY PROTOCOLS

2.1 Personal Protective Equipment (PPE) Mandate:
Entry into Chemistry, Biotechnology, Mechanical, and High-Voltage Electrical engineering laboratories requires appropriate Personal Protective Equipment (PPE), including flame-resistant cotton lab coats, ANSI-certified splash safety goggles, closed-toe non-conductive shoes, and chemical nitrile gloves.

2.2 Chemical and Biological Spill Response:
All chemical storage cabinets are equipped with neutralizer spill kits. In case of an acid or biological spill, immediately isolate the zone, pull the local ventilation sash, flush affected skin for 15 minutes at the Emergency Eye Wash and Safety Shower station, and notify the laboratory technician immediately.

2.3 Fire Evacuation Protocols:
Every laboratory wing is equipped with Type ABC dry powder and CO2 fire extinguishers. In the event of a continuous audible fire alarm:
- Cease all experimentation immediately.
- Disconnect power supply mains.
- Evacuate via marked green Emergency Fire Exit stairwells. Do NOT use elevators under any circumstances.
- Assemble at Designated Assembly Point Alpha (Main Athletic Field).`,
      },
      {
        pageNum: 3,
        wordCount: 270,
        text: `CHAPTER 3: ANTI-HARASSMENT, CYBER INTEGRITY, AND STUDENT CONDUCT

3.1 Zero-Tolerance Anti-Ragging Regulation:
In accordance with National Regulatory Directives, ragging, hazing, psychological intimidation, or physical harassment of junior students in any form is classified as a severe criminal offense. Violation results in instantaneous expulsion, cancellation of academic degree, and mandatory filing of an official police First Information Report (FIR).

3.2 Internal Complaints and Grievance Committee:
A dedicated Women's Safety and Grievance Redressal Committee provides confidential hearings for reports of discrimination or harassment. Inquiries commence within 48 hours of complaint lodging.

3.3 Campus Cyber Safety & Network Acceptable Use Policy:
All internet access routed through the campus Wi-Fi network ('EduSecure-WLAN') is monitored for security compliance. Torrenting, commercial pirated streaming, unauthorized penetration testing against university firewalls, and hosting illicit servers are strictly forbidden. Infractions result in immediate MAC address blacklisting and disciplinary hearings.`,
      },
    ],
  },
];
