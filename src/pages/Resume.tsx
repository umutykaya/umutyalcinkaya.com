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
  ArrowLeft,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";

const experience = [
  {
    title: "Full Stack Engineer",
    company: "Allianz Insurance",
    period: "November 2025 – February 2026",
    location: "Cologne, Germany (Remote)",
    bullets: [
      "Building GenAI self-service Resilience Platform where chaos engineering and disaster recovery scenarios triggered.",
      "Design and conceptualize knowledge graph.",
      "Rapidly prototyped client needs.",
      "Fullstack platform implementation of React, Django and Secure API practises.",
      "Backend crafted with Singleton pattern Neo4J, and MongoDB reconciliation.",
      "Technology stack enriched further using AWS Bedrock, Azure CosmosDB, MongoDB, AWS EKS, IBM Context Forge (MCP Server), Terraform and TypeScript.",
    ],
  },
  {
    title: "Platform Engineer",
    company: "Keytrade Bank",
    period: "July 2025 – October 2025",
    location: "Brussels, Belgium (Hybrid)",
    bullets: [
      "Participate in workshops and conduct questionnaires at the client office in Brussels, Belgium.",
      "Prepare business, technical, risk compliance, and security requirements documents.",
      "Plan deliverables and contribute to the future state of implementation by evaluating current state architecture.",
      "Detect modern architectural needs, explain gaps to achieve excellence through comprehensive analysis.",
      "Define Azure services to be used such as Databricks, Microsoft Fabrics, AI Foundry, Collate and Wherescape integration scenarios.",
    ],
  },
  {
    title: "Platform Engineer",
    company: "Stichting Pensioen Funds",
    period: "December 2024 – June 2025",
    location: "Utrecht, Netherlands (Remote)",
    bullets: [
      "Building and maintaining infrastructure modules with a DevOps approach.",
      "Delivering components such as Azure Front Door CDN and Application Gateway automation by constructing AVM Bicep modules.",
      "Contributing to solution architecture and modernization of a governmental pension funds platform.",
    ],
  },
  {
    title: "Platform Engineer",
    company: "Allianz Insurance",
    period: "September 2024 – December 2024",
    location: "Paris, France (Remote)",
    bullets: [
      "Built a newly created account and platform comprising multi-regional, multi-account deployments using AWS Deployment Framework (ADF).",
      "Contributed to an open-source project to adapt decommissioned AWS services (CodeCommit, Cloud9).",
      "Implemented a Disaster Recovery Plan and provided a strategic roadmap.",
      "Adopted an automation-first approach to minimize manual provisioning of platform resources.",
      "Implemented CDK TypeScript-based infrastructure to cover the majority of administrative needs.",
      "Architected and guided project stakeholders to successfully migrate to a microservice approach.",
    ],
  },
  {
    title: "Platform Engineer",
    company: "ABN AMRO Bank N.V.",
    period: "July 2023 – September 2024",
    location: "Amsterdam, Netherlands",
    bullets: [
      "Conducted impact analysis of current infrastructure components including WAF, GuardDuty, and risk controls.",
      "Facilitated adoption and migration of environments from AWS to Azure, including cloud-to-cloud and on-premises-to-cloud transitions.",
      "Created cloud-native applications and built reusable components.",
      "Developed an application onboarding service written in Go.",
      "Provided incident support and maintained the development tooling platform (SonarQube, Nexus Lifecycle, Twistlock).",
    ],
  },
  {
    title: "Platform Engineer",
    company: "ABN AMRO Clearing Bank",
    period: "October 2022 – June 2023",
    location: "Amsterdam, Netherlands",
    bullets: [
      "Managed the creation and configuration of customized Amazon Machine Images for EC2 instances, streamlining deployment within AWS.",
      "Designed and implemented event-driven architectures using custom constructs, enabling scalable and efficient real-time systems.",
      "Collaborated closely with the security team to ensure effective patch management for cloud infrastructure.",
    ],
  },
  {
    title: "Data Engineer",
    company: "ABN AMRO Bank N.V.",
    period: "October 2021 – October 2022",
    location: "Amsterdam, Netherlands",
    bullets: [
      "Integrated structured and semi-structured data sources to maintain data lineage graphs in Azure Databricks.",
      "Persisted data in SQL Server and shared it with a central team via ADLS (Azure Data Lake Storage).",
      "Managed application lifecycle using ARM Templates and CI/CD pipelines in Azure DevOps.",
      "Orchestrated modules through Azure Data Factory.",
    ],
  },
  {
    title: "Cloud & Data Engineer",
    company: "Miscellaneous experience",
    period: "October 2018 – October 2021",
    location: "Istanbul, Turkey & Amsterdam, Netherlands",
    bullets: [
      "Designed and maintained ETL pipelines using Python and SQL for data ingestion across structured and semi-structured sources.",
      "Built and deployed REST APIs with Spring Boot and Java to serve internal data products.",
      "Provisioned and managed cloud infrastructure on AWS and Azure, including EC2, S3, Lambda, and Azure Functions.",
      "Automated deployment workflows using Docker, CI/CD pipelines, and shell scripting on Linux environments.",
      "Administered relational and NoSQL databases, ensuring data quality and availability for downstream consumers.",
      "Collaborated with cross-functional teams following Agile methodologies to deliver data-driven solutions.",
    ],
  },
];

const skills = {
  "Cloud & Infrastructure": ["AWS", "Azure", "Databricks", "GCP", "Terraform", "Bicep", "Serverless", "Azure Network"],
  "Development & DevOps": ["CI/CD", "Biceps", "Azure Data Factory", "Kubernetes", "Docker", "Agile (Scrum, Kanban)", "ITILv4", "Azure DevOps"],
  "Data & Other": ["Advanced Python, Django, Flask", "SQL, NoSQL", "Azure Keyvault", "REST APIs", "GO", "Spring Boot, Java", "TypeScript", "Linux Administration"],
};

const certifications = [
  { name: "AZ-900", description: "Microsoft Azure Fundamentals" },
  { name: "AWS SAA-C03", description: "AWS Certified Solutions Architect – Associate" },
];

const languages = [
  { name: "Turkish", level: "Native" },
  { name: "English", level: "Full professional proficiency" },
  { name: "Spanish", level: "Daily, informal speaking proficiency" },
  { name: "French", level: "Beginner, limited informal conversation proficiency" },
];

const Resume = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />

        <div className="pt-24 pb-16 px-6">
          <div className="container mx-auto max-w-4xl">
            {/* Back link */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

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
                As an experienced Full Stack Platform Engineer, I am passionate about
                automation and its transformative potential — pushing the
                boundaries of what is possible and contributing to a future where
                automation is seamlessly integrated into our lives, creating a more
                efficient, sustainable, and prosperous world. With a proactive
                approach, I am always eager to initiate and lead potential projects.
                I thrive as a team player, valuing collaboration and emphasizing
                collective team efforts. I am keen on leveraging a team's Agile
                maturity level to drive successful outcomes.
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

              <div className="grid sm:grid-cols-3 gap-4">
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
                      MSc. Business Administration — EPMS
                    </p>
                    <p className="text-sm text-muted-foreground">
                      University of Amsterdam, Amsterdam Business School — Feb 2026 – Present
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      BSc. Software Engineering
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Bahcesehir University, Istanbul — 2018
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
