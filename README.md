# Vivi Cake — gestão

Painel da confeitaria Vivi Cake. É um site estático (HTML, CSS e JS, sem etapa de build), feito para o celular e pronto para o GitHub Pages.

## O que tem
- **Pedidos:** painel do dia, com saudação, entregas de hoje, próximos 7 dias e vendido no mês. Calendário mensal com os pedidos de cada dia, cadastro com preço preenchido pelo cardápio e opção de remover.
- **Faturamento e custo do mês:** gráficos de pizza do mês aberto no calendário. O custo junta os insumos dos pedidos (pela ficha técnica) e as despesas fixas da planilha. Mostra também o resultado estimado.
- **Google Agenda:** cada pedido tem **Adicionar ao Google Agenda**, que abre o evento já preenchido. A notificação no celular vem do app Google Agenda. **Baixar agenda (.ics)** exporta todos os pedidos de hoje em diante, com lembretes de 1 dia e 2 horas antes.
- **Ouvir pedidos:** o app lê em voz alta (pt-BR) os pedidos do dia.
- **Fichas técnicas e cardápio:** cadastro, edição e remoção pelo app, busca, ficha completa e download em Word de uma ficha, de um item ou de tudo.
- **Estoque:** quantidade e mínimo digitados direto na tabela, gráficos de custo e físico e alerta de reposição.
- **PWA:** instala na tela inicial e funciona offline depois do primeiro acesso.

## Bibliotecas
- [Motion](https://motion.dev) (`motion@11.11.13`, via jsDelivr) para as animações de entrada e de troca de tela. Se não carregar, o app usa animações próprias equivalentes.
- Fontes [Bodoni Moda](https://fonts.google.com/specimen/Bodoni+Moda) e [Figtree](https://fonts.google.com/specimen/Figtree) (Google Fonts).
- Quem ativa "reduzir movimento" no celular não vê as animações.

## Estrutura
```
index.html · style.css · app.js · sw.js · manifest.webmanifest · .nojekyll · icons/
```

## Publicar no GitHub Pages
1. Crie um repositório (ex.: `vivi-cake`) e envie **o conteúdo desta pasta** para a raiz:
   ```bash
   git init && git add . && git commit -m "Vivi Cake"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/vivi-cake.git
   git push -u origin main
   ```
   Pelo site também dá: **Add file → Upload files**, arraste tudo (inclusive a pasta `icons`) e confirme.
2. Em **Settings → Pages → Build and deployment**, escolha **Deploy from a branch → main / (root)**.
3. O endereço será `https://SEU-USUARIO.github.io/vivi-cake/`.

## Instalar no celular
- **Android (Chrome):** menu ⋮ → *Instalar app*.
- **iPhone (Safari):** Compartilhar → *Adicionar à Tela de Início*.

## Notificações dos pedidos
- **Lembrete diário:** no painel de Pedidos, toque em *Lembrete diário no Google Agenda* e salve. Todo dia às 7h o Google Agenda avisa no celular, e o toque na notificação abre o app já nos pedidos de hoje (`?hoje=1`).
Para o celular avisar (e falar, se o leitor de notificações estiver ativo), adicione cada pedido ao Google Agenda pelo botão do pedido. O aviso usa os lembretes padrão da sua agenda (Google Agenda → Configurações → sua agenda → Notificações padrão).

## Dados
Pedidos e estoque ficam no `localStorage` do aparelho: limpar os dados do navegador apaga tudo, e não há sincronização entre aparelhos.
O app começa vazio: cadastre fichas técnicas (**+ Nova ficha**), itens do cardápio (**+ Novo item**), insumos (**+ Novo insumo**) e pedidos pelo próprio app. Tudo fica salvo no aparelho. As despesas fixas do gráfico de custo estão em `fixos`, no começo de `app.js`.
Ao atualizar arquivos, troque a versão em `sw.js` (`var V='vivicake-v7'`) para o cache renovar.
