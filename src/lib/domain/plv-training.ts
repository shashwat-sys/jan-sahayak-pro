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

export const TRAINING_RESOURCE_CENTRE_URL = "https://shashwat-sys.github.io/janman-training/index.html#";
