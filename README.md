#####################################################################################
#
#                         MVP WeatherMap — Consulta sobre clima
#                Pós-Graduação em Full Stack Development - PUC Rio - 2026
#                       
#                               Francisco Silveira
#
#####################################################################################

Este projeto faz parte do MVP da Sprint **Desenvolvimento Back-End Avançado**.

---

## Descrição

O **WeatherMap – Frontend** é uma aplicação **SPA (Single Page Application)** desenvolvida em **React + Vite**, responsável por consumir a API do WeatherMap Backend e exibir informações de clima, localização e navegação em mapa.

A aplicação utiliza **TanStack Router** para gerenciamento de rotas, **TailwindCSS + shadcn/ui** para estilização, **Lucide Icons** para ícones e integra serviços externos como **OpenWeatherMap**, **ViaCEP**, **IBGE** e **OpenStreetMap**.

O frontend é totalmente containerizado e executado via **Docker**, garantindo reprodutibilidade, isolamento e facilidade de implantação em qualquer ambiente.

---

## Como executar

O **WeatherMap – Frontend** é executado exclusivamente via **Docker**, não sendo necessário instalar Node.js, npm ou qualquer dependência local.

Certifique-se de ter o **Docker Desktop** instalado e funcionando em sua máquina.

---

### 1. Clonar o repositório

Antes de tudo, faça o clone do projeto:

git clone https://github.com/fcopobox/MVP3_FS_Front-End.git


---

### 2. Verificar instalação do Docker

-----------------------------------
`docker -v`
-----------------------------------

Caso o comando não retorne a versão instalada, instale o Docker Desktop antes de prosseguir.

---

### 3. Acessar o diretório do projeto

Após clonar o repositório, abra o **PowerShell** ou **Command Prompt** e navegue até o diretório raiz do backend (certifique-se do nome da pasta):

-----------------------------------
`cd MVP3_FS_Front-End`
-----------------------------------

---

### 4. Construir a imagem Docker

Execute o comando abaixo para construir a imagem do backend em modo de desenvolvimento (não esqueça o ponto no final do comando):

-----------------------------------
`docker build -t weathermap-frontend .`
-----------------------------------

Este comando cria a imagem utilizando o Dockerfile presente no projeto.

---

### 5. Executar o container

Após a construção da imagem, execute o container:

-----------------------------------
`docker run -d -p 8080:8080 --name weathermap-frontend weathermap-frontend`
-----------------------------------

O frontend estará disponível na porta **8080**.

---

### 6. Acessar a aplicação

-----------------------------------
http://localhost:8080
-----------------------------------

---

### 7. Parar o container

-----------------------------------
`docker stop weathermap-frontend`
-----------------------------------

---

### 8. Remover o container

-----------------------------------
`docker rm weathermap-frontend`
-----------------------------------

---

### 9. Remover a imagem Docker

-----------------------------------
`docker rmi weathermap-frontend`
-----------------------------------

---

### 10. Verificar se foi removido

**Listar containers:**

-----------------------------------
`docker ps -a`
-----------------------------------

**Listar imagens:**

-----------------------------------
`docker images`
-----------------------------------

Se o container e a imagem não aparecerem na lista, a remoção foi concluída com sucesso.

---

### 11. Limpeza opcional (avançado)

**Limpar containers, imagens, redes e cache não utilizados:**

-----------------------------------
`docker system prune -a -f`
-----------------------------------

**Limpar também volumes não utilizados:**

-----------------------------------
`docker system prune -a --volumes -f`
-----------------------------------

---

## Rotas do Frontend

A aplicação utiliza **TanStack Router** para navegação entre páginas, cada uma definida como um arquivo dentro do diretório `src/routes/`:

- `/` — Página inicial  
- `/login` — Autenticação de usuário  
- `/register` — Cadastro de novo usuário  
- `/edit` — Edição de dados do usuário autenticado  
- `/change-password` — Alteração de senha 
- `/forgot-password` — Recuperação de senha  
- `/about` — Informações sobre o projeto

Rotas protegidas dependem do **ticket JWT** fornecido pelo backend, garantindo que apenas usuários autenticados possam acessar páginas de perfil, edição e alteração de senha.

---

## Estrutura do projeto

A estrutura do WeatherMap – Frontend é organizada de forma modular, separando componentes, rotas, contexto global, hooks e utilitários para garantir clareza e escalabilidade.

- `src/components/`  
  Componentes reutilizáveis da interface.  
  Inclui elementos como:
  - `Header.tsx`, `Loader.tsx`, `GeoMap.tsx`, `WeatherPanel.tsx`, `ForecastPanel.tsx`
  - Páginas de autenticação: `LoginPage.tsx`, `RegisterPage.tsx`, `ForgotPasswordPage.tsx`
  - Páginas de usuário: `UserEditPage.tsx`, `ChangePasswordPage.tsx`
  - Componentes de UI em `components/ui/` (Autocomplete, CloudToggle, ErrorMessage, AuthShell, etc.)

- `src/context/`  
  Contextos globais da aplicação:
  - `AppContext.tsx` — estado geral da aplicação  
  - `AuthContext.tsx` — gerenciamento de autenticação e sessão do usuário

- `src/hooks/`  
  Hooks personalizados:
  - `use-mobile.tsx` — detecção de viewport e comportamento mobile

- `src/lib/`  
  Funções auxiliares e integração com serviços externos:
  - `api.ts` — comunicação com o backend WeatherMap  
  - `utils.ts` — utilidades gerais  
  - `error-capture.ts` — captura e tratamento de erros  
  - `error-page.ts` — página de erro padrão

- `src/routes/`
  Sistema de rotas baseado em **TanStack Router**, utilizando file‑based routing.  
  Cada arquivo representa uma página da aplicação:

- `index.tsx` — página inicial  
- `login.tsx`, `forgot-password.tsx` — fluxo de autenticação  
- `edit.tsx`, `change-password.tsx` — edição de dados do usuário autenticado  
- `about.tsx` — página sobre o projeto  
- `__root.tsx` — layout raiz e configuração global das rotas  

  Arquivos auxiliares do router:

- `router.ts` — instanciação do TanStack Router  
- `routeTree.gen.ts` — árvore de rotas gerada automaticamente  
- `start.ts` — inicialização da aplicação em modo SPA

- `public/`  
  Arquivos públicos servidos diretamente pelo Vite (ex.: `favicon.svg`).

- `.env`  
  Variáveis de ambiente (chaves de API, URLs, etc.).

- `Dockerfile`  
  Configuração para containerização do frontend.

---

## Tecnologias utilizadas

O WeatherMap – Frontend utiliza um conjunto moderno de bibliotecas e ferramentas para construção de uma SPA robusta, modular e performática.

- **React 19**  
  Biblioteca principal para construção da interface da aplicação.

- **Vite 8**  
  Ferramenta de build e servidor de desenvolvimento rápido.

- **TypeScript 5.8**  
  Tipagem estática para maior segurança e produtividade no código.

- **TanStack Router**  
  Sistema moderno de rotas baseado em arquivos, usado para estruturar toda a navegação.

- **TanStack React Query**  
  Gerenciamento de estado assíncrono e cache de requisições HTTP.

- **TailwindCSS 4.2**  
  Framework de estilização utilitária, garantindo velocidade e consistência visual.

- **Radix UI + shadcn/ui**  
  Base de componentes acessíveis e estilizados, usados em toda a interface.

- **Leaflet + React Leaflet**  
  Biblioteca de mapas interativos utilizada para exibir localização e navegação geográfica.

- **Zod**  
  Validação de dados e schemas, especialmente em formulários.

- **OpenStreetMap / Nominatim / ViaCEP / IBGE / OpenWeatherMap**  
  Conjunto de serviços externos utilizados para clima, geolocalização, CEP, Estados, Cidades e Municípios e mapas.

---

## Serviços externos utilizados (APIs externas)

A aplicação WeatherMap – Frontend integra diversos serviços externos para fornecer dados de clima, localização, endereços, mapas e geocodificação. Cada API cumpre um papel específico dentro da experiência do usuário.

---

### **ViaCEP**
Utilizado para consultar endereços a partir de um CEP informado pelo usuário.  
Retorna logradouro, bairro, cidade e UF.

- **Endpoint base:**  
  https://viacep.com.br/ws/{CEP}/json/

- **Documentação:**  
  https://viacep.com.br/

---

### **IBGE – API de Localidades**
Fornece listas oficiais de Estados, Municípios e seus distritos no Brasil.  
É usada para popular seletores de Estado e Cidade quando o usuário opta por buscar clima por município.  
Para algumas localidades também fornece os distritos (bairros).

> Observação:  
> No caso específico da cidade do **Rio de Janeiro**, o IBGE **não retorna os bairros**, então a aplicação inclui uma lista interna para melhorar a experiência do usuário.

- **Estados:**  
  https://servicodados.ibge.gov.br/api/v1/localidades/estados

- **Municípios por estado:**  
  https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios

- **Distritos por município:**  
  https://servicodados.ibge.gov.br/api/v1/localidades/municipios/{ID}/distritos

- **Documentação:**  
  https://servicodados.ibge.gov.br/api/docs/localidades

---

### **OpenWeatherMap**
Serviço responsável por fornecer clima atual, previsão climática e, para o mapa, as camadas de cobertura de nuvens, precipitação, vento, temperatura e pressão atmosférica.

- **Clima atual:**  
  https://api.openweathermap.org/data/2.5/weather

- **Previsão:**  
  https://api.openweathermap.org/data/2.5/forecast

- **Camadas meteorológicas (tiles):**  
  https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={API_KEY}

- **Documentação:**  
  https://openweathermap.org/api

---

### **OpenStreetMap (OSM)**
Base cartográfica utilizada para exibir o mapa interativo no frontend.  
Permite visualizar a localização consultada, marcadores e navegação geográfica.

- **Camada de mapa (Tiles – API de mapas do OSM)**  
    Utilizada pelo Leaflet para renderizar o mapa:  
  https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

- **Site oficial:**  
  https://www.openstreetmap.org/

- **Política de uso dos tiles:**  
  https://operations.osmfoundation.org/policies/tiles/

---

### **Nominatim (OpenStreetMap)**
Serviço de geocodificação e busca de localidades.  
É utilizado para obter bairros, distritos e coordenadas a partir de uma cidade ou endereço pesquisado.

- **Busca (search):**  
  https://nominatim.openstreetmap.org/search?q={query}&format=json

- **Reverse geocoding:**  
  https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json

- **Documentação:**  
  https://nominatim.org/release-docs/latest/api/Overview/

---

## Licença

Projeto acadêmico desenvolvido com fins educacionais para a Pós-Graduação em **Desenvolvimento Full Stack** da **PUC-Rio**.
