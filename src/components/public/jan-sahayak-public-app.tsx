"use client";

import type { CSSProperties, ReactNode } from "react";
import { useDeferredValue, useEffect, useState } from "react";

import { BIHAR_DISTRICTS } from "@/lib/domain/constants";
import {
  FLAGSHIP_PLV_TRACKS,
  QUICK_PLV_MODULES,
  TRAINING_ACADEMY_STATS,
  TRAINING_LIBRARY_COURSES,
  TRAINING_LIBRARY_PATHS,
  TRAINING_RESOURCE_CENTRE_URL,
  type TrainingAudience,
  type TrainingCourse,
  type TrainingModule,
} from "@/lib/domain/plv-training";

const PALETTE = {
  bg: "#FFF8F0",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  accent: "#C84B31",
  accentSoft: "rgba(200,75,49,0.08)",
  green: "#2E7D32",
  blue: "#1565C0",
  orange: "#E65100",
  purple: "#6A1B9A",
  teal: "#00695C",
  text: "#1A1A1A",
  dim: "#555555",
  border: "#E0D5CC",
  muted: "#888888",
} as const;

const DISTRICT_FELLOWS = [
  { name: "Nawaz Hassan", dist: "Araria" },
  { name: "Tausif Raza", dist: "Katihar" },
  { name: "Mithlesh Kumar", dist: "Bhagalpur" },
  { name: "Pintu Kumar Mehta", dist: "Kishanganj" },
  { name: "Nagmani", dist: "Purnia" },
  { name: "Sachina", dist: "Patna" },
] as const;

type Scheme = {
  id: string;
  cat: string;
  name: string;
  hi: string;
  desc: string;
  hi_desc: string;
  elig: string;
  docs: string[];
  apply: string;
  hotline: string;
};

type LegalAct = {
  id: string;
  cat: string;
  name: string;
  hi: string;
  desc: string;
  hi_desc: string;
  faqs: Array<{ q: string; a: string }>;
};

const CENTRAL_SCHEMES: Scheme[] = [
  {
    id: "cs1",
    cat: "Housing",
    name: "PM Awas Yojana (Gramin)",
    hi: "प्रधानमंत्री आवास योजना (ग्रामीण)",
    desc: "Free pucca house for rural families without proper shelter",
    hi_desc: "ग्रामीण परिवारों को मुफ्त पक्का मकान",
    elig: "BPL/AAY families in SECC list without pucca house",
    docs: ["Aadhar", "SECC/BPL card", "Bank account", "Land document"],
    apply: "Gram Panchayat / Block office online at pmayg.nic.in",
    hotline: "1800-11-6446",
  },
  {
    id: "cs2",
    cat: "Employment",
    name: "MGNREGS (Job Card)",
    hi: "मनरेगा (जॉब कार्ड)",
    desc: "100 days guaranteed wage employment per year for rural households",
    hi_desc: "ग्रामीण परिवारों को साल में 100 दिन का रोजगार",
    elig: "Any rural household adult willing to do unskilled manual work",
    docs: ["Aadhar", "Bank account", "Residence proof"],
    apply: "Gram Panchayat — apply for job card",
    hotline: "1800-111-555",
  },
  {
    id: "cs3",
    cat: "Food Security",
    name: "National Food Security Act / PDS",
    hi: "राष्ट्रीय खाद्य सुरक्षा अधिनियम / PDS",
    desc:
      "Subsidised food grains (5 kg/person/month) for priority households; AAY families get 35 kg",
    hi_desc: "प्राथमिकता परिवारों को 5 किग्रा/व्यक्ति/माह अनाज; AAY परिवारों को 35 किग्रा",
    elig: "Priority Household and Antyodaya Anna Yojana families",
    docs: ["Ration card application", "Aadhar", "Income proof"],
    apply: "Block Supply Office / ration card office",
    hotline: "14445",
  },
  {
    id: "cs4",
    cat: "Banking",
    name: "PM Jan Dhan Yojana",
    hi: "प्रधानमंत्री जन-धन योजना",
    desc: "Zero-balance bank account with Rs 2 lakh accident insurance, overdraft facility",
    hi_desc: "शून्य बैलेंस बैंक खाता, Rs 2 लाख बीमा",
    elig: "Any Indian adult without bank account",
    docs: ["Aadhar or photo ID", "Address proof"],
    apply: "Any nationalised bank branch",
    hotline: "1800-11-0001",
  },
  {
    id: "cs5",
    cat: "Health",
    name: "Ayushman Bharat (PM-JAY)",
    hi: "आयुष्मान भारत (PM-JAY)",
    desc:
      "Rs 5 lakh/year health cover for poor families in government and empanelled private hospitals",
    hi_desc: "गरीब परिवारों को Rs 5 लाख/वर्ष स्वास्थ्य बीमा",
    elig: "SECC-listed families; check at pmjay.gov.in",
    docs: ["Aadhar", "Ration card", "SECC certificate"],
    apply: "Nearest empanelled hospital / Common Service Centre",
    hotline: "14555",
  },
  {
    id: "cs6",
    cat: "Disability",
    name: "Rights of Persons with Disabilities (RPWD 2016)",
    hi: "दिव्यांगजन अधिकार अधिनियम 2016",
    desc:
      "Rights, reservation, education, employment, social security for persons with 21 types of disability",
    hi_desc: "21 प्रकार की दिव्यांगता में अधिकार, आरक्षण, शिक्षा, रोजगार",
    elig: "Persons with 40%+ disability (certified)",
    docs: ["Disability certificate from CMO", "Aadhar"],
    apply: "District Social Welfare Officer",
    hotline: "1800-11-4515",
  },
  {
    id: "cs7",
    cat: "Child Protection",
    name: "Mission Vatsalya (Child Protection)",
    hi: "मिशन वात्सल्य (बाल संरक्षण)",
    desc:
      "Protection, care and rehabilitation for children in need and children in conflict with law",
    hi_desc: "देखभाल और संरक्षण के जरूरतमंद बच्चों और कानून से संघर्षरत बच्चों की सुरक्षा",
    elig: "Children 0-18 in difficult circumstances",
    docs: ["Birth certificate", "Aadhar", "Parent/guardian ID"],
    apply: "Child Welfare Committee (CWC) / DCPU / Childline 1098",
    hotline: "1098",
  },
  {
    id: "cs8",
    cat: "Women",
    name: "PM Matru Vandana Yojana",
    hi: "प्रधानमंत्री मातृ वंदना योजना",
    desc: "Rs 6,000 cash incentive for first live birth to meet nutritional requirements",
    hi_desc: "पहले बच्चे पर Rs 6,000 की नकद सहायता",
    elig: "Pregnant/lactating women for first live birth (18+ years)",
    docs: ["Aadhar", "Bank account", "LMP certificate", "Anganwadi registration"],
    apply: "Anganwadi / ASHA worker",
    hotline: "7998799804",
  },
  {
    id: "cs9",
    cat: "Tribal",
    name: "Forest Rights Act 2006",
    hi: "वन अधिकार अधिनियम 2006",
    desc:
      "Individual and community forest land rights for Scheduled Tribes and traditional forest dwellers",
    hi_desc: "अनुसूचित जनजाति और पारंपरिक वन निवासियों को वन भूमि अधिकार",
    elig: "STs and OTFDs who occupied forest land before Dec 13, 2005",
    docs: [
      "Evidence of occupation (photos/witnesses)",
      "Caste certificate",
      "Village map",
      "Gram Sabha resolution",
    ],
    apply: "Gram Sabha → Sub-divisional committee → District committee",
    hotline: "Contact Jan Nyaya Abhiyan lawyer",
  },
  {
    id: "cs10",
    cat: "Labour",
    name: "Street Vendors (Protection) Act 2014",
    hi: "पथ विक्रेता (आजीविका संरक्षण) अधिनियम 2014",
    desc:
      "Legal protection for street vendors; right to vending certificate, no eviction without survey",
    hi_desc: "पथ विक्रेताओं को कानूनी सुरक्षा; वेंडिंग प्रमाण पत्र, सर्वे बिना बेदखली नहीं",
    elig: "All street vendors",
    docs: ["Vendor ID/certificate", "Aadhar", "Photo"],
    apply: "Town Vending Committee / Municipal office",
    hotline: "Contact Jan Nyaya Abhiyan lawyer",
  },
];

const BIHAR_SCHEMES: Scheme[] = [
  {
    id: "bs1",
    cat: "Girl Child",
    name: "Mukhyamantri Kanya Utthan Yojana",
    hi: "मुख्यमंत्री कन्या उत्थान योजना",
    desc:
      "Rs 50,000 cash incentive for girl from birth to graduation in multiple instalments",
    hi_desc: "बेटी के जन्म से स्नातक तक Rs 50,000 की किश्तों में सहायता",
    elig: "Girl child born in Bihar, family income <Rs 2L, unmarried at graduation",
    docs: [
      "Birth certificate",
      "Aadhar",
      "Bank account",
      "Income certificate",
      "10th/12th/Graduation marksheet",
    ],
    apply: "serviceonline.bihar.gov.in",
    hotline: "0612-2233333",
  },
  {
    id: "bs2",
    cat: "SC/ST",
    name: "SC/ST Atrocity Relief & Compensation (Bihar)",
    hi: "अनुसूचित जाति/जनजाति अत्याचार राहत और मुआवजा (बिहार)",
    desc:
      "Monetary compensation, legal aid, medical relief, and rehabilitation for SC/ST atrocity victims under SC/ST Act 1989",
    hi_desc: "SC/ST अत्याचार पीड़ितों को मुआवजा, कानूनी सहायता, चिकित्सा राहत",
    elig: "SC/ST persons who experienced violence, discrimination, or atrocity",
    docs: [
      "FIR copy",
      "Caste certificate",
      "Aadhar",
      "Medical certificate if applicable",
      "Bank account",
    ],
    apply: "District Magistrate / Social Welfare Dept",
    hotline: "Contact Jan Nyaya Abhiyan lawyer immediately",
  },
  {
    id: "bs3",
    cat: "SC/ST",
    name: "Maha Dalit Vikas Mission Schemes",
    hi: "महादलित विकास मिशन योजनाएं",
    desc:
      "Housing, education, livelihood, and empowerment schemes specifically for 21 Maha Dalit communities in Bihar",
    hi_desc: "बिहार की 21 महादलित जातियों के लिए आवास, शिक्षा, आजीविका योजनाएं",
    elig:
      "Members of 21 notified Maha Dalit communities in Bihar (Musahar, Dhobi, Nat, Dom, etc.)",
    docs: ["Caste certificate (Maha Dalit)", "Aadhar", "Income certificate"],
    apply: "Maha Dalit Vikas Mission District Office",
    hotline: "0612-2217870",
  },
  {
    id: "bs4",
    cat: "Women",
    name: "Bihar Women Development Corporation Schemes",
    hi: "बिहार महिला विकास निगम योजनाएं",
    desc:
      "Mukhyamantri Nari Shakti Yojana, violence support, self-help groups, legal aid for women",
    hi_desc: "महिला सशक्तीकरण, हिंसा सहायता, स्वयं सहायता समूह, कानूनी सहायता",
    elig: "Women of Bihar, priority to BPL/widows/abandoned women",
    docs: ["Aadhar", "Bank account", "Income certificate"],
    apply: "District Social Welfare / BWDC office",
    hotline: "0612-2506068",
  },
  {
    id: "bs5",
    cat: "Domestic Violence",
    name: "One Stop Centre (OSC) / Sakhi",
    hi: "वन स्टॉप सेंटर (OSC) / सखी",
    desc:
      "Immediate support for women victims — shelter, police help, legal aid, counselling, medical — 24x7",
    hi_desc:
      "हिंसा पीड़ित महिलाओं को आश्रय, पुलिस, कानूनी, परामर्श, चिकित्सा सहायता — 24x7",
    elig: "Women affected by any form of violence (domestic, sexual, acid attack, etc.)",
    docs: ["No documents required for immediate help"],
    apply: "Call 181 (Women Helpline) — OSC in all 38 districts",
    hotline: "181",
  },
  {
    id: "bs6",
    cat: "Land Rights",
    name: "Bihar Land to Landless / Dalit Schemes",
    hi: "भूमिहीन और दलितों को जमीन — बिहार योजनाएं",
    desc:
      "Vasudha scheme, homestead land rights (Bihar Homestead Privilege Act), Bhoodan land, mutation rights, land records correction",
    hi_desc:
      "वसुधा योजना, होमस्टेड भूमि अधिकार, भूदान भूमि, नामांतरण अधिकार, भूमि अभिलेख सुधार",
    elig: "Landless SC/ST/OBC families; traditional cultivators; Dalit communities",
    docs: ["Aadhar", "Caste certificate", "Land documents if any", "Application form"],
    apply: "Circle Officer / Revenue Officer / DM office",
    hotline: "Contact Jan Nyaya Abhiyan lawyer",
  },
  {
    id: "bs7",
    cat: "Child Protection",
    name: "Juvenile Justice (Care & Protection) Rules Bihar",
    hi: "किशोर न्याय (देखभाल और संरक्षण) — बिहार",
    desc:
      "Rights of children in conflict with law (JJB) and children in need of care and protection (CWC); shelter homes, bail, rehabilitation",
    hi_desc:
      "कानून से संघर्षरत बच्चों और देखभाल एवं संरक्षण की जरूरतमंद बच्चों के अधिकार",
    elig: "Any child under 18 years",
    docs: ["Birth certificate if available", "No documents required for immediate admission to shelter"],
    apply: "Child Welfare Committee / Juvenile Justice Board / Childline 1098",
    hotline: "1098",
  },
  {
    id: "bs8",
    cat: "Disability",
    name: "Bihar Viklang Pension and Marriage Schemes",
    hi: "बिहार विकलांग पेंशन और विवाह योजनाएं",
    desc:
      "Monthly pension Rs 300-500, Rs 1 lakh marriage incentive, educational scholarships for persons with disability",
    hi_desc: "Rs 300-500 मासिक पेंशन, Rs 1 लाख विवाह प्रोत्साहन, छात्रवृत्ति",
    elig: "Bihar resident with 40%+ disability certificate",
    docs: ["Disability certificate", "Aadhar", "Income certificate", "Bank account"],
    apply: "District Social Welfare Officer",
    hotline: "0612-2217705",
  },
  {
    id: "bs9",
    cat: "Housing",
    name: "PM Awas Yojana (Urban) – Bihar",
    hi: "PM आवास योजना (शहरी) — बिहार",
    desc:
      "Affordable housing for urban poor through Credit Linked Subsidy Scheme (CLSS) and in-situ slum redevelopment",
    hi_desc: "शहरी गरीबों के लिए किफायती आवास — ब्याज सब्सिडी और झुग्गी पुनर्विकास",
    elig: "Families without pucca house in notified urban areas; EWS/LIG/MIG",
    docs: ["Aadhar", "Income certificate", "Bank account", "Property documents if any"],
    apply: "Urban Local Body / UDHA office",
    hotline: "0612-2217456",
  },
  {
    id: "bs10",
    cat: "Education",
    name: "Bihar Student Credit Card (BSCC)",
    hi: "बिहार स्टूडेंट क्रेडिट कार्ड",
    desc:
      "Up to Rs 4 lakh education loan at 0% interest for higher education for Bihar students from BPL families",
    hi_desc: "BPL परिवारों के छात्रों को उच्च शिक्षा के लिए Rs 4 लाख तक 0% ब्याज पर ऋण",
    elig: "Bihar 12th pass students from families with annual income <Rs 4.5L",
    docs: ["12th marksheet", "Aadhar", "Income certificate", "Admission letter", "Bank account"],
    apply: "Apply online at 7nishchay-yuvaupmission.bihar.gov.in",
    hotline: "1800-3456-444",
  },
];

const LEGAL_ACTS: LegalAct[] = [
  {
    id: "la1",
    cat: "Criminal Law",
    name: "Bharatiya Nyaya Sanhita (BNS) 2023",
    hi: "भारतीय न्याय संहिता (BNS) 2023",
    desc:
      "Replaced IPC. Covers all criminal offences — murder, assault, rape, theft, fraud, sedition (now 'acts endangering sovereignty'). Key: organised crime (Sec 111), terrorism (Sec 113), hate speech (Sec 196).",
    hi_desc:
      "IPC की जगह। सभी आपराधिक अपराध। संगठित अपराध (धारा 111), आतंकवाद (धारा 113)।",
    faqs: [
      {
        q: "What replaced IPC Section 302 (murder)?",
        a: "BNS Section 103 — punishment is death or life imprisonment plus fine.",
      },
      {
        q: "What is the new law on rape?",
        a: "BNS Sections 63-69. Gang rape carries minimum 20 years to life. Child rape (under 12) carries death or life imprisonment.",
      },
      {
        q: "Is sedition still in law?",
        a: "Classic sedition (IPC 124A) is gone. Replaced by BNS Section 152 — 'acts endangering sovereignty' — which is broader in scope.",
      },
    ],
  },
  {
    id: "la2",
    cat: "Criminal Procedure",
    name: "Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023",
    hi: "भारतीय नागरिक सुरक्षा संहिता (BNSS) 2023",
    desc:
      "Replaced CrPC. Governs police powers, FIR, arrest, bail, trial procedure. Key changes: 90-day police custody (Sec 187), mandatory videography of crime scenes, Zero FIR mandatory.",
    hi_desc:
      "CrPC की जगह। FIR, गिरफ्तारी, जमानत, सुनवाई प्रक्रिया। Zero FIR अनिवार्य।",
    faqs: [
      {
        q: "What is a Zero FIR?",
        a: "Under BNSS Section 173, any police station must register FIR for any cognisable offence regardless of jurisdiction — then transfer to correct station. Police cannot say 'it's not our area'.",
      },
      {
        q: "How long can police hold someone in custody?",
        a: "Initial custody: 15 days magistrate remand. BNSS allows up to 90 days extended custody for offences punishable by 7+ years — a significant increase from CrPC.",
      },
      {
        q: "Can someone be arrested without a warrant?",
        a: "Yes for cognisable offences. But police must inform the person of grounds of arrest and inform a family member. D.K. Basu guidelines still apply.",
      },
    ],
  },
  {
    id: "la3",
    cat: "SC/ST Protection",
    name: "SC/ST Prevention of Atrocities Act 1989",
    hi: "अनुसूचित जाति/जनजाति अत्याचार निवारण अधिनियम 1989",
    desc:
      "Protects SC/ST from specific forms of violence and discrimination. Special courts, anticipatory bail restriction, mandatory FIR registration. 2015 Amendment strengthened provisions.",
    hi_desc:
      "SC/ST को हिंसा और भेदभाव से सुरक्षा। विशेष न्यायालय। प्रत्याशित जमानत पर प्रतिबंध।",
    faqs: [
      {
        q: "Can anticipatory bail be given in SC/ST Act cases?",
        a: "No — Supreme Court in Prithvi Raj Chauhan v. Union of India (2020) confirmed that anticipatory bail is NOT available in SC/ST Act cases.",
      },
      {
        q: "Is FIR mandatory under the Act?",
        a: "Yes. Police cannot refuse FIR. If refused, complaint can go directly to DSP/SP or Magistrate. Refusal itself is punishable.",
      },
      {
        q: "Who can file a case under SC/ST Act?",
        a: "Any SC/ST person who has experienced an atrocity. A police officer also has a duty to register the case suo motu if they witness or receive information.",
      },
    ],
  },
  {
    id: "la4",
    cat: "Women & Child",
    name: "POCSO Act 2012",
    hi: "POCSO अधिनियम 2012",
    desc:
      "Protection of Children from Sexual Offences. All sexual acts against persons under 18. Special courts, child-friendly procedure, mandatory reporting, 1-year time limit for trial.",
    hi_desc:
      "18 वर्ष से कम उम्र के बच्चों को यौन शोषण से सुरक्षा। विशेष न्यायालय, बाल-हितैषी प्रक्रिया।",
    faqs: [
      {
        q: "Who must report sexual abuse of a child?",
        a: "Any person with knowledge of abuse MUST report to police or DCPU — Section 19 makes it mandatory. Failure to report is punishable.",
      },
      {
        q: "Can the child's identity be revealed?",
        a: "No. Section 23 prohibits disclosure of child's identity in any media or public document. Violation is a criminal offence.",
      },
      {
        q: "What is the procedure during trial?",
        a: "Child records statement before Magistrate; statement to police with social worker present; no direct cross-examination of child; child should not see accused; can give evidence via video link.",
      },
    ],
  },
  {
    id: "la5",
    cat: "Women & Child",
    name: "Protection of Women from Domestic Violence Act 2005",
    hi: "घरेलू हिंसा से महिलाओं का संरक्षण अधिनियम 2005",
    desc:
      "Protects women from all forms of domestic violence. Provides protection orders, residence orders, monetary relief, custody orders. Applies to married, live-in, and relatives.",
    hi_desc:
      "घरेलू हिंसा (शारीरिक, भावनात्मक, यौन, आर्थिक) से महिलाओं की सुरक्षा। संरक्षण, निवास, मुआवजा आदेश।",
    faqs: [
      {
        q: "Who is protected under PWDVA?",
        a: "Any woman in a domestic relationship — wife, live-in partner, daughter, mother, sister — against any male or female member of the household.",
      },
      {
        q: "How quickly can a protection order be obtained?",
        a: "A Magistrate can pass an ex parte interim protection order on the same day without waiting for the other side if there is immediate danger.",
      },
      {
        q: "What does the Protection Officer (PO) do?",
        a: "PO helps the victim file a Domestic Incident Report (DIR), assists in getting medical aid, shelter, and legal aid, and produces the report before the Magistrate.",
      },
    ],
  },
  {
    id: "la6",
    cat: "Children",
    name: "Juvenile Justice (Care & Protection of Children) Act 2015",
    hi: "किशोर न्याय (बच्चों की देखभाल और संरक्षण) अधिनियम 2015",
    desc:
      "Governs children in conflict with law (JJB) and children in need of care and protection (CWC). Children under 18 cannot be sentenced as adults (except heinous offences for 16-18 via JJB assessment).",
    hi_desc:
      "कानून से संघर्षरत बच्चे (JJB) और देखभाल की जरूरतमंद बच्चे (CWC)। 18 वर्ष तक वयस्क के रूप में दंड नहीं।",
    faqs: [
      {
        q: "What is the Child Welfare Committee (CWC)?",
        a: "CWC is a statutory body in each district that handles children in need of care and protection — abandoned, abused, orphaned, runaway, trafficking victims. Contact via Childline 1098.",
      },
      {
        q: "What is the Juvenile Justice Board (JJB)?",
        a: "JJB handles children who have committed crimes. It is not a criminal court — focus is rehabilitation, not punishment. A child cannot be sent to adult jail.",
      },
      {
        q: "Can a 16-year-old be tried as an adult?",
        a: "Only for heinous offences (7+ years punishment). JJB must assess the child's mental and physical capacity before deciding. This requires legal representation — contact Jan Nyaya Abhiyan.",
      },
    ],
  },
  {
    id: "la7",
    cat: "Land Rights",
    name: "Bihar Land Reforms & Tenancy Laws",
    hi: "बिहार भूमि सुधार और काश्तकारी कानून",
    desc:
      "Bihar Land Reforms Act 1950, Bihar Tenancy Act 1885, Bihar Homestead Privilege Act, Bihar Bhoodan Yagna Act, Bihar Land Mutation Act — govern land ownership, tenancy, mutation, homestead rights.",
    hi_desc:
      "बिहार भूमि सुधार, काश्तकारी, होमस्टेड, भूदान, नामांतरण — भूमि स्वामित्व और अधिकार।",
    faqs: [
      {
        q: "What is homestead right (vasiyat)?",
        a: "Every agricultural labourer and rural artisan family in Bihar has right to homestead land (up to 3 decimals) under Bihar Homestead Privilege Persons Act. Apply to Circle Officer.",
      },
      {
        q: "How to get mutation (dakhil-kharij) done?",
        a: "File mutation application before Circle Officer with sale deed or heirship certificate. Online at bhumijankari.bihar.gov.in. If refused, appeal to Revenue Officer or DM.",
      },
      {
        q: "What to do if land is forcibly taken by upper caste?",
        a: "File FIR under SC/ST Atrocities Act if applicable. File writ petition for restoration of possession. Contact Jan Nyaya Abhiyan immediately.",
      },
    ],
  },
  {
    id: "la8",
    cat: "Constitution",
    name: "Constitution of India — Fundamental Rights",
    hi: "भारत का संविधान — मौलिक अधिकार",
    desc:
      "Articles 12-35. Right to Equality (14-18), Right against Discrimination (15), Right to Life (21), Right to Education (21A), Right against Exploitation (23-24), Freedom of Religion (25-28), Right to Constitutional Remedies (32).",
    hi_desc:
      "अनुच्छेद 12-35। समता, भेदभाव विरोध, जीवन का अधिकार, शिक्षा, शोषण विरोध, धार्मिक स्वतंत्रता, संवैधानिक उपचार।",
    faqs: [
      {
        q: "What is Article 21?",
        a: "Right to Life and Personal Liberty. The Supreme Court has expanded it to include right to livelihood, dignity, shelter, health, education, and clean environment.",
      },
      {
        q: "Can we directly go to Supreme Court for fundamental rights?",
        a: "Yes — Article 32 gives the right to move the Supreme Court for enforcement of fundamental rights. Patna High Court under Article 226 is often the first state-level forum.",
      },
      {
        q: "What is the right against untouchability?",
        a: "Article 17 abolishes untouchability absolutely. Practising it in any form is an offence punishable under the Protection of Civil Rights Act 1955 and the SC/ST Atrocities Act 1989.",
      },
    ],
  },
  {
    id: "la9",
    cat: "Environment",
    name: "Environmental Laws & Climate Justice",
    hi: "पर्यावरण कानून और जलवायु न्याय",
    desc:
      "Environment Protection Act 1986, Forest Rights Act 2006, Biological Diversity Act 2002, Water Act, Air Act, EIA notifications — right to clean environment, environmental justice, climate litigation.",
    hi_desc:
      "पर्यावरण संरक्षण अधिनियम, वन अधिकार, जैव विविधता, जल, वायु — स्वच्छ पर्यावरण का अधिकार।",
    faqs: [
      {
        q: "Can citizens file cases for environmental violations?",
        a: "Yes — PIL in Patna High Court or NGT. Environmental violations can also be reported to the State Pollution Control Board.",
      },
      {
        q: "Who protects forest communities' rights?",
        a: "Forest Rights Act 2006 — Gram Sabha has authority to grant and protect forest rights. State cannot evict forest dwellers without due procedure.",
      },
      {
        q: "What is the right to clean environment?",
        a: "Supreme Court judgments have held that the right to a clean environment is part of Article 21 right to life.",
      },
    ],
  },
  {
    id: "la10",
    cat: "Identity",
    name: "Birth/Death Registration & Identity Rights",
    hi: "जन्म/मृत्यु पंजीकरण और पहचान अधिकार",
    desc:
      "Registration of Births and Deaths Act 1969 — every birth and death must be registered. Essential for school admission, government schemes, marriage, passport, and land records.",
    hi_desc:
      "जन्म/मृत्यु पंजीकरण — स्कूल प्रवेश, सरकारी योजना, विवाह, पासपोर्ट, भूमि अभिलेख के लिए अनिवार्य।",
    faqs: [
      {
        q: "What if birth was not registered?",
        a: "Apply for late registration at the birth certificate office or panchayat. For adults without birth certificate, affidavit plus school or medical records may help.",
      },
      {
        q: "Can I get government schemes without Aadhar?",
        a: "Alternative documents should be accepted in many welfare settings. Contact Jan Nyaya Abhiyan if you are denied only for lack of Aadhar.",
      },
      {
        q: "What documents are needed for marriage registration?",
        a: "Age proof, address proof, photos, and witnesses are usually required. The exact list depends on the applicable law and district office.",
      },
    ],
  },
];

type Screen =
  | "home"
  | "intake"
  | "schemes"
  | "laws"
  | "plvTrain"
  | "plvJoin"
  | "plvSuccess"
  | "plvRefer";

type Language = "hi" | "en";
type HelpType = "legal" | "welfare" | "both";
type TriageType = "legal" | "welfare";
type TriageUrgency = "high" | "normal";

type HelpFormState = {
  name: string;
  phone: string;
  location: string;
  district: (typeof BIHAR_DISTRICTS)[number];
  issue: string;
  issueType: HelpType;
};

type PLVFormState = {
  name: string;
  phone: string;
  location: string;
  district: (typeof BIHAR_DISTRICTS)[number];
  age: string;
  education: string;
  motivation: string;
  referredBy: string;
};

type TriageResult = {
  type: TriageType;
  urgency: TriageUrgency;
  summary: string;
  hi_summary: string;
  issues: string[];
  next_steps: string[];
  hi_next_steps: string[];
};

type IssueSubmission = {
  id: string;
  name: string;
  phone: string;
  location: string;
  district: (typeof BIHAR_DISTRICTS)[number];
  issue: string;
  type: TriageType;
  urgency: TriageUrgency;
  summary: string;
  date: string;
  status: "pending";
};

type PLVSubmission = PLVFormState & {
  id: string;
  date: string;
  status: "applied";
};

type HeaderProps = {
  title: string;
  lang: Language;
  onBack?: () => void;
  onToggleLanguage: () => void;
};

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color?: "default" | "green" | "blue";
};

type FieldInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "tel" | "number";
  placeholder?: string;
  rows?: number;
};

type FieldSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
};

const STORAGE_KEYS = {
  submissions: "jan-sahayak-submissions",
  plv: "jan-sahayak-plv",
  referral: "jan-sahayak-referral-code",
} as const;

const DEFAULT_HELP_FORM: HelpFormState = {
  name: "",
  phone: "",
  location: "",
  district: "Purnia",
  issue: "",
  issueType: "legal",
};

const DEFAULT_PLV_FORM: PLVFormState = {
  name: "",
  phone: "",
  location: "",
  district: "Purnia",
  age: "",
  education: "",
  motivation: "",
  referredBy: "",
};

const sharedStyles: Record<string, CSSProperties> = {
  container: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "0 0 80px",
  },
  header: {
    background: PALETTE.accent,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 14,
    cursor: "pointer",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
    flex: 1,
  },
  languageButton: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "5px 10px",
    fontSize: 11,
    cursor: "pointer",
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "16px 18px",
    border: `1px solid ${PALETTE.border}`,
    marginBottom: 10,
  },
};

const bodyFont = "var(--font-public-body), var(--font-public-hindi), sans-serif";
const headingFont = "var(--font-public-hindi), var(--font-public-body), sans-serif";

const TRAINING_AUDIENCE_OPTIONS: Array<{
  value: TrainingAudience;
  icon: string;
  english: string;
  hindi: string;
}> = [
  { value: "all", icon: "🌐", english: "All", hindi: "सभी" },
  { value: "pl", icon: "📋", english: "PLVs", hindi: "PLV" },
  { value: "sw", icon: "👷", english: "Social workers", hindi: "सामाजिक कार्यकर्ता" },
  { value: "ls", icon: "🎓", english: "Law students", hindi: "विधि छात्र" },
  { value: "lw", icon: "⚖", english: "Lawyers", hindi: "अधिवक्ता" },
];

const TRAINING_AUDIENCE_BADGES: Record<
  Exclude<TrainingAudience, "all">,
  { english: string; hindi: string; background: string; color: string }
> = {
  pl: {
    english: "Paralegal",
    hindi: "पैरालीगल",
    background: "rgba(46,125,50,0.1)",
    color: PALETTE.green,
  },
  sw: {
    english: "Social Worker",
    hindi: "सामाजिक कार्यकर्ता",
    background: "rgba(230,81,0,0.1)",
    color: PALETTE.orange,
  },
  ls: {
    english: "Law Student",
    hindi: "विधि छात्र",
    background: "rgba(21,101,192,0.1)",
    color: PALETTE.blue,
  },
  lw: {
    english: "Lawyer",
    hindi: "अधिवक्ता",
    background: "rgba(106,27,154,0.1)",
    color: PALETTE.purple,
  },
};

function createId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function createReferralCode() {
  return `JNY-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function getTodayIsoDate() {
  return new Intl.DateTimeFormat("en-CA").format(new Date());
}

function readLocalStorage<T>(key: string, fallback: T) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalStorage(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function mapDistrictOptions() {
  return BIHAR_DISTRICTS.map((district) => ({
    label: district,
    value: district,
  }));
}

function ScreenHeader({ title, lang, onBack, onToggleLanguage }: HeaderProps) {
  return (
    <div style={sharedStyles.header}>
      {onBack ? (
        <button onClick={onBack} style={sharedStyles.backButton} type="button">
          ←
        </button>
      ) : null}
      <div style={sharedStyles.headerTitle}>{title}</div>
      <button onClick={onToggleLanguage} style={sharedStyles.languageButton} type="button">
        {lang === "hi" ? "EN" : "HI"}
      </button>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled = false, color = "default" }: ButtonProps) {
  const background =
    color === "green" ? PALETTE.green : color === "blue" ? PALETTE.blue : PALETTE.accent;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "15px",
        borderRadius: 12,
        border: "none",
        background: disabled ? "#ccc" : background,
        color: disabled ? "#888" : "#fff",
        fontSize: 16,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        marginTop: 10,
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: Pick<ButtonProps, "children" | "onClick">) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: 12,
        border: `2px solid ${PALETTE.border}`,
        background: "transparent",
        color: PALETTE.dim,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        marginTop: 8,
      }}
    >
      {children}
    </button>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  rows,
}: FieldInputProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: PALETTE.dim, display: "block", marginBottom: 5, fontWeight: 600 }}>
        {label}
      </label>
      {rows ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          placeholder={placeholder}
          style={{
            width: "100%",
            border: `2px solid ${PALETTE.border}`,
            borderRadius: 10,
            padding: "12px",
            fontSize: 14,
            color: PALETTE.text,
            lineHeight: 1.6,
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            border: `2px solid ${PALETTE.border}`,
            borderRadius: 10,
            padding: "12px",
            fontSize: 14,
            color: PALETTE.text,
            boxSizing: "border-box",
          }}
        />
      )}
    </div>
  );
}

function FieldSelect({ label, value, onChange, options }: FieldSelectProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: PALETTE.dim, display: "block", marginBottom: 5, fontWeight: 600 }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          border: `2px solid ${PALETTE.border}`,
          borderRadius: 10,
          padding: "12px",
          fontSize: 14,
          color: PALETTE.text,
          background: "#fff",
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TrainingCourseCard({
  course,
  isHindi,
  onOpen,
}: {
  course: TrainingCourse;
  isHindi: boolean;
  onOpen: (url: string) => void;
}) {
  const statusLabel =
    course.status === "coming_soon"
      ? isHindi
        ? "जल्द"
        : "Coming Soon"
      : course.badge ?? (isHindi ? "लाइव" : "Live");

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 15,
        border: `1px solid ${PALETTE.border}`,
        marginBottom: 10,
        overflow: "hidden",
        boxShadow: "0 10px 22px rgba(26,26,26,0.04)",
      }}
    >
      <div
        style={{
          height: 6,
          background: course.accent,
        }}
      />
      <div style={{ padding: "15px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: PALETTE.text }}>{isHindi ? course.hi : course.title}</div>
            <div style={{ fontSize: 12, color: PALETTE.dim, lineHeight: 1.6, marginTop: 4 }}>{course.summary}</div>
          </div>
          <span
            style={{
              borderRadius: 999,
              padding: "5px 9px",
              background: `${course.accent}15`,
              color: course.accent,
              fontSize: 10,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {statusLabel}
          </span>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
          {course.audiences.map((audience) => {
            const badge = TRAINING_AUDIENCE_BADGES[audience as Exclude<TrainingAudience, "all">];
            return (
              <span
                key={`${course.id}-${audience}`}
                style={{
                  borderRadius: 999,
                  padding: "4px 8px",
                  fontSize: 10,
                  fontWeight: 700,
                  background: badge.background,
                  color: badge.color,
                }}
              >
                {isHindi ? badge.hindi : badge.english}
              </span>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          {[course.levelsLabel, course.durationLabel, course.certificate].filter(Boolean).map((meta) => (
            <span
              key={`${course.id}-${meta}`}
              style={{
                borderRadius: 999,
                padding: "4px 8px",
                background: "#F8F3EF",
                color: PALETTE.dim,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {meta}
            </span>
          ))}
        </div>

        <button
          type="button"
          disabled={!course.href}
          onClick={() => {
            if (course.href) {
              onOpen(course.href);
            }
          }}
          style={{
            width: "100%",
            marginTop: 14,
            borderRadius: 10,
            border: course.href ? "none" : `1px solid ${PALETTE.border}`,
            background: course.href ? course.accent : "#F3F4F6",
            color: course.href ? "#fff" : PALETTE.muted,
            padding: "11px 12px",
            fontSize: 13,
            fontWeight: 700,
            cursor: course.href ? "pointer" : "not-allowed",
          }}
        >
          {course.href
            ? isHindi
              ? "कोर्स खोलें →"
              : "Open Course →"
            : isHindi
              ? "जल्द उपलब्ध होगा"
              : "Available Soon"}
        </button>
      </div>
    </div>
  );
}

export default function JanSahayakPublicApp() {
  const [lang, setLang] = useState<Language>("hi");
  const [screen, setScreen] = useState<Screen>("home");
  const [form, setForm] = useState<HelpFormState>(DEFAULT_HELP_FORM);
  const [plvForm, setPlvForm] = useState<PLVFormState>(DEFAULT_PLV_FORM);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [step, setStep] = useState(1);
  const [activeSchemeTab, setActiveSchemeTab] = useState<"central" | "bihar">("central");
  const [schemeSearch, setSchemeSearch] = useState("");
  const [activeLaw, setActiveLaw] = useState<LegalAct | null>(null);
  const [lawSearch, setLawSearch] = useState("");
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [trainingAudience, setTrainingAudience] = useState<TrainingAudience>("pl");
  const [trainingSearch, setTrainingSearch] = useState("");
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [referCode, setReferCode] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [plvSubs, setPlvSubs] = useState<PLVSubmission[]>([]);
  const [submissions, setSubmissions] = useState<IssueSubmission[]>([]);

  const deferredSchemeSearch = useDeferredValue(schemeSearch.trim().toLowerCase());
  const deferredLawSearch = useDeferredValue(lawSearch.trim().toLowerCase());
  const deferredTrainingSearch = useDeferredValue(trainingSearch.trim().toLowerCase());
  const isHindi = lang === "hi";
  const districtOptions = mapDistrictOptions();

  function tx(english: string, hindi: string) {
    return isHindi ? hindi : english;
  }

  useEffect(() => {
    setSubmissions(readLocalStorage<IssueSubmission[]>(STORAGE_KEYS.submissions, []));
    setPlvSubs(readLocalStorage<PLVSubmission[]>(STORAGE_KEYS.plv, []));

    const storedCode = readLocalStorage<string | null>(STORAGE_KEYS.referral, null);
    if (storedCode) {
      setReferCode(storedCode);
      return;
    }

    const nextCode = createReferralCode();
    setReferCode(nextCode);
    writeLocalStorage(STORAGE_KEYS.referral, nextCode);
  }, []);

  const fellow = DISTRICT_FELLOWS.find((entry) => entry.dist === form.district);
  const visibleSchemes = activeSchemeTab === "central" ? CENTRAL_SCHEMES : BIHAR_SCHEMES;
  const filteredSchemes = deferredSchemeSearch
    ? visibleSchemes.filter((scheme) => {
        const haystack = `${scheme.name} ${scheme.hi} ${scheme.cat} ${scheme.desc}`.toLowerCase();
        return haystack.includes(deferredSchemeSearch);
      })
    : visibleSchemes;
  const filteredLaws = deferredLawSearch
    ? LEGAL_ACTS.filter((law) => {
        const haystack = `${law.name} ${law.hi} ${law.cat} ${law.desc}`.toLowerCase();
        return haystack.includes(deferredLawSearch);
      })
    : LEGAL_ACTS;
  const filteredTrainingCourses = TRAINING_LIBRARY_COURSES.filter((course) => {
    const matchesAudience = trainingAudience === "all" || course.audiences.includes(trainingAudience);
    if (!matchesAudience) {
      return false;
    }

    if (!deferredTrainingSearch) {
      return true;
    }

    const haystack = `${course.title} ${course.hi} ${course.summary} ${course.keywords.join(" ")}`.toLowerCase();
    return haystack.includes(deferredTrainingSearch);
  });
  const liveTrainingCourses = filteredTrainingCourses.filter((course) => course.status === "live");
  const upcomingTrainingCourses = filteredTrainingCourses.filter((course) => course.status === "coming_soon");

  const trainingAudienceCounts: Record<TrainingAudience, number> = {
    all: TRAINING_LIBRARY_COURSES.length,
    sw: TRAINING_LIBRARY_COURSES.filter((course) => course.audiences.includes("sw")).length,
    pl: TRAINING_LIBRARY_COURSES.filter((course) => course.audiences.includes("pl")).length,
    ls: TRAINING_LIBRARY_COURSES.filter((course) => course.audiences.includes("ls")).length,
    lw: TRAINING_LIBRARY_COURSES.filter((course) => course.audiences.includes("lw")).length,
  };

  function updateForm(patch: Partial<HelpFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function updatePlvForm(patch: Partial<PLVFormState>) {
    setPlvForm((current) => ({ ...current, ...patch }));
  }

  function resetHelpFlow() {
    setStep(1);
    setTriage(null);
    setSubmitError("");
    setForm(DEFAULT_HELP_FORM);
  }

  function openPrefilledIntake(issue: string, issueType: HelpType) {
    const hasIdentity = form.name.trim().length > 0 && form.phone.trim().length > 0;
    setForm((current) => ({ ...current, issue, issueType }));
    setScreen("intake");
    setStep(hasIdentity ? 2 : 1);
  }

  function openExternalTraining(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function submitIssue() {
    setLoading(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/public/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as TriageResult & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to submit request.");
      }

      const nextTriage: TriageResult = {
        type: payload.type,
        urgency: payload.urgency,
        summary: payload.summary,
        hi_summary: payload.hi_summary,
        issues: payload.issues,
        next_steps: payload.next_steps,
        hi_next_steps: payload.hi_next_steps,
      };

      const nextSubmissions = [
        ...submissions,
        {
          id: createId(),
          name: form.name,
          phone: form.phone,
          location: form.location,
          district: form.district,
          issue: form.issue,
          type: nextTriage.type,
          urgency: nextTriage.urgency,
          summary: nextTriage.summary,
          date: getTodayIsoDate(),
          status: "pending" as const,
        },
      ];

      setTriage(nextTriage);
      setSubmissions(nextSubmissions);
      writeLocalStorage(STORAGE_KEYS.submissions, nextSubmissions);
      setStep(3);
    } catch {
      setSubmitError(
        tx(
          "We could not send your request right now. Please try again in a moment.",
          "हम अभी आपका अनुरोध भेज नहीं सके। कृपया थोड़ी देर में फिर प्रयास करें।",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitPLV() {
    if (!plvForm.name.trim() || !plvForm.phone.trim()) {
      return;
    }

    const nextSubmissions = [
      ...plvSubs,
      {
        ...plvForm,
        id: createId(),
        date: getTodayIsoDate(),
        status: "applied" as const,
      },
    ];

    setPlvSubs(nextSubmissions);
    writeLocalStorage(STORAGE_KEYS.plv, nextSubmissions);
    setScreen("plvSuccess");
  }

  async function copyReferralCode() {
    try {
      await navigator.clipboard.writeText(
        `Join Jan Sahayak PLV Programme with referral code: ${referCode}`,
      );
      setCopyMessage(tx("Referral code copied.", "रेफरल कोड कॉपी हो गया।"));
    } catch {
      setCopyMessage(tx("Clipboard access is unavailable on this device.", "इस डिवाइस पर कॉपी सुविधा उपलब्ध नहीं है।"));
    }
  }

  if (screen === "home") {
    const homeActions = [
      {
        icon: "🆘",
        label: tx("Get Help Now", "अभी मदद लें"),
        sub: tx("Legal issue, rights violation, FIR help", "कानूनी समस्या, अधिकार उल्लंघन, FIR मदद"),
        action: () => {
          setScreen("intake");
          setStep(1);
        },
        color: "#fff",
        textColor: PALETTE.accent,
      },
      {
        icon: "📋",
        label: tx("Government Schemes", "सरकारी योजनाएं"),
        sub: tx(
          "Central + Bihar schemes, eligibility, how to apply",
          "केंद्र + बिहार की योजनाएं",
        ),
        action: () => setScreen("schemes"),
      },
      {
        icon: "⚖",
        label: tx("Know Your Rights", "अपने अधिकार जानें"),
        sub: tx("Acts, laws, landmark cases, FAQs", "कानून, अधिनियम, महत्वपूर्ण मामले"),
        action: () => setScreen("laws"),
      },
      {
        icon: "📚",
        label: tx("PLV Training Modules", "PLV प्रशिक्षण मॉड्यूल"),
        sub: tx(
          "Quick modules plus Janman academy tracks and certificates",
          "त्वरित मॉड्यूल, Janman अकादमी ट्रैक और सर्टिफिकेट",
        ),
        action: () => setScreen("plvTrain"),
      },
      {
        icon: "🤝",
        label: tx("Join as PLV Volunteer", "PLV स्वयंसेवक बनें"),
        sub: tx("Register for paralegal volunteer training", "पैरालीगल प्रशिक्षण के लिए पंजीकरण"),
        action: () => setScreen("plvJoin"),
      },
      {
        icon: "📨",
        label: tx("Refer Someone as PLV", "किसी को PLV के लिए रेफर करें"),
        sub: tx(`Your referral code: ${referCode}`, `आपका रेफरल कोड: ${referCode}`),
        action: () => setScreen("plvRefer"),
      },
    ];

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg,#8B1A0A 0%,#C84B31 50%,#E8835C 100%)",
          fontFamily: bodyFont,
          colorScheme: "light",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px 60px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                margin: "0 auto 14px",
              }}
            >
              ⚖
            </div>
            <h1
              style={{
                fontFamily: headingFont,
                fontSize: 30,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 4,
              }}
            >
              {tx("Jan Sahayak", "जन सहायक")}
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
              Janman People&apos;s Foundation · Jan Nyaya Abhiyan
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
              {tx("Free Legal Help · Bihar", "मुफ्त कानूनी मदद · बिहार")}
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 14,
              padding: "14px 18px",
              marginBottom: 18,
              display: "flex",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {(["hi", "en"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLang(value)}
                style={{
                  padding: "8px 22px",
                  borderRadius: 10,
                  border: "none",
                  background: lang === value ? "#fff" : "transparent",
                  color: lang === value ? PALETTE.accent : "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {value === "hi" ? "हिंदी" : "English"}
              </button>
            ))}
          </div>

          {homeActions.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "14px 18px",
                borderRadius: 14,
                border: item.color ? "none" : "2px solid rgba(255,255,255,0.5)",
                background: item.color ?? "transparent",
                color: item.textColor ?? "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{item.label}</div>
                <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 400, marginTop: 2 }}>
                  {item.sub}
                </div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 18, opacity: 0.7 }}>→</span>
            </button>
          ))}

          <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            <div>Emergency: 112 · Women: 181 · Children: 1098</div>
            <div style={{ marginTop: 4 }}>Ambulance: 108 · Legal Aid: 15100</div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "intake") {
    return (
      <div style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
        <ScreenHeader
          title={tx("Get Help", "मदद लें")}
          lang={lang}
          onToggleLanguage={() => setLang(lang === "hi" ? "en" : "hi")}
          onBack={() => {
            if (step === 1) {
              setScreen("home");
              return;
            }

            setStep((current) => current - 1);
          }}
        />

        <div style={{ display: "flex", margin: "12px 20px 0" }}>
          {[1, 2].map((segment) => (
            <div
              key={segment}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: segment <= step ? PALETTE.accent : PALETTE.border,
                marginRight: segment < 2 ? 4 : 0,
              }}
            />
          ))}
        </div>

        <div style={{ ...sharedStyles.container, padding: "20px 20px 80px" }}>
          {step === 1 ? (
            <div>
              <h2
                style={{
                  fontFamily: headingFont,
                  fontSize: 20,
                  fontWeight: 700,
                  color: PALETTE.text,
                  marginBottom: 4,
                }}
              >
                {tx("Your Information", "आपकी जानकारी")}
              </h2>
              <p style={{ fontSize: 12, color: PALETTE.dim, marginBottom: 20 }}>
                {tx("All information is confidential and safe.", "आपकी जानकारी सुरक्षित है।")}
              </p>

              <FieldInput
                label={tx("Your Name", "आपका नाम")}
                value={form.name}
                onChange={(value) => updateForm({ name: value })}
                placeholder="e.g. Sunita Devi"
              />
              <FieldInput
                label={tx("Phone Number", "मोबाइल नंबर")}
                type="tel"
                value={form.phone}
                onChange={(value) => updateForm({ phone: value })}
                placeholder="9876543210"
              />
              <FieldInput
                label={tx("Village / Area", "गाँव / मोहल्ला")}
                value={form.location}
                onChange={(value) => updateForm({ location: value })}
                placeholder={tx("Your village or town", "आपका गाँव या शहर")}
              />
              <FieldSelect
                label={tx("District", "जिला")}
                value={form.district}
                onChange={(value) =>
                  updateForm({ district: value as HelpFormState["district"] })
                }
                options={districtOptions}
              />
              <PrimaryButton
                onClick={() => setStep(2)}
                disabled={!form.name.trim() || !form.phone.trim()}
              >
                {tx("Next →", "अगला →")}
              </PrimaryButton>
              <div
                style={{
                  padding: "12px 14px",
                  background: "rgba(200,75,49,0.07)",
                  borderRadius: 10,
                  marginTop: 12,
                  fontSize: 12,
                  color: PALETTE.dim,
                }}
              >
                {tx(
                  "Your information is kept confidential. It will only be shared with your assigned lawyer or social worker.",
                  "आपकी जानकारी गोपनीय है। केवल आपके वकील या सामाजिक कार्यकर्ता के साथ साझा की जाएगी।",
                )}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h2
                style={{
                  fontFamily: headingFont,
                  fontSize: 20,
                  fontWeight: 700,
                  color: PALETTE.text,
                  marginBottom: 4,
                }}
              >
                {tx("Your Problem", "आपकी समस्या")}
              </h2>
              <p style={{ fontSize: 12, color: PALETTE.dim, marginBottom: 20 }}>
                {tx(
                  "Tell us what happened in your own words. There is no right or wrong way.",
                  "जो हुआ वो अपने शब्दों में बताएं। कोई सही या गलत नहीं है।",
                )}
              </p>

              <FieldInput
                label={tx("Describe your situation", "अपनी स्थिति बताएं")}
                value={form.issue}
                onChange={(value) => updateForm({ issue: value })}
                rows={6}
                placeholder={tx(
                  "e.g. My husband beats me and has thrown me out of the house...",
                  "e.g. मेरे पति मुझे मारते हैं और घर से निकाल दिया है...",
                )}
              />
              <FieldSelect
                label={tx("Type of help needed", "किस प्रकार की मदद चाहिए")}
                value={form.issueType}
                onChange={(value) => updateForm({ issueType: value as HelpType })}
                options={[
                  {
                    value: "legal",
                    label: tx("Legal problem — FIR, court, rights", "कानूनी समस्या — FIR, अदालत, अधिकार"),
                  },
                  {
                    value: "welfare",
                    label: tx("Government scheme or service", "सरकारी योजना या सेवा"),
                  },
                  { value: "both", label: tx("Both", "दोनों") },
                ]}
              />

              <div
                style={{
                  padding: "12px 14px",
                  background: "rgba(200,75,49,0.07)",
                  borderRadius: 10,
                  marginBottom: 10,
                  fontSize: 12,
                }}
              >
                <div style={{ fontWeight: 700, color: PALETTE.accent, marginBottom: 3 }}>
                  {tx("Emergency contacts:", "आपातकालीन नंबर:")}
                </div>
                <div style={{ color: PALETTE.dim }}>Police: 112 · Women Helpline: 181 · Children: 1098</div>
              </div>

              <PrimaryButton onClick={submitIssue} disabled={loading || !form.issue.trim()}>
                {loading ? tx("Connecting...", "जोड़ रहे हैं...") : tx("Submit for Help", "मदद के लिए भेजें")}
              </PrimaryButton>

              {submitError ? (
                <div
                  style={{
                    marginTop: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "rgba(230,81,0,0.08)",
                    color: PALETTE.orange,
                    fontSize: 13,
                  }}
                >
                  {submitError}
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 3 && triage ? (
            <div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 52, marginBottom: 10 }}>{triage.urgency === "high" ? "🚨" : "✅"}</div>
                <h2
                  style={{
                    fontFamily: headingFont,
                    fontSize: 22,
                    fontWeight: 700,
                    color: PALETTE.text,
                    marginBottom: 4,
                  }}
                >
                  {tx("Thank You", "धन्यवाद")}
                </h2>
                <p style={{ fontSize: 13, color: PALETTE.dim }}>
                  {tx("Your request has been received.", "आपका अनुरोध प्राप्त हो गया।")}
                </p>
              </div>

              <div
                style={{
                  background: triage.type === "legal" ? PALETTE.accentSoft : "rgba(46,125,50,0.08)",
                  borderRadius: 14,
                  padding: "16px 18px",
                  marginBottom: 12,
                  border: `2px solid ${triage.type === "legal" ? PALETTE.accent : PALETTE.green}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>{triage.type === "legal" ? "⚖" : "📋"}</span>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: triage.type === "legal" ? PALETTE.accent : PALETTE.green,
                    }}
                  >
                    {tx(
                      triage.type === "legal"
                        ? "Legal issue — assigned to lawyer"
                        : "Welfare issue — assigned to social worker",
                      triage.type === "legal"
                        ? "कानूनी मामला — वकील को सौंपा"
                        : "योजना मामला — सामाजिक कार्यकर्ता को सौंपा",
                    )}
                  </div>
                </div>

                <div style={{ fontSize: 13, color: PALETTE.text, lineHeight: 1.7, marginBottom: 8 }}>
                  {isHindi ? triage.hi_summary : triage.summary}
                </div>

                {triage.issues.map((issue) => (
                  <div key={issue} style={{ fontSize: 12, color: PALETTE.dim, paddingTop: 4 }}>
                    • {issue}
                  </div>
                ))}
              </div>

              {fellow ? (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    padding: "14px 18px",
                    marginBottom: 12,
                    border: `1px solid ${PALETTE.border}`,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: PALETTE.dim, marginBottom: 6 }}>
                    {tx("YOUR DISTRICT FELLOW:", "आपके जिले के साथी:")}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: PALETTE.accentSoft,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        fontWeight: 700,
                        color: PALETTE.accent,
                      }}
                    >
                      {fellow.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: PALETTE.text }}>{fellow.name}</div>
                      <div style={{ fontSize: 11, color: PALETTE.dim }}>
                        District Legal Fellow — {fellow.dist} · Janman People&apos;s Foundation
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "14px 18px",
                  marginBottom: 12,
                  border: `1px solid ${PALETTE.border}`,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: PALETTE.dim, marginBottom: 8 }}>
                  {tx("NEXT STEPS:", "अगले कदम:")}
                </div>
                {(isHindi ? triage.hi_next_steps : triage.next_steps).map((entry, index) => (
                  <div
                    key={entry}
                    style={{ fontSize: 13, color: PALETTE.text, padding: "4px 0", display: "flex", gap: 8 }}
                  >
                    <span style={{ color: PALETTE.accent, fontWeight: 700, flexShrink: 0 }}>{index + 1}.</span>
                    {entry}
                  </div>
                ))}
              </div>

              <PrimaryButton
                color="green"
                onClick={() => {
                  setScreen("home");
                  resetHelpFlow();
                }}
              >
                ← {tx("Back to Home", "होम पर वापस")}
              </PrimaryButton>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (screen === "schemes") {
    return (
      <div style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
        <ScreenHeader
          title={tx("Government Schemes", "सरकारी योजनाएं")}
          lang={lang}
          onBack={() => setScreen("home")}
          onToggleLanguage={() => setLang(lang === "hi" ? "en" : "hi")}
        />
        <div style={{ ...sharedStyles.container, padding: "14px 16px 80px" }}>
          <input
            value={schemeSearch}
            onChange={(event) => setSchemeSearch(event.target.value)}
            placeholder={tx("Search schemes...", "योजनाएं खोजें...")}
            style={{
              width: "100%",
              border: `2px solid ${PALETTE.border}`,
              borderRadius: 10,
              padding: "11px 14px",
              fontSize: 14,
              color: PALETTE.text,
              marginBottom: 12,
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {(["central", "bihar"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveSchemeTab(tab);
                  setSchemeSearch("");
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: "none",
                  background: activeSchemeTab === tab ? PALETTE.accent : "#fff",
                  color: activeSchemeTab === tab ? "#fff" : PALETTE.dim,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {tab === "central" ? tx("Central Govt", "केंद्र सरकार") : tx("Bihar Govt", "बिहार सरकार")}
              </button>
            ))}
          </div>

          {filteredSchemes.length === 0 ? (
            <div style={{ textAlign: "center", color: PALETTE.dim, padding: 30 }}>
              {tx(`No schemes found for "${schemeSearch}"`, `"${schemeSearch}" के लिए कोई योजना नहीं मिली`)}
            </div>
          ) : null}

          {filteredSchemes.map((scheme) => (
            <details
              key={scheme.id}
              style={{
                background: "#fff",
                borderRadius: 13,
                marginBottom: 10,
                border: `1px solid ${PALETTE.border}`,
                overflow: "hidden",
              }}
            >
              <summary style={{ padding: "14px 16px", cursor: "pointer", listStyle: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 10,
                          background: PALETTE.accentSoft,
                          color: PALETTE.accent,
                          borderRadius: 6,
                          padding: "2px 7px",
                          fontWeight: 700,
                        }}
                      >
                        {scheme.cat}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: PALETTE.text }}>
                      {isHindi ? scheme.hi : scheme.name}
                    </div>
                    <div style={{ fontSize: 12, color: PALETTE.dim, marginTop: 3 }}>
                      {isHindi ? scheme.hi_desc : scheme.desc}
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: PALETTE.accent, flexShrink: 0 }}>+</span>
                </div>
              </summary>
              <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${PALETTE.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: PALETTE.dim, marginTop: 12, marginBottom: 5 }}>
                  {tx("ELIGIBILITY:", "पात्रता:")}
                </div>
                <div style={{ fontSize: 13, color: PALETTE.text, marginBottom: 10 }}>{scheme.elig}</div>

                <div style={{ fontSize: 12, fontWeight: 700, color: PALETTE.dim, marginBottom: 5 }}>
                  {tx("DOCUMENTS NEEDED:", "जरूरी दस्तावेज:")}
                </div>
                {scheme.docs.map((document) => (
                  <div
                    key={document}
                    style={{ fontSize: 13, color: PALETTE.text, padding: "2px 0", display: "flex", gap: 6 }}
                  >
                    <span style={{ color: PALETTE.green }}>✓</span>
                    {document}
                  </div>
                ))}

                <div
                  style={{
                    marginTop: 10,
                    padding: "9px 12px",
                    background: PALETTE.accentSoft,
                    borderRadius: 8,
                    fontSize: 12,
                    color: PALETTE.accent,
                  }}
                >
                  {scheme.apply}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    padding: "8px 12px",
                    background: "rgba(46,125,50,0.08)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: PALETTE.green,
                  }}
                >
                  Helpline: {scheme.hotline}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openPrefilledIntake(
                      `${tx("I need help with: ", "मुझे इस योजना में मदद चाहिए: ")}${isHindi ? scheme.hi : scheme.name}`,
                      "welfare",
                    )
                  }
                  style={{
                    width: "100%",
                    marginTop: 10,
                    padding: "10px",
                    borderRadius: 10,
                    border: "none",
                    background: PALETTE.accent,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {tx("Get Help with This Scheme →", "इस योजना में मदद लें →")}
                </button>
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "laws") {
    return (
      <div style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
        <ScreenHeader
          title={tx("Know Your Rights", "अपने अधिकार जानें")}
          lang={lang}
          onBack={() => {
            setScreen("home");
            setActiveLaw(null);
          }}
          onToggleLanguage={() => setLang(lang === "hi" ? "en" : "hi")}
        />
        <div style={{ ...sharedStyles.container, padding: "14px 16px 80px" }}>
          {!activeLaw ? (
            <div>
              <input
                value={lawSearch}
                onChange={(event) => setLawSearch(event.target.value)}
                placeholder={tx("Search laws and acts...", "कानून और अधिनियम खोजें...")}
                style={{
                  width: "100%",
                  border: `2px solid ${PALETTE.border}`,
                  borderRadius: 10,
                  padding: "11px 14px",
                  fontSize: 14,
                  color: PALETTE.text,
                  marginBottom: 14,
                  boxSizing: "border-box",
                }}
              />

              {filteredLaws.map((law) => (
                <button
                  key={law.id}
                  type="button"
                  onClick={() => setActiveLaw(law)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "14px 16px",
                    borderRadius: 13,
                    border: `1px solid ${PALETTE.border}`,
                    background: "#fff",
                    marginBottom: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 10,
                          background: PALETTE.accentSoft,
                          color: PALETTE.accent,
                          borderRadius: 6,
                          padding: "2px 7px",
                          fontWeight: 700,
                        }}
                      >
                        {law.cat}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: PALETTE.text, lineHeight: 1.4 }}>
                      {isHindi ? law.hi : law.name}
                    </div>
                    <div style={{ fontSize: 12, color: PALETTE.dim, marginTop: 4, lineHeight: 1.5 }}>
                      {isHindi ? law.hi_desc : law.desc}
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: PALETTE.accent, flexShrink: 0, marginTop: 4 }}>→</span>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setActiveLaw(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: PALETTE.accent,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginBottom: 12,
                  padding: "4px 0",
                }}
              >
                ← {tx("Back to list", "वापस")}
              </button>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "18px 20px",
                  marginBottom: 12,
                  border: `1px solid ${PALETTE.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    background: PALETTE.accentSoft,
                    color: PALETTE.accent,
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontWeight: 700,
                    display: "inline-block",
                    marginBottom: 8,
                  }}
                >
                  {activeLaw.cat}
                </div>
                <h2
                  style={{
                    fontFamily: headingFont,
                    fontSize: 18,
                    fontWeight: 700,
                    color: PALETTE.text,
                    marginBottom: 8,
                    lineHeight: 1.4,
                  }}
                >
                  {isHindi ? activeLaw.hi : activeLaw.name}
                </h2>
                <p style={{ fontSize: 13, color: PALETTE.dim, lineHeight: 1.75 }}>
                  {isHindi ? activeLaw.hi_desc : activeLaw.desc}
                </p>
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: `1px solid ${PALETTE.border}`,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: PALETTE.dim, marginBottom: 14 }}>
                  {tx("FREQUENTLY ASKED QUESTIONS:", "अक्सर पूछे जाने वाले प्रश्न:")}
                </div>

                {activeLaw.faqs.map((faq) => (
                  <details
                    key={faq.q}
                    style={{
                      marginBottom: 12,
                      padding: "12px 14px",
                      background: PALETTE.accentSoft,
                      borderRadius: 10,
                    }}
                  >
                    <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 14, color: PALETTE.text, listStyle: "none" }}>
                      {faq.q}
                    </summary>
                    <div
                      style={{
                        fontSize: 13,
                        color: PALETTE.dim,
                        lineHeight: 1.7,
                        marginTop: 10,
                        paddingTop: 10,
                        borderTop: `1px solid ${PALETTE.border}80`,
                      }}
                    >
                      {faq.a}
                    </div>
                  </details>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    openPrefilledIntake(
                      `${tx("I need legal help regarding: ", "इस कानून के बारे में मुझे मदद चाहिए: ")}${isHindi ? activeLaw.hi : activeLaw.name}`,
                      "legal",
                    )
                  }
                  style={{
                    width: "100%",
                    marginTop: 6,
                    padding: "12px",
                    borderRadius: 10,
                    border: "none",
                    background: PALETTE.accent,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {tx("Get Legal Help on This →", "इस पर कानूनी मदद लें →")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === "plvTrain") {
    if (activeModule) {
      return (
        <div style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
          <ScreenHeader
            title={isHindi ? activeModule.hi : activeModule.title}
            lang={lang}
            onBack={() => {
              setActiveModule(null);
              setQuizAnswer(null);
            }}
            onToggleLanguage={() => setLang(lang === "hi" ? "en" : "hi")}
          />
          <div style={{ ...sharedStyles.container, padding: "16px 16px 80px" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "18px 20px",
                marginBottom: 14,
                border: `1px solid ${PALETTE.border}`,
              }}
            >
              <p style={{ fontSize: 14, color: PALETTE.text, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
                {isHindi ? activeModule.hi_content : activeModule.content}
              </p>
            </div>

            <div
              style={{
                background: PALETTE.accentSoft,
                borderRadius: 14,
                padding: "18px 20px",
                border: `1px solid ${PALETTE.accent}33`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: PALETTE.accent, marginBottom: 12 }}>
                {tx("QUIZ", "प्रश्न")}
              </div>

              {activeModule.quiz.map((question) => (
                <div key={question.q}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: PALETTE.text, marginBottom: 12 }}>
                    {isHindi ? question.hi_q : question.q}
                  </div>
                  {question.options.map((option, optionIndex) => {
                    const correct = optionIndex === question.correct;
                    const selected = quizAnswer === optionIndex;
                    const reveal = quizAnswer !== null;
                    let background: string = "#fff";
                    let border: string = `1px solid ${PALETTE.border}`;
                    let color: string = PALETTE.text;

                    if (reveal && correct) {
                      background = "rgba(46,125,50,0.1)";
                      border = `2px solid ${PALETTE.green}`;
                      color = PALETTE.green;
                    } else if (reveal && selected && !correct) {
                      background = "rgba(200,75,49,0.1)";
                      border = `2px solid ${PALETTE.accent}`;
                      color = PALETTE.accent;
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          if (quizAnswer === null) {
                            setQuizAnswer(optionIndex);
                          }
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "12px 14px",
                          borderRadius: 10,
                          border,
                          background,
                          color,
                          fontSize: 13,
                          cursor: quizAnswer === null ? "pointer" : "default",
                          marginBottom: 8,
                          fontWeight: correct && reveal ? 700 : 400,
                        }}
                      >
                        {reveal && correct ? "✓ " : ""}
                        {reveal && selected && !correct ? "✗ " : ""}
                        {option}
                      </button>
                    );
                  })}

                  {quizAnswer !== null ? (
                    <div
                      style={{
                        padding: "10px 12px",
                        background: "rgba(46,125,50,0.1)",
                        borderRadius: 10,
                        fontSize: 13,
                        color: PALETTE.green,
                        marginTop: 4,
                      }}
                    >
                      {quizAnswer === question.correct
                        ? tx("Correct! Well done!", "सही जवाब! बहुत अच्छे!")
                        : `${tx("Correct answer: ", "सही उत्तर: ")}${question.options[question.correct]}`}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <PrimaryButton
              onClick={() => {
                setActiveModule(null);
                setQuizAnswer(null);
              }}
            >
              {tx("← Back to Modules", "← मॉड्यूल पर वापस")}
            </PrimaryButton>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
        <ScreenHeader
          title={tx("PLV Training Modules", "PLV प्रशिक्षण मॉड्यूल")}
          lang={lang}
          onBack={() => setScreen("home")}
          onToggleLanguage={() => setLang(lang === "hi" ? "en" : "hi")}
        />
        <div style={{ ...sharedStyles.container, padding: "16px 16px 80px" }}>
          <div
            style={{
              background: "linear-gradient(135deg,#1E1B4B 0%,#312E81 45%,#4C1D95 100%)",
              borderRadius: 18,
              padding: "20px 18px",
              color: "#fff",
              marginBottom: 16,
              boxShadow: "0 14px 28px rgba(49,46,129,0.18)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 999,
                padding: "6px 12px",
                fontSize: 11,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              <span>📚</span>
              {tx("Jan Nyaya Resource Centre", "जन न्याय रिसोर्स सेंटर")}
            </div>
            <div style={{ fontFamily: headingFont, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
              {tx("PLV Academy", "PLV अकादमी")}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.86)", marginBottom: 16 }}>
              {tx(
                "Start with quick field modules inside Jan Sahayak, then move into structured Janman training tracks with levels, certificates, and role-based course paths for paralegals, social workers, students, and lawyers.",
                "जन सहायक के छोटे फील्ड मॉड्यूल से शुरुआत करें, फिर Janman के विस्तृत प्रशिक्षण ट्रैक्स में जाएं जहाँ लेवल, सर्टिफिकेट और PLV, सामाजिक कार्यकर्ता, विधि छात्र और अधिवक्ताओं के लिए अलग-अलग कोर्स पथ हैं।",
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                TRAINING_ACADEMY_STATS.programmesLive,
                TRAINING_ACADEMY_STATS.coursesAndTracks,
                TRAINING_ACADEMY_STATS.hoursOfContent,
                TRAINING_ACADEMY_STATS.caseAnalyses,
              ].map((entry) => (
                <div
                  key={entry}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {entry}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button
                type="button"
                onClick={() => openExternalTraining(TRAINING_RESOURCE_CENTRE_URL)}
                style={{
                  flex: 1,
                  border: "none",
                  borderRadius: 10,
                  background: "#fff",
                  color: PALETTE.accent,
                  padding: "11px 12px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {tx("Open Full Resource Centre", "पूरा रिसोर्स सेंटर खोलें")}
              </button>
              <button
                type="button"
                onClick={() => setScreen("plvJoin")}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.22)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  padding: "11px 12px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {tx("Join as PLV", "PLV बनें")}
              </button>
            </div>
          </div>

          <div style={{ fontSize: 16, fontWeight: 700, color: PALETTE.text, marginBottom: 6 }}>
            {tx("Quick Rights Modules", "त्वरित अधिकार मॉड्यूल")}
          </div>
          <div style={{ fontSize: 13, color: PALETTE.dim, marginBottom: 14, lineHeight: 1.6 }}>
            {tx(
              "Short modules for immediate field use. These are ideal for new PLVs, village meetings, and legal literacy sessions.",
              "ये छोटे मॉड्यूल तुरंत फील्ड उपयोग के लिए हैं। नए PLV, गाँव बैठकों और कानूनी साक्षरता सत्रों के लिए उपयुक्त हैं।",
            )}
          </div>

          {QUICK_PLV_MODULES.map((module) => (
            <button
              key={module.id}
              type="button"
              onClick={() => {
                setActiveModule(module);
                setQuizAnswer(null);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "16px 18px",
                borderRadius: 13,
                border: `1px solid ${PALETTE.border}`,
                background: "#fff",
                marginBottom: 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span style={{ fontSize: 26, flexShrink: 0 }}>{module.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: PALETTE.text }}>
                  {isHindi ? module.hi : module.title}
                </div>
                <div style={{ fontSize: 12, color: PALETTE.dim, marginTop: 3 }}>
                  {tx("Tap to learn · quiz included", "सीखने के लिए दबाएं · प्रश्न भी है")}
                </div>
              </div>
              <span style={{ fontSize: 18, color: PALETTE.accent }}>→</span>
            </button>
          ))}

          <div style={{ fontSize: 16, fontWeight: 700, color: PALETTE.text, marginTop: 18, marginBottom: 6 }}>
            {tx("Flagship Tracks For PLVs", "PLV के लिए प्रमुख ट्रैक")}
          </div>
          <div style={{ fontSize: 13, color: PALETTE.dim, marginBottom: 14, lineHeight: 1.6 }}>
            {tx(
              "These deeper tracks from the Janman training centre are ideal for serious PLV onboarding and refresher cycles.",
              "Janman प्रशिक्षण केंद्र के ये विस्तृत ट्रैक गंभीर PLV प्रशिक्षण और पुनर्पाठ के लिए उपयुक्त हैं।",
            )}
          </div>

          {FLAGSHIP_PLV_TRACKS.map((track) => (
            <div
              key={track.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: `1px solid ${PALETTE.border}`,
                marginBottom: 12,
                overflow: "hidden",
                boxShadow: "0 10px 22px rgba(26,26,26,0.05)",
              }}
            >
              <div
                style={{
                  padding: "16px 18px 14px",
                  background: `${track.accent}12`,
                  borderBottom: `1px solid ${PALETTE.border}`,
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: track.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 21,
                      flexShrink: 0,
                    }}
                  >
                    {track.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: PALETTE.text }}>
                      {isHindi ? track.hi : track.title}
                    </div>
                    <div style={{ fontSize: 12, color: PALETTE.dim, marginTop: 4, lineHeight: 1.6 }}>
                      {track.summary}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                      {track.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            borderRadius: 999,
                            padding: "4px 9px",
                            fontSize: 10,
                            fontWeight: 700,
                            color: track.accent,
                            background: "#fff",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: "14px 18px 16px" }}>
                {track.levels.map((level, index) => (
                  <div
                    key={`${track.id}-${level.label}`}
                    style={{
                      display: "flex",
                      gap: 10,
                      paddingBottom: index === track.levels.length - 1 ? 0 : 12,
                      marginBottom: index === track.levels.length - 1 ? 0 : 12,
                      borderBottom: index === track.levels.length - 1 ? "none" : `1px solid ${PALETTE.border}`,
                    }}
                  >
                    <div
                      style={{
                        minWidth: 74,
                        fontSize: 11,
                        fontWeight: 700,
                        color: track.accent,
                        textTransform: "uppercase",
                        paddingTop: 2,
                      }}
                    >
                      {level.label}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: PALETTE.text }}>{level.title}</div>
                      <div style={{ fontSize: 12, color: PALETTE.dim, lineHeight: 1.6, marginTop: 3 }}>
                        {level.summary}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => openExternalTraining(track.href)}
                  style={{
                    width: "100%",
                    marginTop: 14,
                    borderRadius: 10,
                    border: "none",
                    background: track.accent,
                    color: "#fff",
                    padding: "12px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {tx("Open Detailed Track →", "विस्तृत ट्रैक खोलें →")}
                </button>
              </div>
            </div>
          ))}

          <div style={{ fontSize: 16, fontWeight: 700, color: PALETTE.text, marginTop: 18, marginBottom: 6 }}>
            {tx("Role-Based Course Library", "भूमिका आधारित कोर्स लाइब्रेरी")}
          </div>
          <div style={{ fontSize: 13, color: PALETTE.dim, marginBottom: 12, lineHeight: 1.6 }}>
            {tx(
              "Filter by audience and search by topic to find the right training path. The PLV filter is selected by default.",
              "उपयुक्त प्रशिक्षण खोजने के लिए भूमिका अनुसार फ़िल्टर करें और विषय से खोजें। PLV फ़िल्टर डिफ़ॉल्ट रूप से चुना गया है।",
            )}
          </div>

          <input
            value={trainingSearch}
            onChange={(event) => setTrainingSearch(event.target.value)}
            placeholder={tx(
              "Search: child rights, FIR, compensation, constitutional rights...",
              "खोजें: child rights, FIR, compensation, constitutional rights...",
            )}
            style={{
              width: "100%",
              border: `2px solid ${PALETTE.border}`,
              borderRadius: 12,
              padding: "12px 14px",
              fontSize: 14,
              color: PALETTE.text,
              marginBottom: 12,
              boxSizing: "border-box",
              background: "#fff",
            }}
          />

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {TRAINING_AUDIENCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTrainingAudience(option.value)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 999,
                  border:
                    trainingAudience === option.value
                      ? `2px solid ${PALETTE.accent}`
                      : `2px solid ${PALETTE.border}`,
                  background: trainingAudience === option.value ? PALETTE.accentSoft : "#fff",
                  color: trainingAudience === option.value ? PALETTE.accent : PALETTE.dim,
                  padding: "8px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <span>{option.icon}</span>
                <span>{isHindi ? option.hindi : option.english}</span>
                <span
                  style={{
                    borderRadius: 999,
                    padding: "1px 7px",
                    background: trainingAudience === option.value ? "#fff" : PALETTE.accentSoft,
                    color: trainingAudience === option.value ? PALETTE.accent : PALETTE.dim,
                    fontSize: 10,
                  }}
                >
                  {trainingAudienceCounts[option.value]}
                </span>
              </button>
            ))}
          </div>

          {filteredTrainingCourses.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "16px 18px",
                border: `1px solid ${PALETTE.border}`,
                color: PALETTE.dim,
                fontSize: 13,
                marginBottom: 12,
              }}
            >
              {tx(
                "No courses matched this search. Try another topic or switch the audience filter.",
                "इस खोज के लिए कोई कोर्स नहीं मिला। दूसरा विषय खोजें या फ़िल्टर बदलें।",
              )}
            </div>
          ) : null}

          {liveTrainingCourses.length > 0 ? (
            <div style={{ fontSize: 14, fontWeight: 700, color: PALETTE.text, marginBottom: 8 }}>
              {tx("Live Courses", "चालू कोर्स")}
            </div>
          ) : null}

          {liveTrainingCourses.map((course) => (
            <TrainingCourseCard
              key={course.id}
              course={course}
              isHindi={isHindi}
              onOpen={openExternalTraining}
            />
          ))}

          {upcomingTrainingCourses.length > 0 ? (
            <div style={{ fontSize: 14, fontWeight: 700, color: PALETTE.text, marginTop: 14, marginBottom: 8 }}>
              {tx("Coming Soon", "जल्द आने वाले")}
            </div>
          ) : null}

          {upcomingTrainingCourses.map((course) => (
            <TrainingCourseCard
              key={course.id}
              course={course}
              isHindi={isHindi}
              onOpen={openExternalTraining}
            />
          ))}

          <div style={{ fontSize: 16, fontWeight: 700, color: PALETTE.text, marginTop: 20, marginBottom: 6 }}>
            {tx("Learning Paths", "सीखने के पथ")}
          </div>
          <div style={{ fontSize: 13, color: PALETTE.dim, marginBottom: 12, lineHeight: 1.6 }}>
            {tx(
              "Use these paths when you want a curated progression rather than one-off course browsing.",
              "यदि आप अलग-अलग कोर्स की बजाय क्रमबद्ध सीखने का रास्ता चाहते हैं, तो इन पाथ का उपयोग करें।",
            )}
          </div>

          {TRAINING_LIBRARY_PATHS.map((path) => (
            <button
              key={path.id}
              type="button"
              onClick={() => openExternalTraining(path.href)}
              style={{
                width: "100%",
                textAlign: "left",
                border: "none",
                borderRadius: 16,
                padding: "18px 18px 16px",
                background: `linear-gradient(135deg, ${path.accent}, ${path.accent}CC)`,
                color: "#fff",
                marginBottom: 10,
                cursor: "pointer",
                boxShadow: "0 12px 24px rgba(26,26,26,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ fontSize: 26, lineHeight: 1 }}>{path.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{path.title}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.86)", marginTop: 5 }}>
                    {path.summary}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    {[path.courseCount, path.duration, path.certificates].map((meta) => (
                      <span
                        key={meta}
                        style={{
                          borderRadius: 999,
                          padding: "4px 8px",
                          background: "rgba(255,255,255,0.14)",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        {meta}
                      </span>
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: 18, opacity: 0.8 }}>↗</span>
              </div>
            </button>
          ))}

          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "18px 18px 16px",
              border: `1px solid ${PALETTE.border}`,
              marginTop: 10,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: PALETTE.text, marginBottom: 6 }}>
              {tx("Need support while learning?", "सीखते समय मदद चाहिए?")}
            </div>
            <div style={{ fontSize: 13, color: PALETTE.dim, lineHeight: 1.6, marginBottom: 12 }}>
              {tx(
                "Use the full Jan Nyaya Resource Centre for certificates and long-form tracks, or join as a PLV inside Jan Sahayak so your learning is connected to district fieldwork.",
                "सर्टिफिकेट और विस्तृत ट्रैक के लिए पूरा Jan Nyaya Resource Centre खोलें, या Jan Sahayak में PLV के रूप में जुड़ें ताकि सीखना जिला-स्तरीय फील्डवर्क से जुड़ सके।",
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => openExternalTraining(TRAINING_RESOURCE_CENTRE_URL)}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  border: "none",
                  background: PALETTE.blue,
                  color: "#fff",
                  padding: "12px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {tx("Open Resource Centre", "रिसोर्स सेंटर खोलें")}
              </button>
              <button
                type="button"
                onClick={() => setScreen("plvJoin")}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  border: `1px solid ${PALETTE.border}`,
                  background: "#fff",
                  color: PALETTE.text,
                  padding: "12px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {tx("Register as PLV", "PLV के रूप में पंजीकरण")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "plvJoin") {
    return (
      <div style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
        <ScreenHeader
          title={tx("Join as PLV Volunteer", "PLV स्वयंसेवक बनें")}
          lang={lang}
          onBack={() => setScreen("home")}
          onToggleLanguage={() => setLang(lang === "hi" ? "en" : "hi")}
        />
        <div style={{ ...sharedStyles.container, padding: "16px 16px 80px" }}>
          <div
            style={{
              background: PALETTE.accentSoft,
              borderRadius: 14,
              padding: "16px 18px",
              marginBottom: 16,
              border: `1px solid ${PALETTE.accent}33`,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15, color: PALETTE.accent, marginBottom: 6 }}>
              {tx("What is a PLV?", "PLV क्या है?")}
            </div>
            <div style={{ fontSize: 13, color: PALETTE.text, lineHeight: 1.7 }}>
              {tx(
                "A Para Legal Volunteer is a trained community member who helps people know their rights, file FIRs, access government schemes, and connect to lawyers when needed. Janman People's Foundation trains PLVs across Bihar.",
                "PLV एक प्रशिक्षित सामुदायिक स्वयंसेवक है जो लोगों को उनके अधिकार जानने, FIR दर्ज करने, सरकारी योजनाओं तक पहुँचने और वकीलों से जोड़ने में मदद करता है।",
              )}
            </div>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: PALETTE.text, marginBottom: 14 }}>
            {tx("PLV Registration Form", "PLV पंजीकरण फॉर्म")}
          </h3>

          <FieldInput
            label={tx("Full Name", "पूरा नाम")}
            value={plvForm.name}
            onChange={(value) => updatePlvForm({ name: value })}
            placeholder="Ramesh Kumar"
          />
          <FieldInput
            label={tx("Phone Number", "मोबाइल नंबर")}
            type="tel"
            value={plvForm.phone}
            onChange={(value) => updatePlvForm({ phone: value })}
            placeholder="9876543210"
          />
          <FieldInput
            label={tx("Village / Area", "गाँव / मोहल्ला")}
            value={plvForm.location}
            onChange={(value) => updatePlvForm({ location: value })}
          />
          <FieldSelect
            label={tx("District", "जिला")}
            value={plvForm.district}
            onChange={(value) => updatePlvForm({ district: value as PLVFormState["district"] })}
            options={districtOptions}
          />
          <FieldInput
            label={tx("Age", "उम्र")}
            type="number"
            value={plvForm.age}
            onChange={(value) => updatePlvForm({ age: value })}
            placeholder="24"
          />
          <FieldInput
            label={tx("Education", "शिक्षा")}
            value={plvForm.education}
            onChange={(value) => updatePlvForm({ education: value })}
            placeholder={tx("e.g. 10th pass, Graduate", "e.g. 10वीं, स्नातक")}
          />
          <FieldInput
            label={tx("Why do you want to become a PLV?", "आप PLV क्यों बनना चाहते हैं?")}
            value={plvForm.motivation}
            onChange={(value) => updatePlvForm({ motivation: value })}
            rows={3}
          />
          <FieldInput
            label={tx("Referred by (if any)", "रेफर किया (यदि कोई)")}
            value={plvForm.referredBy}
            onChange={(value) => updatePlvForm({ referredBy: value })}
            placeholder={tx("Name or referral code", "नाम या रेफरल कोड")}
          />
          <PrimaryButton onClick={submitPLV} disabled={!plvForm.name.trim() || !plvForm.phone.trim()}>
            {tx("Submit Application", "आवेदन जमा करें")}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  if (screen === "plvSuccess") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: PALETTE.bg,
          fontFamily: bodyFont,
          colorScheme: "light",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
          <h2
            style={{
              fontFamily: headingFont,
              fontSize: 22,
              fontWeight: 700,
              color: PALETTE.text,
              marginBottom: 8,
            }}
          >
            {tx("Application Received!", "आवेदन प्राप्त हुआ!")}
          </h2>
          <p style={{ fontSize: 14, color: PALETTE.dim, lineHeight: 1.7, marginBottom: 20 }}>
            {tx(
              "Thank you for applying to become a PLV with Janman People's Foundation. Our team in your district will contact you within 7 days.",
              "जनमन पीपुल्स फाउंडेशन के साथ PLV बनने के लिए आवेदन के लिए धन्यवाद। आपके जिले की टीम 7 दिनों के भीतर संपर्क करेगी।",
            )}
          </p>
          <div style={{ background: PALETTE.accentSoft, borderRadius: 14, padding: "16px", marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: PALETTE.dim, marginBottom: 4 }}>
              {tx("Your Referral Code:", "आपका रेफरल कोड:")}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: PALETTE.accent, letterSpacing: 2 }}>{referCode}</div>
            <div style={{ fontSize: 11, color: PALETTE.dim, marginTop: 4 }}>
              {tx("Share this code with others who want to join as PLV.", "दूसरों को PLV बनने के लिए यह कोड शेयर करें।")}
            </div>
          </div>
          <PrimaryButton onClick={() => setScreen("home")}>← {tx("Back to Home", "होम पर वापस")}</PrimaryButton>
        </div>
      </div>
    );
  }

  if (screen === "plvRefer") {
    return (
      <div style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
        <ScreenHeader
          title={tx("Refer Someone as PLV", "किसी को PLV के लिए रेफर करें")}
          lang={lang}
          onBack={() => setScreen("home")}
          onToggleLanguage={() => setLang(lang === "hi" ? "en" : "hi")}
        />
        <div style={{ ...sharedStyles.container, padding: "20px 20px 80px" }}>
          <div
            style={{
              background: PALETTE.accentSoft,
              borderRadius: 14,
              padding: "20px",
              marginBottom: 16,
              textAlign: "center",
              border: `1px solid ${PALETTE.accent}33`,
            }}
          >
            <div style={{ fontSize: 13, color: PALETTE.dim, marginBottom: 6 }}>
              {tx("Your Referral Code:", "आपका रेफरल कोड:")}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: PALETTE.accent, letterSpacing: 3, marginBottom: 8 }}>
              {referCode}
            </div>
            <button
              type="button"
              onClick={copyReferralCode}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "none",
                background: PALETTE.accent,
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {tx("Copy & Share", "कॉपी करें और शेयर करें")}
            </button>
            {copyMessage ? (
              <div style={{ marginTop: 8, fontSize: 12, color: PALETTE.dim }}>{copyMessage}</div>
            ) : null}
          </div>

          <div style={sharedStyles.card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: PALETTE.text, marginBottom: 12 }}>
              {tx("How to Refer:", "कैसे रेफर करें:")}
            </div>
            {[
              tx("Share your referral code with a friend or community member.", "अपना रेफरल कोड किसी दोस्त या समुदाय के सदस्य को शेयर करें।"),
              tx("Ask them to open Jan Sahayak and tap 'Join as PLV Volunteer'.", "उन्हें Jan Sahayak खोलकर 'PLV स्वयंसेवक बनें' पर क्लिक करने को कहें।"),
              tx("They can enter your code in the 'Referred by' field.", "वे 'रेफर किया' कॉलम में आपका कोड डालें।"),
              tx("Janman's team will contact them for training.", "जनमन की टीम उन्हें प्रशिक्षण के लिए संपर्क करेगी।"),
            ].map((entry, index) => (
              <div
                key={entry}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom: index < 3 ? `1px solid ${PALETTE.border}` : "none",
                }}
              >
                <span style={{ color: PALETTE.accent, fontWeight: 700, minWidth: 20 }}>{index + 1}.</span>
                <div style={{ fontSize: 13, color: PALETTE.text, lineHeight: 1.5 }}>{entry}</div>
              </div>
            ))}
          </div>

          <div style={sharedStyles.card}>
            <div style={{ fontSize: 13, fontWeight: 700, color: PALETTE.dim, marginBottom: 8 }}>
              {tx("Who makes a good PLV?", "अच्छा PLV कौन बनता है?")}
            </div>
            {[
              tx("A community-minded young person (18-35).", "समुदाय के प्रति जागरूक युवा (18-35 वर्ष)।"),
              tx("A woman from the community, especially a survivor leader.", "समुदाय की महिला, विशेषकर जो खुद अत्याचार से गुजरी हों।"),
              tx("Someone who can read and write at any education level.", "पढ़-लिख सकने वाला व्यक्ति, कोई भी शिक्षा स्तर हो।"),
              tx("Someone trusted by their community.", "जिस पर समुदाय भरोसा करे।"),
            ].map((entry) => (
              <div key={entry} style={{ fontSize: 13, color: PALETTE.text, padding: "4px 0", display: "flex", gap: 8 }}>
                <span style={{ color: PALETTE.green }}>✓</span>
                {entry}
              </div>
            ))}
          </div>

          <PrimaryButton color="green" onClick={() => setScreen("plvJoin")}>
            {tx("Register Yourself as PLV →", "खुद PLV के लिए पंजीकरण करें →")}
          </PrimaryButton>
          <SecondaryButton onClick={() => setScreen("home")}>{tx("Back", "वापस")}</SecondaryButton>
        </div>
      </div>
    );
  }

  return null;
}
