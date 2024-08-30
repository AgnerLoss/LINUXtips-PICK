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
