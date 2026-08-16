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

  await page.getByRole("button", { name: "Agenda", exact: true }).click();
  await page.locator(".slot:has(.add-slot)").first().click();
  await expect(page.getByLabel("Paciente")).toHaveValue("");
  await expect(page.locator(".patient-picker")).not.toBeVisible();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
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
  await page.getByLabel("Data de nascimento").fill("10/05/2000");
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
  const patientResult = page
    .locator(".search-results button")
    .filter({ hasText: "Ana Teste E2E" });
  await expect(patientResult).toBeVisible();
  await patientResult.click();
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
  await page.getByLabel("Escolher foto do perfil").setInputFiles({
    name: "avatar.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await expect(page.getByAltText("Prévia da foto do perfil")).toBeVisible();
  await expect(page.getByRole("button", { name: /^Usar avatar/ })).toHaveCount(
    10,
  );
  await page
    .getByRole("button", { name: "Usar avatar Natureza serena" })
    .click();
  await expect(page.getByAltText("Prévia da foto do perfil")).toHaveAttribute(
    "src",
    "/avatars/natureza-serena.webp",
  );
  await page.getByRole("button", { name: "Aparência" }).click();
  await page.getByText("Oceano", { exact: true }).click();
  await page
    .getByRole("main")
    .getByRole("button", { name: "Agenda", exact: true })
    .click();
  await page.getByLabel("Ativar pausa semanal").check();
  await page.getByLabel("Início da pausa").selectOption("12:00");
  await page.getByLabel("Término da pausa").selectOption("13:00");
  await page.getByRole("button", { name: "Idioma e região" }).click();
  await expect(page.getByLabel("Idioma")).toHaveValue("pt-BR");
  await page.getByLabel("Fuso horário").selectOption("America/Manaus");
  await page.getByRole("button", { name: /Salvar configurações/ }).click();
  await expect(page.getByText("Configurações salvas")).toBeVisible();
  await expect(page.getByAltText("Foto do perfil")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const blocks = JSON.parse(
          localStorage.getItem("sereno-blocks") || "[]",
        );
        return blocks.filter(
          (block: { managed?: string }) => block.managed === "fixed-break",
        ).length;
      }),
    )
    .toBe(5);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("sereno-settings") || "{}").timezone,
      ),
    )
    .toBe("America/Manaus");
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
  await expect(
    page.getByRole("button", { name: "Almoço semanal" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Período de férias" }),
  ).toBeVisible();
  await page.getByLabel("Motivo").selectOption("Almoço");
  await page.getByRole("button", { name: /Criar bloqueio/ }).click();
  await expect(page.getByText("Horário bloqueado com sucesso")).toBeVisible();
  const blockedDate = await page.evaluate(() => {
    const blocks = JSON.parse(localStorage.getItem("sereno-blocks") || "[]");
    return blocks.find((block: { reason: string }) => block.reason === "Almoço")
      .scheduledDate;
  });
  await page.getByRole("button", { name: /Novo atendimento/ }).click();
  await page.getByLabel("Paciente").fill("Conflito com bloqueio E2E");
  await page
    .getByLabel("Data")
    .fill(blockedDate.split("-").reverse().join("/"));
  await page.getByRole("button", { name: /Agendar atendimento/ }).click();
  await expect(
    page.getByText("Este horário está ocupado ou bloqueado"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();

  await page.getByRole("button", { name: "Pacientes", exact: true }).click();
  await page.getByRole("button", { name: /Novo paciente/ }).click();
  await page.getByPlaceholder("Nome completo").fill("Criança Teste E2E");
  await page
    .getByLabel("Tipo de paciente")
    .selectOption("Criança ou adolescente");
  await page
    .getByPlaceholder("Nome completo do responsável")
    .fill("Responsável Teste");
  await page.getByLabel("Data de nascimento").fill("20/06/2015");
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
  await page
    .getByRole("button", { name: /Preparar próximo atendimento/ })
    .click();
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
    page.locator(".meet-box").getByRole("link", { name: "Entrar na sala" }),
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

test("fecha atendimento e organiza financeiro e recibo", async ({ page }) => {
  await login(page);
  await page
    .getByRole("button", { name: /Confirmar atendimento de Lucas Ribeiro/ })
    .click();
  await page.getByRole("button", { name: /Finalizar atendimento/ }).click();
  const workflow = page.locator(".closing-workflow-modal");
  await expect(workflow.getByText("FECHAMENTO EM UM MINUTO")).toBeVisible();
  await workflow.getByLabel("Situação").selectOption("Pago");
  await workflow.getByLabel("Forma de pagamento").selectOption("Pix");
  await workflow.getByLabel("Próxima sessão").fill("2026-08-24T14:00");
  await workflow.getByText("Recibo emitido no Receita Saúde").click();
  await workflow.getByRole("button", { name: /Concluir fechamento/ }).click();
  await expect(
    page.getByText("Atendimento fechado e próxima sessão agendada"),
  ).toBeVisible();
  const savedAppointments = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("sereno-appointments") || "[]"),
  );
  expect(
    savedAppointments.filter(
      (appointment: { patient: string }) =>
        appointment.patient === "Lucas Ribeiro",
    ),
  ).toHaveLength(2);

  await page.getByRole("button", { name: "Financeiro", exact: true }).click();
  await expect(page.locator(".financial-health")).toBeVisible();
  await page.getByRole("button", { name: "Receita Saúde" }).click();
  await expect(
    page.getByRole("heading", { name: "Preparação para o Receita Saúde" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Marcar emitido" }).first().click();
  await expect(page.getByText("Recibo marcado como emitido")).toBeVisible();
});

test("prepara sessão com remarcação e cancelamento organizados", async ({
  page,
}) => {
  await login(page);
  await page
    .getByRole("button", { name: /Preparar próximo atendimento/ })
    .click();
  await expect(
    page.locator(".eyebrow", { hasText: "PREPARAR SESSÃO" }),
  ).toBeVisible();
  await page
    .getByPlaceholder("Cole o link meet.google.com aqui")
    .fill("https://meet.google.com/abc-defg-hij");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(page.getByText("Link salvo")).toBeVisible();
  await expect(
    page.locator(".meet-box").getByRole("link", { name: "Entrar na sala" }),
  ).toHaveAttribute("href", "https://meet.google.com/abc-defg-hij");
  await expect(page.getByRole("button", { name: "Enviar link" })).toBeVisible();
  await page.getByText("Outras ações").click();
  await page.getByRole("button", { name: "Remarcar sessão" }).click();
  await page.getByLabel("Data").fill("03/09/2026");
  await page.getByLabel("Horário").selectOption("11:00");
  await page.getByRole("button", { name: "Confirmar remarcação" }).click();
  await expect(
    page.getByText("Atendimento remarcado e aguardando confirmação"),
  ).toBeVisible();
  const cancelSession = page.getByRole("button", { name: "Cancelar sessão" });
  if (!(await cancelSession.isVisible())) {
    await page.getByText("Outras ações").click();
  }
  page.once("dialog", (dialog) => dialog.accept());
  await cancelSession.click();
  await expect(page.getByText("Atendimento cancelado")).toBeVisible();
});

test("oferece pacientes para escolha antes de digitar na busca", async ({
  page,
}) => {
  await login(page);
  const globalSearch = page.getByPlaceholder("Buscar pacientes...");
  await globalSearch.focus();
  const initialOptions = page.locator(".search-results button");
  await expect(initialOptions.first()).toBeVisible();
  expect(await initialOptions.count()).toBeLessThanOrEqual(10);

  await page.getByRole("button", { name: "Novo atendimento" }).first().click();
  const picker = page.locator(".patient-picker");
  await expect(picker.getByRole("option").first()).toBeVisible();
  expect(await picker.getByRole("option").count()).toBeLessThanOrEqual(10);
  await picker.getByRole("option").first().click();
  await expect(page.getByPlaceholder("Nome do paciente")).not.toHaveValue("");
  await expect(page.getByText("Paciente selecionado")).toBeVisible();
  await expect(picker).toHaveCount(0);
  await expect(page.getByLabel("Data")).toHaveValue(/\d{2}\/\d{2}\/\d{4}/);
  await expect(
    page.getByRole("button", { name: "Abrir calendário" }),
  ).toBeVisible();
});

test("busca paciente sem acento e abre cadastro criado pela agenda", async ({
  page,
}) => {
  await login(page);
  const search = page.getByPlaceholder("Buscar pacientes...");
  await search.fill("joao");
  await expect(
    page.locator(".search-results button").filter({ hasText: "João Oliveira" }),
  ).toBeVisible();
  await search.press("Enter");
  await expect(
    page.getByRole("heading", { name: "João Oliveira" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();

  await page.getByRole("button", { name: "Agenda", exact: true }).click();
  await page.getByRole("button", { name: /Novo atendimento/ }).click();
  await page.getByLabel("Paciente").fill("Paciente Apenas Agenda E2E");
  await page.getByLabel("Data").fill("02/09/2026");
  await page.getByLabel("Horário").selectOption("17:00");
  await page.getByRole("button", { name: /Agendar atendimento/ }).click();
  await search.fill("apenas agenda");
  await search.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Paciente Apenas Agenda E2E" }),
  ).toBeVisible();
});

test("mostra hoje e amanhã como terceira opção de preparação", async ({
  page,
}) => {
  await login(page);
  await expect(
    page.getByRole("heading", { name: "Hoje e amanhã" }),
  ).toBeVisible();
  await expect(page.locator(".planning-day")).toHaveCount(2);
  await expect(page.getByText("Nenhuma sessão agendada")).toHaveCount(2);
  await page
    .locator(".dashboard-planning")
    .getByRole("button", { name: "Ver agenda completa" })
    .click();
  await expect(page.getByRole("heading", { name: "Agenda" })).toBeVisible();
});

test("impede conflitos e cria recorrência com datas reais", async ({
  page,
}) => {
  await login(page);
  await page.getByRole("button", { name: "Agenda", exact: true }).click();
  await page.getByRole("button", { name: /Novo atendimento/ }).click();
  await page.getByLabel("Paciente").fill("Recorrência Teste E2E");
  await page.getByLabel("Data").fill("31/08/2026");
  await page.getByLabel("Horário").selectOption("09:00");
  await page.getByLabel("Recorrência").selectOption("Semanal");
  await page.getByRole("button", { name: /Agendar atendimento/ }).click();
  await expect(page.getByText("12 atendimentos criados")).toBeVisible();
  const recurringAppointments = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("sereno-appointments") || "[]").filter(
      (appointment: { patient: string }) =>
        appointment.patient === "Recorrência Teste E2E",
    ),
  );
  expect(recurringAppointments).toHaveLength(12);

  await page.getByRole("button", { name: /Novo atendimento/ }).click();
  await page.getByLabel("Paciente").fill("Conflito Teste E2E");
  await page.getByLabel("Data").fill("31/08/2026");
  await page.getByLabel("Horário").selectOption("09:00");
  await page.getByRole("button", { name: /Agendar atendimento/ }).click();
  await expect(
    page.getByText("Este horário está ocupado ou bloqueado"),
  ).toBeVisible();
});

test("exporta backup administrativo sem prender os dados", async ({ page }) => {
  await login(page);
  await page
    .getByRole("button", { name: "Configurações", exact: true })
    .click();
  await page.getByRole("button", { name: "Dados e segurança" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Baixar meus dados" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^sereno-backup-.*\.json$/);
  await expect(
    page.getByText("Backup administrativo preparado para download"),
  ).toBeVisible();
});
