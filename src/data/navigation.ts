// Navigation data - SINGLE SOURCE OF TRUTH for all nav items
// Update this file to update navigation across the entire site

export interface NavItem {
  title: string;
  href: string;
}

export interface NavDropdown {
  title: string;
  href: string;
  items: NavItem[];
}

export type NavEntry = NavItem | NavDropdown;

export const isDropdown = (entry: NavEntry): entry is NavDropdown => {
  return 'items' in entry;
};

// Main navigation structure
export const navigation: NavEntry[] = [
  {
    title: 'About',
    href: '/about/who-we-are',
    items: [
      { title: 'Who We Are', href: '/about/who-we-are' },
      { title: 'Leadership', href: '/about/leadership' },
    ],
  },
  {
    title: 'Solutions',
    href: '/solutions',
    items: [
      { title: 'Consulting', href: '/solutions/consulting' },
      { title: 'Training Services', href: '/solutions/training' },
      { title: 'Advisory', href: '/solutions/advisory' },
      { title: 'Custom SaaS Development', href: '/solutions/custom-saas' },
    ],
  },
  {
    title: 'Training',
    href: '/training',
    items: [
      { title: 'Custom Training', href: '/training/custom-training' },
      { title: 'Cyber Kill Chain', href: '/training/cyber-kill-chain' },
      { title: 'Incident Response', href: '/training/incident-response' },
      { title: 'Kubernetes Security', href: '/training/kubernetes-security' },
      { title: 'Threat Hunting', href: '/training/threat-hunting' },
    ],
  },
  {
    title: 'Platforms',
    href: '/platforms',
    items: [
      { title: 'SOC-in-a-Box', href: '/platforms/soc-in-a-box' },
      { title: 'Secure Kubernetes', href: '/platforms/secure-kubernetes' },
      { title: 'CYROID Cyber Range', href: '/platforms/cyroid' },
    ],
  },
  {
    title: 'Bundles',
    href: '/bundles',
    items: [
      { title: 'DevSecOps Bundle', href: '/bundles/devsecops-bundle' },
      { title: 'DFIR Bundle', href: '/bundles/dfir-bundle' },
      { title: 'Productivity Suite', href: '/bundles/productivity-suite' },
      { title: 'SOC Stack', href: '/bundles/soc-stack' },
      { title: 'Request Bundle', href: '/bundles/request-bundle' },
    ],
  },
  { title: 'Resources', href: '/resources' },
];

// Homepage tiles - displayed in "Choose Your Mission" section
export interface HomepageTile {
  icon: string;
  title: string;
  description: string;
  href: string;
  linkText: string;
}

export const homepageTiles: HomepageTile[] = [
  {
    icon: 'target',
    title: 'Cyber Readiness Assessments',
    description: 'Comprehensive gap analysis using the <span class="tooltip-trigger">DOTMLPF-P<span class="tooltip-inline">Doctrine, Organization, Training, Materiel, Leadership, Personnel, Facilities, Policy</span></span> framework to identify operational weaknesses.',
    href: '/solutions/consulting',
    linkText: 'Learn More',
  },
  {
    icon: 'graduation',
    title: 'Operator-Led Training & Labs',
    description: 'Hands-on training from operators with real-world experience. <span class="tooltip-trigger">DCO<span class="tooltip-inline">Defensive Cyber Operations</span></span>, <span class="tooltip-trigger">IR<span class="tooltip-inline">Incident Response</span></span>, threat hunting, red team perspectives, and Kubernetes security.',
    href: '/training',
    linkText: 'View Courses',
  },
  {
    icon: 'shield',
    title: 'SOC-in-a-Box',
    description: 'Turnkey, accreditation-ready security operations center. Kubernetes-based with integrated <span class="tooltip-trigger">SIEM<span class="tooltip-inline">Security Information and Event Management</span></span>, <span class="tooltip-trigger">EDR<span class="tooltip-inline">Endpoint Detection and Response</span></span>, threat intel, and vulnerability management.',
    href: '/platforms/soc-in-a-box',
    linkText: 'Explore Platform',
  },
  {
    icon: 'kubernetes',
    title: 'Secure Kubernetes Core',
    description: 'Opinionated, secure <span class="tooltip-trigger">K8s<span class="tooltip-inline">Kubernetes</span></span> baseline built with Zero Trust principles, comprehensive observability, and GitOps integration.',
    href: '/platforms/secure-kubernetes',
    linkText: 'View Details',
  },
  {
    icon: 'grid',
    title: 'App Bundles & Catalog',
    description: 'Pre-curated software stacks: SOC bundles, <span class="tooltip-trigger">DFIR<span class="tooltip-inline">Digital Forensics and Incident Response</span></span> tools, productivity suites, DevSecOps stacks for any environment.',
    href: '/bundles',
    linkText: 'Browse Catalog',
  },
  {
    icon: 'briefcase',
    title: 'Advisory & Strategic Consulting',
    description: 'Capability development, organizational design, acquisition strategy, Zero Trust roadmaps from leaders who\'ve built and operated at scale.',
    href: '/solutions/advisory',
    linkText: 'Schedule Call',
  },
  {
    icon: 'monitor',
    title: 'CYROID Cyber Range',
    description: 'Enterprise cyber range orchestration platform. Deploy isolated, networked training environments in minutes with visual range builder, <span class="tooltip-trigger">MSEL<span class="tooltip-inline">Master Scenario Events List</span></span> automation, and web-based <span class="tooltip-trigger">VM<span class="tooltip-inline">Virtual Machine</span></span> console access.',
    href: '/platforms/cyroid',
    linkText: 'Explore CYROID',
  },
  {
    icon: 'layers',
    title: 'Custom SaaS Development',
    description: 'Purpose-built applications tailored to your mission requirements. From workflow automation to specialized security tools, we design, build, and deploy secure cloud-native solutions that solve your unique challenges.',
    href: '/solutions/custom-saas',
    linkText: 'Start a Project',
  },
];

// Footer navigation - Solutions section
export const footerSolutions: NavItem[] = [
  { title: 'Cybersecurity Consulting', href: '/solutions/consulting' },
  { title: 'Operator-Led Training', href: '/solutions/training' },
  { title: 'SOC-in-a-Box Platform', href: '/platforms/soc-in-a-box' },
  { title: 'Secure Kubernetes Core', href: '/platforms/secure-kubernetes' },
  { title: 'App Bundles & Catalog', href: '/bundles' },
  { title: 'Advisory & Strategy', href: '/solutions/advisory' },
];

// Footer navigation - Company section
export const footerCompany: NavItem[] = [
  { title: 'Who We Are', href: '/about/who-we-are' },
  { title: 'Leadership', href: '/about/leadership' },
  { title: 'Resources', href: '/resources' },
  { title: 'Contact', href: '/contact' },
];

// Site metadata
export const siteConfig = {
  name: 'Fighting Smart Cyber',
  tagline: 'Operator-Led Offensive & Defensive Cyber',
  email: 'info@fightingsmartcyber.com',
  description: 'Fight smarter by thinking like an operator. Operator-led offensive and defensive cyber solutions from proven cyber operations leaders.',
};
