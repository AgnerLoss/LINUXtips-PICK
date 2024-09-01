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

-> Os manifestos do kubernetes estão dividos em 06 partes. Deployments do app e do redis, que possuem as configurações de containers como quantidade de réplicas, portas, políticas, limites de recursos, entre outros. Services do app e redis, que são responsáveis pela exposição e comunicação dentro do cluster. Ingress que é responsável por gerenciar o acesso externo aos serviços dentro de um cluster. No nosso caso, utilizaremos o controlador de Ingress da NGINX. 


<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/kubernetes.png">

## 2.2 Vamos começar a orquestração ... me acompanhe nesta viagem!!!! 

-> Com os devidos arquivos devidamente configurados, partimos para criação do Cluster no ambiente da AWS através do eksctl e posterior deploy da aplicação e demais configurações diretamente no Cluster gerenciado pela AWS. O comando para configuração do cluster está descrito a seguir. (Obs: Comando deve ser configurado com a necessidade de cada usuário). O eksctl depende das configurações do AWS CLI - ([Doc](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)) 

### 2.3 Configuração do cluster na AWS: 

eksctl create cluster --name=eks-cluster --version=1.24 --region=us-west-1 --nodegroup-name=eks-cluster-nodegroup --node-type=t3.medium --nodes=2 --nodes-min=1 --nodes-max=3 --managed
<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/cluster.png">

### 2.4 Instalação do Ingress NGINX Controller

Na AWS, o ingress controller é exposto através de um Network Load Balancer (NLB). O comando para instalação é:

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/aws/deploy.yaml

### 2.5 Instalação do CERT-MANAGER

cert-manager  ([Doc](https://cert-manager.io/docs/))

No caso do projeto o comando é:

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.3/cert-manager.yaml
kubectl apply -f prod-issuer.yaml

### 2.6 Deploy da aplicação:

Comandos: 

Alias utilizado: k=kubectl

Kubectl apply app-deployment.yaml
Kubectl apply redis-deployment.yaml
Kubectl apply app-service.yaml
Kubectl apply redis-service.yaml
Kubectl apply ingress.yaml

<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/pods.png">
<img src="https://github.com/AgnerLoss/LINUXTIPS-PICK/blob/main/imagens/ingress.png">

O ingress ja está configurado para inserção do certificado SSL da Let's Encrypt ... 