// Life Path Compatibility Matrix - detailed compatibility scores between all numbers

export interface CompatibilityDetail {
  score: number; // 0-100
  level: 'excellent' | 'good' | 'moderate' | 'challenging';
  strengths: { ro: string[]; en: string[]; ru: string[] };
  challenges: { ro: string[]; en: string[]; ru: string[] };
  advice: { ro: string; en: string; ru: string };
}

type CompatibilityMatrix = Record<number, Record<number, CompatibilityDetail>>;

const createDetail = (
  score: number,
  level: 'excellent' | 'good' | 'moderate' | 'challenging',
  strengths: { ro: string[]; en: string[]; ru: string[] },
  challenges: { ro: string[]; en: string[]; ru: string[] },
  advice: { ro: string; en: string; ru: string }
): CompatibilityDetail => ({ score, level, strengths, challenges, advice });

export const LIFE_PATH_MATRIX: CompatibilityMatrix = {
  1: {
    1: createDetail(65, 'moderate',
      { ro: ['Ambiție comună', 'Respect reciproc'], en: ['Shared ambition', 'Mutual respect'], ru: ['Общие амбиции', 'Взаимное уважение'] },
      { ro: ['Competiție', 'Ego mare'], en: ['Competition', 'Big egos'], ru: ['Конкуренция', 'Большое эго'] },
      { ro: 'Învățați să colaborați, nu să competiți.', en: 'Learn to collaborate, not compete.', ru: 'Учитесь сотрудничать, а не конкурировать.' }
    ),
    2: createDetail(85, 'excellent',
      { ro: ['Echilibru perfect', 'Sprijin reciproc'], en: ['Perfect balance', 'Mutual support'], ru: ['Идеальный баланс', 'Взаимная поддержка'] },
      { ro: ['Dominare posibilă', 'Sensibilitate diferită'], en: ['Possible dominance', 'Different sensitivity'], ru: ['Возможное доминирование', 'Разная чувствительность'] },
      { ro: 'Lăsați 2 să aducă armonie în deciziile voastre.', en: 'Let 2 bring harmony to your decisions.', ru: 'Позвольте 2 привнести гармонию в ваши решения.' }
    ),
    3: createDetail(90, 'excellent',
      { ro: ['Energie creativă', 'Entuziasm comun'], en: ['Creative energy', 'Shared enthusiasm'], ru: ['Творческая энергия', 'Общий энтузиазм'] },
      { ro: ['Lipsa de practicism', 'Superficialitate'], en: ['Lack of practicality', 'Superficiality'], ru: ['Недостаток практичности', 'Поверхностность'] },
      { ro: 'Canalizați creativitatea în proiecte concrete.', en: 'Channel creativity into concrete projects.', ru: 'Направьте творчество в конкретные проекты.' }
    ),
    4: createDetail(55, 'moderate',
      { ro: ['Disciplină și inițiativă'], en: ['Discipline and initiative'], ru: ['Дисциплина и инициатива'] },
      { ro: ['Conflict între libertate și structură'], en: ['Conflict between freedom and structure'], ru: ['Конфликт между свободой и структурой'] },
      { ro: 'Respectați nevoile diferite ale celuilalt.', en: 'Respect each other\'s different needs.', ru: 'Уважайте разные потребности друг друга.' }
    ),
    5: createDetail(80, 'good',
      { ro: ['Aventură', 'Independență reciprocă'], en: ['Adventure', 'Mutual independence'], ru: ['Приключения', 'Взаимная независимость'] },
      { ro: ['Instabilitate', 'Lipsa de angajament'], en: ['Instability', 'Lack of commitment'], ru: ['Нестабильность', 'Отсутствие обязательств'] },
      { ro: 'Găsiți echilibrul între libertate și loialitate.', en: 'Find balance between freedom and loyalty.', ru: 'Найдите баланс между свободой и верностью.' }
    ),
    6: createDetail(70, 'good',
      { ro: ['Protecție și leadership'], en: ['Protection and leadership'], ru: ['Защита и лидерство'] },
      { ro: ['Control vs armonie'], en: ['Control vs harmony'], ru: ['Контроль vs гармония'] },
      { ro: 'Lăsați 6 să creeze căminul, 1 să conducă.', en: 'Let 6 create the home, 1 lead.', ru: 'Пусть 6 создаёт дом, а 1 ведёт.' }
    ),
    7: createDetail(60, 'moderate',
      { ro: ['Respect intelectual'], en: ['Intellectual respect'], ru: ['Интеллектуальное уважение'] },
      { ro: ['Comunicare diferită', 'Nevoi sociale opuse'], en: ['Different communication', 'Opposite social needs'], ru: ['Разная коммуникация', 'Противоположные социальные потребности'] },
      { ro: 'Oferiți-vă spațiu pentru a fi voi înșivă.', en: 'Give each other space to be yourselves.', ru: 'Дайте друг другу пространство быть собой.' }
    ),
    8: createDetail(75, 'good',
      { ro: ['Succes comun', 'Ambiție puternică'], en: ['Shared success', 'Strong ambition'], ru: ['Общий успех', 'Сильные амбиции'] },
      { ro: ['Lupta pentru putere'], en: ['Power struggle'], ru: ['Борьба за власть'] },
      { ro: 'Definiți roluri clare de lider în diferite domenii.', en: 'Define clear leadership roles in different areas.', ru: 'Определите чёткие роли лидера в разных областях.' }
    ),
    9: createDetail(65, 'moderate',
      { ro: ['Viziune largă', 'Energie dinamică'], en: ['Broad vision', 'Dynamic energy'], ru: ['Широкое видение', 'Динамичная энергия'] },
      { ro: ['Egoism vs altruism'], en: ['Selfishness vs altruism'], ru: ['Эгоизм vs альтруизм'] },
      { ro: 'Învățați să dați fără așteptări.', en: 'Learn to give without expectations.', ru: 'Учитесь давать без ожиданий.' }
    )
  },
  2: {
    1: createDetail(85, 'excellent',
      { ro: ['Echilibru perfect', 'Sprijin reciproc'], en: ['Perfect balance', 'Mutual support'], ru: ['Идеальный баланс', 'Взаимная поддержка'] },
      { ro: ['Dominare posibilă'], en: ['Possible dominance'], ru: ['Возможное доминирование'] },
      { ro: 'Comunicați deschis despre nevoi.', en: 'Communicate openly about needs.', ru: 'Открыто общайтесь о потребностях.' }
    ),
    2: createDetail(80, 'good',
      { ro: ['Empatie profundă', 'Înțelegere'], en: ['Deep empathy', 'Understanding'], ru: ['Глубокая эмпатия', 'Понимание'] },
      { ro: ['Pasivitate', 'Evitarea conflictelor'], en: ['Passivity', 'Conflict avoidance'], ru: ['Пассивность', 'Избегание конфликтов'] },
      { ro: 'Dezvoltați-vă assertivitatea împreună.', en: 'Develop assertiveness together.', ru: 'Развивайте уверенность вместе.' }
    ),
    3: createDetail(75, 'good',
      { ro: ['Creativitate și sensibilitate'], en: ['Creativity and sensitivity'], ru: ['Творчество и чувствительность'] },
      { ro: ['Superficialitate vs profunzime'], en: ['Superficiality vs depth'], ru: ['Поверхностность vs глубина'] },
      { ro: 'Combinați bucuria cu intimitatea.', en: 'Combine joy with intimacy.', ru: 'Сочетайте радость с близостью.' }
    ),
    4: createDetail(90, 'excellent',
      { ro: ['Stabilitate și armonie'], en: ['Stability and harmony'], ru: ['Стабильность и гармония'] },
      { ro: ['Rigiditate ocazională'], en: ['Occasional rigidity'], ru: ['Случайная ригидность'] },
      { ro: 'Construiți împreună un cămin solid.', en: 'Build a solid home together.', ru: 'Постройте вместе крепкий дом.' }
    ),
    5: createDetail(55, 'moderate',
      { ro: ['Echilibru între calm și aventură'], en: ['Balance between calm and adventure'], ru: ['Баланс между спокойствием и приключениями'] },
      { ro: ['Nevoi foarte diferite'], en: ['Very different needs'], ru: ['Очень разные потребности'] },
      { ro: 'Acceptați diferențele fără a încerca să vă schimbați.', en: 'Accept differences without trying to change each other.', ru: 'Принимайте различия, не пытаясь изменить друг друга.' }
    ),
    6: createDetail(95, 'excellent',
      { ro: ['Armonie perfectă', 'Devotament'], en: ['Perfect harmony', 'Devotion'], ru: ['Идеальная гармония', 'Преданность'] },
      { ro: ['Dependență emoțională'], en: ['Emotional dependency'], ru: ['Эмоциональная зависимость'] },
      { ro: 'Mențineți identitățile individuale.', en: 'Maintain individual identities.', ru: 'Сохраняйте индивидуальность.' }
    ),
    7: createDetail(70, 'good',
      { ro: ['Intuiție combinată'], en: ['Combined intuition'], ru: ['Совместная интуиция'] },
      { ro: ['Comunicare diferită'], en: ['Different communication'], ru: ['Разная коммуникация'] },
      { ro: 'Respectați nevoia de spațiu a lui 7.', en: 'Respect 7\'s need for space.', ru: 'Уважайте потребность 7 в пространстве.' }
    ),
    8: createDetail(65, 'moderate',
      { ro: ['Diplomație și putere'], en: ['Diplomacy and power'], ru: ['Дипломатия и сила'] },
      { ro: ['Dezechilibru de putere'], en: ['Power imbalance'], ru: ['Дисбаланс власти'] },
      { ro: 'Stabiliți echitate în decizii.', en: 'Establish equity in decisions.', ru: 'Установите справедливость в решениях.' }
    ),
    9: createDetail(85, 'excellent',
      { ro: ['Compasiune comună'], en: ['Shared compassion'], ru: ['Общее сострадание'] },
      { ro: ['Prea multă dăruire'], en: ['Too much giving'], ru: ['Слишком много отдачи'] },
      { ro: 'Învățați să primiți, nu doar să dați.', en: 'Learn to receive, not just give.', ru: 'Учитесь принимать, а не только давать.' }
    )
  },
  3: {
    1: createDetail(90, 'excellent',
      { ro: ['Energie creativă', 'Entuziasm'], en: ['Creative energy', 'Enthusiasm'], ru: ['Творческая энергия', 'Энтузиазм'] },
      { ro: ['Lipsa de practicism'], en: ['Lack of practicality'], ru: ['Недостаток практичности'] },
      { ro: 'Includeți planificare în visele voastre.', en: 'Include planning in your dreams.', ru: 'Включайте планирование в свои мечты.' }
    ),
    2: createDetail(75, 'good',
      { ro: ['Creativitate și sensibilitate'], en: ['Creativity and sensitivity'], ru: ['Творчество и чувствительность'] },
      { ro: ['Superficialitate vs profunzime'], en: ['Superficiality vs depth'], ru: ['Поверхностность vs глубина'] },
      { ro: 'Găsiți echilibrul între joacă și intimitate.', en: 'Find balance between play and intimacy.', ru: 'Найдите баланс между игрой и близостью.' }
    ),
    3: createDetail(70, 'good',
      { ro: ['Bucurie dublă', 'Creativitate'], en: ['Double joy', 'Creativity'], ru: ['Двойная радость', 'Творчество'] },
      { ro: ['Lipsa de focus', 'Risipire energie'], en: ['Lack of focus', 'Scattered energy'], ru: ['Отсутствие фокуса', 'Рассеянная энергия'] },
      { ro: 'Stabiliți obiective concrete împreună.', en: 'Set concrete goals together.', ru: 'Ставьте конкретные цели вместе.' }
    ),
    4: createDetail(50, 'challenging',
      { ro: ['Creativitate și structură'], en: ['Creativity and structure'], ru: ['Творчество и структура'] },
      { ro: ['Conflict între libertate și disciplină'], en: ['Freedom vs discipline conflict'], ru: ['Конфликт свободы и дисциплины'] },
      { ro: 'Respectați stilurile diferite de lucru.', en: 'Respect different working styles.', ru: 'Уважайте разные стили работы.' }
    ),
    5: createDetail(85, 'excellent',
      { ro: ['Aventură', 'Libertate', 'Bucurie'], en: ['Adventure', 'Freedom', 'Joy'], ru: ['Приключения', 'Свобода', 'Радость'] },
      { ro: ['Instabilitate', 'Lipsa de fundament'], en: ['Instability', 'Lack of foundation'], ru: ['Нестабильность', 'Отсутствие основы'] },
      { ro: 'Construiți o bază stabilă pentru aventuri.', en: 'Build a stable base for adventures.', ru: 'Создайте стабильную базу для приключений.' }
    ),
    6: createDetail(80, 'good',
      { ro: ['Creativitate și cămin'], en: ['Creativity and home'], ru: ['Творчество и дом'] },
      { ro: ['Responsabilitate vs libertate'], en: ['Responsibility vs freedom'], ru: ['Ответственность vs свобода'] },
      { ro: 'Creați un cămin creativ și armonios.', en: 'Create a creative and harmonious home.', ru: 'Создайте творческий и гармоничный дом.' }
    ),
    7: createDetail(55, 'moderate',
      { ro: ['Creativitate și profunzime'], en: ['Creativity and depth'], ru: ['Творчество и глубина'] },
      { ro: ['Extroversiune vs introversiune'], en: ['Extroversion vs introversion'], ru: ['Экстраверсия vs интроверсия'] },
      { ro: 'Găsiți activități care combină socialul cu singurătatea.', en: 'Find activities combining social with solitude.', ru: 'Найдите занятия, сочетающие общение и уединение.' }
    ),
    8: createDetail(60, 'moderate',
      { ro: ['Creativitate și succes'], en: ['Creativity and success'], ru: ['Творчество и успех'] },
      { ro: ['Priorități diferite'], en: ['Different priorities'], ru: ['Разные приоритеты'] },
      { ro: 'Combinați talentele pentru proiecte comune.', en: 'Combine talents for common projects.', ru: 'Объединяйте таланты для общих проектов.' }
    ),
    9: createDetail(90, 'excellent',
      { ro: ['Creativitate și viziune'], en: ['Creativity and vision'], ru: ['Творчество и видение'] },
      { ro: ['Idealism excesiv'], en: ['Excessive idealism'], ru: ['Чрезмерный идеализм'] },
      { ro: 'Transformați visele în acțiuni concrete.', en: 'Transform dreams into concrete actions.', ru: 'Превращайте мечты в конкретные действия.' }
    )
  },
  4: {
    1: createDetail(55, 'moderate', { ro: ['Disciplină și lider'], en: ['Discipline and leader'], ru: ['Дисциплина и лидер'] }, { ro: ['Conflict ritm'], en: ['Pace conflict'], ru: ['Конфликт темпа'] }, { ro: 'Respectați ritmurile diferite.', en: 'Respect different paces.', ru: 'Уважайте разные темпы.' }),
    2: createDetail(90, 'excellent', { ro: ['Stabilitate'], en: ['Stability'], ru: ['Стабильность'] }, { ro: ['Rigiditate'], en: ['Rigidity'], ru: ['Ригидность'] }, { ro: 'Flexibilitate în rutină.', en: 'Flexibility in routine.', ru: 'Гибкость в рутине.' }),
    3: createDetail(50, 'challenging', { ro: ['Structură și creativitate'], en: ['Structure and creativity'], ru: ['Структура и творчество'] }, { ro: ['Conflict stil'], en: ['Style conflict'], ru: ['Конфликт стилей'] }, { ro: 'Combinați talentele.', en: 'Combine talents.', ru: 'Объедините таланты.' }),
    4: createDetail(75, 'good', { ro: ['Soliditate'], en: ['Solidity'], ru: ['Солидность'] }, { ro: ['Prea multă rutină'], en: ['Too much routine'], ru: ['Слишком много рутины'] }, { ro: 'Introduceți noutăți.', en: 'Introduce novelties.', ru: 'Вводите новизну.' }),
    5: createDetail(40, 'challenging', { ro: ['Echilibru potențial'], en: ['Potential balance'], ru: ['Потенциальный баланс'] }, { ro: ['Libertate vs structură'], en: ['Freedom vs structure'], ru: ['Свобода vs структура'] }, { ro: 'Acceptați diferențele.', en: 'Accept differences.', ru: 'Принимайте различия.' }),
    6: createDetail(85, 'excellent', { ro: ['Familie și stabilitate'], en: ['Family and stability'], ru: ['Семья и стабильность'] }, { ro: ['Control'], en: ['Control'], ru: ['Контроль'] }, { ro: 'Echilibru în responsabilități.', en: 'Balance in responsibilities.', ru: 'Баланс в обязанностях.' }),
    7: createDetail(70, 'good', { ro: ['Respect pentru muncă'], en: ['Respect for work'], ru: ['Уважение к работе'] }, { ro: ['Comunicare'], en: ['Communication'], ru: ['Коммуникация'] }, { ro: 'Găsiți subiecte comune.', en: 'Find common topics.', ru: 'Найдите общие темы.' }),
    8: createDetail(90, 'excellent', { ro: ['Succes material'], en: ['Material success'], ru: ['Материальный успех'] }, { ro: ['Workaholic'], en: ['Workaholic'], ru: ['Трудоголизм'] }, { ro: 'Relaxați-vă împreună.', en: 'Relax together.', ru: 'Расслабляйтесь вместе.' }),
    9: createDetail(60, 'moderate', { ro: ['Practicism și viziune'], en: ['Practicality and vision'], ru: ['Практичность и видение'] }, { ro: ['Priorități'], en: ['Priorities'], ru: ['Приоритеты'] }, { ro: 'Găsiți scop comun.', en: 'Find common purpose.', ru: 'Найдите общую цель.' })
  },
  5: {
    1: createDetail(80, 'good', { ro: ['Aventură'], en: ['Adventure'], ru: ['Приключения'] }, { ro: ['Instabilitate'], en: ['Instability'], ru: ['Нестабильность'] }, { ro: 'Echilibru în angajamente.', en: 'Balance in commitments.', ru: 'Баланс в обязательствах.' }),
    2: createDetail(55, 'moderate', { ro: ['Varietate'], en: ['Variety'], ru: ['Разнообразие'] }, { ro: ['Nevoi diferite'], en: ['Different needs'], ru: ['Разные потребности'] }, { ro: 'Compromis în stil de viață.', en: 'Lifestyle compromise.', ru: 'Компромисс в образе жизни.' }),
    3: createDetail(85, 'excellent', { ro: ['Bucurie și libertate'], en: ['Joy and freedom'], ru: ['Радость и свобода'] }, { ro: ['Focus'], en: ['Focus'], ru: ['Фокус'] }, { ro: 'Direcție comună.', en: 'Common direction.', ru: 'Общее направление.' }),
    4: createDetail(40, 'challenging', { ro: ['Potențial echilibru'], en: ['Potential balance'], ru: ['Потенциальный баланс'] }, { ro: ['Conflict major'], en: ['Major conflict'], ru: ['Серьёзный конфликт'] }, { ro: 'Toleranță maximă.', en: 'Maximum tolerance.', ru: 'Максимальная терпимость.' }),
    5: createDetail(65, 'moderate', { ro: ['Entuziasm dublu'], en: ['Double enthusiasm'], ru: ['Двойной энтузиазм'] }, { ro: ['Instabilitate totală'], en: ['Total instability'], ru: ['Полная нестабильность'] }, { ro: 'Ancorați-vă reciproc.', en: 'Anchor each other.', ru: 'Якорите друг друга.' }),
    6: createDetail(60, 'moderate', { ro: ['Varietate în cămin'], en: ['Variety in home'], ru: ['Разнообразие в доме'] }, { ro: ['Libertate vs responsabilitate'], en: ['Freedom vs responsibility'], ru: ['Свобода vs ответственность'] }, { ro: 'Flexibilitate în așteptări.', en: 'Flexibility in expectations.', ru: 'Гибкость в ожиданиях.' }),
    7: createDetail(75, 'good', { ro: ['Curiozitate'], en: ['Curiosity'], ru: ['Любопытство'] }, { ro: ['Social vs solitar'], en: ['Social vs solitary'], ru: ['Социальное vs уединённое'] }, { ro: 'Respectați ritmurile.', en: 'Respect rhythms.', ru: 'Уважайте ритмы.' }),
    8: createDetail(55, 'moderate', { ro: ['Dinamism'], en: ['Dynamism'], ru: ['Динамизм'] }, { ro: ['Control vs libertate'], en: ['Control vs freedom'], ru: ['Контроль vs свобода'] }, { ro: 'Autonomie în proiecte.', en: 'Autonomy in projects.', ru: 'Автономия в проектах.' }),
    9: createDetail(80, 'good', { ro: ['Viziune largă'], en: ['Broad vision'], ru: ['Широкое видение'] }, { ro: ['Angajament'], en: ['Commitment'], ru: ['Обязательства'] }, { ro: 'Scopuri comune mari.', en: 'Big common goals.', ru: 'Большие общие цели.' })
  },
  6: {
    1: createDetail(70, 'good', { ro: ['Familie și lider'], en: ['Family and leader'], ru: ['Семья и лидер'] }, { ro: ['Control'], en: ['Control'], ru: ['Контроль'] }, { ro: 'Respectați rolurile.', en: 'Respect roles.', ru: 'Уважайте роли.' }),
    2: createDetail(95, 'excellent', { ro: ['Armonie perfectă'], en: ['Perfect harmony'], ru: ['Идеальная гармония'] }, { ro: ['Dependență'], en: ['Dependency'], ru: ['Зависимость'] }, { ro: 'Mențineți independența.', en: 'Maintain independence.', ru: 'Сохраняйте независимость.' }),
    3: createDetail(80, 'good', { ro: ['Cămin creativ'], en: ['Creative home'], ru: ['Творческий дом'] }, { ro: ['Responsabilitate'], en: ['Responsibility'], ru: ['Ответственность'] }, { ro: 'Echilibru joacă-muncă.', en: 'Play-work balance.', ru: 'Баланс игры и работы.' }),
    4: createDetail(85, 'excellent', { ro: ['Stabilitate'], en: ['Stability'], ru: ['Стабильность'] }, { ro: ['Rutină'], en: ['Routine'], ru: ['Рутина'] }, { ro: 'Varietate în stabilitate.', en: 'Variety in stability.', ru: 'Разнообразие в стабильности.' }),
    5: createDetail(60, 'moderate', { ro: ['Dinamică'], en: ['Dynamic'], ru: ['Динамика'] }, { ro: ['Libertate vs cămin'], en: ['Freedom vs home'], ru: ['Свобода vs дом'] }, { ro: 'Aventuri în familie.', en: 'Family adventures.', ru: 'Семейные приключения.' }),
    6: createDetail(85, 'excellent', { ro: ['Armonie'], en: ['Harmony'], ru: ['Гармония'] }, { ro: ['Supraprotecție'], en: ['Overprotection'], ru: ['Сверхзащита'] }, { ro: 'Limite sănătoase.', en: 'Healthy boundaries.', ru: 'Здоровые границы.' }),
    7: createDetail(65, 'moderate', { ro: ['Profunzime'], en: ['Depth'], ru: ['Глубина'] }, { ro: ['Comunicare'], en: ['Communication'], ru: ['Коммуникация'] }, { ro: 'Spațiu pentru 7.', en: 'Space for 7.', ru: 'Пространство для 7.' }),
    8: createDetail(80, 'good', { ro: ['Familie și succes'], en: ['Family and success'], ru: ['Семья и успех'] }, { ro: ['Timp'], en: ['Time'], ru: ['Время'] }, { ro: 'Prioritizați familia.', en: 'Prioritize family.', ru: 'Приоритет семье.' }),
    9: createDetail(90, 'excellent', { ro: ['Iubire universală'], en: ['Universal love'], ru: ['Универсальная любовь'] }, { ro: ['Prea mult altruism'], en: ['Too much altruism'], ru: ['Слишком много альтруизма'] }, { ro: 'Grija de sine.', en: 'Self-care.', ru: 'Забота о себе.' })
  },
  7: {
    1: createDetail(60, 'moderate', { ro: ['Respect'], en: ['Respect'], ru: ['Уважение'] }, { ro: ['Comunicare'], en: ['Communication'], ru: ['Коммуникация'] }, { ro: 'Conversații profunde.', en: 'Deep conversations.', ru: 'Глубокие разговоры.' }),
    2: createDetail(70, 'good', { ro: ['Intuiție'], en: ['Intuition'], ru: ['Интуиция'] }, { ro: ['Nevoi sociale'], en: ['Social needs'], ru: ['Социальные потребности'] }, { ro: 'Echilibru social.', en: 'Social balance.', ru: 'Социальный баланс.' }),
    3: createDetail(55, 'moderate', { ro: ['Creativitate'], en: ['Creativity'], ru: ['Творчество'] }, { ro: ['Stil'], en: ['Style'], ru: ['Стиль'] }, { ro: 'Toleranță pentru diferențe.', en: 'Tolerance for differences.', ru: 'Терпимость к различиям.' }),
    4: createDetail(70, 'good', { ro: ['Seriozitate'], en: ['Seriousness'], ru: ['Серьёзность'] }, { ro: ['Practicism'], en: ['Practicality'], ru: ['Практичность'] }, { ro: 'Combinați talentele.', en: 'Combine talents.', ru: 'Объедините таланты.' }),
    5: createDetail(75, 'good', { ro: ['Curiozitate'], en: ['Curiosity'], ru: ['Любопытство'] }, { ro: ['Ritm'], en: ['Pace'], ru: ['Темп'] }, { ro: 'Aventuri intelectuale.', en: 'Intellectual adventures.', ru: 'Интеллектуальные приключения.' }),
    6: createDetail(65, 'moderate', { ro: ['Profunzime'], en: ['Depth'], ru: ['Глубина'] }, { ro: ['Nevoi emoționale'], en: ['Emotional needs'], ru: ['Эмоциональные потребности'] }, { ro: 'Exprimați emoțiile.', en: 'Express emotions.', ru: 'Выражайте эмоции.' }),
    7: createDetail(80, 'good', { ro: ['Înțelepciune'], en: ['Wisdom'], ru: ['Мудрость'] }, { ro: ['Izolare'], en: ['Isolation'], ru: ['Изоляция'] }, { ro: 'Conectați-vă cu lumea.', en: 'Connect with the world.', ru: 'Связывайтесь с миром.' }),
    8: createDetail(65, 'moderate', { ro: ['Analiză'], en: ['Analysis'], ru: ['Анализ'] }, { ro: ['Priorități'], en: ['Priorities'], ru: ['Приоритеты'] }, { ro: 'Echilibru spirit-materie.', en: 'Spirit-matter balance.', ru: 'Баланс духа и материи.' }),
    9: createDetail(85, 'excellent', { ro: ['Spiritualitate'], en: ['Spirituality'], ru: ['Духовность'] }, { ro: ['Detașare'], en: ['Detachment'], ru: ['Отстранённость'] }, { ro: 'Combinați căutarea.', en: 'Combine the search.', ru: 'Объедините поиск.' })
  },
  8: {
    1: createDetail(75, 'good', { ro: ['Succes'], en: ['Success'], ru: ['Успех'] }, { ro: ['Putere'], en: ['Power'], ru: ['Власть'] }, { ro: 'Roluri clare.', en: 'Clear roles.', ru: 'Чёткие роли.' }),
    2: createDetail(65, 'moderate', { ro: ['Echilibru'], en: ['Balance'], ru: ['Баланс'] }, { ro: ['Dominare'], en: ['Dominance'], ru: ['Доминирование'] }, { ro: 'Parteneriat egal.', en: 'Equal partnership.', ru: 'Равное партнёрство.' }),
    3: createDetail(60, 'moderate', { ro: ['Creativitate'], en: ['Creativity'], ru: ['Творчество'] }, { ro: ['Priorități'], en: ['Priorities'], ru: ['Приоритеты'] }, { ro: 'Proiecte creative.', en: 'Creative projects.', ru: 'Творческие проекты.' }),
    4: createDetail(90, 'excellent', { ro: ['Succes material'], en: ['Material success'], ru: ['Материальный успех'] }, { ro: ['Muncă excesivă'], en: ['Overwork'], ru: ['Переработка'] }, { ro: 'Timp pentru relaxare.', en: 'Time for relaxation.', ru: 'Время для отдыха.' }),
    5: createDetail(55, 'moderate', { ro: ['Dinamism'], en: ['Dynamism'], ru: ['Динамизм'] }, { ro: ['Control'], en: ['Control'], ru: ['Контроль'] }, { ro: 'Libertate în structură.', en: 'Freedom within structure.', ru: 'Свобода в структуре.' }),
    6: createDetail(80, 'good', { ro: ['Securitate'], en: ['Security'], ru: ['Безопасность'] }, { ro: ['Timp'], en: ['Time'], ru: ['Время'] }, { ro: 'Prioritizați familia.', en: 'Prioritize family.', ru: 'Приоритет семье.' }),
    7: createDetail(65, 'moderate', { ro: ['Strategie'], en: ['Strategy'], ru: ['Стратегия'] }, { ro: ['Valori'], en: ['Values'], ru: ['Ценности'] }, { ro: 'Respectați spiritualitatea.', en: 'Respect spirituality.', ru: 'Уважайте духовность.' }),
    8: createDetail(70, 'good', { ro: ['Putere dublă'], en: ['Double power'], ru: ['Двойная сила'] }, { ro: ['Competiție'], en: ['Competition'], ru: ['Конкуренция'] }, { ro: 'Colaborare, nu competiție.', en: 'Collaboration, not competition.', ru: 'Сотрудничество, не конкуренция.' }),
    9: createDetail(75, 'good', { ro: ['Viziune și putere'], en: ['Vision and power'], ru: ['Видение и сила'] }, { ro: ['Materialism'], en: ['Materialism'], ru: ['Материализм'] }, { ro: 'Folosiți resursele pentru bine.', en: 'Use resources for good.', ru: 'Используйте ресурсы во благо.' })
  },
  9: {
    1: createDetail(65, 'moderate', { ro: ['Viziune'], en: ['Vision'], ru: ['Видение'] }, { ro: ['Egoism'], en: ['Selfishness'], ru: ['Эгоизм'] }, { ro: 'Echilibru personal-global.', en: 'Personal-global balance.', ru: 'Личностно-глобальный баланс.' }),
    2: createDetail(85, 'excellent', { ro: ['Compasiune'], en: ['Compassion'], ru: ['Сострадание'] }, { ro: ['Sacrificiu'], en: ['Sacrifice'], ru: ['Жертвенность'] }, { ro: 'Limite în dăruire.', en: 'Boundaries in giving.', ru: 'Границы в отдаче.' }),
    3: createDetail(90, 'excellent', { ro: ['Creativitate'], en: ['Creativity'], ru: ['Творчество'] }, { ro: ['Idealism'], en: ['Idealism'], ru: ['Идеализм'] }, { ro: 'Acțiuni concrete.', en: 'Concrete actions.', ru: 'Конкретные действия.' }),
    4: createDetail(60, 'moderate', { ro: ['Practicism'], en: ['Practicality'], ru: ['Практичность'] }, { ro: ['Priorități'], en: ['Priorities'], ru: ['Приоритеты'] }, { ro: 'Scop comun.', en: 'Common purpose.', ru: 'Общая цель.' }),
    5: createDetail(80, 'good', { ro: ['Libertate'], en: ['Freedom'], ru: ['Свобода'] }, { ro: ['Angajament'], en: ['Commitment'], ru: ['Обязательства'] }, { ro: 'Misiuni comune.', en: 'Common missions.', ru: 'Общие миссии.' }),
    6: createDetail(90, 'excellent', { ro: ['Iubire'], en: ['Love'], ru: ['Любовь'] }, { ro: ['Sacrificiu'], en: ['Sacrifice'], ru: ['Жертвенность'] }, { ro: 'Grija de sine.', en: 'Self-care.', ru: 'Забота о себе.' }),
    7: createDetail(85, 'excellent', { ro: ['Spiritualitate'], en: ['Spirituality'], ru: ['Духовность'] }, { ro: ['Detașare'], en: ['Detachment'], ru: ['Отстранённость'] }, { ro: 'Împărtășiți înțelepciunea.', en: 'Share wisdom.', ru: 'Делитесь мудростью.' }),
    8: createDetail(75, 'good', { ro: ['Putere și viziune'], en: ['Power and vision'], ru: ['Сила и видение'] }, { ro: ['Valori'], en: ['Values'], ru: ['Ценности'] }, { ro: 'Folosiți puterea pentru binele tuturor.', en: 'Use power for the greater good.', ru: 'Используйте силу для общего блага.' }),
    9: createDetail(80, 'good', { ro: ['Compasiune dublă'], en: ['Double compassion'], ru: ['Двойное сострадание'] }, { ro: ['Prea multă dăruire'], en: ['Too much giving'], ru: ['Слишком много отдачи'] }, { ro: 'Primiți, nu doar dați.', en: 'Receive, don\'t just give.', ru: 'Принимайте, а не только давайте.' })
  }
};

export const getCompatibilityDetail = (number1: number, number2: number): CompatibilityDetail => {
  // Reduce master numbers to base for matrix lookup
  const base1 = number1 > 9 ? (number1 === 11 ? 2 : number1 === 22 ? 4 : 6) : number1;
  const base2 = number2 > 9 ? (number2 === 11 ? 2 : number2 === 22 ? 4 : 6) : number2;
  
  // Master number bonus
  const masterBonus = ([11, 22, 33].includes(number1) || [11, 22, 33].includes(number2)) ? 5 : 0;
  
  const detail = LIFE_PATH_MATRIX[base1]?.[base2] || LIFE_PATH_MATRIX[1][1];
  
  return {
    ...detail,
    score: Math.min(100, detail.score + masterBonus)
  };
};

export const getAllCompatibilities = (lifePathNumber: number): Array<{ number: number; detail: CompatibilityDetail }> => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return numbers.map(num => ({
    number: num,
    detail: getCompatibilityDetail(lifePathNumber, num)
  }));
};
