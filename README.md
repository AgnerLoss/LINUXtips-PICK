# Desafio de Projeto Prático - PICK 2024_01

**Objetivo:** Criar uma aplicação de gestão de senhas utilizando Docker, Kubernetes, Helm, Kyverno, Cosign, Prometheus, apko e Melange para garantir a segurança, automação, e monitoramento contínuo da aplicação.

**Descrição do Projeto:**
Os alunos devem criar uma aplicação de gestão de senhas baseada no projeto [giropops-senhas](https://github.com/badtuxx/giropops-senhas). O objetivo é implementar e configurar a aplicação com as tecnologias listadas, garantindo altos padrões de segurança, automação, e monitoramento.

## **Início:**

<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/inicio.png">

Quarta-feira, 07 de agosto de 2024, 01:48...

## Infra "caseira" do projeto:

* Ubuntu 22.04
* cpu: Intel(R) Core(TM) i3-9100 CPU @ 3.60GHz
* memory: 28GiB
* VS Code ([Doc](https://code.visualstudio.com/docs/setup/linux))
* ZSH ([Doc](https://ohmyz.sh/))

08 de agosto a 28 de agosto de 2024 - Colocar o curso em dia para entregar o projeto com qualidade...

Quinta-feira, 29 de agosto de 2024, 22:18...

Começou a treta...

## 1. Containerização com Docker:


### 1.1 - "Containerizar" a aplicação de gestão de senhas. 

    Segue passo a passo das tarefas com respectivas documentações e imagens...###VAAAIIII

### 1.2 - Criar um Dockerfile eficiente e seguro.

* Docker ([Doc](https://docs.docker.com/))   
* O Dockerfile do projeto foi desenvolvido através de Multi-stage: "Uma das funções deste recurso é compilar aplicações em containers somente com os pacotes necessários.

* Foto ilustrativa comparando o tamanho de uma imagem "comum" com todos os pacotes e uma imagem multi-stage:
<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/multistage.png">

* Além do multi-stage a imagem base utilizada na construção do app foi produzida pela empresa Chainguard, que tem como pilar criar imagens de contêineres seguras que eliminando CVEs desde o início. Vale a pena dar uma conferida em: 
Chainguard ([Doc](https://www.chainguard.dev/)). Neste contexto, para verificação das imagens foi utilizado o Trivy que é scanner de segurança de código aberto mais popular, confiável, rápido e fácil de usar. Da uma olhada depois na documentação...Trivy ([Doc](https://trivy.dev/))

* Foto ilustrativa comparando as vulnerabilidades de uma imagem comum e a imagem base utlizada no projeto da Chainguard, através da ferramenta Trivy:
<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/chain.png">
        
### 1.3 - Publicar a imagem Docker em um repositório privado.

* Faz o pull ae... docker pull aguinho/giropops-senhas-pick:v1   

### 1.4 - Assinar as imagens Docker utilizando Cosign.  

* A assinatura de imagens é uma camada a mais de segurança na gestão de imagens e containers, no projeto foi utilizado o 
 Cosign: Uma Ferramenta de Segurança DevOps para Assinar e Verificar Imagens de Container. 
 Cosign ([Doc](https://docs.sigstore.dev/signing/quickstart/))

 Sábado, 31 de agosto de 2024, 20:28...
    Vamos começar a orquestrar essa bagaça...

## 2 - Orquestração do Kubernetes

Antes de iniciar...da aquela conferida na documentação neste sistema fantástico open-sorce...
 Kubernetes ([Doc](https://kubernetes.io/docs/home/))

### 2.1 Implementar a aplicação no Kubernetes.

* Para implementação dos Containers Kubernetes...foram utilizadas algumas tecnologias locais e em nuvem, que serão resumidas e expostas a seguir:

    -  Kind  ([Doc](https://kind.sigs.k8s.io/docs/user/quick-start/)) - O Kind é uma ferramenta gratuita que permite criar e gerenciar clusters Kubernetes locais usando contêineres Docker. O Kind foi desenvolvido principalmente para testar o Kubernetes, mas também pode ser usado para desenvolvimento local ou CI.

    - LocalStack  ([Doc](https://docs.localstack.cloud/overview/)) - O LocalStack é um emulador de serviço de nuvem que roda em um único contêiner no seu laptop ou no seu ambiente de CI. Com o LocalStack, você pode rodar seus aplicativos AWS ou Lambdas inteiramente na sua máquina local sem se conectar a um provedor de nuvem remoto!

    - eksctl  ([Doc](https://eksctl.io/))  - O eksctl é uma ferramenta de linha de comando (CLI) que permite criar e gerir clusters no Amazon Elastic Kubernetes Service (Amazon EKS). O Amazon EKS é um serviço gerenciado da Amazon Web Services (AWS) que permite executar o Kubernetes na nuvem da AWS e em datacenters locais. 

:love_you_gesture: Os manifestos do kubernetes estão dividos em 07 partes. Deployments do app e do redis, que possuem as configurações de containers como quantidade de réplicas, portas, políticas, limites de recursos, entre outros. Services do app e redis, que são responsáveis pela exposição e comunicação dentro do cluster. Ingress que é responsável por gerenciar o acesso externo aos serviços dentro de um cluster. No nosso caso, utilizaremos o controlador de Ingress da NGINX. Um ClusterIssuer responsável pelo certificado e um HPA ([Doc](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)) - O HorizontalPodAutoscaler atualiza automaticamente um recurso de carga de trabalho (como uma implantação ou conjunto com estado), com o objetivo de dimensionar automaticamente a carga de trabalho para atender à demanda.


<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/kubernetes.png">

## 2.2 Vamos começar a orquestração ... me acompanhe nesta viagem!!!! 

:love_you_gesture: Com os devidos arquivos devidamente configurados, partimos para criação do Cluster no ambiente da AWS através do eksctl e posterior deploy da aplicação e demais configurações diretamente no Cluster gerenciado pela AWS. O comando para configuração do cluster está descrito a seguir. (Obs: Comando deve ser configurado com a necessidade de cada usuário). O eksctl depende das configurações do AWS CLI - ([Doc](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)) 

### 2.3 Configuração do cluster na AWS: 

eksctl create cluster --name=eks-cluster --version=1.24 --region=us-west-1 --nodegroup-name=eks-cluster-nodegroup --node-type=t3.medium --nodes=2 --nodes-min=1 --nodes-max=3 --managed
<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/cluster.png">

### 2.4 Instalação do Ingress NGINX Controller

Na AWS, o ingress controller é exposto através de um Network Load Balancer (NLB). O comando para instalação é:

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/aws/deploy.yaml

### 2.5 Instalação do CERT-MANAGER

cert-manager  ([Doc](https://cert-manager.io/docs/))

No caso do projeto o comando é:

+ kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.3/cert-manager.yaml
+ kubectl apply -f prod-issuer.yaml

A certificadora utilizada no projeto foi a Let's Encripty. ([Doc](https://letsencrypt.org/pt-br/docs/) - A Let’s Encrypt é uma autoridade certificadora (AC) gratuita, automatizada e aberta que opera em prol do benefício público. É um serviço provido pela Internet Security Research Group (ISRG).
 
### 2.6 Deploy da aplicação:
    
Comandos: 

+ Alias utilizado: k=kubectl

+ Kubectl apply app-deployment.yaml
+ Kubectl apply redis-deployment.yaml
+ Kubectl apply app-service.yaml
+ Kubectl apply redis-service.yaml
+ Kubectl apply ingress.yaml
+ Kubectl apply giropops-hpa.yaml

<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/pods.png">
<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/ingress.png">

:love_you_gesture: O ingress ja está configurado para inserção do certificado SSL da Let's Encrypt ... 

## 3 - Automação de Deploy com Helm:

Helm  ([Doc](https://helm.sh/)) - Helm é um gerenciador de pacotes para Kubernetes. Ele usa 'gráficos' como formato de pacote, que é baseado em YAML. 

### 3.1 - Criar um Chart Helm para a aplicação. 

### 3.2 - Configurar valores dinâmicos para diferentes ambientes (dev, staging, prod).

    Abrimos um parênteses aqui para discutir e entender qual melhor prática na configuração dos ambientes em HELM:

    1  Arquivos Separados por Ambiente 
    
        Vantagens:

        Clareza e Organização: Cada ambiente tem seu próprio arquivo de configuração, facilitando a manutenção e a leitura, principalmente em projetos grandes.
        Menor Risco de Erros: Reduz o risco de aplicar configurações incorretas em ambientes diferentes, pois cada arquivo é dedicado a um ambiente específico.
        Facilidade de Uso em CI/CD: É comum em pipelines CI/CD, onde os arquivos de configuração são usados diretamente para cada etapa (dev, staging, prod).

        Desvantagens:

        Redundância: Pode haver duplicação de configurações comuns em vários ambientes, aumentando o esforço de manutenção.
        Complexidade na Sincronização: Se você precisar alterar um valor comum a todos os ambientes, será necessário alterar cada arquivo individualmente.


    2  Um Único Arquivo com Seções para Cada Ambiente

        Vantagens:

            Centralização: Todas as configurações estão em um único local, facilitando a visualização e a comparação entre ambientes.
            Menor Redundância: Configurações comuns podem ser definidas uma vez e reutilizadas, com apenas as diferenças especificadas para cada ambiente.
            Fácil Gerenciamento: Alterações que afetam todos os ambientes são feitas em um único lugar.

        Desvantagens:

            Possível Confusão: Pode ser mais difícil de gerenciar, especialmente se o arquivo ficar muito grande e complexo.
            Risco de Erros: Há o risco de aplicar a configuração errada a um ambiente se os valores não forem definidos corretamente ao executar os comandos.

        Prática Mais Comum:

            Projetos Pequenos/Médios: Geralmente, um único arquivo values.yaml com seções específicas para cada ambiente é usado, devido à simplicidade de manutenção e configuração.

            Projetos Grandes/Corporativos: É comum separar os arquivos por ambiente (values-dev.yaml, values-staging.yaml, values-prod.yaml) para melhorar a organização e reduzir o risco de erros, especialmente em equipes grandes ou com processos CI/CD complexos.

        Conclusão:
            Se você busca simplicidade e está em um projeto menor, um único arquivo pode ser suficiente. Para projetos maiores ou em um ambiente corporativo, separar os arquivos é a prática mais comum e segura.
   
### 3.3 - Gerar pacotes Helm e armazenar em um repositório Helm privado.

:love_you_gesture: https://agnerloss.github.io/helm-charts/

## 4 - Políticas de segurança do Kyverno:

### 1. Verificação de Imagens Assinadas (check-signed-images)
Propósito: Assegurar que apenas imagens assinadas podem ser usadas em Pods dentro do cluster.
Como funciona: A política verifica se a imagem utilizada no Pod foi assinada digitalmente, utilizando uma chave pública específica.
Chave Pública: A chave pública usada para verificar a assinatura foi incluída diretamente no arquivo da política.
Exemplo de uso: Verifica que as imagens são válidas e assinadas antes de permitir a criação do Pod.

### 2. Proibição de Execução como Root (disallow-run-as-root)
Propósito: Prevenir que containers sejam executados com privilégios de root, aumentando a segurança do cluster.
Como funciona: A política valida que todos os containers em um Pod estão configurados para não serem executados como root (runAsNonRoot: true).
Exemplo de uso: Garante que as workloads sejam executadas com o menor privilégio necessário, reduzindo o risco de escalonamento de privilégios.

### 3. Verificação de Variáveis de Ambiente Sensíveis (validate-env-vars)
Propósito: Garantir que variáveis de ambiente sensíveis, como senhas, sejam configuradas de maneira segura.
Como funciona: A política verifica se variáveis sensíveis, como PASSWORD, estão referenciando segredos (Secret) em vez de serem passadas diretamente como texto plano.
Exemplo de uso: Protege contra a exposição acidental de dados sensíveis em variáveis de ambiente.

### Como Aplicar e Gerenciar as Políticas:
As políticas podem ser aplicadas ao cluster usando kubectl apply -f <policy-file>.yaml.
Você pode listar as políticas aplicadas com kubectl get clusterpolicy e inspecionar cada uma com kubectl describe clusterpolicy <policy-name>.

### Monitoramento e Conformidade:
Use kubectl get clusterpolicyreport para ver relatórios sobre a aplicação das políticas e verificar a conformidade dos recursos no cluster.
Essas políticas ajudam a garantir a segurança e conformidade do ambiente Kubernetes, protegendo contra práticas inseguras e validando a integridade das imagens e configurações usadas no cluster.

 Sábado, 07 de setembro de 2024, 03:12...

## 5 - Monitoramento com Prometheus:

### Instalação:
    No caso do projeto utilizamos:
        git clone https://github.com/prometheus-operator/kube-prometheus
        cd kube-prometheus
        kubectl create -f manifests/setup
        kubectl apply -f manifests/

Kube-Prometheus  ([Doc](https://github.com/prometheus-operator/kube-prometheus)) - Este repositório coleta manifestos do Kubernetes, painéis do Grafana e regras do Prometheus combinados com documentação e scripts para fornecer monitoramento de cluster do Kubernetes de ponta a ponta e fácil de operar com o Prometheus usando o Prometheus Operator. 

### Implementação de métricas customizadas na aplicação:
   - A aplicação  está expondo métricas customizadas, e o Prometheus está coletando essas métricas corretamente. Configuramos para monitorar o número de requisições, uso de CPU, memória, e outros dados relevantes da aplicação.

### Configuração do Prometheus para coletar e visualizar métricas:
   - Ajustamos a configuração do Prometheus, resolvendo problemas na instalação via Helm.
   - Foi configurado para coletar métricas da sua aplicação `giropops-senhas` e integrá-las ao sistema de monitoramento.

### Criação de alertas baseados em métricas específicas da aplicação:
   - Criamos três alertas no Prometheus:
     - Alta quantidade de requisições: Para monitorar quando a carga de requisições ultrapassa um limite configurado.
     - Verificação de disponibilidade do servidor**: Para garantir que o servidor da aplicação está online e respondendo.
     - Monitoramento de CPU e memória: Para acompanhar o uso dos recursos da aplicação e gerar alertas em caso de uso excessivo.
### Integração com Grafana

    - Realizamos a integração com Grafana para gerar um dashboard customizável:

<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/grafana.png">

### Ferramenta de "stress teste" ...

    Durante todo projeto foi utilizada a ferramenta Locust - Ferramenta de teste de carga de código aberto. 
Locust ([Doc](https://locust.io/)) 

### "Fritando o container" 

<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/locust.png">
  
