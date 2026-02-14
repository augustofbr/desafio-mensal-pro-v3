<codebase_deep_analysis_agent>
    <initialization>
        <role>Analisador especialista em engenharia reversa e documentação técnica de sistemas</role>
        <objective>Analisar codebase e atualizar inteligentemente o arquivo CLAUDE.md existente</objective>
        <primary_deliverable>CLAUDE.md atualizado - guia absoluto para agentes de codificação</primary_deliverable>
        <output_consumer>Agente de codificação assumindo projeto sem conhecimento prévio</output_consumer>
    </initialization>

    <analysis_protocol>
        <phase_1_discovery>
            <repository_forensics>
                <instruction>Mapear estrutura completa de diretórios e arquivos</instruction>
                <instruction>Identificar padrões de nomenclatura e organização</instruction>
                <instruction>Detectar arquivos de configuração críticos (.env, config/*, settings.*)</instruction>
                <instruction>Localizar e analisar todos README, CONTRIBUTING, e documentação</instruction>
                <instruction>Examinar .gitignore para entender exclusões intencionais</instruction>
            </repository_forensics>
            
            <dependency_analysis>
                <instruction>Extrair todas dependências de package.json, requirements.txt, go.mod, Gemfile, pom.xml, etc</instruction>
                <instruction>Identificar versões exatas e ranges permitidos</instruction>
                <instruction>Detectar dependências de desenvolvimento vs produção</instruction>
                <instruction>Mapear dependências transitivas críticas</instruction>
                <instruction>Identificar vulnerabilidades conhecidas nas versões atuais</instruction>
            </dependency_analysis>
            
            <technology_stack_detection>
                <instruction>Identificar linguagens primárias e secundárias via extensões e sintaxe</instruction>
                <instruction>Detectar frameworks principais (React/Vue/Angular, Express/Django/Rails, etc)</instruction>
                <instruction>Mapear bibliotecas de teste utilizadas</instruction>
                <instruction>Identificar ferramentas de build e bundling</instruction>
                <instruction>Detectar containerização (Docker, Kubernetes configs)</instruction>
            </technology_stack_detection>
        </phase_1_discovery>

        <phase_2_architecture>
            <backend_architecture>
                <api_mapping>
                    <instruction>Documentar todos endpoints REST/GraphQL/gRPC</instruction>
                    <instruction>Extrair schemas de request/response</instruction>
                    <instruction>Identificar padrões de autenticação/autorização</instruction>
                    <instruction>Mapear rate limiting e throttling</instruction>
                    <instruction>Documentar versionamento de API</instruction>
                </api_mapping>
                
                <data_layer>
                    <instruction>Identificar bancos de dados utilizados (tipo, versão)</instruction>
                    <instruction>Extrair schemas/migrations completos</instruction>
                    <instruction>Mapear índices e otimizações</instruction>
                    <instruction>Documentar estratégias de cache (Redis, Memcached)</instruction>
                    <instruction>Identificar padrões de acesso a dados (ORM, raw SQL)</instruction>
                </data_layer>
                
                <business_logic>
                    <instruction>Mapear domínios e bounded contexts</instruction>
                    <instruction>Identificar padrões arquiteturais (MVC, DDD, CQRS, Event Sourcing)</instruction>
                    <instruction>Documentar fluxos críticos de negócio</instruction>
                    <instruction>Extrair regras de validação e processamento</instruction>
                    <instruction>Mapear jobs assíncronos e workers</instruction>
                </business_logic>
            </backend_architecture>
            
            <frontend_architecture>
                <component_structure>
                    <instruction>Mapear hierarquia completa de componentes</instruction>
                    <instruction>Identificar componentes reutilizáveis vs específicos</instruction>
                    <instruction>Documentar props, state e context usage</instruction>
                    <instruction>Extrair padrões de styling (CSS modules, styled-components, Tailwind)</instruction>
                </component_structure>
                
                <state_management>
                    <instruction>Identificar solução de estado global (Redux, MobX, Zustand, Context)</instruction>
                    <instruction>Mapear stores, actions, reducers</instruction>
                    <instruction>Documentar side effects e middleware</instruction>
                    <instruction>Identificar padrões de hidratação/persistência</instruction>
                </state_management>
                
                <routing_navigation>
                    <instruction>Mapear todas rotas e navegação</instruction>
                    <instruction>Identificar guards e proteção de rotas</instruction>
                    <instruction>Documentar deep linking e parametrização</instruction>
                    <instruction>Mapear lazy loading e code splitting</instruction>
                </routing_navigation>
            </frontend_architecture>
        </phase_2_architecture>

        <phase_3_integrations>
            <external_services>
                <instruction>Catalogar todas APIs externas consumidas</instruction>
                <instruction>Documentar métodos de autenticação para cada serviço</instruction>
                <instruction>Mapear limites de rate e quotas</instruction>
                <instruction>Identificar fallbacks e circuit breakers</instruction>
                <instruction>Extrair configurações de timeout e retry</instruction>
            </external_services>
            
            <messaging_events>
                <instruction>Identificar sistemas de mensageria (RabbitMQ, Kafka, SQS)</instruction>
                <instruction>Mapear tópicos, filas e exchanges</instruction>
                <instruction>Documentar schemas de mensagens</instruction>
                <instruction>Identificar padrões de pub/sub implementados</instruction>
                <instruction>Mapear garantias de entrega e ordenação</instruction>
            </messaging_events>
            
            <authentication_authorization>
                <instruction>Documentar provider de autenticação (OAuth, SAML, custom)</instruction>
                <instruction>Mapear fluxos de login/logout completos</instruction>
                <instruction>Extrair políticas de autorização e RBAC</instruction>
                <instruction>Identificar tokens e sessões (JWT, cookies)</instruction>
                <instruction>Documentar refresh token strategy</instruction>
            </authentication_authorization>
        </phase_3_integrations>

        <phase_4_development_operations>
            <ci_cd_pipeline>
                <instruction>Analisar workflows GitHub Actions, GitLab CI, Jenkins</instruction>
                <instruction>Documentar stages de build, test, deploy</instruction>
                <instruction>Identificar ambientes (dev, staging, prod)</instruction>
                <instruction>Mapear secrets e variáveis de ambiente por ambiente</instruction>
                <instruction>Documentar estratégias de deployment (blue-green, canary)</instruction>
            </ci_cd_pipeline>
            
            <testing_strategy>
                <instruction>Catalogar tipos de teste (unit, integration, e2e)</instruction>
                <instruction>Calcular cobertura atual de testes</instruction>
                <instruction>Identificar fixtures e mocks principais</instruction>
                <instruction>Documentar comandos de teste e configurações</instruction>
                <instruction>Mapear testes de performance e carga</instruction>
            </testing_strategy>
            
            <monitoring_observability>
                <instruction>Identificar ferramentas de APM (DataDog, New Relic, etc)</instruction>
                <instruction>Mapear métricas customizadas e dashboards</instruction>
                <instruction>Documentar estratégia de logging e agregação</instruction>
                <instruction>Identificar alertas configurados e SLAs</instruction>
                <instruction>Mapear distributed tracing setup</instruction>
            </monitoring_observability>
        </phase_4_development_operations>

        <phase_5_code_quality>
            <static_analysis>
                <instruction>Executar análise de complexidade ciclomática</instruction>
                <instruction>Identificar code smells e anti-patterns</instruction>
                <instruction>Calcular dívida técnica acumulada</instruction>
                <instruction>Mapear duplicação de código</instruction>
                <instruction>Documentar violações de princípios SOLID</instruction>
            </static_analysis>
            
            <conventions_standards>
                <instruction>Extrair coding standards do projeto (linters, formatters)</instruction>
                <instruction>Documentar convenções de nomenclatura</instruction>
                <instruction>Identificar padrões de comentários e documentação</instruction>
                <instruction>Mapear estrutura de commits e branching strategy</instruction>
                <instruction>Documentar code review process</instruction>
            </conventions_standards>
        </phase_5_code_quality>

        <phase_6_business_context>
            <domain_knowledge>
                <instruction>Extrair glossário de termos de negócio do código</instruction>
                <instruction>Mapear entidades principais e seus relacionamentos</instruction>
                <instruction>Documentar regras de negócio críticas</instruction>
                <instruction>Identificar integrações com sistemas legados</instruction>
                <instruction>Mapear compliance e regulamentações implementadas</instruction>
            </domain_knowledge>
            
            <performance_characteristics>
                <instruction>Documentar SLAs e SLOs atuais</instruction>
                <instruction>Identificar gargalos conhecidos</instruction>
                <instruction>Mapear otimizações implementadas</instruction>
                <instruction>Documentar limites de escala testados</instruction>
                <instruction>Identificar áreas de melhoria prioritárias</instruction>
            </performance_characteristics>
        </phase_6_business_context>
    </analysis_protocol>

    <claude_md_integration>
        <existing_file_analysis>
            <instruction>Primeiro, ler e analisar o arquivo CLAUDE.md existente</instruction>
            <instruction>Identificar estrutura atual e seções já documentadas</instruction>
            <instruction>Mapear lacunas de informação e áreas desatualizadas</instruction>
            <instruction>Avaliar qualidade e profundidade do conteúdo existente</instruction>
            <instruction>Preservar informações valiosas já documentadas</instruction>
        </existing_file_analysis>
        
        <comparison_protocol>
            <for_each_section>
                <compare>Conteúdo existente vs descobertas da análise</compare>
                <evaluate>
                    <richness>Nova informação é mais detalhada?</richness>
                    <accuracy>Nova informação é mais precisa?</accuracy>
                    <completeness>Nova informação cobre mais casos?</completeness>
                    <structure>Nova organização é mais clara?</structure>
                </evaluate>
                <decision_matrix>
                    <if condition="new_info_superior">Substituir seção completamente</if>
                    <if condition="both_valuable">Fazer merge inteligente</if>
                    <if condition="existing_better">Manter versão atual</if>
                    <if condition="complementary">Expandir com novas informações</if>
                </decision_matrix>
            </for_each_section>
        </comparison_protocol>
        
        <merge_strategy>
            <preserve>
                <instruction>Manter exemplos de código testados e funcionais</instruction>
                <instruction>Preservar decisões arquiteturais documentadas com contexto</instruction>
                <instruction>Reter troubleshooting e soluções já validadas</instruction>
                <instruction>Conservar links e referências externas verificadas</instruction>
            </preserve>
            
            <enhance>
                <instruction>Adicionar detalhes técnicos descobertos na análise</instruction>
                <instruction>Incluir padrões e convenções identificados</instruction>
                <instruction>Expandir documentação de APIs com exemplos reais</instruction>
                <instruction>Enriquecer com diagramas e visualizações</instruction>
            </enhance>
            
            <restructure_if_needed>
                <instruction>Reorganizar seções para melhor fluxo de leitura</instruction>
                <instruction>Criar subseções para tópicos complexos</instruction>
                <instruction>Adicionar índice navegável se não existir</instruction>
                <instruction>Implementar cross-references entre seções relacionadas</instruction>
            </restructure_if_needed>
        </merge_strategy>
    </claude_md_integration>
    
    <output_format>
        <single_deliverable>
            <file>CLAUDE.md</file>
            <description>Guia absoluto atualizado para o agente de codificação</description>
            
            <update_protocol>
                <step_1>Analisar CLAUDE.md existente completamente</step_1>
                <step_2>Executar análise profunda do codebase</step_2>
                <step_3>Comparar informações seção por seção</step_3>
                <step_4>Aplicar estratégia de merge apropriada</step_4>
                <step_5>Validar consistência e completude final</step_5>
                <step_6>Gerar CLAUDE.md atualizado e enriquecido</step_6>
            </update_protocol>
            
            <quality_criteria>
                <completeness>Todas as descobertas relevantes foram incorporadas</completeness>
                <preservation>Nenhuma informação valiosa foi perdida</preservation>
                <organization>Estrutura está mais clara e navegável</organization>
                <actionability>Instruções são específicas e executáveis</actionability>
                <context>Agente novo tem tudo que precisa para ser produtivo</context>
            </quality_criteria>
        </single_deliverable>
    </output_format>

    <execution_instructions>
        <for_llm>
            <instruction>Execute cada fase sequencialmente, não pule etapas</instruction>
            <instruction>Ao encontrar código crítico, inclua o snippet completo na análise</instruction>
            <instruction>Priorize clareza sobre brevidade - o novo desenvolvedor precisa entender tudo</instruction>
            <instruction>Use exemplos reais do codebase, não genéricos</instruction>
            <instruction>Sinalize explicitamente áreas que precisam de refatoração urgente</instruction>
            <instruction>O ÚNICO output deve ser o arquivo CLAUDE.md atualizado</instruction>
        </for_llm>
        
        <claude_md_update_rules>
            <rule>Só atualize seções se a nova informação for superior à existente</rule>
            <rule>Preserve conhecimento institucional já documentado</rule>
            <rule>Mantenha o tom e estilo consistente com o documento original</rule>
            <rule>Adicione novas seções apenas se descobrir aspectos não cobertos</rule>
            <rule>Use comentários para indicar mudanças significativas quando apropriado</rule>
        </claude_md_update_rules>
        
        <quality_checklist>
            <item>CLAUDE.md original foi completamente analisado?</item>
            <item>Todas informações valiosas existentes foram preservadas?</item>
            <item>Novas descobertas foram integradas apropriadamente?</item>
            <item>Estrutura final está mais clara e completa?</item>
            <item>Novo dev consegue começar a codar imediatamente com este guia?</item>
        </quality_checklist>
    </execution_instructions>
</codebase_deep_analysis_agent>