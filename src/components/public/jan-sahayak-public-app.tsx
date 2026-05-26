"use client";

import type { CSSProperties, ReactNode } from "react";
import { useDeferredValue, useEffect, useId, useState } from "react";

import { BIHAR_DISTRICTS } from "@/lib/domain/constants";
import {
  FLAGSHIP_PLV_TRACKS,
  QUICK_PLV_MODULES,
  TRAINING_ACADEMY_STATS,
  TRAINING_LIBRARY_COURSES,
  TRAINING_LIBRARY_PATHS,
  TRAINING_RESOURCE_CENTRE_URL,
  TRAINING_STUDY_PACKS,
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
  | "caseTracker"
  | "schemeAssist"
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

type SubmissionMode = "legal_help" | "scheme_check" | "scheme_complaint";
type SubmissionStatus = "pending" | "under_review" | "draft_ready" | "ready_to_file";
type SubmissionDocumentStatus = "needed" | "prepared" | "filed";

type SubmissionStage = {
  id: string;
  label: string;
  hi_label: string;
  note: string;
  hi_note: string;
  status: "done" | "current" | "upcoming";
  date: string;
};

type SubmissionDocument = {
  id: string;
  name: string;
  hi_name: string;
  status: SubmissionDocumentStatus;
  date: string;
  note: string;
  hi_note: string;
};

type IssueSubmission = {
  id: string;
  referenceCode: string;
  name: string;
  phone: string;
  location: string;
  district: (typeof BIHAR_DISTRICTS)[number];
  issue: string;
  type: TriageType;
  urgency: TriageUrgency;
  summary: string;
  date: string;
  status: SubmissionStatus;
  mode: SubmissionMode;
  authority?: string;
  subject?: string;
  stages: SubmissionStage[];
  filedDocuments: SubmissionDocument[];
};

type PLVSubmission = PLVFormState & {
  id: string;
  date: string;
  status: "applied";
};

type EligibilityRecommendation = {
  id: string;
  category: string;
  name: string;
  hi_name: string;
  status: "likely" | "check" | "not_now";
  reasons: string[];
  hi_reasons: string[];
  docs: string[];
  hi_docs: string[];
  apply: string;
  hi_apply: string;
  officialUrl: string;
};

type EligibilityResult = {
  summary: string;
  hi_summary: string;
  recommendations: EligibilityRecommendation[];
  workflow: string[];
  hi_workflow: string[];
};

type EligibilityFormState = {
  name: string;
  phone: string;
  district: (typeof BIHAR_DISTRICTS)[number];
  residence: "rural" | "urban";
  age: string;
  gender: "female" | "male" | "transgender" | "other";
  annualIncome: string;
  socialCategory: "general" | "obc" | "ebc" | "sc" | "st" | "minority";
  occupation: string;
  isStudent: boolean;
  isPregnant: boolean;
  isWidowed: boolean;
  hasDisability: boolean;
  disabilityPercent: string;
  housingStatus: "no_house" | "kutcha" | "semi_pucca" | "pucca" | "rented";
  hasRationCard: boolean;
  hasBankAccount: boolean;
  hasAadhaar: boolean;
  isLandless: boolean;
  needsMedicalSupport: boolean;
};

type ComplaintAssistFormState = {
  name: string;
  phone: string;
  district: (typeof BIHAR_DISTRICTS)[number];
  benefit: string;
  authority: string;
  grievanceType: string;
  incidentDate: string;
  location: string;
  facts: string;
  documentsAvailable: string;
  reliefWanted: string;
};

type ComplaintDraftResult = {
  subject: string;
  hi_subject: string;
  summary: string;
  hi_summary: string;
  facts: string[];
  hi_facts: string[];
  reliefs: string[];
  hi_reliefs: string[];
  documents_to_attach: string[];
  hi_documents_to_attach: string[];
  filing_office: string;
  hi_filing_office: string;
  next_steps: string[];
  hi_next_steps: string[];
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
  hint?: string;
};

type FieldSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  hint?: string;
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

const DEFAULT_ELIGIBILITY_FORM: EligibilityFormState = {
  name: "",
  phone: "",
  district: "Purnia",
  residence: "rural",
  age: "24",
  gender: "female",
  annualIncome: "120000",
  socialCategory: "ebc",
  occupation: "homemaker",
  isStudent: false,
  isPregnant: false,
  isWidowed: false,
  hasDisability: false,
  disabilityPercent: "0",
  housingStatus: "kutcha",
  hasRationCard: true,
  hasBankAccount: true,
  hasAadhaar: true,
  isLandless: false,
  needsMedicalSupport: false,
};

const DEFAULT_COMPLAINT_FORM: ComplaintAssistFormState = {
  name: "",
  phone: "",
  district: "Purnia",
  benefit: "Ration card / PDS grain",
  authority: "PDS dealer / supply office",
  grievanceType: "Application accepted but benefit denied",
  incidentDate: getTodayIsoDate(),
  location: "",
  facts: "",
  documentsAvailable: "",
  reliefWanted: "",
};

const sharedStyles: Record<string, CSSProperties> = {
  container: {
    maxWidth: 520,
    margin: "0 auto",
    padding: "0 0 80px",
  },
  header: {
    background: "linear-gradient(135deg, #b7422a 0%, #d46a48 100%)",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    position: "sticky",
    top: 0,
    zIndex: 40,
    boxShadow: "0 14px 28px rgba(140, 55, 35, 0.2)",
  },
  backButton: {
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.24)",
    color: "#fff",
    borderRadius: 12,
    padding: "8px 12px",
    fontSize: 14,
    cursor: "pointer",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: "#fff",
    flex: 1,
    letterSpacing: "0.01em",
  },
  languageButton: {
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.24)",
    color: "#fff",
    borderRadius: 999,
    padding: "7px 12px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  },
  card: {
    background: "linear-gradient(180deg, #ffffff 0%, #fffdfb 100%)",
    borderRadius: 18,
    padding: "16px 18px",
    border: `1px solid ${PALETTE.border}`,
    marginBottom: 10,
    boxShadow: "0 14px 30px rgba(26,26,26,0.05)",
  },
};

const bodyFont = "var(--font-public-body), var(--font-public-hindi), sans-serif";
const headingFont = "var(--font-public-hindi), var(--font-public-body), sans-serif";
const publicPanelShadow = "0 16px 34px rgba(26,26,26,0.06)";
const publicSurface = "linear-gradient(180deg, #ffffff 0%, #fffdf9 100%)";

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

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes / हाँ" },
  { value: "no", label: "No / नहीं" },
];

const ELIGIBILITY_RESIDENCE_OPTIONS = [
  { value: "rural", label: "Rural / ग्रामीण" },
  { value: "urban", label: "Urban / शहरी" },
];

const ELIGIBILITY_GENDER_OPTIONS = [
  { value: "female", label: "Female / महिला" },
  { value: "male", label: "Male / पुरुष" },
  { value: "transgender", label: "Transgender / ट्रांसजेंडर" },
  { value: "other", label: "Other / अन्य" },
];

const ELIGIBILITY_SOCIAL_CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "ebc", label: "EBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "minority", label: "Minority" },
];

const ELIGIBILITY_HOUSING_OPTIONS = [
  { value: "no_house", label: "No house / घर नहीं" },
  { value: "kutcha", label: "Kutcha house / कच्चा घर" },
  { value: "semi_pucca", label: "Semi-pucca / अर्ध-पक्का" },
  { value: "pucca", label: "Pucca house / पक्का घर" },
  { value: "rented", label: "Rented / किराये पर" },
];

const COMPLAINT_BENEFIT_OPTIONS = [
  "Ration card / PDS grain",
  "PM Awas / housing support",
  "Ayushman / hospital treatment",
  "Pension",
  "PMMVY / maternity benefit",
  "Disability certificate / pension",
  "MGNREGS wages / job card",
  "Scholarship / student support",
  "Other scheme or service",
];

const COMPLAINT_AUTHORITY_OPTIONS = [
  "PDS dealer / supply office",
  "Gram Panchayat / block office",
  "Hospital / Ayushman helpdesk",
  "Anganwadi / CDPO office",
  "District social welfare office",
  "School / education office",
  "Municipal office",
  "Other authority",
];

const COMPLAINT_TYPE_OPTIONS = [
  "Application accepted but benefit denied",
  "Application not accepted",
  "Payment stopped or delayed",
  "Name missing from list or card inactive",
  "Demand for bribe or illegal payment",
  "Urgent treatment or service denied",
  "Document mismatch or data error",
  "Other grievance",
];

function createId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function createReferralCode() {
  return `JNY-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function createReferenceCode() {
  return `JS-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
}

function getTodayIsoDate() {
  return new Intl.DateTimeFormat("en-CA").format(new Date());
}

function buildSubmissionStages(
  mode: SubmissionMode,
  status: SubmissionStatus,
  date: string,
): SubmissionStage[] {
  const currentIndex =
    mode === "scheme_complaint"
      ? status === "ready_to_file"
        ? 2
        : status === "draft_ready"
          ? 1
          : 0
      : mode === "scheme_check"
        ? status === "draft_ready"
          ? 2
          : status === "under_review"
            ? 1
            : 0
        : status === "ready_to_file"
          ? 3
          : status === "draft_ready"
            ? 2
            : status === "under_review"
              ? 1
              : 0;

  const baseStages =
    mode === "scheme_complaint"
      ? [
          {
            id: "recorded",
            label: "Complaint recorded",
            hi_label: "शिकायत दर्ज",
            note: "Your scheme grievance details have been structured.",
            hi_note: "आपकी योजना शिकायत के विवरण को व्यवस्थित किया गया है।",
          },
          {
            id: "drafted",
            label: "Draft prepared",
            hi_label: "ड्राफ्ट तैयार",
            note: "A structured complaint note is ready.",
            hi_note: "एक संरचित शिकायत ड्राफ्ट तैयार है।",
          },
          {
            id: "ready",
            label: "Ready to file",
            hi_label: "जमा करने के लिए तैयार",
            note: "Take this draft with documents to the filing office.",
            hi_note: "यह ड्राफ्ट दस्तावेज़ों के साथ संबंधित कार्यालय में ले जाएं।",
          },
          {
            id: "followup",
            label: "Reminder and escalation",
            hi_label: "अनुस्मारक और एस्केलेशन",
            note: "Keep receipts and escalate if there is no action.",
            hi_note: "रसीद रखें और कार्रवाई न होने पर आगे बढ़ें।",
          },
        ]
      : mode === "scheme_check"
        ? [
            {
              id: "profile",
              label: "Profile recorded",
              hi_label: "प्रोफाइल दर्ज",
              note: "Your household information has been captured.",
              hi_note: "आपके परिवार की जानकारी दर्ज की गई है।",
            },
            {
              id: "screened",
              label: "Eligibility screened",
              hi_label: "पात्रता जांची गई",
              note: "Likely schemes and grievance routes have been identified.",
              hi_note: "संभावित योजनाओं और शिकायत मार्गों की पहचान की गई है।",
            },
            {
              id: "documents",
              label: "Documents to collect",
              hi_label: "दस्तावेज़ जुटाने हैं",
              note: "Collect the required papers before applying.",
              hi_note: "आवेदन से पहले जरूरी कागज जुटाएं।",
            },
            {
              id: "apply",
              label: "Application or grievance follow-up",
              hi_label: "आवेदन या शिकायत फॉलो-अप",
              note: "File at the right office and keep the receipt.",
              hi_note: "सही कार्यालय में आवेदन/शिकायत दें और रसीद रखें।",
            },
          ]
        : [
            {
              id: "received",
              label: "Request received",
              hi_label: "अनुरोध प्राप्त",
              note: "Your help request has been safely logged.",
              hi_note: "आपका मदद अनुरोध सुरक्षित रूप से दर्ज हो गया है।",
            },
            {
              id: "assigned",
              label: "District follow-up assigned",
              hi_label: "जिला फॉलो-अप तय",
              note: "A fellow or team member should review the matter.",
              hi_note: "एक जिला साथी या टीम सदस्य मामले की समीक्षा करेगा।",
            },
            {
              id: "draft",
              label: "Advice or draft in progress",
              hi_label: "सलाह या ड्राफ्ट जारी",
              note: "Documents, facts, and next legal steps are being organised.",
              hi_note: "दस्तावेज़, तथ्य और अगले कानूनी कदम व्यवस्थित किए जा रहे हैं।",
            },
            {
              id: "filed",
              label: "Filed and follow-up",
              hi_label: "जमा और फॉलो-अप",
              note: "Track filing, hearing, or authority action here.",
              hi_note: "जमा, सुनवाई या प्राधिकारी कार्रवाई का ट्रैक यहाँ दिखेगा।",
            },
          ];

  return baseStages.map((stage, index) => ({
    ...stage,
    status: index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming",
    date,
  }));
}

function buildSuggestedDocuments(
  mode: SubmissionMode,
  type: TriageType,
  date: string,
  customDocuments?: string[],
): SubmissionDocument[] {
  const fromCustom = customDocuments?.map((item, index) => ({
    id: `${index}-${item}`,
    name: item,
    hi_name: item,
    status: mode === "scheme_complaint" ? ("prepared" as const) : ("needed" as const),
    date,
    note: mode === "scheme_complaint" ? "Ready to attach with the complaint." : "Keep this document ready.",
    hi_note: mode === "scheme_complaint" ? "शिकायत के साथ संलग्न करने के लिए तैयार।" : "यह दस्तावेज़ तैयार रखें।",
  }));

  if (fromCustom && fromCustom.length > 0) {
    return fromCustom;
  }

  const generic =
    mode === "scheme_check"
      ? [
          ["Identity proof", "पहचान प्रमाण"],
          ["Bank passbook", "बैंक पासबुक"],
          ["Income, caste, or scheme receipt papers", "आय, जाति, या योजना रसीद के कागज"],
        ]
      : type === "welfare"
        ? [
            ["Aadhaar or voter ID", "आधार या वोटर ID"],
            ["Scheme application receipt", "योजना आवेदन रसीद"],
            ["Bank passbook or benefit record", "बैंक पासबुक या लाभ रिकॉर्ड"],
          ]
        : [
            ["Identity proof", "पहचान प्रमाण"],
            ["Written facts and dates", "लिखित तथ्य और तिथियाँ"],
            ["Notices, FIR copy, or authority papers if available", "नोटिस, FIR प्रति, या उपलब्ध प्राधिकरण कागज"],
          ];

  return generic.map(([name, hi_name], index) => ({
    id: `${mode}-${index}`,
    name,
    hi_name,
    status: "needed",
    date,
    note: "Keep this ready for the next filing or review step.",
    hi_note: "अगले आवेदन या समीक्षा चरण के लिए इसे तैयार रखें।",
  }));
}

function normalizeIssueSubmission(
  submission: Partial<IssueSubmission> &
    Pick<IssueSubmission, "id" | "name" | "phone" | "district" | "issue" | "type" | "urgency" | "summary" | "date">,
): IssueSubmission {
  const inferredMode: SubmissionMode =
    submission.mode ??
    (submission.subject
      ? "scheme_complaint"
      : submission.type === "welfare"
        ? "scheme_check"
        : "legal_help");
  const normalizedStatus: SubmissionStatus = submission.status ?? "pending";
  const normalizedDate = submission.date || getTodayIsoDate();

  return {
    id: submission.id,
    referenceCode: submission.referenceCode ?? `JS-${submission.id.slice(-6).toUpperCase()}`,
    name: submission.name,
    phone: submission.phone,
    location: submission.location ?? "",
    district: submission.district,
    issue: submission.issue,
    type: submission.type,
    urgency: submission.urgency,
    summary: submission.summary,
    date: normalizedDate,
    status: normalizedStatus,
    mode: inferredMode,
    authority: submission.authority,
    subject: submission.subject,
    stages:
      Array.isArray(submission.stages) && submission.stages.length > 0
        ? submission.stages
        : buildSubmissionStages(inferredMode, normalizedStatus, normalizedDate),
    filedDocuments:
      Array.isArray(submission.filedDocuments) && submission.filedDocuments.length > 0
        ? submission.filedDocuments
        : buildSuggestedDocuments(inferredMode, submission.type, normalizedDate),
  };
}

function getSubmissionModeLabel(
  mode: SubmissionMode,
  isHindi: boolean,
) {
  if (mode === "scheme_complaint") {
    return isHindi ? "संरचित योजना शिकायत" : "Structured scheme complaint";
  }

  if (mode === "scheme_check") {
    return isHindi ? "योजना पात्रता जांच" : "Scheme eligibility check";
  }

  return isHindi ? "कानूनी सहायता अनुरोध" : "Legal help request";
}

function getSubmissionStatusLabel(status: SubmissionStatus, isHindi: boolean) {
  if (status === "ready_to_file") {
    return isHindi ? "जमा करने के लिए तैयार" : "Ready to file";
  }

  if (status === "draft_ready") {
    return isHindi ? "ड्राफ्ट तैयार" : "Draft ready";
  }

  if (status === "under_review") {
    return isHindi ? "समीक्षा जारी" : "Under review";
  }

  return isHindi ? "प्राप्त" : "Received";
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
        padding: "15px 16px",
        borderRadius: 14,
        border: "none",
        background: disabled ? "#ccc" : background,
        color: disabled ? "#888" : "#fff",
        fontSize: 15,
        fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
        marginTop: 10,
        boxShadow: disabled ? "none" : "0 14px 24px rgba(200,75,49,0.18)",
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
        padding: "12px 14px",
        borderRadius: 14,
        border: `2px solid ${PALETTE.border}`,
        background: "#fff",
        color: PALETTE.dim,
        fontSize: 14,
        fontWeight: 700,
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
  hint,
}: FieldInputProps) {
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div style={{ marginBottom: 14 }}>
      <label
        htmlFor={inputId}
        style={{
          fontSize: 12.5,
          color: PALETTE.dim,
          display: "block",
          marginBottom: 6,
          fontWeight: 700,
        }}
      >
        {label}
      </label>
      {rows ? (
        <textarea
          id={inputId}
          aria-describedby={hintId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          placeholder={placeholder}
          style={{
            width: "100%",
            border: `1.5px solid ${PALETTE.border}`,
            borderRadius: 14,
            padding: "13px 14px",
            fontSize: 15,
            color: PALETTE.text,
            lineHeight: 1.6,
            boxSizing: "border-box",
            resize: "vertical",
            background: "#fff",
            minHeight: rows > 3 ? 132 : 96,
          }}
        />
      ) : (
        <input
          id={inputId}
          aria-describedby={hintId}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          inputMode={type === "tel" ? "tel" : type === "number" ? "numeric" : undefined}
          style={{
            width: "100%",
            border: `1.5px solid ${PALETTE.border}`,
            borderRadius: 14,
            padding: "13px 14px",
            fontSize: 15,
            color: PALETTE.text,
            boxSizing: "border-box",
            background: "#fff",
            minHeight: 48,
          }}
        />
      )}
      {hint ? (
        <div id={hintId} style={{ marginTop: 6, fontSize: 11.5, color: PALETTE.muted, lineHeight: 1.55 }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}

function FieldSelect({ label, value, onChange, options, hint }: FieldSelectProps) {
  const selectId = useId();
  const hintId = hint ? `${selectId}-hint` : undefined;

  return (
    <div style={{ marginBottom: 14 }}>
      <label
        htmlFor={selectId}
        style={{
          fontSize: 12.5,
          color: PALETTE.dim,
          display: "block",
          marginBottom: 6,
          fontWeight: 700,
        }}
      >
        {label}
      </label>
      <select
        id={selectId}
        aria-describedby={hintId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          border: `1.5px solid ${PALETTE.border}`,
          borderRadius: 14,
          padding: "13px 14px",
          fontSize: 15,
          color: PALETTE.text,
          background: "#fff",
          minHeight: 48,
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? (
        <div id={hintId} style={{ marginTop: 6, fontSize: 11.5, color: PALETTE.muted, lineHeight: 1.55 }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}

function TrainingCourseCard({
  course,
  onPreview,
  onOpenSource,
}: {
  course: TrainingCourse;
  onPreview: (course: TrainingCourse) => void;
  onOpenSource: (url: string) => void;
}) {
  const studyPack = TRAINING_STUDY_PACKS[course.id];
  const statusLabel =
    course.status === "coming_soon"
      ? "Coming Soon"
      : course.badge ?? "Live";
  const primaryActionLabel = course.status === "coming_soon" ? "Preview Syllabus" : "Open Study Pack";
  const sourceActionLabel = course.ctaLabel ?? "Open Original Course →";

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
          minHeight: 84,
          background: `linear-gradient(135deg, ${course.accent}, ${course.accent}DD)`,
          padding: "14px 16px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 28, lineHeight: 1 }}>{course.icon}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <span
            style={{
              borderRadius: 999,
              padding: "4px 8px",
              background: "rgba(255,255,255,0.92)",
              color: course.accent,
              fontSize: 10,
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            {statusLabel}
          </span>
          {course.status === "live" && course.certificate ? (
            <span
              style={{
                borderRadius: 999,
                padding: "4px 8px",
                background: "rgba(255,255,255,0.16)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {course.certificate}
            </span>
          ) : null}
        </div>
      </div>
      <div style={{ padding: "15px 16px 16px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: PALETTE.text, lineHeight: 1.35 }}>{course.title}</div>
            <div style={{ fontSize: 12, color: PALETTE.dim, marginTop: 4 }}>{course.hi}</div>
            <div style={{ fontSize: 12.5, color: PALETTE.dim, lineHeight: 1.65, marginTop: 8 }}>{course.summary}</div>
          </div>
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
                {badge.english}
              </span>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          {[
            course.levelsLabel,
            course.durationLabel,
            course.status === "coming_soon" ? null : course.certificate,
          ]
            .filter(Boolean)
            .map((meta) => (
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

        {studyPack ? (
          <div
            style={{
              marginTop: 12,
              padding: "11px 12px",
              borderRadius: 12,
              background: "#FAF6F2",
              border: `1px solid ${PALETTE.border}`,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: PALETTE.text, marginBottom: 5 }}>
              Study pack includes
            </div>
            <div style={{ fontSize: 12, color: PALETTE.dim, lineHeight: 1.6 }}>
              {`${studyPack.officialResources.length} official sources · ${studyPack.caseBriefs.length} case briefs · ${studyPack.fieldTools.length} field tools · ${studyPack.practiceLab.length} practice drills`}
            </div>
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button
            type="button"
            onClick={() => onPreview(course)}
            style={{
              flex: 1,
              borderRadius: 10,
              border: "none",
              background: course.accent,
              color: "#fff",
              padding: "11px 12px",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {primaryActionLabel}
          </button>
          {course.href ? (
            <button
              type="button"
              onClick={() => onOpenSource(course.href!)}
              style={{
                flex: 1,
                borderRadius: 10,
                border: `1px solid ${PALETTE.border}`,
                background: "#fff",
                color: PALETTE.text,
                padding: "11px 12px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {sourceActionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function JanSahayakPublicApp() {
  const [lang, setLang] = useState<Language>("hi");
  const [screen, setScreen] = useState<Screen>("home");
  const [form, setForm] = useState<HelpFormState>(DEFAULT_HELP_FORM);
  const [plvForm, setPlvForm] = useState<PLVFormState>(DEFAULT_PLV_FORM);
  const [eligibilityForm, setEligibilityForm] = useState<EligibilityFormState>(DEFAULT_ELIGIBILITY_FORM);
  const [complaintForm, setComplaintForm] = useState<ComplaintAssistFormState>(DEFAULT_COMPLAINT_FORM);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [complaintDraft, setComplaintDraft] = useState<ComplaintDraftResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [eligibilityError, setEligibilityError] = useState("");
  const [complaintError, setComplaintError] = useState("");
  const [step, setStep] = useState(1);
  const [activeSchemeTab, setActiveSchemeTab] = useState<"central" | "bihar">("central");
  const [schemeSearch, setSchemeSearch] = useState("");
  const [activeLaw, setActiveLaw] = useState<LegalAct | null>(null);
  const [lawSearch, setLawSearch] = useState("");
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [activeTrainingCourse, setActiveTrainingCourse] = useState<TrainingCourse | null>(null);
  const [schemeAssistTab, setSchemeAssistTab] = useState<"eligibility" | "complaint">("eligibility");
  const [trainingAudience, setTrainingAudience] = useState<TrainingAudience>("pl");
  const [trainingSearch, setTrainingSearch] = useState("");
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [referCode, setReferCode] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [trackerPhone, setTrackerPhone] = useState("");
  const [trackerReference, setTrackerReference] = useState("");
  const [latestReferenceCode, setLatestReferenceCode] = useState("");
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
    const storedSubmissions = readLocalStorage<IssueSubmission[]>(STORAGE_KEYS.submissions, []).map((entry) =>
      normalizeIssueSubmission(entry),
    );
    setSubmissions(storedSubmissions);
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
  const plvFlagshipTrack = FLAGSHIP_PLV_TRACKS[0];
  const childRightsProgrammeCourse = TRAINING_LIBRARY_COURSES.find((course) => course.id === "child-rights-hub") ?? null;
  const activeTrainingStudyPack = activeTrainingCourse ? TRAINING_STUDY_PACKS[activeTrainingCourse.id] : null;

  const trainingAudienceCounts: Record<TrainingAudience, number> = {
    all: TRAINING_LIBRARY_COURSES.length,
    sw: TRAINING_LIBRARY_COURSES.filter((course) => course.audiences.includes("sw")).length,
    pl: TRAINING_LIBRARY_COURSES.filter((course) => course.audiences.includes("pl")).length,
    ls: TRAINING_LIBRARY_COURSES.filter((course) => course.audiences.includes("ls")).length,
    lw: TRAINING_LIBRARY_COURSES.filter((course) => course.audiences.includes("lw")).length,
  };
  const trackerPhoneQuery = trackerPhone.trim();
  const trackerReferenceQuery = trackerReference.trim().toLowerCase();
  const hasTrackerQuery = trackerPhoneQuery.length > 0 || trackerReferenceQuery.length > 0;
  const trackerMatches = submissions
    .filter((entry) => {
      const phoneMatches = trackerPhoneQuery ? entry.phone.includes(trackerPhoneQuery) : true;
      const referenceMatches = trackerReferenceQuery
        ? entry.referenceCode.toLowerCase() === trackerReferenceQuery
        : true;
      return phoneMatches && referenceMatches;
    })
    .slice()
    .reverse();
  const recentTrackerItems = submissions.slice().reverse().slice(0, 3);

  function updateForm(patch: Partial<HelpFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function updatePlvForm(patch: Partial<PLVFormState>) {
    setPlvForm((current) => ({ ...current, ...patch }));
  }

  function updateEligibilityForm(patch: Partial<EligibilityFormState>) {
    setEligibilityForm((current) => ({ ...current, ...patch }));
  }

  function updateComplaintForm(patch: Partial<ComplaintAssistFormState>) {
    setComplaintForm((current) => ({ ...current, ...patch }));
  }

  function persistSubmissions(nextSubmissions: IssueSubmission[]) {
    setSubmissions(nextSubmissions);
    writeLocalStorage(STORAGE_KEYS.submissions, nextSubmissions);
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

  function openTrainingCourse(course: TrainingCourse) {
    setActiveTrainingCourse(course);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
      const referenceCode = createReferenceCode();
      const today = getTodayIsoDate();

      const nextSubmissions = submissions.concat(
        normalizeIssueSubmission({
          id: createId(),
          referenceCode,
          name: form.name,
          phone: form.phone,
          location: form.location,
          district: form.district,
          issue: form.issue,
          type: nextTriage.type,
          urgency: nextTriage.urgency,
          summary: nextTriage.summary,
          date: today,
          status: "under_review",
          mode: "legal_help",
          stages: buildSubmissionStages("legal_help", "under_review", today),
          filedDocuments: buildSuggestedDocuments("legal_help", nextTriage.type, today),
        }),
      );

      setLatestReferenceCode(referenceCode);
      setTrackerPhone(form.phone);
      setTrackerReference(referenceCode);
      setTriage(nextTriage);
      persistSubmissions(nextSubmissions);
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

  async function submitEligibilityCheck() {
    setEligibilityLoading(true);
    setEligibilityError("");

    try {
      const response = await fetch("/api/public/eligibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...eligibilityForm,
          age: Number(eligibilityForm.age || 0),
          annualIncome: Number(eligibilityForm.annualIncome || 0),
          disabilityPercent: Number(eligibilityForm.disabilityPercent || 0),
        }),
      });

      const payload = (await response.json()) as EligibilityResult & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to check eligibility.");
      }

      const result: EligibilityResult = {
        summary: payload.summary,
        hi_summary: payload.hi_summary,
        recommendations: payload.recommendations,
        workflow: payload.workflow,
        hi_workflow: payload.hi_workflow,
      };
      const referenceCode = createReferenceCode();
      const today = getTodayIsoDate();
      const topRecommendations = result.recommendations
        .filter((entry) => entry.status !== "not_now")
        .slice(0, 3)
        .flatMap((entry) => entry.docs.slice(0, 2));
      const eligibilitySummary = result.recommendations
        .filter((entry) => entry.status === "likely")
        .slice(0, 2)
        .map((entry) => entry.name)
        .join(", ");

      setEligibilityResult(result);
      setLatestReferenceCode(referenceCode);
      setTrackerPhone(eligibilityForm.phone);
      setTrackerReference(referenceCode);
      persistSubmissions(
        submissions.concat(
          normalizeIssueSubmission({
            id: createId(),
            referenceCode,
            name: eligibilityForm.name || "Scheme Screening",
            phone: eligibilityForm.phone,
            location: eligibilityForm.residence,
            district: eligibilityForm.district,
            issue: eligibilitySummary || "Assisted scheme eligibility screening",
            type: "welfare",
            urgency: "normal",
            summary: result.summary,
            date: today,
            status: "draft_ready",
            mode: "scheme_check",
            stages: buildSubmissionStages("scheme_check", "draft_ready", today),
            filedDocuments: buildSuggestedDocuments("scheme_check", "welfare", today, topRecommendations),
          }),
        ),
      );
    } catch {
      setEligibilityError(
        tx(
          "We could not run the eligibility check right now. Please try again in a moment.",
          "हम अभी पात्रता जांच नहीं चला सके। कृपया थोड़ी देर में फिर प्रयास करें।",
        ),
      );
    } finally {
      setEligibilityLoading(false);
    }
  }

  async function submitComplaintDraft() {
    setComplaintLoading(true);
    setComplaintError("");

    try {
      const response = await fetch("/api/public/complaint-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintForm),
      });

      const payload = (await response.json()) as ComplaintDraftResult & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to draft complaint.");
      }

      const result: ComplaintDraftResult = {
        subject: payload.subject,
        hi_subject: payload.hi_subject,
        summary: payload.summary,
        hi_summary: payload.hi_summary,
        facts: payload.facts,
        hi_facts: payload.hi_facts,
        reliefs: payload.reliefs,
        hi_reliefs: payload.hi_reliefs,
        documents_to_attach: payload.documents_to_attach,
        hi_documents_to_attach: payload.hi_documents_to_attach,
        filing_office: payload.filing_office,
        hi_filing_office: payload.hi_filing_office,
        next_steps: payload.next_steps,
        hi_next_steps: payload.hi_next_steps,
      };
      const referenceCode = createReferenceCode();
      const today = getTodayIsoDate();

      setComplaintDraft(result);
      setLatestReferenceCode(referenceCode);
      setTrackerPhone(complaintForm.phone);
      setTrackerReference(referenceCode);
      persistSubmissions(
        submissions.concat(
          normalizeIssueSubmission({
            id: createId(),
            referenceCode,
            name: complaintForm.name,
            phone: complaintForm.phone,
            location: complaintForm.location,
            district: complaintForm.district,
            issue: complaintForm.facts,
            type: "welfare",
            urgency: "normal",
            summary: result.summary,
            date: today,
            status: "ready_to_file",
            mode: "scheme_complaint",
            authority: result.filing_office,
            subject: result.subject,
            stages: buildSubmissionStages("scheme_complaint", "ready_to_file", today),
            filedDocuments: buildSuggestedDocuments(
              "scheme_complaint",
              "welfare",
              today,
              result.documents_to_attach,
            ),
          }),
        ),
      );
    } catch {
      setComplaintError(
        tx(
          "We could not prepare the complaint draft right now. Please try again in a moment.",
          "हम अभी शिकायत ड्राफ्ट तैयार नहीं कर सके। कृपया थोड़ी देर में फिर प्रयास करें।",
        ),
      );
    } finally {
      setComplaintLoading(false);
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
        icon: "🧭",
        label: tx("Track My Case", "मेरा केस ट्रैक करें"),
        sub: tx(
          "See stage updates, reference code, and documents to carry or file",
          "स्टेज अपडेट, रेफरेंस कोड और जरूरी दस्तावेज़ देखें",
        ),
        action: () => setScreen("caseTracker"),
      },
      {
        icon: "🤖",
        label: tx("AI Scheme & Complaint Help", "AI योजना और शिकायत सहायता"),
        sub: tx(
          "Guided eligibility check plus structured complaint drafting",
          "पात्रता जांच और संरचित शिकायत ड्राफ्टिंग",
        ),
        action: () => setScreen("schemeAssist"),
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

    const primaryAction = homeActions[0];
    const supportActions = homeActions.slice(1, 5);
    const communityActions = homeActions.slice(5);
    const emergencyActions = [
      { label: tx("Police", "पुलिस"), number: "112", tone: "#fff" },
      { label: tx("Women", "महिला"), number: "181", tone: "#FFF2EA" },
      { label: tx("Children", "बच्चे"), number: "1098", tone: "#F3F8FF" },
      { label: tx("Ambulance", "एम्बुलेंस"), number: "108", tone: "#F5FFF7" },
    ];

    return (
      <div
        className="public-app-root"
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, rgba(255,237,226,0.9) 0%, rgba(255,248,240,0.92) 26%, #fff7ef 58%, #fffaf6 100%)",
          fontFamily: bodyFont,
        }}
      >
        <div style={{ maxWidth: 540, margin: "0 auto", padding: "20px 18px 72px" }}>
          <div
            style={{
              background: "linear-gradient(145deg, #9f341d 0%, #c44b31 48%, #e48158 100%)",
              borderRadius: 30,
              padding: "22px 18px 18px",
              boxShadow: "0 24px 48px rgba(163, 68, 43, 0.2)",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.14)",
                    color: "#fff7ef",
                    padding: "6px 11px",
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.03em",
                    marginBottom: 12,
                  }}
                >
                  <span>⚖</span>
                  <span>{tx("Public legal and welfare access", "सार्वजनिक कानूनी और योजना सहायता")}</span>
                </div>
                <h1
                  style={{
                    fontFamily: headingFont,
                    fontSize: 31,
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1.12,
                    marginBottom: 6,
                  }}
                >
                  {tx("Jan Sahayak", "जन सहायक")}
                </h1>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, maxWidth: 320 }}>
                  {tx(
                    "Simple, guided legal help and scheme support for people in Bihar.",
                    "बिहार के लोगों के लिए सरल, मार्गदर्शित कानूनी मदद और योजना सहायता।",
                  )}
                </p>
              </div>

              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                ✦
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 16,
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              {(["hi", "en"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLang(value)}
                  style={{
                    borderRadius: 999,
                    border: lang === value ? "none" : "1px solid rgba(255,255,255,0.26)",
                    background: lang === value ? "#fff" : "rgba(255,255,255,0.08)",
                    color: lang === value ? PALETTE.accent : "#fff",
                    padding: "10px 15px",
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {value === "hi" ? "हिंदी" : "English"}
                </button>
              ))}
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.96)",
                borderRadius: 24,
                padding: "16px 16px 14px",
                color: PALETTE.text,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: PALETTE.accent, marginBottom: 6 }}>
                {tx("Why people can use this easily", "यह उपयोग में आसान क्यों है")}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.72, color: PALETTE.dim, marginBottom: 12 }}>
                {tx(
                  "Large buttons, guided forms, bilingual support, and visible emergency numbers reduce confusion in stressful moments.",
                  "बड़े बटन, मार्गदर्शित फॉर्म, द्विभाषी सहायता और दिखने वाले आपातकालीन नंबर तनाव के समय भ्रम कम करते हैं।",
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  tx("38 districts", "38 जिले"),
                  tx("Track requests", "अनुरोध ट्रैक करें"),
                  tx("Scheme guidance", "योजना मार्गदर्शन"),
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      borderRadius: 999,
                      padding: "7px 10px",
                      background: PALETTE.accentSoft,
                      color: PALETTE.accent,
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={primaryAction.action}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "18px 18px 16px",
              borderRadius: 22,
              border: "none",
              background: publicSurface,
              color: PALETTE.text,
              marginBottom: 14,
              boxShadow: publicPanelShadow,
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: PALETTE.accentSoft,
                color: PALETTE.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                flexShrink: 0,
              }}
            >
              {primaryAction.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: PALETTE.accent, marginBottom: 6 }}>
                {tx("Primary action", "मुख्य कार्य")}
              </div>
              <div style={{ fontFamily: headingFont, fontSize: 21, fontWeight: 800, marginBottom: 5 }}>
                {primaryAction.label}
              </div>
              <div style={{ fontSize: 13, color: PALETTE.dim, lineHeight: 1.65 }}>{primaryAction.sub}</div>
            </div>
            <span style={{ fontSize: 22, color: PALETTE.accent, marginTop: 6 }}>→</span>
          </button>

          <div style={{ ...sharedStyles.card, borderRadius: 20, marginBottom: 14 }}>
            <div style={{ fontFamily: headingFont, fontSize: 19, fontWeight: 800, color: PALETTE.text, marginBottom: 8 }}>
              {tx("How Jan Sahayak works", "जन सहायक कैसे काम करता है")}
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                {
                  step: "1",
                  title: tx("Share your situation", "अपनी स्थिति बताएं"),
                  copy: tx("Choose legal help, case tracking, or scheme assistance.", "कानूनी मदद, केस ट्रैकिंग, या योजना सहायता चुनें।"),
                },
                {
                  step: "2",
                  title: tx("Get guided next steps", "अगले कदम तुरंत पाएँ"),
                  copy: tx("The app organises information, likely routes, and needed documents.", "ऐप जानकारी, संभावित रास्ते और जरूरी दस्तावेज़ व्यवस्थित करता है।"),
                },
                {
                  step: "3",
                  title: tx("Stay informed", "अपडेट देखते रहें"),
                  copy: tx("Use your mobile number and reference code to track what happens next.", "मोबाइल नंबर और रेफरेंस कोड से आगे की प्रगति देखें।"),
                },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: item.step === "3" ? "none" : `1px solid ${PALETTE.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      background: PALETTE.accentSoft,
                      color: PALETTE.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: PALETTE.text, marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 12.5, color: PALETTE.dim, lineHeight: 1.6 }}>{item.copy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontFamily: headingFont, fontSize: 19, fontWeight: 800, color: PALETTE.text, marginBottom: 6 }}>
              {tx("Core services", "मुख्य सेवाएँ")}
            </div>
            <div style={{ fontSize: 13, color: PALETTE.dim, lineHeight: 1.6, marginBottom: 10 }}>
              {tx(
                "Each service is separated clearly so users do not need to guess where to begin.",
                "हर सेवा अलग और स्पष्ट है, ताकि लोगों को यह न सोचना पड़े कि कहाँ से शुरू करें।",
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {supportActions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  style={{
                    textAlign: "left",
                    minHeight: 144,
                    padding: "16px 14px",
                    borderRadius: 20,
                    border: `1px solid ${PALETTE.border}`,
                    background: publicSurface,
                    boxShadow: publicPanelShadow,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: PALETTE.accentSoft,
                      color: PALETTE.accent,
                      fontSize: 20,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: PALETTE.text, lineHeight: 1.4 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: PALETTE.dim, lineHeight: 1.55 }}>{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...sharedStyles.card, borderRadius: 20, marginBottom: 14 }}>
            <div style={{ fontFamily: headingFont, fontSize: 19, fontWeight: 800, color: PALETTE.text, marginBottom: 6 }}>
              {tx("Learning and community support", "सीखना और सामुदायिक सहयोग")}
            </div>
            <div style={{ fontSize: 13, color: PALETTE.dim, lineHeight: 1.6, marginBottom: 12 }}>
              {tx(
                "Training, volunteer sign-up, and referrals are grouped separately so the help journey stays simple for people in distress.",
                "प्रशिक्षण, स्वयंसेवक पंजीकरण और रेफरल को अलग रखा गया है ताकि मदद लेने वाले लोगों का अनुभव सरल रहे।",
              )}
            </div>
            {communityActions.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "14px 14px 13px",
                  borderRadius: 16,
                  border: `1px solid ${PALETTE.border}`,
                  background: "#fff",
                  marginBottom: 10,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "#F8F3EF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: PALETTE.accent,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: PALETTE.text }}>{item.label}</div>
                  <div style={{ fontSize: 12.5, color: PALETTE.dim, lineHeight: 1.55, marginTop: 3 }}>{item.sub}</div>
                </div>
                <span style={{ fontSize: 18, color: PALETTE.accent }}>→</span>
              </button>
            ))}
          </div>

          <div
            style={{
              ...sharedStyles.card,
              borderRadius: 20,
              marginBottom: 0,
              background: "linear-gradient(180deg, #fff 0%, #fff7f1 100%)",
            }}
          >
            <div style={{ fontFamily: headingFont, fontSize: 18, fontWeight: 800, color: PALETTE.text, marginBottom: 6 }}>
              {tx("Emergency help", "आपातकालीन सहायता")}
            </div>
            <div style={{ fontSize: 13, color: PALETTE.dim, lineHeight: 1.6, marginBottom: 12 }}>
              {tx(
                "If someone is in immediate danger, call the emergency helpline first and then come back to Jan Sahayak for follow-up support.",
                "अगर कोई तुरंत खतरे में है, तो पहले आपातकालीन नंबर पर कॉल करें और फिर Jan Sahayak पर फॉलो-अप सहायता लें।",
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {emergencyActions.map((item) => (
                <a
                  key={item.number}
                  href={`tel:${item.number}`}
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${PALETTE.border}`,
                    background: item.tone,
                    padding: "13px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: PALETTE.text }}>{item.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: PALETTE.accent }}>{item.number}</span>
                </a>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: PALETTE.muted }}>
              {tx("National legal aid helpline: 15100", "राष्ट्रीय विधिक सहायता हेल्पलाइन: 15100")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "intake") {
    return (
      <div className="public-app-root" style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
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

              {latestReferenceCode ? (
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
                    {tx("TRACKING REFERENCE:", "ट्रैकिंग रेफरेंस:")}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: PALETTE.accent, letterSpacing: 1 }}>
                    {latestReferenceCode}
                  </div>
                  <div style={{ fontSize: 12, color: PALETTE.dim, marginTop: 6, lineHeight: 1.6 }}>
                    {tx(
                      "Use this reference code with your mobile number in Track My Case.",
                      "इस रेफरेंस कोड को अपने मोबाइल नंबर के साथ 'मेरा केस ट्रैक करें' में उपयोग करें।",
                    )}
                  </div>
                </div>
              ) : null}

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setScreen("caseTracker")}
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    border: "none",
                    background: PALETTE.green,
                    color: "#fff",
                    padding: "14px 12px",
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {tx("Track My Case", "मेरा केस ट्रैक करें")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScreen("home");
                    resetHelpFlow();
                  }}
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    border: `1px solid ${PALETTE.border}`,
                    background: "#fff",
                    color: PALETTE.text,
                    padding: "14px 12px",
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  ← {tx("Back to Home", "होम पर वापस")}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (screen === "caseTracker") {
    const visibleTrackerItems = hasTrackerQuery ? trackerMatches : recentTrackerItems;

    return (
      <div className="public-app-root" style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
        <ScreenHeader
          title={tx("Track My Case", "मेरा केस ट्रैक करें")}
          lang={lang}
          onBack={() => setScreen("home")}
          onToggleLanguage={() => setLang(lang === "hi" ? "en" : "hi")}
        />
        <div style={{ ...sharedStyles.container, padding: "16px 16px 80px" }}>
          <div
            style={{
              background: "linear-gradient(180deg, #fff 0%, #fffaf5 100%)",
              borderRadius: 22,
              border: `1px solid ${PALETTE.border}`,
              padding: "18px 18px 16px",
              marginBottom: 14,
              boxShadow: publicPanelShadow,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                background: PALETTE.accentSoft,
                color: PALETTE.accent,
                padding: "6px 12px",
                fontSize: 11,
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              <span>🧭</span>
              <span>{tx("Public case tracker", "पब्लिक केस ट्रैकर")}</span>
            </div>
            <div style={{ fontFamily: headingFont, fontSize: 22, fontWeight: 700, color: PALETTE.text, marginBottom: 6 }}>
              {tx("See stage updates and filed papers", "स्टेज अपडेट और जमा कागज देखें")}
            </div>
            <div style={{ fontSize: 13, color: PALETTE.dim, lineHeight: 1.7, marginBottom: 14 }}>
              {tx(
                "Use your mobile number and reference code to check whether your request is under review, ready to file, or waiting for follow-up.",
                "अपने मोबाइल नंबर और रेफरेंस कोड से देखें कि आपका मामला समीक्षा में है, जमा करने के लिए तैयार है, या फॉलो-अप पर है।",
              )}
            </div>
            <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
              {[
                tx("Use the same mobile number used during submission.", "वही मोबाइल नंबर उपयोग करें जो आवेदन के समय दिया था।"),
                tx("Reference code helps open the exact request faster.", "रेफरेंस कोड से सही अनुरोध जल्दी खुलता है।"),
                tx("Document status shows what is still needed, prepared, or already filed.", "दस्तावेज़ स्थिति से पता चलता है कि क्या बाकी है, क्या तैयार है और क्या जमा हो चुका है।"),
              ].map((point) => (
                <div
                  key={point}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    fontSize: 12.5,
                    color: PALETTE.dim,
                    lineHeight: 1.55,
                  }}
                >
                  <span style={{ color: PALETTE.accent, fontWeight: 800 }}>•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
            <FieldInput
              label={tx("Mobile number", "मोबाइल नंबर")}
              type="tel"
              value={trackerPhone}
              onChange={setTrackerPhone}
              placeholder="9876543210"
              hint={tx("This helps show all requests made from the same contact number.", "यह उसी नंबर से किए गए सभी अनुरोध दिखाने में मदद करता है।")}
            />
            <FieldInput
              label={tx("Reference code (optional)", "रेफरेंस कोड (वैकल्पिक)")}
              value={trackerReference}
              onChange={setTrackerReference}
              placeholder="JS-ABC123"
              hint={tx("Use the code shown on your success screen for the fastest match.", "सबसे तेज़ मिलान के लिए सफलता स्क्रीन पर दिखा कोड दर्ज करें।")}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  if (latestReferenceCode) {
                    setTrackerReference(latestReferenceCode);
                  }
                }}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  border: `1px solid ${PALETTE.border}`,
                  background: "#fff",
                  color: PALETTE.text,
                  padding: "12px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: latestReferenceCode ? "pointer" : "not-allowed",
                  opacity: latestReferenceCode ? 1 : 0.6,
                }}
              >
                {tx("Use latest reference", "नया रेफरेंस उपयोग करें")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrackerPhone("");
                  setTrackerReference("");
                }}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  border: `1px solid ${PALETTE.border}`,
                  background: "#F8F3EF",
                  color: PALETTE.dim,
                  padding: "12px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {tx("Clear", "साफ़ करें")}
              </button>
            </div>
          </div>

          {!hasTrackerQuery && recentTrackerItems.length > 0 ? (
            <div style={{ fontSize: 13, color: PALETTE.dim, marginBottom: 10 }}>
              {tx("Recent requests on this device", "इस डिवाइस पर हाल के अनुरोध")}
            </div>
          ) : null}

          {hasTrackerQuery && trackerMatches.length === 0 ? (
            <div style={{ ...sharedStyles.card, color: PALETTE.dim, lineHeight: 1.7, borderRadius: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: PALETTE.text, marginBottom: 6 }}>
                {tx("We could not find a matching request", "मिलता हुआ अनुरोध नहीं मिला")}
              </div>
              <div style={{ marginBottom: 10 }}>
                {tx(
                  "No matching case was found for this phone and reference combination. Double-check the number, or open your most recent request from this device.",
                  "इस मोबाइल और रेफरेंस संयोजन के लिए कोई मामला नहीं मिला। नंबर दोबारा जांचें या इस डिवाइस पर हाल का अनुरोध खोलें।",
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setScreen("intake");
                  setStep(1);
                }}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  border: "none",
                  background: PALETTE.accent,
                  color: "#fff",
                  padding: "12px",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {tx("Open help form", "मदद फॉर्म खोलें")}
              </button>
            </div>
          ) : null}

          {visibleTrackerItems.map((entry) => (
            <div
              key={entry.id}
              style={{
                background: publicSurface,
                borderRadius: 22,
                border: `1px solid ${PALETTE.border}`,
                padding: "16px 16px 14px",
                marginBottom: 12,
                boxShadow: publicPanelShadow,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: PALETTE.text, lineHeight: 1.35 }}>
                    {entry.subject ?? entry.summary}
                  </div>
                  <div style={{ fontSize: 12, color: PALETTE.dim, marginTop: 4 }}>
                    {entry.referenceCode} · {entry.date} · {entry.district}
                  </div>
                </div>
                <div
                  style={{
                    alignSelf: "flex-start",
                    borderRadius: 999,
                    padding: "5px 10px",
                    background: entry.status === "ready_to_file" ? "rgba(46,125,50,0.1)" : PALETTE.accentSoft,
                    color: entry.status === "ready_to_file" ? PALETTE.green : PALETTE.accent,
                    fontSize: 11,
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                  }}
                >
                  {getSubmissionStatusLabel(entry.status, isHindi)}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <span
                  style={{
                    borderRadius: 999,
                    padding: "5px 10px",
                    background: "#F8F3EF",
                    color: PALETTE.dim,
                    fontSize: 10.5,
                    fontWeight: 800,
                  }}
                >
                  {getSubmissionModeLabel(entry.mode, isHindi)}
                </span>
                <span
                  style={{
                    borderRadius: 999,
                    padding: "5px 10px",
                    background: entry.urgency === "high" ? "rgba(230,81,0,0.1)" : "rgba(21,101,192,0.1)",
                    color: entry.urgency === "high" ? PALETTE.orange : PALETTE.blue,
                    fontSize: 10.5,
                    fontWeight: 800,
                  }}
                >
                  {entry.urgency === "high" ? tx("Urgent", "तत्काल") : tx("Normal priority", "सामान्य प्राथमिकता")}
                </span>
                {entry.authority ? (
                  <span
                    style={{
                      borderRadius: 999,
                      padding: "5px 10px",
                      background: "rgba(106,27,154,0.08)",
                      color: PALETTE.purple,
                      fontSize: 10.5,
                      fontWeight: 800,
                    }}
                  >
                    {entry.authority}
                  </span>
                ) : null}
              </div>

              <div style={{ fontSize: 12, color: PALETTE.dim, lineHeight: 1.65, marginBottom: 12 }}>
                {entry.issue}
              </div>

              <div style={{ fontSize: 12, fontWeight: 800, color: PALETTE.text, marginBottom: 8 }}>
                {tx("Stage timeline", "स्टेज टाइमलाइन")}
              </div>
              <div
                style={{
                  borderRadius: 16,
                  border: `1px solid ${PALETTE.border}`,
                  padding: "12px 12px 4px",
                  background: "#fff",
                  marginBottom: 12,
                }}
              >
                {entry.stages.map((stage) => (
                <div key={`${entry.id}-${stage.id}`} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 999,
                      marginTop: 3,
                      background:
                        stage.status === "done"
                          ? PALETTE.green
                          : stage.status === "current"
                            ? PALETTE.accent
                            : PALETTE.border,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: PALETTE.text }}>
                      {isHindi ? stage.hi_label : stage.label}
                    </div>
                    <div style={{ fontSize: 12, color: PALETTE.dim, lineHeight: 1.55 }}>
                      {isHindi ? stage.hi_note : stage.note}
                    </div>
                  </div>
                </div>
                ))}
              </div>

              <div style={{ fontSize: 12, fontWeight: 800, color: PALETTE.text, marginTop: 2, marginBottom: 8 }}>
                {tx("Relevant documents", "संबंधित दस्तावेज़")}
              </div>
              <div
                style={{
                  borderRadius: 16,
                  border: `1px solid ${PALETTE.border}`,
                  padding: "12px",
                  background: "#fff",
                }}
              >
                {entry.filedDocuments.map((document) => (
                <div
                  key={document.id}
                  style={{
                    borderRadius: 12,
                    border: `1px solid ${PALETTE.border}`,
                    padding: "10px 12px",
                    marginBottom: 8,
                    background: "#FCFAF8",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: PALETTE.text }}>
                      {isHindi ? document.hi_name : document.name}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color:
                          document.status === "filed"
                            ? PALETTE.green
                            : document.status === "prepared"
                              ? PALETTE.blue
                              : PALETTE.orange,
                      }}
                    >
                      {document.status === "filed"
                        ? tx("Filed", "जमा")
                        : document.status === "prepared"
                          ? tx("Prepared", "तैयार")
                          : tx("Needed", "जरूरी")}
                    </div>
                  </div>
                  <div style={{ fontSize: 11.5, color: PALETTE.dim, lineHeight: 1.55, marginTop: 4 }}>
                    {isHindi ? document.hi_note : document.note}
                  </div>
                </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "schemeAssist") {
    return (
      <div className="public-app-root" style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
        <ScreenHeader
          title={tx("AI Scheme & Complaint Help", "AI योजना और शिकायत सहायता")}
          lang={lang}
          onBack={() => setScreen("home")}
          onToggleLanguage={() => setLang(lang === "hi" ? "en" : "hi")}
        />
        <div style={{ ...sharedStyles.container, padding: "16px 16px 80px" }}>
          <div
            style={{
              background: "linear-gradient(180deg, #fff 0%, #fff8f1 100%)",
              borderRadius: 22,
              border: `1px solid ${PALETTE.border}`,
              padding: "18px",
              marginBottom: 14,
              boxShadow: publicPanelShadow,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                background: PALETTE.accentSoft,
                color: PALETTE.accent,
                padding: "6px 12px",
                fontSize: 11,
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              <span>🤖</span>
              <span>{tx("Guided welfare flow", "गाइडेड वेलफेयर फ्लो")}</span>
            </div>
            <div style={{ fontFamily: headingFont, fontSize: 22, fontWeight: 700, color: PALETTE.text, marginBottom: 6 }}>
              {tx("Profile → eligibility → documents → complaint", "प्रोफाइल → पात्रता → दस्तावेज़ → शिकायत")}
            </div>
            <div style={{ fontSize: 13, color: PALETTE.dim, lineHeight: 1.7, marginBottom: 12 }}>
              {tx(
                "This guided assistant follows an assisted-scheme-access model: capture the household profile, screen likely schemes, list missing documents, and prepare a structured complaint when a benefit is denied.",
                "यह सहायक एक guided scheme-access मॉडल पर काम करता है: परिवार की प्रोफाइल लें, संभावित योजनाओं की जांच करें, जरूरी दस्तावेज़ बताएं, और लाभ न मिलने पर संरचित शिकायत तैयार करें।",
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                tx("Step 1: capture household profile", "स्टेप 1: परिवार की प्रोफाइल"),
                tx("Step 2: see likely schemes", "स्टेप 2: संभावित योजनाएँ देखें"),
                tx("Step 3: list documents", "स्टेप 3: दस्तावेज़ तैयार करें"),
                tx("Step 4: draft complaint if denied", "स्टेप 4: लाभ न मिले तो शिकायत बनाएं"),
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    borderRadius: 14,
                    background: "#fff",
                    border: `1px solid ${PALETTE.border}`,
                    padding: "10px 12px",
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: PALETTE.text,
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {[
              { key: "eligibility", label: tx("Eligibility checker", "पात्रता जांच") },
              { key: "complaint", label: tx("Structured complaint", "संरचित शिकायत") },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSchemeAssistTab(item.key as "eligibility" | "complaint")}
                style={{
                  flex: 1,
                  borderRadius: 14,
                  border:
                    schemeAssistTab === item.key ? `2px solid ${PALETTE.accent}` : `2px solid ${PALETTE.border}`,
                  background: schemeAssistTab === item.key ? PALETTE.accentSoft : "#fff",
                  color: schemeAssistTab === item.key ? PALETTE.accent : PALETTE.dim,
                  padding: "13px 10px",
                  fontSize: 13.5,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: schemeAssistTab === item.key ? "0 10px 20px rgba(200,75,49,0.08)" : "none",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {schemeAssistTab === "eligibility" ? (
            <div>
              <div style={{ ...sharedStyles.card, marginBottom: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: PALETTE.text, marginBottom: 10 }}>
                  {tx("Household profile", "परिवार प्रोफाइल")}
                </div>
                <FieldInput label={tx("Name", "नाम")} value={eligibilityForm.name} onChange={(value) => updateEligibilityForm({ name: value })} hint={tx("Enter the applicant or household member name.", "आवेदक या परिवार सदस्य का नाम लिखें।")} />
                <FieldInput label={tx("Phone number", "मोबाइल नंबर")} type="tel" value={eligibilityForm.phone} onChange={(value) => updateEligibilityForm({ phone: value })} hint={tx("This saves the eligibility result in the public tracker.", "इससे पात्रता परिणाम सार्वजनिक ट्रैकर में सेव होता है।")} />
                <FieldSelect label={tx("District", "जिला")} value={eligibilityForm.district} onChange={(value) => updateEligibilityForm({ district: value as EligibilityFormState["district"] })} options={districtOptions} />
                <FieldSelect label={tx("Residence", "निवास")} value={eligibilityForm.residence} onChange={(value) => updateEligibilityForm({ residence: value as EligibilityFormState["residence"] })} options={ELIGIBILITY_RESIDENCE_OPTIONS} hint={tx("Many schemes differ between rural and urban areas.", "कई योजनाएँ ग्रामीण और शहरी क्षेत्र के हिसाब से बदलती हैं।")} />
                <FieldInput label={tx("Age", "उम्र")} type="number" value={eligibilityForm.age} onChange={(value) => updateEligibilityForm({ age: value })} />
                <FieldSelect label={tx("Gender", "लिंग")} value={eligibilityForm.gender} onChange={(value) => updateEligibilityForm({ gender: value as EligibilityFormState["gender"] })} options={ELIGIBILITY_GENDER_OPTIONS} />
                <FieldInput label={tx("Annual family income (Rs)", "परिवार की वार्षिक आय (रु.)")} type="number" value={eligibilityForm.annualIncome} onChange={(value) => updateEligibilityForm({ annualIncome: value })} hint={tx("An approximate income is enough if the exact amount is unknown.", "सटीक राशि न पता हो तो अनुमानित आय भी चलेगी।")} />
                <FieldSelect label={tx("Social category", "सामाजिक श्रेणी")} value={eligibilityForm.socialCategory} onChange={(value) => updateEligibilityForm({ socialCategory: value as EligibilityFormState["socialCategory"] })} options={ELIGIBILITY_SOCIAL_CATEGORY_OPTIONS} />
                <FieldInput label={tx("Occupation", "पेशा")} value={eligibilityForm.occupation} onChange={(value) => updateEligibilityForm({ occupation: value })} placeholder={tx("e.g. labour, student, homemaker", "जैसे मजदूर, छात्र, गृहिणी")} />
                <FieldSelect label={tx("Housing status", "आवास की स्थिति")} value={eligibilityForm.housingStatus} onChange={(value) => updateEligibilityForm({ housingStatus: value as EligibilityFormState["housingStatus"] })} options={ELIGIBILITY_HOUSING_OPTIONS} />
              </div>

              <div style={{ ...sharedStyles.card, marginBottom: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: PALETTE.text, marginBottom: 10 }}>
                  {tx("Need and document flags", "जरूरत और दस्तावेज़ संकेत")}
                </div>
                <FieldSelect label={tx("Has ration card?", "क्या राशन कार्ड है?")} value={eligibilityForm.hasRationCard ? "yes" : "no"} onChange={(value) => updateEligibilityForm({ hasRationCard: value === "yes" })} options={YES_NO_OPTIONS} />
                <FieldSelect label={tx("Has bank account?", "क्या बैंक खाता है?")} value={eligibilityForm.hasBankAccount ? "yes" : "no"} onChange={(value) => updateEligibilityForm({ hasBankAccount: value === "yes" })} options={YES_NO_OPTIONS} />
                <FieldSelect label={tx("Has Aadhaar?", "क्या आधार है?")} value={eligibilityForm.hasAadhaar ? "yes" : "no"} onChange={(value) => updateEligibilityForm({ hasAadhaar: value === "yes" })} options={YES_NO_OPTIONS} />
                <FieldSelect label={tx("Student?", "क्या छात्र हैं?")} value={eligibilityForm.isStudent ? "yes" : "no"} onChange={(value) => updateEligibilityForm({ isStudent: value === "yes" })} options={YES_NO_OPTIONS} />
                <FieldSelect label={tx("Pregnant?", "क्या गर्भवती हैं?")} value={eligibilityForm.isPregnant ? "yes" : "no"} onChange={(value) => updateEligibilityForm({ isPregnant: value === "yes" })} options={YES_NO_OPTIONS} />
                <FieldSelect label={tx("Widowed?", "क्या विधवा हैं?")} value={eligibilityForm.isWidowed ? "yes" : "no"} onChange={(value) => updateEligibilityForm({ isWidowed: value === "yes" })} options={YES_NO_OPTIONS} />
                <FieldSelect label={tx("Disability in family applicant?", "क्या दिव्यांगता है?")} value={eligibilityForm.hasDisability ? "yes" : "no"} onChange={(value) => updateEligibilityForm({ hasDisability: value === "yes" })} options={YES_NO_OPTIONS} />
                {eligibilityForm.hasDisability ? (
                  <FieldInput label={tx("Disability percentage", "दिव्यांगता प्रतिशत")} type="number" value={eligibilityForm.disabilityPercent} onChange={(value) => updateEligibilityForm({ disabilityPercent: value })} />
                ) : null}
                <FieldSelect label={tx("Landless household?", "क्या परिवार भूमिहीन है?")} value={eligibilityForm.isLandless ? "yes" : "no"} onChange={(value) => updateEligibilityForm({ isLandless: value === "yes" })} options={YES_NO_OPTIONS} />
                <FieldSelect label={tx("Immediate medical support needed?", "क्या तुरंत इलाज सहायता चाहिए?")} value={eligibilityForm.needsMedicalSupport ? "yes" : "no"} onChange={(value) => updateEligibilityForm({ needsMedicalSupport: value === "yes" })} options={YES_NO_OPTIONS} />
                <PrimaryButton onClick={submitEligibilityCheck} disabled={eligibilityLoading || !eligibilityForm.phone.trim()}>
                  {eligibilityLoading ? tx("Checking...", "जांच रहे हैं...") : tx("Run eligibility check", "पात्रता जांच चलाएं")}
                </PrimaryButton>
                {eligibilityError ? (
                  <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 10, background: "rgba(230,81,0,0.08)", color: PALETTE.orange, fontSize: 13 }}>
                    {eligibilityError}
                  </div>
                ) : null}
              </div>

              {eligibilityResult ? (
                <div>
                  <div style={{ ...sharedStyles.card, marginBottom: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: PALETTE.text, marginBottom: 6 }}>
                      {tx("Screening summary", "स्क्रीनिंग सारांश")}
                    </div>
                    <div style={{ fontSize: 13, color: PALETTE.text, lineHeight: 1.7 }}>
                      {isHindi ? eligibilityResult.hi_summary : eligibilityResult.summary}
                    </div>
                    {latestReferenceCode ? (
                      <div style={{ marginTop: 10, fontSize: 12, color: PALETTE.dim }}>
                        {tx("Saved in tracker under", "ट्रैकर में सेव किया गया")} <strong>{latestReferenceCode}</strong>
                      </div>
                    ) : null}
                  </div>

                  {eligibilityResult.recommendations.map((entry) => (
                    <div key={entry.id} style={{ ...sharedStyles.card, marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: PALETTE.text }}>
                            {isHindi ? entry.hi_name : entry.name}
                          </div>
                          <div style={{ fontSize: 11, color: PALETTE.dim, marginTop: 3 }}>{entry.category}</div>
                        </div>
                        <div
                          style={{
                            borderRadius: 999,
                            padding: "5px 10px",
                            background:
                              entry.status === "likely"
                                ? "rgba(46,125,50,0.1)"
                                : entry.status === "check"
                                  ? "rgba(21,101,192,0.1)"
                                  : "rgba(136,136,136,0.12)",
                            color:
                              entry.status === "likely"
                                ? PALETTE.green
                                : entry.status === "check"
                                  ? PALETTE.blue
                                  : PALETTE.muted,
                            fontSize: 10,
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {entry.status === "likely"
                            ? tx("Likely eligible", "संभावित रूप से पात्र")
                            : entry.status === "check"
                              ? tx("Needs checking", "जांच जरूरी")
                              : tx("Not a priority fit", "अभी प्राथमिक नहीं")}
                        </div>
                      </div>
                      {(isHindi ? entry.hi_reasons : entry.reasons).map((reason) => (
                        <div key={`${entry.id}-${reason}`} style={{ fontSize: 12.5, color: PALETTE.text, lineHeight: 1.65, marginBottom: 6 }}>
                          • {reason}
                        </div>
                      ))}
                      <div style={{ fontSize: 12, fontWeight: 800, color: PALETTE.text, marginTop: 10, marginBottom: 6 }}>
                        {tx("Documents to keep ready", "जरूरी दस्तावेज़")}
                      </div>
                      {(isHindi ? entry.hi_docs : entry.docs).map((doc) => (
                        <div key={`${entry.id}-${doc}`} style={{ fontSize: 12.5, color: PALETTE.dim, lineHeight: 1.6, marginBottom: 4 }}>
                          • {doc}
                        </div>
                      ))}
                      <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 12, background: "#F8F3EF", fontSize: 12.5, color: PALETTE.text, lineHeight: 1.6 }}>
                        <strong>{tx("Next office:", "अगला कार्यालय:")}</strong> {isHindi ? entry.hi_apply : entry.apply}
                      </div>
                      <button
                        type="button"
                        onClick={() => window.open(entry.officialUrl, "_blank", "noopener,noreferrer")}
                        style={{
                          width: "100%",
                          marginTop: 10,
                          borderRadius: 10,
                          border: "none",
                          background: PALETTE.accent,
                          color: "#fff",
                          padding: "11px 12px",
                          fontSize: 13,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        {tx("Open official source →", "आधिकारिक स्रोत खोलें →")}
                      </button>
                    </div>
                  ))}

                  <div style={{ ...sharedStyles.card }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: PALETTE.text, marginBottom: 8 }}>
                      {tx("Assisted workflow", "सहायक कार्यप्रवाह")}
                    </div>
                    {(isHindi ? eligibilityResult.hi_workflow : eligibilityResult.workflow).map((stepText) => (
                      <div key={stepText} style={{ fontSize: 12.5, color: PALETTE.text, lineHeight: 1.7, marginBottom: 6 }}>
                        • {stepText}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <div style={{ ...sharedStyles.card, marginBottom: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: PALETTE.text, marginBottom: 10 }}>
                  {tx("Complaint intake", "शिकायत इनटेक")}
                </div>
                <FieldInput label={tx("Name", "नाम")} value={complaintForm.name} onChange={(value) => updateComplaintForm({ name: value })} />
                <FieldInput label={tx("Phone number", "मोबाइल नंबर")} type="tel" value={complaintForm.phone} onChange={(value) => updateComplaintForm({ phone: value })} hint={tx("Your complaint draft will also be saved into Track My Case.", "आपका शिकायत ड्राफ्ट 'मेरा केस ट्रैक करें' में भी सेव होगा।")} />
                <FieldSelect label={tx("District", "जिला")} value={complaintForm.district} onChange={(value) => updateComplaintForm({ district: value as ComplaintAssistFormState["district"] })} options={districtOptions} />
                <FieldSelect label={tx("Benefit or service", "योजना या सेवा")} value={complaintForm.benefit} onChange={(value) => updateComplaintForm({ benefit: value })} options={COMPLAINT_BENEFIT_OPTIONS.map((value) => ({ value, label: value }))} />
                <FieldSelect label={tx("Authority involved", "संबंधित प्राधिकारी")} value={complaintForm.authority} onChange={(value) => updateComplaintForm({ authority: value })} options={COMPLAINT_AUTHORITY_OPTIONS.map((value) => ({ value, label: value }))} />
                <FieldSelect label={tx("Problem type", "समस्या का प्रकार")} value={complaintForm.grievanceType} onChange={(value) => updateComplaintForm({ grievanceType: value })} options={COMPLAINT_TYPE_OPTIONS.map((value) => ({ value, label: value }))} />
                <FieldInput label={tx("Incident date or period", "घटना की तारीख या अवधि")} value={complaintForm.incidentDate} onChange={(value) => updateComplaintForm({ incidentDate: value })} />
                <FieldInput label={tx("Village / area", "गाँव / मोहल्ला")} value={complaintForm.location} onChange={(value) => updateComplaintForm({ location: value })} />
                <FieldInput label={tx("What happened?", "क्या हुआ?")} value={complaintForm.facts} onChange={(value) => updateComplaintForm({ facts: value })} rows={5} placeholder={tx("Describe the denial, delay, corruption, or record problem clearly.", "लाभ न मिलना, देरी, रिश्वत, या रिकॉर्ड समस्या साफ़ लिखें।")} hint={tx("Write short facts in the order they happened. Dates and names help.", "तथ्यों को उसी क्रम में लिखें जिस क्रम में वे हुए। तारीख और नाम मदद करते हैं।")} />
                <FieldInput label={tx("Documents available", "उपलब्ध दस्तावेज़")} value={complaintForm.documentsAvailable} onChange={(value) => updateComplaintForm({ documentsAvailable: value })} rows={3} placeholder={tx("e.g. ration card copy, receipt, Aadhaar, passbook", "जैसे राशन कार्ड कॉपी, रसीद, आधार, पासबुक")} />
                <FieldInput label={tx("Relief you want", "आप क्या राहत चाहते हैं?")} value={complaintForm.reliefWanted} onChange={(value) => updateComplaintForm({ reliefWanted: value })} rows={3} placeholder={tx("e.g. restore benefit, release pending amount, issue card", "जैसे लाभ बहाल करें, बकाया राशि दें, कार्ड जारी करें")} />
                <PrimaryButton onClick={submitComplaintDraft} disabled={complaintLoading || !complaintForm.name.trim() || !complaintForm.phone.trim() || !complaintForm.facts.trim()}>
                  {complaintLoading ? tx("Preparing draft...", "ड्राफ्ट तैयार कर रहे हैं...") : tx("Prepare structured complaint", "संरचित शिकायत तैयार करें")}
                </PrimaryButton>
                {complaintError ? (
                  <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 10, background: "rgba(230,81,0,0.08)", color: PALETTE.orange, fontSize: 13 }}>
                    {complaintError}
                  </div>
                ) : null}
              </div>

              {complaintDraft ? (
                <div>
                  <div style={{ ...sharedStyles.card, marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: PALETTE.dim, marginBottom: 5 }}>
                      {tx("Suggested subject", "सुझाया गया विषय")}
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: PALETTE.text, marginBottom: 6 }}>
                      {isHindi ? complaintDraft.hi_subject : complaintDraft.subject}
                    </div>
                    <div style={{ fontSize: 13, color: PALETTE.text, lineHeight: 1.7 }}>
                      {isHindi ? complaintDraft.hi_summary : complaintDraft.summary}
                    </div>
                    {latestReferenceCode ? (
                      <div style={{ marginTop: 10, fontSize: 12, color: PALETTE.dim }}>
                        {tx("Saved in tracker under", "ट्रैकर में सेव किया गया")} <strong>{latestReferenceCode}</strong>
                      </div>
                    ) : null}
                  </div>

                  <div style={{ ...sharedStyles.card, marginBottom: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: PALETTE.text, marginBottom: 8 }}>
                      {tx("Facts to include", "शामिल करने वाले तथ्य")}
                    </div>
                    {(isHindi ? complaintDraft.hi_facts : complaintDraft.facts).map((entry) => (
                      <div key={entry} style={{ fontSize: 12.5, color: PALETTE.text, lineHeight: 1.7, marginBottom: 6 }}>
                        • {entry}
                      </div>
                    ))}
                  </div>

                  <div style={{ ...sharedStyles.card, marginBottom: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: PALETTE.text, marginBottom: 8 }}>
                      {tx("Relief to ask for", "मांगी जाने वाली राहत")}
                    </div>
                    {(isHindi ? complaintDraft.hi_reliefs : complaintDraft.reliefs).map((entry) => (
                      <div key={entry} style={{ fontSize: 12.5, color: PALETTE.text, lineHeight: 1.7, marginBottom: 6 }}>
                        • {entry}
                      </div>
                    ))}
                  </div>

                  <div style={{ ...sharedStyles.card, marginBottom: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: PALETTE.text, marginBottom: 8 }}>
                      {tx("Documents to attach", "संलग्न किए जाने वाले दस्तावेज़")}
                    </div>
                    {(isHindi ? complaintDraft.hi_documents_to_attach : complaintDraft.documents_to_attach).map((entry) => (
                      <div key={entry} style={{ fontSize: 12.5, color: PALETTE.text, lineHeight: 1.7, marginBottom: 6 }}>
                        • {entry}
                      </div>
                    ))}
                    <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 12, background: "#F8F3EF", fontSize: 12.5, color: PALETTE.text, lineHeight: 1.6 }}>
                      <strong>{tx("Filing office:", "शिकायत कार्यालय:")}</strong>{" "}
                      {isHindi ? complaintDraft.hi_filing_office : complaintDraft.filing_office}
                    </div>
                  </div>

                  <div style={{ ...sharedStyles.card, marginBottom: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: PALETTE.text, marginBottom: 8 }}>
                      {tx("Next steps", "अगले कदम")}
                    </div>
                    {(isHindi ? complaintDraft.hi_next_steps : complaintDraft.next_steps).map((entry) => (
                      <div key={entry} style={{ fontSize: 12.5, color: PALETTE.text, lineHeight: 1.7, marginBottom: 6 }}>
                        • {entry}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setScreen("caseTracker")}
                      style={{
                        flex: 1,
                        borderRadius: 10,
                        border: "none",
                        background: PALETTE.green,
                        color: "#fff",
                        padding: "12px",
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {tx("Open tracker", "ट्रैकर खोलें")}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openPrefilledIntake(
                          `${complaintDraft.subject}\n\n${complaintForm.facts}`,
                          "welfare",
                        )
                      }
                      style={{
                        flex: 1,
                        borderRadius: 10,
                        border: `1px solid ${PALETTE.border}`,
                        background: "#fff",
                        color: PALETTE.text,
                        padding: "12px",
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {tx("Send to Jan Sahayak", "जन सहायक को भेजें")}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === "schemes") {
    return (
      <div className="public-app-root" style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
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
      <div className="public-app-root" style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
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
    if (activeTrainingCourse && activeTrainingStudyPack) {
      return (
        <div className="public-app-root" style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
          <ScreenHeader
            title={isHindi ? activeTrainingCourse.hi : activeTrainingCourse.title}
            lang={lang}
            onBack={() => setActiveTrainingCourse(null)}
            onToggleLanguage={() => setLang(lang === "hi" ? "en" : "hi")}
          />
          <div style={{ ...sharedStyles.container, padding: "16px 16px 90px" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                overflow: "hidden",
                border: `1px solid ${PALETTE.border}`,
                boxShadow: "0 18px 32px rgba(26,26,26,0.06)",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  background: `linear-gradient(135deg, ${activeTrainingCourse.accent} 0%, ${activeTrainingCourse.accent}DD 100%)`,
                  padding: "20px 18px",
                  color: "#fff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "5px 10px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.16)",
                        fontSize: 11,
                        fontWeight: 800,
                        marginBottom: 12,
                      }}
                    >
                      <span>{activeTrainingCourse.icon}</span>
                      <span>
                        {activeTrainingCourse.status === "coming_soon"
                          ? tx("Syllabus Preview", "सिलेबस पूर्वावलोकन")
                          : tx("Jan Sahayak Study Pack", "जन सहायक स्टडी पैक")}
                      </span>
                    </div>
                    <div style={{ fontSize: 23, fontWeight: 800, lineHeight: 1.25 }}>{activeTrainingCourse.title}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", marginTop: 5 }}>{activeTrainingCourse.hi}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", marginTop: 12 }}>
                      {isHindi ? activeTrainingStudyPack.hi_tagline : activeTrainingStudyPack.tagline}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.14)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      flexShrink: 0,
                    }}
                  >
                    {activeTrainingCourse.icon}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                  {[
                    isHindi ? activeTrainingStudyPack.hi_difficulty : activeTrainingStudyPack.difficulty,
                    isHindi ? activeTrainingStudyPack.hi_format : activeTrainingStudyPack.format,
                    isHindi ? activeTrainingCourse.hi_levelsLabel : activeTrainingCourse.levelsLabel,
                  ].map((chip) => (
                    <span
                      key={chip}
                      style={{
                        borderRadius: 999,
                        padding: "5px 10px",
                        background: "rgba(255,255,255,0.14)",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ padding: "16px 18px 18px" }}>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "#FAF6F2",
                    border: `1px solid ${PALETTE.border}`,
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: PALETTE.dim,
                    marginBottom: 14,
                  }}
                >
                  {tx(
                    "This in-app study pack adds structured materials on top of the original Jan Nyaya Resource Centre course, including official sources, case briefs, field tools, and practice drills.",
                    "यह in-app study pack मूल Jan Nyaya Resource Centre course के ऊपर आधिकारिक स्रोत, केस ब्रीफ, फील्ड टूल और practice drill जोड़ता है।",
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  {[
                    {
                      label: tx("Duration", "अवधि"),
                      value: isHindi ? activeTrainingCourse.hi_durationLabel : activeTrainingCourse.durationLabel,
                    },
                    {
                      label: tx("Curriculum", "पाठ्यक्रम"),
                      value: `${activeTrainingStudyPack.syllabus.length} ${tx("modules", "मॉड्यूल")}`,
                    },
                    {
                      label: tx("Case Briefs", "केस ब्रीफ"),
                      value: `${activeTrainingStudyPack.caseBriefs.length} ${tx("included", "शामिल")}`,
                    },
                    {
                      label: tx("Official Sources", "आधिकारिक स्रोत"),
                      value: `${activeTrainingStudyPack.officialResources.length} ${tx("linked", "लिंक्ड")}`,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        background: "#fff",
                        borderRadius: 14,
                        border: `1px solid ${PALETTE.border}`,
                        padding: "12px 13px",
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: PALETTE.muted, marginBottom: 5 }}>{stat.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: PALETTE.text }}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {activeTrainingCourse.href ? (
                    <button
                      type="button"
                      onClick={() => openExternalTraining(activeTrainingCourse.href!)}
                      style={{
                        flex: 1,
                        border: "none",
                        borderRadius: 10,
                        background: activeTrainingCourse.accent,
                        color: "#fff",
                        padding: "12px 14px",
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {tx("Open Original Course →", "मूल कोर्स खोलें →")}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setScreen("plvJoin")}
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      border: `1px solid ${PALETTE.border}`,
                      background: "#fff",
                      color: PALETTE.text,
                      padding: "12px 14px",
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {tx("Join as PLV", "PLV बनें")}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ ...sharedStyles.card, borderRadius: 18, marginBottom: 14 }}>
              <div style={{ fontFamily: headingFont, fontSize: 17, fontWeight: 700, color: PALETTE.text, marginBottom: 10 }}>
                {tx("What You Will Learn", "आप क्या सीखेंगे")}
              </div>
              {activeTrainingStudyPack.outcomes.map((outcome, index) => (
                <div key={outcome} style={{ display: "flex", gap: 10, marginBottom: index === activeTrainingStudyPack.outcomes.length - 1 ? 0 : 10 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      background: `${activeTrainingCourse.accent}15`,
                      color: activeTrainingCourse.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div style={{ fontSize: 13, color: PALETTE.text, lineHeight: 1.65 }}>{outcome}</div>
                </div>
              ))}
            </div>

            <div style={{ ...sharedStyles.card, borderRadius: 18, marginBottom: 14 }}>
              <div style={{ fontFamily: headingFont, fontSize: 17, fontWeight: 700, color: PALETTE.text, marginBottom: 10 }}>
                {tx("Curriculum", "पाठ्यक्रम")}
              </div>
              {activeTrainingStudyPack.syllabus.map((module, index) => (
                <div
                  key={module.title}
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${PALETTE.border}`,
                    padding: "14px 14px 12px",
                    marginBottom: index === activeTrainingStudyPack.syllabus.length - 1 ? 0 : 10,
                    background: index === 0 ? "#FCF7F4" : "#fff",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                    <div
                      style={{
                        minWidth: 60,
                        borderRadius: 999,
                        padding: "4px 8px",
                        background: `${activeTrainingCourse.accent}15`,
                        color: activeTrainingCourse.accent,
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      {`Module ${index + 1}`}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: PALETTE.text }}>{module.title}</div>
                  </div>
                  <div style={{ fontSize: 12.5, color: PALETTE.dim, lineHeight: 1.65, marginBottom: 10 }}>{module.summary}</div>
                  {module.topics.map((topic) => (
                    <div key={`${module.title}-${topic}`} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: activeTrainingCourse.accent, fontWeight: 800, flexShrink: 0 }}>•</span>
                      <span style={{ fontSize: 12.5, color: PALETTE.text, lineHeight: 1.6 }}>{topic}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ ...sharedStyles.card, borderRadius: 18, marginBottom: 14 }}>
              <div style={{ fontFamily: headingFont, fontSize: 17, fontWeight: 700, color: PALETTE.text, marginBottom: 10 }}>
                {tx("Landmark Cases", "महत्वपूर्ण मामले")}
              </div>
              {activeTrainingStudyPack.caseBriefs.map((item, index) => (
                <div
                  key={item.title}
                  style={{
                    paddingBottom: index === activeTrainingStudyPack.caseBriefs.length - 1 ? 0 : 12,
                    marginBottom: index === activeTrainingStudyPack.caseBriefs.length - 1 ? 0 : 12,
                    borderBottom: index === activeTrainingStudyPack.caseBriefs.length - 1 ? "none" : `1px solid ${PALETTE.border}`,
                  }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: PALETTE.text, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 12.5, color: PALETTE.dim, lineHeight: 1.65 }}>{item.description}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ ...sharedStyles.card, borderRadius: 18, marginBottom: 0 }}>
                <div style={{ fontFamily: headingFont, fontSize: 17, fontWeight: 700, color: PALETTE.text, marginBottom: 10 }}>
                  {tx("Field Tools", "फील्ड टूल")}
                </div>
                {activeTrainingStudyPack.fieldTools.map((item, index) => (
                  <div
                    key={item.title}
                    style={{
                      paddingBottom: index === activeTrainingStudyPack.fieldTools.length - 1 ? 0 : 12,
                      marginBottom: index === activeTrainingStudyPack.fieldTools.length - 1 ? 0 : 12,
                      borderBottom: index === activeTrainingStudyPack.fieldTools.length - 1 ? "none" : `1px solid ${PALETTE.border}`,
                    }}
                  >
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: PALETTE.text, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 12.5, color: PALETTE.dim, lineHeight: 1.65 }}>{item.description}</div>
                  </div>
                ))}
              </div>

              <div style={{ ...sharedStyles.card, borderRadius: 18, marginBottom: 0 }}>
                <div style={{ fontFamily: headingFont, fontSize: 17, fontWeight: 700, color: PALETTE.text, marginBottom: 10 }}>
                  {tx("Practice Lab", "अभ्यास अनुभाग")}
                </div>
                {activeTrainingStudyPack.practiceLab.map((item, index) => (
                  <div
                    key={item.title}
                    style={{
                      paddingBottom: index === activeTrainingStudyPack.practiceLab.length - 1 ? 0 : 12,
                      marginBottom: index === activeTrainingStudyPack.practiceLab.length - 1 ? 0 : 12,
                      borderBottom: index === activeTrainingStudyPack.practiceLab.length - 1 ? "none" : `1px solid ${PALETTE.border}`,
                    }}
                  >
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: PALETTE.text, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 12.5, color: PALETTE.dim, lineHeight: 1.65 }}>{item.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...sharedStyles.card, borderRadius: 18, marginTop: 14, marginBottom: 14 }}>
              <div style={{ fontFamily: headingFont, fontSize: 17, fontWeight: 700, color: PALETTE.text, marginBottom: 10 }}>
                {tx("Official Sources & Further Reading", "आधिकारिक स्रोत और आगे की पढ़ाई")}
              </div>
              {activeTrainingStudyPack.officialResources.map((resource, index) => (
                <button
                  key={resource.label}
                  type="button"
                  onClick={() => openExternalTraining(resource.url)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    borderRadius: 14,
                    border: `1px solid ${PALETTE.border}`,
                    background: "#fff",
                    padding: "13px 14px",
                    marginBottom: index === activeTrainingStudyPack.officialResources.length - 1 ? 0 : 10,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: PALETTE.text, marginBottom: 4 }}>{resource.label}</div>
                  <div style={{ fontSize: 12.5, color: PALETTE.dim, lineHeight: 1.6 }}>{resource.note}</div>
                  <div style={{ fontSize: 11, color: activeTrainingCourse.accent, marginTop: 6, fontWeight: 700 }}>
                    {tx("Open official source →", "आधिकारिक स्रोत खोलें →")}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeModule) {
      return (
        <div className="public-app-root" style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
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
      <div className="public-app-root" style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
        <ScreenHeader
          title={tx("PLV Training Modules", "PLV प्रशिक्षण मॉड्यूल")}
          lang={lang}
          onBack={() => {
            setActiveTrainingCourse(null);
            setScreen("home");
          }}
          onToggleLanguage={() => setLang(lang === "hi" ? "en" : "hi")}
        />
        <div style={{ ...sharedStyles.container, padding: "16px 16px 80px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #fff 0%, #fff9f2 100%)",
              borderRadius: 22,
              padding: "20px 18px",
              marginBottom: 16,
              border: `1px solid ${PALETTE.border}`,
              boxShadow: publicPanelShadow,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: PALETTE.accentSoft,
                borderRadius: 999,
                padding: "6px 12px",
                fontSize: 11,
                fontWeight: 700,
                color: PALETTE.accent,
                marginBottom: 12,
              }}
            >
              <span>📚</span>
              {tx("Jan Nyaya Resource Centre", "जन न्याय रिसोर्स सेंटर")}
            </div>
            <div style={{ fontFamily: headingFont, fontSize: 22, fontWeight: 700, color: PALETTE.text, marginBottom: 6 }}>
              {tx("PLV Academy", "PLV अकादमी")}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: PALETTE.dim, marginBottom: 10 }}>
              {tx(
                "This section preserves the original Janman academy course language and structure so the legal curriculum stays precise while you learn inside Jan Sahayak.",
                "यह अनुभाग Janman अकादमी के मूल कोर्स ढांचे और भाषा को सुरक्षित रखता है ताकि कानूनी पाठ्यक्रम की सटीकता बनी रहे और आप Jan Sahayak के भीतर सीख सकें।",
              )}
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                background: "#F8F3EF",
                fontSize: 12,
                color: PALETTE.dim,
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              {tx(
                "Quick field modules below remain bilingual. The deeper academy tracks keep their original English course copy because that is the researched Jan Nyaya Resource Centre curriculum.",
                "नीचे दिए गए त्वरित फील्ड मॉड्यूल द्विभाषी हैं। गहरे अकादमी ट्रैक अपने मूल English पाठ्यक्रम-लेखन में रखे गए हैं क्योंकि वही Jan Nyaya Resource Centre का शोध-आधारित मूल पाठ है।",
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
                  key={entry.en}
                  style={{
                    background: "#F8F3EF",
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: PALETTE.text,
                  }}
                >
                  {entry.en}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 14,
                padding: "11px 12px",
                borderRadius: 14,
                background: "#fff",
                border: `1px solid ${PALETTE.border}`,
                fontSize: 12.5,
                color: PALETTE.dim,
                lineHeight: 1.6,
              }}
            >
              {tx(
                "The academy view is now organised like a clearer learning hub: quicker scanning, stronger contrast, course previews, and simpler paths into the deeper curriculum.",
                "अकादमी दृश्य अब एक स्पष्ट learning hub की तरह व्यवस्थित है: तेज़ scanning, बेहतर contrast, course preview और गहरे curriculum तक सरल रास्ते।",
              )}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button
                type="button"
                onClick={() => openExternalTraining(TRAINING_RESOURCE_CENTRE_URL)}
                style={{
                  flex: 1,
                  border: "none",
                  borderRadius: 10,
                  background: PALETTE.accent,
                  color: "#fff",
                  padding: "11px 12px",
                  fontSize: 13,
                  fontWeight: 800,
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
                  padding: "11px 12px",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {tx("Join as PLV", "PLV बनें")}
              </button>
            </div>
          </div>

          <div style={{ fontFamily: headingFont, fontSize: 17, fontWeight: 700, color: PALETTE.text, marginBottom: 6 }}>
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

          <div
            style={{ fontFamily: headingFont, fontSize: 17, fontWeight: 700, color: PALETTE.text, marginTop: 18, marginBottom: 6 }}
          >
            {tx("PLV Core Pathway", "PLV मुख्य प्रशिक्षण पथ")}
          </div>
          <div style={{ fontSize: 13, color: PALETTE.dim, marginBottom: 14, lineHeight: 1.6 }}>
            {tx(
              "This is the most relevant deeper pathway for a field PLV inside the Jan Nyaya Resource Centre.",
              "यह Jan Nyaya Resource Centre के भीतर फील्ड PLV के लिए सबसे प्रासंगिक गहरा प्रशिक्षण-पथ है।",
            )}
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: `1px solid ${PALETTE.border}`,
              marginBottom: 14,
              overflow: "hidden",
              boxShadow: "0 10px 22px rgba(26,26,26,0.05)",
            }}
          >
            <div
              style={{
                padding: "18px",
                background: `linear-gradient(135deg, ${plvFlagshipTrack.accent}18, ${plvFlagshipTrack.accent}08)`,
                borderBottom: `1px solid ${PALETTE.border}`,
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: plvFlagshipTrack.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {plvFlagshipTrack.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: PALETTE.text }}>{plvFlagshipTrack.title}</div>
                  <div style={{ fontSize: 12, color: PALETTE.dim, marginTop: 3 }}>{plvFlagshipTrack.hi}</div>
                  <div style={{ fontSize: 12.5, color: PALETTE.dim, marginTop: 8, lineHeight: 1.65 }}>
                    {plvFlagshipTrack.summary}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                    {plvFlagshipTrack.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          borderRadius: 999,
                          padding: "4px 9px",
                          fontSize: 10,
                          fontWeight: 800,
                          color: plvFlagshipTrack.accent,
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
              {plvFlagshipTrack.levels.map((level, index) => (
                <div
                  key={`${plvFlagshipTrack.id}-${level.label}`}
                  style={{
                    display: "flex",
                    gap: 10,
                    paddingBottom: index === plvFlagshipTrack.levels.length - 1 ? 0 : 12,
                    marginBottom: index === plvFlagshipTrack.levels.length - 1 ? 0 : 12,
                    borderBottom:
                      index === plvFlagshipTrack.levels.length - 1 ? "none" : `1px solid ${PALETTE.border}`,
                  }}
                >
                  <div
                    style={{
                      minWidth: 82,
                      fontSize: 11,
                      fontWeight: 800,
                      color: plvFlagshipTrack.accent,
                      textTransform: "uppercase",
                      paddingTop: 2,
                    }}
                  >
                    {level.label}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: PALETTE.text }}>{level.title}</div>
                    <div style={{ fontSize: 12, color: PALETTE.dim, lineHeight: 1.6, marginTop: 3 }}>
                      {level.summary}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => {
                    const flagshipCourse =
                      TRAINING_LIBRARY_COURSES.find((course) => course.id === plvFlagshipTrack.id) ?? null;
                    if (flagshipCourse) {
                      openTrainingCourse(flagshipCourse);
                      return;
                    }
                    openExternalTraining(plvFlagshipTrack.href);
                  }}
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    border: "none",
                    background: plvFlagshipTrack.accent,
                    color: "#fff",
                    padding: "12px",
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Explore PLV Track →
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
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {tx("Register as PLV", "PLV के रूप में पंजीकरण")}
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg,#0F172A 0%,#1E1B4B 100%)",
              borderRadius: 16,
              padding: "22px 20px",
              color: "#fff",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                display: "inline-block",
                borderRadius: 999,
                background: "rgba(99,102,241,0.22)",
                color: "#E0E7FF",
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              JUST LAUNCHED
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.3, marginBottom: 8 }}>
              Child Rights & Protection — 4-Track Programme
            </div>
            <div style={{ fontSize: 13, color: "#C7D2FE", lineHeight: 1.65, marginBottom: 12 }}>
              POCSO · JJ Act · Child Marriage · 2024 INSC 790 · 16 levels · 4 specialised tracks tailored to your role.
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {["Social Workers", "Paralegals", "Law Students", "Lawyers", "Free Certificate"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    borderRadius: 999,
                    padding: "4px 10px",
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#E0E7FF",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                if (childRightsProgrammeCourse) {
                  openTrainingCourse(childRightsProgrammeCourse);
                  return;
                }
                openExternalTraining("https://shashwat-sys.github.io/janman-training/child-rights/index.html");
              }}
              style={{
                border: "none",
                borderRadius: 10,
                background: "#6366F1",
                color: "#fff",
                padding: "12px 18px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Explore Programme →
            </button>
          </div>

          <div
            style={{ fontFamily: headingFont, fontSize: 17, fontWeight: 700, color: PALETTE.text, marginTop: 18, marginBottom: 6 }}
          >
            {tx("Course Library", "कोर्स लाइब्रेरी")}
          </div>
          <div style={{ fontSize: 13, color: PALETTE.dim, marginBottom: 12, lineHeight: 1.6 }}>
            {tx(
              "These are the original Jan Nyaya Resource Centre course cards, cleaned up and connected to Jan Sahayak.",
              "ये Jan Nyaya Resource Centre के मूल कोर्स कार्ड हैं, जिन्हें साफ़ रूप में Jan Sahayak से जोड़ा गया है।",
            )}
          </div>

          <div style={{ ...sharedStyles.card, borderRadius: 18, marginBottom: 14 }}>
            <FieldInput
              label={tx("Search courses", "कोर्स खोजें")}
              value={trainingSearch}
              onChange={setTrainingSearch}
              placeholder={tx(
                "Search: child rights, FIR, compensation, constitutional rights...",
                "खोजें: child rights, FIR, compensation, constitutional rights...",
              )}
              hint={tx(
                "Use the audience filter to narrow the academy to PLVs, social workers, law students, or lawyers.",
                "Audience filter से PLV, social worker, law student या lawyer के अनुसार परिणाम सीमित करें।",
              )}
            />

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                    padding: "9px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <span>{option.icon}</span>
                  <span>{option.english}</span>
                  <span
                    style={{
                      borderRadius: 999,
                      padding: "2px 7px",
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
              Available Courses
            </div>
          ) : null}

          {liveTrainingCourses.map((course) => (
            <TrainingCourseCard
              key={course.id}
              course={course}
              onPreview={openTrainingCourse}
              onOpenSource={openExternalTraining}
            />
          ))}

          {upcomingTrainingCourses.length > 0 ? (
            <div style={{ fontSize: 14, fontWeight: 700, color: PALETTE.text, marginTop: 14, marginBottom: 8 }}>
              Coming Soon
            </div>
          ) : null}

          {upcomingTrainingCourses.map((course) => (
            <TrainingCourseCard
              key={course.id}
              course={course}
              onPreview={openTrainingCourse}
              onOpenSource={openExternalTraining}
            />
          ))}

          <div
            style={{ fontFamily: headingFont, fontSize: 17, fontWeight: 700, color: PALETTE.text, marginTop: 20, marginBottom: 6 }}
          >
            {tx("Learning Paths", "सीखने के पथ")}
          </div>
          <div style={{ fontSize: 13, color: PALETTE.dim, marginBottom: 12, lineHeight: 1.6 }}>
            {tx(
              "Curated role-based journeys from the original Jan Nyaya Resource Centre.",
              "मूल Jan Nyaya Resource Centre के भूमिका-आधारित चुने हुए सीखने के पथ।",
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
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{path.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.82)", marginTop: 3 }}>{path.hi_title}</div>
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
      <div className="public-app-root" style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
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
      <div className="public-app-root" style={{ minHeight: "100vh", background: PALETTE.bg, fontFamily: bodyFont, colorScheme: "light" }}>
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
