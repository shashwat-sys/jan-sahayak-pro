"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useEffectEvent, useState, useTransition } from "react";

import styles from "./prototype-presentation.module.css";

type PrototypeSummary = {
  activeCases: number;
  highPriorityCases: number;
  totalActivities: number;
  beneficiariesReached: number;
  totalGrantsLabel: string;
  totalExpensesLabel: string;
  districtCoverage: number;
  teamSize: number;
};

type PrototypePresentationProps = {
  generatedOn: string;
  initialSceneId?: string;
  summary: PrototypeSummary;
};

type SceneTone = "public" | "workspace" | "pipeline" | "ios";

type SceneCard = {
  eyebrow: string;
  title: string;
  meta: string;
  tone: "accent" | "green" | "blue" | "purple";
  wide?: boolean;
};

type SceneSection = {
  title: string;
  copy: string;
  tags?: string[];
};

type PrototypeScene = {
  id: string;
  tabLabel: string;
  kicker: string;
  title: string;
  copy: string;
  tone: SceneTone;
  audience: string;
  promise: string;
  highlights: string[];
  proof: Array<{ label: string; value: string }>;
  phoneTitle: string;
  phoneSubtitle: string;
  phoneCards: SceneCard[];
  consoleTitle: string;
  consoleSubtitle: string;
  consoleSections: SceneSection[];
};

function buildScenes(summary: PrototypeSummary): PrototypeScene[] {
  return [
    {
      id: "public-intake",
      tabLabel: "Public help",
      kicker: "Slide 01",
      title: "A public-facing legal help app that starts where distress actually begins.",
      copy:
        "The first presentation moment is trust: a survivor, family member, or PLV opens one bilingual screen, chooses help, uploads documents, and gets routed toward real district follow-up.",
      tone: "public",
      audience: "Survivors, families, PLVs, village workers, community organisers",
      promise:
        "Shortens the path from first contact to assigned legal or welfare support without forcing users into a complex form journey.",
      highlights: [
        "Bilingual Hindi and English entry points with helplines visible from the first screen.",
        "Supports report and document uploads for FIRs, ration cards, medical papers, or notices.",
        "Matches the request to a district fellow, lawyer, or welfare worker flow.",
      ],
      proof: [
        { label: "District catalogue", value: "38 Bihar districts" },
        { label: "Immediate helplines", value: "112 / 181 / 1098" },
        { label: "Support path", value: "Legal + welfare" },
      ],
      phoneTitle: "Jan Sahayak",
      phoneSubtitle: "Mobile-first public access to justice",
      phoneCards: [
        {
          eyebrow: "Primary action",
          title: "Get Help Now",
          meta: "Intake, district routing, urgent follow-up",
          tone: "accent",
          wide: true,
        },
        {
          eyebrow: "Library",
          title: "Government Schemes",
          meta: "Eligibility, documents, and application support",
          tone: "green",
        },
        {
          eyebrow: "Rights",
          title: "Know Your Rights",
          meta: "Acts, FAQs, and plain-language legal guidance",
          tone: "blue",
        },
        {
          eyebrow: "Learning",
          title: "PLV Training",
          meta: "Modules, quizzes, and volunteer onboarding",
          tone: "purple",
        },
      ],
      consoleTitle: "Presentation narrative",
      consoleSubtitle: "Lead with the public value proposition before showing operations.",
      consoleSections: [
        {
          title: "What the audience sees",
          copy:
            "A single entry screen that feels warm, local, and low-friction instead of a bureaucratic government portal.",
          tags: ["Bilingual", "Low-friction", "Presentation-safe"],
        },
        {
          title: "What happens behind the scenes",
          copy:
            "Uploads, triage, district assignment, and handoff to the right person can all be linked to the protected workspace later.",
          tags: ["Uploads", "District routing", "Case conversion"],
        },
      ],
    },
    {
      id: "rights-schemes",
      tabLabel: "Knowledge",
      kicker: "Slide 02",
      title: "Rights, schemes, and legal pathways are searchable like a field toolkit, not a legal database.",
      copy:
        "The second story is confidence. District fellows and community members can browse legal acts, scheme eligibility, and FAQs in a format built for action rather than citation worship.",
      tone: "public",
      audience: "PLVs, social workers, district fellows, first-generation litigants",
      promise:
        "Helps front-line teams move from confusion to the next concrete step, even before a lawyer is on the call.",
      highlights: [
        "Case-type and scheme guidance is organised around the problems people actually bring.",
        "PLV modules create a training bridge between legal knowledge and community action.",
        "Presentation flow shows how public education and intake reinforce each other.",
      ],
      proof: [
        { label: "Learning loop", value: "Rights + schemes + training" },
        { label: "User mode", value: "Searchable and guided" },
        { label: "Presenter angle", value: "Access before litigation" },
      ],
      phoneTitle: "Rights Library",
      phoneSubtitle: "Knowledge that supports action in the field",
      phoneCards: [
        {
          eyebrow: "Women",
          title: "Domestic Violence",
          meta: "Protection orders, residence rights, and immediate steps",
          tone: "accent",
        },
        {
          eyebrow: "SC/ST",
          title: "Atrocity Response",
          meta: "FIR, relief, compensation, and legal escalation",
          tone: "purple",
        },
        {
          eyebrow: "Welfare",
          title: "PDS and NFSA",
          meta: "Ration denial, documentation, and supply office path",
          tone: "green",
        },
        {
          eyebrow: "Training",
          title: "PLV Module",
          meta: "Quiz-based rights learning for community volunteers",
          tone: "blue",
        },
      ],
      consoleTitle: "Knowledge frame",
      consoleSubtitle: "Show how the platform teaches while it triages.",
      consoleSections: [
        {
          title: "Field readiness",
          copy:
            "A fellow in Katihar or Purnia should not need to remember every statute heading in a crisis. The system gives the first legal map immediately.",
          tags: ["Training-ready", "Plain language", "District use"],
        },
        {
          title: "Why it matters in a pitch",
          copy:
            "This is not only a case-management tool. It is also an access-to-justice and legal-literacy layer for the organisation.",
          tags: ["Access to justice", "Community trust"],
        },
      ],
    },
    {
      id: "pro-workspace",
      tabLabel: "Case ops",
      kicker: "Slide 03",
      title: "Jan Sahayak Pro turns scattered legal work into one protected command centre.",
      copy:
        "Once the presentation shifts from the public app to operations, the story becomes visibility: stale matters, hearings due, district ownership, and structured case intake all live in one place.",
      tone: "workspace",
      audience: "Litigation leads, district fellows, programme coordinators, funders",
      promise:
        "Makes it easier to see where the organisation is strong, where follow-up is slipping, and what needs attention today.",
      highlights: [
        "Case registration supports court selection, eCourts case-type catalogues, and file uploads.",
        "Dashboard surfaces stale matters, hearings this week, field momentum, and grant tracking.",
        "One workspace reduces the cost of context switching across email, sheets, and personal notebooks.",
      ],
      proof: [
        { label: "Active cases", value: String(summary.activeCases) },
        { label: "High-priority matters", value: String(summary.highPriorityCases) },
        { label: "Team on workspace", value: `${summary.teamSize} people` },
      ],
      phoneTitle: "Case intake",
      phoneSubtitle: "Court-aware registration and district accountability",
      phoneCards: [
        {
          eyebrow: "Court",
          title: "Patna High Court",
          meta: "Civil Writ, Criminal Misc., Letters Patent, and more",
          tone: "accent",
          wide: true,
        },
        {
          eyebrow: "Catalogue",
          title: "Supreme Court of India",
          meta: "SLPs, writs, appeals, transfers, review, curative",
          tone: "blue",
        },
        {
          eyebrow: "District",
          title: "Bihar eCourts",
          meta: "Sessions, JMFC, DV, NDPS, eviction, maintenance",
          tone: "green",
        },
        {
          eyebrow: "Documents",
          title: "Upload FIR / orders",
          meta: "Attach litigation papers inside the case record",
          tone: "purple",
        },
      ],
      consoleTitle: "Operations view",
      consoleSubtitle: "The legal team can finally see the docket as a system.",
      consoleSections: [
        {
          title: "Daily dashboard",
          copy:
            `The current prototype shows ${summary.activeCases} active matters alongside hearings due, district owners, and stale-case warnings in one operational rhythm.`,
          tags: ["Daily command view", "District accountability", "Protected admin"],
        },
        {
          title: "Case architecture",
          copy:
            "Case forms are structured around the actual forums the team uses, including Patna High Court, Supreme Court, and Bihar district courts.",
          tags: ["High Court", "SCI", "eCourts"],
        },
      ],
    },
    {
      id: "activity-pipeline",
      tabLabel: "Activity AI",
      kicker: "Slide 04",
      title: "The Activity AI Pipeline helps the team design field interventions with the same discipline as litigation.",
      copy:
        "The fourth story is repeatability. Camps, trainings, consultations, and district outreach stop being ad hoc because the system can generate a concept note, agenda, checklist, report skeleton, and follow-up pack.",
      tone: "pipeline",
      audience: "Programme leads, district fellows, donors, operations coordinators",
      promise:
        "Makes activities easier to plan, easier to document, and easier to turn into evidence for reports or campaign strategy.",
      highlights: [
        "Creates a full activity pack from a single planning form.",
        "Links planning, execution, and later reporting in one chain.",
        "Uses the word activity instead of event to match programme language.",
      ],
      proof: [
        { label: "Activities tracked", value: String(summary.totalActivities) },
        { label: "Beneficiaries reached", value: String(summary.beneficiariesReached) },
        { label: "Pipeline outputs", value: "6 generated artefacts" },
      ],
      phoneTitle: "Activity planning pipeline",
      phoneSubtitle: "Structured planning for district action",
      phoneCards: [
        {
          eyebrow: "Generated",
          title: "Concept Note",
          meta: "District context, objectives, audience, and outcomes",
          tone: "accent",
        },
        {
          eyebrow: "Generated",
          title: "Agenda",
          meta: "Opening, rights session, help desk, action planning",
          tone: "blue",
        },
        {
          eyebrow: "Generated",
          title: "Checklist",
          meta: "Venue, outreach, documentation, reporting",
          tone: "green",
        },
        {
          eyebrow: "Generated",
          title: "Social Copy",
          meta: "WhatsApp and public communication drafts",
          tone: "purple",
        },
      ],
      consoleTitle: "Planning to evidence",
      consoleSubtitle: "Position it as an operational multiplier, not a gimmick.",
      consoleSections: [
        {
          title: "Why funders care",
          copy:
            "Generated planning assets make field interventions easier to compare, replicate, and report across districts and months.",
          tags: ["Planning discipline", "Programme evidence", "Reusable templates"],
        },
        {
          title: "Why coordinators care",
          copy:
            "District teams get a ready-to-use skeleton instead of starting every camp or training from a blank document.",
          tags: ["Time saver", "District consistency"],
        },
      ],
    },
    {
      id: "reports-finance",
      tabLabel: "Reporting",
      kicker: "Slide 05",
      title: "Reporting and finance move from end-of-month scramble to a live narrative of work done.",
      copy:
        "The fifth story is credibility. Reports, uploaded documents, and finance records sit close enough to cases and activities that the organisation can explain impact with evidence instead of reconstructing it later.",
      tone: "workspace",
      audience: "Management, finance teams, grant partners, programme reviewers",
      promise:
        "Creates a cleaner bridge between casework, fieldwork, reporting, and the money used to deliver both.",
      highlights: [
        "Supports report uploads and supporting documents inside the reporting flow.",
        "Finance snapshots can sit next to programme outputs for a clearer monthly readout.",
        "The prototype makes donor and internal reporting feel like product features, not afterthoughts.",
      ],
      proof: [
        { label: "Grant pool tracked", value: summary.totalGrantsLabel },
        { label: "Expenses logged", value: summary.totalExpensesLabel },
        { label: "Narrative mode", value: "Donor + internal" },
      ],
      phoneTitle: "Reports and finance",
      phoneSubtitle: "Evidence, narrative, and spend in the same product",
      phoneCards: [
        {
          eyebrow: "Reports",
          title: "Upload support docs",
          meta: "Orders, photos, annexures, and field notes",
          tone: "accent",
          wide: true,
        },
        {
          eyebrow: "Narrative",
          title: "Donor progress draft",
          meta: "Cases, activities, team, and finance in one output",
          tone: "blue",
        },
        {
          eyebrow: "Finance",
          title: "Grant and expense view",
          meta: "Project, category, approver, and balance",
          tone: "green",
        },
      ],
      consoleTitle: "Evidence layer",
      consoleSubtitle: "This is where operational maturity becomes visible in a pitch.",
      consoleSections: [
        {
          title: "Reporting advantage",
          copy:
            "A presentation can show exactly how the same platform supports public services, casework, activity design, and back-office reporting.",
          tags: ["End-to-end", "Audit trail", "Narrative clarity"],
        },
        {
          title: "Finance signal",
          copy:
            "Track grants and expenses close to the work they enabled, rather than only in an external spreadsheet silo.",
          tags: ["Utilisation", "Programme finance", "Monthly rhythm"],
        },
      ],
    },
    {
      id: "ios-companion",
      tabLabel: "iOS app",
      kicker: "Slide 06",
      title: "The native iOS companion brings the same operating system into a mobile field-and-leadership experience.",
      copy:
        "The final story is portability. The native SwiftUI iOS version keeps the same legal taxonomy, activity pipeline, reporting structure, and local document handling for a cleaner executive or field demo.",
      tone: "ios",
      audience: "Leadership, field fellows, iPhone and iPad users, design reviewers",
      promise:
        "Extends the product beyond the browser while preserving the same mental model and district workflow.",
      highlights: [
        "Native dashboard, cases, activities, pipeline, reports, and finance tabs already exist in the SwiftUI scaffold.",
        "Offline-friendly local persistence and a document vault make the mobile concept feel credible.",
        "Useful as a companion surface for review meetings, field travel, or future mobile rollout.",
      ],
      proof: [
        { label: "Native tabs", value: "6 core screens" },
        { label: "Coverage", value: `${summary.districtCoverage} fellow districts` },
        { label: "Build direction", value: "SwiftUI starter ready" },
      ],
      phoneTitle: "Jan Sahayak Pro iOS",
      phoneSubtitle: "Native field and leadership companion",
      phoneCards: [
        {
          eyebrow: "Dashboard",
          title: "Command view",
          meta: "Hearings, stale matters, and monthly field rhythm",
          tone: "accent",
        },
        {
          eyebrow: "Cases",
          title: "Attach orders and notes",
          meta: "Case details, hearings, notes, and uploads",
          tone: "blue",
        },
        {
          eyebrow: "Pipeline",
          title: "Activity pack",
          meta: "Concept note, checklist, report template",
          tone: "green",
        },
        {
          eyebrow: "Reports",
          title: "Offline drafts",
          meta: "Save evidence-backed report drafts on device",
          tone: "purple",
        },
      ],
      consoleTitle: "Rollout narrative",
      consoleSubtitle: "End the presentation with platform ambition and portability.",
      consoleSections: [
        {
          title: "Why this matters",
          copy:
            "The iOS prototype shows that the product architecture is already strong enough to travel across surfaces without becoming a completely different system.",
          tags: ["Cross-surface design", "Offline-first direction", "Leadership demo"],
        },
        {
          title: "Next build story",
          copy:
            "Use the web workspace for operations today and the iOS companion as the roadmap for mobile field workflows tomorrow.",
          tags: ["Roadmap", "Mobile future", "Presentation close"],
        },
      ],
    },
  ];
}

export function PrototypePresentation({
  generatedOn,
  initialSceneId,
  summary,
}: PrototypePresentationProps) {
  const scenes = buildScenes(summary);
  const initialIndex = Math.max(
    0,
    scenes.findIndex((item) => item.id === initialSceneId),
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [presentationMode, setPresentationMode] = useState(true);
  const [isPending, startTransition] = useTransition();
  const scene = useDeferredValue(scenes[activeIndex]);

  const moveToScene = (nextIndex: number) => {
    startTransition(() => {
      setActiveIndex((nextIndex + scenes.length) % scenes.length);
    });
  };

  const handleKeyNavigation = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      moveToScene(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      moveToScene(activeIndex - 1);
    } else if (event.key.toLowerCase() === "p") {
      setPresentationMode((current) => !current);
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => {
      window.removeEventListener("keydown", handleKeyNavigation);
    };
  }, []);

  const handleAutoAdvance = useEffectEvent(() => {
    moveToScene(activeIndex + 1);
  });

  useEffect(() => {
    if (!presentationMode) {
      return;
    }

    const timer = window.setInterval(() => {
      handleAutoAdvance();
    }, 7000);

    return () => {
      window.clearInterval(timer);
    };
  }, [presentationMode]);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Jan Sahayak Presentation Prototype</span>
          <h1 className={styles.title}>
            A presentation-mode walkthrough of the public app, the Pro workspace, the Activity AI
            pipeline, and the native iOS companion.
          </h1>
          <p className={styles.lede}>
            This route is built for demos. It tells the story of Jan Sahayak as a connected access
            to justice platform rather than a collection of separate tools.
          </p>
          <div className={styles.actionRow}>
            <Link href="/" className="btn btn-primary">
              Open public app
            </Link>
            <Link href="/pro" className="btn btn-secondary">
              Open Pro workspace
            </Link>
            <button
              className="btn btn-ghost"
              onClick={() => setPresentationMode((current) => !current)}
              type="button"
            >
              {presentationMode ? "Pause presentation mode" : "Resume presentation mode"}
            </button>
          </div>
          <div className={styles.metaRow}>
            <span>Generated {generatedOn}</span>
            <span>Use Left/Right arrows to navigate</span>
            <span>{isPending ? "Switching slides..." : "Slides ready"}</span>
          </div>
        </div>

        <aside className={styles.heroPanel}>
          <div className={styles.summaryGrid}>
            <SummaryTile label="Active cases" value={String(summary.activeCases)} />
            <SummaryTile label="Beneficiaries reached" value={String(summary.beneficiariesReached)} />
            <SummaryTile label="Grant pool tracked" value={summary.totalGrantsLabel} />
            <SummaryTile label="District fellows live" value={String(summary.districtCoverage)} />
          </div>
        </aside>
      </section>

      <section className={styles.slidePicker}>
        {scenes.map((item, index) => (
          <button
            aria-pressed={activeIndex === index}
            className={styles.slideButton}
            data-active={activeIndex === index}
            key={item.id}
            onClick={() => moveToScene(index)}
            type="button"
          >
            <span className={styles.slideNumber}>{item.kicker}</span>
            <span className={styles.slideLabel}>{item.tabLabel}</span>
          </button>
        ))}
      </section>

      <section className={styles.stage} data-tone={scene.tone} id="scene-stage">
        <article className={styles.storyPanel}>
          <span className={styles.storyKicker}>{scene.kicker}</span>
          <h2 className={styles.storyTitle}>{scene.title}</h2>
          <p className={styles.storyCopy}>{scene.copy}</p>

          <div className={styles.storyMeta}>
            <div>
              <span className={styles.metaLabel}>Audience</span>
              <p>{scene.audience}</p>
            </div>
            <div>
              <span className={styles.metaLabel}>Promise</span>
              <p>{scene.promise}</p>
            </div>
          </div>

          <div className={styles.highlightBlock}>
            <span className={styles.metaLabel}>Why this screen matters in the presentation</span>
            <ul className={styles.highlightList}>
              {scene.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className={styles.proofGrid}>
            {scene.proof.map((proof) => (
              <div className={styles.proofCard} key={proof.label}>
                <span>{proof.label}</span>
                <strong>{proof.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <div className={styles.mockColumn}>
          <PhoneMock scene={scene} />
          <div className={styles.presenterTip}>
            <span className={styles.metaLabel}>Presenter note</span>
            <p>
              Use this mock phone to keep the audience oriented around the human journey while the
              desktop panel explains the operational payoff.
            </p>
          </div>
        </div>

        <ConsoleMock scene={scene} summary={summary} />
      </section>

      <section className={styles.roadmapSection}>
        <div className={styles.roadmapHeader}>
          <div>
            <span className={styles.eyebrow}>Presentation close</span>
            <h2 className={styles.roadmapTitle}>How to land the story in the room</h2>
          </div>
          <p className={styles.roadmapCopy}>
            Close by showing that Jan Sahayak is not only software. It is a field operating system
            for legal aid, community justice, reporting, and district accountability.
          </p>
        </div>

        <div className={styles.roadmapGrid}>
          <RoadmapCard
            index="01"
            title="Start with public access"
            copy="Lead with trust, low-friction intake, and why a survivor or PLV would actually use this."
          />
          <RoadmapCard
            index="02"
            title="Move to operational clarity"
            copy="Show how the protected workspace gives leaders one place to watch litigation and field momentum."
          />
          <RoadmapCard
            index="03"
            title="Show programme intelligence"
            copy="Use the Activity AI Pipeline, reports, and finance to frame the product as an organisational backbone."
          />
          <RoadmapCard
            index="04"
            title="End with platform ambition"
            copy="The iOS companion makes the product feel durable, portable, and ready for deeper rollout."
          />
        </div>
      </section>
    </main>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.summaryTile}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PhoneMock({ scene }: { scene: PrototypeScene }) {
  return (
    <div className={styles.phoneFrame}>
      <div className={styles.phoneBezel}>
        <div className={styles.phoneNotch} />
        <div className={styles.phoneHeader}>
          <div>
            <span className={styles.phoneEyebrow}>{scene.phoneTitle}</span>
            <h3>{scene.phoneSubtitle}</h3>
          </div>
          <div className={styles.signalDot} />
        </div>
        <div className={styles.phoneGrid}>
          {scene.phoneCards.map((card) => (
            <article className={styles.phoneCard} data-tone={card.tone} data-wide={card.wide} key={card.title}>
              <span>{card.eyebrow}</span>
              <strong>{card.title}</strong>
              <p>{card.meta}</p>
            </article>
          ))}
        </div>
        <div className={styles.phoneFooter}>
          <span>Help</span>
          <span>Track</span>
          <span>Learn</span>
          <span>Refer</span>
        </div>
      </div>
    </div>
  );
}

function ConsoleMock({
  scene,
  summary,
}: {
  scene: PrototypeScene;
  summary: PrototypeSummary;
}) {
  return (
    <aside className={styles.consoleFrame}>
      <div className={styles.consoleTopbar}>
        <div>
          <span className={styles.consoleEyebrow}>{scene.consoleTitle}</span>
          <h3>{scene.consoleSubtitle}</h3>
        </div>
        <div className={styles.consolePills}>
          <span>Demo mode</span>
          <span>Presentation safe</span>
          <span>Live route</span>
        </div>
      </div>

      <div className={styles.consoleMetrics}>
        <SummaryTile label="Cases" value={String(summary.activeCases)} />
        <SummaryTile label="Activities" value={String(summary.totalActivities)} />
        <SummaryTile label="Grants" value={summary.totalGrantsLabel} />
        <SummaryTile label="Spend" value={summary.totalExpensesLabel} />
      </div>

      <div className={styles.consoleSectionList}>
        {scene.consoleSections.map((section) => (
          <section className={styles.consoleSection} key={section.title}>
            <div className={styles.consoleSectionHeader}>
              <h4>{section.title}</h4>
              {section.tags?.length ? (
                <div className={styles.consoleTags}>
                  {section.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              ) : null}
            </div>
            <p>{section.copy}</p>
          </section>
        ))}
      </div>
    </aside>
  );
}

function RoadmapCard({
  copy,
  index,
  title,
}: {
  copy: string;
  index: string;
  title: string;
}) {
  return (
    <article className={styles.roadmapCard}>
      <span className={styles.roadmapIndex}>{index}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}
