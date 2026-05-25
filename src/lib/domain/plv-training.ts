export type TrainingModule = {
  id: string;
  title: string;
  hi: string;
  icon: string;
  content: string;
  hi_content: string;
  quiz: Array<{
    q: string;
    hi_q: string;
    options: string[];
    correct: number;
  }>;
};

export type TrainingAudience = "all" | "sw" | "pl" | "ls" | "lw";
export type TrainingCourseStatus = "live" | "coming_soon";

export type TrainingAcademyStats = {
  programmesLive: {
    en: string;
    hi: string;
  };
  coursesAndTracks: {
    en: string;
    hi: string;
  };
  hoursOfContent: {
    en: string;
    hi: string;
  };
  caseAnalyses: {
    en: string;
    hi: string;
  };
};

export type TrainingFlagshipTrack = {
  id: string;
  title: string;
  hi: string;
  icon: string;
  accent: string;
  summary: string;
  hi_summary: string;
  tags: string[];
  hi_tags: string[];
  href: string;
  levels: Array<{
    label: string;
    hi_label: string;
    title: string;
    hi_title: string;
    summary: string;
    hi_summary: string;
  }>;
};

export type TrainingCourse = {
  id: string;
  icon: string;
  title: string;
  hi: string;
  summary: string;
  hi_summary: string;
  audiences: TrainingAudience[];
  keywords: string[];
  levelsLabel: string;
  hi_levelsLabel: string;
  durationLabel: string;
  hi_durationLabel: string;
  status: TrainingCourseStatus;
  accent: string;
  badge?: string;
  hi_badge?: string;
  href?: string;
  certificate?: string;
  hi_certificate?: string;
  ctaLabel?: string;
};

export type TrainingLearningPath = {
  id: string;
  title: string;
  hi_title: string;
  icon: string;
  summary: string;
  hi_summary: string;
  courseCount: string;
  hi_courseCount: string;
  duration: string;
  hi_duration: string;
  certificates: string;
  hi_certificates: string;
  href: string;
  accent: string;
};

export type TrainingStudyPackSection = {
  title: string;
  summary: string;
  topics: string[];
};

export type TrainingStudyPackItem = {
  title: string;
  description: string;
};

export type TrainingStudyPackResource = {
  label: string;
  url: string;
  note: string;
};

export type TrainingStudyPack = {
  tagline: string;
  hi_tagline: string;
  difficulty: string;
  hi_difficulty: string;
  format: string;
  hi_format: string;
  outcomes: string[];
  syllabus: TrainingStudyPackSection[];
  caseBriefs: TrainingStudyPackItem[];
  fieldTools: TrainingStudyPackItem[];
  practiceLab: TrainingStudyPackItem[];
  officialResources: TrainingStudyPackResource[];
};

export const QUICK_PLV_MODULES: TrainingModule[] = [
  {
    id: "m1",
    title: "FIR — Your Rights",
    hi: "FIR — आपके अधिकार",
    icon: "📋",
    content:
      "You have the RIGHT to file an FIR at any police station for any cognisable offence. Police cannot refuse. Zero FIR means any station must register for any area. If refused: go to DSP/SP office, write to the Magistrate, or file a private complaint under BNSS.",
    hi_content:
      "आपको किसी भी संज्ञेय अपराध के लिए किसी भी थाने में FIR दर्ज कराने का अधिकार है। पुलिस मना नहीं कर सकती। Zero FIR का मतलब है कि किसी भी जिले का मामला हो, कोई भी थाना FIR दर्ज करेगा। मना करने पर DSP/SP, मजिस्ट्रेट, या BNSS के तहत शिकायत करें।",
    quiz: [
      {
        q: "Can police refuse to file Zero FIR?",
        hi_q: "क्या पुलिस Zero FIR दर्ज करने से मना कर सकती है?",
        options: [
          "Yes, if it is another district",
          "No — Zero FIR must be registered at any station",
          "Only SP can decide",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "m2",
    title: "Rights of Arrested Person",
    hi: "गिरफ्तार व्यक्ति के अधिकार",
    icon: "⚖",
    content:
      "When arrested, you have the RIGHT to know the reason, inform family immediately, meet a lawyer, be produced before a Magistrate within 24 hours, not be tortured, and receive free legal aid if you cannot afford a lawyer.",
    hi_content:
      "गिरफ्तारी पर कारण जानने, परिवार को सूचित करने, वकील से मिलने, 24 घंटे में मजिस्ट्रेट के सामने पेश होने, यातना से सुरक्षा, और जरूरत पर मुफ्त कानूनी सहायता का अधिकार है।",
    quiz: [
      {
        q: "Can police hold a person without producing before Magistrate for more than 24 hours?",
        hi_q: "क्या पुलिस 24 घंटे से ज्यादा बिना मजिस्ट्रेट के किसी को रख सकती है?",
        options: ["Yes, for 48 hours", "No, must produce within 24 hours", "Yes, up to 7 days"],
        correct: 1,
      },
    ],
  },
  {
    id: "m3",
    title: "POCSO — Protecting Children",
    hi: "POCSO — बच्चों की सुरक्षा",
    icon: "🛡",
    content:
      "POCSO Act 2012 protects all persons under 18 from sexual abuse. Any person with knowledge of abuse must report it to police or DCPU. Never disclose a child's identity. Call 1098 immediately when urgent help is needed.",
    hi_content:
      "POCSO Act 2012 18 वर्ष से कम सभी बच्चों को यौन हिंसा से सुरक्षा देता है। किसी भी व्यक्ति को जानकारी होने पर रिपोर्ट करना जरूरी है। बच्चे की पहचान कभी उजागर न करें। तुरंत मदद के लिए 1098 पर कॉल करें।",
    quiz: [
      {
        q: "If a teacher witnesses abuse of a student, must they report it?",
        hi_q: "अगर शिक्षक बच्चे के साथ दुर्व्यवहार देखे, क्या उसे रिपोर्ट करना जरूरी है?",
        options: ["Only if the parent asks", "No — it is optional", "Yes — reporting is mandatory"],
        correct: 2,
      },
    ],
  },
  {
    id: "m4",
    title: "Domestic Violence — Protection",
    hi: "घरेलू हिंसा — संरक्षण",
    icon: "🏠",
    content:
      "PWDVA 2005 protects women from physical, emotional, sexual, verbal, and economic violence by family members. Remedies include protection orders, residence orders, monetary relief, and child custody support.",
    hi_content:
      "PWDVA 2005 परिवार के सदस्यों द्वारा शारीरिक, भावनात्मक, यौन, मौखिक और आर्थिक हिंसा से महिलाओं की रक्षा करता है। संरक्षण आदेश, निवास का अधिकार, मुआवजा और बच्चों की अभिरक्षा जैसी राहत मिल सकती है।",
    quiz: [
      {
        q: "Does PWDVA cover a woman living in a live-in relationship?",
        hi_q: "क्या PWDVA लिव-इन संबंध में रह रही महिला को भी सुरक्षा देता है?",
        options: ["No — only married women", "Yes — covers married and live-in partners", "Only if they have children"],
        correct: 1,
      },
    ],
  },
  {
    id: "m5",
    title: "SC/ST Atrocities Act",
    hi: "SC/ST अत्याचार निवारण अधिनियम",
    icon: "✊",
    content:
      "The SC/ST Prevention of Atrocities Act 1989 protects SC/ST communities from violence, land seizure, insults, and social exclusion. FIR registration is mandatory and anticipatory bail is heavily restricted.",
    hi_content:
      "SC/ST अत्याचार निवारण अधिनियम 1989 SC/ST समुदायों को हिंसा, जमीन छीनने, अपमान और सामाजिक बहिष्कार से सुरक्षा देता है। FIR अनिवार्य है और अग्रिम जमानत पर कड़ा प्रतिबंध है।",
    quiz: [
      {
        q: "Can a person accused under the SC/ST Act get anticipatory bail?",
        hi_q: "क्या SC/ST Act के आरोपी को अग्रिम जमानत मिल सकती है?",
        options: ["Yes, from High Court", "No — anticipatory bail is not ordinarily available", "Only if victim agrees"],
        correct: 1,
      },
    ],
  },
  {
    id: "m6",
    title: "Land Rights in Bihar",
    hi: "बिहार में भूमि अधिकार",
    icon: "🌾",
    content:
      "Every landless family should know about homestead land rights, mutation rights, and land restoration remedies. If land is forcibly taken, combine revenue remedies with criminal protection where applicable.",
    hi_content:
      "हर भूमिहीन परिवार को होमस्टेड भूमि, नामांतरण और जमीन वापस पाने के उपायों की जानकारी होनी चाहिए। जबरन कब्जा होने पर राजस्व और आपराधिक दोनों उपाय जरूरी हो सकते हैं।",
    quiz: [
      {
        q: "Under Bihar Homestead protections, how much land is often discussed as a basic homestead entitlement?",
        hi_q: "बिहार होमस्टेड अधिकारों में बुनियादी अधिकार के रूप में कितनी जमीन का उल्लेख आता है?",
        options: ["10 decimals", "Up to 3 decimals", "1 bigha"],
        correct: 1,
      },
    ],
  },
];

export const TRAINING_ACADEMY_STATS: TrainingAcademyStats = {
  programmesLive: {
    en: "3 live programmes",
    hi: "3 सक्रिय कार्यक्रम",
  },
  coursesAndTracks: {
    en: "13 courses and tracks",
    hi: "13 कोर्स और ट्रैक",
  },
  hoursOfContent: {
    en: "50+ hours",
    hi: "50+ घंटे सामग्री",
  },
  caseAnalyses: {
    en: "30+ landmark case analyses",
    hi: "30+ महत्वपूर्ण निर्णय विश्लेषण",
  },
};

export const FLAGSHIP_PLV_TRACKS: TrainingFlagshipTrack[] = [
  {
    id: "child-rights-plv",
    title: "Child Rights: Paralegal Volunteer Track",
    hi: "बाल अधिकार: पैरालीगल स्वयंसेवक ट्रैक",
    icon: "📋",
    accent: "#15803D",
    summary:
      "A structured PLV pathway focused on child protection complaints, DLSA support, compensation, RTI, and community action.",
    hi_summary:
      "बाल संरक्षण शिकायत, DLSA सहयोग, मुआवज़ा, RTI और सामुदायिक हस्तक्षेप पर आधारित एक क्रमबद्ध PLV प्रशिक्षण पथ।",
    tags: ["3 levels", "Final certificate", "Child protection"],
    hi_tags: ["3 स्तर", "अंतिम प्रमाणपत्र", "बाल संरक्षण"],
    href: "https://shashwat-sys.github.io/janman-training/child-rights/paralegal/index.html",
    levels: [
      {
        label: "Level 1",
        hi_label: "स्तर 1",
        title: "Legal Framework: POCSO, JJ Act & Child Offences",
        hi_title: "कानूनी ढांचा: POCSO, JJ Act और बाल अपराध",
        summary: "Build the doctrinal base that a PLV needs before field intake and referrals.",
        hi_summary: "फील्ड इंटेक और रेफरल से पहले PLV को आवश्यक बुनियादी कानूनी समझ विकसित करें।",
      },
      {
        label: "Level 2",
        hi_label: "स्तर 2",
        title: "Victim Support, Legal Aid & Compensation",
        hi_title: "पीड़ित सहयोग, कानूनी सहायता और मुआवज़ा",
        summary: "Learn how to support survivors through aid, compensation, and referral systems.",
        hi_summary: "सहायता, मुआवज़ा और रेफरल प्रणालियों के माध्यम से पीड़ितों का सहयोग करना सीखें।",
      },
      {
        label: "Level 3",
        hi_label: "स्तर 3",
        title: "Field Practice: Complaints, RTI & Community Action",
        hi_title: "फील्ड अभ्यास: शिकायत, RTI और सामुदायिक कार्रवाई",
        summary: "Move into complaints drafting, RTI, Childline coordination, and local mobilisation.",
        hi_summary: "शिकायत प्रारूपण, RTI, Childline समन्वय और स्थानीय संगठनात्मक कार्रवाई पर काम करें।",
      },
      {
        label: "Certificate",
        hi_label: "प्रमाणपत्र",
        title: "Final Certification",
        hi_title: "अंतिम प्रमाणन",
        summary: "Unlock the Jan Nyaya Abhiyan certificate after completing all levels.",
        hi_summary: "सभी स्तर पूरे करने के बाद Jan Nyaya Abhiyan का प्रमाणपत्र प्राप्त करें।",
      },
    ],
  },
  {
    id: "gbv-programme",
    title: "Gender-Based Violence & Women's Protection Laws",
    hi: "जेंडर आधारित हिंसा और महिला संरक्षण कानून",
    icon: "⚖",
    accent: "#C2410C",
    summary:
      "A three-level programme spanning foundational law, detailed procedures, and advanced strategy for GBV response and litigation.",
    hi_summary:
      "GBV प्रतिक्रिया और मुकदमेबाज़ी के लिए बुनियादी कानून, विस्तृत प्रक्रिया और उन्नत रणनीति को समेटने वाला तीन-स्तरीय कार्यक्रम।",
    tags: ["3 levels", "GBV certificate", "Women's protection laws"],
    hi_tags: ["3 स्तर", "GBV प्रमाणपत्र", "महिला संरक्षण कानून"],
    href: "https://shashwat-sys.github.io/janman-training/gbv/index.html",
    levels: [
      {
        label: "Level 1",
        hi_label: "स्तर 1",
        title: "Foundational Women's Protection Laws",
        hi_title: "महिला संरक्षण कानून की बुनियाद",
        summary: "IPC/BNS, PWDVA, POCSO, POSH, PCMA, and the core structure of protection laws.",
        hi_summary: "IPC/BNS, PWDVA, POCSO, POSH, PCMA और महिला संरक्षण कानूनों की मूल संरचना।",
      },
      {
        label: "Level 2",
        hi_label: "स्तर 2",
        title: "Detailed Law & Procedures",
        hi_title: "विस्तृत कानून और प्रक्रिया",
        summary: "ICC procedure, protection orders, reporting duties, BNS sections, and landmark judgments.",
        hi_summary: "ICC प्रक्रिया, संरक्षण आदेश, रिपोर्टिंग दायित्व, BNS धाराएँ और महत्वपूर्ण निर्णय।",
      },
      {
        label: "Level 3",
        hi_label: "स्तर 3",
        title: "Strategic Litigation & Evidence",
        hi_title: "रणनीतिक मुकदमेबाज़ी और साक्ष्य",
        summary: "Evidence collection, drafting, bail opposition, and advanced litigation strategy.",
        hi_summary: "साक्ष्य संग्रह, ड्राफ्टिंग, ज़मानत विरोध और उन्नत मुकदमेबाज़ी रणनीति।",
      },
      {
        label: "Certificate",
        hi_label: "प्रमाणपत्र",
        title: "Final GBV Training Certificate",
        hi_title: "अंतिम GBV प्रशिक्षण प्रमाणपत्र",
        summary: "Complete all modules to unlock a digitally signed certificate.",
        hi_summary: "सभी मॉड्यूल पूरे कर डिजिटल हस्ताक्षरित प्रमाणपत्र प्राप्त करें।",
      },
    ],
  },
  {
    id: "constitutional-rights",
    title: "Fundamental Rights & Directive Principles",
    hi: "मौलिक अधिकार एवं नीति निर्देशक तत्व",
    icon: "🏛",
    accent: "#1D4ED8",
    summary:
      "A constitutional literacy track that moves from Part III rights into DPSP, duties, PIL, and major Supreme Court jurisprudence.",
    hi_summary:
      "संवैधानिक साक्षरता का ऐसा ट्रैक जो भाग III के अधिकारों से DPSP, कर्तव्यों, PIL और सुप्रीम कोर्ट की प्रमुख न्यायशास्त्र तक ले जाता है।",
    tags: ["3 levels", "4 certificates", "PIL and jurisprudence"],
    hi_tags: ["3 स्तर", "4 प्रमाणपत्र", "PIL और न्यायशास्त्र"],
    href: "https://shashwat-sys.github.io/janman-training/fundamental-rights/index.html",
    levels: [
      {
        label: "Level 1",
        hi_label: "स्तर 1",
        title: "Fundamental Rights",
        hi_title: "मौलिक अधिकार",
        summary: "Articles 12–35, equality, freedom, exploitation, religion, and constitutional remedies.",
        hi_summary: "अनुच्छेद 12–35, समानता, स्वतंत्रता, शोषण-विरोध, धर्म और संवैधानिक उपचार।",
      },
      {
        label: "Level 2",
        hi_label: "स्तर 2",
        title: "DPSP & Fundamental Duties",
        hi_title: "DPSP और मौलिक कर्तव्य",
        summary: "Part IV, Article 51A, FR-DPSP balance, and social justice obligations.",
        hi_summary: "भाग IV, अनुच्छेद 51A, FR-DPSP संतुलन और सामाजिक न्याय के दायित्व।",
      },
      {
        label: "Level 3",
        hi_label: "स्तर 3",
        title: "Landmark Cases & PIL",
        hi_title: "महत्वपूर्ण मामले और PIL",
        summary: "Kesavananda, Maneka Gandhi, Minerva Mills, PIL practice, and recent constitutional developments.",
        hi_summary: "Kesavananda, Maneka Gandhi, Minerva Mills, PIL अभ्यास और हालिया संवैधानिक विकास।",
      },
      {
        label: "Certificate",
        hi_label: "प्रमाणपत्र",
        title: "Certified Constitutional Law Practitioner",
        hi_title: "प्रमाणित संवैधानिक विधि अभ्यासक",
        summary: "Complete all levels to earn the comprehensive final certificate.",
        hi_summary: "सभी स्तर पूरे कर व्यापक अंतिम प्रमाणपत्र अर्जित करें।",
      },
    ],
  },
];

export const TRAINING_LIBRARY_COURSES: TrainingCourse[] = [
  {
    id: "gbv-core",
    icon: "⚖",
    title: "Gender-Based Violence & Women's Protection Laws",
    hi: "महिला संरक्षण कानून",
    summary:
      "IPC/BNS provisions, POCSO, PWDVA, POSH Act, and Vishaka guidelines — with landmark case analysis including Bhanwari Devi, Vishaka, and Nirbhaya.",
    hi_summary:
      "फ्रंटलाइन प्रतिक्रिया और रणनीतिक वकालत के लिए IPC/BNS, PWDVA, POCSO, POSH, PCMA और महत्वपूर्ण निर्णयों का विश्लेषण।",
    audiences: ["sw", "pl", "ls", "lw"],
    keywords: ["gbv", "gender violence", "pocso", "domestic violence", "posh", "pcma"],
    levelsLabel: "3 levels",
    hi_levelsLabel: "3 स्तर",
    durationLabel: "~6 hrs",
    hi_durationLabel: "~6 घंटे",
    status: "live",
    accent: "#C2410C",
    badge: "Popular",
    hi_badge: "लोकप्रिय",
    href: "https://shashwat-sys.github.io/janman-training/gbv/index.html",
    certificate: "Certificate",
    hi_certificate: "प्रमाणपत्र",
    ctaLabel: "Start →",
  },
  {
    id: "gbv-social-worker",
    icon: "👷",
    title: "GBV for Social Workers & OSC Staff",
    hi: "सामाजिक कार्यकर्ता ट्रैक",
    summary:
      "Field-focused track on survivor support, mandatory reporting, crisis intervention, referral pathways, and multidisciplinary team coordination.",
    hi_summary:
      "पीड़ित सहयोग, अनिवार्य रिपोर्टिंग, संकट हस्तक्षेप, रेफरल और टीम समन्वय पर आधारित फील्ड-केंद्रित ट्रैक।",
    audiences: ["sw"],
    keywords: ["gbv", "social worker", "osc", "domestic violence", "first responder"],
    levelsLabel: "3 levels",
    hi_levelsLabel: "3 स्तर",
    durationLabel: "~5 hrs",
    hi_durationLabel: "~5 घंटे",
    status: "live",
    accent: "#EA580C",
    href: "https://shashwat-sys.github.io/janman-training/gbv/social-worker/index.html",
    certificate: "Certificate",
    hi_certificate: "प्रमाणपत्र",
    ctaLabel: "Start →",
  },
  {
    id: "fundamental-rights",
    icon: "🏛",
    title: "Fundamental Rights & Directive Principles",
    hi: "मौलिक अधिकार एवं नीति निर्देशक तत्व",
    summary:
      "Articles 12–35 and 36–51 with PIL strategy, constitutional remedies (Art. 32 / Art. 226), landmark writ jurisprudence and socio-economic rights.",
    hi_summary:
      "PIL रणनीति, संवैधानिक उपचार, महत्वपूर्ण रिट न्यायशास्त्र और सामाजिक-आर्थिक अधिकारों के साथ अनुच्छेद 12–35 और 36–51।",
    audiences: ["pl", "ls", "lw"],
    keywords: ["constitution", "fundamental rights", "dpsp", "article 21", "pil"],
    levelsLabel: "3 levels",
    hi_levelsLabel: "3 स्तर",
    durationLabel: "~7 hrs",
    hi_durationLabel: "~7 घंटे",
    status: "live",
    accent: "#2563EB",
    badge: "Updated",
    hi_badge: "अपडेटेड",
    href: "https://shashwat-sys.github.io/janman-training/fundamental-rights/index.html",
    certificate: "Certificate",
    hi_certificate: "प्रमाणपत्र",
    ctaLabel: "Start →",
  },
  {
    id: "child-rights-hub",
    icon: "👶",
    title: "Child Rights & Protection — Full Programme",
    hi: "बाल अधिकार एवं संरक्षण",
    summary:
      "POCSO · JJ Act · PCMA · Child Labour · RTE · 4 audience tracks · 2024 INSC 790 (child marriage) · 29 landmark cases analysed.",
    hi_summary:
      "4 अलग-अलग भूमिका-आधारित ट्रैक्स और महत्वपूर्ण मामलों के विश्लेषण के साथ POCSO, JJ Act, बाल विवाह, बाल श्रम और RTE।",
    audiences: ["sw", "pl", "ls", "lw"],
    keywords: ["child rights", "pocso", "jj act", "child marriage", "cwc", "dcpu"],
    levelsLabel: "16 Levels",
    hi_levelsLabel: "16 स्तर",
    durationLabel: "~20 hrs",
    hi_durationLabel: "~20 घंटे",
    status: "live",
    accent: "#0F766E",
    badge: "New",
    hi_badge: "नया",
    href: "https://shashwat-sys.github.io/janman-training/child-rights/index.html",
    certificate: "4 Tracks",
    hi_certificate: "प्रमाणपत्र",
    ctaLabel: "Explore →",
  },
  {
    id: "child-rights-social-worker",
    icon: "🛡",
    title: "Child Rights: Social Worker Track",
    hi: "OSC / बाल संरक्षण कार्यकर्ता",
    summary:
      "POCSO fundamentals, JJ Act procedures, CWC referrals, convergence framework, SIR/ICP documentation, and situation-wise field response grids.",
    hi_summary:
      "POCSO की बुनियाद, JJ प्रक्रियाएँ, CWC रेफरल, कन्वर्जेंस, SIR और ICP दस्तावेज़ीकरण तथा फील्ड-रिस्पॉन्स ग्रिड।",
    audiences: ["sw"],
    keywords: ["child rights", "social worker", "pocso", "cwc", "field practice"],
    levelsLabel: "3 levels",
    hi_levelsLabel: "3 स्तर",
    durationLabel: "~5 hrs",
    hi_durationLabel: "~5 घंटे",
    status: "live",
    accent: "#F97316",
    href: "https://shashwat-sys.github.io/janman-training/child-rights/social-worker/index.html",
    certificate: "Certificate",
    hi_certificate: "प्रमाणपत्र",
    ctaLabel: "Start →",
  },
  {
    id: "child-rights-plv",
    icon: "📋",
    title: "Child Rights: Paralegal Track",
    hi: "बाल अधिकार: पैरालीगल ट्रैक",
    summary:
      "Legal framework, Section 164 statements, DLSA/NALSA legal aid, SVCS compensation, RTI, NHRC complaints, Childline, and VCPC mobilisation.",
    hi_summary:
      "धारा 164 बयान, DLSA और NALSA सहायता, मुआवज़ा, RTI, NHRC शिकायत, Childline और VCPC सक्रियण।",
    audiences: ["pl"],
    keywords: ["child rights", "paralegal", "legal aid", "childline", "rti", "nhrc"],
    levelsLabel: "3 levels",
    hi_levelsLabel: "3 स्तर",
    durationLabel: "~5 hrs",
    hi_durationLabel: "~5 घंटे",
    status: "live",
    accent: "#16A34A",
    href: "https://shashwat-sys.github.io/janman-training/child-rights/paralegal/index.html",
    certificate: "Certificate",
    hi_certificate: "प्रमाणपत्र",
    ctaLabel: "Start →",
  },
  {
    id: "child-rights-law-student",
    icon: "🎓",
    title: "Child Rights: Law Student Track",
    hi: "बाल अधिकार: विधि छात्र ट्रैक",
    summary:
      "Constitutional framework (Art. 21/21A), 16 landmark cases with full analysis, PIL strategy, constitutional tort, moot scenario, and 2024 INSC 790.",
    hi_summary:
      "संवैधानिक ढांचा, महत्वपूर्ण मामले, PIL रणनीति, constitutional tort, moot scenarios और हालिया बाल-अधिकार न्यायशास्त्र।",
    audiences: ["ls"],
    keywords: ["child rights", "law student", "case law", "pil", "constitutional analysis"],
    levelsLabel: "3 levels",
    hi_levelsLabel: "3 स्तर",
    durationLabel: "~7 hrs",
    hi_durationLabel: "~7 घंटे",
    status: "live",
    accent: "#6366F1",
    badge: "New",
    hi_badge: "नया",
    href: "https://shashwat-sys.github.io/janman-training/child-rights/law-student/index.html",
    certificate: "16 Cases",
    hi_certificate: "प्रमाणपत्र",
    ctaLabel: "Start →",
  },
  {
    id: "child-rights-lawyer",
    icon: "⚖",
    title: "Child Rights: Lawyer Track",
    hi: "बाल अधिकार: अधिवक्ता ट्रैक",
    summary:
      "Full legislative framework, 29 landmark cases, bail strategy, SVCS compensation, PIL drafting, prosecution/defence trial strategy, and BNS/BNSS provisions.",
    hi_summary:
      "पूरा विधायी ढांचा, 29 महत्वपूर्ण मामले, ज़मानत रणनीति, मुआवज़ा, PIL ड्राफ्टिंग और अभियोजन-रक्षा रणनीति।",
    audiences: ["lw"],
    keywords: ["child rights", "lawyer", "bail strategy", "trial strategy", "compensation", "pil"],
    levelsLabel: "3 levels",
    hi_levelsLabel: "3 स्तर",
    durationLabel: "~8 hrs",
    hi_durationLabel: "~8 घंटे",
    status: "live",
    accent: "#BE185D",
    badge: "New",
    hi_badge: "नया",
    href: "https://shashwat-sys.github.io/janman-training/child-rights/lawyer/index.html",
    certificate: "29 Cases",
    hi_certificate: "प्रमाणपत्र",
    ctaLabel: "Start →",
  },
  {
    id: "labour-rights",
    icon: "🏗",
    title: "Labour Laws & Workers' Rights",
    hi: "श्रम कानून",
    summary:
      "BOCW Act, MGNREGS, ESIC, bonded labour, minimum wages, Contract Labour Act — for field workers and legal aid practitioners.",
    hi_summary:
      "BOCW Act, MGNREGS, ESIC, बंधुआ मज़दूरी, न्यूनतम मज़दूरी और ठेका श्रम को फील्ड तथा कानूनी सहायता के नज़रिए से समझें।",
    audiences: ["sw", "pl", "ls", "lw"],
    keywords: ["labour law", "workers rights", "mgnregs", "minimum wages", "bonded labour"],
    levelsLabel: "3+ Levels planned",
    hi_levelsLabel: "3+ स्तर नियोजित",
    durationLabel: "Coming soon",
    hi_durationLabel: "जल्द उपलब्ध",
    status: "coming_soon",
    accent: "#475569",
  },
  {
    id: "scst-atrocities",
    icon: "🛡",
    title: "SC/ST Atrocities & Caste Discrimination",
    hi: "अनुसूचित जाति/जनजाति अधिनियम",
    summary:
      "POA Act 1989, PCR Act, SC/ST Amendment 2018 — with landmark judgments, FIR registration rights, and compensation mechanisms.",
    hi_summary:
      "POA Act 1989, PCR Act, 2018 संशोधन के अधिकार, FIR पंजीकरण, महत्वपूर्ण निर्णय और मुआवज़ा तंत्र।",
    audiences: ["sw", "pl", "ls", "lw"],
    keywords: ["scst", "atrocities", "caste discrimination", "poa act", "compensation"],
    levelsLabel: "3+ Levels planned",
    hi_levelsLabel: "3+ स्तर नियोजित",
    durationLabel: "Certificate",
    hi_durationLabel: "सक्रिय ट्रैक",
    status: "live",
    accent: "#7C3AED",
    badge: "New",
    hi_badge: "नया",
    href: "https://shashwat-sys.github.io/janman-training/scst-atrocities/index.html",
    certificate: "All Tracks",
    hi_certificate: "प्रमाणपत्र",
    ctaLabel: "Start →",
  },
  {
    id: "victim-compensation",
    icon: "💰",
    title: "Victim Compensation & Rehabilitation",
    hi: "पीड़ित मुआवज़ा",
    summary:
      "NALSA SVCS, Section 357A/357B/357C CrPC/BNSS, POCSO Rules, constitutional compensation (Rudul Sah, Nilabati Behera), and DLSA claim process.",
    hi_summary:
      "SVCS, CrPC और BNSS मुआवज़ा प्रावधान, POCSO नियम, संवैधानिक मुआवज़ा और DLSA दावा प्रक्रिया।",
    audiences: ["sw", "pl", "ls", "lw"],
    keywords: ["victim compensation", "svcs", "bnss", "crpc 357a", "rehabilitation"],
    levelsLabel: "3+ Levels planned",
    hi_levelsLabel: "3+ स्तर नियोजित",
    durationLabel: "Coming soon",
    hi_durationLabel: "जल्द उपलब्ध",
    status: "coming_soon",
    accent: "#0EA5E9",
  },
  {
    id: "mental-health",
    icon: "🧠",
    title: "Mental Health & Disability Rights Law",
    hi: "मानसिक स्वास्थ्य एवं विकलांगता",
    summary:
      "MHCA 2017, RPwD Act 2016, UNCRPD, legal capacity, advance directives, and rights of persons with psychosocial disabilities.",
    hi_summary:
      "MHCA 2017, RPwD Act 2016, UNCRPD, legal capacity, advance directives और psychosocial disability rights।",
    audiences: ["sw", "pl", "ls", "lw"],
    keywords: ["mental health", "disability rights", "mhca", "rpwd", "legal capacity"],
    levelsLabel: "3+ Levels planned",
    hi_levelsLabel: "3+ स्तर नियोजित",
    durationLabel: "Coming soon",
    hi_durationLabel: "जल्द उपलब्ध",
    status: "coming_soon",
    accent: "#0D9488",
  },
  {
    id: "welfare-entitlements",
    icon: "🏠",
    title: "Social Security & Welfare Entitlements",
    hi: "सामाजिक सुरक्षा योजनाएं",
    summary:
      "PMAY, NFSA, Ayushman Bharat, IGNOAPS, PMMVY, UDID — eligibility, exclusion errors, RTI for welfare, and grievance redressal.",
    hi_summary:
      "PMAY, NFSA, Ayushman Bharat, पेंशन, PMMVY, UDID, बहिष्करण त्रुटियाँ, RTI और शिकायत निवारण।",
    audiences: ["sw", "pl"],
    keywords: ["welfare", "social security", "ration card", "ayushman", "pension", "pmay"],
    levelsLabel: "3+ Levels planned",
    hi_levelsLabel: "3+ स्तर नियोजित",
    durationLabel: "Coming soon",
    hi_durationLabel: "जल्द उपलब्ध",
    status: "coming_soon",
    accent: "#16A34A",
  },
];

export const TRAINING_LIBRARY_PATHS: TrainingLearningPath[] = [
  {
    id: "frontline-path",
    title: "Frontline & OSC Worker Path",
    hi_title: "फ्रंटलाइन और OSC कार्यकर्ता पथ",
    icon: "👷",
    summary:
      "From mandatory reporting to convergence SOPs — everything a field worker needs to protect children and women effectively.",
    hi_summary:
      "अनिवार्य रिपोर्टिंग से लेकर कन्वर्जेंस SOP तक, यह पथ बच्चों और महिलाओं की सुरक्षा में लगे फील्ड कार्यकर्ताओं का सहयोग करता है।",
    courseCount: "6 courses",
    hi_courseCount: "6 कोर्स",
    duration: "~12 hrs",
    hi_duration: "~12 घंटे",
    certificates: "2 certificates",
    hi_certificates: "2 प्रमाणपत्र",
    href: "https://shashwat-sys.github.io/janman-training/child-rights/social-worker/index.html",
    accent: "#C2410C",
  },
  {
    id: "plv-path",
    title: "Paralegal Volunteer Path",
    hi_title: "पैरालीगल स्वयंसेवक पथ",
    icon: "📋",
    summary:
      "Legal framework, complaint drafting, RTI, NALSA aid, Childline coordination — everything to be an effective community legal aid worker.",
    hi_summary:
      "शिकायत ड्राफ्टिंग, RTI, NALSA सहयोग, Childline समन्वय और सामुदायिक कानूनी सहायता को एक मार्गदर्शित यात्रा में जोड़ता है।",
    courseCount: "6 courses",
    hi_courseCount: "6 कोर्स",
    duration: "~11 hrs",
    hi_duration: "~11 घंटे",
    certificates: "2 certificates",
    hi_certificates: "2 प्रमाणपत्र",
    href: "https://shashwat-sys.github.io/janman-training/child-rights/paralegal/index.html",
    accent: "#15803D",
  },
  {
    id: "law-student-path",
    title: "Law Student Path",
    hi_title: "विधि छात्र पथ",
    icon: "🎓",
    summary:
      "Constitutional jurisprudence, landmark case analyses, PIL strategy, moot scenarios — bridge the gap between textbook law and real-world practice.",
    hi_summary:
      "संवैधानिक विश्लेषण, PIL रणनीति और महत्वपूर्ण निर्णयों के माध्यम से पाठ्यपुस्तक कानून को वास्तविक अभ्यास से जोड़ें।",
    courseCount: "5 courses",
    hi_courseCount: "5 कोर्स",
    duration: "~15 hrs",
    hi_duration: "~15 घंटे",
    certificates: "3 certificates",
    hi_certificates: "3 प्रमाणपत्र",
    href: "https://shashwat-sys.github.io/janman-training/child-rights/law-student/index.html",
    accent: "#2563EB",
  },
  {
    id: "lawyer-path",
    title: "Practising Lawyer Path",
    hi_title: "प्रैक्टिसिंग अधिवक्ता पथ",
    icon: "⚖",
    summary:
      "Deep-dive case law, trial strategy, bail jurisprudence, PIL drafting, victim compensation mechanics — for lawyers working on socio-legal matters.",
    hi_summary:
      "सामाजिक-वैधानिक मामलों को संभालने वाले अधिवक्ताओं के लिए केस लॉ, ट्रायल रणनीति, मुआवज़ा और PIL ड्राफ्टिंग की गहन पढ़ाई।",
    courseCount: "5 courses",
    hi_courseCount: "5 कोर्स",
    duration: "~16 hrs",
    hi_duration: "~16 घंटे",
    certificates: "3 certificates",
    hi_certificates: "3 प्रमाणपत्र",
    href: "https://shashwat-sys.github.io/janman-training/child-rights/lawyer/index.html",
    accent: "#9D174D",
  },
];

const OFFICIAL_RESOURCE_URLS = {
  constitution: "https://www.legislative.gov.in/constitution-of-india/",
  pocso: "https://www.indiacode.nic.in/handle/123456789/2079?view_type=browse&sam_handle=123456789/1362",
  juvenileJustice: "https://www.indiacode.nic.in/handle/123456789/2148?locale=en",
  domesticViolence: "https://www.indiacode.nic.in/handle/123456789/2023?sam_handle=123456789/1362",
  posh: "https://www.indiacode.nic.in/handle/123456789/2104?view_type=search&sam_handle=123456789/1362",
  scstAtrocities: "https://www.indiacode.nic.in/handle/123456789/1559?locale=en",
  mentalHealthcare: "https://www.indiacode.nic.in/handle/123456789/2249?locale=en",
  disability: "https://www.indiacode.nic.in/handle/123456789/2144?sam_handle=123456789/1362",
  missionShakti: "https://missionshakti.wcd.gov.in/about",
  nalsaVictimCompensation: "https://nalsa.gov.in/services/victim-compensation",
  ncpcr: "https://ncpcr.gov.in/",
  rti: "https://rtionline.gov.in/",
  pmayg: "https://pmayg.nic.in/netiayHome/home.aspx",
  nfsa: "https://nfsa.gov.in/",
  pmjay: "https://pmjay.gov.in/",
  pmmvy: "https://pmmvy.wcd.gov.in/",
  nsap: "https://nsap.nic.in/",
  udid: "https://swavlambancard.gov.in/",
  mgnrega: "https://nrega.dord.gov.in/",
  bondedLabour: "https://labour.gov.in/en/acts/bonded-labour-system-abolition-act9th-february-1976",
  esic: "https://www.esic.gov.in/",
  uncrpd: "https://www.un.org/development/desa/disabilities/convention-on-the-rights-of-persons-with-disabilities.html",
} as const;

export const TRAINING_STUDY_PACKS: Record<string, TrainingStudyPack> = {
  "gbv-core": {
    tagline:
      "A field-to-court learning pack on violence against women, survivor protection, institutional response, and strategic follow-through.",
    hi_tagline: "महिला हिंसा के मामलों में फील्ड प्रतिक्रिया, कानूनी संरक्षण और मुकदमेबाज़ी की एक गहरी अध्ययन-पुस्तिका।",
    difficulty: "Intermediate",
    hi_difficulty: "मध्यम स्तर",
    format: "Self-paced · law + procedure + drafting",
    hi_format: "स्व-गति · कानून + प्रक्रिया + ड्राफ्टिंग",
    outcomes: [
      "Map the relationship between PWDVA, POSH, POCSO, BNS sexual-offence provisions, and compensation pathways.",
      "Spot urgent protection needs, evidence risks, and referral obligations in domestic, workplace, and sexual violence matters.",
      "Prepare an action sequence for FIR, medical examination, safe shelter, protection order, and follow-up litigation.",
      "Use landmark judgments to explain why institutional accountability matters in GBV response.",
    ],
    syllabus: [
      {
        title: "Protective law architecture",
        summary: "Build the substantive legal map before discussing intervention strategy.",
        topics: [
          "PWDVA remedies: protection, residence, monetary relief, custody, and compensation",
          "POSH framework: employer duties, ICC/LCC process, timelines, and inquiry safeguards",
          "POCSO and BNS intersections when the survivor is a child or when sexual assault allegations overlap",
        ],
      },
      {
        title: "Procedure, intake, and survivor-centred response",
        summary: "Translate black-letter law into safe first response and documentation practice.",
        topics: [
          "Zero FIR, Section 164 statement planning, medical examination access, and escort responsibilities",
          "One Stop Centre, shelter, counselling, DLSA referral, and compensation intake",
          "Chronology building, document collection, and confidentiality boundaries in the first 72 hours",
        ],
      },
      {
        title: "Strategic follow-through",
        summary: "Learn how stronger documentation supports better relief and better accountability.",
        topics: [
          "Protection-order strategy, breach follow-up, and magistrate-facing narratives",
          "Internal complaints, workplace retaliation, and preserving digital evidence",
          "Compensation, rehabilitation, and coordination with social workers, police, and lawyers",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "Vishaka v State of Rajasthan (1997)",
        description: "Use this to understand why workplace sexual harassment prevention became an enforceable constitutional duty before POSH was enacted.",
      },
      {
        title: "Lalita Kumari v Government of Uttar Pradesh (2013)",
        description: "Essential for explaining mandatory FIR registration in cognisable offences and resisting police delay.",
      },
      {
        title: "Independent Thought v Union of India (2017)",
        description: "Helps explain child marriage, sexual violence, and the constitutional treatment of consent involving minors.",
      },
    ],
    fieldTools: [
      {
        title: "GBV first-response checklist",
        description: "A step order for safety, medical care, FIR, shelter, evidence protection, and legal referral.",
      },
      {
        title: "Incident chronology template",
        description: "Capture dates, threats, witnesses, prior complaints, injuries, messages, and institutional contact points.",
      },
      {
        title: "Service referral matrix",
        description: "Link OSC, hospital, police, DLSA, counsellor, shelter home, and compensation authority in one sheet.",
      },
    ],
    practiceLab: [
      {
        title: "Domestic violence action plan",
        description: "Draft a protection-order preparation note and identify what evidence is needed before the first hearing.",
      },
      {
        title: "Workplace harassment case flow",
        description: "Convert a fact pattern into an ICC complaint route, retaliation risk note, and survivor support plan.",
      },
      {
        title: "Compensation readiness memo",
        description: "Prepare the minimum document bundle needed to move from disclosure to compensation claim filing.",
      },
    ],
    officialResources: [
      {
        label: "Protection of Women from Domestic Violence Act, 2005",
        url: OFFICIAL_RESOURCE_URLS.domesticViolence,
        note: "Primary statutory text for civil protection remedies and magistrate process.",
      },
      {
        label: "POSH Act, 2013",
        url: OFFICIAL_RESOURCE_URLS.posh,
        note: "Official law for workplace sexual harassment prevention, inquiry, and employer obligations.",
      },
      {
        label: "POCSO Act, 2012",
        url: OFFICIAL_RESOURCE_URLS.pocso,
        note: "Use when allegations involve minors or mandatory reporting questions.",
      },
      {
        label: "Mission Shakti / One Stop Centre ecosystem",
        url: OFFICIAL_RESOURCE_URLS.missionShakti,
        note: "Government support architecture for crisis intervention, shelter, counselling, and convergence.",
      },
    ],
  },
  "gbv-social-worker": {
    tagline:
      "A frontline operations track for OSC staff, counsellors, social workers, and community responders handling violence disclosures.",
    hi_tagline: "OSC, सामाजिक कार्यकर्ताओं और संकट-प्रतिक्रिया कर्मियों के लिए फील्ड-केंद्रित प्रशिक्षण पथ।",
    difficulty: "Foundation to practice",
    hi_difficulty: "बुनियाद से अभ्यास",
    format: "Scenario-led · survivor support + coordination",
    hi_format: "परिस्थिति-आधारित · सहयोग + समन्वय",
    outcomes: [
      "Conduct safer first-contact conversations without collapsing legal urgency or survivor agency.",
      "Coordinate hospitals, police, shelter, compensation, and child-protection institutions where needed.",
      "Document risk, repeat violence, retaliation, and support needs in a way that helps both care and litigation.",
      "Recognise when the matter must immediately move to police, DLSA, CWC, or court.",
    ],
    syllabus: [
      {
        title: "Frontline survivor support",
        summary: "Focus on the first conversation, immediate danger, and do-no-harm documentation.",
        topics: [
          "Safety planning, emergency escalation, and accompaniment decisions",
          "Confidentiality, informed consent, and handling family pressure",
          "When psychosocial support and legal process must move together",
        ],
      },
      {
        title: "Documentation and referral",
        summary: "Turn field observations into usable records for service delivery and legal aid.",
        topics: [
          "Intake note writing, risk flags, injury references, and witness mapping",
          "OSC referral structure, DLSA coordination, and compensation intake preparation",
          "Mandatory reporting when child abuse or severe sexual violence is disclosed",
        ],
      },
      {
        title: "Case conferencing and follow-up",
        summary: "Strengthen the ability to manage repeat interactions over time.",
        topics: [
          "Review meetings with police, lawyers, counsellors, and family stakeholders",
          "Tracking missed appointments, intimidation, and economic dependence",
          "Creating a recovery and follow-up plan beyond the first crisis",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "Lalita Kumari v Government of Uttar Pradesh (2013)",
        description: "Helps social workers insist on mandatory FIR registration when the police hesitate.",
      },
      {
        title: "Vishaka v State of Rajasthan (1997)",
        description: "Useful when supporting women facing workplace harassment and institutional silence.",
      },
      {
        title: "Independent Thought v Union of India (2017)",
        description: "Important for social workers handling abuse and marriage-related violence affecting minors.",
      },
    ],
    fieldTools: [
      {
        title: "72-hour crisis grid",
        description: "A time-bound matrix for safety, medical access, statement planning, and legal service connection.",
      },
      {
        title: "Consent and confidentiality prompt sheet",
        description: "Short prompts to guide disclosure recording without over-questioning survivors.",
      },
      {
        title: "Multi-agency follow-up log",
        description: "Track whether police, hospital, shelter, DLSA, and compensation follow-up actually happened.",
      },
    ],
    practiceLab: [
      {
        title: "OSC intake simulation",
        description: "Respond to a domestic violence disclosure with immediate safety planning and referral routing.",
      },
      {
        title: "Child survivor escalation drill",
        description: "Identify mandatory-reporting triggers and map the correct child-protection route in under 15 minutes.",
      },
      {
        title: "Repeat-violence review",
        description: "Use a chronology to detect escalating coercion and decide when the response plan must change.",
      },
    ],
    officialResources: [
      {
        label: "Mission Shakti / OSC framework",
        url: OFFICIAL_RESOURCE_URLS.missionShakti,
        note: "Official architecture for One Stop Centres and women-support convergence.",
      },
      {
        label: "Protection of Women from Domestic Violence Act, 2005",
        url: OFFICIAL_RESOURCE_URLS.domesticViolence,
        note: "Key for residence, protection, monetary relief, and protection-officer coordination.",
      },
      {
        label: "POCSO Act, 2012",
        url: OFFICIAL_RESOURCE_URLS.pocso,
        note: "Mandatory when the survivor is a child or when reporting duties are triggered.",
      },
      {
        label: "National Legal Services Authority victim compensation resources",
        url: OFFICIAL_RESOURCE_URLS.nalsaVictimCompensation,
        note: "Useful when relief, interim compensation, or rehabilitation funding is needed.",
      },
    ],
  },
  "fundamental-rights": {
    tagline:
      "A jurisprudence-heavy constitutional track for rights literacy, issue spotting, writ strategy, and PIL-oriented public law thinking.",
    hi_tagline: "अधिकार-पहचान, रिट रणनीति और PIL सोच विकसित करने वाला एक गहन संवैधानिक ट्रैक।",
    difficulty: "Theory plus application",
    hi_difficulty: "सिद्धांत + अनुप्रयोग",
    format: "Concepts · case law · problem-solving",
    hi_format: "अवधारणा · केस लॉ · समस्या-समाधान",
    outcomes: [
      "Distinguish core Fundamental Rights, Directive Principles, and constitutional remedies without flattening them into slogans.",
      "Identify which facts raise equality, liberty, dignity, livelihood, speech, religion, or remedy questions.",
      "Use landmark Supreme Court decisions to explain how Article 21 and related rights evolved.",
      "Select a suitable public-law response: representation, RTI, Article 226 writ, Article 32 petition, or PIL support work.",
    ],
    syllabus: [
      {
        title: "Rights architecture",
        summary: "Ground yourself in Part III before moving into remedies and public-interest litigation.",
        topics: [
          "Articles 12 to 21A, anti-discrimination, freedoms, and constitutional limitations",
          "Article 32 and Article 226 as enforceable remedy structures",
          "Horizontal effects of rights through workplace safety, education, and dignity jurisprudence",
        ],
      },
      {
        title: "DPSP, duties, and social justice",
        summary: "Understand why Part IV still shapes welfare, labour, education, and governance obligations.",
        topics: [
          "Directive Principles and their interaction with enforceable rights",
          "Fundamental Duties and how courts use them in public reasoning",
          "Welfare governance, education, health, environment, and affirmative obligations",
        ],
      },
      {
        title: "Writs and constitutional strategy",
        summary: "Turn legal theory into action pathways for real-world facts.",
        topics: [
          "Habeas corpus, mandamus, certiorari, prohibition, and quo warranto in practical terms",
          "When to pursue PIL versus direct rights litigation or administrative grievance",
          "Building a rights memo from facts, documents, institutional record, and harm narrative",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "Kesavananda Bharati v State of Kerala (1973)",
        description: "Introduces the basic-structure doctrine and the limits of constitutional amendment power.",
      },
      {
        title: "Maneka Gandhi v Union of India (1978)",
        description: "Central for understanding due process, fairness, and the expansion of Article 21.",
      },
      {
        title: "Olga Tellis v Bombay Municipal Corporation (1985)",
        description: "Useful for linking dignity, livelihood, and state action in rights-based advocacy.",
      },
      {
        title: "Navtej Singh Johar v Union of India (2018)",
        description: "Explains equality, privacy, dignity, and the constitutional language of autonomy.",
      },
    ],
    fieldTools: [
      {
        title: "Rights issue-spotting grid",
        description: "A one-page way to test whether a fact pattern raises equality, liberty, or remedy questions.",
      },
      {
        title: "Writ selection matrix",
        description: "Choose the likely writ route based on detention, inaction, illegal order, or public duty failure.",
      },
      {
        title: "PIL readiness checklist",
        description: "Assess whether the issue has collective impact, documentary grounding, and a viable relief structure.",
      },
    ],
    practiceLab: [
      {
        title: "Convert a grievance into a rights memo",
        description: "Take a welfare denial or police inaction fact pattern and identify the constitutional hooks.",
      },
      {
        title: "Draft an Article 226 skeleton",
        description: "Prepare the core sections of a writ petition without over-claiming facts or relief.",
      },
      {
        title: "Compare rights and policy arguments",
        description: "Practice distinguishing enforceable rights claims from programme or policy advocacy claims.",
      },
    ],
    officialResources: [
      {
        label: "Constitution of India",
        url: OFFICIAL_RESOURCE_URLS.constitution,
        note: "Authoritative constitutional text for Part III, Part IV, and remedies.",
      },
      {
        label: "Right to Information online portal",
        url: OFFICIAL_RESOURCE_URLS.rti,
        note: "Practical transparency tool for building documentary record before public-law action.",
      },
      {
        label: "National Legal Services Authority",
        url: "https://nalsa.gov.in/",
        note: "Useful for understanding legal aid architecture when rights violations need representation.",
      },
      {
        label: "Supreme Court of India",
        url: "https://www.sci.gov.in/",
        note: "Use for official cause lists, judgments access points, and constitutional case tracking.",
      },
    ],
  },
  "child-rights-hub": {
    tagline:
      "A full child-rights programme that combines doctrine, institutions, field workflow, and role-based specialisation across four learner tracks.",
    hi_tagline: "चार भूमिका-आधारित सीखने के पथों वाला संपूर्ण बाल-अधिकार कार्यक्रम।",
    difficulty: "Progressive multi-track programme",
    hi_difficulty: "क्रमबद्ध बहु-ट्रैक कार्यक्रम",
    format: "Track-based · law + institutions + field action",
    hi_format: "ट्रैक-आधारित · कानून + संस्थान + फील्ड कार्य",
    outcomes: [
      "Understand how POCSO, JJ, RTE, child marriage protections, and legal aid systems fit together.",
      "Navigate CWC, JJB, DCPU, police, hospital, DLSA, and community-level child protection roles.",
      "Choose the right specialist pathway for social work, paralegal practice, law school analysis, or litigation.",
      "Move from legal text to real child-protection response with better documentation and escalation decisions.",
    ],
    syllabus: [
      {
        title: "Core child-rights legal framework",
        summary: "Build a common foundation before branching into specialised tracks.",
        topics: [
          "POCSO, Juvenile Justice, child marriage, education, child labour, and victim support touchpoints",
          "Mandatory reporting, child-friendly procedure, and best-interest reasoning",
          "Why child-rights matters require both procedural speed and institutional coordination",
        ],
      },
      {
        title: "Institutions and pathways",
        summary: "Learn who does what when a child is abused, abandoned, trafficked, married, or denied services.",
        topics: [
          "CWC, JJB, DCPU, SJPU, hospital, shelter, and DLSA coordination",
          "Role of NCPCR and state commissions in monitoring and complaint escalation",
          "Compensation, rehabilitation, restoration, and family-based follow-up",
        ],
      },
      {
        title: "Role-based specialisation",
        summary: "Move into the audience-specific track that matches your real work.",
        topics: [
          "Social worker track: case management, convergence, and field planning",
          "Paralegal track: complaints, RTI, legal aid, compensation, and community mobilisation",
          "Law student and lawyer tracks: constitutional analysis, case law, drafting, and strategy",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "Sampurna Behura v Union of India (2018)",
        description: "Important for understanding Supreme Court supervision over child-care institutions and JJ implementation.",
      },
      {
        title: "Sheela Barse v Union of India",
        description: "Useful for child custody, protection, and institutional safeguards in state care settings.",
      },
      {
        title: "Independent Thought v Union of India (2017)",
        description: "Critical for child marriage and sexual violence interpretation affecting minors.",
      },
    ],
    fieldTools: [
      {
        title: "Child-protection pathway map",
        description: "Shows which institution to approach first in sexual abuse, neglect, child marriage, or conflict-with-law situations.",
      },
      {
        title: "Best-interest assessment prompts",
        description: "Keeps the learner focused on safety, restoration, education, family context, and long-term welfare.",
      },
      {
        title: "Child case document tracker",
        description: "Track FIR, 164 statement, medical papers, CWC orders, DLSA referrals, and compensation papers together.",
      },
    ],
    practiceLab: [
      {
        title: "Choose the correct track",
        description: "Read a fact pattern and decide whether the next step is field support, legal aid, constitutional analysis, or litigation.",
      },
      {
        title: "Institutional response drill",
        description: "Work through a scenario involving police, hospital, CWC, and DLSA to test your sequence planning.",
      },
      {
        title: "Child-rights case conference",
        description: "Run a multi-stakeholder review note that balances legal urgency with child-friendly procedure.",
      },
    ],
    officialResources: [
      {
        label: "POCSO Act, 2012",
        url: OFFICIAL_RESOURCE_URLS.pocso,
        note: "Primary child sexual abuse law with reporting and trial-protection architecture.",
      },
      {
        label: "Juvenile Justice Act, 2015",
        url: OFFICIAL_RESOURCE_URLS.juvenileJustice,
        note: "Core statute for children in need of care and protection and children in conflict with law.",
      },
      {
        label: "National Commission for Protection of Child Rights",
        url: OFFICIAL_RESOURCE_URLS.ncpcr,
        note: "Official child-rights oversight and complaint institution.",
      },
      {
        label: "Mission Shakti / support services",
        url: OFFICIAL_RESOURCE_URLS.missionShakti,
        note: "Useful for convergence, crisis services, and cross-referral in child-protection matters.",
      },
    ],
  },
  "child-rights-social-worker": {
    tagline:
      "A practice-heavy child-protection track for social workers, counsellors, OSC teams, and frontline responders.",
    hi_tagline: "बाल संरक्षण में काम करने वाले सामाजिक कार्यकर्ताओं और फ्रंटलाइन कर्मियों के लिए व्यावहारिक ट्रैक।",
    difficulty: "Field practice",
    hi_difficulty: "फील्ड अभ्यास",
    format: "Response workflow · documentation · convergence",
    hi_format: "प्रतिक्रिया-कार्यप्रवाह · दस्तावेज़ीकरण · कन्वर्जेंस",
    outcomes: [
      "Respond more safely to disclosures of child sexual abuse, neglect, abandonment, and harmful family pressure.",
      "Coordinate police, hospital, CWC, DCPU, shelter, and DLSA without losing track of the child’s best interests.",
      "Use field documentation like SIR, ICP, and case notes in a purposeful way rather than as paperwork alone.",
      "Recognise when immediate escalation is necessary and when follow-up planning must stay child-centred.",
    ],
    syllabus: [
      {
        title: "POCSO and JJ foundations for social workers",
        summary: "Learn only the law that is essential for better child-protection decisions in the field.",
        topics: [
          "Mandatory reporting, child-friendly support, and early evidence concerns",
          "Children in need of care and protection under JJ structures",
          "Why case management must combine legal, psychosocial, and safety planning",
        ],
      },
      {
        title: "Convergence and documentation",
        summary: "Use institutional coordination and written records to improve continuity of care.",
        topics: [
          "CWC referral logic, DCPU coordination, and shelter placement questions",
          "SIR, ICP, case diary notes, and restoration planning",
          "Medical follow-up, school continuity, and family-risk review",
        ],
      },
      {
        title: "Field scenarios and response grids",
        summary: "Prepare for what actually happens in households, villages, hospitals, and police stations.",
        topics: [
          "Handling child marriage risk, sexual abuse disclosure, and repeated family pressure",
          "Supporting children through statements, hearings, and institutional contact",
          "Transition planning after immediate rescue or intervention",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "Sampurna Behura v Union of India (2018)",
        description: "Important for understanding how child-care institutions and JJ implementation are judicially monitored.",
      },
      {
        title: "Sheela Barse v Union of India",
        description: "Useful for minimum safeguards when children are in state systems or institutional settings.",
      },
      {
        title: "Lalita Kumari v Government of Uttar Pradesh (2013)",
        description: "Helps social workers insist on formal complaint registration in abuse matters.",
      },
    ],
    fieldTools: [
      {
        title: "Child disclosure support checklist",
        description: "Short cues for safe listening, immediate risk assessment, and next-contact planning.",
      },
      {
        title: "SIR / ICP preparation sheet",
        description: "A practical guide to what information actually matters in social-investigation and care plans.",
      },
      {
        title: "Convergence call sheet",
        description: "One-page tracker for police, hospital, CWC, DCPU, shelter, and DLSA coordination.",
      },
    ],
    practiceLab: [
      {
        title: "Child marriage prevention response",
        description: "Work through early warning signals, emergency intervention, and family negotiation risks.",
      },
      {
        title: "Statement-day support plan",
        description: "Prepare a child-friendly support and logistics plan for medical examination or statement recording day.",
      },
      {
        title: "Restoration review note",
        description: "Draft a follow-up note assessing whether reunification or longer-term support is safe.",
      },
    ],
    officialResources: [
      {
        label: "POCSO Act, 2012",
        url: OFFICIAL_RESOURCE_URLS.pocso,
        note: "Use for reporting, child-friendly procedure, and offence categories.",
      },
      {
        label: "Juvenile Justice Act, 2015",
        url: OFFICIAL_RESOURCE_URLS.juvenileJustice,
        note: "Core law for child-care institutions, CWC process, and care-and-protection decisions.",
      },
      {
        label: "NCPCR",
        url: OFFICIAL_RESOURCE_URLS.ncpcr,
        note: "Complaint and oversight institution relevant to child-rights monitoring.",
      },
      {
        label: "Mission Shakti support ecosystem",
        url: OFFICIAL_RESOURCE_URLS.missionShakti,
        note: "Useful for convergence with counselling and support services where needed.",
      },
    ],
  },
  "child-rights-plv": {
    tagline:
      "A community legal-aid track on child-rights complaints, legal aid routing, compensation, RTI, and local mobilisation.",
    hi_tagline: "बाल अधिकार मामलों में शिकायत, कानूनी सहायता, मुआवज़ा और सामुदायिक कार्रवाई पर केंद्रित PLV ट्रैक।",
    difficulty: "Applied community legal aid",
    hi_difficulty: "प्रायोगिक सामुदायिक कानूनी सहायता",
    format: "Complaints · institutions · follow-up",
    hi_format: "शिकायत · संस्थान · फॉलो-अप",
    outcomes: [
      "Identify when a child-rights issue should move as a police complaint, CWC approach, legal aid request, or community mobilisation problem.",
      "Support families with DLSA/NALSA processes, compensation pathways, and documentation readiness.",
      "Use RTI and written representation strategically when institutions stay inactive.",
      "Translate complex child-protection law into steps a community member can actually follow.",
    ],
    syllabus: [
      {
        title: "Legal framework and complaint routes",
        summary: "Build enough substantive law to choose the right complaint structure.",
        topics: [
          "POCSO, JJ, child marriage, and basic victim-protection architecture",
          "FIR, 164 statement, medical evidence, and child-friendly procedure from the PLV perspective",
          "Understanding the role of CWC, DLSA, and state institutions in child matters",
        ],
      },
      {
        title: "Legal aid, compensation, and RTI",
        summary: "Learn the institutional levers that PLVs can actually activate.",
        topics: [
          "DLSA and NALSA pathways, victim compensation basics, and document preparation",
          "Using RTI for police inaction, missing records, or scheme delays",
          "Building a paper trail that strengthens the child’s case without overstepping legal role boundaries",
        ],
      },
      {
        title: "Community action and follow-up",
        summary: "Make the PLV role practical at village and ward level.",
        topics: [
          "VCPC or community-meeting mobilisation and referral awareness",
          "Tracking whether institutions responded after the first complaint",
          "Balancing family dynamics, confidentiality, and child safety in repeated follow-up",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "Lalita Kumari v Government of Uttar Pradesh (2013)",
        description: "Use this when police refuse to register a complaint in a cognisable child-abuse matter.",
      },
      {
        title: "Sampurna Behura v Union of India (2018)",
        description: "Helps PLVs understand the seriousness of institutional child-protection compliance.",
      },
      {
        title: "Independent Thought v Union of India (2017)",
        description: "Important for explaining child marriage and sexual violence implications in community settings.",
      },
    ],
    fieldTools: [
      {
        title: "PLV child-rights complaint template",
        description: "A simple structure for writing a complaint, attaching facts, and listing requested action.",
      },
      {
        title: "Compensation and legal-aid checklist",
        description: "Track FIR, medical papers, child identity documents, bank details, and DLSA contact points.",
      },
      {
        title: "RTI escalation worksheet",
        description: "Frame targeted questions when records, progress reports, or institutional action remain unclear.",
      },
    ],
    practiceLab: [
      {
        title: "Village complaint drafting exercise",
        description: "Prepare a child-abuse complaint note with facts, urgency markers, and immediate relief asks.",
      },
      {
        title: "DLSA referral simulation",
        description: "Draft the information a PLV should carry when linking a family to legal services.",
      },
      {
        title: "Institutional follow-up plan",
        description: "Create a 30-day escalation plan covering police, CWC, DLSA, and community accountability points.",
      },
    ],
    officialResources: [
      {
        label: "POCSO Act, 2012",
        url: OFFICIAL_RESOURCE_URLS.pocso,
        note: "Core legal source for sexual abuse offences and child-friendly process.",
      },
      {
        label: "Juvenile Justice Act, 2015",
        url: OFFICIAL_RESOURCE_URLS.juvenileJustice,
        note: "Needed for CWC, care and protection, and institution-related issues.",
      },
      {
        label: "NALSA victim compensation resources",
        url: OFFICIAL_RESOURCE_URLS.nalsaVictimCompensation,
        note: "Practical entry point for compensation-oriented legal aid work.",
      },
      {
        label: "RTI online portal",
        url: OFFICIAL_RESOURCE_URLS.rti,
        note: "Use for accountability follow-up where state action is missing or unclear.",
      },
    ],
  },
  "child-rights-law-student": {
    tagline:
      "A doctrinal and jurisprudential track that connects child-rights law to constitutional reasoning, PIL strategy, and case analysis practice.",
    hi_tagline: "संवैधानिक विश्लेषण, केस लॉ और PIL रणनीति से जुड़ा बाल-अधिकार विधि छात्र ट्रैक।",
    difficulty: "Academic plus applied",
    hi_difficulty: "शैक्षणिक + अनुप्रयुक्त",
    format: "Case analysis · doctrine · writing",
    hi_format: "केस विश्लेषण · सिद्धांत · लेखन",
    outcomes: [
      "Read child-rights disputes through constitutional guarantees of dignity, education, equality, and liberty.",
      "Move beyond summary to case analysis: facts, issue, holding, reasoning, and impact.",
      "Understand how PIL, compensation, and institutional reform arguments appear in child-rights litigation.",
      "Build stronger moot, memo, and research outputs grounded in current child-rights jurisprudence.",
    ],
    syllabus: [
      {
        title: "Constitutional framework for child rights",
        summary: "Anchor specialised statutes inside larger constitutional reasoning.",
        topics: [
          "Articles 14, 15(3), 21, 21A, 23, 24, and the social-justice frame",
          "Best interest, vulnerability, and the state’s positive obligations",
          "How child-rights law interacts with gender, labour, caste, and education questions",
        ],
      },
      {
        title: "Case-law analysis",
        summary: "Treat judgments as structured learning objects rather than memorisation items.",
        topics: [
          "Reading holdings carefully and identifying the exact legal proposition",
          "Comparing statutory interpretation with constitutional reasoning",
          "Following how one child-rights case influences institutions and later litigation",
        ],
      },
      {
        title: "PIL and research practice",
        summary: "Turn doctrinal understanding into legal writing and advocacy support.",
        topics: [
          "Research stacks for child-rights memos and seminar papers",
          "Moot and PIL fact framing for education, abuse, custody, and institutional neglect issues",
          "Compensation, state accountability, and systemic-reform arguments",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "Sampurna Behura v Union of India (2018)",
        description: "A core case on judicial monitoring of JJ implementation and child-care institutions.",
      },
      {
        title: "Independent Thought v Union of India (2017)",
        description: "Important for examining statutory interpretation, consent, and constitutional protection for minors.",
      },
      {
        title: "Society for Unaided Private Schools v Union of India (2012)",
        description: "Useful for understanding the RTE framework and the constitutional debate around educational obligations.",
      },
    ],
    fieldTools: [
      {
        title: "Case-brief template",
        description: "Organise facts, legal issue, ratio, key passages, and long-term significance in one format.",
      },
      {
        title: "Constitutional issue map",
        description: "Tag each child-rights problem with the fundamental-rights and statutory hooks it raises.",
      },
      {
        title: "Research trail sheet",
        description: "Track statutes, case law, commission reports, and procedural questions for assignments or clinics.",
      },
    ],
    practiceLab: [
      {
        title: "Prepare a case note",
        description: "Write a short note on a child-rights decision using facts, issue, reasoning, and critique.",
      },
      {
        title: "Design a PIL concept note",
        description: "Frame reliefs, maintainability, evidence base, and public-interest narrative for a systemic child-rights problem.",
      },
      {
        title: "Moot proposition drill",
        description: "Argue both sides of a child-protection or education dispute to sharpen doctrinal command.",
      },
    ],
    officialResources: [
      {
        label: "Constitution of India",
        url: OFFICIAL_RESOURCE_URLS.constitution,
        note: "Foundational source for rights and remedies used in child-rights reasoning.",
      },
      {
        label: "POCSO Act, 2012",
        url: OFFICIAL_RESOURCE_URLS.pocso,
        note: "Required to understand offence structure and child-friendly procedure.",
      },
      {
        label: "Juvenile Justice Act, 2015",
        url: OFFICIAL_RESOURCE_URLS.juvenileJustice,
        note: "Key to care-and-protection and institutional child-rights analysis.",
      },
      {
        label: "NCPCR",
        url: OFFICIAL_RESOURCE_URLS.ncpcr,
        note: "Helpful for policy context, complaint pathways, and institutional material.",
      },
    ],
  },
  "child-rights-lawyer": {
    tagline:
      "A litigation-oriented child-rights course for practitioners handling bail, trial strategy, compensation, institutional accountability, and writ work.",
    hi_tagline: "बाल-अधिकार मुकदमों में ज़मानत, ट्रायल रणनीति, मुआवज़ा और रिट कार्य पर केंद्रित अधिवक्ता ट्रैक।",
    difficulty: "Advanced practice",
    hi_difficulty: "उन्नत अभ्यास",
    format: "Strategy · case law · drafting",
    hi_format: "रणनीति · केस लॉ · ड्राफ्टिंग",
    outcomes: [
      "Use child-rights statutes together with constitutional and compensation remedies in litigation strategy.",
      "Prepare stronger arguments on bail, investigation gaps, child-friendly procedure, and institutional liability.",
      "Structure case preparation around documentary discipline, witness vulnerability, and compensation timing.",
      "Connect trial-level work with broader reform tools such as writs and PIL where needed.",
    ],
    syllabus: [
      {
        title: "Substantive and procedural foundations",
        summary: "Refresh the legal architecture that underpins child-rights litigation.",
        topics: [
          "POCSO offence structure, JJ mechanisms, and related BNS/BNSS procedural interfaces",
          "Investigation failures, hostile environments, and documentary gaps that affect outcome quality",
          "Victim compensation and interim relief as live components of case strategy",
        ],
      },
      {
        title: "Trial and bail strategy",
        summary: "Move from knowing the law to planning a persuasive litigation sequence.",
        topics: [
          "Bail opposition themes, vulnerability framing, and safeguarding the child’s testimony environment",
          "Cross-examination risk, corroboration questions, and institutional records",
          "Using commissions, hospital records, CWC material, and expert inputs strategically",
        ],
      },
      {
        title: "Writs, reform, and accountability",
        summary: "See where trial strategy ends and public-law intervention begins.",
        topics: [
          "Compensation delay, investigation failure, and state inaction as writ triggers",
          "Drafting themes for child-rights PIL or systemic-reform petitions",
          "Linking individual litigation to institutional compliance problems",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "Independent Thought v Union of India (2017)",
        description: "Important for marriage, age, consent, and statutory interpretation in child sexual-offence matters.",
      },
      {
        title: "Sampurna Behura v Union of India (2018)",
        description: "Shows how systemic child-rights failures can move into ongoing judicial supervision.",
      },
      {
        title: "Eera v State (NCT of Delhi) (2017)",
        description: "Useful for careful statutory interpretation under POCSO and the boundaries of offence definitions.",
      },
    ],
    fieldTools: [
      {
        title: "Child-rights litigation file map",
        description: "Track FIR, medicals, 164 statement, CWC records, school records, DLSA documents, and compensation papers.",
      },
      {
        title: "Bail-opposition checklist",
        description: "A structured set of vulnerability, intimidation, and evidentiary factors to review before hearing.",
      },
      {
        title: "Compensation timing note",
        description: "Decide when to push interim relief, final compensation, or rehabilitation support during case progress.",
      },
    ],
    practiceLab: [
      {
        title: "Draft a child-rights hearing note",
        description: "Prepare the facts, procedural posture, and relief strategy for the next crucial court date.",
      },
      {
        title: "Build a compensation application brief",
        description: "Assemble the records and narrative needed to move compensation alongside prosecution.",
      },
      {
        title: "Outline a writ strategy",
        description: "Frame a public-law response where investigation, institutional care, or rehabilitation has failed.",
      },
    ],
    officialResources: [
      {
        label: "POCSO Act, 2012",
        url: OFFICIAL_RESOURCE_URLS.pocso,
        note: "Core child sexual-offence framework for litigation and procedure.",
      },
      {
        label: "Juvenile Justice Act, 2015",
        url: OFFICIAL_RESOURCE_URLS.juvenileJustice,
        note: "Important for institutional child-care and care-and-protection litigation.",
      },
      {
        label: "NALSA victim compensation resources",
        url: OFFICIAL_RESOURCE_URLS.nalsaVictimCompensation,
        note: "Supports compensation strategy during prosecution and rehabilitation work.",
      },
      {
        label: "Constitution of India",
        url: OFFICIAL_RESOURCE_URLS.constitution,
        note: "Needed when litigation moves into writ or public-law terrain.",
      },
    ],
  },
  "labour-rights": {
    tagline:
      "A preparatory labour-rights stack on wage justice, public employment, construction welfare, bonded labour, and social-security access.",
    hi_tagline: "मज़दूरी, मनरेगा, निर्माण मज़दूर अधिकार, बंधुआ श्रम और सामाजिक सुरक्षा पर आधारित श्रम-अधिकार अध्ययन पथ।",
    difficulty: "Preview syllabus",
    hi_difficulty: "पूर्वावलोकन पाठ्यक्रम",
    format: "Policy + field rights + grievance pathways",
    hi_format: "नीति + फील्ड अधिकार + शिकायत मार्ग",
    outcomes: [
      "Understand the main legal buckets affecting precarious workers in rural and informal labour settings.",
      "Spot labour-rights issues that need wage claims, registration drives, rescue interventions, or welfare-portability support.",
      "Connect labour rights to caste, migration, public employment, and social-security exclusion.",
    ],
    syllabus: [
      {
        title: "Wages, registration, and employment guarantees",
        summary: "Map where labour precarity begins at the level of wages, records, and public employment.",
        topics: [
          "MGNREGA entitlements, wage delays, muster rolls, and payment tracking",
          "Minimum wages, construction worker registration, and portability issues",
          "Social-security entry points for informal and migrant workers",
        ],
      },
      {
        title: "Forced and exploitative labour conditions",
        summary: "Recognise coercion, debt bondage, and labour control that often stay hidden in local practice.",
        topics: [
          "Bonded labour indicators and rescue pathways",
          "Child labour and unsafe work intersections",
          "Contracting chains, middlemen, and evidence in labour exploitation complaints",
        ],
      },
      {
        title: "Claims, grievance, and field strategy",
        summary: "Learn how labour-rights support work becomes actionable.",
        topics: [
          "Representations, labour-department complaints, and record collection",
          "When public-law litigation or fact-finding becomes necessary",
          "Using worker groups and community structures for collective follow-up",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "People's Union for Democratic Rights v Union of India (1982)",
        description: "A key case on labour exploitation, minimum wages, and constitutional enforcement in work settings.",
      },
      {
        title: "Bandhua Mukti Morcha v Union of India (1984)",
        description: "Essential for understanding bonded labour, state obligations, and rights-based intervention.",
      },
      {
        title: "Sanjit Roy v State of Rajasthan (1983)",
        description: "Useful for public employment and wage-rights reasoning in relief work contexts.",
      },
    ],
    fieldTools: [
      {
        title: "Worker entitlement checklist",
        description: "Track registration, wage slips, bank payments, ID documents, and scheme access.",
      },
      {
        title: "Bonded-labour risk screen",
        description: "A prompt sheet for debt, coercion, confinement, withholding, and movement restrictions.",
      },
      {
        title: "Collective grievance register",
        description: "Organise recurring wage or job-card issues affecting multiple workers together.",
      },
    ],
    practiceLab: [
      {
        title: "MGNREGA delay investigation",
        description: "Plan how to gather muster-roll, payment, and worksite evidence before escalation.",
      },
      {
        title: "Rescue and referral drill",
        description: "Map the immediate steps if signs of bonded labour or hazardous child work emerge.",
      },
      {
        title: "Welfare access note",
        description: "Build a follow-up plan for a worker denied registration or benefit portability.",
      },
    ],
    officialResources: [
      {
        label: "MGNREGA official portal",
        url: OFFICIAL_RESOURCE_URLS.mgnrega,
        note: "Use for programme structure, records, and worker-facing public-employment information.",
      },
      {
        label: "Bonded Labour System (Abolition) Act resources",
        url: OFFICIAL_RESOURCE_URLS.bondedLabour,
        note: "Official labour-ministry entry point for bonded-labour legal material.",
      },
      {
        label: "ESIC portal",
        url: OFFICIAL_RESOURCE_URLS.esic,
        note: "Helpful for social-security orientation where formal-sector or contributory rights apply.",
      },
      {
        label: "Ministry of Labour and Employment",
        url: "https://labour.gov.in/",
        note: "Institutional home for labour laws, notifications, and administrative guidance.",
      },
    ],
  },
  "scst-atrocities": {
    tagline:
      "A caste-justice training pack on atrocity law, FIR enforcement, compensation, social boycott, land dispossession, and litigation strategy.",
    hi_tagline: "अत्याचार कानून, FIR, मुआवज़ा, सामाजिक बहिष्कार और भूमि कब्ज़े पर केंद्रित जाति-न्याय प्रशिक्षण।",
    difficulty: "Intermediate to advanced",
    hi_difficulty: "मध्यम से उन्नत",
    format: "Law + rights enforcement + case strategy",
    hi_format: "कानून + अधिकार प्रवर्तन + केस रणनीति",
    outcomes: [
      "Understand the SC/ST Act, PCR Act, and how atrocity law differs from general criminal law.",
      "Identify when caste violence, insult, exclusion, boycott, or dispossession should trigger atrocity-law protections.",
      "Use FIR, compensation, witness protection, and special-court structures more strategically.",
      "Read key Supreme Court cases that shaped anticipatory bail, investigation, and enforcement controversies.",
    ],
    syllabus: [
      {
        title: "Legal architecture of anti-atrocity protections",
        summary: "Ground the learner in substantive and procedural caste-protection law.",
        topics: [
          "SC/ST Act, PCR Act, protected communities, and enumerated acts of violence and humiliation",
          "Land dispossession, social boycott, and caste-based public insult as legal categories",
          "Special courts, investigation norms, and the place of the DSP and district administration",
        ],
      },
      {
        title: "FIR, compensation, and witness protection",
        summary: "Turn the law into enforceable immediate steps after an atrocity.",
        topics: [
          "Mandatory registration, escalation for refusal, and documentation of caste nexus",
          "State compensation structures, interim relief, and rehabilitation concerns",
          "Witness intimidation, safety, and follow-up with legal aid or support institutions",
        ],
      },
      {
        title: "Litigation and systemic response",
        summary: "See where individual cases and larger anti-caste accountability work meet.",
        topics: [
          "Anticipatory-bail debates, investigation quality, and use of special courts",
          "Land-rights, administrative inaction, and possible writ or civil follow-up",
          "Community mobilisation, fact-finding, and complaint escalation beyond the first FIR",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "Prithvi Raj Chauhan v Union of India (2020)",
        description: "Important for understanding the continuing force of the SC/ST Act after the 2018 amendment disputes.",
      },
      {
        title: "Subhash Kashinath Mahajan v State of Maharashtra (2018)",
        description: "Useful for explaining why procedural dilution debates became so significant in atrocity-law enforcement.",
      },
      {
        title: "State of Madhya Pradesh v Ram Krishna Balothia (1995)",
        description: "A foundational case on the constitutional treatment of atrocity-law safeguards.",
      },
    ],
    fieldTools: [
      {
        title: "Atrocity FIR fact sheet",
        description: "Record caste identity, abuse language, place, witnesses, injuries, land details, and prior threats in one note.",
      },
      {
        title: "Compensation and relief tracker",
        description: "Track FIR, caste certificate, medical records, bank details, and district-level relief processing.",
      },
      {
        title: "Land dispossession evidence grid",
        description: "Capture possession history, revenue papers, coercion details, and community intimidation patterns.",
      },
    ],
    practiceLab: [
      {
        title: "Refused-FIR escalation exercise",
        description: "Prepare the next procedural step if the local police refuse or dilute the complaint.",
      },
      {
        title: "Compensation file preparation",
        description: "Assemble the minimum records required to push for relief and rehabilitation.",
      },
      {
        title: "Land-rights case conference",
        description: "Plan combined criminal, revenue, and legal-aid strategy where caste and land dispossession overlap.",
      },
    ],
    officialResources: [
      {
        label: "SC/ST (Prevention of Atrocities) Act, 1989",
        url: OFFICIAL_RESOURCE_URLS.scstAtrocities,
        note: "Primary anti-atrocity statute and the core text for offences and safeguards.",
      },
      {
        label: "National Legal Services Authority victim compensation resources",
        url: OFFICIAL_RESOURCE_URLS.nalsaVictimCompensation,
        note: "Helpful where atrocity matters also require compensation and rehabilitation support.",
      },
      {
        label: "National Commission for Scheduled Castes",
        url: "https://ncsc.nic.in/",
        note: "Institutional avenue for complaints, oversight, and caste-rights monitoring.",
      },
      {
        label: "National Commission for Scheduled Tribes",
        url: "https://ncst.nic.in/",
        note: "Relevant where atrocity and tribal-rights issues overlap.",
      },
    ],
  },
  "victim-compensation": {
    tagline:
      "A targeted programme on compensation law, interim relief, rehabilitation planning, and the paper trail that makes compensation real.",
    hi_tagline: "मुआवज़ा कानून, अंतरिम राहत और पुनर्वास की व्यावहारिक समझ विकसित करने वाला विशेष ट्रैक।",
    difficulty: "Applied relief strategy",
    hi_difficulty: "व्यावहारिक राहत रणनीति",
    format: "Compensation + documents + follow-up",
    hi_format: "मुआवज़ा + दस्तावेज़ + फॉलो-अप",
    outcomes: [
      "Understand compensation as a live legal remedy rather than an afterthought to trial.",
      "Distinguish interim relief, final compensation, rehabilitation support, and scheme-linked assistance.",
      "Prepare a compensation file that reduces avoidable delay at DLSA or district level.",
      "Use constitutional-compensation jurisprudence to explain why state accountability matters.",
    ],
    syllabus: [
      {
        title: "Compensation framework",
        summary: "Learn the legal bases that make compensation possible across different case types.",
        topics: [
          "NALSA schemes, Section 357A structures, and compensation in sexual-violence matters",
          "POCSO-linked compensation and support planning for child survivors",
          "Distinguishing compensation, restitution, rehabilitation, and welfare support",
        ],
      },
      {
        title: "Documentation and procedure",
        summary: "See how most delays actually happen and how to reduce them.",
        topics: [
          "FIR, medical records, disability assessments, death records, and bank details",
          "Interim relief, follow-up reminders, and district-level tracking",
          "What to do when the survivor lacks identity or documentary completeness",
        ],
      },
      {
        title: "State accountability and rehabilitation",
        summary: "Compensation should connect to recovery, not end at cheque issuance.",
        topics: [
          "Long-term rehabilitation costs, psychosocial care, shelter, and education continuity",
          "Constitutional-compensation reasoning where state failure is central",
          "Building a support plan after relief is sanctioned",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "Rudul Sah v State of Bihar (1983)",
        description: "A core constitutional-compensation case on state liability and unlawful harm.",
      },
      {
        title: "Nilabati Behera v State of Orissa (1993)",
        description: "Important for linking public-law remedies with compensation for serious rights violations.",
      },
      {
        title: "Laxmi v Union of India",
        description: "Useful for understanding survivor support and compensation reasoning in acid-violence matters.",
      },
    ],
    fieldTools: [
      {
        title: "Compensation dossier checklist",
        description: "Track the core documents and missing pieces before approaching DLSA or district authorities.",
      },
      {
        title: "Interim-relief follow-up note",
        description: "Record dates, pending approvals, and next contact points to avoid silence after filing.",
      },
      {
        title: "Rehabilitation needs inventory",
        description: "List medical, schooling, housing, counselling, disability, and livelihood needs that compensation alone may not cover.",
      },
    ],
    practiceLab: [
      {
        title: "Prepare a child-survivor compensation brief",
        description: "Assemble the supporting documents and narrative logic for a timely compensation request.",
      },
      {
        title: "Map relief gaps",
        description: "Assess what remains unsupported even after interim compensation is sanctioned.",
      },
      {
        title: "Draft a reminder and escalation plan",
        description: "Write the next steps when authorities stop responding after application submission.",
      },
    ],
    officialResources: [
      {
        label: "NALSA victim compensation resources",
        url: OFFICIAL_RESOURCE_URLS.nalsaVictimCompensation,
        note: "Primary legal-aid entry point for victim-compensation frameworks and guidance.",
      },
      {
        label: "POCSO Act, 2012",
        url: OFFICIAL_RESOURCE_URLS.pocso,
        note: "Relevant when compensation is tied to child sexual-abuse matters.",
      },
      {
        label: "National Legal Services Authority",
        url: "https://nalsa.gov.in/",
        note: "Wider legal-aid system needed for referral, follow-up, and access.",
      },
      {
        label: "Mission Shakti support ecosystem",
        url: OFFICIAL_RESOURCE_URLS.missionShakti,
        note: "Useful where crisis support and compensation need to be coordinated together.",
      },
    ],
  },
  "mental-health": {
    tagline:
      "A preparatory rights track on psychosocial disability, legal capacity, consent, treatment safeguards, and community support architecture.",
    hi_tagline: "मानसिक स्वास्थ्य, मनोसामाजिक विकलांगता, सहमति और कानूनी क्षमता पर आधारित अधिकार-केंद्रित अध्ययन पथ।",
    difficulty: "Preview syllabus",
    hi_difficulty: "पूर्वावलोकन पाठ्यक्रम",
    format: "Rights + services + dignity",
    hi_format: "अधिकार + सेवाएं + गरिमा",
    outcomes: [
      "Understand the shift from a purely medical model to a rights-based mental-health and disability framework.",
      "Recognise questions of consent, legal capacity, guardianship pressure, and involuntary treatment safeguards.",
      "Connect disability rights with welfare access, reasonable accommodation, and community support systems.",
    ],
    syllabus: [
      {
        title: "Rights framework",
        summary: "Build the basic architecture for psychosocial disability and mental-health rights.",
        topics: [
          "Mental Healthcare Act, RPwD Act, and the idea of supported decision-making",
          "Legal capacity, dignity, autonomy, and non-discrimination",
          "Advance directives, nominated representatives, and crisis support questions",
        ],
      },
      {
        title: "Access and accommodation",
        summary: "Link legal rights to real service barriers experienced by people and families.",
        topics: [
          "Disability certification, UDID, pensions, and education or employment barriers",
          "Reasonable accommodation and public-service access",
          "Community care, institutional risks, and family decision-making pressure",
        ],
      },
      {
        title: "Grievance and protection pathways",
        summary: "Prepare for rights violations at the interface of law, care, and welfare systems.",
        topics: [
          "Complaint routes, legal aid, disability commissioners, and rights commissions",
          "Documenting coercion, denial of treatment information, or service exclusion",
          "Balancing care urgency with rights protection and informed consent",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "Common Cause v Union of India (2018)",
        description: "Useful for autonomy, decision-making, and dignity debates around health and legal choices.",
      },
      {
        title: "Vikash Kumar v UPSC (2021)",
        description: "Important for reasonable accommodation and disability-rights reasoning.",
      },
      {
        title: "Jeeja Ghosh v Union of India (2016)",
        description: "A strong dignity-and-disability case helpful for rights-based framing.",
      },
    ],
    fieldTools: [
      {
        title: "Rights-oriented intake prompt",
        description: "Assess support needs without assuming incapacity or collapsing everything into diagnosis.",
      },
      {
        title: "Accommodation and benefits checklist",
        description: "Track disability documents, scheme barriers, and reasonable-accommodation needs.",
      },
      {
        title: "Consent and representation note",
        description: "Record how decisions are being made and whether the person’s own voice is respected.",
      },
    ],
    practiceLab: [
      {
        title: "Build a welfare-and-rights plan",
        description: "Design a support pathway that combines certification, scheme access, and dignity safeguards.",
      },
      {
        title: "Service denial response",
        description: "Prepare the next step when a person is denied admission, treatment information, or accommodation.",
      },
      {
        title: "Case conference on autonomy",
        description: "Practice handling conflicts between family control, treatment urgency, and legal rights.",
      },
    ],
    officialResources: [
      {
        label: "Mental Healthcare Act, 2017",
        url: OFFICIAL_RESOURCE_URLS.mentalHealthcare,
        note: "Primary law for rights, consent, advance directives, and service protections.",
      },
      {
        label: "Rights of Persons with Disabilities Act, 2016",
        url: OFFICIAL_RESOURCE_URLS.disability,
        note: "Core disability-rights statute for non-discrimination and access entitlements.",
      },
      {
        label: "UDID portal",
        url: OFFICIAL_RESOURCE_URLS.udid,
        note: "Practical entry point for disability certification and identity documentation.",
      },
      {
        label: "UN Convention on the Rights of Persons with Disabilities",
        url: OFFICIAL_RESOURCE_URLS.uncrpd,
        note: "Primary international rights framework shaping modern disability-rights interpretation.",
      },
    ],
  },
  "welfare-entitlements": {
    tagline:
      "A practical welfare-rights stack on ration, housing, health coverage, pensions, maternity support, disability identity, and grievance escalation.",
    hi_tagline: "राशन, आवास, स्वास्थ्य बीमा, पेंशन, मातृत्व सहायता और विकलांगता पहचान से जुड़ा व्यावहारिक कल्याण-अधिकार ट्रैक।",
    difficulty: "Preview syllabus",
    hi_difficulty: "पूर्वावलोकन पाठ्यक्रम",
    format: "Schemes + exclusion errors + grievance practice",
    hi_format: "योजनाएं + बहिष्करण त्रुटियां + शिकायत अभ्यास",
    outcomes: [
      "Understand how major welfare entitlements are structured and where exclusion most often occurs.",
      "Diagnose common scheme failures such as missing documents, Aadhaar mismatch, ghost rejection, and local discretion.",
      "Use written complaints, RTI, and escalation pathways to push welfare delivery forward.",
    ],
    syllabus: [
      {
        title: "Core welfare programmes",
        summary: "Map the schemes that most frequently matter in legal-aid and community support work.",
        topics: [
          "Ration and food security, PMAY housing, PM-JAY health cover, maternity benefits, pension, and disability identity",
          "Eligibility, documentation, and typical exclusion points at village, block, and district level",
          "How welfare denial often intersects with caste, disability, widowhood, and migration status",
        ],
      },
      {
        title: "Documentation and grievance",
        summary: "Move from awareness to actual entitlement recovery.",
        topics: [
          "Identity papers, bank details, local certificates, and application records",
          "Block-level follow-up, grievance portals, and written representations",
          "Using RTI or public hearings to break bureaucratic silence",
        ],
      },
      {
        title: "Rights-based welfare support",
        summary: "Treat schemes as part of social justice work rather than charity.",
        topics: [
          "Food, shelter, health, and dignity as linked constitutional concerns",
          "Tracking repeat exclusions and community-level patterns",
          "Combining scheme work with legal aid, disability support, or compensation efforts",
        ],
      },
    ],
    caseBriefs: [
      {
        title: "PUCL v Union of India (Right to Food case)",
        description: "Foundational for understanding food security as a rights issue rather than a discretionary benefit.",
      },
      {
        title: "Olga Tellis v Bombay Municipal Corporation (1985)",
        description: "Useful for linking livelihood, shelter, and state responsibility in welfare-related disputes.",
      },
      {
        title: "Swaraj Abhiyan v Union of India (2016)",
        description: "Helpful for understanding state obligations in distress, hunger, and social-protection contexts.",
      },
    ],
    fieldTools: [
      {
        title: "Scheme eligibility matrix",
        description: "A quick reference for matching family profile, documents, and likely entitlement routes.",
      },
      {
        title: "Exclusion-error tracker",
        description: "Record whether the problem is identity mismatch, local non-processing, missing inclusion, or benefit stoppage.",
      },
      {
        title: "Welfare grievance note",
        description: "Structure a written complaint with facts, documents, requested action, and response deadline.",
      },
    ],
    practiceLab: [
      {
        title: "Ration denial case plan",
        description: "Prepare a response route combining supply-office follow-up, RTI, and local documentation repair.",
      },
      {
        title: "Housing or pension recovery drill",
        description: "Work through a case where eligibility exists but sanction or payment remains stuck.",
      },
      {
        title: "Cluster-level welfare review",
        description: "Identify when repeated exclusions across a hamlet or caste group require collective escalation.",
      },
    ],
    officialResources: [
      {
        label: "PMAY-G portal",
        url: OFFICIAL_RESOURCE_URLS.pmayg,
        note: "Official housing scheme portal for rural housing workflows and beneficiary information.",
      },
      {
        label: "National Food Security Act portal",
        url: OFFICIAL_RESOURCE_URLS.nfsa,
        note: "Primary public portal for food security structures and PDS-related resources.",
      },
      {
        label: "PM-JAY / Ayushman Bharat",
        url: OFFICIAL_RESOURCE_URLS.pmjay,
        note: "Official health-cover portal relevant to hospital access and beneficiary verification.",
      },
      {
        label: "PMMVY and NSAP / pension portals",
        url: OFFICIAL_RESOURCE_URLS.pmmvy,
        note: "Use alongside NSAP for maternity and pension support pathways.",
      },
    ],
  },
};

export const TRAINING_RESOURCE_CENTRE_URL = "https://shashwat-sys.github.io/janman-training/index.html#";
