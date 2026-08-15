import { expect, test, type Page } from "@playwright/test";

async function login(
  page: Page,
  role: "professional" | "admin" = "professional",
) {
  await page.goto("/");
  await page.getByRole("button", { name: "Entrar" }).click();
  const account = role === "admin" ? "Administrador:" : "Profissional:";
  await page.getByRole("button", { name: new RegExp(account) }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel("Código de verificação").fill("482731");
  await page.getByRole("button", { name: "Verificar e entrar" }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("landing, cadastro trial e validações de acesso", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Menos tempo organizando/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Seu consultório não precisa funcionar no improviso",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Feito para ser simples desde o primeiro atendimento.",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Começar.*grátis/i })
    .first()
    .click();
  await expect(page.getByText("15 DIAS GRÁTIS")).toBeVisible();
  await page.getByLabel("Seu nome").fill("Paulo Eugenio");
  await page.getByLabel("E-mail profissional").fill("paulo@example.com");
  await page.getByLabel("Crie uma senha").fill("123456");
  await page.getByText("Li e aceito").click();
  await page.getByRole("button", { name: /Criar meu acesso/ }).click();
  await expect(
    page.getByRole("heading", { name: "Confirme que é você" }),
  ).toBeVisible();
  await page.getByLabel("Código de verificação").fill("111111");
  await page.getByRole("button", { name: "Verificar e entrar" }).click();
  await expect(page.getByText(/Código incorreto/)).toBeVisible();
});

test("fluxo profissional: agenda, paciente, busca, financeiro e configurações", async ({
  page,
}) => {
  await login(page);
  await expect(page.getByText("Kamilla Campos Eugenio")).toBeVisible();
  const dayCard = page.locator(".day-card");
  await expect(dayCard.getByText("2 atendimentos hoje")).toBeVisible();
  await expect(dayCard.getByText("Ana Martins")).toBeVisible();
  await expect(dayCard.getByText("João Oliveira")).toBeVisible();
  await dayCard.getByRole("button", { name: "Detalhes" }).first().click();
  await expect(page.getByText("DETALHES DO ATENDIMENTO")).toBeVisible();
  await page.locator(".detail-modal .modal-head button").click();

  await page.getByRole("button", { name: "Agenda", exact: true }).click();
  await page.getByRole("button", { name: /Novo atendimento/ }).click();
  await page.getByLabel("Paciente").fill("Paciente Teste E2E");
  await page.getByRole("button", { name: /Agendar atendimento/ }).click();
  await expect(
    page.getByText("Atendimento agendado com sucesso"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Pacientes", exact: true }).click();
  await page.getByRole("button", { name: /Novo paciente/ }).click();
  await page.getByPlaceholder("Nome completo").fill("Ana Teste E2E");
  await page.getByLabel("E-mail").fill("ana@teste.com");
  await page.getByLabel("Telefone").fill("11999998888");
  await page.getByLabel("Data de nascimento").fill("2000-05-10");
  await page.getByLabel("CPF").fill("12345678901");
  await page.getByLabel("Endereço completo").fill("Rua Teste, 10");
  await page.getByRole("button", { name: /Cadastrar paciente/ }).click();
  await expect(
    page.getByRole("heading", { name: "Ana Teste E2E" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Contato" }).click();
  await expect(page.getByLabel("E-mail", { exact: true })).toHaveValue(
    "ana@teste.com",
  );
  await page.getByRole("button", { name: /Salvar alterações/ }).click();

  await page.getByPlaceholder("Buscar pacientes...").fill("ana@teste.com");
  await expect(page.getByText("Abrir cadastro administrativo")).toBeVisible();
  await page.getByText("Abrir cadastro administrativo").click();
  await expect(
    page.getByRole("heading", { name: "Ana Teste E2E" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancelar" }).click();

  await page.getByRole("button", { name: "Financeiro", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Financeiro" })).toBeVisible();
  await page.getByRole("button", { name: "Pendente", exact: true }).click();

  await page
    .getByRole("button", { name: "Configurações", exact: true })
    .click();
  await page.getByRole("button", { name: "Aparência" }).click();
  await page.getByText("Oceano", { exact: true }).click();
  await page.getByRole("button", { name: /Salvar configurações/ }).click();
  await expect(page.getByText("Configurações salvas")).toBeVisible();
});

test("fluxo administrador e ações principais", async ({ page }) => {
  await login(page, "admin");
  await expect(page.getByText("Central administrativa")).toBeVisible();
  await page.getByRole("button", { name: "Profissionais" }).click();
  await page.getByRole("button", { name: /Convidar profissional/ }).click();
  await page.getByLabel("Nome completo").fill("Profissional E2E");
  await page.getByLabel("E-mail profissional").fill("pro@e2e.com");
  await page.getByRole("button", { name: /Criar convite/ }).click();
  await expect(page.getByText("Profissional E2E")).toBeVisible();
  await page.getByRole("button", { name: "Trials" }).click();
  await page.getByRole("button", { name: "Assinaturas" }).click();
  await page.getByRole("button", { name: "Financeiro", exact: true }).click();
  await page.getByRole("button", { name: "Suporte", exact: true }).click();
  await page.getByRole("button", { name: "Avisos" }).click();
  await page.getByRole("button", { name: "Auditoria" }).click();
  await page.getByRole("button", { name: "Plataforma", exact: true }).click();
  await page.getByRole("button", { name: /Sair com segurança/ }).click();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
});

test("bloqueio de agenda e cadastro infantojuvenil com exclusão", async ({
  page,
}) => {
  await login(page);
  await page.getByRole("button", { name: "Agenda", exact: true }).click();
  await page.getByRole("button", { name: /Bloquear horário/ }).click();
  await page.getByLabel("Motivo").selectOption("Almoço");
  await page.getByRole("button", { name: /Criar bloqueio/ }).click();
  await expect(page.getByRole("button", { name: /Almoço/ })).toBeVisible();

  await page.getByRole("button", { name: "Pacientes", exact: true }).click();
  await page.getByRole("button", { name: /Novo paciente/ }).click();
  await page.getByPlaceholder("Nome completo").fill("Criança Teste E2E");
  await page
    .getByLabel("Tipo de paciente")
    .selectOption("Criança ou adolescente");
  await page
    .getByPlaceholder("Nome completo do responsável")
    .fill("Responsável Teste");
  await page.getByLabel("Data de nascimento").fill("2015-06-20");
  await page.getByLabel("CPF").fill("98765432100");
  await page.getByLabel("Endereço completo").fill("Rua Infantil, 20");
  await page.getByRole("button", { name: /Cadastrar paciente/ }).click();
  await page.getByRole("button", { name: "Responsável" }).click();
  await expect(page.getByLabel("Responsável legal")).toHaveValue(
    "Responsável Teste",
  );
  await page.getByRole("button", { name: /Salvar alterações/ }).click();
  await page.getByRole("button", { name: /Criança Teste E2E/ }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Excluir paciente" }).click();
  await expect(
    page.getByRole("button", { name: /Criança Teste E2E/ }),
  ).toHaveCount(0);
});

test("sala fixa do Meet valida, salva e libera entrada", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: "Agenda", exact: true }).click();
  await page.getByRole("button", { name: /Marina Online/ }).click();
  const room = page.getByPlaceholder("Cole o link meet.google.com aqui");
  await room.fill("link-invalido");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(
    page.getByText("Cole um link válido do Google Meet"),
  ).toBeVisible();
  await room.fill("https://meet.google.com/abc-defg-hij");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(
    page.getByText("Sala fixa salva para este paciente"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Entrar na sala" }),
  ).toHaveAttribute("href", "https://meet.google.com/abc-defg-hij");
});

test("navegação principal funciona em tela móvel", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  await page.locator(".menu-mobile").click();
  await expect(page.locator(".sidebar")).toHaveClass(/open/);
  await page.getByRole("button", { name: "Pacientes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Pacientes" })).toBeVisible();
  await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
});
