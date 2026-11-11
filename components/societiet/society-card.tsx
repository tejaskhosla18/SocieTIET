import { ArrowUpRight, CalendarDays, Users } from "lucide-react"
import type { Society } from "./types"

type SocietyCardProps = {
  society: Society
  score?: number
  onOpen: (society: Society) => void
  onApply: (society: Society) => void
}

export function SocietyCard({ society, score, onOpen, onApply }: SocietyCardProps) {
  return (
    <article className="society-card" onClick={() => onOpen(society)}>
      <div className={`society-cover cover-${society.accent}`}>
        <div className="cover-grid" aria-hidden="true" />
        <div className="cover-meta">
          <span className="society-category-label">{society.category}</span>
          {score !== undefined && <span className="match-score"><span className="match-dot" />{score}% match</span>}
        </div>
        <div className="society-mark" aria-hidden="true">{society.initials}</div>
        <span className="cover-orbit orbit-one" aria-hidden="true" />
        <span className="cover-orbit orbit-two" aria-hidden="true" />
        <span className="cover-spark" aria-hidden="true">✳</span>
      </div>
      <div className="society-card-body">
        <div className="society-heading-row">
          <div className="society-title-wrap">
            <h3>{society.name}</h3>
            <p>{society.tagline}</p>
          </div>
          <button className="icon-button card-arrow" aria-label={`View ${society.name}`} onClick={(event) => { event.stopPropagation(); onOpen(society) }}><ArrowUpRight /></button>
        </div>
        <div className="card-tags">
          {society.interests.slice(0, 3).map((interest) => <span className="small-tag" key={interest}>{interest}</span>)}
        </div>
        <div className="society-card-footer">
          <div className="club-stats">
            <span><Users aria-hidden="true" /> {society.kind}</span>
            <span><CalendarDays aria-hidden="true" /> {society.domains.length} focus areas</span>
          </div>
          {society.recruiting ? <span className="recruiting-pill"><span /> Open · demo</span> : <span className="closed-pill">Closed · demo</span>}
        </div>
        <button className="card-apply" disabled={!society.recruiting} onClick={(event) => { event.stopPropagation(); onApply(society) }}>
          {society.recruiting ? "Explore & apply" : "Closed in demo"}<ArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
