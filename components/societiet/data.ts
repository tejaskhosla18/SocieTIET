import type { Category, OrganizationKind, Profile, Society } from "./types"

export const INTERESTS = [
  "Full-Stack Web",
  "AI / ML",
  "Open Source",
  "UI / UX Design",
  "Event Management",
  "Public Speaking",
  "Finance & Case Studies",
  "Dance",
  "Dramatics",
  "Video Editing",
  "Sponsorship & PR",
]

export const CATEGORIES = [
  "All organizations",
  "Technical & Coding",
  "Cultural & Arts",
  "Business & E-Cell",
  "Media & Literature",
  "Community & Service",
] as const

export const BRANCHES = ["CSE", "COE", "ECE", "Electrical", "Mechanical", "Civil", "Biotechnology", "Chemical", "Other"]
export const YEARS = ["1st Year", "2nd Year", "3rd Year"]
export const COMMITMENTS = ["Light · 2–4 hrs / wk", "Balanced · 5–8 hrs / wk", "High · 10+ hrs / wk"]

export const DEFAULT_PROFILE: Profile = {
  name: "Aarav Mehta",
  rollNumber: "102303184",
  email: "aarav.mehta@thapar.edu",
  hostel: "Hostel H",
  branch: "CSE",
  year: "2nd Year",
  interests: ["AI / ML", "Open Source", "Full-Stack Web"],
  commitment: COMMITMENTS[1],
}

type DirectoryEntry = {
  id: string
  name: string
  initials: string
  kind: OrganizationKind
  category: Exclude<(typeof CATEGORIES)[number], "All organizations">
  accent: string
  description: string
}

const directoryEntries: DirectoryEntry[] = [
  { id: "care", name: "Chemist’s Association for Research and Education Society", initials: "CARE", kind: "Society", category: "Technical & Coding", accent: "teal", description: "Promotes chemical research and education, encouraging students to pursue careers in science." },
  { id: "ccs", name: "Creative Computing Society", initials: "CCS", kind: "Society", category: "Technical & Coding", accent: "cyan", description: "Develops analytical skills through workshops, coding competitions, and technology collaborations." },
  { id: "elpis", name: "Elpis — The Psychology Society", initials: "ELPIS", kind: "Society", category: "Community & Service", accent: "rose", description: "Explores psychology through seminars, movie nights, campaigns, and psycho-fests." },
  { id: "gene", name: "GENE Society", initials: "GENE", kind: "Society", category: "Technical & Coding", accent: "emerald", description: "Promotes biotechnology learning through workshops, discussions, and guest lectures." },
  { id: "iic", name: "Institution’s Innovation Council", initials: "IIC", kind: "Society", category: "Technical & Coding", accent: "blue", description: "A TIET innovation-focused society listed in the official student organization directory." },
  { id: "mars", name: "Mechatronics and Robotics Society", initials: "MARS", kind: "Society", category: "Technical & Coding", accent: "sky", description: "Brings robotics enthusiasts together for hands-on work with platforms such as Arduino, Raspberry Pi, and ROS." },
  { id: "somie", name: "Society of Mechanical and Industrial Engineers", initials: "SOMIE", kind: "Society", category: "Technical & Coding", accent: "amber", description: "Builds mechanical engineering knowledge through industrial visits and workshops." },
  { id: "oorja", name: "Team Oorja", initials: "OORJA", kind: "Society", category: "Technical & Coding", accent: "orange", description: "A passionate automotive crew building vehicles with energy, creativity, and drive." },
  { id: "taas", name: "Thapar Amateur Astronomers Society", initials: "TAAS", kind: "Society", category: "Technical & Coding", accent: "blue", description: "Explores the cosmos and cultivates scientific curiosity about astronomy." },
  { id: "tms", name: "Thapar Mathematical Society", initials: "TMS", kind: "Society", category: "Technical & Coding", accent: "cyan", description: "Promotes mathematics through expert talks, workshops, and interactive activities." },
  { id: "tsce", name: "Thapar Society of Civil Engineers", initials: "TSCE", kind: "Society", category: "Technical & Coding", accent: "emerald", description: "Helps students develop civil engineering skills through workshops and design competitions." },
  { id: "eureka", name: "EUREKA Prize Problems", initials: "EUREKA", kind: "Society", category: "Technical & Coding", accent: "amber", description: "Promotes undergraduate research through competitions and technical sessions." },
  { id: "mudra", name: "Music and Dramatic Society (MUDRA)", initials: "MUDRA", kind: "Society", category: "Cultural & Arts", accent: "rose", description: "Develops music and dramatic skills while contributing to students’ overall growth." },
  { id: "spic-macay", name: "SPIC MACAY", initials: "SPIC", kind: "Society", category: "Cultural & Arts", accent: "orange", description: "Promotes Indian classical music, dance, folk arts, and cultural heritage." },
  { id: "faps", name: "Fine Arts and Photography Society", initials: "FAPS", kind: "Society", category: "Cultural & Arts", accent: "sky", description: "Supports students in sketching, painting, photography, and digital arts." },
  { id: "girl-up", name: "Girl Up TIET Society", initials: "GIRL UP", kind: "Society", category: "Community & Service", accent: "rose", description: "A United Nations Foundation campaign empowering girls through gender equality initiatives." },
  { id: "pratigya", name: "Pratigya Society", initials: "PRATIGYA", kind: "Society", category: "Community & Service", accent: "emerald", description: "Student volunteers teach children from classes I to XII." },
  { id: "pws", name: "Paryavaran Welfare Society", initials: "PWS", kind: "Society", category: "Community & Service", accent: "teal", description: "Works to conserve biodiversity, water, air, and energy resources." },
  { id: "ssa", name: "Spiritual Scientists’ Alliance", initials: "SSA", kind: "Society", category: "Community & Service", accent: "amber", description: "Brings together spiritual reflection, rational work ethics, and Punjabi culture." },
  { id: "literary", name: "Literary Society", initials: "LS", kind: "Society", category: "Media & Literature", accent: "orange", description: "Develops appreciation for language and a wide range of literary forms and genres." },
  { id: "tumun", name: "Thapar Model United Nations", initials: "TUMUN", kind: "Society", category: "Media & Literature", accent: "blue", description: "Builds negotiation skills through debate and diplomatic simulations." },
  { id: "enactus", name: "Enactus", initials: "ENACTUS", kind: "Society", category: "Business & E-Cell", accent: "emerald", description: "Uses entrepreneurial action to transform lives and shape a better world." },
  { id: "edc", name: "Entrepreneurship Development Cell", initials: "EDC", kind: "Society", category: "Business & E-Cell", accent: "amber", description: "Builds a platform for budding entrepreneurs and helps nurture ideas." },
  { id: "lead", name: "LEAD Society", initials: "LEAD", kind: "Society", category: "Business & E-Cell", accent: "cyan", description: "Organizes industrial visits, lectures, and workshops for industry exposure." },
  { id: "frosh-week", name: "Frosh Week Society", initials: "FROSH", kind: "Society", category: "Community & Service", accent: "orange", description: "Welcomes first-year students with orientation programs and Frosh Week activities." },
  { id: "standards", name: "Thapar Standards Club", initials: "TSC", kind: "Club", category: "Technical & Coding", accent: "blue", description: "Promotes standardization and quality certification in alignment with BIS guidelines." },
  { id: "dsc", name: "Developer Student Club", initials: "DSC", kind: "Club", category: "Technical & Coding", accent: "cyan", description: "Runs hands-on workshops and projects across a range of developer technologies." },
  { id: "econ", name: "Economics Club", initials: "ECON", kind: "Club", category: "Business & E-Cell", accent: "amber", description: "Discusses economic, social, and political issues through quizzes and debates." },
  { id: "adventure", name: "Adventure Club", initials: "AC", kind: "Club", category: "Community & Service", accent: "emerald", description: "Builds an adventurous spirit through activities such as trekking, climbing, skiing, and rafting." },
  { id: "nox", name: "Dance Club NOX", initials: "NOX", kind: "Club", category: "Cultural & Arts", accent: "rose", description: "Helps members develop dance skills through professional workshops and competitions." },
  { id: "echoes", name: "Echoes Club", initials: "ECHOES", kind: "Club", category: "Media & Literature", accent: "sky", description: "Publishes periodicals covering cultural and technical events on campus." },
  { id: "tmc", name: "Thapar Movie Club", initials: "TMC", kind: "Club", category: "Media & Literature", accent: "orange", description: "Promotes filmmaking on academic and social subjects that impact society." },
  { id: "ebsb", name: "Ek Bharat Shreshtha Bharat Club", initials: "EBSB", kind: "Club", category: "Cultural & Arts", accent: "amber", description: "Promotes national integration through cultural exchange between states." },
  { id: "ecc", name: "Energy Conservation Club", initials: "ECC", kind: "Club", category: "Technical & Coding", accent: "teal", description: "Supports sustainability and energy conservation initiatives on campus." },
  { id: "gcc", name: "Gender Champions Club", initials: "GCC", kind: "Club", category: "Community & Service", accent: "rose", description: "Addresses gender equity issues through sensitization and training." },
  { id: "fitness", name: "TIET Fitness Club", initials: "FIT", kind: "Club", category: "Community & Service", accent: "emerald", description: "Promotes health and fitness under the Fit India Campaign initiative." },
  { id: "electoral", name: "Electoral Club", initials: "EC", kind: "Club", category: "Community & Service", accent: "blue", description: "Encourages awareness of voting rights and assists with voter ID enrollment." },
  { id: "toastmasters", name: "Thapar Toastmasters Club", initials: "TM", kind: "Club", category: "Media & Literature", accent: "cyan", description: "Helps members improve public speaking, communication, and leadership skills." },
  { id: "acm", name: "ACM Computing Chapter", initials: "ACM", kind: "Chapter", category: "Technical & Coding", accent: "sky", description: "Provides a professional network and encourages students to organize ACM workshops and symposiums." },
  { id: "aiche", name: "AIChE Student Chapter", initials: "AIChE", kind: "Chapter", category: "Technical & Coding", accent: "teal", description: "Connects TIET students with the international chemical engineering community." },
  { id: "ashrae", name: "ASHRAE Student Chapter", initials: "ASHRAE", kind: "Chapter", category: "Technical & Coding", accent: "blue", description: "Connects students with the heating, refrigeration, and air-conditioning engineering community." },
  { id: "iiche", name: "Indian Institute of Chemical Engineers Student Chapter", initials: "IICHE", kind: "Chapter", category: "Technical & Coding", accent: "amber", description: "Organizes quizzes, discussions, gaming events, writing competitions, and paper presentations." },
  { id: "iste", name: "Indian Society for Technical Education Student Chapter", initials: "ISTE", kind: "Chapter", category: "Technical & Coding", accent: "cyan", description: "Provides guidance and training to support students’ technical, learning, and personal development." },
  { id: "iete", name: "Institution of Electronics and Telecommunication Engineers", initials: "IETE", kind: "Chapter", category: "Technical & Coding", accent: "sky", description: "Organizes technical events in electronics, telecommunication, and information technology." },
  { id: "iei", name: "Institution of Engineers (India) Student Chapter", initials: "IEI", kind: "Chapter", category: "Technical & Coding", accent: "emerald", description: "Organizes workshops, technical examinations, and lecture series." },
  { id: "aiesec", name: "AIESEC Patiala", initials: "AIESEC", kind: "Chapter", category: "Business & E-Cell", accent: "blue", description: "The Patiala local chapter of the international, youth-run AIESEC network." },
  { id: "mlsc", name: "Microsoft Learn Student Chapter", initials: "MLSC", kind: "Chapter", category: "Technical & Coding", accent: "cyan", description: "Provides technical training, guidance, and project support to improve students’ knowledge and learning." },
  { id: "owasp", name: "OWASP Student Chapter", initials: "OWASP", kind: "Chapter", category: "Technical & Coding", accent: "emerald", description: "Promotes network and application security through learning and workshops." },
  { id: "rotaract", name: "Rotaract Club — TIET", initials: "ROTARACT", kind: "Chapter", category: "Community & Service", accent: "rose", description: "Brings people together to exchange ideas and work on persistent community challenges." },
  { id: "tedx", name: "TEDx TIET", initials: "TEDx", kind: "Chapter", category: "Media & Literature", accent: "orange", description: "Brings speakers and orators to the institute platform for TED-style talks." },
  { id: "youth-united", name: "Youth United — Thapar Chapter", initials: "YU", kind: "Chapter", category: "Community & Service", accent: "teal", description: "Supports community development through periodicals on social issues and service activities." },
  { id: "saic", name: "Student Alumni Interaction Cell", initials: "SAIC", kind: "Cell", category: "Community & Service", accent: "blue", description: "Encourages alumni interaction and coordinates alumni association events and reunions." },
  { id: "ticc", name: "Thapar Institute Counselling Cell", initials: "TICC", kind: "Cell", category: "Community & Service", accent: "cyan", description: "A student support cell established within TIET’s Department of Student Affairs." },
  { id: "ncc", name: "National Cadet Corps", initials: "NCC", kind: "Unit", category: "Community & Service", accent: "emerald", description: "Develops discipline, leadership, and strong character through the NCC Army Wing." },
  { id: "nss", name: "National Service Scheme", initials: "NSS", kind: "Unit", category: "Community & Service", accent: "orange", description: "Connects student volunteers with service initiatives in the social sphere." },
]

const interestsByCategory: Record<Exclude<(typeof CATEGORIES)[number], "All organizations">, string[]> = {
  "Technical & Coding": ["Full-Stack Web", "AI / ML", "Open Source", "UI / UX Design"],
  "Cultural & Arts": ["Dance", "Dramatics", "Event Management", "Video Editing"],
  "Business & E-Cell": ["Finance & Case Studies", "Event Management", "Public Speaking", "Sponsorship & PR"],
  "Media & Literature": ["Video Editing", "Public Speaking", "Dramatics", "Event Management"],
  "Community & Service": ["Event Management", "Public Speaking", "Sponsorship & PR"],
}

const domainsByCategory: Record<Exclude<(typeof CATEGORIES)[number], "All organizations">, string[]> = {
  "Technical & Coding": ["Projects & workshops", "Research", "Events & operations"],
  "Cultural & Arts": ["Performance", "Creative production", "Events & outreach"],
  "Business & E-Cell": ["Strategy & research", "Events & partnerships", "Communications"],
  "Media & Literature": ["Editorial & content", "Events & production", "Communications"],
  "Community & Service": ["Programs & volunteering", "Events & outreach", "Communications"],
}

const directoryVenues = [
  "LP-102 (Learning Plaza)",
  "C-Hall 104",
  "Tan Auditorium Basement",
  "T-Block Seminar Room 2",
  "Nava Nalanda Discussion Room 3",
]

export const SOCIETIES: Society[] = directoryEntries.map((entry, index) => ({
  id: entry.id,
  name: entry.name,
  initials: entry.initials,
  kind: entry.kind,
  category: entry.category,
  tagline: `${entry.kind} · ${entry.category}`,
  domains: domainsByCategory[entry.category],
  interests: interestsByCategory[entry.category],
  events: [],
  speakers: [],
  mission: entry.description,
  recruiting: index % 4 !== 3,
  accent: entry.accent,
  venue: directoryVenues[index % directoryVenues.length],
  note: "Demo scheduling detail — confirm current timings and venue with the organization.",
}))

export function getRecommendedSocieties(profile: Profile) {
  return SOCIETIES.map((society) => {
    const shared = society.interests.filter((interest) => profile.interests.includes(interest))
    const branchBonus = ["CSE", "COE", "ECE"].includes(profile.branch) && society.category === "Technical & Coding" ? 5 : 0
    const yearBonus = profile.year === "1st Year" && society.recruiting ? 2 : 0
    const score = Math.min(98, 72 + Math.min(shared.length * 6, 18) + branchBonus + yearBonus)
    return { society, score, shared }
  }).filter((item) => item.shared.length > 0).sort((a, b) => b.score - a.score || b.shared.length - a.shared.length).slice(0, 4)
}
