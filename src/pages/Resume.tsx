import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  MapPin,
  Calendar,
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
    title: "Senior Cloud & Data Platform Engineer",
    company: "Capgemini B.V.",
    period: "February 2023 – May 2026",
    location: "Utrecht, Netherlands",
    bullets: [
      "Designed and delivered self-service cloud and resilience platforms for insurance clients, automating manual, approval-heavy processes into secure, role-based workflows.",
      "Delivered Azure Frontdoor CDN and Application Gateway automation via AVM Bicep modules.",
      "Developed an application onboarding service written in Python (GO for performance-critical paths), automating team provisioning and access management at scale. Maintained development tooling platform (SonarQube, Nexus Lifecycle, Twistlock).",
      "Contributed to automatic account creation using service SDKs such as AWS Organizations, CodePipeline and CodeBuild via CDK TypeScript.",
      "Built an Elevated Privileges feature into the platform, granting temporary admin access for a set period using AWS Systems Manager Documents.",
      "Own and administer the company's cloud account, allocating usage and cost across teams, reconciling and expensing invoices by team/project.",
      "Set up CloudWatch alarms to monitor cloud spend and resource usage, enabling early alerts on anomalies and cost overruns.",
    ],
  },
  {
    title: "Senior Software Engineer",
    company: "Capgemini B.V.",
    period: "October 2021 – February 2023",
    location: "Utrecht, Netherlands",
    bullets: [
      "Built Python-based ETL pipelines in Azure Databricks (PySpark) to integrate structured and semi-structured data, persisting processed outputs in SQL Server and sharing them with the central team via ADLS, while maintaining data lineage graphs.",
      "Delivered multi-region cloud infrastructure and disaster-recovery capabilities for insurance and financial-services clients across AWS and Azure environments.",
      "Conducted architecture assessments and platform modernization initiatives for banking and public-sector clients, including infrastructure-as-code delivery and security automation.",
      "Managed AMI Bakery Process for customized EC2 machine images using Python-based automation, ensuring integration with SonarQube and Nexus quality gates.",
    ],
  },
  {
    title: "Cloud Engineer",
    company: "Commencis",
    period: "June 2020 – August 2021",
    location: "Istanbul, Turkey",
    summary:
      "Python-first automation of cloud services for MLOps and DataOps workflows. Redshift DWH management. Data wrangling with ETL tools.",
    bullets: [
      "Serverless frameworks such as CloudFormation and CDK for provisioning infrastructure components.",
      "Contributed to SOWs and HLD documents. Assessed risk factors.",
      "Athena and QuickSight dashboard analysis. Cloud Intelligence dashboard.",
      "Monthly and weekly cost reporting dashboard using Python Lambda functions.",
      "EMR cluster automation and performance optimization.",
      "SQS, S3 event subscription models.",
      "ECS Fargate, ELB container workloads migration. Bitbucket, Bamboo for CI/CD.",
    ],
  },
  {
    title: "Data Engineer",
    company: "NTT Data Business Solutions",
    period: "November 2018 – June 2020",
    location: "Istanbul, Turkey",
    summary:
      "Contributed to several initiatives and partnerships such as BSH chatbot, Mercedes Benz chatbot (NLP pipelines in Python) and Carrefour mask detection (computer vision, COVID-19).",
  },
];

const competencies = [
  {
    name: "Cost Optimization",
    description:
      "Design and architecture of scalable, right-sized infrastructure and evaluates make/buy decisions with TCO awareness.",
  },
  {
    name: "Production Readiness",
    description:
      "Designs platforms with reliability, observability, security, and operational excellence as first-class concerns.",
  },
  {
    name: "Platform as a Product",
    description:
      "Treats internal platforms as products with developer experience, onboarding, and adoption as KPIs.",
  },
  {
    name: "Mentoring & Leadership",
    description:
      "Uplifts team engineering standards through code reviews, documentation, and hands-on coaching.",
  },
];

const skills = {
  "Cloud & Infrastructure": [
    "AWS",
    "Azure",
    "GCP",
    "Kubernetes",
    "Terraform",
    "Bicep",
    "Helm",
    "EKS",
  ],
  "Languages & Frameworks": [
    "TypeScript",
    "GO",
    "Advanced Python",
    "Django",
    "FastAPI",
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
};

const certifications = [
  { name: "AZ-900", description: "Microsoft Azure Fundamentals" },
  { name: "AZ-104", description: "Azure Administrator Associate" },
  { name: "AWS SAA-C03", description: "AWS Certified Solutions Architect – Associate" },
  { name: "ITILv4", description: "" },
];

const languages = [
  { name: "Turkish", level: "Native" },
  { name: "English", level: "Full Professional Proficiency" },
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
                Senior Platform Engineer{" "}
                <span className="text-foreground/40">·</span> 8+ Years of
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
                Senior Platform Engineer with 8+ years of experience designing
                and operating cloud-native platforms, developer tooling
                ecosystems, and infrastructure automation solutions across
                banking, insurance, and public-sector environments. Proficient
                in Python (Django, scripting, automation, data pipelines),
                expert in multi-cloud infrastructure (AWS &amp; Azure),
                Kubernetes-based workloads, infrastructure as code (Terraform,
                Bicep, CDK), and CI/CD platform delivery.
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

            {/* Core Competencies */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Award size={20} className="text-accent" />
                <h2 className="text-2xl font-bold text-foreground">
                  Core Competencies
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {competencies.map((c) => (
                  <div
                    key={c.name}
                    className="rounded-2xl border border-border/50 bg-card p-5"
                  >
                    <h3 className="text-sm font-medium text-foreground mb-2">
                      {c.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {c.description}
                    </p>
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
                      {c.description && (
                        <span className="text-muted-foreground">
                          — {c.description}
                        </span>
                      )}
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
