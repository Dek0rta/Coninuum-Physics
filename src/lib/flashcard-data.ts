import type { Flashcard } from "@/types";

export const FLASHCARDS: Flashcard[] = [
  // ─── Mechanics ──────────────────────────────────────────────────────────────
  {
    id: "mech-001",
    topic: "mechanics",
    front: "F = ma",
    back: "Newton's Second Law — net force equals mass times acceleration",
    derivation: "From F = dp/dt, if mass is constant: F = m·(dv/dt) = m·a",
  },
  {
    id: "mech-002",
    topic: "mechanics",
    front: "E_k = \\frac{1}{2}mv^2",
    back: "Kinetic Energy — energy of a moving object",
    derivation: "W = ∫F·dx = ∫ma·dx = m∫v·dv = ½mv²",
  },
  {
    id: "mech-003",
    topic: "mechanics",
    front: "E_p = mgh",
    back: "Gravitational Potential Energy — energy due to height",
    derivation: "Work done against gravity: W = F·h = mg·h",
  },
  {
    id: "mech-004",
    topic: "mechanics",
    front: "p = mv",
    back: "Linear Momentum — product of mass and velocity",
    derivation: "Defined as p = mv; Newton's 2nd law: F = dp/dt",
  },
  {
    id: "mech-005",
    topic: "mechanics",
    front: "T = 2\\pi\\sqrt{\\frac{l}{g}}",
    back: "Period of a Simple Pendulum — for small angles",
    derivation: "From torque equation: θ̈ = -(g/l)θ → SHM with ω² = g/l → T = 2π/ω",
  },
  {
    id: "mech-006",
    topic: "mechanics",
    front: "v^2 = v_0^2 + 2a\\Delta x",
    back: "Kinematic equation — velocity squared relation",
    derivation: "From v = v₀ + at and Δx = v₀t + ½at², eliminate t",
  },
  {
    id: "mech-007",
    topic: "mechanics",
    front: "F_g = G\\frac{m_1 m_2}{r^2}",
    back: "Newton's Law of Universal Gravitation",
    derivation: "Empirical; G = 6.674×10⁻¹¹ N·m²/kg²",
  },
  {
    id: "mech-008",
    topic: "mechanics",
    front: "\\tau = r \\times F",
    back: "Torque — rotational force",
    derivation: "Vector cross product of radius and force; |τ| = rF·sinθ",
  },
  {
    id: "mech-009",
    topic: "mechanics",
    front: "L = I\\omega",
    back: "Angular Momentum — rotational equivalent of linear momentum",
    derivation: "L = r × p = r × mv; for rigid body: L = Iω",
  },
  {
    id: "mech-010",
    topic: "mechanics",
    front: "W = F \\cdot d \\cdot \\cos\\theta",
    back: "Work done by a force",
    derivation: "W = ∫F·ds; for constant force: W = F·d·cosθ",
  },

  // ─── Electricity ────────────────────────────────────────────────────────────
  {
    id: "elec-001",
    topic: "electricity",
    front: "V = IR",
    back: "Ohm's Law — voltage equals current times resistance",
    derivation: "Empirical relation for ohmic conductors; V = potential difference, I = current, R = resistance",
  },
  {
    id: "elec-002",
    topic: "electricity",
    front: "P = IV = I^2R = \\frac{V^2}{R}",
    back: "Electrical Power",
    derivation: "P = dW/dt = dq/dt · dW/dq = I·V; substitute Ohm's law for variants",
  },
  {
    id: "elec-003",
    topic: "electricity",
    front: "F = k\\frac{q_1 q_2}{r^2}",
    back: "Coulomb's Law — electrostatic force between charges",
    derivation: "k = 1/(4πε₀) ≈ 8.99×10⁹ N·m²/C²; analogous to gravitational law",
  },
  {
    id: "elec-004",
    topic: "electricity",
    front: "C = \\frac{Q}{V}",
    back: "Capacitance — charge stored per unit voltage",
    derivation: "Defined as ratio of charge Q to voltage V; unit: Farad (F)",
  },
  {
    id: "elec-005",
    topic: "electricity",
    front: "E = \\frac{1}{2}CV^2",
    back: "Energy stored in a capacitor",
    derivation: "W = ∫V·dq = ∫(q/C)dq = Q²/(2C) = ½CV²",
  },
  {
    id: "elec-006",
    topic: "electricity",
    front: "\\tau = RC",
    back: "RC Time Constant — characteristic charging time",
    derivation: "From V_C(t) = V₀(1-e^{-t/RC}); at t=τ, V_C = V₀(1-1/e) ≈ 0.632V₀",
  },
  {
    id: "elec-007",
    topic: "electricity",
    front: "\\mathbf{E} = -\\nabla V",
    back: "Electric Field from Potential",
    derivation: "Work done: dW = -q·E·ds = q·dV → E = -dV/ds; vector form: E = -∇V",
  },
  {
    id: "elec-008",
    topic: "electricity",
    front: "\\oint \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{enc}}{\\varepsilon_0}",
    back: "Gauss's Law — electric flux through closed surface",
    derivation: "One of Maxwell's equations; links E-field to enclosed charge",
  },
  {
    id: "elec-009",
    topic: "electricity",
    front: "\\omega_0 = \\frac{1}{\\sqrt{LC}}",
    back: "LC Oscillator Natural Frequency",
    derivation: "From L·d²q/dt² + q/C = 0 → SHM with ω₀ = 1/√(LC)",
  },
  {
    id: "elec-010",
    topic: "electricity",
    front: "\\varepsilon = -\\frac{d\\Phi_B}{dt}",
    back: "Faraday's Law of Electromagnetic Induction",
    derivation: "EMF = rate of change of magnetic flux; negative sign → Lenz's law",
  },

  // ─── Waves ──────────────────────────────────────────────────────────────────
  {
    id: "wave-001",
    topic: "waves",
    front: "v = f\\lambda",
    back: "Wave Speed — frequency times wavelength",
    derivation: "v = distance/time = λ/T = λf",
  },
  {
    id: "wave-002",
    topic: "waves",
    front: "f = \\frac{1}{T}",
    back: "Frequency — reciprocal of period",
    derivation: "f = cycles/second; T = seconds/cycle",
  },
  {
    id: "wave-003",
    topic: "waves",
    front: "y(x,t) = A\\sin(kx - \\omega t + \\phi)",
    back: "Traveling Wave Equation",
    derivation: "k = 2π/λ (wave number), ω = 2πf (angular frequency), φ = initial phase",
  },
  {
    id: "wave-004",
    topic: "waves",
    front: "I \\propto A^2",
    back: "Wave Intensity proportional to Amplitude squared",
    derivation: "I = P/A; P ∝ ω²A²; intensity proportional to square of amplitude",
  },
  {
    id: "wave-005",
    topic: "waves",
    front: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2",
    back: "Snell's Law — refraction at boundary",
    derivation: "From Fermat's principle of least time; n = c/v is refractive index",
  },
  {
    id: "wave-006",
    topic: "waves",
    front: "f' = f\\frac{v \\pm v_o}{v \\mp v_s}",
    back: "Doppler Effect — observed frequency shift",
    derivation: "Upper signs: observer/source approaching; lower: receding",
  },
  {
    id: "wave-007",
    topic: "waves",
    front: "\\Delta x = \\frac{\\lambda L}{d}",
    back: "Double Slit Fringe Spacing",
    derivation: "For constructive interference: d·sinθ = mλ; for small θ: sinθ ≈ tanθ = x/L",
  },
  {
    id: "wave-008",
    topic: "waves",
    front: "f_n = \\frac{nv}{2L}",
    back: "Standing Wave Harmonics (fixed ends)",
    derivation: "Boundary conditions: nodes at x=0 and x=L; λₙ = 2L/n; fₙ = v/λₙ",
  },

  // ─── Thermodynamics ─────────────────────────────────────────────────────────
  {
    id: "thermo-001",
    topic: "thermodynamics",
    front: "PV = nRT",
    back: "Ideal Gas Law",
    derivation: "Combines Boyle's, Charles's, and Avogadro's laws; R = 8.314 J/(mol·K)",
  },
  {
    id: "thermo-002",
    topic: "thermodynamics",
    front: "\\Delta U = Q - W",
    back: "First Law of Thermodynamics — conservation of energy",
    derivation: "ΔU = change in internal energy; Q = heat added to system; W = work done by system",
  },
  {
    id: "thermo-003",
    topic: "thermodynamics",
    front: "\\Delta S \\geq \\frac{Q}{T}",
    back: "Second Law of Thermodynamics — entropy",
    derivation: "Equality for reversible processes; inequality for irreversible; S = k_B ln(Ω)",
  },
  {
    id: "thermo-004",
    topic: "thermodynamics",
    front: "\\eta = 1 - \\frac{T_C}{T_H}",
    back: "Carnot Efficiency — maximum heat engine efficiency",
    derivation: "η = W/Q_H = 1 - Q_C/Q_H = 1 - T_C/T_H (Carnot cycle, reversible)",
  },
  {
    id: "thermo-005",
    topic: "thermodynamics",
    front: "E_k = \\frac{3}{2}k_B T",
    back: "Average Kinetic Energy of Ideal Gas Molecule",
    derivation: "From equipartition theorem: ½m<v²> = (3/2)k_BT; k_B = 1.38×10⁻²³ J/K",
  },
  {
    id: "thermo-006",
    topic: "thermodynamics",
    front: "C_p - C_v = R",
    back: "Mayer's Relation — heat capacities of ideal gas",
    derivation: "C_p = C_v + work done in expansion at constant pressure = C_v + R",
  },
  {
    id: "thermo-007",
    topic: "thermodynamics",
    front: "Q = mc\\Delta T",
    back: "Heat Transfer — sensible heat",
    derivation: "Q = heat energy, m = mass, c = specific heat capacity, ΔT = temperature change",
  },
  {
    id: "thermo-008",
    topic: "thermodynamics",
    front: "PV^\\gamma = \\text{const}",
    back: "Adiabatic Process (no heat exchange)",
    derivation: "γ = C_p/C_v (adiabatic index); derived from dU = -dW with no heat exchange",
  },
];

export function getFlashcardsByTopic(topic: string): Flashcard[] {
  return FLASHCARDS.filter((card) => card.topic === topic);
}

export function getFlashcardById(id: string): Flashcard | undefined {
  return FLASHCARDS.find((card) => card.id === id);
}
