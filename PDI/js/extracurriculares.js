// Manages extracurricular course progress state across pages.
(() => {
    const STORAGE_KEY = 'pdi-extracurricular-progress-v1';

    const COURSES = Object.freeze([
        {
            id: 'lideranca-colaborativa',
            title: 'Liderança Colaborativa',
            description: 'Práticas de liderança adaptativa para conduzir times híbridos com segurança psicológica.',
            focus: 'Soft skills',
            hours: '8h',
            impact: 'Aplicação imediata em projetos acadêmicos e profissionais.'
        },
        {
            id: 'metodologias-ageis',
            title: 'Metodologias Ágeis Aplicadas',
            description: 'Introdução a Scrum, Kanban e OKRs para organizar entregas rápidas e sustentáveis.',
            focus: 'Gestão ágil',
            hours: '10h',
            impact: 'Capacita a assumir papéis de facilitador em squads multidisciplinares.'
        },
        {
            id: 'comunicacao-executiva',
            title: 'Comunicação Executiva',
            description: 'Técnicas de storytelling, pitch e feedback para reuniões estratégicas.',
            focus: 'Comunicação',
            hours: '6h',
            impact: 'Amplia sua visibilidade em apresentações com clientes e liderança.'
        },
        {
            id: 'data-literacy',
            title: 'Data Literacy Essentials',
            description: 'Fundamentos de análise de dados, dashboards e tomada de decisão guiada por métricas.',
            focus: 'Dados',
            hours: '8h',
            impact: 'Favorece decisões baseadas em evidências em qualquer área funcional.'
        },
        {
            id: 'ux-thinking',
            title: 'UX Thinking & Pesquisa',
            description: 'Processos de pesquisa, personas e prototipagem ágil focados na experiência do usuário.',
            focus: 'Produto digital',
            hours: '9h',
            impact: 'Melhora a empatia com usuários e gera entregas centradas em valor.'
        },
        {
            id: 'ingles-tecnico',
            title: 'Inglês Técnico para TI',
            description: 'Vocabulário profissional, reuniões globais e escrita de documentação em inglês.',
            focus: 'Idiomas',
            hours: '12h',
            impact: 'Aumenta a competitividade em processos seletivos internacionais.'
        },
        {
            id: 'empreendedorismo-digital',
            title: 'Empreendedorismo Digital',
            description: 'Ferramentas para validar ideias, estruturar MVPs e planejar monetização.',
            focus: 'Negócios',
            hours: '7h',
            impact: 'Estimula visão de negócios e inovação em projetos próprios ou corporativos.'
        },
        {
            id: 'cloud-essentials',
            title: 'Cloud Essentials',
            description: 'Fundamentos de serviços em nuvem, segurança e gerenciamento de custos.',
            focus: 'Tecnologia',
            hours: '10h',
            impact: 'Prepara para certificações básicas e atuação em ambientes multicloud.'
        }
    ]);

    const totalCourses = COURSES.length;

    const STAGES = [
        {
            min: 0,
            text: 'Seu perfil de carreira está no ponto de partida. Complete cursos extracurriculares para que possamos indicar suas forças.'
        },
        {
            min: 1,
            text: 'Com {count} de {total} trilhas concluídas, você demonstra iniciativa e amplia sua base de competências essenciais.'
        },
        {
            min: 3,
            text: 'Seu perfil já combina conhecimento técnico e comportamental. Continue avançando para consolidar posicionamento estratégico.'
        },
        {
            min: 5,
            text: 'Você evidencia consistência em aprendizagem contínua e postura de liderança em projetos colaborativos.'
        },
        {
            min: 7,
            text: 'Quase lá! Seu perfil está praticamente completo, exibindo maturidade para desafios complexos.'
        },
        {
            min: totalCourses,
            text: 'Parabéns! Todas as {total} trilhas foram concluídas e seu perfil destaca alta prontidão para oportunidades de alto impacto.'
        }
    ];

    const loadCompletedIds = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            const validIds = new Set(COURSES.map((course) => course.id));
            return parsed.filter((id) => validIds.has(id));
        } catch (error) {
            console.warn('Não foi possível carregar o progresso extracurricular.', error);
            return [];
        }
    };

    const saveCompletedIds = (ids) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch (error) {
            console.warn('Não foi possível salvar o progresso extracurricular.', error);
        }
    };

    const formatStageText = (count) => {
        const total = totalCourses;
        const stage = STAGES.reduce((acc, current) => (count >= current.min ? current : acc), STAGES[0]);
        return stage.text.replace(/\{count\}/g, String(count)).replace(/\{total\}/g, String(total));
    };

    const ensureProgressTracks = () => {
        const tracks = document.querySelectorAll('[data-progress-track]');
        tracks.forEach((track) => {
            const existingNodes = track.querySelectorAll('[data-progress-node]').length;
            if (existingNodes === totalCourses) return;

            track.innerHTML = '';
            for (let index = 0; index < totalCourses; index += 1) {
                const node = document.createElement('span');
                node.className = 'progress-node';
                node.dataset.progressNode = 'true';
                node.dataset.index = String(index);
                node.setAttribute('aria-hidden', 'true');
                track.appendChild(node);
            }
        });
    };

    const refreshProgressUI = (completedSet) => {
        const completedCount = completedSet.size;
        const total = totalCourses;

        document.querySelectorAll('[data-progress-node]').forEach((node) => {
            const index = Number(node.dataset.index || '0');
            node.classList.toggle('is-completed', index < completedCount);
        });

        document.querySelectorAll('[data-progress-count]').forEach((element) => {
            element.textContent = `${completedCount} / ${total}`;
        });

        document.querySelectorAll('[data-progress-percent]').forEach((element) => {
            const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
            element.textContent = `${percent}%`;
        });

        document.querySelectorAll('[data-progress-meter]').forEach((meter) => {
            meter.setAttribute('aria-valuenow', String(completedCount));
            meter.setAttribute('aria-valuemax', String(total));
            meter.setAttribute('aria-valuetext', `${completedCount} de ${total} cursos concluídos`);
        });

        const summaryText = formatStageText(completedCount);
        document.querySelectorAll('[data-career-summary]').forEach((element) => {
            element.textContent = summaryText;
        });
    };

    const renderCourses = (completedSet) => {
        const list = document.querySelector('[data-course-list]');
        if (!list) return;

        list.innerHTML = '';

        COURSES.forEach((course, index) => {
            const card = document.createElement('article');
            card.className = 'course-card';
            card.dataset.courseId = course.id;

            const header = document.createElement('header');
            header.className = 'course-card__header';

            const indexBadge = document.createElement('span');
            indexBadge.className = 'course-card__index';
            indexBadge.textContent = `#${String(index + 1).padStart(2, '0')}`;

            const infoWrapper = document.createElement('div');
            infoWrapper.className = 'course-card__info';

            const title = document.createElement('h3');
            title.textContent = course.title;

            const description = document.createElement('p');
            description.textContent = course.description;

            infoWrapper.appendChild(title);
            infoWrapper.appendChild(description);
            header.appendChild(indexBadge);
            header.appendChild(infoWrapper);

            const infoList = document.createElement('ul');
            infoList.className = 'course-card__meta';

            const focusItem = document.createElement('li');
            focusItem.textContent = `Foco: ${course.focus}`;

            const hoursItem = document.createElement('li');
            hoursItem.textContent = `Carga horária: ${course.hours}`;

            const impactItem = document.createElement('li');
            impactItem.textContent = `Impacto: ${course.impact}`;

            infoList.appendChild(focusItem);
            infoList.appendChild(hoursItem);
            infoList.appendChild(impactItem);

            const control = document.createElement('label');
            control.className = 'course-card__control';
            control.setAttribute('for', `course-${course.id}`);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `course-${course.id}`;
            checkbox.value = course.id;
            checkbox.checked = completedSet.has(course.id);
            checkbox.dataset.courseCheckbox = 'true';
            checkbox.setAttribute('aria-label', `Marcar ${course.title} como concluído`);

            const controlText = document.createElement('span');
            controlText.textContent = 'Marcar como concluído';

            control.appendChild(checkbox);
            control.appendChild(controlText);

            checkbox.addEventListener('change', (event) => {
                const isChecked = event.currentTarget instanceof HTMLInputElement ? event.currentTarget.checked : false;
                if (isChecked) {
                    completedSet.add(course.id);
                } else {
                    completedSet.delete(course.id);
                }
                saveCompletedIds(Array.from(completedSet));
                card.classList.toggle('is-completed', isChecked);
                refreshProgressUI(completedSet);
            });

            if (checkbox.checked) {
                card.classList.add('is-completed');
            }

            card.appendChild(header);
            card.appendChild(infoList);
            card.appendChild(control);

            list.appendChild(card);
        });
    };

    const init = () => {
        const completedSet = new Set(loadCompletedIds());
        ensureProgressTracks();
        renderCourses(completedSet);
        ensureProgressTracks();
        refreshProgressUI(completedSet);
    };

    document.addEventListener('DOMContentLoaded', init);
})();