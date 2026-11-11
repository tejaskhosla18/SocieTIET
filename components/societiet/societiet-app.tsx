"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Activity, ArrowDownRight, ArrowRight, Bell, CalendarDays, Check, ChevronDown, CircleHelp, Clock3, Compass, ExternalLink, Filter, GraduationCap, LayoutGrid, MapPin, Menu, Plus, Search, Settings2, Sparkles, Users, X } from "lucide-react"
import { ApplicationModal, NotificationDrawer, OnboardingModal, ProfileModal, RescheduleModal, SocietyModal } from "./modals"
import { CATEGORIES, DEFAULT_PROFILE, getRecommendedSocieties, SOCIETIES } from "./data"
import { SocietyCard } from "./society-card"
import type { Application, Category, Profile, Society } from "./types"

type Tab = "explore" | "matches" | "applications" | "profile"
type PersistedState = { profile: Profile; applications: Application[] }
const STORAGE_KEY = "societiet-campus-v1"

const announcements = [
  { society: "CCS", title: "Round 2 shortlist is out", time: "12m", accent: "violet" },
  { society: "GDG", title: "Applications close tonight", time: "1h", accent: "cyan" },
]

function getCalendarUrl(application: Application) {
  const start = new Date(application.submittedAt)
  start.setDate(start.getDate() + 2)
  const [clock, meridiem] = application.interviewTime.split(" - ")[0].split(" ")
  const [hours, minutes] = clock.split(":").map(Number)
  start.setHours((hours % 12) + (meridiem === "PM" ? 12 : 0), minutes, 0, 0)
  const end = new Date(start.getTime() + 15 * 60 * 1000)
  const format = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const params = new URLSearchParams({ action: "TEMPLATE", text: `${application.societyName} · ${application.domain} interview`, dates: `${format(start)}/${format(end)}`, details: application.note, location: application.venue })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function initials(name: string) { return name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() }

export default function SocieTIETApp() {
  const [activeTab, setActiveTab] = useState<Tab>("explore")
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [applications, setApplications] = useState<Application[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All organizations")
  const [search, setSearch] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [modal, setModal] = useState<"onboarding" | "profile" | "notifications" | null>(null)
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null)
  const [applyingTo, setApplyingTo] = useState<Society | null>(null)
  const [rescheduling, setRescheduling] = useState<Application | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [backgroundTheme, setBackgroundTheme] = useState<"beige" | "gray">("beige")
  const [toast, setToast] = useState("")

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<PersistedState>
        if (parsed.profile) setProfile({ ...DEFAULT_PROFILE, ...parsed.profile })
        if (Array.isArray(parsed.applications)) setApplications(parsed.applications)
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, applications } satisfies PersistedState))
  }, [applications, hydrated, profile])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(""), 3500)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", focusSearch)
    return () => window.removeEventListener("keydown", focusSearch)
  }, [])

  const recommendations = useMemo(() => getRecommendedSocieties(profile), [profile])
  const filteredSocieties = useMemo(() => SOCIETIES.filter((society) => {
    const matchesCategory = category === "All organizations" || society.category === category
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [society.name, society.tagline, society.category, society.kind, society.mission, ...society.interests, ...society.events].some((value) => value.toLowerCase().includes(query))
    return matchesCategory && matchesSearch
  }), [category, search])

  const openApply = (society: Society) => {
    setSelectedSociety(null)
    setApplyingTo(society)
  }

  const saveProfile = (nextProfile: Profile) => {
    setProfile(nextProfile)
    setToast("Your profile has been updated")
  }

  const submitApplication = (society: Society, domain: string, answers: string[]) => {
    const now = new Date()
    const interviewDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2)
    const dayLabel = interviewDay.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })
    const next: Application = {
      id: `${society.id}-${Date.now()}`,
      societyId: society.id,
      societyName: society.name,
      initials: society.initials,
      domain,
      submittedAt: new Date().toISOString(),
      stage: "applied",
      interviewDate: dayLabel,
      interviewTime: "6:30 PM - 6:45 PM",
      venue: society.venue,
      note: society.note,
      answers,
    }
    setApplications((current) => [next, ...current])
    setApplyingTo(null)
    setActiveTab("applications")
    setToast(`Application sent to ${society.initials}`)
  }

  const updateStage = (application: Application) => {
    const order: Application["stage"][] = ["applied", "round-one", "interview", "selected"]
    const index = order.indexOf(application.stage)
    const next = order[Math.min(index + 1, order.length - 1)]
    setApplications((current) => current.map((item) => item.id === application.id ? { ...item, stage: next } : item))
    setToast(next === "selected" ? `Congratulations — you’re selected for ${application.initials}` : `${application.initials} application moved to ${stageLabel(next)}`)
  }

  const requestReschedule = (reason: string) => {
    if (!rescheduling) return
    setApplications((current) => current.map((item) => item.id === rescheduling.id ? { ...item, reason } : item))
    setRescheduling(null)
    setToast("Reschedule request sent to the society team")
  }

  const navigate = (tab: Tab) => { setActiveTab(tab); setMobileMenuOpen(false) }
  const navItems: { id: Tab; label: string; short: string; icon: typeof Compass }[] = [
    { id: "explore", label: "Explore societies", short: "Explore", icon: Compass },
    { id: "matches", label: "My matches", short: "Matches", icon: Sparkles },
    { id: "applications", label: "Applications & interviews", short: "Activity", icon: Activity },
    { id: "profile", label: "Profile", short: "Profile", icon: GraduationCap },
  ]

  return <div className={`app-shell theme-${backgroundTheme}`}>
    <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
      <a className="brand-lockup" href="#home" onClick={(event) => { event.preventDefault(); navigate("explore") }}><span className="brand-icon"><span/><span/><span/><span/></span><span className="brand-word">Socie<span>TIET</span></span><span className="brand-beta">BETA</span></a>
      <div className="sidebar-campus"><span className="campus-indicator"/><span>THAPAR INSTITUTE</span><span className="campus-chevron">⌄</span></div>
      <div className="sidebar-section-label">YOUR SPACE</div>
      <nav className="primary-nav" aria-label="Primary navigation">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-link ${activeTab === id ? "active" : ""}`} onClick={() => navigate(id)}><Icon aria-hidden="true"/><span>{label}</span>{id === "applications" && applications.length > 0 && <b>{applications.length}</b>}</button>)}</nav>
      <div className="sidebar-section-label discover-label">DISCOVER MORE</div>
      <button className="nav-link" onClick={() => setModal("onboarding")}><Settings2/><span>Update my interests</span></button>
      <div className="sidebar-season-card"><div className="season-orb"><Sparkles/></div><span className="season-kicker">RECRUITMENT SEASON</span><strong>Find where<br/>you belong.</strong><p>{SOCIETIES.length} societies. One campus. Your next chapter.</p><button onClick={() => navigate("matches")}>Find your fit <ArrowRight/></button></div>
      <div className="sidebar-user" role="button" tabIndex={0} onClick={() => navigate("profile")} onKeyDown={(event) => { if (event.key === "Enter") navigate("profile") }}><div className="avatar">{initials(profile.name || "Aarav Mehta")}</div><div className="user-info"><strong>{profile.name || "Student"}</strong><span>{profile.branch} · {profile.year.slice(0, 1)} year</span></div><button className="icon-button user-menu" aria-label="Edit profile" onClick={(event) => { event.stopPropagation(); setModal("profile") }}><ChevronDown/></button></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="mobile-brand"><button className="icon-button mobile-menu-toggle" aria-label="Open navigation" onClick={() => setMobileMenuOpen((open) => !open)}>{mobileMenuOpen ? <X/> : <Menu/>}</button><span className="brand-word">Socie<span>TIET</span></span></div><div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{navItems.find((item) => item.id === activeTab)?.label}</strong></div><div className="topbar-actions"><div className="semester-pill"><span/> FALL 2026</div><button className="icon-button notification-trigger" aria-label="Open notifications" onClick={() => setModal("notifications")}><Bell/><span className="notification-dot"/></button><button className="topbar-avatar" onClick={() => navigate("profile")} aria-label="Open profile">{initials(profile.name || "Aarav Mehta")}</button></div></header>

      <div className="page-content">
        <div className="theme-comparison" role="group" aria-label="Compare page background options">
          <span className="theme-comparison-label">Background</span>
          <button type="button" className="theme-choice" aria-pressed={backgroundTheme === "beige"} onClick={() => setBackgroundTheme("beige")}><span className="theme-swatch theme-swatch-beige" aria-hidden="true"/>Warm beige</button>
          <button type="button" className="theme-choice" aria-pressed={backgroundTheme === "gray"} onClick={() => setBackgroundTheme("gray")}><span className="theme-swatch theme-swatch-gray" aria-hidden="true"/>Soft gray</button>
        </div>
        {activeTab === "explore" && <>
          <section className="welcome-banner"><div className="welcome-content"><div className="eyebrow"><span className="live-pulse"/> YOUR CAMPUS, YOUR COMMUNITY</div><h1>Find your fit<br/>at <span>TIET.</span></h1><p>From late-night builds to lights-up rehearsals — find the people who make campus feel like yours.</p><div className="welcome-actions"><button className="primary-button" onClick={() => setModal("onboarding")}>Find your fit <ArrowRight/></button><button className="banner-link" onClick={() => navigate("matches")}>See my recommendations <ArrowDownRight/></button></div></div><div className="banner-art" aria-hidden="true"><div className="banner-glow"/><div className="banner-ring ring-a"/><div className="banner-ring ring-b"/><div className="banner-ring ring-c"/><div className="banner-center"><span>TIET</span><small>30.35° N<br/>76.36° E</small></div><div className="orbit-label label-tech"><span/>TECH</div><div className="orbit-label label-culture"><span/>CULTURE</div><div className="orbit-label label-build"><span/>BUILD</div><div className="banner-spark spark-a">✳</div><div className="banner-spark spark-b">✳</div></div><div className="banner-index">01 <span/> 04</div></section>

          <section className="quick-stats" aria-label="Campus community statistics"><div className="quick-stat"><span className="stat-icon violet"><Users/></span><div><strong>{SOCIETIES.length}</strong><span>directory listings</span></div></div><div className="stat-divider"/><div className="quick-stat"><span className="stat-icon cyan"><Sparkles/></span><div><strong>{recommendations.length}</strong><span>matches for you</span></div></div><div className="stat-divider"/><div className="quick-stat"><span className="stat-icon amber"><CalendarDays/></span><div><strong>{SOCIETIES.filter((society) => society.recruiting).length.toString().padStart(2, "0")}</strong><span>demo openings</span></div></div><div className="stats-note"><span className="tiny-pulse"/> Fall recruitment is live</div></section>

          <div className="content-section-title"><div><div className="eyebrow">A GOOD PLACE TO START</div><h2>Picked for your <span>kind of curious.</span></h2></div><button className="view-all-button" onClick={() => navigate("matches")}>See all matches <ArrowRight/></button></div>
          <div className="recommendation-row">{recommendations.slice(0, 3).map(({ society, score }) => <button key={society.id} className="mini-match" onClick={() => setSelectedSociety(society)}><span className={`mini-match-mark cover-${society.accent}`}>{society.initials}</span><span className="mini-match-copy"><strong>{society.initials}</strong><small>{society.name}</small></span><span className="mini-match-score">{score}%</span><ArrowRight/></button>)}</div>

          <div className="directory-heading"><div><div className="eyebrow">THE STUDENT ORGANIZATION DIRECTORY</div><h2>Find your <span>next thing.</span></h2></div><span className="directory-count">{filteredSocieties.length.toString().padStart(2, "0")} ORGANIZATIONS</span></div>
          <div className="directory-controls"><div className="filter-pills" role="group" aria-label="Filter organizations by category">{CATEGORIES.map((item) => <button key={item} className={`filter-pill ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item === "All organizations" && <LayoutGrid/>}{item}</button>)}</div><label className="search-field"><Search/><input ref={searchInputRef} aria-label="Search societies" placeholder="Search organizations, topics, activities..." value={search} onChange={(event) => setSearch(event.target.value)}/><kbd>⌘ K</kbd></label></div>
          <p className="directory-source-note">Names and descriptions follow the <a href="https://www.thapar.cc/student-societies-clubs-and-chapters" target="_blank" rel="noreferrer">official TIET directory</a>. Recruitment openings, venues, and interview details are sample data for this demo.</p>
          {filteredSocieties.length ? <div className="society-grid">{filteredSocieties.map((society) => <SocietyCard key={society.id} society={society} score={recommendations.find((item) => item.society.id === society.id)?.score} onOpen={setSelectedSociety} onApply={openApply}/>)}</div> : <div className="empty-state"><div className="empty-orb"><Search/></div><h3>No organizations found</h3><p>Try a different search or category filter.</p><button className="text-button" onClick={() => { setSearch(""); setCategory("All organizations") }}>Clear filters <X/></button></div>}
        </>}

        {activeTab === "matches" && <>
          <div className="page-intro"><div><div className="eyebrow"><Sparkles/> YOUR PERSONALIZED SHORTLIST</div><h1>Your next chapter,<br/><span>on your wavelength.</span></h1><p>Built around {profile.branch}, {profile.year.toLowerCase()} and what you love to explore.</p></div><button className="secondary-button" onClick={() => setModal("onboarding")}><Settings2/> Tune my matches</button></div>
          <div className="match-summary"><div className="match-summary-orb"><Sparkles/></div><div><span className="eyebrow">YOUR SIGNAL IS STRONG</span><strong>{recommendations.length} societies</strong><span>match your interests and energy</span></div><div className="match-summary-tags">{profile.interests.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div></div>
          <div className="match-card-grid">{recommendations.map(({ society, score, shared }, index) => <article className="match-detail-card" key={society.id}><div className="match-card-top"><span className={`match-card-mark cover-${society.accent}`}>{society.initials}</span><span className="match-percent"><strong>{score}</strong><small>%</small><span>MATCH</span></span></div><div className="match-rank">0{index + 1} · {society.category}</div><h2>{society.name}</h2><p>{society.tagline}</p><div className="match-reason"><Sparkles/><span><strong>Why it fits:</strong> {shared.join(" + ")} {shared.length > 1 ? "are" : "is"} in your interest mix{society.category === "Technical & Coding" && ["CSE", "COE", "ECE"].includes(profile.branch) ? `, with a strong ${profile.branch} connection` : ""}.</span></div><div className="match-commitment"><Clock3/> {profile.commitment.split(" · ")[0]} commitment <span>·</span> {society.members} community</div><div className="match-card-actions"><button className="secondary-button" onClick={() => setSelectedSociety(society)}>Know the club</button><button className="primary-button" disabled={!society.recruiting} onClick={() => openApply(society)}>{society.recruiting ? "Apply now" : "Closed"}<ArrowRight/></button></div></article>)}</div>
          <div className="match-refresh"><CircleHelp/><span>Matches are suggestions, not a scorecard. Explore something unexpected — that’s where the good stories start.</span><button onClick={() => navigate("explore")}>Browse all societies <ArrowRight/></button></div>
        </>}

        {activeTab === "applications" && <>
          <div className="page-intro applications-intro"><div><div className="eyebrow"><Activity/> YOUR RECRUITMENT JOURNEY</div><h1>Good things<br/><span>are in motion.</span></h1><p>Every application, next step, and campus conversation — all in one place.</p></div><div className="application-summary"><strong>{applications.length.toString().padStart(2, "0")}</strong><span>ACTIVE<br/>APPLICATIONS</span></div></div>
          {applications.length === 0 ? <div className="applications-empty"><div className="empty-illustration"><span className="empty-ring ring-a"/><span className="empty-ring ring-b"/><span className="empty-center"><Compass/></span><span className="empty-star">✳</span></div><div className="eyebrow">YOUR NEXT CHAPTER IS WAITING</div><h2>Nothing in motion. <span>Yet.</span></h2><p>You haven’t applied to any societies yet. Find the community that feels right, then we’ll help you keep every next step in sight.</p><button className="primary-button" onClick={() => navigate("explore")}>Explore open recruitments <ArrowRight/></button></div> : <div className="applications-list">{applications.map((application) => {
            const stageItems = ["Applied", "Round 1", "Interview", "Decision"]
            const activeIndex = application.stage === "applied" ? 0 : application.stage === "round-one" ? 1 : application.stage === "interview" ? 2 : 3
            return <article className="application-card" key={application.id}><div className="application-card-header"><span className={`application-mark cover-${SOCIETIES.find((society) => society.id === application.societyId)?.accent ?? "violet"}`}>{application.initials}</span><div className="application-title"><div className="eyebrow">{application.societyName}</div><h2>{application.domain}</h2><span>Applied {new Date(application.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span></div><div className={`status-badge status-${application.stage}`}>{application.stage === "selected" ? <Check/> : <span/>}{stageLabel(application.stage)}</div></div>
              <div className="timeline" aria-label={`Application progress: ${stageLabel(application.stage)}`}>{stageItems.map((label, index) => <div className={`timeline-step ${index < activeIndex ? "complete" : index === activeIndex ? "current" : ""}`} key={label}><span className="timeline-node">{index < activeIndex ? <Check/> : index + 1}</span><span>{label}</span></div>)}</div>
              {application.stage === "selected" || application.stage === "waitlisted" ? <div className="decision-card"><span className={`decision-icon ${application.stage}`}><Check/></span><div><strong>{application.stage === "selected" ? "You made it." : "You’re on the waitlist."}</strong><span>{application.stage === "selected" ? `${application.societyName} can’t wait to meet you.` : "The team will be in touch if a spot opens up."}</span></div></div> : <div className="interview-slot"><div className="slot-date"><span>{application.interviewDate.split(" ")[0].slice(0, 3).toUpperCase()}</span><strong>{application.interviewDate.match(/\d+/)?.[0] ?? "13"}</strong><small>{application.interviewDate.split(" ").slice(-1)[0]}</small></div><div className="slot-info"><div className="slot-heading"><span className="upcoming-tag"><span/> NEXT UP</span><span className="slot-round">{application.stage === "applied" ? "ROUND 1 · INTRO CHAT" : application.stage === "round-one" ? "ROUND 2 · INTERVIEW" : "INTERVIEW · FINAL ROUND"}</span></div><h3>{application.societyName} <span>·</span> {application.domain}</h3><div className="slot-details"><span><Clock3/>{application.interviewTime}</span><span><MapPin/>{application.venue}</span></div><p className="interviewer-note">“{application.note}”</p>{application.reason && <div className="reschedule-requested"><Check/> Reschedule requested · {application.reason}</div>}<div className="slot-actions"><a className="calendar-button" href={getCalendarUrl(application)} target="_blank" rel="noreferrer"><CalendarDays/> Add to Google Calendar <ExternalLink/></a><button className="slot-reschedule" onClick={() => setRescheduling(application)}>Request reschedule</button></div></div></div>}
              {application.stage !== "selected" && application.stage !== "waitlisted" && <button className="demo-advance" onClick={() => updateStage(application)}><Activity/> Demo: advance recruitment stage <ArrowRight/></button>}
            </article>
          })}</div>}
          {applications.length > 0 && <div className="tracker-footnote"><CircleHelp/> Interview slots are demo estimates — the society team will confirm your final schedule.</div>}
        </>}

        {activeTab === "profile" && <>
          <div className="page-intro profile-page-intro"><div><div className="eyebrow"><GraduationCap/> YOUR CAMPUS IDENTITY</div><h1>More than a<br/><span>roll number.</span></h1><p>Your interests, the communities you join, and the story you’re building at TIET.</p></div><button className="secondary-button" onClick={() => setModal("profile")}><Settings2/> Edit profile</button></div>
          <div className="profile-dashboard"><section className="student-profile-card"><div className="profile-banner-art"><div className="profile-banner-grid"/><span className="banner-stamp">TIET<br/>26—27</span></div><div className="student-profile-info"><div className="profile-avatar-large">{initials(profile.name || "Aarav Mehta")}</div><div className="student-profile-name"><div className="eyebrow">THAPAR INSTITUTE · STUDENT</div><h2>{profile.name || "Your name"}</h2><p>{profile.branch} Engineering · {profile.year}</p></div><button className="icon-button edit-profile-icon" aria-label="Edit profile" onClick={() => setModal("profile")}><Settings2/></button></div><div className="profile-info-grid"><div><span>ROLL NUMBER</span><strong>{profile.rollNumber || "Add your roll number"}</strong></div><div><span>EMAIL ADDRESS</span><strong>{profile.email || "Add your email"}</strong></div><div><span>CAMPUS RESIDENCE</span><strong>{profile.hostel || "Add your hostel"}</strong></div><div><span>COMMITMENT</span><strong>{profile.commitment.split(" · ")[0]}</strong></div></div></section>
            <aside className="profile-interest-card"><div className="eyebrow">YOUR INTEREST MIX</div><h2>Curiosity,<br/><span>in good company.</span></h2><p>Your picks power the recommendations in My Matches.</p><div className="profile-interest-pills">{profile.interests.length ? profile.interests.map((interest) => <span key={interest}>{interest}</span>) : <span className="muted-interest">Choose a few interests to get started</span>}</div><button className="text-button" onClick={() => setModal("onboarding")}>Update interests <ArrowRight/></button></aside></div>
          <div className="profile-activity"><div className="profile-activity-heading"><div><div className="eyebrow">YOUR TIET STORY</div><h2>A few things in motion.</h2></div><button onClick={() => navigate("applications")}>See applications <ArrowRight/></button></div><div className="profile-metrics"><div><span className="metric-icon violet"><Sparkles/></span><strong>{recommendations.length}</strong><small>communities aligned</small></div><div><span className="metric-icon cyan"><Activity/></span><strong>{applications.length}</strong><small>applications in play</small></div><div><span className="metric-icon amber"><CalendarDays/></span><strong>{SOCIETIES.filter((society) => society.recruiting).length.toString().padStart(2, "0")}</strong><small>demo openings</small></div></div></div>
        </>}
      </div>
      <footer className="app-footer"><span>Made for the curious at TIET.</span><span><span className="footer-dot"/> All systems nominal <i>·</i> Fall 2026</span></footer>
    </main>

    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{navItems.map(({ id, short, icon: Icon }) => <button key={id} className={activeTab === id ? "active" : ""} onClick={() => navigate(id)}><Icon/><span>{short}</span>{id === "applications" && applications.length > 0 && <i>{applications.length}</i>}</button>)}</nav>

    {modal === "onboarding" && <OnboardingModal profile={profile} onSave={saveProfile} onClose={() => setModal(null)}/>}
    {modal === "profile" && <ProfileModal profile={profile} onClose={() => setModal(null)} onSave={saveProfile}/>}
    {modal === "notifications" && <NotificationDrawer onClose={() => setModal(null)} onSelectExplore={() => { setModal(null); navigate("explore") }}/>}
    {selectedSociety && <SocietyModal society={selectedSociety} onClose={() => setSelectedSociety(null)} onApply={openApply}/>}
    {applyingTo && <ApplicationModal society={applyingTo} profile={profile} onClose={() => setApplyingTo(null)} onSubmit={(domain, answers) => submitApplication(applyingTo, domain, answers)}/>}
    {rescheduling && <RescheduleModal application={rescheduling} onClose={() => setRescheduling(null)} onSubmit={requestReschedule}/>}
    {toast && <div className="toast" role="status"><span><Check/></span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast("")}><X/></button></div>}
  </div>
}

function stageLabel(stage: Application["stage"]) {
  if (stage === "round-one") return "Round 1"
  if (stage === "interview") return "Interview scheduled"
  if (stage === "selected") return "Selected"
  if (stage === "waitlisted") return "Waitlisted"
  return "Application submitted"
}
