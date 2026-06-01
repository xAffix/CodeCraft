# Product Requirements Document (PRD): CodeCraft 🚀

**Version:** 1.1 (Expanded)
**Status:** Draft
**Target Launch:** MVP (Month 6)
**Author:** Gemini CLI / CodeCraft Strategy Team

---

## 1. Executive Summary & Vision
CodeCraft is an "Industrial Metaverse" for developers. It is an industry-simulation platform designed to bridge the gap between academic theory and professional engineering practice. Unlike traditional EdTech that relies on video lectures and isolated coding puzzles, CodeCraft provides a high-fidelity "simulated workplace." Students learn by joining a simulated tech company, resolving real tickets within a complex codebase, managing production-like outages, and collaborating with AI-driven stakeholders under realistic deadlines.

**The Vision:** To become the global standard for verifying "job readiness" in software engineering, making traditional technical interviews and theoretical university lab sessions obsolete.

---

## 2. Problem Statement & Market Context
*   **The "Academic Gap":** Fresh graduates possess theoretical knowledge (DSA, syntax) but lack the practical context to navigate large codebases, handle technical debt, or communicate effectively in an agile team.
*   **The "Hiring Paradox":** Companies struggle to find "job-ready" talent, leading to expensive 3–6 month training periods for new hires. Traditional coding rounds (LeetCode) filter for algorithmic memorization, not on-the-job capability.
*   **The "Engagement Crisis":** Current EdTech completion rates hover around 10-15%. Students abandon self-paced courses because they lack stakes, team dynamics, and realistic consequences.

---

## 3. Goals & Objectives

### 3.1 Business Goals
*   **Monetization (B2C):** Achieve ₹60L MRR within 12 months post-MVP launch via student subscriptions.
*   **Monetization (B2B):** Secure 20 corporate clients for 'HireReady' within Year 2.
*   **Monetization (B2B2C):** Onboard 10 engineering colleges to 'CollegeBridge' within Year 2.

### 3.2 Product Objectives
*   Deliver a seamless, low-latency browser-based IDE experience.
*   Create an AI Tech Lead that provides semantic, architecture-aware code reviews within 60 seconds.
*   Build a dynamic "Proof of Competence" portfolio that employers trust more than a standard resume.

---

## 4. User Personas & User Journeys

### A. The Student (Aarav, 4th Year CS)
*   **Needs:** Real-world projects, mentor feedback, a portfolio that stands out, a clear path to employment.
*   **Pain Point:** Frustrated by self-paced courses that lack stakes or context. Feeling unprepared for actual job interviews.
*   **User Journey (SimWork):**
    1. Aarav logs in and is "hired" by a simulated startup (e.g., "FinTechFast").
    2. He is onboarded via Sim-Slack, meeting his AI Manager and AI Teammates.
    3. He receives his first Jira ticket: "Fix pagination bug on the transaction history API."
    4. Aarav clones the repo in the browser IDE, investigates the large codebase, and writes the fix.
    5. He opens a Pull Request. The AI Tech Lead rejects it, pointing out a potential N+1 query issue.
    6. Aarav refactors, gets the PR approved, merges, and sees his "Trust Score" increase.

### B. The Recruiter/Hiring Manager (Sarah, Mid-Size Tech Company)
*   **Needs:** High-signal data on a candidate's debugging skills, code quality, and ability to take feedback.
*   **Pain Point:** Wasting engineering hours conducting technical interviews on candidates who look good on paper but can't code in a team setting.
*   **User Journey (HireReady):**
    1. Sarah defines a role: "Junior React Developer" and selects the relevant CodeCraft assessment track.
    2. Candidates complete a 3-day simulated sprint instead of a LeetCode test.
    3. Sarah logs into the dashboard to review candidates. Instead of a score of "85/100", she sees a timeline: "Candidate A solved the bug in 2 hours, wrote comprehensive tests, and adapted perfectly to the AI Lead's feedback regarding state management."

### C. The Faculty Head (Prof. Sharma, HOD Engineering)
*   **Needs:** Curriculum alignment with current industry trends, automated student tracking, improved placement metrics.
*   **Pain Point:** Outdated lab manuals, difficulty grading code subjectively, pressure from university leadership to improve placements.
*   **User Journey (CollegeBridge):**
    1. Prof. Sharma assigns a 4-week CodeCraft simulation as the final lab project.
    2. He views a real-time heatmap dashboard showing which students are excelling at API design vs. struggling with Git workflows.
    3. He exports automated grading reports based on the students' Trust Scores and merged PRs.

---

## 5. Detailed Functional Specifications

### 5.1 SimWork (The Core Engine)
*   **Virtual IDE:** Embedded Monaco Editor (VS Code core) tailored for web. Must support syntax highlighting, basic IntelliSense, and integrated terminal via WebSockets to a secure backend container.
*   **Sim-Jira (Ticket Board):** Kanban board showing 'To Do', 'In Progress', 'In Review', 'Done'. Tickets must include realistic context, acceptance criteria, and occasional ambiguity to test clarifying questions.
*   **Sim-Slack (Communication Hub):** Chat interface where AI personas interact with the user.
    *   *AI PM:* Asks for status updates, changes requirements mid-sprint.
    *   *AI Peer Developer:* Might ask the user for help debugging something, testing the user's ability to read others' code.
*   **The Chaos Engine:** A deterministic event scheduler that injects realism.
    *   *Event Type A (PagerDuty):* "Production database is slow." User must pause current ticket and investigate provided logs.
    *   *Event Type B (Scope Creep):* PM updates a ticket while it's in progress, adding a new requirement.
    *   *Event Type C (Merge Conflict):* An AI teammate merges code that conflicts with the user's branch, forcing the user to resolve it.

### 5.2 The AI Tech Lead (Deep Tech Reviewer)
*   **Context-Aware Analysis:** The LLM must be provided with the user's diff AND the relevant surrounding files (via RAG) to understand the architectural impact.
*   **Multi-Faceted Review:**
    *   *Syntax & Linting:* (Handled by standard tools first, to save LLM costs).
    *   *Semantic Logic:* Does this actually solve the Jira ticket's acceptance criteria?
    *   *Performance:* Are there obvious bottlenecks (e.g., inefficient loops, unindexed queries)?
    *   *Security:* Does this introduce vulnerabilities (e.g., unsanitized inputs)?
*   **Persona Engine:** The tone of the review is dictated by the selected persona (e.g., "The Pedantic Architect" will block PRs for minor naming convention violations, preparing students for strict environments).

### 5.3 Assessment & Progression Systems
*   **The Trust Score:** A dynamic rating (0-1000) that fluctuates based on:
    *   Time to resolution vs. estimated effort.
    *   Number of PR iterations required before approval.
    *   Successful handling of Chaos Engine events.
    *   Quality of written communication in Sim-Slack/PR descriptions.
*   **Skill Graph:** A radar chart mapping specific competencies (e.g., 'React Hooks', 'SQL Optimization', 'Git Workflow', 'Communication').
*   **Verified Work Portfolio:** A publicly shareable page (like a specialized GitHub profile) that shows a "Replay" of a solved ticket, demonstrating the user's thought process and iteration.

---

## 6. Technical Architecture & Data Model

### 6.1 High-Level Architecture
*   **Client:** React.js single-page application. Handles UI, Monaco IDE instantiation, and WebSocket connections for terminal/chat.
*   **API Gateway:** Node.js/Express. Handles auth, routing, and rate limiting.
*   **Workspace Manager:** A microservice responsible for spinning up and tearing down isolated Docker containers (using Kubernetes or AWS ECS) for each user's coding environment.
*   **Code Execution Engine:** Integration with Judge0 for fast, isolated script execution, supplemented by the Workspace Manager for full-app compilation/running.
*   **AI Orchestrator:** Python service (FastAPI) that interfaces with LLMs (GPT-4o/Claude 3.5). It utilizes LangChain/LlamaIndex for RAG against the simulated codebases to provide accurate PR reviews.
*   **Database:** Supabase (PostgreSQL).

### 6.2 Core Data Entities (Draft)
*   `User`: ID, Role (Student/Recruiter/Admin), TrustScore, SubscriptionStatus.
*   `Simulation_Company`: ID, Name, TechStack, PersonaProfiles (The AI characters).
*   `Ticket`: ID, CompanyID, Title, Description, AcceptanceCriteria, Difficulty.
*   `Workspace`: ID, UserID, ContainerInstanceID, CurrentState.
*   `Pull_Request`: ID, WorkspaceID, TicketID, DiffSnapshot, Status (Open/Approved/Rejected).
*   `Review_Comment`: ID, PullRequestID, AI_Persona_ID, LineNumber, CommentText.

---

## 7. Go-To-Market (GTM) Strategy

### Phase 1: Build & Validate (Months 1–6)
*   **Focus:** Core IDE loop and one polished track (e.g., Full Stack Web Dev).
*   **Distribution:** Partner with student developer clubs in Tier-2/3 colleges for a closed beta.
*   **Metric of Success:** 500 active beta users, high NPS (>50), and at least 5 documented case studies of students landing jobs using their CodeCraft portfolio.

### Phase 2: B2C Monetization & Virality (Months 7–12)
*   **Pricing:** Introduce ₹1,200/month subscription.
*   **Growth Loop:** "Proof of Work" sharing. When students share their verified portfolio on LinkedIn, it acts as an inbound marketing engine.
*   **Content Marketing:** Publish "State of Fresher Hiring" reports based on platform data to build authority.

### Phase 3: B2B Expansion (Year 2)
*   **HireReady Launch:** Use the pool of high-performing students as a talent marketplace. Approach mid-size startups: "Don't pay for recruitment ads; test candidates on CodeCraft or hire directly from our top 5%."
*   **CollegeBridge Launch:** Sell bulk licenses to colleges. Pitch: "Improve your NAAC accreditation and placement rates instantly."

---

## 8. Metrics & Analytics (KPIs)

### Product Engagement
*   **WAU/MAU Ratio:** Target > 40%.
*   **Average Session Length:** Target > 45 minutes (indicating deep work, not just casual browsing).
*   **Ticket Completion Rate:** % of started tickets that are merged.

### Business Outcomes
*   **B2C Conversion Rate:** % of free trial/beta users converting to paid.
*   **Placement Rate (The North Star):** % of users who land a relevant job within 3 months of hitting a "Senior" Trust Score.
*   **B2B Trial Conversion:** % of companies that purchase HireReady after a pilot.

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **High Infrastructure Costs** (LLM API calls and Docker containers) | High | Aggressively cache standard LLM responses. Use cheaper models (e.g., GPT-3.5/Claude Haiku) for basic linting and reserve GPT-4o for complex architectural reviews. Automatically pause idle Docker containers after 10 minutes. |
| **AI Hallucinations** (Tech Lead gives wrong code advice) | High | Implement strict system prompts. Require the AI to cite specific lines of code. Allow students to "dispute" a review, which flags it for human admin review and fine-tunes the model. |
| **Low Student Retention** (Platform is "too hard") | Medium | Implement dynamic difficulty adjustment. If a student fails a PR 3 times, the AI switches from "critic" mode to "mentor" mode, providing explicit hints. |
| **B2B Resistance** (Companies prefer their own legacy tests) | Medium | Offer a free pilot where they run 5 candidates through CodeCraft alongside their existing process to prove CodeCraft provides higher-signal data. |
