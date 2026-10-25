# Ateliê de Bolos — gestão

Painel leve (HTML + CSS + JS, sem build) para confeitaria, pensado para uso no celular.

- **Pedidos:** calendário mensal; toque no dia para ver o cartão do cliente e o pedido, adicionar ou remover.
- **Fichas técnicas e Cardápio:** duas abas flutuantes, cada uma com **Baixar Word** (.docx gerado no próprio aparelho).
- **Estoque:** matéria-prima com + / −, mínimo e alerta de reposição; botão para novo insumo.
- **PWA:** instala na tela inicial e funciona offline.

## Estrutura
```
index.html · style.css · app.js · sw.js · manifest.webmanifest · icons/
```

## Publicar no GitHub Pages
```bash
git init && git add . && git commit -m "Ateliê de Bolos"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/atelier-bolos.git
git push -u origin main
```
No GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**.
O endereço sai como `https://SEU-USUARIO.github.io/atelier-bolos/`.

## Instalar no celular
- **iPhone (Safari):** Compartilhar → *Adicionar à Tela de Início*.
- **Android (Chrome):** menu ⋮ → *Instalar app*.

## Dados
Pedidos e estoque ficam no `localStorage` do aparelho. Limpar os dados do navegador apaga tudo, e não há sincronização entre aparelhos.
Os pedidos, receitas, preços e estoque iniciais são **exemplos**: edite `fichas`, `cardapio`, `orders` e `estoque` no início de `app.js`.
Ao atualizar arquivos, troque a versão em `sw.js` (`var V='atelier-v1'`) para o cache renovar.
