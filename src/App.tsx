import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  Link2,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Sparkles,
  UsersRound,
  Video,
  WalletCards,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
  TrendingUp,
  BarChart3,
  Building2,
  Globe2,
  LockKeyhole,
  LogOut,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

type View =
  | "inicio"
  | "agenda"
  | "pacientes"
  | "financeiro"
  | "configuracoes"
  | "administracao";
type AccessScreen = "landing" | "login" | "two-factor" | "app";
type UserRole = "professional" | "admin";
type CalendarView = "Dia" | "Semana" | "Mês";
type CalendarBlock = {
  id: number;
  day: number;
  time: string;
  endTime: string;
  reason: string;
  allDay: boolean;
  recurring: boolean;
};
type Status = "Confirmado" | "Aguardando" | "Realizado" | "Cancelado";
type PaymentStatus = "Pendente" | "Pago" | "Parcial" | "Isento" | "Cancelado";
type Agreement = "Por sessão" | "Semanal" | "Quinzenal" | "Mensal" | "Pacote";
type PatientProfile = {
  name: string;
  cpf?: string;
  address?: string;
  email: string;
  phone: string;
  value: number;
  agreement: Agreement;
  dueDay: number;
  status: "Ativo" | "Pausado" | "Encerrado";
  notes: string;
  meetUrl?: string;
  patientType?: "Adulto" | "Criança ou adolescente";
  birthDate?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  financialGuardianName?: string;
  financialGuardianPhone?: string;
  reminderRecipient?: "Paciente" | "Responsável";
  meetRecipient?: "Paciente" | "Responsável";
  emergencyContact?: string;
  serviceAuthorized?: boolean;
  onlineAuthorized?: boolean;
};
type Appointment = {
  id: number;
  patient: string;
  day: number;
  time: string;
  status: Status;
  mode: "Online" | "Presencial";
  paid: boolean;
  amount?: number;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  paymentDate?: string;
  meetUrl?: string;
};
type AppSettings = {
  theme: "sereno" | "oceano" | "lavanda" | "terracota";
  professionalName: string;
  crp: string;
  professionalEmail: string;
  professionalPhone: string;
  workStart: string;
  workEnd: string;
  sessionDuration: number;
  breakMinutes: number;
  workDays: string[];
  videoProvider: "Google Meet" | "Microsoft Teams";
};
const defaultSettings: AppSettings = {
  theme: "sereno",
  professionalName: "Kamilla Campos Eugenio",
  crp: "",
  professionalEmail: "",
  professionalPhone: "",
  workStart: "08:00",
  workEnd: "18:00",
  sessionDuration: 50,
  breakMinutes: 10,
  workDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
  videoProvider: "Google Meet",
};

const initialAppointments: Appointment[] = [
  {
    id: 1,
    patient: "Marina Alves",
    day: 1,
    time: "09:00",
    status: "Confirmado",
    mode: "Online",
    paid: true,
  },
  {
    id: 2,
    patient: "Lucas Ribeiro",
    day: 1,
    time: "14:00",
    status: "Aguardando",
    mode: "Online",
    paid: false,
  },
  {
    id: 3,
    patient: "Clara Mendes",
    day: 2,
    time: "10:00",
    status: "Confirmado",
    mode: "Online",
    paid: true,
  },
  {
    id: 4,
    patient: "Rafael Lima",
    day: 2,
    time: "16:00",
    status: "Confirmado",
    mode: "Online",
    paid: false,
  },
  {
    id: 5,
    patient: "Beatriz Souza",
    day: 3,
    time: "08:00",
    status: "Realizado",
    mode: "Online",
    paid: true,
  },
  {
    id: 6,
    patient: "Gabriel Costa",
    day: 3,
    time: "11:00",
    status: "Confirmado",
    mode: "Online",
    paid: true,
  },
  {
    id: 7,
    patient: "Ana Martins",
    day: 4,
    time: "09:00",
    status: "Confirmado",
    mode: "Online",
    paid: false,
  },
  {
    id: 8,
    patient: "João Oliveira",
    day: 4,
    time: "15:00",
    status: "Aguardando",
    mode: "Online",
    paid: true,
  },
  {
    id: 9,
    patient: "Sofia Nunes",
    day: 5,
    time: "10:00",
    status: "Confirmado",
    mode: "Online",
    paid: true,
  },
];
const initialProfiles: PatientProfile[] = [
  {
    name: "Marina Alves",
    email: "marina@exemplo.com",
    phone: "(11) 98765-1020",
    value: 180,
    agreement: "Por sessão",
    dueDay: 17,
    status: "Ativo",
    notes: "Pagamento por Pix após cada sessão.",
  },
  {
    name: "Lucas Ribeiro",
    email: "lucas@exemplo.com",
    phone: "(11) 97731-2040",
    value: 160,
    agreement: "Mensal",
    dueDay: 10,
    status: "Ativo",
    notes: "Pagamento conjunto das sessões do mês.",
  },
  {
    name: "Clara Mendes",
    email: "clara@exemplo.com",
    phone: "(11) 96542-3180",
    value: 180,
    agreement: "Quinzenal",
    dueDay: 15,
    status: "Ativo",
    notes: "",
  },
  {
    name: "Rafael Lima",
    email: "rafael@exemplo.com",
    phone: "(11) 95411-4200",
    value: 150,
    agreement: "Pacote",
    dueDay: 5,
    status: "Ativo",
    notes: "Pacote antecipado de quatro sessões.",
  },
];

const nav = [
  { id: "inicio" as View, label: "Visão geral", icon: LayoutDashboard },
  { id: "agenda" as View, label: "Agenda", icon: CalendarDays },
  { id: "pacientes" as View, label: "Pacientes", icon: UsersRound },
  { id: "financeiro" as View, label: "Financeiro", icon: WalletCards },
];
const weekdays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const dates = ["17", "18", "19", "20", "21"];
const times = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
}
function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatCpf(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function Countdown({ appointment }: { appointment: Appointment }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  const [hour, minute] = appointment.time.split(":").map(Number);
  const target = new Date(
    2026,
    7,
    16 + appointment.day,
    hour,
    minute,
  ).getTime();
  const minutes = Math.floor((target - now) / 60000);
  let label = "começa agora";
  if (minutes > 1440) label = `em ${Math.floor(minutes / 1440)} dias`;
  else if (minutes >= 60)
    label = `em ${Math.floor(minutes / 60)}h ${minutes % 60}min`;
  else if (minutes > 1) label = `em ${minutes} minutos`;
  else if (minutes < -50) label = "atendimento encerrado";
  else if (minutes < 0) label = "em andamento";
  return (
    <span className="countdown">
      <Clock3 size={13} />
      {label}
    </span>
  );
}

function PublicLanding({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="public-site">
      <nav className="public-nav">
        <a className="public-brand" href="#inicio">
          <span>
            <Sparkles size={20} />
          </span>
          <strong>Sereno</strong>
        </a>
        <div className="public-links">
          <a href="#recursos">Recursos</a>
          <a href="#seguranca">Segurança</a>
          <a href="#sobre">Para quem é</a>
        </div>
        <button className="nav-login" onClick={onLogin}>
          Entrar
        </button>
      </nav>

      <main className="public-main" id="inicio">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="hero-badge">
              <Sparkles size={14} /> Sua prática mais leve
            </span>
            <h1>
              Mais presença no cuidado.
              <br />
              <em>Menos peso na gestão.</em>
            </h1>
            <p>
              Agenda, pacientes e financeiro reunidos em um espaço simples,
              acolhedor e pensado para a rotina de psicólogos.
            </p>
            <div className="hero-actions">
              <button className="landing-primary" onClick={onLogin}>
                Acessar demonstração <ArrowRight size={18} />
              </button>
              <a href="#recursos">Conhecer recursos</a>
            </div>
            <div className="trust-row">
              <span>
                <CheckCircle2 size={16} /> Feito para psicólogos
              </span>
              <span>
                <ShieldCheck size={16} /> Acesso protegido
              </span>
              <span>
                <Clock3 size={16} /> Configuração simples
              </span>
            </div>
          </div>
          <div className="hero-product" aria-label="Prévia da agenda Sereno">
            <div className="product-top">
              <span>
                <Sparkles size={16} /> Sereno
              </span>
              <i>Kamilla CE</i>
            </div>
            <div className="product-title">
              <div>
                <small>QUINTA-FEIRA, 20 DE AGOSTO</small>
                <strong>Bom dia, Kamilla.</strong>
              </div>
              <button>
                <Plus size={15} /> Novo atendimento
              </button>
            </div>
            <div className="product-stats">
              <span>
                <b>5</b> Hoje
              </span>
              <span>
                <b>4</b> Confirmados
              </span>
              <span>
                <b>1</b> Aguardando
              </span>
            </div>
            <div className="product-agenda">
              <small>PRÓXIMOS ATENDIMENTOS</small>
              {[
                ["09:00", "Marina Alves", "Confirmado"],
                ["11:00", "Lucas Ribeiro", "Aguardando"],
                ["15:00", "Clara Mendes", "Confirmado"],
              ].map((item) => (
                <div key={item[0]}>
                  <b>{item[0]}</b>
                  <span>
                    <strong>{item[1]}</strong>
                    <small>Online · 50 minutos</small>
                  </span>
                  <i>{item[2]}</i>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section" id="recursos">
          <div className="section-heading">
            <span>UMA ROTINA MAIS SERENA</span>
            <h2>O essencial em um só lugar</h2>
            <p>
              Ferramentas administrativas que acompanham o seu jeito de
              trabalhar.
            </p>
          </div>
          <div className="feature-grid">
            <article>
              <span>
                <CalendarDays />
              </span>
              <h3>Agenda inteligente</h3>
              <p>
                Visualize dia, semana ou mês, bloqueie horários e organize
                sessões de 50 minutos.
              </p>
            </article>
            <article>
              <span>
                <UsersRound />
              </span>
              <h3>Gestão de pacientes</h3>
              <p>
                Informações administrativas, responsáveis e links de atendimento
                sempre acessíveis.
              </p>
            </article>
            <article>
              <span>
                <WalletCards />
              </span>
              <h3>Financeiro simples</h3>
              <p>
                Acompanhe pagamentos e pendências sem transformar o cuidado em
                burocracia.
              </p>
            </article>
            <article>
              <span>
                <Video />
              </span>
              <h3>Atendimento online</h3>
              <p>
                Organize a sala individual e prepare o envio pelo WhatsApp em
                poucos cliques.
              </p>
            </article>
          </div>
        </section>

        <section className="security-band" id="seguranca">
          <div className="security-icon">
            <ShieldCheck />
          </div>
          <div>
            <span>SEGURANÇA DESDE O INÍCIO</span>
            <h2>Privacidade faz parte do cuidado.</h2>
            <p>
              Acesso em duas etapas, perfis separados e uma administração que
              respeita os limites entre operação e informações dos pacientes.
            </p>
          </div>
          <ul>
            <li>
              <Check /> Autenticação em dois fatores
            </li>
            <li>
              <Check /> Controle por perfil de acesso
            </li>
            <li>
              <Check /> Registro de atividades administrativas
            </li>
          </ul>
        </section>

        <section className="audience-section" id="sobre">
          <span>CONSTRUÍDO PARA CRESCER COM VOCÊ</span>
          <h2>
            Comece com sua prática.
            <br />
            Evolua no seu tempo.
          </h2>
          <p>
            O Sereno nasce para a rotina de uma psicóloga e está sendo preparado
            para apoiar clínicas e outros profissionais no futuro.
          </p>
          <button className="landing-primary" onClick={onLogin}>
            Entrar no Sereno <ArrowRight size={18} />
          </button>
        </section>
      </main>
      <footer className="public-footer">
        <a className="public-brand" href="#inicio">
          <span>
            <Sparkles size={18} />
          </span>
          <strong>Sereno</strong>
        </a>
        <p>Gestão acolhedora para psicólogos.</p>
        <small>Protótipo em desenvolvimento · 2026</small>
      </footer>
    </div>
  );
}

function AccessPage({
  step,
  email,
  setEmail,
  password,
  setPassword,
  code,
  setCode,
  error,
  onBack,
  onLogin,
  onVerify,
}: {
  step: "login" | "two-factor";
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
  error: string;
  onBack: () => void;
  onLogin: (event: React.FormEvent) => void;
  onVerify: (event: React.FormEvent) => void;
}) {
  return (
    <div className="access-page">
      <div className="access-aside">
        <a
          className="public-brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onBack();
          }}
        >
          <span>
            <Sparkles size={20} />
          </span>
          <strong>Sereno</strong>
        </a>
        <div>
          <span className="eyebrow">GESTÃO COM LEVEZA</span>
          <h2>
            Seu consultório organizado.
            <br />
            Sua atenção no cuidado.
          </h2>
          <p>Um ambiente tranquilo para acompanhar a rotina profissional.</p>
        </div>
        <blockquote>
          “A tecnologia deve liberar tempo para aquilo que realmente importa: a
          presença.”
        </blockquote>
      </div>
      <div className="access-content">
        <button className="access-back" onClick={onBack}>
          <ChevronLeft size={17} /> Voltar
        </button>
        {step === "login" ? (
          <form className="access-card" onSubmit={onLogin}>
            <span className="access-icon">
              <LockKeyhole />
            </span>
            <h1>Bem-vindo de volta</h1>
            <p>Entre com seus dados para acessar o Sereno.</p>
            <label>
              E-mail profissional
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoFocus
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
              />
            </label>
            {error && (
              <div className="access-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            <button className="access-submit">
              Continuar <ArrowRight size={18} />
            </button>
            <div className="demo-access">
              <strong>Acessos de demonstração</strong>
              <button
                type="button"
                onClick={() => {
                  setEmail("kamilla@sereno.app");
                  setPassword("sereno123");
                }}
              >
                Profissional: kamilla@sereno.app · sereno123
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@sereno.app");
                  setPassword("admin123");
                }}
              >
                Administrador: admin@sereno.app · admin123
              </button>
            </div>
          </form>
        ) : (
          <form className="access-card code-card" onSubmit={onVerify}>
            <span className="access-icon">
              <ShieldCheck />
            </span>
            <h1>Confirme que é você</h1>
            <p>
              Digite o código de seis números enviado ao seu dispositivo seguro.
            </p>
            <label>
              Código de verificação
              <input
                className="code-input"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                required
                autoFocus
              />
            </label>
            {error && (
              <div className="access-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            <button className="access-submit">
              Verificar e entrar <ShieldCheck size={18} />
            </button>
            <div className="demo-code">
              Código desta demonstração: <strong>482731</strong>
            </div>
            <button type="button" className="text-button" onClick={onBack}>
              Usar outra conta
            </button>
          </form>
        )}
        <small className="prototype-note">
          <ShieldCheck size={14} /> Ambiente de demonstração. O envio real do
          código será ativado na versão hospedada.
        </small>
      </div>
    </div>
  );
}

export default function App() {
  const [accessScreen, setAccessScreen] = useState<AccessScreen>("landing");
  const [userRole, setUserRole] = useState<UserRole>("professional");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [accessError, setAccessError] = useState("");
  const [view, setView] = useState<View>("inicio");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [modal, setModal] = useState(false);
  const [patientModal, setPatientModal] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [meetDraft, setMeetDraft] = useState("");
  const [search, setSearch] = useState("");
  const [patientToOpen, setPatientToOpen] = useState<string | null>(null);
  const [patientOpenNonce, setPatientOpenNonce] = useState(0);
  const [toast, setToast] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem("sereno-appointments");
    return saved ? JSON.parse(saved) : initialAppointments;
  });
  const [form, setForm] = useState({
    patient: "",
    day: 1,
    time: "08:00",
    mode: "Online" as "Online" | "Presencial",
    recurring: "Semanal",
  });
  const [patientForm, setPatientForm] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    cpf: "",
    address: "",
    patientType: "Adulto" as "Adulto" | "Criança ou adolescente",
    guardianName: "",
  });
  const [extraPatients, setExtraPatients] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("sereno-patients") || "[]"),
  );
  const [profiles, setProfiles] = useState<PatientProfile[]>(() =>
    JSON.parse(
      localStorage.getItem("sereno-profiles") ||
        JSON.stringify(initialProfiles),
    ),
  );
  const [settings, setSettings] = useState<AppSettings>(() =>
    JSON.parse(
      localStorage.getItem("sereno-settings") ||
        JSON.stringify(defaultSettings),
    ),
  );
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme || "sereno";
  }, [settings.theme]);

  const patients = useMemo(
    () =>
      Array.from(
        new Set([...appointments.map((a) => a.patient), ...extraPatients]),
      ),
    [appointments, extraPatients],
  );
  const results = search.trim()
    ? patients
        .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5)
    : [];
  const confirmed = appointments.filter(
    (a) => a.status === "Confirmado",
  ).length;
  const pending = appointments.filter((a) => a.status === "Aguardando").length;

  function save(next: Appointment[]) {
    setAppointments(next);
    localStorage.setItem("sereno-appointments", JSON.stringify(next));
  }
  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }
  function createAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!form.patient.trim()) return;
    save([
      ...appointments,
      {
        id: Date.now(),
        patient: form.patient.trim(),
        day: form.day,
        time: form.time,
        mode: form.mode,
        status: "Aguardando",
        paid: false,
      },
    ]);
    setModal(false);
    setForm({
      patient: "",
      day: 1,
      time: "08:00",
      mode: "Online",
      recurring: "Semanal",
    });
    notify("Atendimento agendado com sucesso");
  }
  function openAt(day: number, time: string) {
    setForm((f) => ({ ...f, day, time }));
    setModal(true);
  }
  function updateAppointment(
    id: number,
    changes: Partial<Appointment>,
    message: string,
  ) {
    const next = appointments.map((a) =>
      a.id === id ? { ...a, ...changes } : a,
    );
    save(next);
    setSelected(next.find((a) => a.id === id) || null);
    notify(message);
  }
  function patientMeet(a: Appointment) {
    return (
      profiles.find((p) => p.name === a.patient)?.meetUrl || a.meetUrl || ""
    );
  }
  function openAppointment(a: Appointment) {
    setSelected(a);
    setMeetDraft(patientMeet(a));
  }
  function saveMeet() {
    if (!selected || !/^https:\/\/meet\.google\.com\//.test(meetDraft.trim())) {
      notify("Cole um link válido do Google Meet");
      return;
    }
    const current = profiles.find((p) => p.name === selected.patient) ?? {
      name: selected.patient,
      email: "",
      phone: "",
      value: selected.amount ?? 180,
      agreement: "Por sessão" as Agreement,
      dueDay: 10,
      status: "Ativo" as const,
      notes: "",
    };
    saveProfile({ ...current, meetUrl: meetDraft.trim() });
    setSelected({ ...selected, meetUrl: meetDraft.trim() });
    notify("Sala fixa salva para este paciente");
  }
  function sendWhatsApp(a: Appointment) {
    const room = patientMeet(a);
    if (!room) {
      notify("Salve primeiro a sala fixa do paciente");
      return;
    }
    const profile = profiles.find((p) => p.name === a.patient);
    const contactPhone =
      profile?.meetRecipient === "Responsável"
        ? profile.guardianPhone
        : profile?.phone;
    const phone = contactPhone?.replace(/\D/g, "") || "";
    const message = `Olá, ${a.patient.split(" ")[0]}! Segue o link do nosso atendimento de ${weekdays[a.day - 1].toLowerCase()}, às ${a.time}:\n\n${room}`;
    window.open(
      `https://wa.me/${phone.startsWith("55") ? phone : `55${phone}`}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  function createPatient(e: React.FormEvent) {
    e.preventDefault();
    if (!patientForm.name.trim()) return;
    const next = [...extraPatients, patientForm.name.trim()];
    setExtraPatients(next);
    localStorage.setItem("sereno-patients", JSON.stringify(next));
    const newProfile: PatientProfile = {
      name: patientForm.name.trim(),
      email: patientForm.email.trim(),
      phone: patientForm.phone.trim(),
      value: 180,
      agreement: "Por sessão",
      dueDay: 10,
      status: "Ativo",
      notes: "",
      patientType: patientForm.patientType,
      birthDate: patientForm.birthDate,
      cpf: patientForm.cpf,
      address: patientForm.address.trim(),
      guardianName: patientForm.guardianName.trim(),
    };
    const nextProfiles = [
      ...profiles.filter((p) => p.name !== newProfile.name),
      newProfile,
    ];
    setProfiles(nextProfiles);
    localStorage.setItem("sereno-profiles", JSON.stringify(nextProfiles));
    setPatientModal(false);
    setPatientForm({
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      cpf: "",
      address: "",
      patientType: "Adulto",
      guardianName: "",
    });
    setPatientToOpen(newProfile.name);
    setPatientOpenNonce((value) => value + 1);
    setView("pacientes");
    notify("Paciente cadastrado com sucesso");
  }
  function saveProfile(profile: PatientProfile) {
    const next = profiles.some((p) => p.name === profile.name)
      ? profiles.map((p) => (p.name === profile.name ? profile : p))
      : [...profiles, profile];
    setProfiles(next);
    localStorage.setItem("sereno-profiles", JSON.stringify(next));
    notify("Acordo e cadastro atualizados");
  }
  function deletePatient(name: string) {
    if (
      !window.confirm(
        `Excluir permanentemente ${name} e todos os atendimentos vinculados? Esta ação não pode ser desfeita.`,
      )
    )
      return false;
    const nextProfiles = profiles.filter((profile) => profile.name !== name);
    const nextExtra = extraPatients.filter((patient) => patient !== name);
    const nextAppointments = appointments.filter(
      (appointment) => appointment.patient !== name,
    );
    setProfiles(nextProfiles);
    setExtraPatients(nextExtra);
    save(nextAppointments);
    localStorage.setItem("sereno-profiles", JSON.stringify(nextProfiles));
    localStorage.setItem("sereno-patients", JSON.stringify(nextExtra));
    notify("Paciente e atendimentos vinculados foram excluídos");
    return true;
  }
  function saveSettings(next: AppSettings) {
    setSettings(next);
    localStorage.setItem("sereno-settings", JSON.stringify(next));
    notify("Configurações salvas");
  }

  function beginLogin(event: React.FormEvent) {
    event.preventDefault();
    const professional =
      loginEmail.toLowerCase() === "kamilla@sereno.app" &&
      loginPassword === "sereno123";
    const administrator =
      loginEmail.toLowerCase() === "admin@sereno.app" &&
      loginPassword === "admin123";
    if (!professional && !administrator) {
      setAccessError(
        "E-mail ou senha não conferem. Use um dos acessos de demonstração.",
      );
      return;
    }
    setUserRole(administrator ? "admin" : "professional");
    setAccessError("");
    setVerificationCode("");
    setAccessScreen("two-factor");
  }

  function verifyAccess(event: React.FormEvent) {
    event.preventDefault();
    if (verificationCode !== "482731") {
      setAccessError("Código incorreto. Para esta demonstração, use 482731.");
      return;
    }
    setAccessError("");
    setView(userRole === "admin" ? "administracao" : "inicio");
    setAccessScreen("app");
  }

  function logout() {
    setAccessScreen("landing");
    setView("inicio");
    setLoginEmail("");
    setLoginPassword("");
    setVerificationCode("");
    setAccessError("");
  }

  if (accessScreen === "landing") {
    return <PublicLanding onLogin={() => setAccessScreen("login")} />;
  }

  if (accessScreen === "login" || accessScreen === "two-factor") {
    return (
      <AccessPage
        step={accessScreen}
        email={loginEmail}
        setEmail={setLoginEmail}
        password={loginPassword}
        setPassword={setLoginPassword}
        code={verificationCode}
        setCode={setVerificationCode}
        error={accessError}
        onBack={() => {
          setAccessError("");
          setAccessScreen(accessScreen === "two-factor" ? "login" : "landing");
        }}
        onLogin={beginLogin}
        onVerify={verifyAccess}
      />
    );
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={20} />
          </div>
          <div>
            <strong>Sereno</strong>
            <span>Gestão para psicólogos</span>
          </div>
        </div>
        <button className="close-mobile" onClick={() => setMobileMenu(false)}>
          <X />
        </button>
        <nav>
          {userRole === "professional" &&
            nav.map((item) => (
              <button
                key={item.id}
                className={view === item.id ? "active" : ""}
                onClick={() => {
                  setView(item.id);
                  setMobileMenu(false);
                }}
              >
                <item.icon size={19} />
                {item.label}
              </button>
            ))}
          {userRole === "admin" && (
            <button
              className={view === "administracao" ? "active" : ""}
              onClick={() => setView("administracao")}
            >
              <ShieldCheck size={19} /> Administração
            </button>
          )}
        </nav>
        <div className="sidebar-bottom">
          {userRole === "professional" && (
            <button
              onClick={() =>
                notify(
                  "Integrações: Google e Microsoft serão conectados na versão online",
                )
              }
            >
              <Link2 size={19} />
              Integrações<span className="soon">Em breve</span>
            </button>
          )}
          {userRole === "professional" && (
            <button
              className={view === "configuracoes" ? "active" : ""}
              onClick={() => setView("configuracoes")}
            >
              <Settings size={19} />
              Configurações
            </button>
          )}
          <button onClick={logout}>
            <LogOut size={19} />
            Sair com segurança
          </button>
          <div className="help-card">
            <MessageCircle size={22} />
            <strong>Precisa de ajuda?</strong>
            <span>Estamos por perto.</span>
            <button
              onClick={() =>
                notify("Canal de suporte será ativado na versão publicada")
              }
            >
              Falar com suporte
            </button>
          </div>
        </div>
      </aside>
      {mobileMenu && (
        <div className="overlay" onClick={() => setMobileMenu(false)} />
      )}
      <main>
        <header>
          <button className="menu-mobile" onClick={() => setMobileMenu(true)}>
            <Menu />
          </button>
          {userRole === "professional" ? (
            <div className="search">
              <Search size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar pacientes..."
              />
              {results.length > 0 && (
                <div className="search-results">
                  {results.map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        setPatientToOpen(name);
                        setPatientOpenNonce((value) => value + 1);
                        setView("pacientes");
                        setSearch("");
                        notify(`${name} encontrado`);
                      }}
                    >
                      <div className="avatar soft">{initials(name)}</div>
                      <span>
                        <strong>{name}</strong>
                        <small>Abrir cadastro administrativo</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="admin-header-label">
              <ShieldCheck size={18} /> Central administrativa
            </div>
          )}
          <div className="header-actions">
            <button
              className="icon-button"
              onClick={() =>
                notify(`${pending} confirmações aguardando resposta`)
              }
            >
              <Bell size={19} />
              {pending > 0 && <i />}
            </button>
            <div
              className="profile"
              onClick={() =>
                notify(
                  userRole === "admin"
                    ? "Perfil administrador de Paulo"
                    : "Perfil de Kamilla Campos Eugenio",
                )
              }
            >
              <div className="avatar">{userRole === "admin" ? "PE" : "KC"}</div>
              <div>
                <strong>
                  {userRole === "admin"
                    ? "Paulo Eugenio"
                    : "Kamilla Campos Eugenio"}
                </strong>
                <span>
                  {userRole === "admin" ? "Administrador" : "Psicóloga"}
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="content">
          {view === "agenda" && (
            <Agenda
              appointments={appointments}
              confirmed={confirmed}
              pending={pending}
              openAt={openAt}
              setModal={setModal}
              select={openAppointment}
            />
          )}
          {view === "inicio" && (
            <Overview
              appointments={appointments}
              profiles={profiles}
              setModal={setModal}
              select={openAppointment}
              go={setView}
            />
          )}
          {view === "pacientes" && (
            <Patients
              key={`${patientToOpen || "patient-list"}-${patientOpenNonce}`}
              names={patients}
              profiles={profiles}
              saveProfile={saveProfile}
              deletePatient={deletePatient}
              openPatientName={patientToOpen}
              newPatient={() => setPatientModal(true)}
              notify={notify}
            />
          )}
          {view === "financeiro" && (
            <Finance
              appointments={appointments}
              profiles={profiles}
              saveProfile={saveProfile}
              update={updateAppointment}
            />
          )}
          {view === "configuracoes" && (
            <SettingsPage settings={settings} save={saveSettings} />
          )}
          {view === "administracao" && <AdminArea notify={notify} />}
        </div>
      </main>
      {modal && (
        <div className="modal-backdrop" onMouseDown={() => setModal(false)}>
          <form
            className="modal"
            onSubmit={createAppointment}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">NOVO COMPROMISSO</span>
                <h2>Agendar atendimento</h2>
                <p>A sessão terá duração padrão de 50 minutos.</p>
              </div>
              <button type="button" onClick={() => setModal(false)}>
                <X />
              </button>
            </div>
            <label>
              Paciente
              <input
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                placeholder="Nome do paciente"
                autoFocus
              />
            </label>
            <div className="form-row">
              <label>
                Dia
                <select
                  value={form.day}
                  onChange={(e) =>
                    setForm({ ...form, day: Number(e.target.value) })
                  }
                >
                  {weekdays.map((d, i) => (
                    <option value={i + 1} key={d}>
                      {d}, {dates[i]} ago.
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Horário
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                >
                  {times.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-row">
              <label>
                Modalidade
                <select
                  value={form.mode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mode: e.target.value as "Online" | "Presencial",
                    })
                  }
                >
                  <option>Online</option>
                  <option>Presencial</option>
                </select>
              </label>
              <label>
                Recorrência
                <select
                  value={form.recurring}
                  onChange={(e) =>
                    setForm({ ...form, recurring: e.target.value })
                  }
                >
                  <option>Não repetir</option>
                  <option>Semanal</option>
                  <option>Quinzenal</option>
                </select>
              </label>
            </div>
            <div className="duration-note">
              <Clock3 size={18} />
              <span>
                <strong>
                  {form.time} –{" "}
                  {String(
                    Number(form.time.slice(0, 2)) +
                      (Number(form.time.slice(3)) + 50 >= 60 ? 1 : 0),
                  ).padStart(2, "0")}
                  :
                  {String((Number(form.time.slice(3)) + 50) % 60).padStart(
                    2,
                    "0",
                  )}
                </strong>{" "}
                · 50 minutos
              </span>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setModal(false)}
              >
                Cancelar
              </button>
              <button className="primary">
                <Check size={18} />
                Agendar atendimento
              </button>
            </div>
          </form>
        </div>
      )}
      {patientModal && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setPatientModal(false)}
        >
          <form
            className="modal"
            onSubmit={createPatient}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">NOVO CONTATO</span>
                <h2>Cadastrar paciente</h2>
                <p>Somente informações administrativas nesta etapa.</p>
              </div>
              <button type="button" onClick={() => setPatientModal(false)}>
                <X />
              </button>
            </div>
            <label>
              Nome
              <input
                autoFocus
                required
                value={patientForm.name}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, name: e.target.value })
                }
                placeholder="Nome completo"
              />
            </label>
            <label>
              Tipo de paciente
              <select
                value={patientForm.patientType}
                onChange={(e) =>
                  setPatientForm({
                    ...patientForm,
                    patientType: e.target.value as
                      "Adulto" | "Criança ou adolescente",
                  })
                }
              >
                <option>Adulto</option>
                <option>Criança ou adolescente</option>
              </select>
            </label>
            {patientForm.patientType === "Criança ou adolescente" && (
              <label>
                Nome do responsável legal
                <input
                  required
                  value={patientForm.guardianName}
                  onChange={(e) =>
                    setPatientForm({
                      ...patientForm,
                      guardianName: e.target.value,
                    })
                  }
                  placeholder="Nome completo do responsável"
                />
              </label>
            )}
            <label>
              Data de nascimento
              <input
                type="date"
                required
                value={patientForm.birthDate}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, birthDate: e.target.value })
                }
              />
            </label>
            <label>
              CPF
              <input
                inputMode="numeric"
                required
                value={patientForm.cpf}
                onChange={(e) =>
                  setPatientForm({
                    ...patientForm,
                    cpf: formatCpf(e.target.value),
                  })
                }
                placeholder="000.000.000-00"
              />
            </label>
            <label>
              Endereço completo
              <input
                required
                value={patientForm.address}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, address: e.target.value })
                }
                placeholder="Rua, número, complemento, cidade e estado"
              />
            </label>
            <div className="form-row">
              <label>
                E-mail
                <input
                  type="email"
                  value={patientForm.email}
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, email: e.target.value })
                  }
                  placeholder="email@exemplo.com"
                />
              </label>
              <label>
                Telefone
                <input
                  value={patientForm.phone}
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, phone: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                />
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setPatientModal(false)}
              >
                Cancelar
              </button>
              <button className="primary">
                <Check size={18} />
                Cadastrar paciente
              </button>
            </div>
          </form>
        </div>
      )}
      {selected && (
        <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
          <section
            className="modal detail-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">DETALHES DO ATENDIMENTO</span>
                <h2>{selected.patient}</h2>
                <p>
                  {weekdays[selected.day - 1]}, às {selected.time} · 50 minutos
                </p>
              </div>
              <button onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>
            <div className="detail-grid">
              <div>
                <span>Modalidade</span>
                <strong>{selected.mode}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{selected.status}</strong>
              </div>
              <div>
                <span>Pagamento</span>
                <strong>
                  {selected.paymentStatus ||
                    (selected.paid ? "Pago" : "Pendente")}
                </strong>
              </div>
              <div>
                <span>Valor</span>
                <strong>{money(selected.amount ?? 180)}</strong>
              </div>
            </div>
            {selected.mode === "Online" && (
              <div className="meet-box">
                <div className="meet-title">
                  <span>
                    <Video size={17} />
                    Sala do atendimento
                  </span>
                  {selected.meetUrl && (
                    <small>
                      <CheckCircle2 size={13} />
                      Link salvo
                    </small>
                  )}
                </div>
                <div className="meet-input">
                  <input
                    value={meetDraft}
                    onChange={(e) => setMeetDraft(e.target.value)}
                    placeholder="Cole o link meet.google.com aqui"
                  />
                  <button className="secondary" onClick={saveMeet}>
                    Salvar
                  </button>
                </div>
                <div className="meet-actions">
                  <a
                    className="secondary"
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Plus size={16} />
                    Criar nova sala
                  </a>
                  <a
                    className={`primary ${!selected.meetUrl ? "disabled" : ""}`}
                    href={selected.meetUrl || undefined}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Video size={16} />
                    Entrar na sala
                  </a>
                  <button
                    className="whatsapp"
                    onClick={() => sendWhatsApp(selected)}
                  >
                    <MessageCircle size={16} />
                    Enviar link
                  </button>
                </div>
                <p>
                  Crie a sala, copie o endereço e salve-o aqui. Cada atendimento
                  mantém seu próprio link.
                </p>
              </div>
            )}
            <div className="detail-actions">
              <button
                className="secondary"
                onClick={() =>
                  updateAppointment(
                    selected.id,
                    { status: "Confirmado" },
                    "Atendimento confirmado",
                  )
                }
              >
                Confirmar
              </button>
              <button
                className="secondary"
                onClick={() =>
                  updateAppointment(
                    selected.id,
                    { status: "Realizado" },
                    "Atendimento marcado como realizado",
                  )
                }
              >
                Realizado
              </button>
              <button
                className="secondary"
                onClick={() =>
                  updateAppointment(
                    selected.id,
                    {
                      paid: !selected.paid,
                      paymentStatus: selected.paid ? "Pendente" : "Pago",
                      paymentMethod: selected.paid ? undefined : "Pix",
                      paymentDate: selected.paid
                        ? undefined
                        : new Date().toISOString().slice(0, 10),
                    },
                    selected.paid
                      ? "Pagamento marcado como pendente"
                      : "Pagamento registrado",
                  )
                }
              >
                {selected.paid ? "Marcar pendente" : "Registrar pagamento"}
              </button>
              <button
                className="danger"
                onClick={() =>
                  updateAppointment(
                    selected.id,
                    { status: "Cancelado", paymentStatus: "Cancelado" },
                    "Atendimento cancelado",
                  )
                }
              >
                Cancelar atendimento
              </button>
            </div>
          </section>
        </div>
      )}
      {toast && (
        <div className="toast">
          <Check size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}

function Agenda({
  appointments,
  confirmed,
  pending,
  openAt,
  setModal,
  select,
}: {
  appointments: Appointment[];
  confirmed: number;
  pending: number;
  openAt: (d: number, t: string) => void;
  setModal: (v: boolean) => void;
  select: (a: Appointment) => void;
}) {
  const [week, setWeek] = useState(0);
  const [calendarView, setCalendarView] = useState<CalendarView>("Semana");
  const [selectedDay, setSelectedDay] = useState(4);
  const [blockModal, setBlockModal] = useState(false);
  const [blocks, setBlocks] = useState<CalendarBlock[]>(() =>
    JSON.parse(
      localStorage.getItem("sereno-blocks") ||
        JSON.stringify([
          {
            id: 1,
            day: 1,
            time: "11:00",
            endTime: "12:00",
            reason: "Compromisso pessoal",
            allDay: false,
            recurring: false,
          },
          {
            id: 2,
            day: 3,
            time: "14:00",
            endTime: "15:00",
            reason: "Horário bloqueado",
            allDay: false,
            recurring: true,
          },
        ]),
    ),
  );
  const [blockForm, setBlockForm] = useState({
    day: 1,
    time: "08:00",
    endTime: "09:00",
    reason: "Compromisso pessoal",
    allDay: false,
    recurring: false,
  });
  function createBlock(e: React.FormEvent) {
    e.preventDefault();
    const next = [...blocks, { ...blockForm, id: Date.now() }];
    setBlocks(next);
    localStorage.setItem("sereno-blocks", JSON.stringify(next));
    setBlockModal(false);
  }
  function removeBlock(block: CalendarBlock) {
    if (window.confirm(`Remover o bloqueio “${block.reason}”?`)) {
      const next = blocks.filter((b) => b.id !== block.id);
      setBlocks(next);
      localStorage.setItem("sereno-blocks", JSON.stringify(next));
    }
  }
  const label =
    week === 0
      ? "17 – 21 de agosto, 2026"
      : week < 0
        ? "10 – 14 de agosto, 2026"
        : "24 – 28 de agosto, 2026";
  return (
    <>
      <section className="page-title">
        <div>
          <span className="eyebrow">SUA SEMANA</span>
          <h1>Agenda</h1>
          <p>Organize seus atendimentos com tranquilidade.</p>
        </div>
        <div className="page-actions">
          <button className="secondary" onClick={() => setBlockModal(true)}>
            <Clock3 size={18} />
            Bloquear horário
          </button>
          <button className="primary" onClick={() => setModal(true)}>
            <Plus size={19} />
            Novo atendimento
          </button>
        </div>
      </section>
      <section className="stats compact">
        <div>
          <span className="stat-icon green">
            <CalendarDays />
          </span>
          <p>
            <b>{appointments.length}</b>
            <span>atendimentos na semana</span>
          </p>
        </div>
        <div>
          <span className="stat-icon mint">
            <Check />
          </span>
          <p>
            <b>{confirmed}</b>
            <span>confirmados</span>
          </p>
        </div>
        <div>
          <span className="stat-icon sand">
            <Clock3 />
          </span>
          <p>
            <b>{pending}</b>
            <span>aguardando confirmação</span>
          </p>
        </div>
      </section>
      <section className="calendar-card">
        <div className="calendar-toolbar">
          <div>
            <button
              aria-label="Semana anterior"
              onClick={() => setWeek((w) => w - 1)}
            >
              <ChevronLeft />
            </button>
            <button
              aria-label="Próxima semana"
              onClick={() => setWeek((w) => w + 1)}
            >
              <ChevronRight />
            </button>
            <button className="today" onClick={() => setWeek(0)}>
              Hoje
            </button>
            <h2>{label}</h2>
          </div>
          <div className="view-switch">
            {(["Dia", "Semana", "Mês"] as CalendarView[]).map((v) => (
              <button
                key={v}
                className={calendarView === v ? "selected" : ""}
                onClick={() => setCalendarView(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        {calendarView === "Dia" ? (
          <div className="day-view">
            <div className="day-selector">
              {weekdays.map((day, i) => (
                <button
                  key={day}
                  className={selectedDay === i + 1 ? "selected" : ""}
                  onClick={() => setSelectedDay(i + 1)}
                >
                  <span>{day}</span>
                  <b>{dates[i]}</b>
                </button>
              ))}
            </div>
            <div className="day-timeline">
              {times.map((time, timeIndex) => {
                const a = appointments.find(
                  (x) => x.day === selectedDay && x.time === time,
                );
                const blocking = blocks.find(
                  (b) => b.day === selectedDay && (b.allDay || b.time === time),
                );
                const block =
                  blocking?.allDay && timeIndex > 0 ? undefined : blocking;
                return (
                  <div
                    className={`day-line ${blocking ? "unavailable" : ""}`}
                    key={time}
                  >
                    <span>{time}</span>
                    <div>
                      {a ? (
                        <button
                          className={`day-event appointment ${a.status.toLowerCase()}`}
                          onClick={() => select(a)}
                        >
                          <strong>{a.patient}</strong>
                          <small>
                            {a.mode} · {a.status} · 50 minutos
                          </small>
                        </button>
                      ) : block ? (
                        <button
                          className="day-event blocked"
                          onClick={() => removeBlock(block)}
                        >
                          <strong>{block.reason}</strong>
                          <small>
                            {block.allDay
                              ? "Dia inteiro"
                              : `${block.time}–${block.endTime}`}{" "}
                            {block.recurring ? "· Repete semanalmente" : ""}
                          </small>
                        </button>
                      ) : blocking ? (
                        <span className="blocked-continuation">
                          Indisponível
                        </span>
                      ) : (
                        <button
                          className="free-line"
                          onClick={() => openAt(selectedDay, time)}
                        >
                          <Plus size={15} />
                          Agendar neste horário
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : calendarView === "Mês" ? (
          <div className="month-view">
            <div className="month-weekdays">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="month-grid">
              {Array.from({ length: 42 }, (_, i) => {
                const day = i - 4;
                const inMonth = day > 0 && day <= 31;
                const dayAppointments =
                  inMonth && week === 0 && day >= 17 && day <= 21
                    ? appointments.filter((a) => a.day === day - 16)
                    : [];
                const dayBlocks =
                  inMonth && week === 0 && day >= 17 && day <= 21
                    ? blocks.filter((b) => b.day === day - 16)
                    : [];
                return (
                  <button
                    key={i}
                    className={`month-day ${!inMonth ? "outside" : ""} ${day === 13 ? "today-date" : ""}`}
                    disabled={!inMonth}
                    onClick={() => {
                      if (day >= 17 && day <= 21) {
                        setSelectedDay(day - 16);
                        setCalendarView("Dia");
                      }
                    }}
                  >
                    <b>{inMonth ? day : ""}</b>
                    {dayAppointments.length > 0 && (
                      <span className="month-count">
                        {dayAppointments.length} atendimento
                        {dayAppointments.length > 1 ? "s" : ""}
                      </span>
                    )}
                    {dayBlocks.length > 0 && (
                      <span className="month-block">
                        {dayBlocks.length} bloqueio
                        {dayBlocks.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="week-grid">
            <div className="corner"></div>
            {weekdays.map((d, i) => (
              <div
                className={`day-head ${i === 3 && week === 0 ? "current" : ""}`}
                key={d}
              >
                <span>{d}</span>
                <b>{Number(dates[i]) + week * 7}</b>
              </div>
            ))}
            {times.flatMap((time) => [
              <div className="time" key={`t-${time}`}>
                {time}
              </div>,
              ...weekdays.map((_, i) => {
                const a =
                  week === 0
                    ? appointments.find(
                        (x) => x.day === i + 1 && x.time === time,
                      )
                    : undefined;
                const blocking =
                  week === 0
                    ? blocks.find(
                        (b) => b.day === i + 1 && (b.allDay || b.time === time),
                      )
                    : undefined;
                const block =
                  blocking?.allDay && time !== times[0] ? undefined : blocking;
                return (
                  <div
                    className="slot"
                    key={`${i}-${time}`}
                    onClick={() =>
                      !a && !blocking && week === 0 && openAt(i + 1, time)
                    }
                  >
                    {a ? (
                      <button
                        className={`appointment ${a.status.toLowerCase()}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          select(a);
                        }}
                      >
                        <span>
                          {a.time}–
                          {String(
                            Number(a.time.slice(0, 2)) +
                              (Number(a.time.slice(3)) + 50 >= 60 ? 1 : 0),
                          ).padStart(2, "0")}
                          :
                          {String((Number(a.time.slice(3)) + 50) % 60).padStart(
                            2,
                            "0",
                          )}
                        </span>
                        <strong>{a.patient.split(" ")[0]}</strong>
                        <small>
                          {a.mode}
                          <i>•</i>
                          {a.status}
                        </small>
                      </button>
                    ) : block ? (
                      <button
                        className="appointment blocked"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBlock(block);
                        }}
                      >
                        <span>
                          {block.allDay
                            ? "Dia inteiro"
                            : `${block.time}–${block.endTime}`}
                        </span>
                        <strong>{block.reason}</strong>
                        <small>
                          {block.recurring ? "Semanal" : "Bloqueado"}
                        </small>
                      </button>
                    ) : blocking ? (
                      <span className="blocked-continuation">Indisponível</span>
                    ) : (
                      <span className="add-slot">
                        <Plus size={15} />
                      </span>
                    )}
                  </div>
                );
              }),
            ])}
          </div>
        )}
      </section>
      {blockModal && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setBlockModal(false)}
        >
          <form
            className="modal"
            onSubmit={createBlock}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">INDISPONIBILIDADE</span>
                <h2>Bloquear horário</h2>
                <p>O período ficará indisponível para novos atendimentos.</p>
              </div>
              <button type="button" onClick={() => setBlockModal(false)}>
                <X />
              </button>
            </div>
            <div className="form-row">
              <label>
                Dia
                <select
                  value={blockForm.day}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, day: Number(e.target.value) })
                  }
                >
                  {weekdays.map((d, i) => (
                    <option key={d} value={i + 1}>
                      {d}, {dates[i]} de agosto
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Motivo
                <select
                  value={blockForm.reason}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, reason: e.target.value })
                  }
                >
                  <option>Compromisso pessoal</option>
                  <option>Almoço</option>
                  <option>Férias</option>
                  <option>Feriado</option>
                  <option>Indisponibilidade</option>
                  <option>Intervalo extraordinário</option>
                </select>
              </label>
            </div>
            <label className="check-line">
              <input
                type="checkbox"
                checked={blockForm.allDay}
                onChange={(e) =>
                  setBlockForm({ ...blockForm, allDay: e.target.checked })
                }
              />
              <span>Bloquear o dia inteiro</span>
            </label>
            {!blockForm.allDay && (
              <div className="form-row">
                <label>
                  Início
                  <select
                    value={blockForm.time}
                    onChange={(e) =>
                      setBlockForm({ ...blockForm, time: e.target.value })
                    }
                  >
                    {times.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Término
                  <input
                    type="time"
                    value={blockForm.endTime}
                    onChange={(e) =>
                      setBlockForm({ ...blockForm, endTime: e.target.value })
                    }
                  />
                </label>
              </div>
            )}
            <label className="check-line">
              <input
                type="checkbox"
                checked={blockForm.recurring}
                onChange={(e) =>
                  setBlockForm({ ...blockForm, recurring: e.target.checked })
                }
              />
              <span>Repetir toda semana</span>
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setBlockModal(false)}
              >
                Cancelar
              </button>
              <button className="primary">
                <Clock3 size={17} />
                Criar bloqueio
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function AdminArea({ notify }: { notify: (message: string) => void }) {
  const [professionals, setProfessionals] = useState([
    {
      name: "Kamilla Campos Eugenio",
      email: "kamilla@sereno.app",
      plan: "Fundador",
      status: "Ativo",
      lastAccess: "Hoje, 09:42",
    },
    {
      name: "Conta de demonstração",
      email: "demo@sereno.app",
      plan: "Teste",
      status: "Convite",
      lastAccess: "Nunca acessou",
    },
  ]);
  const [tab, setTab] = useState<"visao" | "profissionais" | "auditoria">(
    "visao",
  );
  const [inviteModal, setInviteModal] = useState(false);
  const [invite, setInvite] = useState({ name: "", email: "" });

  function addProfessional(event: React.FormEvent) {
    event.preventDefault();
    if (!invite.name.trim() || !invite.email.trim()) return;
    setProfessionals([
      ...professionals,
      {
        name: invite.name.trim(),
        email: invite.email.trim(),
        plan: "Teste",
        status: "Convite",
        lastAccess: "Nunca acessou",
      },
    ]);
    setInvite({ name: "", email: "" });
    setInviteModal(false);
    notify("Convite de demonstração criado");
  }

  return (
    <div className="admin-area">
      <section className="page-title admin-title">
        <div>
          <span className="eyebrow">CENTRAL DO SERENO</span>
          <h1>Administração</h1>
          <p>
            Uma visão segura da operação, sem acesso ao conteúdo dos pacientes.
          </p>
        </div>
        <button className="primary" onClick={() => setInviteModal(true)}>
          <Plus size={18} /> Convidar profissional
        </button>
      </section>
      <div className="admin-tabs">
        {(
          [
            ["visao", "Visão geral"],
            ["profissionais", "Profissionais"],
            ["auditoria", "Auditoria"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            className={tab === id ? "active" : ""}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "visao" && (
        <>
          <section className="admin-metrics">
            <article>
              <span className="metric-icon">
                <UserRoundCheck />
              </span>
              <div>
                <small>PROFISSIONAIS</small>
                <strong>{professionals.length}</strong>
                <p>1 conta ativa</p>
              </div>
            </article>
            <article>
              <span className="metric-icon blue">
                <Building2 />
              </span>
              <div>
                <small>ORGANIZAÇÕES</small>
                <strong>1</strong>
                <p>Ambiente Sereno</p>
              </div>
            </article>
            <article>
              <span className="metric-icon amber">
                <TrendingUp />
              </span>
              <div>
                <small>RECEITA MENSAL</small>
                <strong>R$ 0</strong>
                <p>Fase de demonstração</p>
              </div>
            </article>
            <article>
              <span className="metric-icon purple">
                <ShieldCheck />
              </span>
              <div>
                <small>SEGURANÇA</small>
                <strong>2FA</strong>
                <p>Ativo no acesso</p>
              </div>
            </article>
          </section>
          <section className="admin-columns">
            <article className="admin-panel">
              <div className="panel-heading">
                <div>
                  <span>ATIVIDADE</span>
                  <h2>Crescimento do Sereno</h2>
                </div>
                <BarChart3 />
              </div>
              <div className="growth-chart">
                {[28, 35, 31, 48, 55, 68, 74, 82].map((height, index) => (
                  <i key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="chart-labels">
                <span>Jan</span>
                <span>Fev</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>Mai</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Ago</span>
              </div>
            </article>
            <article className="admin-panel">
              <div className="panel-heading">
                <div>
                  <span>AMBIENTE</span>
                  <h2>Estado dos serviços</h2>
                </div>
                <Globe2 />
              </div>
              <div className="service-list">
                <div>
                  <i className="online" />
                  <span>
                    <strong>Aplicação web</strong>
                    <small>Operacional</small>
                  </span>
                  <b>99,9%</b>
                </div>
                <div>
                  <i className="online" />
                  <span>
                    <strong>Armazenamento local</strong>
                    <small>Operacional</small>
                  </span>
                  <b>Local</b>
                </div>
                <div>
                  <i className="planned" />
                  <span>
                    <strong>Envio de notificações</strong>
                    <small>Planejado</small>
                  </span>
                  <b>Em breve</b>
                </div>
              </div>
            </article>
          </section>
          <section className="admin-privacy">
            <ShieldCheck />
            <div>
              <strong>Administração com privacidade</strong>
              <p>
                Esta central mostra contas e operação da plataforma.
                Prontuários, anotações e conteúdo de pacientes não aparecem para
                administradores.
              </p>
            </div>
          </section>
        </>
      )}

      {tab === "profissionais" && (
        <section className="admin-panel professional-panel">
          <div className="panel-heading">
            <div>
              <span>CONTAS</span>
              <h2>Profissionais cadastrados</h2>
            </div>
            <button className="secondary" onClick={() => setInviteModal(true)}>
              <Plus size={16} />
              Novo convite
            </button>
          </div>
          <div className="professional-table">
            <div className="table-head">
              <span>Profissional</span>
              <span>Plano</span>
              <span>Status</span>
              <span>Último acesso</span>
              <span></span>
            </div>
            {professionals.map((person) => (
              <div className="table-row" key={person.email}>
                <span className="person-cell">
                  <i>{initials(person.name)}</i>
                  <span>
                    <strong>{person.name}</strong>
                    <small>{person.email}</small>
                  </span>
                </span>
                <span>{person.plan}</span>
                <span>
                  <b className={`admin-status ${person.status.toLowerCase()}`}>
                    {person.status}
                  </b>
                </span>
                <span>{person.lastAccess}</span>
                <button
                  onClick={() =>
                    notify(`Opções administrativas de ${person.name}`)
                  }
                >
                  •••
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "auditoria" && (
        <section className="admin-panel audit-panel">
          <div className="panel-heading">
            <div>
              <span>SEGURANÇA</span>
              <h2>Atividades administrativas</h2>
            </div>
            <ShieldCheck />
          </div>
          {[
            [
              "Login com autenticação em duas etapas",
              "Paulo Eugenio",
              "Hoje, agora",
            ],
            [
              "Configurações profissionais atualizadas",
              "Kamilla Campos Eugenio",
              "Ontem, 18:14",
            ],
            ["Primeiro ambiente Sereno criado", "Sistema", "13 ago, 21:32"],
          ].map(([action, author, date]) => (
            <div className="audit-row" key={action}>
              <span>
                <CheckCircle2 />
              </span>
              <div>
                <strong>{action}</strong>
                <small>{author}</small>
              </div>
              <time>{date}</time>
            </div>
          ))}
        </section>
      )}

      {inviteModal && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setInviteModal(false)}
        >
          <form
            className="modal small-modal"
            onSubmit={addProfessional}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">NOVO ACESSO</span>
                <h2>Convidar profissional</h2>
                <p>Crie uma conta de demonstração para um novo profissional.</p>
              </div>
              <button type="button" onClick={() => setInviteModal(false)}>
                <X />
              </button>
            </div>
            <label>
              Nome completo
              <input
                value={invite.name}
                onChange={(e) => setInvite({ ...invite, name: e.target.value })}
                required
                autoFocus
              />
            </label>
            <label>
              E-mail profissional
              <input
                type="email"
                value={invite.email}
                onChange={(e) =>
                  setInvite({ ...invite, email: e.target.value })
                }
                required
              />
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setInviteModal(false)}
              >
                Cancelar
              </button>
              <button className="primary">Criar convite</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Overview({
  appointments,
  profiles,
  setModal,
  select,
  go,
}: {
  appointments: Appointment[];
  profiles: PatientProfile[];
  setModal: (v: boolean) => void;
  select: (a: Appointment) => void;
  go: (v: View) => void;
}) {
  const nextBase = appointments.find((a) => a.status === "Confirmado");
  const next = nextBase
    ? {
        ...nextBase,
        meetUrl:
          profiles.find((p) => p.name === nextBase.patient)?.meetUrl ||
          nextBase.meetUrl,
      }
    : undefined;
  const awaiting = appointments.filter((a) => a.status === "Aguardando");
  const overdue = appointments.filter(
    (a) =>
      (a.paymentStatus ?? (a.paid ? "Pago" : "Pendente")) === "Pendente" &&
      a.status === "Realizado",
  );
  const received = appointments
    .filter((a) => a.paid)
    .reduce((s, a) => s + (a.amount ?? 180), 0);
  return (
    <>
      <section className="page-title serene-title">
        <div>
          <span className="eyebrow">QUINTA-FEIRA, 13 DE AGOSTO</span>
          <h1>Bom dia, Kamilla.</h1>
          <p>
            Sua rotina está quase em ordem. Há{" "}
            {awaiting.length + overdue.length} pontos para resolver.
          </p>
        </div>
        <button className="primary" onClick={() => setModal(true)}>
          <Plus size={19} />
          Novo atendimento
        </button>
      </section>
      <section className="focus-layout">
        <div className="attention-card">
          <div className="section-label">
            <span>
              <Sparkles size={16} />
              Para cuidar agora
            </span>
            <small>{awaiting.length + overdue.length} pendências</small>
          </div>
          {awaiting.slice(0, 2).map((a) => (
            <button
              className="decision-row"
              key={a.id}
              onClick={() => select(a)}
            >
              <span className="decision-icon amber">
                <CalendarClock />
              </span>
              <span>
                <strong>Confirmar atendimento de {a.patient}</strong>
                <small>
                  {weekdays[a.day - 1]}, {dates[a.day - 1]} de agosto às{" "}
                  {a.time}
                </small>
              </span>
              <ArrowRight />
            </button>
          ))}
          {overdue.slice(0, 1).map((a) => (
            <button
              className="decision-row"
              key={`pay-${a.id}`}
              onClick={() => go("financeiro")}
            >
              <span className="decision-icon rose">
                <CircleDollarSign />
              </span>
              <span>
                <strong>Pagamento de {a.patient} está pendente</strong>
                <small>
                  {money(a.amount ?? 180)} · atendimento já realizado
                </small>
              </span>
              <ArrowRight />
            </button>
          ))}
          {awaiting.length === 0 && overdue.length === 0 && (
            <div className="all-clear">
              <CheckCircle2 />
              <strong>Tudo resolvido por aqui.</strong>
              <span>Você pode focar nos atendimentos.</span>
            </div>
          )}
          <button className="quiet-link" onClick={() => go("agenda")}>
            Ver agenda completa <ArrowRight size={15} />
          </button>
        </div>
        <div className="day-card">
          <div className="section-label">
            <span>
              <Clock3 size={16} />
              Seu dia
            </span>
            <small>{appointments.length} na semana</small>
          </div>
          {next ? (
            <>
              <div className="next-time">
                <span>Próximo atendimento</span>
                <strong>{next.time}</strong>
                <small>
                  até{" "}
                  {String(Number(next.time.slice(0, 2)) + 1).padStart(2, "0")}:
                  {next.time.endsWith(":00") ? "50" : "40"}
                </small>
                <Countdown appointment={next} />
              </div>
              <div className="next-person">
                <div className="avatar soft">{initials(next.patient)}</div>
                <span>
                  <strong>{next.patient}</strong>
                  <small>
                    <Video size={13} />
                    {next.mode} ·{" "}
                    {next.meetUrl ? "Sala pronta" : "Sala ainda não criada"}
                  </small>
                </span>
              </div>
              <div className="next-actions">
                {next.meetUrl ? (
                  <a
                    className="primary"
                    href={next.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Video size={17} />
                    Entrar na sala
                  </a>
                ) : (
                  <button className="primary" onClick={() => select(next)}>
                    <Plus size={17} />
                    Preparar sala
                  </button>
                )}
                <button className="secondary" onClick={() => select(next)}>
                  Detalhes
                </button>
              </div>
            </>
          ) : (
            <div className="all-clear">
              <CheckCircle2 />
              <strong>Dia livre</strong>
              <span>Nenhum atendimento confirmado.</span>
            </div>
          )}
        </div>
      </section>
      <section className="calm-summary">
        <div>
          <span className="summary-icon">
            <CheckCircle2 />
          </span>
          <p>
            <strong>
              {appointments.filter((a) => a.status === "Confirmado").length}{" "}
              confirmados
            </strong>
            <small>sem ação necessária</small>
          </p>
        </div>
        <div>
          <span className="summary-icon">
            <TrendingUp />
          </span>
          <p>
            <strong>{money(received)} recebidos</strong>
            <small>neste demonstrativo</small>
          </p>
        </div>
        <div>
          <span className="summary-icon">
            <AlertCircle />
          </span>
          <p>
            <strong>
              {appointments.filter((a) => !a.paid).length} a acompanhar
            </strong>
            <small>não significa atraso</small>
          </p>
        </div>
      </section>
    </>
  );
}

function Patients({
  names,
  profiles,
  saveProfile,
  deletePatient,
  newPatient,
  openPatientName,
}: {
  names: string[];
  profiles: PatientProfile[];
  saveProfile: (p: PatientProfile) => void;
  deletePatient: (name: string) => boolean;
  newPatient: () => void;
  notify: (s: string) => void;
  openPatientName: string | null;
}) {
  const [editing, setEditing] = useState<PatientProfile | null>(() =>
    openPatientName
      ? (profiles.find((p) => p.name === openPatientName) ?? null)
      : null,
  );
  function open(name: string) {
    setEditing(
      profiles.find((p) => p.name === name) ?? {
        name,
        email: "",
        phone: "",
        value: 180,
        agreement: "Por sessão",
        dueDay: 10,
        status: "Ativo",
        notes: "",
      },
    );
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      saveProfile(editing);
      setEditing(null);
    }
  }
  return (
    <>
      <section className="page-title">
        <div>
          <span className="eyebrow">RELAÇÕES ADMINISTRATIVAS</span>
          <h1>Pacientes</h1>
          <p>Contatos e acordos claros, sem misturar informações clínicas.</p>
        </div>
        <button className="primary" onClick={newPatient}>
          <Plus size={19} />
          Novo paciente
        </button>
      </section>
      <section className="list-card patient-list">
        <div className="patient-head">
          <span>Paciente</span>
          <span>Acordo financeiro</span>
          <span>Valor</span>
          <span>Situação</span>
          <span></span>
        </div>
        {names.map((name, i) => {
          const p = profiles.find((x) => x.name === name);
          return (
            <button
              className="patient-row"
              key={name}
              onClick={() => open(name)}
            >
              <div className="patient">
                <div className="avatar soft">{initials(name)}</div>
                <div>
                  <strong>{name}</strong>
                  <span>{p?.email || `paciente${i + 1}@exemplo.com`}</span>
                </div>
              </div>
              <span>{p?.agreement || "Por sessão"}</span>
              <strong>{money(p?.value ?? 180)}</strong>
              <span className="status-dot">
                <i></i>
                {p?.status || "Ativo"}
              </span>
              <ArrowRight size={17} />
            </button>
          );
        })}
      </section>
      {editing && (
        <div className="modal-backdrop" onMouseDown={() => setEditing(null)}>
          <form
            className="modal"
            onSubmit={submit}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">CADASTRO ADMINISTRATIVO</span>
                <h2>{editing.name}</h2>
                <p>Dados de contato e acordo financeiro.</p>
              </div>
              <button type="button" onClick={() => setEditing(null)}>
                <X />
              </button>
            </div>
            <div className="form-row">
              <label>
                Tipo de paciente
                <select
                  value={editing.patientType || "Adulto"}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      patientType: e.target
                        .value as PatientProfile["patientType"],
                    })
                  }
                >
                  <option>Adulto</option>
                  <option>Criança ou adolescente</option>
                </select>
              </label>
              <label>
                Data de nascimento
                <input
                  type="date"
                  value={editing.birthDate || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, birthDate: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                CPF
                <input
                  inputMode="numeric"
                  value={editing.cpf || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, cpf: formatCpf(e.target.value) })
                  }
                  placeholder="000.000.000-00"
                />
              </label>
              <label>
                Endereço completo
                <input
                  value={editing.address || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, address: e.target.value })
                  }
                  placeholder="Rua, número, complemento, cidade e estado"
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                E-mail
                <input
                  value={editing.email}
                  onChange={(e) =>
                    setEditing({ ...editing, email: e.target.value })
                  }
                />
              </label>
              <label>
                Telefone
                <input
                  value={editing.phone}
                  onChange={(e) =>
                    setEditing({ ...editing, phone: e.target.value })
                  }
                />
              </label>
            </div>
            {editing.patientType === "Criança ou adolescente" && (
              <div className="minor-box">
                <div className="minor-heading">
                  <div>
                    <span className="eyebrow">RESPONSÁVEIS E AUTORIZAÇÕES</span>
                    <strong>Organização do atendimento infantojuvenil</strong>
                  </div>
                  <span className="minor-badge">Menor de idade</span>
                </div>
                <div className="form-row">
                  <label>
                    Responsável legal
                    <input
                      value={editing.guardianName || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, guardianName: e.target.value })
                      }
                      placeholder="Nome completo"
                    />
                  </label>
                  <label>
                    Vínculo
                    <input
                      value={editing.guardianRelation || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          guardianRelation: e.target.value,
                        })
                      }
                      placeholder="Mãe, pai, tutor..."
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Telefone do responsável
                    <input
                      value={editing.guardianPhone || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          guardianPhone: e.target.value,
                        })
                      }
                      placeholder="(00) 00000-0000"
                    />
                  </label>
                  <label>
                    E-mail do responsável
                    <input
                      type="email"
                      value={editing.guardianEmail || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          guardianEmail: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Responsável financeiro
                    <input
                      value={
                        editing.financialGuardianName ||
                        editing.guardianName ||
                        ""
                      }
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          financialGuardianName: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Telefone financeiro
                    <input
                      value={
                        editing.financialGuardianPhone ||
                        editing.guardianPhone ||
                        ""
                      }
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          financialGuardianPhone: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Enviar lembretes para
                    <select
                      value={editing.reminderRecipient || "Responsável"}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          reminderRecipient: e.target.value as
                            "Paciente" | "Responsável",
                        })
                      }
                    >
                      <option>Responsável</option>
                      <option>Paciente</option>
                    </select>
                  </label>
                  <label>
                    Enviar link do Meet para
                    <select
                      value={editing.meetRecipient || "Responsável"}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          meetRecipient: e.target.value as
                            "Paciente" | "Responsável",
                        })
                      }
                    >
                      <option>Responsável</option>
                      <option>Paciente</option>
                    </select>
                  </label>
                </div>
                <label>
                  Contato de emergência
                  <input
                    value={editing.emergencyContact || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        emergencyContact: e.target.value,
                      })
                    }
                    placeholder="Nome e telefone"
                  />
                </label>
                <div className="authorization-list">
                  <label>
                    <input
                      type="checkbox"
                      checked={editing.serviceAuthorized || false}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          serviceAuthorized: e.target.checked,
                        })
                      }
                    />
                    <span>Autorização para atendimento registrada</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={editing.onlineAuthorized || false}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          onlineAuthorized: e.target.checked,
                        })
                      }
                    />
                    <span>Autorização para atendimento online registrada</span>
                  </label>
                </div>
              </div>
            )}
            <div className="agreement-box">
              <span className="eyebrow">ACORDO FINANCEIRO</span>
              <div className="form-row">
                <label>
                  Forma do acordo
                  <select
                    value={editing.agreement}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        agreement: e.target.value as Agreement,
                      })
                    }
                  >
                    <option>Por sessão</option>
                    <option>Semanal</option>
                    <option>Quinzenal</option>
                    <option>Mensal</option>
                    <option>Pacote</option>
                  </select>
                </label>
                <label>
                  Valor por sessão
                  <input
                    type="number"
                    min="0"
                    value={editing.value}
                    onChange={(e) =>
                      setEditing({ ...editing, value: Number(e.target.value) })
                    }
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Dia de vencimento
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={editing.dueDay}
                    onChange={(e) =>
                      setEditing({ ...editing, dueDay: Number(e.target.value) })
                    }
                  />
                </label>
                <label>
                  Situação
                  <select
                    value={editing.status}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        status: e.target.value as PatientProfile["status"],
                      })
                    }
                  >
                    <option>Ativo</option>
                    <option>Pausado</option>
                    <option>Encerrado</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="patient-room-field">
              <span className="eyebrow">SALA FIXA DO GOOGLE MEET</span>
              <label>
                Link da sala
                <input
                  value={editing.meetUrl || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, meetUrl: e.target.value })
                  }
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                />
              </label>
              {editing.meetUrl && (
                <a
                  className="secondary"
                  href={editing.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Video size={16} />
                  Abrir sala
                </a>
              )}
              <small>
                Este link será usado em todos os atendimentos online deste
                paciente.
              </small>
            </div>
            <label>
              Observação administrativa
              <textarea
                value={editing.notes}
                onChange={(e) =>
                  setEditing({ ...editing, notes: e.target.value })
                }
                placeholder="Ex.: pagamento no último dia útil do mês"
              />
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="danger"
                onClick={() => {
                  if (deletePatient(editing.name)) setEditing(null);
                }}
              >
                Excluir paciente
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  saveProfile({
                    ...editing,
                    status: editing.status === "Pausado" ? "Ativo" : "Pausado",
                  });
                  setEditing(null);
                }}
              >
                {editing.status === "Pausado" ? "Reativar" : "Arquivar"}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setEditing(null)}
              >
                Cancelar
              </button>
              <button className="primary">
                <Check size={18} />
                Salvar alterações
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function Finance({
  appointments,
  profiles,
  saveProfile,
  update,
}: {
  appointments: Appointment[];
  profiles: PatientProfile[];
  saveProfile: (profile: PatientProfile) => void;
  update: (id: number, changes: Partial<Appointment>, message: string) => void;
}) {
  const [filter, setFilter] = useState<"Todos" | PaymentStatus>("Todos");
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [patientEditing, setPatientEditing] = useState<PatientProfile | null>(
    null,
  );
  const [payment, setPayment] = useState({
    amount: 180,
    status: "Pago" as PaymentStatus,
    method: "Pix",
    date: new Date().toISOString().slice(0, 10),
  });
  const rows = appointments.map((a) => ({
    ...a,
    amount:
      a.amount ?? profiles.find((p) => p.name === a.patient)?.value ?? 180,
    paymentStatus:
      a.paymentStatus ?? ((a.paid ? "Pago" : "Pendente") as PaymentStatus),
  }));
  const visible =
    filter === "Todos" ? rows : rows.filter((a) => a.paymentStatus === filter);
  const received = rows
    .filter((a) => a.paymentStatus === "Pago")
    .reduce((sum, a) => sum + a.amount, 0);
  const partial = rows
    .filter((a) => a.paymentStatus === "Parcial")
    .reduce((sum, a) => sum + a.amount / 2, 0);
  const pending = rows
    .filter((a) => a.paymentStatus === "Pendente")
    .reduce((sum, a) => sum + a.amount, 0);
  const expected = rows
    .filter((a) => !["Isento", "Cancelado"].includes(a.paymentStatus))
    .reduce((sum, a) => sum + a.amount, 0);
  function openPayment(a: Appointment) {
    setEditing(a);
    setPayment({
      amount: a.amount ?? 180,
      status: a.paymentStatus ?? (a.paid ? "Pago" : "Pendente"),
      method: a.paymentMethod || "Pix",
      date: a.paymentDate || new Date().toISOString().slice(0, 10),
    });
  }
  function openPatient(name: string) {
    setPatientEditing(
      profiles.find((profile) => profile.name === name) ?? {
        name,
        email: "",
        phone: "",
        value: 180,
        agreement: "Por sessão",
        dueDay: 10,
        status: "Ativo",
        notes: "",
      },
    );
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    update(
      editing.id,
      {
        amount: Number(payment.amount),
        paymentStatus: payment.status,
        paid: payment.status === "Pago",
        paymentMethod:
          payment.status === "Pago" || payment.status === "Parcial"
            ? payment.method
            : undefined,
        paymentDate:
          payment.status === "Pago" || payment.status === "Parcial"
            ? payment.date
            : undefined,
      },
      "Informações financeiras atualizadas",
    );
    setEditing(null);
  }
  return (
    <>
      <section className="page-title">
        <div>
          <span className="eyebrow">AGOSTO DE 2026</span>
          <h1>Financeiro</h1>
          <p>Acompanhe recebimentos sem complicação.</p>
        </div>
        <button className="secondary" onClick={() => window.print()}>
          Imprimir resumo
        </button>
      </section>
      <section className="stats financial-stats">
        <div>
          <span className="stat-icon green">
            <WalletCards />
          </span>
          <p>
            <b>{money(expected)}</b>
            <span>previsto no mês</span>
          </p>
        </div>
        <div>
          <span className="stat-icon mint">
            <Check />
          </span>
          <p>
            <b>{money(received + partial)}</b>
            <span>recebido</span>
          </p>
        </div>
        <div>
          <span className="stat-icon sand">
            <Clock3 />
          </span>
          <p>
            <b>{money(pending)}</b>
            <span>pendente</span>
          </p>
        </div>
        <div>
          <span className="stat-icon rose">
            <CircleDollarSign />
          </span>
          <p>
            <b>{rows.filter((a) => a.paymentStatus === "Pendente").length}</b>
            <span>cobranças pendentes</span>
          </p>
        </div>
      </section>
      <section className="finance-toolbar">
        <div>
          {(
            [
              "Todos",
              "Pendente",
              "Pago",
              "Parcial",
              "Isento",
              "Cancelado",
            ] as const
          ).map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <span>{visible.length} registros</span>
      </section>
      <section className="list-card finance-list">
        <div className="finance-head">
          <span>Paciente</span>
          <span>Atendimento</span>
          <span>Valor</span>
          <span>Situação</span>
          <span>Forma</span>
          <span></span>
        </div>
        {visible.map((a) => (
          <div className="finance-row" key={a.id}>
            <button
              className="patient finance-patient"
              onClick={() => openPatient(a.patient)}
            >
              <div className="avatar soft">{initials(a.patient)}</div>
              <strong>{a.patient}</strong>
            </button>
            <span>
              {dates[a.day - 1]} ago. · {a.time}
            </span>
            <strong>{money(a.amount)}</strong>
            <span className={`payment-badge ${a.paymentStatus.toLowerCase()}`}>
              {a.paymentStatus}
            </span>
            <span>{a.paymentMethod || "—"}</span>
            <button className="secondary small" onClick={() => openPayment(a)}>
              Editar
            </button>
          </div>
        ))}
      </section>
      {patientEditing && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setPatientEditing(null)}
        >
          <form
            className="modal"
            onSubmit={(e) => {
              e.preventDefault();
              saveProfile(patientEditing);
              setPatientEditing(null);
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">CADASTRO ADMINISTRATIVO</span>
                <h2>{patientEditing.name}</h2>
                <p>Contato, acordo financeiro e sala fixa.</p>
              </div>
              <button type="button" onClick={() => setPatientEditing(null)}>
                <X />
              </button>
            </div>
            <div className="form-row">
              <label>
                E-mail
                <input
                  value={patientEditing.email}
                  onChange={(e) =>
                    setPatientEditing({
                      ...patientEditing,
                      email: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Telefone
                <input
                  value={patientEditing.phone}
                  onChange={(e) =>
                    setPatientEditing({
                      ...patientEditing,
                      phone: e.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div className="agreement-box">
              <span className="eyebrow">ACORDO FINANCEIRO</span>
              <div className="form-row">
                <label>
                  Forma do acordo
                  <select
                    value={patientEditing.agreement}
                    onChange={(e) =>
                      setPatientEditing({
                        ...patientEditing,
                        agreement: e.target.value as Agreement,
                      })
                    }
                  >
                    <option>Por sessão</option>
                    <option>Semanal</option>
                    <option>Quinzenal</option>
                    <option>Mensal</option>
                    <option>Pacote</option>
                  </select>
                </label>
                <label>
                  Valor por sessão
                  <input
                    type="number"
                    min="0"
                    value={patientEditing.value}
                    onChange={(e) =>
                      setPatientEditing({
                        ...patientEditing,
                        value: Number(e.target.value),
                      })
                    }
                  />
                </label>
              </div>
            </div>
            <div className="patient-room-field">
              <span className="eyebrow">SALA FIXA DO GOOGLE MEET</span>
              <label>
                Link da sala
                <input
                  value={patientEditing.meetUrl || ""}
                  onChange={(e) =>
                    setPatientEditing({
                      ...patientEditing,
                      meetUrl: e.target.value,
                    })
                  }
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                />
              </label>
            </div>
            <label>
              Observação administrativa
              <textarea
                value={patientEditing.notes}
                onChange={(e) =>
                  setPatientEditing({
                    ...patientEditing,
                    notes: e.target.value,
                  })
                }
              />
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setPatientEditing(null)}
              >
                Cancelar
              </button>
              <button className="primary">
                <Check size={18} />
                Salvar alterações
              </button>
            </div>
          </form>
        </div>
      )}
      {editing && (
        <div className="modal-backdrop" onMouseDown={() => setEditing(null)}>
          <form
            className="modal"
            onSubmit={submit}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">REGISTRO FINANCEIRO</span>
                <h2>{editing.patient}</h2>
                <p>
                  Atendimento em {dates[editing.day - 1]} de agosto, às{" "}
                  {editing.time}.
                </p>
              </div>
              <button type="button" onClick={() => setEditing(null)}>
                <X />
              </button>
            </div>
            <div className="form-row">
              <label>
                Valor
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={payment.amount}
                  onChange={(e) =>
                    setPayment({ ...payment, amount: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Situação
                <select
                  value={payment.status}
                  onChange={(e) =>
                    setPayment({
                      ...payment,
                      status: e.target.value as PaymentStatus,
                    })
                  }
                >
                  <option>Pendente</option>
                  <option>Pago</option>
                  <option>Parcial</option>
                  <option>Isento</option>
                  <option>Cancelado</option>
                </select>
              </label>
            </div>
            <div className="form-row">
              <label>
                Forma de pagamento
                <select
                  value={payment.method}
                  onChange={(e) =>
                    setPayment({ ...payment, method: e.target.value })
                  }
                >
                  <option>Pix</option>
                  <option>Dinheiro</option>
                  <option>Cartão</option>
                  <option>Transferência</option>
                </select>
              </label>
              <label>
                Data do pagamento
                <input
                  type="date"
                  value={payment.date}
                  onChange={(e) =>
                    setPayment({ ...payment, date: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="duration-note">
              <CircleDollarSign size={18} />
              <span>
                Controle administrativo local. Nenhuma cobrança será enviada.
              </span>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setEditing(null)}
              >
                Cancelar
              </button>
              <button className="primary">
                <Check size={18} />
                Salvar registro
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function SettingsPage({
  settings,
  save,
}: {
  settings: AppSettings;
  save: (s: AppSettings) => void;
}) {
  const [draft, setDraft] = useState({ ...defaultSettings, ...settings });
  const [tab, setTab] = useState<
    "Perfil" | "Aparência" | "Agenda" | "Atendimento online"
  >("Perfil");
  const toggle = (field: "workDays", value: string) =>
    setDraft({
      ...draft,
      [field]: draft[field].includes(value)
        ? draft[field].filter((x) => x !== value)
        : [...draft[field], value],
    });
  return (
    <>
      <section className="page-title">
        <div>
          <span className="eyebrow">SEU JEITO DE TRABALHAR</span>
          <h1>Configurações</h1>
          <p>
            Defina os padrões do consultório uma vez. O Sereno cuida do
            restante.
          </p>
        </div>
        <button className="primary" onClick={() => save(draft)}>
          <Check size={18} />
          Salvar configurações
        </button>
      </section>
      <div className="settings-layout">
        <nav className="settings-nav">
          {(
            ["Perfil", "Aparência", "Agenda", "Atendimento online"] as const
          ).map((item) => (
            <button
              key={item}
              className={tab === item ? "active" : ""}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
          <span>PRÓXIMAS ETAPAS</span>
          <button disabled>
            Notificações <small>Em breve</small>
          </button>
          <button disabled>
            Privacidade e segurança <small>Em breve</small>
          </button>
          <button disabled>
            Integrações <small>Em breve</small>
          </button>
        </nav>
        <section className="settings-card">
          {tab === "Perfil" && (
            <>
              <div className="settings-head">
                <UserRoundIcon />
                <div>
                  <h2>Perfil profissional</h2>
                  <p>Informações exibidas na sua conta e nas comunicações.</p>
                </div>
              </div>
              <div className="form-row">
                <label>
                  Nome profissional
                  <input
                    value={draft.professionalName}
                    onChange={(e) =>
                      setDraft({ ...draft, professionalName: e.target.value })
                    }
                  />
                </label>
                <label>
                  CRP
                  <input
                    value={draft.crp}
                    onChange={(e) =>
                      setDraft({ ...draft, crp: e.target.value })
                    }
                    placeholder="CRP 00/000000"
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  E-mail profissional
                  <input
                    type="email"
                    value={draft.professionalEmail}
                    onChange={(e) =>
                      setDraft({ ...draft, professionalEmail: e.target.value })
                    }
                  />
                </label>
                <label>
                  Telefone profissional
                  <input
                    value={draft.professionalPhone}
                    onChange={(e) =>
                      setDraft({ ...draft, professionalPhone: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="setting-note">
                Fuso horário: América/São_Paulo
              </div>
            </>
          )}
          {tab === "Aparência" && (
            <>
              <div className="settings-head">
                <Sparkles />
                <div>
                  <h2>Aparência</h2>
                  <p>
                    Escolha as cores que combinam com o seu perfil profissional.
                  </p>
                </div>
              </div>
              <div className="theme-grid">
                {(
                  [
                    ["sereno", "Sereno", "Sálvia e areia"],
                    ["oceano", "Oceano", "Azul e névoa"],
                    ["lavanda", "Lavanda", "Violeta suave"],
                    ["terracota", "Terracota", "Argila e creme"],
                  ] as const
                ).map(([value, name, description]) => (
                  <button
                    type="button"
                    key={value}
                    className={`theme-option ${draft.theme === value ? "selected" : ""}`}
                    onClick={() => {
                      setDraft({ ...draft, theme: value });
                      document.documentElement.dataset.theme = value;
                    }}
                  >
                    <span className={`theme-preview ${value}`}>
                      <i></i>
                      <i></i>
                      <i></i>
                    </span>
                    <span>
                      <strong>{name}</strong>
                      <small>{description}</small>
                    </span>
                    {draft.theme === value && <CheckCircle2 size={18} />}
                  </button>
                ))}
              </div>
              <div className="setting-note">
                O tema altera somente a aparência. Informações e funcionalidades
                permanecem iguais.
              </div>
            </>
          )}
          {tab === "Agenda" && (
            <>
              <div className="settings-head">
                <CalendarDays />
                <div>
                  <h2>Agenda e disponibilidade</h2>
                  <p>Horários usados como padrão ao organizar a semana.</p>
                </div>
              </div>
              <label>
                Dias de atendimento
                <div className="choice-row">
                  {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                    <button
                      type="button"
                      key={day}
                      className={draft.workDays.includes(day) ? "selected" : ""}
                      onClick={() => toggle("workDays", day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </label>
              <div className="form-row">
                <label>
                  Início
                  <input
                    type="time"
                    value={draft.workStart}
                    onChange={(e) =>
                      setDraft({ ...draft, workStart: e.target.value })
                    }
                  />
                </label>
                <label>
                  Término
                  <input
                    type="time"
                    value={draft.workEnd}
                    onChange={(e) =>
                      setDraft({ ...draft, workEnd: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Duração da sessão
                  <input
                    type="number"
                    value={draft.sessionDuration}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        sessionDuration: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Intervalo entre sessões
                  <input
                    type="number"
                    value={draft.breakMinutes}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        breakMinutes: Number(e.target.value),
                      })
                    }
                  />
                </label>
              </div>
            </>
          )}
          {tab === "Atendimento online" && (
            <>
              <div className="settings-head">
                <Video />
                <div>
                  <h2>Atendimento online</h2>
                  <p>Como as salas virtuais são preparadas e compartilhadas.</p>
                </div>
              </div>
              <label>
                Provedor padrão
                <select
                  value={draft.videoProvider}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      videoProvider: e.target
                        .value as AppSettings["videoProvider"],
                    })
                  }
                >
                  <option>Google Meet</option>
                  <option>Microsoft Teams</option>
                </select>
              </label>
              <div className="setting-note success">
                <CheckCircle2 />
                Sala fixa por paciente está alinhada ao fluxo atual da Kamilla.
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}

function UserRoundIcon() {
  return (
    <div className="settings-icon">
      <UsersRound />
    </div>
  );
}
