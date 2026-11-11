"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, Clock3, ExternalLink, MapPin, Sparkles, X } from "lucide-react"
import { BRANCHES, COMMITMENTS, INTERESTS, YEARS } from "./data"
import type { Application, Profile, Society } from "./types"

type ModalProps = { onClose: () => void }
type ModalShellProps = ModalProps & { children: ReactNode; wide?: boolean }

function ModalShell({ children, onClose, wide = false }: ModalShellProps) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className={`modal-panel ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true">{children}</section></div>
}

export function OnboardingModal({ profile, onSave, onClose }: ModalProps & { profile: Profile; onSave: (profile: Profile) => void }) {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState(profile)
  const toggleInterest = (interest: string) => setDraft((current) => ({ ...current, interests: current.interests.includes(interest) ? current.interests.filter((item) => item !== interest) : [...current.interests, interest] }))
  const save = () => { onSave(draft); onClose() }
  return <ModalShell onClose={onClose}>
    <div className="modal-header"><div><div className="eyebrow"><Sparkles /> YOUR CAMPUS, YOUR CALL</div><h2>{step === 0 ? "Find your people." : "Make it personal."}</h2><p>{step === 0 ? "A few details help us find the societies that feel like you." : "What are you curious about, and how much time can you give?"}</p></div><button className="icon-button" aria-label="Close" onClick={onClose}><X /></button></div>
    <div className="step-track" aria-label={`Step ${step + 1} of 2`}><span className={step >= 0 ? "step-complete" : ""} /><span className={step >= 1 ? "step-complete" : ""} /><small>0{step + 1} <i>/ 02</i></small></div>
    {step === 0 ? <div className="modal-form-grid">
      <label className="form-field full-field"><span>Full name</span><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Your name" /></label>
      <label className="form-field"><span>Roll number</span><input value={draft.rollNumber} onChange={(e) => setDraft({ ...draft, rollNumber: e.target.value })} placeholder="e.g. 102303184" /></label>
      <label className="form-field"><span>Thapar email</span><input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="you@thapar.edu" /></label>
      <label className="form-field"><span>Branch</span><span className="select-wrap"><select value={draft.branch} onChange={(e) => setDraft({ ...draft, branch: e.target.value })}>{BRANCHES.map((branch) => <option key={branch}>{branch}</option>)}</select><ChevronDown /></span></label>
      <label className="form-field"><span>Year</span><span className="select-wrap"><select value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })}>{YEARS.map((year) => <option key={year}>{year}</option>)}</select><ChevronDown /></span></label>
      <label className="form-field full-field"><span>Hostel</span><input value={draft.hostel} onChange={(e) => setDraft({ ...draft, hostel: e.target.value })} placeholder="e.g. Hostel H" /></label>
    </div> : <div className="onboarding-interests">
      <div className="interest-label">Choose what sparks your curiosity <span>{draft.interests.length} selected</span></div>
      <div className="interest-pills">{INTERESTS.map((interest) => <button key={interest} className={`interest-pill ${draft.interests.includes(interest) ? "selected" : ""}`} onClick={() => toggleInterest(interest)} type="button">{draft.interests.includes(interest) && <Check />}{interest}</button>)}</div>
      <div className="commitment-label">Your weekly commitment appetite</div>
      <div className="commitment-options">{COMMITMENTS.map((item, index) => <button key={item} className={`commitment-option ${draft.commitment === item ? "selected" : ""}`} onClick={() => setDraft({ ...draft, commitment: item })} type="button"><span className="commitment-icon">{index === 0 ? "01" : index === 1 ? "02" : "03"}</span><span>{item.split(" · ")[0]}<small>{item.split(" · ")[1]}</small></span>{draft.commitment === item && <Check />}</button>)}</div>
    </div>}
    <div className="modal-actions">{step === 1 && <button className="text-button" onClick={() => setStep(0)}><ArrowLeft /> Back</button>}<button className="primary-button modal-next" onClick={() => step === 0 ? setStep(1) : save()}>{step === 0 ? "Continue" : "Show my matches"}<ArrowRight /></button></div>
  </ModalShell>
}

export function SocietyModal({ society, onClose, onApply }: ModalProps & { society: Society; onApply: (society: Society) => void }) {
  return <ModalShell onClose={onClose} wide><div className={`profile-hero cover-${society.accent}`}><div className="cover-grid" aria-hidden="true"/><button className="icon-button close-over-image" aria-label="Close" onClick={onClose}><X /></button><div className="society-mark profile-mark">{society.initials}</div><span className="society-category-label">{society.category}</span></div>
    <div className="society-profile-content"><div className="profile-title-line"><div><div className="eyebrow">TIET DIRECTORY · {society.kind}</div><h2>{society.name}</h2><p>{society.tagline}</p></div>{society.recruiting ? <span className="recruiting-pill large"><span/> Open · demo</span> : <span className="closed-pill large">Closed · demo</span>}</div>
      <div className="society-profile-grid"><div className="profile-main-column"><section className="profile-section"><h3>About this organization</h3><p>{society.mission}</p></section><section className="profile-section"><h3>Areas to explore</h3><div className="event-pills">{society.interests.map((interest) => <span className="event-pill" key={interest}><Sparkles />{interest}</span>)}</div></section><section className="profile-section"><h3>From the TIET directory</h3><div className="speaker-pills">{<span>Official organization listing</span>}</div></section></div><aside className="profile-facts"><div className="fact-row"><span>Organization type</span><strong>{society.kind}</strong></div><div className="fact-row"><span>Directory category</span><strong>{society.category}</strong></div><div className="fact-row"><span>Focus areas</span><strong>{society.domains.length} areas</strong></div><div className="fact-location"><MapPin /><span>{society.venue}</span></div></aside></div>
      <div className="profile-bottom"><span className="profile-note"><Clock3 />{society.recruiting ? "Demo scheduling details · confirm with this organization" : "No demo opening is shown for this organization"}</span><button className="primary-button" disabled={!society.recruiting} onClick={() => onApply(society)}>{society.recruiting ? "Apply to this society" : "Recruitment closed"}<ArrowRight/></button></div>
    </div></ModalShell>
}

export function ApplicationModal({ society, profile, onClose, onSubmit }: ModalProps & { society: Society; profile: Profile; onSubmit: (domain: string, answers: string[]) => void }) {
  const [domain, setDomain] = useState(society.domains[0])
  const [answers, setAnswers] = useState(["", "", ""])
  const [step, setStep] = useState(0)
  const setAnswer = (index: number, value: string) => setAnswers((current) => current.map((answer, i) => i === index ? value : answer))
  const submit = (event: React.FormEvent) => { event.preventDefault(); onSubmit(domain, answers) }
  return <ModalShell onClose={onClose} wide><form onSubmit={submit}>
    <div className="modal-header"><div><div className="eyebrow">APPLICATION · {society.initials}</div><h2>{step === 0 ? "Start your application." : "A little more about you."}</h2><p>{step === 0 ? `Joining ${society.name} starts here.` : "No perfect answers — show us how you think."}</p></div><button type="button" className="icon-button" aria-label="Close" onClick={onClose}><X /></button></div>
    <div className="step-track"><span className={step >= 0 ? "step-complete" : ""}/><span className={step >= 1 ? "step-complete" : ""}/><small>0{step + 1} <i>/ 02</i></small></div>
    {step === 0 ? <div className="modal-form-grid application-details">
      <div className="student-summary"><div className="avatar-small">{profile.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div><div><strong>{profile.name || "Your name"}</strong><span>{profile.rollNumber || "Roll number"} · {profile.branch} · {profile.year}</span></div><span className="autofilled"><Check/> Auto-filled</span></div>
      <label className="form-field full-field"><span>Choose an area</span><span className="select-wrap"><select value={domain} onChange={(e) => setDomain(e.target.value)}>{society.domains.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown /></span></label>
      <label className="form-field"><span>Contact email</span><input type="email" value={profile.email} readOnly /></label><label className="form-field"><span>Hostel</span><input value={profile.hostel} readOnly /></label>
      <div className="application-tip full-field"><Sparkles/><span>Your profile details are only used to help the society team follow up with you.</span></div>
    </div> : <div className="application-questions">
      <label className="form-field"><span>Why do you want to join {society.initials}?</span><textarea required minLength={10} value={answers[0]} onChange={(e) => setAnswer(0, e.target.value)} placeholder="Tell us what draws you to this community…" /></label>
      <label className="form-field"><span>Link to your GitHub, Behance, or portfolio <i>Optional</i></span><input value={answers[1]} onChange={(e) => setAnswer(1, e.target.value)} placeholder="https://" /></label>
      <label className="form-field"><span>Any past experience or projects? <i>Optional</i></span><textarea value={answers[2]} onChange={(e) => setAnswer(2, e.target.value)} placeholder="A project, an event, something you learned…" /></label>
      <div className="privacy-note"><Check/> Your application is saved on this device and shared with this demo portal only.</div>
    </div>}
    <div className="modal-actions">{step === 1 && <button type="button" className="text-button" onClick={() => setStep(0)}><ArrowLeft/> Back</button>}{step === 0 ? <button type="button" className="primary-button modal-next" onClick={() => setStep(1)}>Continue to questions<ArrowRight/></button> : <button type="submit" className="primary-button modal-next">Submit application<ArrowRight/></button>}</div>
  </form></ModalShell>
}

export function RescheduleModal({ application, onClose, onSubmit }: ModalProps & { application: Application; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState("")
  return <ModalShell onClose={onClose}><div className="modal-header"><div><div className="eyebrow">INTERVIEW SCHEDULE</div><h2>Need a different time?</h2><p>Let {application.initials} know what’s going on. They’ll follow up with you.</p></div><button className="icon-button" aria-label="Close" onClick={onClose}><X/></button></div><div className="reschedule-slot"><CalendarDays/><div><strong>{application.interviewDate} · {application.interviewTime}</strong><span>{application.venue}</span></div></div><label className="form-field"><span>What’s the conflict?</span><textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. I have a midterm at this time…" /></label><div className="modal-actions"><button className="text-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={!reason.trim()} onClick={() => onSubmit(reason)}>Send request<ArrowRight/></button></div></ModalShell>
}

export function ProfileModal({ profile, onClose, onSave }: ModalProps & { profile: Profile; onSave: (profile: Profile) => void }) {
  const [draft, setDraft] = useState(profile)
  return <ModalShell onClose={onClose}><div className="modal-header"><div><div className="eyebrow">YOUR ACCOUNT</div><h2>Student profile</h2><p>Keep your details up to date for applications.</p></div><button className="icon-button" aria-label="Close" onClick={onClose}><X/></button></div><div className="modal-form-grid"><label className="form-field full-field"><span>Full name</span><input value={draft.name} onChange={(e) => setDraft({...draft, name: e.target.value})}/></label><label className="form-field"><span>Roll number</span><input value={draft.rollNumber} onChange={(e) => setDraft({...draft, rollNumber: e.target.value})}/></label><label className="form-field"><span>Email</span><input type="email" value={draft.email} onChange={(e) => setDraft({...draft, email: e.target.value})}/></label><label className="form-field"><span>Hostel</span><input value={draft.hostel} onChange={(e) => setDraft({...draft, hostel: e.target.value})}/></label><label className="form-field"><span>Branch</span><span className="select-wrap"><select value={draft.branch} onChange={(e) => setDraft({...draft, branch: e.target.value})}>{BRANCHES.map((branch) => <option key={branch}>{branch}</option>)}</select><ChevronDown/></span></label></div><div className="modal-actions"><button className="text-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => { onSave(draft); onClose() }}>Save changes<Check/></button></div></ModalShell>
}

export function NotificationDrawer({ onClose, onSelectExplore }: { onClose: () => void; onSelectExplore: () => void }) {
  return <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><aside className="notification-drawer" role="dialog" aria-modal="true" aria-labelledby="notification-title"><div className="drawer-head"><div><span className="eyebrow">CAMPUS PULSE</span><h2 id="notification-title">Notifications <span>03</span></h2></div><button className="icon-button" aria-label="Close notifications" onClick={onClose}><X/></button></div><div className="notification-list">
    <article className="notification-item unread"><span className="notification-icon violet"><Sparkles/></span><div><div className="notification-meta"><strong>CCS</strong><span>12 min ago</span></div><p>Round 2 interview shortlist is out. Check your application status.</p><button onClick={onSelectExplore}>Explore CCS <ExternalLink/></button></div></article>
    <article className="notification-item unread"><span className="notification-icon cyan"><Clock3/></span><div><div className="notification-meta"><strong>GDG TIET</strong><span>1 hr ago</span></div><p>Recruitment drive closes tonight at 11:59 PM. Don’t miss your chance.</p><button onClick={onSelectExplore}>View open roles <ExternalLink/></button></div></article>
    <article className="notification-item"><span className="notification-icon amber"><CalendarDays/></span><div><div className="notification-meta"><strong>Frosh</strong><span>Yesterday</span></div><p>Audition registrations for the opening showcase are now live.</p><button onClick={onSelectExplore}>See opportunities <ExternalLink/></button></div></article>
    </div><div className="drawer-footer">You’re all caught up with campus updates.</div></aside></div>
}
