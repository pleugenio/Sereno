import { useEffect, useMemo, useState } from "react";
import professionalLightness from "./assets/sereno-professional-lightness.webp";
import humanConnection from "./assets/sereno-human-connection.webp";
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
  CreditCard,
  Headphones,
  Megaphone,
  RotateCcw,
  SlidersHorizontal,
  UserX,
} from "lucide-react";

type View =
  | "inicio"
  | "agenda"
  | "pacientes"
  | "financeiro"
  | "configuracoes"
  | "administracao";
type AccessScreen = "landing" | "signup" | "login" | "two-factor" | "app";
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

function PublicLanding({
  onLogin,
  onTrial,
}: {
  onLogin: () => void;
  onTrial: () => void;
}) {
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
          <a href="#como-funciona">Como funciona</a>
          <a href="#seguranca">Segurança</a>
          <a href="#planos">Planos</a>
        </div>
        <button className="nav-login" onClick={onLogin}>
          Entrar
        </button>
      </nav>

      <main className="public-main" id="inicio">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="hero-badge">
              <Sparkles size={14} /> 15 dias grátis · sem cartão
            </span>
            <h1>
              Seu consultório organizado.
              <br />
              <em>Sua mente mais tranquila.</em>
            </h1>
            <p>
              Agenda, pacientes e financeiro em um sistema simples para você
              economizar tempo e se concentrar em quem realmente importa.
            </p>
            <div className="hero-actions">
              <button className="landing-primary" onClick={onTrial}>
                Começar meus 15 dias grátis <ArrowRight size={18} />
              </button>
              <a href="#recursos">Conhecer recursos</a>
            </div>
            <div className="trust-row">
              <span>
                <CheckCircle2 size={16} /> Sem cartão
              </span>
              <span>
                <ShieldCheck size={16} /> Cancele quando quiser
              </span>
              <span>
                <Clock3 size={16} /> Comece em minutos
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

        <section className="lifestyle-split">
          <div className="lifestyle-image">
            <img
              src={professionalLightness}
              alt="Profissional encerrando o trabalho com tranquilidade"
              loading="lazy"
            />
          </div>
          <div className="lifestyle-copy">
            <span>LEVEZA TAMBÉM É PRODUTIVIDADE</span>
            <h2>
              Organize o consultório.
              <br />E encerre o dia em paz.
            </h2>
            <p>
              Quando agenda, cadastros e pagamentos estão no mesmo fluxo, sobra
              menos preocupação para levar para casa.
            </p>
            <ul>
              <li>
                <CheckCircle2 /> Menos tarefas espalhadas
              </li>
              <li>
                <CheckCircle2 /> Mais clareza sobre o dia
              </li>
              <li>
                <CheckCircle2 /> Uma rotina que cabe na sua vida
              </li>
            </ul>
            <a href="#planos">
              Conhecer o Plano Fundador <ArrowRight size={17} />
            </a>
          </div>
        </section>

        <section className="workflow-section" id="como-funciona">
          <div className="section-heading">
            <span>SIMPLES DESDE O PRIMEIRO ACESSO</span>
            <h2>Da agenda ao pagamento, sem planilhas soltas</h2>
            <p>
              O Sereno conecta as tarefas que mais ocupam o dia para sua rotina
              fluir com menos esforço.
            </p>
          </div>
          <div className="workflow-grid">
            <article>
              <b>01</b>
              <span>
                <CalendarClock />
              </span>
              <h3>Organize sua semana</h3>
              <p>
                Cadastre atendimentos, veja horários livres e bloqueie
                compromissos em poucos cliques.
              </p>
            </article>
            <i>
              <ArrowRight />
            </i>
            <article>
              <b>02</b>
              <span>
                <UsersRound />
              </span>
              <h3>Tenha tudo à mão</h3>
              <p>
                Encontre os dados administrativos e o link de atendimento de
                cada paciente.
              </p>
            </article>
            <i>
              <ArrowRight />
            </i>
            <article>
              <b>03</b>
              <span>
                <CircleDollarSign />
              </span>
              <h3>Acompanhe o financeiro</h3>
              <p>Saiba o que foi pago e o que ainda precisa da sua atenção.</p>
            </article>
          </div>
          <div className="value-strip">
            <div>
              <strong>50 min</strong>
              <span>Sessões configuradas no seu ritmo</span>
            </div>
            <div>
              <strong>3 visões</strong>
              <span>Agenda por dia, semana e mês</span>
            </div>
            <div>
              <strong>1 lugar</strong>
              <span>Rotina centralizada e mais clara</span>
            </div>
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
              <Check /> Administração sem conteúdo clínico
            </li>
          </ul>
        </section>

        <section className="connection-story">
          <img
            src={humanConnection}
            alt="Duas pessoas compartilhando um momento alegre"
            loading="lazy"
          />
          <div>
            <span>TECNOLOGIA NOS BASTIDORES</span>
            <h2>Mais espaço para estar presente.</h2>
            <p>
              O Sereno cuida da organização administrativa para que a tecnologia
              ocupe menos espaço — e as relações humanas, mais.
            </p>
            <a href="#planos">
              Começar gratuitamente <ArrowRight size={17} />
            </a>
          </div>
        </section>

        <section className="pricing-section" id="planos">
          <div className="pricing-copy">
            <span>OFERTA DE LANÇAMENTO</span>
            <h2>
              Comece sem risco.
              <br />
              Continue porque faz sentido.
            </h2>
            <p>
              Teste o Sereno por 15 dias com os recursos disponíveis. Sem
              cartão, sem fidelidade e sem cobrança surpresa.
            </p>
            <ul>
              <li>
                <Check /> Configure no seu tempo
              </li>
              <li>
                <Check /> Cancele quando quiser
              </li>
              <li>
                <Check /> Preço fundador garantido por 12 meses
              </li>
            </ul>
          </div>
          <div className="pricing-card">
            <span className="founder-label">
              <Sparkles size={14} /> PLANO FUNDADOR
            </span>
            <p>Para psicólogos que querem organizar a prática desde agora.</p>
            <div className="price">
              <small>R$</small>
              <strong>19,90</strong>
              <span>/mês</span>
            </div>
            <small className="price-note">após 15 dias de teste gratuito</small>
            <ul>
              <li>
                <CheckCircle2 /> Agenda por dia, semana e mês
              </li>
              <li>
                <CheckCircle2 /> Pacientes e responsáveis
              </li>
              <li>
                <CheckCircle2 /> Controle financeiro
              </li>
              <li>
                <CheckCircle2 /> Links de atendimento online
              </li>
              <li>
                <CheckCircle2 /> Acesso com duas etapas
              </li>
              <li>
                <CheckCircle2 /> Atualizações no período fundador
              </li>
            </ul>
            <button className="landing-primary price-button" onClick={onTrial}>
              Quero ser fundador <ArrowRight size={18} />
            </button>
            <small>Sem cartão para começar · vagas iniciais limitadas</small>
          </div>
        </section>

        <section className="faq-section">
          <div className="section-heading">
            <span>DÚVIDAS FREQUENTES</span>
            <h2>Tudo claro antes de começar</h2>
          </div>
          <div className="faq-list">
            <details open>
              <summary>Preciso informar cartão para testar?</summary>
              <p>
                Não. Você pode experimentar o Sereno por 15 dias sem cadastrar
                cartão.
              </p>
            </details>
            <details>
              <summary>O que acontece depois dos 15 dias?</summary>
              <p>
                Você escolhe se quer continuar no Plano Fundador por R$ 19,90 ao
                mês. Nenhuma cobrança será feita automaticamente sem sua
                autorização.
              </p>
            </details>
            <details>
              <summary>Existe fidelidade?</summary>
              <p>
                Não. A assinatura será mensal e poderá ser cancelada quando
                quiser.
              </p>
            </details>
            <details>
              <summary>O Sereno já possui prontuário?</summary>
              <p>
                A primeira versão é focada em agenda, cadastro administrativo e
                financeiro. O prontuário será desenvolvido em uma etapa
                específica de segurança e conformidade.
              </p>
            </details>
            <details>
              <summary>Posso usar em celular e computador?</summary>
              <p>
                Sim. O Sereno é uma aplicação web responsiva e será acessível
                pelo navegador.
              </p>
            </details>
          </div>
        </section>

        <section className="audience-section" id="sobre">
          <span>COMECE UMA ROTINA MAIS SERENA</span>
          <h2>
            Menos tempo organizando.
            <br />
            Mais tempo cuidando.
          </h2>
          <p>
            Experimente por 15 dias e descubra como uma rotina mais organizada
            também pode ser mais leve.
          </p>
          <button className="landing-primary" onClick={onTrial}>
            Começar gratuitamente <ArrowRight size={18} />
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
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  code,
  setCode,
  error,
  onBack,
  onLogin,
  onSignup,
  onVerify,
}: {
  step: "signup" | "login" | "two-factor";
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
  error: string;
  onBack: () => void;
  onLogin: (event: React.FormEvent) => void;
  onSignup: (event: React.FormEvent) => void;
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
        {step === "signup" ? (
          <form className="access-card" onSubmit={onSignup}>
            <span className="access-icon">
              <Sparkles />
            </span>
            <span className="trial-chip">15 DIAS GRÁTIS · SEM CARTÃO</span>
            <h1>Comece sua rotina mais serena</h1>
            <p>Crie seu acesso de demonstração em menos de um minuto.</p>
            <label>
              Seu nome
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                required
                autoFocus
              />
            </label>
            <label>
              E-mail profissional
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </label>
            <label>
              Crie uma senha
              <input
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                required
              />
            </label>
            <label className="terms-line">
              <input type="checkbox" required />
              <span>Li e aceito os termos desta demonstração.</span>
            </label>
            {error && (
              <div className="access-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            <button className="access-submit">
              Criar meu acesso gratuito <ArrowRight size={18} />
            </button>
            <small className="signup-note">
              Nenhuma cobrança será feita automaticamente.
            </small>
          </form>
        ) : step === "login" ? (
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
  const [signupName, setSignupName] = useState("");
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
  const normalizedSearch = search.trim().toLowerCase();
  const numericSearch = normalizedSearch.replace(/\D/g, "");
  const results = normalizedSearch
    ? patients
        .filter((name) => {
          const profile = profiles.find((item) => item.name === name);
          const textFields = [name, profile?.email, profile?.address]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          const numericFields =
            `${profile?.phone || ""} ${profile?.cpf || ""}`.replace(/\D/g, "");
          return (
            textFields.includes(normalizedSearch) ||
            (numericSearch.length > 0 && numericFields.includes(numericSearch))
          );
        })
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
    const meetUrl = patientMeet(a);
    setSelected({ ...a, meetUrl: meetUrl || undefined });
    setMeetDraft(meetUrl);
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
    if (!phone) {
      notify("Cadastre um telefone para enviar o link pelo WhatsApp");
      return;
    }
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

  function beginTrial(event: React.FormEvent) {
    event.preventDefault();
    if (signupName.trim().length < 3 || loginPassword.length < 6) {
      setAccessError(
        "Confira seu nome e crie uma senha com pelo menos 6 caracteres.",
      );
      return;
    }
    setUserRole("professional");
    setAccessError("");
    setVerificationCode("");
    setAccessScreen("two-factor");
  }

  function logout() {
    setAccessScreen("landing");
    setView("inicio");
    setLoginEmail("");
    setLoginPassword("");
    setSignupName("");
    setVerificationCode("");
    setAccessError("");
  }

  if (accessScreen === "landing") {
    return (
      <PublicLanding
        onLogin={() => setAccessScreen("login")}
        onTrial={() => setAccessScreen("signup")}
      />
    );
  }

  if (
    accessScreen === "signup" ||
    accessScreen === "login" ||
    accessScreen === "two-factor"
  ) {
    return (
      <AccessPage
        step={accessScreen}
        name={signupName}
        setName={setSignupName}
        email={loginEmail}
        setEmail={setLoginEmail}
        password={loginPassword}
        setPassword={setLoginPassword}
        code={verificationCode}
        setCode={setVerificationCode}
        error={accessError}
        onBack={() => {
          setAccessError("");
          setAccessScreen(
            accessScreen === "two-factor"
              ? signupName
                ? "signup"
                : "login"
              : "landing",
          );
        }}
        onLogin={beginLogin}
        onSignup={beginTrial}
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
                  Crie a sala, copie o endereço e salve-o aqui. O link ficará
                  associado a este paciente e poderá ser alterado depois.
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
      trialDays: 0,
      subscription: "Ativa",
      since: "13/08/2026",
    },
    {
      name: "Conta de demonstração",
      email: "demo@sereno.app",
      plan: "Teste",
      status: "Convite",
      lastAccess: "Nunca acessou",
      trialDays: 15,
      subscription: "Sem assinatura",
      since: "14/08/2026",
    },
  ]);
  const [tab, setTab] = useState<
    | "visao"
    | "profissionais"
    | "trials"
    | "assinaturas"
    | "financeiro"
    | "suporte"
    | "avisos"
    | "auditoria"
    | "plataforma"
  >("visao");
  const [inviteModal, setInviteModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null);
  const [invite, setInvite] = useState({ name: "", email: "" });
  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: "Como alterar um horário recorrente?",
      author: "Conta de demonstração",
      priority: "Normal",
      status: "Aberto",
      date: "Hoje, 08:32",
    },
    {
      id: 2,
      subject: "Dúvida sobre o período de teste",
      author: "Mariana Souza",
      priority: "Baixa",
      status: "Aguardando",
      date: "Ontem, 16:10",
    },
  ]);
  const [announcement, setAnnouncement] = useState({
    title: "",
    message: "",
    audience: "Todos os profissionais",
  });
  const [platformSettings, setPlatformSettings] = useState({
    trialDays: 15,
    founderPrice: 19.9,
    founderLimit: 100,
    registrationsOpen: true,
    maintenance: false,
  });

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
        trialDays: 15,
        subscription: "Sem assinatura",
        since: "Hoje",
      },
    ]);
    setInvite({ name: "", email: "" });
    setInviteModal(false);
    notify("Convite de demonstração criado");
  }

  function updateProfessional(
    email: string,
    changes: Partial<(typeof professionals)[number]>,
    message: string,
  ) {
    setProfessionals(
      professionals.map((person) =>
        person.email === email ? { ...person, ...changes } : person,
      ),
    );
    notify(message);
  }

  const currentProfessional = professionals.find(
    (person) => person.email === selectedProfessional,
  );

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
            ["trials", "Trials"],
            ["assinaturas", "Assinaturas"],
            ["financeiro", "Financeiro"],
            ["suporte", "Suporte"],
            ["avisos", "Avisos"],
            ["auditoria", "Auditoria"],
            ["plataforma", "Plataforma"],
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
                <p>
                  {professionals.filter((p) => p.status === "Ativo").length}{" "}
                  conta ativa
                </p>
              </div>
            </article>
            <article>
              <span className="metric-icon blue">
                <Building2 />
              </span>
              <div>
                <small>TRIALS ATIVOS</small>
                <strong>
                  {professionals.filter((p) => p.trialDays > 0).length}
                </strong>
                <p>1 termina esta semana</p>
              </div>
            </article>
            <article>
              <span className="metric-icon amber">
                <TrendingUp />
              </span>
              <div>
                <small>RECEITA MENSAL</small>
                <strong>R$ 19,90</strong>
                <p>MRR demonstrativo</p>
              </div>
            </article>
            <article>
              <span className="metric-icon purple">
                <ShieldCheck />
              </span>
              <div>
                <small>SUPORTE</small>
                <strong>
                  {
                    tickets.filter((ticket) => ticket.status !== "Resolvido")
                      .length
                  }
                </strong>
                <p>chamados pendentes</p>
              </div>
            </article>
          </section>
          <section className="admin-alerts">
            <button onClick={() => setTab("trials")}>
              <Clock3 />
              <span>
                <strong>1 trial termina nesta semana</strong>
                <small>Revise antes do encerramento</small>
              </span>
              <ArrowRight />
            </button>
            <button onClick={() => setTab("assinaturas")}>
              <CreditCard />
              <span>
                <strong>1 assinatura ativa</strong>
                <small>MRR atual de R$ 19,90</small>
              </span>
              <ArrowRight />
            </button>
            <button onClick={() => setTab("suporte")}>
              <Headphones />
              <span>
                <strong>2 chamados aguardam resposta</strong>
                <small>Mais antigo aberto ontem</small>
              </span>
              <ArrowRight />
            </button>
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
                <button onClick={() => setSelectedProfessional(person.email)}>
                  •••
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "trials" && (
        <section className="admin-panel operational-panel">
          <div className="panel-heading">
            <div>
              <span>PERÍODO GRATUITO</span>
              <h2>Trials em andamento</h2>
            </div>
            <Clock3 />
          </div>
          <div className="admin-summary-row">
            <div>
              <strong>1</strong>
              <span>Trial ativo</span>
            </div>
            <div>
              <strong>15 dias</strong>
              <span>Período padrão</span>
            </div>
            <div>
              <strong>0%</strong>
              <span>Conversão inicial</span>
            </div>
          </div>
          <div className="ops-list">
            {professionals
              .filter((p) => p.trialDays > 0)
              .map((person) => (
                <article key={person.email}>
                  <span className="person-cell">
                    <i>{initials(person.name)}</i>
                    <span>
                      <strong>{person.name}</strong>
                      <small>{person.email}</small>
                    </span>
                  </span>
                  <span>
                    <small>DIAS RESTANTES</small>
                    <strong>{person.trialDays} dias</strong>
                  </span>
                  <span>
                    <small>INÍCIO</small>
                    <strong>{person.since}</strong>
                  </span>
                  <div>
                    <button
                      className="secondary"
                      onClick={() =>
                        updateProfessional(
                          person.email,
                          { trialDays: person.trialDays + 7 },
                          "Trial prolongado por mais 7 dias",
                        )
                      }
                    >
                      <RotateCcw size={15} />
                      +7 dias
                    </button>
                    <button
                      onClick={() => setSelectedProfessional(person.email)}
                    >
                      Gerenciar
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      )}

      {tab === "assinaturas" && (
        <section className="admin-panel operational-panel">
          <div className="panel-heading">
            <div>
              <span>COBRANÇAS RECORRENTES</span>
              <h2>Assinaturas</h2>
            </div>
            <CreditCard />
          </div>
          <div className="admin-summary-row">
            <div>
              <strong>1</strong>
              <span>Ativa</span>
            </div>
            <div>
              <strong>R$ 19,90</strong>
              <span>Ticket médio</span>
            </div>
            <div>
              <strong>0</strong>
              <span>Inadimplentes</span>
            </div>
          </div>
          <div className="subscription-list">
            {professionals.map((person) => (
              <div key={person.email}>
                <span className="person-cell">
                  <i>{initials(person.name)}</i>
                  <span>
                    <strong>{person.name}</strong>
                    <small>{person.email}</small>
                  </span>
                </span>
                <span>
                  <small>PLANO</small>
                  <strong>{person.plan}</strong>
                </span>
                <span>
                  <small>ASSINATURA</small>
                  <b
                    className={`admin-status ${person.subscription === "Ativa" ? "ativo" : "convite"}`}
                  >
                    {person.subscription}
                  </b>
                </span>
                <span>
                  <small>VALOR</small>
                  <strong>
                    {person.subscription === "Ativa" ? "R$ 19,90" : "—"}
                  </strong>
                </span>
                <button onClick={() => setSelectedProfessional(person.email)}>
                  Abrir
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "financeiro" && (
        <>
          <section className="admin-metrics finance-admin-metrics">
            <article>
              <span className="metric-icon">
                <TrendingUp />
              </span>
              <div>
                <small>MRR</small>
                <strong>R$ 19,90</strong>
                <p>receita recorrente</p>
              </div>
            </article>
            <article>
              <span className="metric-icon blue">
                <CircleDollarSign />
              </span>
              <div>
                <small>RECEBIDO NO MÊS</small>
                <strong>R$ 19,90</strong>
                <p>1 pagamento</p>
              </div>
            </article>
            <article>
              <span className="metric-icon amber">
                <CalendarClock />
              </span>
              <div>
                <small>PREVISÃO</small>
                <strong>R$ 39,80</strong>
                <p>próximos 30 dias</p>
              </div>
            </article>
            <article>
              <span className="metric-icon purple">
                <AlertCircle />
              </span>
              <div>
                <small>PENDÊNCIAS</small>
                <strong>0</strong>
                <p>nenhuma cobrança</p>
              </div>
            </article>
          </section>
          <section className="admin-panel transactions-panel">
            <div className="panel-heading">
              <div>
                <span>MOVIMENTAÇÕES</span>
                <h2>Financeiro do Sereno</h2>
              </div>
              <button
                className="secondary"
                onClick={() =>
                  notify("Relatório financeiro preparado para exportação")
                }
              >
                Exportar relatório
              </button>
            </div>
            <div className="transaction-row transaction-head">
              <span>Data</span>
              <span>Profissional</span>
              <span>Descrição</span>
              <span>Forma</span>
              <span>Valor</span>
              <span>Status</span>
            </div>
            <div className="transaction-row">
              <span>14/08/2026</span>
              <span>Kamilla Campos Eugenio</span>
              <span>Plano Fundador</span>
              <span>Pix</span>
              <strong>R$ 19,90</strong>
              <b className="admin-status ativo">Pago</b>
            </div>
          </section>
        </>
      )}

      {tab === "suporte" && (
        <section className="admin-panel support-panel">
          <div className="panel-heading">
            <div>
              <span>ATENDIMENTO</span>
              <h2>Solicitações de suporte</h2>
            </div>
            <Headphones />
          </div>
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <article key={ticket.id}>
                <span
                  className={`ticket-priority ${ticket.priority.toLowerCase()}`}
                >
                  {ticket.priority}
                </span>
                <div>
                  <strong>{ticket.subject}</strong>
                  <small>
                    {ticket.author} · {ticket.date}
                  </small>
                </div>
                <b
                  className={`admin-status ${ticket.status === "Aberto" ? "convite" : "ativo"}`}
                >
                  {ticket.status}
                </b>
                <button
                  className="secondary"
                  onClick={() => {
                    setTickets(
                      tickets.map((item) =>
                        item.id === ticket.id
                          ? { ...item, status: "Resolvido" }
                          : item,
                      ),
                    );
                    notify("Chamado marcado como resolvido");
                  }}
                >
                  {ticket.status === "Resolvido" ? "Resolvido" : "Responder"}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "avisos" && (
        <section className="admin-notice-layout">
          <form
            className="admin-panel notice-form"
            onSubmit={(e) => {
              e.preventDefault();
              notify("Aviso publicado no protótipo");
              setAnnouncement({ ...announcement, title: "", message: "" });
            }}
          >
            <div className="panel-heading">
              <div>
                <span>COMUNICAÇÃO</span>
                <h2>Publicar um aviso</h2>
              </div>
              <Megaphone />
            </div>
            <label>
              Título
              <input
                value={announcement.title}
                onChange={(e) =>
                  setAnnouncement({ ...announcement, title: e.target.value })
                }
                placeholder="Ex.: Nova versão disponível"
                required
              />
            </label>
            <label>
              Público
              <select
                value={announcement.audience}
                onChange={(e) =>
                  setAnnouncement({ ...announcement, audience: e.target.value })
                }
              >
                <option>Todos os profissionais</option>
                <option>Usuários em trial</option>
                <option>Assinantes ativos</option>
              </select>
            </label>
            <label>
              Mensagem
              <textarea
                value={announcement.message}
                onChange={(e) =>
                  setAnnouncement({ ...announcement, message: e.target.value })
                }
                placeholder="Escreva uma mensagem breve e clara..."
                required
              />
            </label>
            <button className="primary">
              <Megaphone size={16} />
              Publicar aviso
            </button>
          </form>
          <aside className="admin-panel notice-preview">
            <span>PRÉVIA</span>
            <div>
              <Megaphone />
              <small>{announcement.audience}</small>
              <strong>{announcement.title || "Título do seu aviso"}</strong>
              <p>
                {announcement.message ||
                  "A mensagem aparecerá aqui para você conferir antes de publicar."}
              </p>
            </div>
          </aside>
        </section>
      )}

      {tab === "plataforma" && (
        <form
          className="admin-panel platform-form"
          onSubmit={(e) => {
            e.preventDefault();
            notify("Configurações da plataforma salvas");
          }}
        >
          <div className="panel-heading">
            <div>
              <span>REGRAS COMERCIAIS</span>
              <h2>Configurações da plataforma</h2>
            </div>
            <SlidersHorizontal />
          </div>
          <div className="form-row">
            <label>
              Duração padrão do trial
              <input
                type="number"
                value={platformSettings.trialDays}
                onChange={(e) =>
                  setPlatformSettings({
                    ...platformSettings,
                    trialDays: Number(e.target.value),
                  })
                }
              />
              <small>dias</small>
            </label>
            <label>
              Preço do Plano Fundador
              <input
                type="number"
                step="0.01"
                value={platformSettings.founderPrice}
                onChange={(e) =>
                  setPlatformSettings({
                    ...platformSettings,
                    founderPrice: Number(e.target.value),
                  })
                }
              />
              <small>reais por mês</small>
            </label>
            <label>
              Limite de fundadores
              <input
                type="number"
                value={platformSettings.founderLimit}
                onChange={(e) =>
                  setPlatformSettings({
                    ...platformSettings,
                    founderLimit: Number(e.target.value),
                  })
                }
              />
              <small>contas</small>
            </label>
          </div>
          <div className="platform-switches">
            <label>
              <span>
                <strong>Novos cadastros</strong>
                <small>Permitir criação de novas contas trial</small>
              </span>
              <input
                type="checkbox"
                checked={platformSettings.registrationsOpen}
                onChange={(e) =>
                  setPlatformSettings({
                    ...platformSettings,
                    registrationsOpen: e.target.checked,
                  })
                }
              />
            </label>
            <label>
              <span>
                <strong>Modo de manutenção</strong>
                <small>Exibir uma página de manutenção para usuários</small>
              </span>
              <input
                type="checkbox"
                checked={platformSettings.maintenance}
                onChange={(e) =>
                  setPlatformSettings({
                    ...platformSettings,
                    maintenance: e.target.checked,
                  })
                }
              />
            </label>
          </div>
          <div className="modal-actions">
            <button className="primary">Salvar configurações</button>
          </div>
        </form>
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

      {currentProfessional && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setSelectedProfessional(null)}
        >
          <div
            className="modal account-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">GESTÃO DA CONTA</span>
                <h2>{currentProfessional.name}</h2>
                <p>{currentProfessional.email}</p>
              </div>
              <button onClick={() => setSelectedProfessional(null)}>
                <X />
              </button>
            </div>
            <div className="account-overview">
              <div>
                <small>PLANO</small>
                <strong>{currentProfessional.plan}</strong>
              </div>
              <div>
                <small>STATUS</small>
                <strong>{currentProfessional.status}</strong>
              </div>
              <div>
                <small>TRIAL</small>
                <strong>
                  {currentProfessional.trialDays > 0
                    ? `${currentProfessional.trialDays} dias`
                    : "Encerrado"}
                </strong>
              </div>
              <div>
                <small>ASSINATURA</small>
                <strong>{currentProfessional.subscription}</strong>
              </div>
            </div>
            <div className="account-actions">
              <button
                onClick={() =>
                  updateProfessional(
                    currentProfessional.email,
                    { trialDays: currentProfessional.trialDays + 7 },
                    "Trial prolongado por 7 dias",
                  )
                }
              >
                <RotateCcw />
                Prolongar trial por 7 dias
              </button>
              <button
                onClick={() =>
                  updateProfessional(
                    currentProfessional.email,
                    {
                      plan: "Fundador",
                      subscription: "Ativa",
                      status: "Ativo",
                      trialDays: 0,
                    },
                    "Plano Fundador ativado",
                  )
                }
              >
                <CreditCard />
                Ativar Plano Fundador
              </button>
              <button
                className="danger-soft"
                onClick={() =>
                  updateProfessional(
                    currentProfessional.email,
                    {
                      status:
                        currentProfessional.status === "Suspenso"
                          ? "Ativo"
                          : "Suspenso",
                    },
                    currentProfessional.status === "Suspenso"
                      ? "Conta reativada"
                      : "Conta suspensa",
                  )
                }
              >
                <UserX />
                {currentProfessional.status === "Suspenso"
                  ? "Reativar conta"
                  : "Suspender conta"}
              </button>
            </div>
            <div className="admin-privacy">
              <ShieldCheck />
              <div>
                <strong>Limite de privacidade</strong>
                <p>
                  Estas ações afetam somente o acesso e a assinatura. Nenhum
                  conteúdo de paciente fica disponível aqui.
                </p>
              </div>
            </div>
          </div>
        </div>
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
  const awaiting = appointments.filter((a) => a.status === "Aguardando");
  const overdue = appointments.filter(
    (a) =>
      (a.paymentStatus ?? (a.paid ? "Pago" : "Pendente")) === "Pendente" &&
      a.status === "Realizado",
  );
  const received = appointments
    .filter((a) => a.paid)
    .reduce((s, a) => s + (a.amount ?? 180), 0);
  const [pendingFilter, setPendingFilter] = useState<
    "Todos" | "Agendamentos" | "Financeiro"
  >("Todos");
  const [tasks, setTasks] = useState<string[]>([]);
  const [taskDraft, setTaskDraft] = useState("");
  const upcoming = [...appointments]
    .filter((appointment) => appointment.status !== "Cancelado")
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
    .slice(0, 5);
  const birthdayCount = profiles.filter(
    (profile) => profile.birthDate?.slice(5, 7) === "08",
  ).length;
  const visibleAwaiting =
    pendingFilter === "Todos" || pendingFilter === "Agendamentos"
      ? awaiting
      : [];
  const visibleOverdue =
    pendingFilter === "Todos" || pendingFilter === "Financeiro" ? overdue : [];
  function addTask(event: React.FormEvent) {
    event.preventDefault();
    if (!taskDraft.trim()) return;
    setTasks([...tasks, taskDraft.trim()]);
    setTaskDraft("");
  }
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
      <section className="operational-dashboard">
        <article className="dashboard-panel upcoming-panel">
          <div className="dashboard-panel-head">
            <div>
              <span className="eyebrow">AGENDA</span>
              <h2>Próximos atendimentos</h2>
            </div>
            <button className="quiet-link" onClick={() => go("agenda")}>
              Ver agenda <ArrowRight size={15} />
            </button>
          </div>
          <div className="upcoming-list">
            {upcoming.map((appointment) => (
              <button
                key={appointment.id}
                className="upcoming-row"
                onClick={() => select(appointment)}
              >
                <time>
                  <strong>{appointment.time}</strong>
                  <small>{weekdays[appointment.day - 1]}</small>
                </time>
                <span className="avatar soft">
                  {initials(appointment.patient)}
                </span>
                <span className="upcoming-person">
                  <strong>{appointment.patient}</strong>
                  <small>{appointment.mode} · 50 minutos</small>
                </span>
                <span
                  className={`appointment-status ${appointment.status.toLowerCase()}`}
                >
                  {appointment.status}
                </span>
                <ArrowRight size={17} />
              </button>
            ))}
          </div>
        </article>

        <article className="dashboard-panel pending-panel">
          <div className="dashboard-panel-head">
            <div>
              <span className="eyebrow">CENTRAL DE AÇÕES</span>
              <h2>
                Pendências <b>{awaiting.length + overdue.length}</b>
              </h2>
              <p>Somente o que precisa da sua atenção.</p>
            </div>
          </div>
          <div className="pending-filters">
            {(["Todos", "Agendamentos", "Financeiro"] as const).map(
              (filter) => (
                <button
                  key={filter}
                  className={pendingFilter === filter ? "active" : ""}
                  onClick={() => setPendingFilter(filter)}
                >
                  {filter}
                </button>
              ),
            )}
          </div>
          <div className="pending-list">
            {visibleAwaiting.map((appointment) => (
              <button key={appointment.id} onClick={() => select(appointment)}>
                <span className="decision-icon amber">
                  <CalendarClock />
                </span>
                <span>
                  <strong>Confirmar {appointment.patient}</strong>
                  <small>
                    {weekdays[appointment.day - 1]},{" "}
                    {dates[appointment.day - 1]} de agosto às {appointment.time}
                  </small>
                </span>
                <ArrowRight />
              </button>
            ))}
            {visibleOverdue.map((appointment) => (
              <button
                key={`payment-${appointment.id}`}
                onClick={() => go("financeiro")}
              >
                <span className="decision-icon rose">
                  <CircleDollarSign />
                </span>
                <span>
                  <strong>Pagamento de {appointment.patient}</strong>
                  <small>
                    {money(appointment.amount ?? 180)} · atendimento realizado
                  </small>
                </span>
                <ArrowRight />
              </button>
            ))}
            {visibleAwaiting.length === 0 && visibleOverdue.length === 0 && (
              <div className="pending-empty">
                <CheckCircle2 />
                <strong>Nada pendente nesta categoria.</strong>
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="dashboard-metrics">
          <article>
            <span className="summary-icon">
              <CalendarDays />
            </span>
            <div>
              <strong>{appointments.length}</strong>
              <small>sessões no mês</small>
            </div>
          </article>
          <article>
            <span className="summary-icon">
              <CheckCircle2 />
            </span>
            <div>
              <strong>
                {appointments.filter((a) => a.status === "Confirmado").length}
              </strong>
              <small>confirmadas</small>
            </div>
          </article>
          <article>
            <span className="summary-icon">
              <TrendingUp />
            </span>
            <div>
              <strong>{money(received)}</strong>
              <small>recebidos</small>
            </div>
          </article>
          <article>
            <span className="summary-icon">
              <Sparkles />
            </span>
            <div>
              <strong>{birthdayCount}</strong>
              <small>aniversariantes</small>
            </div>
          </article>
        </div>
        <article className="dashboard-panel task-panel">
          <div className="dashboard-panel-head">
            <div>
              <span className="eyebrow">ORGANIZAÇÃO</span>
              <h2>Tarefas</h2>
            </div>
            <small>{tasks.length} abertas</small>
          </div>
          <form onSubmit={addTask}>
            <input
              value={taskDraft}
              onChange={(event) => setTaskDraft(event.target.value)}
              placeholder="Adicionar uma tarefa"
            />
            <button className="primary" aria-label="Adicionar tarefa">
              <Plus size={18} />
            </button>
          </form>
          <div className="task-list">
            {tasks.map((task, index) => (
              <label key={`${task}-${index}`}>
                <input
                  type="checkbox"
                  onChange={() =>
                    setTasks(
                      tasks.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                />
                <span>{task}</span>
              </label>
            ))}
            {tasks.length === 0 && (
              <div className="task-empty">
                <CheckCircle2 />
                <span>
                  <strong>Nenhuma tarefa aberta.</strong>
                  <small>Use o campo acima para organizar um lembrete.</small>
                </span>
              </div>
            )}
          </div>
        </article>
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
  const [patientTab, setPatientTab] = useState<
    | "Dados pessoais"
    | "Contato"
    | "Responsável"
    | "Atendimento"
    | "Financeiro"
    | "Documentos"
  >("Dados pessoais");
  function open(name: string) {
    setPatientTab("Dados pessoais");
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
  const patientAge = editing?.birthDate
    ? Math.max(
        0,
        new Date().getFullYear() - Number(editing.birthDate.slice(0, 4)),
      )
    : null;
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
            className="modal patient-manager-modal"
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
            <div className="patient-quick-summary">
              <div className="patient-summary-person">
                <span>{initials(editing.name)}</span>
                <div>
                  <strong>{editing.name}</strong>
                  <small>
                    {editing.patientType || "Adulto"}
                    {patientAge !== null ? ` · ${patientAge} anos` : ""}
                  </small>
                </div>
              </div>
              <div>
                <small>CONTATO</small>
                <strong>{editing.phone || "Não informado"}</strong>
              </div>
              <div>
                <small>ACORDO</small>
                <strong>{editing.agreement}</strong>
              </div>
              <div>
                <small>VALOR</small>
                <strong>{money(editing.value)}</strong>
              </div>
              <div>
                <small>SITUAÇÃO</small>
                <strong
                  className={`summary-status ${editing.status.toLowerCase()}`}
                >
                  {editing.status}
                </strong>
              </div>
              <div>
                <small>SALA ONLINE</small>
                <strong>{editing.meetUrl ? "Preparada" : "Pendente"}</strong>
              </div>
            </div>
            <div className="patient-form-tabs">
              {(
                [
                  "Dados pessoais",
                  "Contato",
                  "Responsável",
                  "Atendimento",
                  "Financeiro",
                  "Documentos",
                ] as const
              ).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={patientTab === tab ? "active" : ""}
                  onClick={() => setPatientTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="patient-form-content">
              {patientTab === "Dados pessoais" && (
                <section className="patient-form-section">
                  <div className="form-section-heading">
                    <div>
                      <span>IDENTIFICAÇÃO</span>
                      <h3>Dados pessoais</h3>
                      <p>Informações básicas para identificar o cadastro.</p>
                    </div>
                    <UsersRound />
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
                          setEditing({
                            ...editing,
                            cpf: formatCpf(e.target.value),
                          })
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
                </section>
              )}
              {patientTab === "Contato" && (
                <section className="patient-form-section">
                  <div className="form-section-heading">
                    <div>
                      <span>COMUNICAÇÃO</span>
                      <h3>Contato e endereço</h3>
                      <p>
                        Canais usados em lembretes e mensagens administrativas.
                      </p>
                    </div>
                    <MessageCircle />
                  </div>
                  <div className="form-row">
                    <label>
                      E-mail
                      <input
                        type="email"
                        value={editing.email}
                        onChange={(e) =>
                          setEditing({ ...editing, email: e.target.value })
                        }
                        placeholder="nome@exemplo.com"
                      />
                    </label>
                    <label>
                      Telefone
                      <input
                        value={editing.phone}
                        onChange={(e) =>
                          setEditing({ ...editing, phone: e.target.value })
                        }
                        placeholder="(00) 00000-0000"
                      />
                    </label>
                  </div>
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
                  <div className="contact-review">
                    <div>
                      <small>LEMBRETES</small>
                      <strong>
                        {editing.patientType === "Criança ou adolescente"
                          ? editing.reminderRecipient || "Responsável"
                          : "Paciente"}
                      </strong>
                    </div>
                    <div>
                      <small>LINK DA SALA</small>
                      <strong>
                        {editing.patientType === "Criança ou adolescente"
                          ? editing.meetRecipient || "Responsável"
                          : "Paciente"}
                      </strong>
                    </div>
                  </div>
                </section>
              )}
              {patientTab === "Responsável" &&
                editing.patientType === "Criança ou adolescente" && (
                  <div className="minor-box">
                    <div className="minor-heading">
                      <div>
                        <span className="eyebrow">
                          RESPONSÁVEIS E AUTORIZAÇÕES
                        </span>
                        <strong>
                          Organização do atendimento infantojuvenil
                        </strong>
                      </div>
                      <span className="minor-badge">Menor de idade</span>
                    </div>
                    <div className="form-row">
                      <label>
                        Responsável legal
                        <input
                          value={editing.guardianName || ""}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              guardianName: e.target.value,
                            })
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
                        <span>
                          Autorização para atendimento online registrada
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              {patientTab === "Responsável" &&
                editing.patientType !== "Criança ou adolescente" && (
                  <div className="empty-form-state">
                    <UserRoundCheck />
                    <h3>Responsável não necessário</h3>
                    <p>Este cadastro está configurado como paciente adulto.</p>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          patientType: "Criança ou adolescente",
                        })
                      }
                    >
                      Alterar tipo de paciente
                    </button>
                  </div>
                )}
              {patientTab === "Financeiro" && (
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
                          setEditing({
                            ...editing,
                            value: Number(e.target.value),
                          })
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
                          setEditing({
                            ...editing,
                            dueDay: Number(e.target.value),
                          })
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
              )}
              {patientTab === "Atendimento" && (
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
              )}
              {patientTab === "Documentos" && (
                <section className="patient-form-section">
                  <div className="form-section-heading">
                    <div>
                      <span>ADMINISTRATIVO</span>
                      <h3>Documentos e observações</h3>
                      <p>
                        Espaço para materiais administrativos, sem conteúdo
                        clínico.
                      </p>
                    </div>
                    <Link2 />
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
                  <label className="document-drop">
                    <input type="file" multiple />
                    <span>
                      <Plus />
                      <strong>Anexar documento administrativo</strong>
                      <small>
                        Contratos, autorizações ou comprovantes. Protótipo sem
                        envio real.
                      </small>
                    </span>
                  </label>
                </section>
              )}
            </div>
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
