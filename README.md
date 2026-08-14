# Sereno

Protótipo local de uma plataforma de gestão para profissionais de Psicologia. A primeira versão é focada em landing page, acesso em duas etapas, agenda administrativa, pacientes, controle financeiro básico e administração da plataforma, sem prontuário ou dados clínicos.

## Acessos de demonstração

- Profissional: `kamilla@sereno.app` / `sereno123`
- Administrador: `admin@sereno.app` / `admin123`
- Código de verificação da demonstração: `482731`

O login e o segundo fator atuais simulam o fluxo no navegador. Antes do uso real, autenticação, geração e envio de códigos deverão ser implementados em um servidor seguro.

## Executar localmente

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## Validar a versão de produção

```bash
npm run build
npm run preview
```

Todos os nomes e dados incluídos no protótipo são fictícios. Novos atendimentos ficam armazenados somente no navegador por meio de `localStorage`.
