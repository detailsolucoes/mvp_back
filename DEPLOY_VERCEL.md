# Guia de Deploy na Vercel - mvp_back

Siga estes passos para colocar o seu frontend em produção conectado ao Supabase.

## 1. Preparação do Repositório
Certifique-se de que todas as alterações foram enviadas para o GitHub (já realizamos o push anteriormente).

## 2. Importar Projeto na Vercel
1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
2. Clique em **"Add New..."** e selecione **"Project"**.
3. Importe o repositório `detailsolucoes/mvp_back`.

## 3. Configurações de Build
A Vercel deve detectar automaticamente as configurações do Vite, mas confirme se estão assim:
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build` ou `pnpm run build`
- **Output Directory:** `dist`

## 4. Variáveis de Ambiente (Crucial)
Antes de clicar em Deploy, expanda a seção **"Environment Variables"** e adicione as seguintes chaves:

| Chave | Valor | Onde encontrar no Supabase |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Sua URL do projeto | Project Settings > API > Project URL |
| `VITE_SUPABASE_ANON_KEY` | Sua Anon Key | Project Settings > API > `anon` `public` |

> **Nota:** O prefixo `VITE_` é obrigatório para que o Vite exponha essas variáveis ao código do frontend.

## 5. Deploy
Clique em **"Deploy"**. Após alguns segundos, seu site estará online!

## 6. Configuração de Redirecionamento (Opcional, mas recomendado)
Como o projeto usa `react-router-dom`, se você atualizar a página em uma rota específica (ex: `/pedidos`), a Vercel pode retornar 404. Para evitar isso, crie um arquivo `vercel.json` na raiz do projeto com o seguinte conteúdo:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
]
```

## 7. Próximos Passos no Supabase
Para que o sistema funcione 100%, lembre-se de:
1. Executar o script `schema.sql` no **SQL Editor** do Supabase.
2. **Configuração no Supabase (Crucial para Auth)**:
Para que o login, recuperação de senha e links de e-mail funcionem, você deve configurar o Supabase:
1. Acesse seu painel do Supabase > Authentication > URL Configuration.
2. Em **Site URL**, coloque: `https://detailcrm.daxensolucoes.com.br`
3. Em **Redirect URLs**, adicione: `https://detailcrm.daxensolucoes.com.br/auth/callback`
4. **Importante**: Se você usa o link de recuperação de senha, o Supabase precisa saber para onde redirecionar. Verifique se o link de recuperação de senha no Supabase está configurado para `https://detailcrm.daxensolucoes.com.br/reset-password` (ou o caminho que você usa).
