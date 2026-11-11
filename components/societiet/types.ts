export type Category =
  | "Technical & Coding"
  | "Cultural & Arts"
  | "Business & E-Cell"
  | "Media & Literature"
  | "Community & Service"

export type OrganizationKind = "Society" | "Club" | "Chapter" | "Cell" | "Unit"

export type Profile = {
  name: string
  rollNumber: string
  email: string
  hostel: string
  branch: string
  year: string
  interests: string[]
  commitment: string
}

export type Society = {
  id: string
  name: string
  initials: string
  kind: OrganizationKind
  category: Category
  tagline: string
  established?: number
  members?: string
  alumni?: string
  domains: string[]
  interests: string[]
  events: string[]
  speakers: string[]
  mission: string
  recruiting: boolean
  accent: string
  venue: string
  note: string
}

export type Application = {
  id: string
  societyId: string
  societyName: string
  initials: string
  domain: string
  submittedAt: string
  stage: "applied" | "round-one" | "interview" | "selected" | "waitlisted"
  interviewDate: string
  interviewTime: string
  venue: string
  note: string
  answers: string[]
  reason?: string
}
