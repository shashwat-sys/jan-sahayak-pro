import { anthropic } from "@ai-sdk/anthropic";
import { generateText, Output } from "ai";

import { isAnthropicConfigured } from "@/lib/server/env";
import {
  type PublicComplaintAssistRequest,
  type PublicComplaintAssistResponse,
  type PublicEligibilityProfile,
  type PublicEligibilityResponse,
  publicComplaintAssistResponseSchema,
  publicEligibilityResponseSchema,
} from "@/lib/server/validators";

type RecommendationRule = {
  id: string;
  category: string;
  name: string;
  hi_name: string;
  docs: string[];
  hi_docs: string[];
  apply: string;
  hi_apply: string;
  officialUrl: string;
  evaluate: (profile: PublicEligibilityProfile) => {
    score: number;
    status: "likely" | "check" | "not_now";
    reasons: string[];
    hi_reasons: string[];
  };
};

const WORKFLOW = [
  "Step 1: capture family profile and check likely schemes.",
  "Step 2: collect the missing identity, income, caste, or bank papers.",
  "Step 3: file the application or complaint at the right office and keep the receipt.",
  "Step 4: follow up with a written reminder or grievance if there is no action.",
];

const HI_WORKFLOW = [
  "चरण 1: परिवार की प्रोफाइल दर्ज कर संभावित योजनाओं की जांच करें।",
  "चरण 2: पहचान, आय, जाति, या बैंक से जुड़े जो कागज नहीं हैं उन्हें जुटाएं।",
  "चरण 3: सही कार्यालय में आवेदन या शिकायत दें और रसीद संभालकर रखें।",
  "चरण 4: कार्रवाई न होने पर लिखित अनुस्मारक या शिकायत के साथ फॉलो-अप करें।",
];

const RECOMMENDATION_RULES: RecommendationRule[] = [
  {
    id: "nfsa-pds",
    category: "Food Security",
    name: "National Food Security Act / PDS",
    hi_name: "राष्ट्रीय खाद्य सुरक्षा अधिनियम / PDS",
    docs: ["Aadhaar", "Family details", "Address proof", "Bank passbook if grievance involves DBT"],
    hi_docs: ["आधार", "परिवार का विवरण", "पता प्रमाण", "DBT शिकायत हो तो बैंक पासबुक"],
    apply: "Block Supply Office, ration card office, or local grievance channel.",
    hi_apply: "ब्लॉक सप्लाई कार्यालय, राशन कार्ड कार्यालय, या स्थानीय शिकायत माध्यम।",
    officialUrl: "https://nfsa.gov.in/",
    evaluate(profile) {
      const reasons: string[] = [];
      const hi_reasons: string[] = [];
      let score = 0;

      if (profile.annualIncome <= 250000) {
        score += 2;
        reasons.push("Lower-income households are commonly priority candidates for food-security support.");
        hi_reasons.push("कम आय वाले परिवार अक्सर खाद्य-सुरक्षा सहायता के प्राथमिक दावेदार होते हैं।");
      }

      if (!profile.hasRationCard) {
        score += 1;
        reasons.push("Missing ration-card access suggests a strong need for screening or grievance support.");
        hi_reasons.push("राशन कार्ड न होना पात्रता जांच या शिकायत सहायता की मजबूत जरूरत दिखाता है।");
      }

      return {
        score,
        status: score >= 2 ? "likely" : score === 1 ? "check" : "not_now",
        reasons: reasons.length > 0 ? reasons : ["Food-security need is not clearly visible from the current profile."],
        hi_reasons:
          hi_reasons.length > 0 ? hi_reasons : ["वर्तमान प्रोफाइल से खाद्य-सुरक्षा की जरूरत स्पष्ट नहीं दिख रही है।"],
      };
    },
  },
  {
    id: "pmay",
    category: "Housing",
    name: "PM Awas Yojana",
    hi_name: "प्रधानमंत्री आवास योजना",
    docs: ["Aadhaar", "Bank account", "Residence proof", "Land or housing details if available"],
    hi_docs: ["आधार", "बैंक खाता", "निवास प्रमाण", "उपलब्ध हो तो जमीन या आवास का विवरण"],
    apply: "Gram Panchayat / Block office for rural applications, or Urban Local Body for town areas.",
    hi_apply: "ग्रामीण आवेदन के लिए ग्राम पंचायत / ब्लॉक कार्यालय, और शहरी क्षेत्रों के लिए नगर निकाय।",
    officialUrl: "https://pmayg.nic.in/netiayHome/home.aspx",
    evaluate(profile) {
      const reasons: string[] = [];
      const hi_reasons: string[] = [];
      let score = 0;

      if (profile.housingStatus === "no_house" || profile.housingStatus === "kutcha") {
        score += 2;
        reasons.push("Families without a pucca house are priority candidates for housing support.");
        hi_reasons.push("पक्का घर न होने वाले परिवार आवास सहायता के प्राथमिक दावेदार होते हैं।");
      }

      if (profile.residence === "rural" || profile.residence === "urban") {
        score += 1;
        reasons.push("A location-specific PMAY route can be identified from the residence type.");
        hi_reasons.push("निवास के प्रकार के आधार पर PMAY का सही आवेदन मार्ग चुना जा सकता है।");
      }

      return {
        score,
        status: score >= 2 ? "likely" : score === 1 ? "check" : "not_now",
        reasons: reasons.length > 0 ? reasons : ["Housing deprivation is not strongly visible from the current answers."],
        hi_reasons:
          hi_reasons.length > 0 ? hi_reasons : ["वर्तमान उत्तरों से आवास वंचना स्पष्ट रूप से नहीं दिख रही है।"],
      };
    },
  },
  {
    id: "mgnrega",
    category: "Employment",
    name: "MGNREGS Job Card",
    hi_name: "मनरेगा जॉब कार्ड",
    docs: ["Aadhaar", "Residence proof", "Bank account details", "Existing job card number if any"],
    hi_docs: ["आधार", "निवास प्रमाण", "बैंक खाता विवरण", "यदि हो तो पुराना जॉब कार्ड नंबर"],
    apply: "Apply through the Gram Panchayat or block-level MGNREGS office.",
    hi_apply: "ग्राम पंचायत या ब्लॉक स्तर के मनरेगा कार्यालय के माध्यम से आवेदन करें।",
    officialUrl: "https://nrega.dord.gov.in/",
    evaluate(profile) {
      const reasons: string[] = [];
      const hi_reasons: string[] = [];
      let score = 0;

      if (profile.residence === "rural") {
        score += 1;
        reasons.push("Rural residence is essential for MGNREGS job-card screening.");
        hi_reasons.push("मनरेगा जॉब कार्ड के लिए ग्रामीण निवास महत्वपूर्ण है।");
      }

      if (/(labour|worker|unemployed|farmer)/i.test(profile.occupation) || profile.isLandless) {
        score += 2;
        reasons.push("The profile suggests wage-work or landlessness, which often aligns with MGNREGS demand.");
        hi_reasons.push("प्रोफाइल में मजदूरी या भूमिहीनता दिख रही है, जो मनरेगा की जरूरत से जुड़ सकती है।");
      }

      return {
        score,
        status: score >= 2 ? "likely" : score === 1 ? "check" : "not_now",
        reasons: reasons.length > 0 ? reasons : ["The current profile does not strongly point to rural wage-employment support."],
        hi_reasons:
          hi_reasons.length > 0
            ? hi_reasons
            : ["वर्तमान प्रोफाइल ग्रामीण मजदूरी रोजगार सहायता की ओर मजबूत संकेत नहीं देता।"],
      };
    },
  },
  {
    id: "pmjay",
    category: "Health",
    name: "Ayushman Bharat (PM-JAY)",
    hi_name: "आयुष्मान भारत (PM-JAY)",
    docs: ["Aadhaar", "Ration card if available", "Any hospital slip or treatment document"],
    hi_docs: ["आधार", "यदि हो तो राशन कार्ड", "कोई अस्पताल पर्ची या इलाज का कागज"],
    apply: "Check eligibility through the nearest empanelled hospital or Common Service Centre.",
    hi_apply: "निकटतम सूचीबद्ध अस्पताल या कॉमन सर्विस सेंटर से पात्रता जांचें।",
    officialUrl: "https://pmjay.gov.in/",
    evaluate(profile) {
      const reasons: string[] = [];
      const hi_reasons: string[] = [];
      let score = 0;

      if (profile.needsMedicalSupport) {
        score += 2;
        reasons.push("The profile shows an immediate health-support need.");
        hi_reasons.push("प्रोफाइल में स्वास्थ्य सहायता की तत्काल जरूरत दिख रही है।");
      }

      if (profile.annualIncome <= 250000 || profile.hasRationCard) {
        score += 1;
        reasons.push("Low-income or ration-linked households often need PM-JAY screening.");
        hi_reasons.push("कम आय या राशन से जुड़े परिवारों को PM-JAY जांच की जरूरत हो सकती है।");
      }

      return {
        score,
        status: score >= 2 ? "likely" : score === 1 ? "check" : "not_now",
        reasons: reasons.length > 0 ? reasons : ["No immediate health-support signal was captured from the profile."],
        hi_reasons: hi_reasons.length > 0 ? hi_reasons : ["प्रोफाइल से तत्काल स्वास्थ्य-सहायता की जरूरत स्पष्ट नहीं है।"],
      };
    },
  },
  {
    id: "pmmvy",
    category: "Women",
    name: "PM Matru Vandana Yojana",
    hi_name: "प्रधानमंत्री मातृ वंदना योजना",
    docs: ["Aadhaar", "Bank account", "Pregnancy registration record", "MCP card if available"],
    hi_docs: ["आधार", "बैंक खाता", "गर्भावस्था पंजीकरण रिकॉर्ड", "उपलब्ध हो तो MCP कार्ड"],
    apply: "Apply through the Anganwadi centre, ASHA, or the PMMVY portal support chain.",
    hi_apply: "आंगनवाड़ी केंद्र, आशा कार्यकर्ता, या PMMVY सहायता चैनल के माध्यम से आवेदन करें।",
    officialUrl: "https://pmmvy.wcd.gov.in/",
    evaluate(profile) {
      const reasons: string[] = [];
      const hi_reasons: string[] = [];
      const score = profile.isPregnant ? 3 : 0;

      if (profile.isPregnant) {
        reasons.push("Pregnancy makes this one of the most relevant maternity-support schemes to check first.");
        hi_reasons.push("गर्भावस्था की स्थिति में यह सबसे प्रासंगिक मातृत्व सहायता योजनाओं में से एक है।");
      }

      return {
        score,
        status: score >= 2 ? "likely" : "not_now",
        reasons: reasons.length > 0 ? reasons : ["This scheme is mainly relevant when the applicant is currently pregnant."],
        hi_reasons: hi_reasons.length > 0 ? hi_reasons : ["यह योजना मुख्यतः गर्भवती आवेदिका के लिए प्रासंगिक होती है।"],
      };
    },
  },
  {
    id: "disability-support",
    category: "Disability",
    name: "UDID + Bihar Disability Pension Support",
    hi_name: "UDID + बिहार दिव्यांग पेंशन सहायता",
    docs: ["Disability certificate", "Aadhaar", "Bank account", "Photograph", "Medical records if needed"],
    hi_docs: ["दिव्यांगता प्रमाणपत्र", "आधार", "बैंक खाता", "फोटो", "जरूरत हो तो मेडिकल रिकॉर्ड"],
    apply: "Start with disability certification or UDID, then move to district social-welfare support and pension.",
    hi_apply: "पहले दिव्यांगता प्रमाणन या UDID से शुरू करें, फिर जिला सामाजिक कल्याण सहायता और पेंशन पर जाएं।",
    officialUrl: "https://swavlambancard.gov.in/",
    evaluate(profile) {
      const reasons: string[] = [];
      const hi_reasons: string[] = [];
      let score = 0;

      if (profile.hasDisability) {
        score += 2;
        reasons.push("The profile indicates disability-related support may be available.");
        hi_reasons.push("प्रोफाइल में दिव्यांगता से जुड़ी सहायता की संभावना दिख रही है।");
      }

      if (profile.disabilityPercent >= 40) {
        score += 1;
        reasons.push("A disability level of 40% or more often matters for formal pension or benefits.");
        hi_reasons.push("40% या उससे अधिक दिव्यांगता अक्सर औपचारिक पेंशन या लाभों में महत्वपूर्ण होती है।");
      }

      return {
        score,
        status: score >= 2 ? "likely" : score === 1 ? "check" : "not_now",
        reasons: reasons.length > 0 ? reasons : ["No disability-related trigger appears in the current profile."],
        hi_reasons: hi_reasons.length > 0 ? hi_reasons : ["वर्तमान प्रोफाइल में दिव्यांगता सहायता का संकेत नहीं दिखता।"],
      };
    },
  },
  {
    id: "widow-oldage-pension",
    category: "Social Security",
    name: "NSAP / Widow or Old Age Pension",
    hi_name: "NSAP / विधवा या वृद्धावस्था पेंशन",
    docs: ["Aadhaar", "Bank account", "Age or death-related proof where applicable", "Residence proof"],
    hi_docs: ["आधार", "बैंक खाता", "जहाँ लागू हो वहाँ आयु या मृत्यु से जुड़े प्रमाण", "निवास प्रमाण"],
    apply: "Check the nearest block office, social-welfare office, or NSAP support route.",
    hi_apply: "निकटतम ब्लॉक कार्यालय, सामाजिक कल्याण कार्यालय, या NSAP सहायता मार्ग से जांच करें।",
    officialUrl: "https://nsap.nic.in/",
    evaluate(profile) {
      const reasons: string[] = [];
      const hi_reasons: string[] = [];
      let score = 0;

      if (profile.isWidowed) {
        score += 2;
        reasons.push("Widowhood is a strong pension-screening trigger.");
        hi_reasons.push("विधवा होना पेंशन जांच का मजबूत आधार है।");
      }

      if (profile.age >= 60) {
        score += 2;
        reasons.push("Age 60 or above points toward old-age pension screening.");
        hi_reasons.push("60 वर्ष या उससे अधिक आयु वृद्धावस्था पेंशन जांच की ओर संकेत करती है।");
      }

      return {
        score,
        status: score >= 2 ? "likely" : score === 1 ? "check" : "not_now",
        reasons: reasons.length > 0 ? reasons : ["The current answers do not strongly indicate widow or old-age pension eligibility."],
        hi_reasons:
          hi_reasons.length > 0
            ? hi_reasons
            : ["वर्तमान उत्तरों से विधवा या वृद्धावस्था पेंशन की मजबूत संभावना नहीं दिखती।"],
      };
    },
  },
  {
    id: "student-credit",
    category: "Education",
    name: "Bihar Student Credit Card / Higher Education Support",
    hi_name: "बिहार स्टूडेंट क्रेडिट कार्ड / उच्च शिक्षा सहायता",
    docs: ["Aadhaar", "12th marksheet or education records", "Admission letter if available", "Income details", "Bank details"],
    hi_docs: ["आधार", "12वीं की मार्कशीट या शिक्षा रिकॉर्ड", "यदि हो तो प्रवेश पत्र", "आय विवरण", "बैंक विवरण"],
    apply: "Use the Bihar higher-education support system after confirming post-12th study plans.",
    hi_apply: "12वीं के बाद की पढ़ाई की योजना की पुष्टि कर बिहार उच्च शिक्षा सहायता प्रणाली का उपयोग करें।",
    officialUrl: "https://www.7nishchay-yuvaupmission.bihar.gov.in/",
    evaluate(profile) {
      const reasons: string[] = [];
      const hi_reasons: string[] = [];
      let score = 0;

      if (profile.isStudent) {
        score += 2;
        reasons.push("The profile suggests active education needs that may align with higher-study support.");
        hi_reasons.push("प्रोफाइल से सक्रिय शिक्षा आवश्यकता दिखती है, जो उच्च अध्ययन सहायता से जुड़ सकती है।");
      }

      if (profile.age >= 17 && profile.age <= 28) {
        score += 1;
        reasons.push("The age band fits common higher-education support journeys.");
        hi_reasons.push("आयु समूह उच्च शिक्षा सहायता की सामान्य यात्रा से मेल खाता है।");
      }

      return {
        score,
        status: score >= 2 ? "likely" : score === 1 ? "check" : "not_now",
        reasons: reasons.length > 0 ? reasons : ["The current profile does not clearly indicate post-school education support needs."],
        hi_reasons:
          hi_reasons.length > 0 ? hi_reasons : ["वर्तमान प्रोफाइल में स्कूल के बाद की शिक्षा सहायता की स्पष्ट जरूरत नहीं दिखती।"],
      };
    },
  },
];

function dedupe(values: string[]) {
  return [...new Set(values)];
}

function sortRecommendations(profile: PublicEligibilityProfile) {
  return RECOMMENDATION_RULES.map((rule) => {
    const evaluation = rule.evaluate(profile);
    return {
      ...rule,
      evaluation,
    };
  })
    .sort((left, right) => {
      const statusWeight = { likely: 3, check: 2, not_now: 1 };
      const statusDiff =
        statusWeight[right.evaluation.status] - statusWeight[left.evaluation.status];

      if (statusDiff !== 0) {
        return statusDiff;
      }

      return right.evaluation.score - left.evaluation.score;
    })
    .slice(0, 5);
}

export function buildFallbackEligibility(profile: PublicEligibilityProfile): PublicEligibilityResponse {
  const shortlisted = sortRecommendations(profile);
  const recommendations = shortlisted.map((rule) => ({
    id: rule.id,
    category: rule.category,
    name: rule.name,
    hi_name: rule.hi_name,
    status: rule.evaluation.status,
    reasons: dedupe(rule.evaluation.reasons).slice(0, 4),
    hi_reasons: dedupe(rule.evaluation.hi_reasons).slice(0, 4),
    docs: rule.docs,
    hi_docs: rule.hi_docs,
    apply: rule.apply,
    hi_apply: rule.hi_apply,
    officialUrl: rule.officialUrl,
  }));

  const likelyCount = recommendations.filter((entry) => entry.status === "likely").length;
  const summary =
    likelyCount > 0
      ? `We found ${likelyCount} schemes that look immediately relevant, along with document and grievance next steps.`
      : "No scheme is an immediate fit from the current profile, but we identified the best screening and grievance next steps.";
  const hi_summary =
    likelyCount > 0
      ? `हमने ${likelyCount} ऐसी योजनाएं चिन्हित की हैं जो तुरंत प्रासंगिक लगती हैं, साथ ही दस्तावेज़ और शिकायत के अगले कदम भी दिए हैं।`
      : "वर्तमान प्रोफाइल से कोई योजना तुरंत स्पष्ट नहीं है, लेकिन हमने सबसे उपयुक्त जांच और शिकायत के अगले कदम चिन्हित किए हैं।";

  return publicEligibilityResponseSchema.parse({
    summary,
    hi_summary,
    recommendations,
    workflow: WORKFLOW,
    hi_workflow: HI_WORKFLOW,
  });
}

function inferFilingOffice(authority: string, benefit: string) {
  const lower = `${authority} ${benefit}`.toLowerCase();

  if (/(ration|pds|dealer|supply)/i.test(lower)) {
    return {
      office: "Block Supply Office / Sub-Divisional grievance authority",
      hi_office: "ब्लॉक सप्लाई कार्यालय / अनुमंडल शिकायत प्राधिकारी",
    };
  }

  if (/(anganwadi|pregnan|matru|pmmvy|icds)/i.test(lower)) {
    return {
      office: "CDPO / Anganwadi supervisor / block social-welfare office",
      hi_office: "CDPO / आंगनवाड़ी पर्यवेक्षक / ब्लॉक सामाजिक कल्याण कार्यालय",
    };
  }

  if (/(housing|awas|pmay|land|house)/i.test(lower)) {
    return {
      office: "Gram Panchayat / Block Development Office / Urban Local Body",
      hi_office: "ग्राम पंचायत / प्रखंड विकास कार्यालय / नगर निकाय",
    };
  }

  if (/(hospital|ayushman|health|medical)/i.test(lower)) {
    return {
      office: "Hospital grievance desk / district health authority / Ayushman helpdesk",
      hi_office: "अस्पताल शिकायत डेस्क / जिला स्वास्थ्य प्राधिकारी / आयुष्मान हेल्पडेस्क",
    };
  }

  return {
    office: `${authority} grievance office`,
    hi_office: `${authority} शिकायत कार्यालय`,
  };
}

export function buildFallbackComplaintDraft(
  input: PublicComplaintAssistRequest,
): PublicComplaintAssistResponse {
  const filingOffice = inferFilingOffice(input.authority, input.benefit);
  const requestedRelief =
    input.reliefWanted.trim() || "Immediate correction of the record, written acknowledgement, and time-bound action.";

  const documents = [
    "Identity proof such as Aadhaar or voter ID",
    "Any application receipt, token, or acknowledgement",
    "Relevant scheme card, passbook, or hospital / office slip",
    input.documentsAvailable.trim() ? `Documents already available: ${input.documentsAvailable.trim()}` : "Any screenshots, SMS, or denial note",
  ];
  const hi_documents = [
    "आधार या वोटर ID जैसा पहचान प्रमाण",
    "कोई आवेदन रसीद, टोकन, या प्राप्ति पर्ची",
    "संबंधित योजना कार्ड, पासबुक, या अस्पताल / कार्यालय पर्ची",
    input.documentsAvailable.trim()
      ? `जो दस्तावेज़ उपलब्ध हैं: ${input.documentsAvailable.trim()}`
      : "कोई स्क्रीनशॉट, SMS, या अस्वीकृति नोट",
  ];

  return publicComplaintAssistResponseSchema.parse({
    subject: `Complaint regarding ${input.benefit} - ${input.grievanceType}`,
    hi_subject: `${input.benefit} संबंधी शिकायत - ${input.grievanceType}`,
    summary:
      "This draft organises the grievance into facts, relief sought, documents, and the correct filing office so it can be submitted more clearly.",
    hi_summary:
      "यह ड्राफ्ट शिकायत को तथ्य, मांगी गई राहत, दस्तावेज़ और सही कार्यालय के अनुसार व्यवस्थित करता है ताकि इसे स्पष्ट रूप से जमा किया जा सके।",
    facts: [
      `${input.name} from ${input.location || input.district} reports a problem connected to ${input.benefit}.`,
      `The issue is described as ${input.grievanceType} and is linked to ${input.authority}.`,
      `Incident date or relevant period: ${input.incidentDate}.`,
      `Main facts reported: ${input.facts}.`,
    ],
    hi_facts: [
      `${input.name} ने ${input.location || input.district} से ${input.benefit} से जुड़ी समस्या बताई है।`,
      `समस्या का प्रकार ${input.grievanceType} है और यह ${input.authority} से जुड़ी है।`,
      `घटना की तारीख या संबंधित अवधि: ${input.incidentDate}।`,
      `बताए गए मुख्य तथ्य: ${input.facts}।`,
    ],
    reliefs: [
      `Register the complaint and issue a written acknowledgement immediately.`,
      `Verify the applicant's record and take action on ${input.benefit} without further delay.`,
      requestedRelief,
    ],
    hi_reliefs: [
      "शिकायत दर्ज कर तुरंत लिखित प्राप्ति दें।",
      `${input.benefit} से जुड़ी प्रविष्टि की जांच कर बिना अनावश्यक देरी कार्रवाई करें।`,
      requestedRelief,
    ],
    documents_to_attach: documents,
    hi_documents_to_attach: hi_documents,
    filing_office: filingOffice.office,
    hi_filing_office: filingOffice.hi_office,
    next_steps: [
      `Submit this complaint to the ${filingOffice.office} and keep a stamped copy or receipt.`,
      "If no action is taken, send a written reminder after 7-15 days.",
      "If the authority still does not respond, escalate through the district grievance or RTI route.",
    ],
    hi_next_steps: [
      `${filingOffice.hi_office} में यह शिकायत दें और मोहर लगी प्रति या रसीद अपने पास रखें।`,
      "यदि 7-15 दिनों में कार्रवाई न हो तो लिखित अनुस्मारक दें।",
      "फिर भी कार्रवाई न होने पर जिला शिकायत या RTI मार्ग से आगे बढ़ें।",
    ],
  });
}

export async function evaluatePublicEligibility(
  profile: PublicEligibilityProfile,
): Promise<PublicEligibilityResponse> {
  const fallback = buildFallbackEligibility(profile);

  if (!isAnthropicConfigured()) {
    return fallback;
  }

  try {
    const { output } = await generateText({
      model: anthropic("claude-sonnet-4-5"),
      output: Output.object({ schema: publicEligibilityResponseSchema }),
      system:
        "You are helping a Bihar public-interest legal aid and welfare platform screen likely scheme eligibility. Use practical, non-technical language. Keep recommendations grounded in realistic next steps. Do not promise approval; explain likely fit, required documents, and where to go next.",
      prompt: `Review this welfare profile and prepare a structured assisted-screening result inspired by guided scheme-discovery flows.

District: ${profile.district}
Residence: ${profile.residence}
Age: ${profile.age}
Gender: ${profile.gender}
Annual family income: ${profile.annualIncome}
Social category: ${profile.socialCategory}
Occupation: ${profile.occupation || "Not stated"}
Student: ${profile.isStudent ? "Yes" : "No"}
Pregnant: ${profile.isPregnant ? "Yes" : "No"}
Widowed: ${profile.isWidowed ? "Yes" : "No"}
Has disability: ${profile.hasDisability ? `Yes (${profile.disabilityPercent}%)` : "No"}
Housing status: ${profile.housingStatus}
Has ration card: ${profile.hasRationCard ? "Yes" : "No"}
Has bank account: ${profile.hasBankAccount ? "Yes" : "No"}
Has Aadhaar: ${profile.hasAadhaar ? "Yes" : "No"}
Landless: ${profile.isLandless ? "Yes" : "No"}
Needs medical support: ${profile.needsMedicalSupport ? "Yes" : "No"}

Requirements:
- list 3-5 scheme recommendations
- status must be likely, check, or not_now
- keep reasons and document lists concise
- focus on Bihar-relevant public schemes and realistic filing routes
- workflow should be 3-5 short assisted steps`,
    });

    return publicEligibilityResponseSchema.parse(output);
  } catch {
    return fallback;
  }
}

export async function draftPublicComplaint(
  input: PublicComplaintAssistRequest,
): Promise<PublicComplaintAssistResponse> {
  const fallback = buildFallbackComplaintDraft(input);

  if (!isAnthropicConfigured()) {
    return fallback;
  }

  try {
    const { output } = await generateText({
      model: anthropic("claude-sonnet-4-5"),
      output: Output.object({ schema: publicComplaintAssistResponseSchema }),
      system:
        "You draft first-level grievance complaints for social-welfare and service-delivery problems in Bihar. Keep the structure simple, factual, respectful, and ready for a block office, district office, school, hospital, ration office, or welfare authority.",
      prompt: `Prepare a structured grievance draft from these inputs.

Name: ${input.name}
Phone: ${input.phone}
District: ${input.district}
Benefit or service: ${input.benefit}
Authority involved: ${input.authority}
Grievance type: ${input.grievanceType}
Incident date: ${input.incidentDate}
Location: ${input.location || "Not provided"}
Facts: ${input.facts}
Documents already available: ${input.documentsAvailable || "Not specified"}
Relief wanted: ${input.reliefWanted || "Please include immediate correction, acknowledgement, and time-bound action."}

Requirements:
- organise facts in 3-4 bullets
- keep reliefs practical and specific
- list documents to attach
- identify the most likely filing office
- provide next steps after submission
- keep Hindi fields parallel but concise`,
    });

    return publicComplaintAssistResponseSchema.parse(output);
  } catch {
    return fallback;
  }
}
