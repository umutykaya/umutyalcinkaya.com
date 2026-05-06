import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Phone,
  MapPin,
  Calendar,
  Download,
} from "lucide-react";
import BackToHome from "@/components/BackToHome";

type Assignment = {
  title: string;
  client: string;
  period: string;
  location: string;
  bullets: string[];
};

type Job = {
  title: string;
  company: string;
  period: string;
  location: string;
  summary?: string;
  bullets?: string[];
  assignments?: Assignment[];
};

const experience: Job[] = [
  {
    title: "Senior Software Engineer",
    company: "Capgemini B.V.",
    period: "October 2021 – May 2026",
    location: "Utrecht, Netherlands",
    summary:
      "Consultancy experience in custom AI agents, data engineering, data management and governance. Mainly provide tangible solutions related to data pipelines. Harvesting data lineage for regulatory purposes as part of financial services BENELUX.",
    assignments: [
      {
        title: "Full Stack Engineer",
        client: "Allianz Insurance",
        period: "November 2025 – February 2026",
        location: "Cologne, Germany",
        bullets: [
          "Built a GenAI self-service Resilience Platform with chaos and disaster recovery scenarios, using Singleton pattern, Neo4J & MongoDB reconciliation, Secure API and Django practices.",
          "Designed and conceptualized knowledge graphs with embedded programming.",
          "Tech Stack: AWS Bedrock, Azure CosmosDB, MongoDB, EKS, Helm, IBM Context Forge (MCP Server), Terraform, TypeScript.",
        ],
      },
      {
        title: "Data Platform Engineer",
        client: "Keytrade Bank",
        period: "July 2025 – October 2025",
        location: "Brussels, Belgium",
        bullets: [
          "Participated in and conducted workshops at client office in Belgium.",
          "Prepared business, technical, risk compliance & security requirements documents.",
          "Assessed current state architecture and identified gaps through comprehensive analysis of modern architectural needs.",
        ],
      },
      {
        title: "Solution Engineer",
        client: "Stichting Pensioen Funds",
        period: "December 2024 – June 2025",
        location: "Utrecht, Netherlands",
        bullets: [
          "Built and maintained infrastructure modules with a DevOps approach.",
          "Delivered Azure Frontdoor CDN and Application Gateway automation via AVM Bicep modules.",
          "Contributed to solution architecture and modernization of a governmental pension funds platform.",
        ],
      },
      {
        title: "Solution Engineer",
        client: "Allianz Insurance",
        period: "September 2024 – December 2024",
        location: "Paris, France",
        bullets: [
          "Built a multi-regional, multi-account platform leveraging AWS Deployment Framework (ADF).",
          "Implemented a Disaster Recovery Plan and provided a strategic roadmap.",
          "Adopted automation-first approach using CDK TypeScript-based infrastructure.",
        ],
      },
      {
        title: "Platform Integration Engineer",
        client: "ABN AMRO Bank N.V.",
        period: "July 2023 – September 2024",
        location: "Amsterdam, Netherlands",
        bullets: [
          "Conducted impact analysis of infrastructure components including WAF, GuardDuty, and risk controls.",
          "Developed an application onboarding service written in GO.",
          "Maintained development tooling platform: SonarQube, Nexus Lifecycle, Twistlock.",
        ],
      },
      {
        title: "Platform Integration Engineer",
        client: "ABN AMRO Clearing Bank",
        period: "October 2022 – June 2023",
        location: "Amsterdam, Netherlands",
        bullets: [
          "Managed AMI Bakery Process for customized EC2 machine images, ensuring integration with SonarQube and Nexus.",
          "Designed and implemented event-driven architectures using custom constructs.",
        ],
      },
      {
        title: "Data Engineer",
        client: "ABN AMRO Bank N.V.",
        period: "October 2021 – October 2022",
        location: "Amsterdam, Netherlands",
        bullets: [
          "Integrated structured and semi-structured data sources to maintain data lineage graphs in Azure Databricks.",
          "Persisted data in SQL Server and shared with central team via ADLS (Azure Data Lake Storage).",
        ],
      },
    ],
  },
];

const skills = {
  "Cloud & Infrastructure": [
    "AWS",
    "Azure",
    "GCP",
    "Kubernetes",
    "Terraform",
    "Biceps",
    "Helm",
    "EKS",
  ],
  "Languages & Frameworks": [
    "TypeScript",
    "GO",
    "Advanced Python",
    "Django",
    "Flask",
    "PowerShell",
    "CDK",
  ],
  "Data & Databases": [
    "Azure Databricks",
    "Azure Data Factory",
    "MongoDB",
    "Neo4J",
    "Azure CosmosDB",
    "SQL Server",
    "ADLS",
  ],
  "Security & DevOps": [
    "Azure DevOps Pipelines",
    "Azure KeyVault",
    "Azure Cloud Monitoring",
    "Azure Network",
    "WAF",
    "GuardDuty",
  ],
  "AI / GenAI": [
    "AWS Bedrock",
    "IBM Context Forge (MCP Server)",
    "GenAI Platform Engineering",
  ],
};

const certifications = [
  { name: "AZ-900", description: "Microsoft Azure Fundamentals" },
  { name: "AWS SAA-C03", description: "AWS Certified Solutions Architect – Associate" },
  { name: "ITILv4", description: "" },
  { name: "Gen AI Campus", description: "GEN AI Training Track | FS CCA Europe" },
  { name: "Microsoft GenAI", description: "Certification & Credentials" },
];

const languages = [
  { name: "Turkish", level: "Native" },
  { name: "English", level: "Full Professional Proficiency" },
  { name: "Spanish", level: "Daily, Informal Speaking" },
  { name: "French", level: "Beginner" },
  { name: "Dutch", level: "Beginner" },
];

const Resume = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />

        <div className="pt-24 pb-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <BackToHome />

            {/* Header */}
            <header className="mb-12">
              <p className="text-sm font-mono text-accent mb-3">// Resume</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                Umut Yalcinkaya
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Full Stack Platform Engineer{" "}
                <span className="text-foreground/40">·</span> 10+ Years of
                Experience
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-accent" />
                  Netherlands
                </span>
              </div>
            </header>

            {/* Introduction */}
            <section className="mb-12 rounded-2xl border border-border/50 bg-card p-6">
              <p className="text-muted-foreground leading-relaxed">
                With significant experience as a Full Stack Platform Engineer, I
                am passionate about automation and its transformative potential.
                I aim to push the boundaries of what can be accomplished and
                contribute to a future where automation is seamlessly woven into
                daily life, driving efficiency, sustainability, and growth.
                Proactively, I am prepared to launch and lead innovative
                projects. I thrive in collaborative settings, valuing teamwork
                and the collective contributions of all members. Furthermore, I
                prioritize leveraging a team's Agile maturity to deliver
                successful outcomes.
              </p>
            </section>

            {/* Work Experience */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase size={20} className="text-accent" />
                <h2 className="text-2xl font-bold text-foreground">
                  Work Experience
                </h2>
              </div>

              <div className="relative pl-6 border-l-2 border-border/50 space-y-10">
                {experience.map((job, i) => (
                  <div key={i} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[calc(1.5rem+5px)] top-1 w-2.5 h-2.5 rounded-full bg-accent" />

                    <div className="rounded-2xl border border-border/50 bg-card p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {job.title}
                          </h3>
                          <p className="text-sm text-accent">{job.company}</p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-0.5 text-xs text-muted-foreground shrink-0">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {job.period}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {job.location}
                          </span>
                        </div>
                      </div>
                      {job.summary && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {job.summary}
                        </p>
                      )}
                      {job.bullets && (
                        <ul className="space-y-2">
                          {job.bullets.map((b, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                      {job.assignments && (
                        <div className="mt-4 space-y-4 border-l-2 border-border/40 pl-4">
                          {job.assignments.map((a, k) => (
                            <div
                              key={k}
                              className="rounded-xl border border-border/40 bg-background/40 p-4"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground">
                                    {a.title}
                                  </h3>
                                  <p className="text-sm text-accent">
                                    {a.client}
                                  </p>
                                </div>
                                <div className="flex flex-col sm:items-end gap-0.5 text-xs text-muted-foreground shrink-0">
                                  <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {a.period}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    {a.location}
                                  </span>
                                </div>
                              </div>
                              <ul className="space-y-1.5">
                                {a.bullets.map((b, j) => (
                                  <li
                                    key={j}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                  >
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                                    {b}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Award size={20} className="text-accent" />
                <h2 className="text-2xl font-bold text-foreground">
                  Technology Skills
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(skills).map(([category, items]) => (
                  <div
                    key={category}
                    className="rounded-2xl border border-border/50 bg-card p-5"
                  >
                    <h3 className="text-sm font-medium text-foreground mb-3">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education & Certifications row */}
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {/* Education */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap size={20} className="text-accent" />
                  <h2 className="text-lg font-bold text-foreground">Education</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      MSc. of Business Administration
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Executive Program Management Studies (EPMS) — AI and
                      Innovation Track · University of Amsterdam, Netherlands ·
                      2026
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      BSc. of Software Engineering
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Executive Faculty of Engineering and Natural Sciences ·
                      Bahcesehir University, Turkey · 2018
                    </p>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award size={20} className="text-accent" />
                  <h2 className="text-lg font-bold text-foreground">
                    Certifications
                  </h2>
                </div>
                <ul className="space-y-2">
                  {certifications.map((c) => (
                    <li key={c.name} className="text-sm">
                      <span className="font-medium text-foreground">
                        {c.name}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        — {c.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Languages */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Globe size={20} className="text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Languages</h2>
              </div>

              <div className="flex flex-wrap gap-4">
                {languages.map((l) => (
                  <div
                    key={l.name}
                    className="rounded-2xl border border-border/50 bg-card px-5 py-4"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {l.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{l.level}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Resume;
