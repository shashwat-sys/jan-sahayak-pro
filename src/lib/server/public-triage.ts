import { anthropic } from "@ai-sdk/anthropic";
import { generateText, Output } from "ai";

import type { PublicIssueRequest, PublicIssueTriage } from "@/lib/server/validators";
import { publicIssueTriageSchema } from "@/lib/server/validators";
import { isAnthropicConfigured } from "@/lib/server/env";

type Rule = {
  pattern: RegExp;
  labels: string[];
  type?: PublicIssueTriage["type"];
  urgency?: PublicIssueTriage["urgency"];
};

const TRIAGE_RULES: Rule[] = [
  {
    pattern:
      /(domestic violence|husband beat(s|ing)?|dowry|threw me out|forced me out|घर से निकाल|घरेलू हिंसा|मारता|पीटता|पीटा|assault at home)/i,
    labels: [
      "Protection of Women from Domestic Violence Act, 2005",
      "One Stop Centre (Sakhi) / Women Helpline 181",
    ],
    type: "legal",
    urgency: "high",
  },
  {
    pattern: /(rape|sexual abuse|pocso|child abuse|minor girl|बाल विवाह|sexual violence|molest)/i,
    labels: ["POCSO Act, 2012", "Childline 1098 / Child Welfare Committee"],
    type: "legal",
    urgency: "high",
  },
  {
    pattern: /(sc\/st|atrocity|caste abuse|untouchability|दलित|महादलित|जाति|land grabbed by upper caste)/i,
    labels: [
      "SC/ST Prevention of Atrocities Act, 1989",
      "SC/ST Atrocity Relief & Compensation (Bihar)",
    ],
    type: "legal",
    urgency: "high",
  },
  {
    pattern: /(fir|police refuse|thana|arrest|custody|zero fir|गिरफ्तार|थाना|पुलिस नहीं सुन रही)/i,
    labels: [
      "Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023",
      "FIR / Zero FIR rights",
    ],
    type: "legal",
  },
  {
    pattern: /(land|mutation|dakhil|kharij|eviction|zamin|भूमि|जमीन|दाखिल|खारिज| कब्जा)/i,
    labels: [
      "Bihar Land Reforms & Tenancy Laws",
      "Bihar Land to Landless / Dalit Schemes",
    ],
    type: "legal",
  },
  {
    pattern: /(ration|pds|food grain|अनाज|राशन|card not made|dealer)/i,
    labels: ["National Food Security Act / PDS"],
    type: "welfare",
  },
  {
    pattern: /(awas|house|housing|shelter|घर नहीं|homeless|pmay)/i,
    labels: ["PM Awas Yojana", "Bihar housing support"],
    type: "welfare",
  },
  {
    pattern: /(job card|mgnregs|मनरेगा|काम नहीं मिला|wage not paid)/i,
    labels: ["MGNREGS (Job Card)"],
    type: "welfare",
  },
  {
    pattern: /(ayushman|hospital denied|treatment denied|medical help|इलाज नहीं|अस्पताल)/i,
    labels: ["Ayushman Bharat (PM-JAY)"],
    type: "welfare",
    urgency: "high",
  },
  {
    pattern: /(pension|viklang|disability|certificate|दिव्यांग|विकलांग|scholarship)/i,
    labels: [
      "Rights of Persons with Disabilities (RPWD 2016)",
      "Bihar disability pension and support schemes",
    ],
    type: "welfare",
  },
];

const HIGH_URGENCY_PATTERN =
  /(violence|urgent|emergency|threat|beating|rape|assault|child abuse|arrest|custody|evict(ed)?|food not available|treatment denied|मार|पीट|जान का खतरा|तुरंत|तत्काल|गिरफ्तार|हिंसा)/i;

function dedupe(items: string[]) {
  return [...new Set(items)];
}

function inferType(input: PublicIssueRequest, matchedRules: Rule[]): PublicIssueTriage["type"] {
  const welfareHits = matchedRules.filter((rule) => rule.type === "welfare").length;
  const legalHits = matchedRules.filter((rule) => rule.type === "legal").length;

  if (legalHits > 0 && legalHits >= welfareHits) {
    return "legal";
  }

  if (welfareHits > 0) {
    return "welfare";
  }

  if (input.issueType === "legal" || input.issueType === "welfare") {
    return input.issueType;
  }

  return "legal";
}

function inferUrgency(issue: string, matchedRules: Rule[]): PublicIssueTriage["urgency"] {
  if (matchedRules.some((rule) => rule.urgency === "high")) {
    return "high";
  }

  return HIGH_URGENCY_PATTERN.test(issue) ? "high" : "normal";
}

function buildIssues(issueType: PublicIssueTriage["type"], matchedRules: Rule[]) {
  const issues = dedupe(matchedRules.flatMap((rule) => rule.labels)).slice(0, 4);

  if (issues.length > 0) {
    return issues;
  }

  return issueType === "legal"
    ? ["Legal rights assessment by Jan Nyaya Abhiyan"]
    : ["Government scheme eligibility and grievance support"];
}

function buildSummaries(type: PublicIssueTriage["type"], urgency: PublicIssueTriage["urgency"]) {
  if (type === "legal" && urgency === "high") {
    return {
      summary: "This appears to be an urgent legal protection matter that needs immediate follow-up.",
      hi_summary: "यह एक तात्कालिक कानूनी सुरक्षा का मामला लगता है, जिस पर तुरंत कार्रवाई जरूरी है।",
    };
  }

  if (type === "legal") {
    return {
      summary: "This appears to be a legal rights matter that should be reviewed by a lawyer.",
      hi_summary: "यह एक कानूनी अधिकारों का मामला लगता है, जिसे वकील द्वारा देखा जाना चाहिए।",
    };
  }

  if (urgency === "high") {
    return {
      summary: "This appears to be an urgent welfare access issue that needs immediate support.",
      hi_summary: "यह एक तात्कालिक सरकारी सहायता का मामला लगता है, जिसमें तुरंत मदद की जरूरत है।",
    };
  }

  return {
    summary: "This appears to be a welfare or scheme access issue that needs field support.",
    hi_summary: "यह सरकारी योजना या सेवा तक पहुँच का मामला लगता है, जिसमें फील्ड सहायता की जरूरत है।",
  };
}

function buildNextSteps(type: PublicIssueTriage["type"], urgency: PublicIssueTriage["urgency"]) {
  if (type === "legal" && urgency === "high") {
    return {
      next_steps: [
        "Move to a safe place right away and call 112, 181, or 1098 if there is immediate danger.",
        "Keep photos, medical papers, messages, or witness names ready if available.",
        "A Jan Nyaya Abhiyan lawyer or district fellow should contact you within 24 hours.",
      ],
      hi_next_steps: [
        "अगर तुरंत खतरा है तो सुरक्षित जगह जाएं और 112, 181, या 1098 पर कॉल करें।",
        "यदि उपलब्ध हों तो फोटो, मेडिकल कागज, संदेश, या गवाहों के नाम तैयार रखें।",
        "जन न्याय अभियान की कानूनी टीम या जिला साथी 24 घंटे के भीतर संपर्क करेगा।",
      ],
    };
  }

  if (type === "legal") {
    return {
      next_steps: [
        "Keep your ID, application papers, notices, and any police or court documents ready.",
        "Write down dates, names, places, and what happened in order.",
        "Our legal team will review the matter and guide the next filing or representation step.",
      ],
      hi_next_steps: [
        "अपना पहचान पत्र, आवेदन, नोटिस, और पुलिस या अदालत के कागज तैयार रखें।",
        "तारीख, नाम, जगह, और क्या हुआ उसे क्रम से लिख लें।",
        "हमारी कानूनी टीम मामले की समीक्षा कर अगला कदम बताएगी।",
      ],
    };
  }

  if (urgency === "high") {
    return {
      next_steps: [
        "Keep Aadhaar, ration card, bank passbook, and any denial slip or hospital paper ready.",
        "Contact the nearest block office, CSC, helpline, or empanelled hospital if immediate assistance is needed.",
        "Our field team will help check eligibility and escalation options quickly.",
      ],
      hi_next_steps: [
        "आधार, राशन कार्ड, बैंक पासबुक, और कोई भी अस्वीकृति पर्ची या अस्पताल कागज तैयार रखें।",
        "तुरंत मदद चाहिए तो नजदीकी ब्लॉक, CSC, हेल्पलाइन, या सूचीबद्ध अस्पताल से संपर्क करें।",
        "हमारी फील्ड टीम पात्रता और शिकायत आगे बढ़ाने में जल्द मदद करेगी।",
      ],
    };
  }

  return {
    next_steps: [
      "Keep Aadhaar, bank details, caste or income papers, and any application receipt ready.",
      "We will help identify the right scheme, eligibility, and district office to approach.",
      "Our team will follow up on the next application or grievance step.",
    ],
    hi_next_steps: [
      "आधार, बैंक विवरण, जाति या आय प्रमाणपत्र, और आवेदन की रसीद तैयार रखें।",
      "हम सही योजना, पात्रता, और किस कार्यालय जाना है, यह बताने में मदद करेंगे।",
      "हमारी टीम आवेदन या शिकायत के अगले कदम पर मदद करेगी।",
    ],
  };
}

export function buildFallbackPublicTriage(input: PublicIssueRequest): PublicIssueTriage {
  const issue = input.issue.trim();
  const matchedRules = TRIAGE_RULES.filter((rule) => rule.pattern.test(issue));
  const type = inferType(input, matchedRules);
  const urgency = inferUrgency(issue, matchedRules);
  const issues = buildIssues(type, matchedRules);
  const summaries = buildSummaries(type, urgency);
  const nextSteps = buildNextSteps(type, urgency);

  return publicIssueTriageSchema.parse({
    type,
    urgency,
    summary: summaries.summary,
    hi_summary: summaries.hi_summary,
    issues,
    next_steps: nextSteps.next_steps,
    hi_next_steps: nextSteps.hi_next_steps,
  });
}

export async function triagePublicIssue(input: PublicIssueRequest): Promise<PublicIssueTriage> {
  const fallback = buildFallbackPublicTriage(input);

  if (!isAnthropicConfigured()) {
    return fallback;
  }

  try {
    const { output } = await generateText({
      model: anthropic("claude-sonnet-4-5"),
      output: Output.object({ schema: publicIssueTriageSchema }),
      system:
        "You triage first-contact legal aid and welfare requests for Bihar. Keep language simple, practical, and safe. Choose legal when a lawyer should take first follow-up, and welfare when a scheme or service worker should. Escalate urgency to high for violence, abuse, arrest, child risk, denial of urgent treatment, or immediate dispossession.",
      prompt: `Review this incoming request and produce a concise structured triage.

District: ${input.district}
Issue type requested: ${input.issueType}
Village/Area: ${input.location || "Not provided"}
Reported issue:
${input.issue}

Requirements:
- "type" must be "legal" or "welfare"
- "urgency" must be "high" or "normal"
- keep summary fields to one sentence each
- "issues" should list 2-4 relevant laws, schemes, or support tracks
- next steps should be short, concrete, and safe for first contact`,
    });

    return publicIssueTriageSchema.parse(output);
  } catch {
    return fallback;
  }
}
