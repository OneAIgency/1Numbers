export type Language = "ro" | "en" | "ru";

export const translations = {
  ro: {
    // Header
    title: "Numerologia",
    subtitle: "Descoperă secretele ascunse în numerele tale personale",
    
    // Form
    formTitle: "Calculează Numerele Tale",
    formSubtitle: "Introdu datele tale pentru a descoperi profilul numerologic complet",
    fullNameLabel: "Numele complet la naștere",
    fullNamePlaceholder: "Ex: Maria Elena Popescu",
    fullNameHint: "Folosește numele complet așa cum apare în certificatul de naștere",
    birthDateLabel: "Data nașterii",
    birthDatePlaceholder: "Selectează data nașterii",
    calculateButton: "Descoperă Numerele Tale",
    
    // Results
    profileTitle: "Profilul Tău Numerologic",
    profileSubtitle: "Descoperă semnificația ascunsă a numerelor tale personale",
    calculateAgain: "Calculează din nou",
    
    // Number titles
    lifePathTitle: "Numărul Drumului Vieții",
    lifePathDesc: "Cel mai important număr în numerologie. Reprezintă calea ta de viață, lecțiile de învățat și scopul existenței tale.",
    destinyTitle: "Numărul Destinului",
    destinyDesc: "Derivat din numele tău complet, arată talentele și abilitățile pe care le ai pentru a-ți îndeplini misiunea de viață.",
    soulUrgeTitle: "Numărul Sufletului",
    soulUrgeDesc: "Calculat din vocalele numelui, relevă dorințele tale interioare și motivațiile cele mai profunde.",
    personalityTitle: "Numărul Personalității",
    personalityDesc: "Derivat din consoanele numelui, arată cum te percep alții și prima impresie pe care o lași.",
    personalYearTitle: "Anul Personal",
    personalYearDesc: "Energia care te ghidează în acest an. Fiecare an personal aduce oportunități și provocări unice.",
    
    // Info cards
    infoLifePath: "Misiunea ta în această viață",
    infoDestiny: "Talentele și abilitățile tale",
    infoPersonalYear: "Energia anului curent",
    
    // Navigation
    viewGuide: "Ghid",
    viewCompatibility: "Compatibilitate",
    backToCalculator: "Înapoi la Calculator",
    profile: "Profil",
    myProfile: "Profilul Meu",
    login: "Autentificare",
    predictions: "Previziuni",
    tools: "Instrumente",
    tutorials: "Tutoriale",
    courses: "Cursuri",
    articles: "Articole",
    faq: "Întrebări Frecvente",
    back: "Înapoi",
    
    // NotFound page
    notFound: {
      title: "Pagina nu a fost găsită",
      description: "Pagina pe care o căutați nu există sau a fost mutată.",
      backHome: "Înapoi la Pagina Principală"
    },
    
    // Profile page
    profilePageTitle: "Profilul Meu Numerologic",
    profilePageSubtitle: "Completează datele tale personale pentru a accesa rapid calculele numerologice",
    profileSaved: "Profil salvat cu succes!",
    profileDeleted: "Profil șters cu succes!",
    saveProfile: "Salvează Profilul",
    deleteProfile: "Șterge Profilul",
    editProfile: "Editează Profilul",
    createProfile: "Creează Profilul",
    profileNotCreated: "Nu ai creat încă un profil. Completează datele de mai jos.",
    birthTimeLabel: "Ora nașterii (opțional)",
    birthTimePlaceholder: "HH:MM",
    birthTimeHint: "Ora nașterii poate oferi detalii suplimentare în numerologie",
    birthPlaceLabel: "Locul nașterii (opțional)",
    birthPlacePlaceholder: "Ex: București, România",
    birthPlaceHint: "Locul nașterii poate influența calculele numerologice",
    useProfileData: "Folosește datele din profil",
    profileRequired: "Te rugăm să creezi un profil pentru a folosi această funcție",
    cancel: "Anulează",
    error: "Eroare",
    // Multiple profiles
    switchProfile: "Schimbă Profilul",
    activeProfile: "Profil Activ",
    allProfiles: "Toate Profilele",
    createNewProfile: "Creează Profil Nou",
    selectProfile: "Selectează Profil",
    profileSwitched: "Profil schimbat cu succes!",
    switchProfileError: "Eroare la schimbarea profilului",
    noProfiles: "Nu ai încă niciun profil",
    profileComparison: "Comparare Profile",
    compareProfiles: "Compară Profilele",
    selectProfilesToCompare: "Selectează profilele pentru comparare",
    
    // Compatibility page
    compatibilityLabel: "Compatibilitate Numerologică",
    compatibilityTitle: "Compatibilitatea Perechii",
    compatibilitySubtitle: "Descoperă armonia numerologică dintre două suflete și cum se completează energiile voastre",
    person1: "Prima Persoană",
    person2: "A Doua Persoană",
    calculateCompatibility: "Calculează Compatibilitatea",
    overallCompatibility: "Compatibilitate Generală",
    weight: "Pondere",
    tryAnotherPair: "Încearcă altă pereche",
    compatibilityLevels: {
      excellent: "Excelentă",
      good: "Bună",
      moderate: "Moderată",
      challenging: "Provocatoare"
    },
    compatibilityDescriptions: {
      excellent: "Aveți o conexiune numerologică extraordinară! Energiile voastre se completează perfect, creând o armonie naturală.",
      good: "Compatibilitate solidă cu potențial mare. Cu puțin efort, puteți construi o relație foarte armonioasă.",
      moderate: "Compatibilitate medie cu zone de creștere. Diferențele voastre pot fi complementare dacă sunt înțelese.",
      challenging: "O relație care necesită muncă și înțelegere. Provocările pot deveni oportunități de creștere spirituală."
    },
    compatibility: {
      relationshipType: "Tipul Relației",
      relationshipDynamics: "Dinamica Relației",
      strengths: "Puncte Forte",
      challenges: "Provocări",
      recommendations: "Recomandări",
      dynamics: "Dinamica",
      communication: "Comunicare",
      emotional: "Emoțional",
      practical: "Practic",
      multiPersonComparison: "Comparație Multi-Persoană",
      people: "persoane",
      averageCompatibility: "Compatibilitate Medie",
      groupHarmony: "Armonie Grup",
      strongestPairs: "Perechi Cele Mai Puternice",
      weakestPairs: "Perechi Care Necesită Atenție",
      groupRecommendations: "Recomandări pentru Grup"
    },
    
    // Guide page
    guideLabel: "Ghid Complet",
    guideTitle: "Semnificația Numerelor",
    guideSubtitle: "Explorează în profunzime semnificația fiecărui număr în numerologie și descoperă cum influențează viața ta",
    coreNumbersTitle: "Numerele Fundamentale (1-9)",
    coreNumbersDesc: "Aceste nouă numere formează baza întregii numerologii. Fiecare poartă o vibrație unică și caracteristici distincte.",
    masterNumbersTitle: "Numerele Master (11, 22, 33)",
    masterNumbersDesc: "Numerele master sunt considerate cele mai puternice în numerologie. Ele poartă o energie spirituală intensificată și un potențial extraordinar.",
    coreNumber: "Număr Fundamental",
    masterNumber: "Număr Master",
    detailedAnalysis: "Analiză Detaliată",
    allNumbersTitle: "Toate Numerele",
    
    // Footer
    footer: "Numerologia folosește sistemul Pitagoreic pentru calculele numerice",
    
    // Extended meanings
    extendedMeanings: {
      1: "Numărul 1 reprezintă noi începuturi, individualitate și leadership. Persoanele cu acest număr sunt pionieri naturali, plini de ambiție și determinare. Au capacitatea de a-și deschide propriul drum în viață și de a inspira pe alții să-i urmeze. Provocarea lor este să învețe să colaboreze fără a-și pierde identitatea.",
      2: "Numărul 2 simbolizează armonia, parteneriatele și echilibrul. Acești oameni sunt diplomați naturali, capabili să vadă ambele părți ale unei situații. Au o sensibilitate profundă și intuiție puternică. Provocarea lor este să-și dezvolte încrederea în sine fără a depinde prea mult de aprobarea altora.",
      3: "Numărul 3 vibrează cu creativitate, expresie și optimism. Persoanele cu acest număr sunt comunicatori excelenți și artiști naturali. Au darul de a aduce bucurie și lumină oriunde merg. Provocarea lor este să-și canalizeze energia creativă în mod productiv.",
      4: "Numărul 4 reprezintă stabilitatea, munca grea și fundamentul solid. Acești oameni sunt constructori ai lumii materiale, dedicați și de încredere. Au o etică a muncii de neegalat și un simț puternic al responsabilității. Provocarea lor este să nu devină prea rigizi sau rezistenți la schimbare.",
      5: "Numărul 5 simbolizează libertatea, aventura și schimbarea. Persoanele cu acest număr sunt spirite libere care prosperă în diversitate. Sunt adaptabili, curioși și plini de viață. Provocarea lor este să găsească echilibrul între libertate și responsabilitate.",
      6: "Numărul 6 vibrează cu iubire, grijă și responsabilitate familială. Acești oameni sunt protectori naturali, dedicați familiei și comunității. Au un simț profund al dreptății și frumuseții. Provocarea lor este să nu-și neglijeze propriile nevoi în favoarea altora.",
      7: "Numărul 7 reprezintă căutarea spirituală, introspecția și înțelepciunea. Persoanele cu acest număr sunt căutători ai adevărului, atrași de misterele vieții. Au o minte analitică și o natură contemplativă. Provocarea lor este să echilibreze lumea interioară cu cea exterioară.",
      8: "Numărul 8 simbolizează puterea, abundența și realizarea materială. Acești oameni sunt destinați pentru succes în lumea afacerilor. Au o înțelegere naturală a legilor universale ale cauzei și efectului. Provocarea lor este să folosească puterea cu înțelepciune și generozitate.",
      9: "Numărul 9 reprezintă compasiunea universală, înțelepciunea și completarea. Persoanele cu acest număr sunt suflete vechi cu o viziune largă. Au capacitatea de a vedea imaginea de ansamblu și de a servi umanitatea. Provocarea lor este să elibereze trecutul pentru a îmbrățișa viitorul.",
      11: "Numărul Master 11 poartă vibrația dublată a lui 1 plus intuiția profundă. Acești oameni sunt canale pentru inspirație spirituală și au capacitatea de a ilumina pe alții. Sunt vizionari și lideri spirituali. Provocarea lor este să gestioneze sensibilitatea intensă și să-și îndeplinească scopul înalt.",
      22: "Numărul Master 22 combină viziunea spirituală a lui 11 cu practicitatea lui 4. Acești oameni sunt constructori de vise pe scară largă. Au capacitatea de a manifesta proiecte grandioase în realitate. Provocarea lor este să nu se copleșească de amploarea propriului potențial.",
      33: "Numărul Master 33 este cel mai rar și puternic. Combină creativitatea lui 3 cu compasiunea lui 6. Acești oameni sunt învățători și vindecători spirituali. Au misiunea de a ridica conștiința umanității. Provocarea lor este să-și accepte rolul de ghizi spirituali."
    },
    
    // Labels
    adviceLabel: "Sfaturi Personalizate",
    strengthsLabel: "Puncte Forte",
    challengesLabel: "Provocări",
    careerLabel: "Carieră Potrivită",
    relationshipsLabel: "Relații",
    
    // Name Analysis
    nameAnalysis: {
      title: "Analiză Completă a Numelui",
      subtitle: "Analiză detaliată a fiecărei litere și a energiilor ascunse",
      letterDistribution: "Distribuția Literelor",
      individualLetters: "Analiza Fiecărei Litere",
      vowel: "Vocală",
      consonant: "Consoană",
      vowelsAnalysis: "Vocale",
      consonantsAnalysis: "Consoane",
      soulUrgeNumber: "Numărul Sufletului",
      personalityNumber: "Numărul Personalității",
      vowels: "vocale",
      consonants: "consoane",
      hiddenNumbers: "Numere Ascunse",
      number: "Număr",
      optimizationSuggestions: "Sugestii de Optimizare"
    },
    
    // Number meanings
    meanings: {
      1: {
        title: "Liderul",
        traits: ["Independent", "Ambițios", "Inovator", "Curajos"],
        description: "Ești un pionier natural, cu o dorință puternică de a conduce și de a inova. Energia ta este cea a începuturilor și a independenței.",
        strengths: ["Leadership natural", "Inițiativă puternică", "Determinare", "Originalitate"],
        challenges: ["Egoism excesiv", "Impulsivitate", "Dificultăți în colaborare"],
        career: ["Antreprenor", "Manager", "Inventator", "Consultant independent"],
        relationships: "Ai nevoie de un partener care să-ți respecte independența și să te susțină în proiectele tale ambițioase.",
        advice: ["Cultivă răbdarea și ascultă ideile altora", "Echilibrează ambiția cu empatia", "Nu te teme să delegi responsabilități", "Practică colaborarea fără a-ți pierde viziunea"]
      },
      2: {
        title: "Diplomatull",
        traits: ["Diplomatic", "Sensibil", "Cooperant", "Intuitiv"],
        description: "Ești un pacificator natural, cu abilități excepționale de a crea armonie. Energia ta este cea a parteneriatului și echilibrului.",
        strengths: ["Intuiție puternică", "Empatie", "Abilități de mediere", "Sensibilitate"],
        challenges: ["Indecizie", "Dependență de alții", "Sensibilitate excesivă la critică"],
        career: ["Mediator", "Consilier", "Terapeut", "Diplomat", "Artist"],
        relationships: "Prosperi în relații armonioase și ai nevoie de un partener care să-ți aprecieze sensibilitatea și devotamentul.",
        advice: ["Dezvoltă-ți încrederea în propriile decizii", "Stabilește limite sănătoase", "Nu-ți sacrifica nevoile pentru a mulțumi pe alții", "Folosește-ți intuiția ca ghid"]
      },
      3: {
        title: "Creatorul",
        traits: ["Creativ", "Expresiv", "Optimist", "Sociabil"],
        description: "Ești plin de creativitate și expresie artistică. Energia ta aduce bucurie și inspirație celor din jur.",
        strengths: ["Creativitate debordantă", "Comunicare excelentă", "Optimism contagios", "Carisma"],
        challenges: ["Risipirea energiei", "Superficialitate", "Dificultăți în focalizare"],
        career: ["Artist", "Scriitor", "Actor", "Designer", "Vorbitor public"],
        relationships: "Ai nevoie de un partener care să-ți aprecieze spiritul jucăuș și să te inspire la noi aventuri creative.",
        advice: ["Canalizează-ți creativitatea în proiecte concrete", "Finalizează ce începi", "Dezvoltă disciplina fără a-ți pierde spontaneitatea", "Exprimă-te autentic"]
      },
      4: {
        title: "Constructorul",
        traits: ["Stabil", "Practic", "Disciplinat", "Loial"],
        description: "Ești fundamentul pe care alții se pot baza. Energia ta este cea a stabilității și a construirii pentru viitor.",
        strengths: ["Organizare excelentă", "Perseverență", "Fiabilitate", "Etica muncii"],
        challenges: ["Rigiditate", "Rezistență la schimbare", "Tendință spre pesimism"],
        career: ["Inginer", "Arhitect", "Contabil", "Manager de proiect", "Antreprenor"],
        relationships: "Cauți stabilitate și loialitate. Ai nevoie de un partener de încredere care să construiască alături de tine.",
        advice: ["Fii deschis la schimbare și la noi perspective", "Echilibrează munca cu relaxarea", "Permite-ți să fii spontan uneori", "Apreciază progresul, nu doar perfecțiunea"]
      },
      5: {
        title: "Aventurierul",
        traits: ["Liber", "Versatil", "Curios", "Dinamic"],
        description: "Ești un spirit liber care tânjește după schimbare și aventură. Energia ta este cea a libertății și explorării.",
        strengths: ["Adaptabilitate", "Versatilitate", "Curaj", "Entuziasm"],
        challenges: ["Nestatornicire", "Impulsivitate", "Dificultăți cu angajamentele"],
        career: ["Călător", "Jurnalist", "Agent de vânzări", "Consultant", "Antreprenor"],
        relationships: "Ai nevoie de un partener care să-ți respecte nevoia de libertate și să fie deschis la aventuri noi.",
        advice: ["Găsește echilibrul între libertate și responsabilitate", "Transformă curiozitatea în expertiză", "Dezvoltă angajamente pe termen lung", "Canalizează energia în scopuri constructive"]
      },
      6: {
        title: "Protectorul",
        traits: ["Responsabil", "Grijuliu", "Armonios", "Devotat"],
        description: "Ești un protector natural al familiei și comunității. Energia ta este cea a iubirii și responsabilității.",
        strengths: ["Devotament", "Simț estetic", "Responsabilitate", "Grijă pentru alții"],
        challenges: ["Supraprotecție", "Perfecționism", "Neglijarea propriilor nevoi"],
        career: ["Terapeut", "Profesor", "Designer interior", "Medic", "Consilier"],
        relationships: "Ești un partener dedicat care creează un cămin cald. Ai nevoie să fii apreciat pentru tot ce oferi.",
        advice: ["Nu uita să ai grijă și de tine", "Acceptă imperfecțiunea în ceilalți", "Stabilește limite sănătoase", "Permite altora să te susțină"]
      },
      7: {
        title: "Căutătorul",
        traits: ["Analitic", "Spiritual", "Misterios", "Înțelept"],
        description: "Ești un căutător al adevărului și cunoașterii profunde. Energia ta este cea a introspecției și înțelepciunii.",
        strengths: ["Analiză profundă", "Intuiție", "Înțelepciune", "Concentrare"],
        challenges: ["Izolare", "Skepticism excesiv", "Dificultăți în exprimarea emoțiilor"],
        career: ["Cercetător", "Filozof", "Analist", "Scriitor", "Psiholog"],
        relationships: "Ai nevoie de un partener care să-ți respecte nevoia de spațiu personal și să te stimuleze intelectual.",
        advice: ["Echilibrează introspecția cu conexiunile sociale", "Împărtășește înțelepciunea cu alții", "Acceptă misterul vieții", "Deschide-te emoțional celor dragi"]
      },
      8: {
        title: "Realizatorul",
        traits: ["Puternic", "Autoritar", "Abundent", "Ambițios"],
        description: "Ești destinat pentru succes material și putere. Energia ta este cea a abundenței și realizării.",
        strengths: ["Viziune de afaceri", "Leadership", "Determinare", "Abundență"],
        challenges: ["Workaholism", "Materialism excesiv", "Tendință de dominare"],
        career: ["Director executiv", "Investitor", "Avocat", "Antreprenor", "Politician"],
        relationships: "Ai nevoie de un partener care să te susțină în aspirații și să fie la fel de ambiții în propriile scopuri.",
        advice: ["Echilibrează succesul material cu cel spiritual", "Folosește puterea pentru binele comun", "Cultivă generozitatea", "Nu confunda valoarea personală cu averea"]
      },
      9: {
        title: "Umanitarul",
        traits: ["Compasiune", "Generozitate", "Vizionar", "Spiritual"],
        description: "Ești un suflet vechi cu o viziune pentru binele umanității. Energia ta este cea a compasiunii universale.",
        strengths: ["Compasiune", "Înțelepciune", "Generozitate", "Viziune globală"],
        challenges: ["Idealism excesiv", "Dificultăți în a lăsa trecutul", "Tendință de a se sacrifica"],
        career: ["Filantrop", "Consilier", "Artist", "Activist", "Terapeut"],
        relationships: "Ai nevoie de un partener care să-ți împărtășească valorile și să te susțină în misiunea ta umanitară.",
        advice: ["Învață să primești, nu doar să dai", "Eliberează trecutul cu grație", "Focalizează-te pe ceea ce poți schimba", "Găsește bucurie în prezent"]
      },
      11: {
        title: "Maestrul Intuitor",
        traits: ["Vizionar", "Inspirațional", "Sensibil", "Iluminat"],
        description: "Porți energia puternică a numărului master 11. Ești un canal pentru inspirație divină și ai abilitatea de a ilumina calea altora.",
        strengths: ["Intuiție extraordinară", "Inspirație", "Viziune spirituală", "Carisma"],
        challenges: ["Sensibilitate extremă", "Anxietate", "Presiunea așteptărilor înalte"],
        career: ["Lider spiritual", "Artist vizionar", "Consilier", "Inventator", "Terapeut"],
        relationships: "Ai nevoie de un partener care să înțeleagă natura ta sensibilă și să-ți susțină misiunea spirituală.",
        advice: ["Gestionează-ți energia sensibilă", "Acceptă-ți darul vizionar", "Găsește metode de grounding", "Transformă intuiția în acțiune practică"]
      },
      22: {
        title: "Maestrul Constructor",
        traits: ["Visător practic", "Puternic", "Disciplinat", "Vizionar"],
        description: "Porți energia numărului master 22. Ai capacitatea de a transforma visele în realitate la scară mare.",
        strengths: ["Viziune grandioasă", "Abilitate de manifestare", "Leadership", "Disciplină"],
        challenges: ["Presiune internă mare", "Tendință de workahol", "Perfecționism paralizant"],
        career: ["Arhitect", "Lider de organizație", "Antreprenor vizionar", "Politician", "Filantrop"],
        relationships: "Ai nevoie de un partener care să te susțină în viziunile tale ambițioase și să te ajute să rămâi echilibrat.",
        advice: ["Împarte visurile mari în pași realizabili", "Echilibrează viziunea cu acțiunea", "Nu te lăsa copleșit de propria ambiție", "Colaborează cu alții pentru proiecte mari"]
      },
      33: {
        title: "Maestrul Învățător",
        traits: ["Compasiune supremă", "Vindecător", "Înțelept", "Spiritual"],
        description: "Porți energia rară a numărului master 33. Ești un maestru spiritual cu o misiune de a vindeca și învăța.",
        strengths: ["Compasiune profundă", "Abilități de vindecare", "Înțelepciune spirituală", "Inspirație"],
        challenges: ["Sacrificiu excesiv", "Epuizare emoțională", "Așteptări nerealiste de sine"],
        career: ["Vindecător spiritual", "Profesor", "Terapeut", "Lider spiritual", "Filatrop"],
        relationships: "Ai nevoie de un partener care să-ți înțeleagă misiunea spirituală profundă și să te susțină necondiționat.",
        advice: ["Vindecă-te pe tine înainte de a-i vindeca pe alții", "Acceptă-ți umanitatea", "Stabilește limite sănătoase", "Găsește bucurie în a servi fără a te epuiza"]
      }
    },
    
    // Predictions Extended
    predictionsExtended: {
      daily: "Previziune Zilnică",
      weekly: "Previziune Săptămânală",
      monthly: "Previziune Lunară",
      annual: "Previziune Anuală",
      recommendations: "Recomandări",
      color: "Culoarea zilei",
      music: "Muzică recomandată",
      luckyHours: "Ore norocoase",
      theme: "Temă",
      energy: "Energie",
      events: "Evenimente cheie",
      focus: "Zone de focus",
      advice: "Sfat",
      opportunities: "Oportunități",
      challenges: "Provocări",
      cycleTransitions: "Tranziții de ciclu",
      favorableDays: "Zile favorabile",
      unfavorableDays: "Zile nefavorabile",
      optimalDays: "Zile optime pentru acțiune",
      eventAnalysis: "Analiză dată eveniment",
      compatibility: "Compatibilitate",
      excellent: "Excelentă",
      good: "Bună",
      neutral: "Neutră",
      challenging: "Provocatoare"
    },
    
    // Lucky Dates
    luckyDates: {
      title: "Date Norocoase",
      subtitle: "Găsește datele favorabile bazate pe numerele tale",
      nextLucky: "Următoarea dată norocoasă",
      bestDates: "Cele mai bune date ale lunii",
      score: "Scor",
      reasons: {
        lifePathMatch: "Potrivire Drum al Vieții",
        lifePathCompatible: "Compatibil Drum al Vieții",
        destinyMatch: "Potrivire Destin",
        destinyCompatible: "Compatibil Destin",
        personalYearMatch: "Potrivire An Personal",
        dayMatch: "Potrivire zi",
        masterNumber: "Număr Master",
        mirrorDate: "Dată oglindă",
        repeatingDigits: "Cifre repetate"
      },
      selectMonth: "Selectează luna",
      noLuckyDates: "Nu există date norocoase în perioada selectată",
      dayNumber: "Numărul zilei",
      universalNumber: "Numărul universal"
    },
    
    // Premium
    premium: {
      title: "Premium",
      subtitle: "Deblochează funcționalități avansate",
      plans: "Planuri de Abonare",
      aiConsultant: "Consultant AI",
      features: "Caracteristici Premium",
      currentPlan: "Planul tău actual",
      upgrade: "Upgrade",
      premiumFeatures: "Funcționalități Premium",
      advancedReports: "Rapoarte Avansate",
      aiConsultantDesc: "Consultant AI pentru întrebări numerologice",
      unlimitedAccess: "Acces Nelimitat",
      prioritySupport: "Suport Priorititar",
      exportPDF: "Export PDF",
      customReports: "Rapoarte Personalizate",
      monthly: "Lunar",
      yearly: "Anual",
      subscribe: "Abonează-te",
      mostPopular: "Cel mai popular",
      save: "Economisește",
      perMonth: "/lună",
      perYear: "/an",
      featureTitle: "Funcționalitate Premium",
      featureDescription: "Această funcționalitate necesită un abonament Premium.",
      upgradeToPremium: "Upgrade la Premium",
      unlockAdvanced: "Deblochează funcționalități avansate",
      getStarted: "Începe acum",
      consultantTitle: "Consultant AI Numerologic",
      consultantDescription: "Pune întrebări despre numerologie și primește răspunsuri personalizate",
      consultantPlaceholder: "Ex: Ce înseamnă Numărul Drumului Vieții pentru mine?",
      ask: "Întreabă",
      quickQuestions: "Întrebări rapide",
      relatedNumbers: "Numere conexe",
      suggestions: "Sugestii",
      followUp: "Întrebări de urmărire",
      noResponse: "Pune o întrebare pentru a începe conversația"
    }
  },
  en: {
    // Header
    title: "Numerology",
    subtitle: "Discover the hidden secrets in your personal numbers",
    
    // Form
    formTitle: "Calculate Your Numbers",
    formSubtitle: "Enter your details to discover your complete numerological profile",
    fullNameLabel: "Full name at birth",
    fullNamePlaceholder: "Ex: John William Smith",
    fullNameHint: "Use your full name as it appears on your birth certificate",
    birthDateLabel: "Date of birth",
    birthDatePlaceholder: "Select your birth date",
    calculateButton: "Discover Your Numbers",
    
    // Results
    profileTitle: "Your Numerological Profile",
    profileSubtitle: "Discover the hidden meaning of your personal numbers",
    calculateAgain: "Calculate again",
    
    // Number titles
    lifePathTitle: "Life Path Number",
    lifePathDesc: "The most important number in numerology. It represents your life path, lessons to learn, and your life purpose.",
    destinyTitle: "Destiny Number",
    destinyDesc: "Derived from your full name, it shows the talents and abilities you have to fulfill your life mission.",
    soulUrgeTitle: "Soul Urge Number",
    soulUrgeDesc: "Calculated from the vowels in your name, it reveals your innermost desires and deepest motivations.",
    personalityTitle: "Personality Number",
    personalityDesc: "Derived from the consonants in your name, it shows how others perceive you and your first impression.",
    personalYearTitle: "Personal Year",
    personalYearDesc: "The energy guiding you this year. Each personal year brings unique opportunities and challenges.",
    
    // Info cards
    infoLifePath: "Your mission in this life",
    infoDestiny: "Your talents and abilities",
    infoPersonalYear: "This year's energy",
    
    // Navigation
    viewGuide: "Guide",
    viewCompatibility: "Compatibility",
    backToCalculator: "Back to Calculator",
    profile: "Profile",
    myProfile: "My Profile",
    login: "Login",
    courses: "Courses",
    articles: "Articles",
    
    // Profile page
    profilePageTitle: "My Numerological Profile",
    profilePageSubtitle: "Complete your personal data to quickly access numerological calculations",
    profileSaved: "Profile saved successfully!",
    profileDeleted: "Profile deleted successfully!",
    saveProfile: "Save Profile",
    deleteProfile: "Delete Profile",
    editProfile: "Edit Profile",
    createProfile: "Create Profile",
    profileNotCreated: "You haven't created a profile yet. Fill in the details below.",
    birthTimeLabel: "Birth Time (optional)",
    birthTimePlaceholder: "HH:MM",
    birthTimeHint: "Birth time can provide additional details in numerology",
    birthPlaceLabel: "Birth Place (optional)",
    birthPlacePlaceholder: "Ex: New York, USA",
    birthPlaceHint: "Birth place can influence numerological calculations",
    useProfileData: "Use profile data",
    profileRequired: "Please create a profile to use this feature",
    // Multiple profiles
    switchProfile: "Switch Profile",
    activeProfile: "Active Profile",
    allProfiles: "All Profiles",
    createNewProfile: "Create New Profile",
    selectProfile: "Select Profile",
    profileSwitched: "Profile switched successfully!",
    switchProfileError: "Error switching profile",
    noProfiles: "You don't have any profiles yet",
    profileComparison: "Profile Comparison",
    compareProfiles: "Compare Profiles",
    selectProfilesToCompare: "Select profiles to compare",
    cancel: "Cancel",
    error: "Error",
    
    // Compatibility page
    compatibilityLabel: "Numerological Compatibility",
    compatibilityTitle: "Couple Compatibility",
    compatibilitySubtitle: "Discover the numerological harmony between two souls and how your energies complement each other",
    person1: "First Person",
    person2: "Second Person",
    calculateCompatibility: "Calculate Compatibility",
    overallCompatibility: "Overall Compatibility",
    weight: "Weight",
    tryAnotherPair: "Try another pair",
    compatibilityLevels: {
      excellent: "Excellent",
      good: "Good",
      moderate: "Moderate",
      challenging: "Challenging"
    },
    compatibilityDescriptions: {
      excellent: "You have an extraordinary numerological connection! Your energies complement each other perfectly, creating natural harmony.",
      good: "Solid compatibility with great potential. With a little effort, you can build a very harmonious relationship.",
      moderate: "Average compatibility with growth areas. Your differences can be complementary when understood.",
      challenging: "A relationship that requires work and understanding. Challenges can become opportunities for spiritual growth."
    },
    compatibility: {
      relationshipType: "Relationship Type",
      relationshipDynamics: "Relationship Dynamics",
      strengths: "Strengths",
      challenges: "Challenges",
      recommendations: "Recommendations",
      dynamics: "Dynamics",
      communication: "Communication",
      emotional: "Emotional",
      practical: "Practical",
      multiPersonComparison: "Multi-Person Comparison",
      people: "people",
      averageCompatibility: "Average Compatibility",
      groupHarmony: "Group Harmony",
      strongestPairs: "Strongest Pairs",
      weakestPairs: "Pairs Needing Attention",
      groupRecommendations: "Group Recommendations"
    },
    
    // Guide page
    guideLabel: "Complete Guide",
    guideTitle: "Number Meanings",
    guideSubtitle: "Explore in depth the meaning of each number in numerology and discover how they influence your life",
    coreNumbersTitle: "Core Numbers (1-9)",
    coreNumbersDesc: "These nine numbers form the foundation of all numerology. Each carries a unique vibration and distinct characteristics.",
    masterNumbersTitle: "Master Numbers (11, 22, 33)",
    masterNumbersDesc: "Master numbers are considered the most powerful in numerology. They carry intensified spiritual energy and extraordinary potential.",
    coreNumber: "Core Number",
    masterNumber: "Master Number",
    detailedAnalysis: "Detailed Analysis",
    allNumbersTitle: "All Numbers",
    
    // Footer
    footer: "Numerology uses the Pythagorean system for numeric calculations",
    
    // Extended meanings
    extendedMeanings: {
      1: "Number 1 represents new beginnings, individuality, and leadership. People with this number are natural pioneers, full of ambition and determination. They have the ability to forge their own path in life and inspire others to follow. Their challenge is learning to collaborate without losing their identity.",
      2: "Number 2 symbolizes harmony, partnerships, and balance. These people are natural diplomats, capable of seeing both sides of any situation. They have deep sensitivity and strong intuition. Their challenge is developing self-confidence without depending too much on others' approval.",
      3: "Number 3 vibrates with creativity, expression, and optimism. People with this number are excellent communicators and natural artists. They have the gift of bringing joy and light wherever they go. Their challenge is channeling creative energy productively.",
      4: "Number 4 represents stability, hard work, and solid foundation. These people are builders of the material world, dedicated and reliable. They have an unmatched work ethic and a strong sense of responsibility. Their challenge is not becoming too rigid or resistant to change.",
      5: "Number 5 symbolizes freedom, adventure, and change. People with this number are free spirits who thrive in diversity. They are adaptable, curious, and full of life. Their challenge is finding balance between freedom and responsibility.",
      6: "Number 6 vibrates with love, care, and family responsibility. These people are natural protectors, dedicated to family and community. They have a deep sense of justice and beauty. Their challenge is not neglecting their own needs in favor of others.",
      7: "Number 7 represents spiritual seeking, introspection, and wisdom. People with this number are truth seekers, drawn to life's mysteries. They have an analytical mind and contemplative nature. Their challenge is balancing the inner world with the outer.",
      8: "Number 8 symbolizes power, abundance, and material achievement. These people are destined for success in the business world. They have a natural understanding of the universal laws of cause and effect. Their challenge is using power with wisdom and generosity.",
      9: "Number 9 represents universal compassion, wisdom, and completion. People with this number are old souls with a broad vision. They have the ability to see the big picture and serve humanity. Their challenge is releasing the past to embrace the future.",
      11: "Master Number 11 carries the doubled vibration of 1 plus deep intuition. These people are channels for spiritual inspiration and have the ability to illuminate others. They are visionaries and spiritual leaders. Their challenge is managing intense sensitivity and fulfilling their high purpose.",
      22: "Master Number 22 combines the spiritual vision of 11 with the practicality of 4. These people are builders of dreams on a large scale. They have the ability to manifest grand projects into reality. Their challenge is not being overwhelmed by the magnitude of their own potential.",
      33: "Master Number 33 is the rarest and most powerful. It combines the creativity of 3 with the compassion of 6. These people are spiritual teachers and healers. They have the mission of raising humanity's consciousness. Their challenge is accepting their role as spiritual guides."
    },
    
    // Labels
    adviceLabel: "Personalized Advice",
    strengthsLabel: "Strengths",
    challengesLabel: "Challenges",
    careerLabel: "Suitable Career",
    relationshipsLabel: "Relationships",
    
    // Name Analysis
    nameAnalysis: {
      title: "Complete Name Analysis",
      subtitle: "Detailed analysis of each letter and hidden energies",
      letterDistribution: "Letter Distribution",
      individualLetters: "Individual Letter Analysis",
      vowel: "Vowel",
      consonant: "Consonant",
      vowelsAnalysis: "Vowels",
      consonantsAnalysis: "Consonants",
      soulUrgeNumber: "Soul Urge Number",
      personalityNumber: "Personality Number",
      vowels: "vowels",
      consonants: "consonants",
      hiddenNumbers: "Hidden Numbers",
      number: "Number",
      optimizationSuggestions: "Optimization Suggestions"
    },
    
    // Number meanings
    meanings: {
      1: {
        title: "The Leader",
        traits: ["Independent", "Ambitious", "Innovative", "Courageous"],
        description: "You are a natural pioneer with a strong desire to lead and innovate. Your energy is that of beginnings and independence.",
        strengths: ["Natural leadership", "Strong initiative", "Determination", "Originality"],
        challenges: ["Excessive ego", "Impulsivity", "Difficulty in collaboration"],
        career: ["Entrepreneur", "Manager", "Inventor", "Independent consultant"],
        relationships: "You need a partner who respects your independence and supports you in your ambitious projects.",
        advice: ["Cultivate patience and listen to others' ideas", "Balance ambition with empathy", "Don't be afraid to delegate", "Practice collaboration without losing your vision"]
      },
      2: {
        title: "The Diplomat",
        traits: ["Diplomatic", "Sensitive", "Cooperative", "Intuitive"],
        description: "You are a natural peacemaker with exceptional abilities to create harmony. Your energy is that of partnership and balance.",
        strengths: ["Strong intuition", "Empathy", "Mediation skills", "Sensitivity"],
        challenges: ["Indecision", "Dependence on others", "Excessive sensitivity to criticism"],
        career: ["Mediator", "Counselor", "Therapist", "Diplomat", "Artist"],
        relationships: "You thrive in harmonious relationships and need a partner who appreciates your sensitivity and devotion.",
        advice: ["Develop confidence in your own decisions", "Set healthy boundaries", "Don't sacrifice your needs to please others", "Use your intuition as a guide"]
      },
      3: {
        title: "The Creator",
        traits: ["Creative", "Expressive", "Optimistic", "Sociable"],
        description: "You are full of creativity and artistic expression. Your energy brings joy and inspiration to those around you.",
        strengths: ["Overflowing creativity", "Excellent communication", "Contagious optimism", "Charisma"],
        challenges: ["Scattered energy", "Superficiality", "Difficulty focusing"],
        career: ["Artist", "Writer", "Actor", "Designer", "Public speaker"],
        relationships: "You need a partner who appreciates your playful spirit and inspires you to new creative adventures.",
        advice: ["Channel your creativity into concrete projects", "Finish what you start", "Develop discipline without losing spontaneity", "Express yourself authentically"]
      },
      4: {
        title: "The Builder",
        traits: ["Stable", "Practical", "Disciplined", "Loyal"],
        description: "You are the foundation others can rely on. Your energy is that of stability and building for the future.",
        strengths: ["Excellent organization", "Perseverance", "Reliability", "Work ethic"],
        challenges: ["Rigidity", "Resistance to change", "Tendency toward pessimism"],
        career: ["Engineer", "Architect", "Accountant", "Project manager", "Entrepreneur"],
        relationships: "You seek stability and loyalty. You need a trustworthy partner who will build alongside you.",
        advice: ["Be open to change and new perspectives", "Balance work with relaxation", "Allow yourself to be spontaneous sometimes", "Appreciate progress, not just perfection"]
      },
      5: {
        title: "The Adventurer",
        traits: ["Free", "Versatile", "Curious", "Dynamic"],
        description: "You are a free spirit who craves change and adventure. Your energy is that of freedom and exploration.",
        strengths: ["Adaptability", "Versatility", "Courage", "Enthusiasm"],
        challenges: ["Restlessness", "Impulsivity", "Difficulty with commitments"],
        career: ["Traveler", "Journalist", "Sales agent", "Consultant", "Entrepreneur"],
        relationships: "You need a partner who respects your need for freedom and is open to new adventures.",
        advice: ["Find balance between freedom and responsibility", "Transform curiosity into expertise", "Develop long-term commitments", "Channel energy into constructive purposes"]
      },
      6: {
        title: "The Protector",
        traits: ["Responsible", "Caring", "Harmonious", "Devoted"],
        description: "You are a natural protector of family and community. Your energy is that of love and responsibility.",
        strengths: ["Devotion", "Aesthetic sense", "Responsibility", "Care for others"],
        challenges: ["Overprotection", "Perfectionism", "Neglecting own needs"],
        career: ["Therapist", "Teacher", "Interior designer", "Doctor", "Counselor"],
        relationships: "You are a dedicated partner who creates a warm home. You need to be appreciated for all you give.",
        advice: ["Don't forget to take care of yourself too", "Accept imperfection in others", "Set healthy boundaries", "Allow others to support you"]
      },
      7: {
        title: "The Seeker",
        traits: ["Analytical", "Spiritual", "Mysterious", "Wise"],
        description: "You are a seeker of truth and deep knowledge. Your energy is that of introspection and wisdom.",
        strengths: ["Deep analysis", "Intuition", "Wisdom", "Focus"],
        challenges: ["Isolation", "Excessive skepticism", "Difficulty expressing emotions"],
        career: ["Researcher", "Philosopher", "Analyst", "Writer", "Psychologist"],
        relationships: "You need a partner who respects your need for personal space and stimulates you intellectually.",
        advice: ["Balance introspection with social connections", "Share your wisdom with others", "Accept life's mystery", "Open up emotionally to loved ones"]
      },
      8: {
        title: "The Achiever",
        traits: ["Powerful", "Authoritative", "Abundant", "Ambitious"],
        description: "You are destined for material success and power. Your energy is that of abundance and achievement.",
        strengths: ["Business vision", "Leadership", "Determination", "Abundance"],
        challenges: ["Workaholism", "Excessive materialism", "Tendency to dominate"],
        career: ["Executive director", "Investor", "Lawyer", "Entrepreneur", "Politician"],
        relationships: "You need a partner who supports your aspirations and is equally ambitious in their own goals.",
        advice: ["Balance material success with spiritual growth", "Use power for the common good", "Cultivate generosity", "Don't confuse personal worth with wealth"]
      },
      9: {
        title: "The Humanitarian",
        traits: ["Compassionate", "Generous", "Visionary", "Spiritual"],
        description: "You are an old soul with a vision for humanity's good. Your energy is that of universal compassion.",
        strengths: ["Compassion", "Wisdom", "Generosity", "Global vision"],
        challenges: ["Excessive idealism", "Difficulty letting go of the past", "Tendency to sacrifice self"],
        career: ["Philanthropist", "Counselor", "Artist", "Activist", "Therapist"],
        relationships: "You need a partner who shares your values and supports you in your humanitarian mission.",
        advice: ["Learn to receive, not just give", "Release the past with grace", "Focus on what you can change", "Find joy in the present"]
      },
      11: {
        title: "The Master Intuitive",
        traits: ["Visionary", "Inspirational", "Sensitive", "Enlightened"],
        description: "You carry the powerful energy of master number 11. You are a channel for divine inspiration and have the ability to illuminate the path for others.",
        strengths: ["Extraordinary intuition", "Inspiration", "Spiritual vision", "Charisma"],
        challenges: ["Extreme sensitivity", "Anxiety", "Pressure of high expectations"],
        career: ["Spiritual leader", "Visionary artist", "Counselor", "Inventor", "Therapist"],
        relationships: "You need a partner who understands your sensitive nature and supports your spiritual mission.",
        advice: ["Manage your sensitive energy", "Accept your visionary gift", "Find grounding methods", "Transform intuition into practical action"]
      },
      22: {
        title: "The Master Builder",
        traits: ["Practical dreamer", "Powerful", "Disciplined", "Visionary"],
        description: "You carry the energy of master number 22. You have the capacity to transform dreams into reality on a large scale.",
        strengths: ["Grand vision", "Manifestation ability", "Leadership", "Discipline"],
        challenges: ["High internal pressure", "Workaholic tendency", "Paralyzing perfectionism"],
        career: ["Architect", "Organization leader", "Visionary entrepreneur", "Politician", "Philanthropist"],
        relationships: "You need a partner who supports your ambitious visions and helps you stay balanced.",
        advice: ["Break big dreams into achievable steps", "Balance vision with action", "Don't be overwhelmed by your own ambition", "Collaborate with others on big projects"]
      },
      33: {
        title: "The Master Teacher",
        traits: ["Supreme compassion", "Healer", "Wise", "Spiritual"],
        description: "You carry the rare energy of master number 33. You are a spiritual master with a mission to heal and teach.",
        strengths: ["Deep compassion", "Healing abilities", "Spiritual wisdom", "Inspiration"],
        challenges: ["Excessive sacrifice", "Emotional exhaustion", "Unrealistic self-expectations"],
        career: ["Spiritual healer", "Teacher", "Therapist", "Spiritual leader", "Philanthropist"],
        relationships: "You need a partner who understands your deep spiritual mission and supports you unconditionally.",
        advice: ["Heal yourself before healing others", "Accept your humanity", "Set healthy boundaries", "Find joy in serving without depleting yourself"]
      }
    },
    
    // Predictions Extended
    predictionsExtended: {
      daily: "Daily Prediction",
      weekly: "Weekly Prediction",
      monthly: "Monthly Prediction",
      annual: "Annual Prediction",
      recommendations: "Recommendations",
      color: "Day Color",
      music: "Recommended Music",
      luckyHours: "Lucky Hours",
      theme: "Theme",
      energy: "Energy",
      events: "Key Events",
      focus: "Focus Areas",
      advice: "Advice",
      opportunities: "Opportunities",
      challenges: "Challenges",
      cycleTransitions: "Cycle Transitions",
      favorableDays: "Favorable Days",
      unfavorableDays: "Unfavorable Days",
      optimalDays: "Optimal Days for Action",
      eventAnalysis: "Event Date Analysis",
      compatibility: "Compatibility",
      excellent: "Excellent",
      good: "Good",
      neutral: "Neutral",
      challenging: "Challenging"
    },
    
    // Export & Sharing
    export: {
      export: "Export",
      fullReport: "Full Report PDF",
      customReport: "Custom Report",
      exportChart: "Export Chart",
      options: "Options",
      includeCharts: "Include Charts",
      includeKarmic: "Include Karmic Analysis",
      includePinnacles: "Include Pinnacles",
      includeCycles: "Include Cycles",
      includePredictions: "Include Predictions",
      exporting: "Exporting...",
      success: "Export successful!",
      error: "Export error"
    },
    sharing: {
      share: "Share",
      shareTo: "Share to",
      facebook: "Facebook",
      twitter: "Twitter",
      whatsapp: "WhatsApp",
      instagram: "Instagram",
      email: "Send by Email",
      copyLink: "Copy Link",
      linkCopied: "Link copied!",
      nativeShare: "Share"
    },
    
    // Lucky Dates
    luckyDates: {
      title: "Lucky Dates",
      subtitle: "Find favorable dates based on your numbers",
      nextLucky: "Next lucky date",
      bestDates: "Best dates of the month",
      score: "Score",
      reasons: {
        lifePathMatch: "Life Path Match",
        lifePathCompatible: "Life Path Compatible",
        destinyMatch: "Destiny Match",
        destinyCompatible: "Destiny Compatible",
        personalYearMatch: "Personal Year Match",
        dayMatch: "Day Match",
        masterNumber: "Master Number",
        mirrorDate: "Mirror Date",
        repeatingDigits: "Repeating Digits"
      },
      selectMonth: "Select month",
      noLuckyDates: "No lucky dates in selected period",
      dayNumber: "Day number",
      universalNumber: "Universal number"
    },
    
    // Premium
    premium: {
      title: "Premium",
      subtitle: "Unlock advanced features",
      plans: "Subscription Plans",
      aiConsultant: "AI Consultant",
      features: "Premium Features",
      currentPlan: "Your current plan",
      upgrade: "Upgrade",
      premiumFeatures: "Premium Features",
      advancedReports: "Advanced Reports",
      aiConsultantDesc: "AI consultant for numerology questions",
      unlimitedAccess: "Unlimited Access",
      prioritySupport: "Priority Support",
      exportPDF: "PDF Export",
      customReports: "Custom Reports",
      monthly: "Monthly",
      yearly: "Yearly",
      subscribe: "Subscribe",
      mostPopular: "Most popular",
      save: "Save",
      perMonth: "/month",
      perYear: "/year",
      featureTitle: "Premium Feature",
      featureDescription: "This feature requires a Premium subscription.",
      upgradeToPremium: "Upgrade to Premium",
      unlockAdvanced: "Unlock advanced features",
      getStarted: "Get Started",
      consultantTitle: "AI Numerology Consultant",
      consultantDescription: "Ask questions about numerology and get personalized answers",
      consultantPlaceholder: "E.g.: What does my Life Path Number mean for me?",
      ask: "Ask",
      quickQuestions: "Quick Questions",
      relatedNumbers: "Related Numbers",
      suggestions: "Suggestions",
      followUp: "Follow-up Questions",
      noResponse: "Ask a question to start the conversation"
    }
  },
  ru: {
    // Header
    title: "Нумерология",
    subtitle: "Откройте скрытые тайны в ваших личных числах",
    
    // Form
    formTitle: "Рассчитайте Ваши Числа",
    formSubtitle: "Введите ваши данные, чтобы узнать полный нумерологический профиль",
    fullNameLabel: "Полное имя при рождении",
    fullNamePlaceholder: "Пр: Иванов Иван Иванович",
    fullNameHint: "Используйте полное имя, как в свидетельстве о рождении",
    birthDateLabel: "Дата рождения",
    birthDatePlaceholder: "Выберите дату рождения",
    calculateButton: "Узнать Ваши Числа",
    
    // Results
    profileTitle: "Ваш Нумерологический Профиль",
    profileSubtitle: "Откройте скрытое значение ваших личных чисел",
    calculateAgain: "Рассчитать снова",
    
    // Number titles
    lifePathTitle: "Число Жизненного Пути",
    lifePathDesc: "Самое важное число в нумерологии. Оно представляет ваш жизненный путь, уроки и цель вашей жизни.",
    destinyTitle: "Число Судьбы",
    destinyDesc: "Полученное из вашего полного имени, оно показывает таланты и способности для выполнения вашей жизненной миссии.",
    soulUrgeTitle: "Число Души",
    soulUrgeDesc: "Рассчитанное из гласных в имени, оно раскрывает ваши внутренние желания и глубочайшие мотивации.",
    personalityTitle: "Число Личности",
    personalityDesc: "Полученное из согласных в имени, показывает как другие воспринимают вас и первое впечатление.",
    personalYearTitle: "Личный Год",
    personalYearDesc: "Энергия, направляющая вас в этом году. Каждый личный год приносит уникальные возможности и вызовы.",
    
    // Info cards
    infoLifePath: "Ваша миссия в этой жизни",
    infoDestiny: "Ваши таланты и способности",
    infoPersonalYear: "Энергия текущего года",
    
    // Navigation
    viewGuide: "Руководство",
    viewCompatibility: "Совместимость",
    backToCalculator: "Назад к Калькулятору",
    profile: "Профиль",
    myProfile: "Мой Профиль",
    login: "Вход",
    courses: "Курсы",
    articles: "Статьи",
    predictions: "Прогнозы",
    tools: "Инструменты",
    tutorials: "Учебники",
    faq: "Часто Задаваемые Вопросы",
    back: "Назад",
    
    // NotFound page
    notFound: {
      title: "Страница не найдена",
      description: "Страница, которую вы ищете, не существует или была перемещена.",
      backHome: "Вернуться на главную страницу"
    },
    
    // Profile page
    profilePageTitle: "Мой Нумерологический Профиль",
    profilePageSubtitle: "Заполните ваши личные данные для быстрого доступа к нумерологическим расчётам",
    profileSaved: "Профиль успешно сохранён!",
    profileDeleted: "Профиль успешно удалён!",
    saveProfile: "Сохранить Профиль",
    deleteProfile: "Удалить Профиль",
    editProfile: "Редактировать Профиль",
    createProfile: "Создать Профиль",
    profileNotCreated: "Вы ещё не создали профиль. Заполните данные ниже.",
    birthTimeLabel: "Время Рождения (необязательно)",
    birthTimePlaceholder: "ЧЧ:ММ",
    birthTimeHint: "Время рождения может предоставить дополнительные детали в нумерологии",
    birthPlaceLabel: "Место Рождения (необязательно)",
    birthPlacePlaceholder: "Например: Москва, Россия",
    birthPlaceHint: "Место рождения может влиять на нумерологические расчёты",
    useProfileData: "Использовать данные профиля",
    profileRequired: "Пожалуйста, создайте профиль для использования этой функции",
    // Multiple profiles
    switchProfile: "Переключить Профиль",
    activeProfile: "Активный Профиль",
    allProfiles: "Все Профили",
    createNewProfile: "Создать Новый Профиль",
    selectProfile: "Выбрать Профиль",
    profileSwitched: "Профиль успешно переключён!",
    switchProfileError: "Ошибка переключения профиля",
    noProfiles: "У вас ещё нет профилей",
    profileComparison: "Сравнение Профилей",
    compareProfiles: "Сравнить Профили",
    selectProfilesToCompare: "Выберите профили для сравнения",
    cancel: "Отмена",
    error: "Ошибка",
    
    // Compatibility page
    compatibilityLabel: "Нумерологическая Совместимость",
    compatibilityTitle: "Совместимость Пары",
    compatibilitySubtitle: "Откройте нумерологическую гармонию между двумя душами и как ваши энергии дополняют друг друга",
    person1: "Первый Человек",
    person2: "Второй Человек",
    calculateCompatibility: "Рассчитать Совместимость",
    overallCompatibility: "Общая Совместимость",
    weight: "Вес",
    tryAnotherPair: "Попробовать другую пару",
    compatibilityLevels: {
      excellent: "Отличная",
      good: "Хорошая",
      moderate: "Умеренная",
      challenging: "Сложная"
    },
    compatibilityDescriptions: {
      excellent: "У вас необыкновенная нумерологическая связь! Ваши энергии идеально дополняют друг друга, создавая естественную гармонию.",
      good: "Крепкая совместимость с большим потенциалом. С небольшими усилиями вы можете построить очень гармоничные отношения.",
      moderate: "Средняя совместимость с зонами роста. Ваши различия могут быть взаимодополняющими, если их понять.",
      challenging: "Отношения, требующие работы и понимания. Трудности могут стать возможностями для духовного роста."
    },
    compatibility: {
      relationshipType: "Тип Отношений",
      relationshipDynamics: "Динамика Отношений",
      strengths: "Сильные Стороны",
      challenges: "Вызовы",
      recommendations: "Рекомендации",
      dynamics: "Динамика",
      communication: "Коммуникация",
      emotional: "Эмоциональный",
      practical: "Практический",
      multiPersonComparison: "Многоперсональное Сравнение",
      people: "человек",
      averageCompatibility: "Средняя Совместимость",
      groupHarmony: "Гармония Группы",
      strongestPairs: "Самые Сильные Пары",
      weakestPairs: "Пары, Требующие Внимания",
      groupRecommendations: "Рекомендации для Группы"
    },
    
    // Guide page
    guideLabel: "Полное Руководство",
    guideTitle: "Значение Чисел",
    guideSubtitle: "Исследуйте глубоко значение каждого числа в нумерологии и откройте, как они влияют на вашу жизнь",
    coreNumbersTitle: "Основные Числа (1-9)",
    coreNumbersDesc: "Эти девять чисел составляют основу всей нумерологии. Каждое несёт уникальную вибрацию и отличительные характеристики.",
    masterNumbersTitle: "Мастер-Числа (11, 22, 33)",
    masterNumbersDesc: "Мастер-числа считаются самыми мощными в нумерологии. Они несут усиленную духовную энергию и экстраординарный потенциал.",
    coreNumber: "Основное Число",
    masterNumber: "Мастер-Число",
    detailedAnalysis: "Детальный Анализ",
    allNumbersTitle: "Все Числа",
    
    // Footer
    footer: "Нумерология использует систему Пифагора для числовых расчётов",
    
    // Extended meanings
    extendedMeanings: {
      1: "Число 1 представляет новые начинания, индивидуальность и лидерство. Люди с этим числом — прирождённые пионеры, полные амбиций и решительности. Они способны прокладывать собственный путь в жизни и вдохновлять других следовать за ними. Их задача — научиться сотрудничать, не теряя своей идентичности.",
      2: "Число 2 символизирует гармонию, партнёрство и баланс. Эти люди — прирождённые дипломаты, способные видеть обе стороны любой ситуации. Они обладают глубокой чувствительностью и сильной интуицией. Их задача — развить уверенность в себе, не завися слишком сильно от одобрения других.",
      3: "Число 3 вибрирует с творчеством, самовыражением и оптимизмом. Люди с этим числом — отличные коммуникаторы и прирождённые художники. Они обладают даром приносить радость и свет повсюду. Их задача — направлять творческую энергию продуктивно.",
      4: "Число 4 представляет стабильность, упорный труд и прочный фундамент. Эти люди — строители материального мира, преданные и надёжные. У них несравненная рабочая этика и сильное чувство ответственности. Их задача — не становиться слишком жёсткими или устойчивыми к переменам.",
      5: "Число 5 символизирует свободу, приключения и перемены. Люди с этим числом — свободные духи, процветающие в разнообразии. Они адаптивны, любопытны и полны жизни. Их задача — найти баланс между свободой и ответственностью.",
      6: "Число 6 вибрирует с любовью, заботой и семейной ответственностью. Эти люди — прирождённые защитники, преданные семье и обществу. У них глубокое чувство справедливости и красоты. Их задача — не пренебрегать собственными потребностями ради других.",
      7: "Число 7 представляет духовный поиск, самоанализ и мудрость. Люди с этим числом — искатели истины, привлечённые тайнами жизни. У них аналитический ум и созерцательная натура. Их задача — балансировать внутренний мир с внешним.",
      8: "Число 8 символизирует силу, изобилие и материальные достижения. Эти люди предназначены для успеха в мире бизнеса. У них естественное понимание универсальных законов причины и следствия. Их задача — использовать силу с мудростью и щедростью.",
      9: "Число 9 представляет универсальное сострадание, мудрость и завершение. Люди с этим числом — старые души с широким видением. Они способны видеть общую картину и служить человечеству. Их задача — отпустить прошлое, чтобы принять будущее.",
      11: "Мастер-число 11 несёт удвоенную вибрацию 1 плюс глубокую интуицию. Эти люди — каналы для духовного вдохновения и способны освещать других. Они визионеры и духовные лидеры. Их задача — управлять интенсивной чувствительностью и выполнять своё высокое предназначение.",
      22: "Мастер-число 22 сочетает духовное видение 11 с практичностью 4. Эти люди — строители мечтаний в большом масштабе. Они способны воплощать грандиозные проекты в реальность. Их задача — не быть подавленными масштабом собственного потенциала.",
      33: "Мастер-число 33 — самое редкое и могущественное. Оно сочетает творчество 3 с состраданием 6. Эти люди — духовные учителя и целители. Их миссия — поднять сознание человечества. Их задача — принять свою роль духовных проводников."
    },
    
    // Labels
    adviceLabel: "Персональные Советы",
    strengthsLabel: "Сильные Стороны",
    challengesLabel: "Вызовы",
    careerLabel: "Подходящая Карьера",
    relationshipsLabel: "Отношения",
    
    // Name Analysis
    nameAnalysis: {
      title: "Полный Анализ Имени",
      subtitle: "Детальный анализ каждой буквы и скрытых энергий",
      letterDistribution: "Распределение Букв",
      individualLetters: "Анализ Каждой Буквы",
      vowel: "Гласная",
      consonant: "Согласная",
      vowelsAnalysis: "Гласные",
      consonantsAnalysis: "Согласные",
      soulUrgeNumber: "Число Души",
      personalityNumber: "Число Личности",
      vowels: "гласных",
      consonants: "согласных",
      hiddenNumbers: "Скрытые Числа",
      number: "Число",
      optimizationSuggestions: "Предложения по Оптимизации"
    },
    
    // Number meanings
    meanings: {
      1: {
        title: "Лидер",
        traits: ["Независимый", "Амбициозный", "Инновационный", "Смелый"],
        description: "Вы прирождённый пионер с сильным желанием вести и создавать новое. Ваша энергия — это энергия начала и независимости.",
        strengths: ["Природное лидерство", "Сильная инициатива", "Решительность", "Оригинальность"],
        challenges: ["Чрезмерное эго", "Импульсивность", "Трудности в сотрудничестве"],
        career: ["Предприниматель", "Менеджер", "Изобретатель", "Независимый консультант"],
        relationships: "Вам нужен партнёр, который уважает вашу независимость и поддерживает ваши амбициозные проекты.",
        advice: ["Развивайте терпение и слушайте идеи других", "Балансируйте амбиции с эмпатией", "Не бойтесь делегировать", "Практикуйте сотрудничество, сохраняя своё видение"]
      },
      2: {
        title: "Дипломат",
        traits: ["Дипломатичный", "Чувствительный", "Кооперативный", "Интуитивный"],
        description: "Вы прирождённый миротворец с исключительными способностями создавать гармонию. Ваша энергия — это энергия партнёрства и баланса.",
        strengths: ["Сильная интуиция", "Эмпатия", "Навыки медиации", "Чувствительность"],
        challenges: ["Нерешительность", "Зависимость от других", "Чрезмерная чувствительность к критике"],
        career: ["Медиатор", "Консультант", "Терапевт", "Дипломат", "Художник"],
        relationships: "Вы процветаете в гармоничных отношениях и нуждаетесь в партнёре, который ценит вашу чувствительность и преданность.",
        advice: ["Развивайте уверенность в собственных решениях", "Устанавливайте здоровые границы", "Не жертвуйте своими потребностями ради угождения другим", "Используйте интуицию как руководство"]
      },
      3: {
        title: "Творец",
        traits: ["Творческий", "Выразительный", "Оптимистичный", "Общительный"],
        description: "Вы полны творчества и художественного выражения. Ваша энергия приносит радость и вдохновение окружающим.",
        strengths: ["Безграничное творчество", "Отличная коммуникация", "Заразительный оптимизм", "Харизма"],
        challenges: ["Рассеянная энергия", "Поверхностность", "Трудности с концентрацией"],
        career: ["Художник", "Писатель", "Актёр", "Дизайнер", "Публичный оратор"],
        relationships: "Вам нужен партнёр, который ценит ваш игривый дух и вдохновляет на новые творческие приключения.",
        advice: ["Направляйте творчество в конкретные проекты", "Доводите начатое до конца", "Развивайте дисциплину, не теряя спонтанности", "Выражайте себя искренне"]
      },
      4: {
        title: "Строитель",
        traits: ["Стабильный", "Практичный", "Дисциплинированный", "Верный"],
        description: "Вы — фундамент, на который другие могут положиться. Ваша энергия — это энергия стабильности и созидания будущего.",
        strengths: ["Отличная организация", "Упорство", "Надёжность", "Рабочая этика"],
        challenges: ["Жёсткость", "Сопротивление переменам", "Склонность к пессимизму"],
        career: ["Инженер", "Архитектор", "Бухгалтер", "Менеджер проектов", "Предприниматель"],
        relationships: "Вы ищете стабильность и верность. Вам нужен надёжный партнёр, который будет строить вместе с вами.",
        advice: ["Будьте открыты к переменам и новым перспективам", "Балансируйте работу с отдыхом", "Позволяйте себе быть спонтанным иногда", "Цените прогресс, а не только совершенство"]
      },
      5: {
        title: "Искатель Приключений",
        traits: ["Свободный", "Разносторонний", "Любопытный", "Динамичный"],
        description: "Вы свободный дух, жаждущий перемен и приключений. Ваша энергия — это энергия свободы и исследования.",
        strengths: ["Адаптивность", "Разносторонность", "Смелость", "Энтузиазм"],
        challenges: ["Беспокойство", "Импульсивность", "Трудности с обязательствами"],
        career: ["Путешественник", "Журналист", "Агент по продажам", "Консультант", "Предприниматель"],
        relationships: "Вам нужен партнёр, который уважает вашу потребность в свободе и открыт новым приключениям.",
        advice: ["Найдите баланс между свободой и ответственностью", "Превратите любопытство в экспертизу", "Развивайте долгосрочные обязательства", "Направляйте энергию в конструктивные цели"]
      },
      6: {
        title: "Защитник",
        traits: ["Ответственный", "Заботливый", "Гармоничный", "Преданный"],
        description: "Вы прирождённый защитник семьи и общества. Ваша энергия — это энергия любви и ответственности.",
        strengths: ["Преданность", "Эстетическое чувство", "Ответственность", "Забота о других"],
        challenges: ["Чрезмерная защита", "Перфекционизм", "Пренебрежение собственными потребностями"],
        career: ["Терапевт", "Учитель", "Дизайнер интерьера", "Врач", "Консультант"],
        relationships: "Вы преданный партнёр, создающий тёплый дом. Вам нужно, чтобы вас ценили за всё, что вы даёте.",
        advice: ["Не забывайте заботиться о себе тоже", "Принимайте несовершенство в других", "Устанавливайте здоровые границы", "Позволяйте другим поддерживать вас"]
      },
      7: {
        title: "Искатель",
        traits: ["Аналитический", "Духовный", "Загадочный", "Мудрый"],
        description: "Вы искатель истины и глубокого знания. Ваша энергия — это энергия самоанализа и мудрости.",
        strengths: ["Глубокий анализ", "Интуиция", "Мудрость", "Сосредоточенность"],
        challenges: ["Изоляция", "Чрезмерный скептицизм", "Трудности в выражении эмоций"],
        career: ["Исследователь", "Философ", "Аналитик", "Писатель", "Психолог"],
        relationships: "Вам нужен партнёр, который уважает вашу потребность в личном пространстве и стимулирует интеллектуально.",
        advice: ["Балансируйте самоанализ с социальными связями", "Делитесь своей мудростью с другими", "Принимайте тайну жизни", "Открывайтесь эмоционально близким людям"]
      },
      8: {
        title: "Достигатель",
        traits: ["Сильный", "Авторитетный", "Изобильный", "Амбициозный"],
        description: "Вы предназначены для материального успеха и власти. Ваша энергия — это энергия изобилия и достижений.",
        strengths: ["Бизнес-видение", "Лидерство", "Решительность", "Изобилие"],
        challenges: ["Трудоголизм", "Чрезмерный материализм", "Склонность к доминированию"],
        career: ["Исполнительный директор", "Инвестор", "Юрист", "Предприниматель", "Политик"],
        relationships: "Вам нужен партнёр, который поддерживает ваши стремления и столь же амбициозен в своих целях.",
        advice: ["Балансируйте материальный успех с духовным ростом", "Используйте власть для общего блага", "Культивируйте щедрость", "Не путайте личную ценность с богатством"]
      },
      9: {
        title: "Гуманитарий",
        traits: ["Сострадательный", "Щедрый", "Провидец", "Духовный"],
        description: "Вы старая душа с видением блага человечества. Ваша энергия — это энергия вселенского сострадания.",
        strengths: ["Сострадание", "Мудрость", "Щедрость", "Глобальное видение"],
        challenges: ["Чрезмерный идеализм", "Трудности отпустить прошлое", "Склонность к самопожертвованию"],
        career: ["Филантроп", "Консультант", "Художник", "Активист", "Терапевт"],
        relationships: "Вам нужен партнёр, который разделяет ваши ценности и поддерживает вас в гуманитарной миссии.",
        advice: ["Учитесь получать, а не только давать", "Отпускайте прошлое с благодатью", "Сосредоточьтесь на том, что можете изменить", "Находите радость в настоящем"]
      },
      11: {
        title: "Мастер Интуиции",
        traits: ["Провидец", "Вдохновляющий", "Чувствительный", "Просветлённый"],
        description: "Вы несёте мощную энергию мастер-числа 11. Вы канал для божественного вдохновения и способны освещать путь другим.",
        strengths: ["Необыкновенная интуиция", "Вдохновение", "Духовное видение", "Харизма"],
        challenges: ["Крайняя чувствительность", "Тревожность", "Давление высоких ожиданий"],
        career: ["Духовный лидер", "Визионерский художник", "Консультант", "Изобретатель", "Терапевт"],
        relationships: "Вам нужен партнёр, который понимает вашу чувствительную природу и поддерживает вашу духовную миссию.",
        advice: ["Управляйте своей чувствительной энергией", "Принимайте свой визионерский дар", "Найдите методы заземления", "Превращайте интуицию в практические действия"]
      },
      22: {
        title: "Мастер Строитель",
        traits: ["Практичный мечтатель", "Сильный", "Дисциплинированный", "Визионер"],
        description: "Вы несёте энергию мастер-числа 22. Вы способны превращать мечты в реальность в большом масштабе.",
        strengths: ["Грандиозное видение", "Способность к манифестации", "Лидерство", "Дисциплина"],
        challenges: ["Высокое внутреннее давление", "Склонность к трудоголизму", "Парализующий перфекционизм"],
        career: ["Архитектор", "Лидер организации", "Визионерский предприниматель", "Политик", "Филантроп"],
        relationships: "Вам нужен партнёр, который поддерживает ваши амбициозные видения и помогает сохранять баланс.",
        advice: ["Разбивайте большие мечты на достижимые шаги", "Балансируйте видение с действием", "Не позволяйте собственной амбиции подавлять вас", "Сотрудничайте с другими в больших проектах"]
      },
      33: {
        title: "Мастер Учитель",
        traits: ["Высшее сострадание", "Целитель", "Мудрый", "Духовный"],
        description: "Вы несёте редкую энергию мастер-числа 33. Вы духовный мастер с миссией исцелять и учить.",
        strengths: ["Глубокое сострадание", "Целительные способности", "Духовная мудрость", "Вдохновение"],
        challenges: ["Чрезмерное самопожертвование", "Эмоциональное истощение", "Нереалистичные ожидания от себя"],
        career: ["Духовный целитель", "Учитель", "Терапевт", "Духовный лидер", "Филантроп"],
        relationships: "Вам нужен партнёр, который понимает вашу глубокую духовную миссию и поддерживает вас безусловно.",
        advice: ["Исцелите себя прежде, чем исцелять других", "Принимайте свою человечность", "Устанавливайте здоровые границы", "Находите радость в служении, не истощая себя"]
      }
    },
    
    // Predictions Extended
    predictionsExtended: {
      daily: "Ежедневный Прогноз",
      weekly: "Еженедельный Прогноз",
      monthly: "Ежемесячный Прогноз",
      annual: "Годовой Прогноз",
      recommendations: "Рекомендации",
      color: "Цвет дня",
      music: "Рекомендуемая музыка",
      luckyHours: "Счастливые часы",
      theme: "Тема",
      energy: "Энергия",
      events: "Ключевые события",
      focus: "Области фокуса",
      advice: "Совет",
      opportunities: "Возможности",
      challenges: "Вызовы",
      cycleTransitions: "Переходы циклов",
      favorableDays: "Благоприятные дни",
      unfavorableDays: "Неблагоприятные дни",
      optimalDays: "Оптимальные дни для действий",
      eventAnalysis: "Анализ даты события",
      compatibility: "Совместимость",
      excellent: "Отличная",
      good: "Хорошая",
      neutral: "Нейтральная",
      challenging: "Сложная"
    },
    
    // Export & Sharing
    export: {
      export: "Экспорт",
      fullReport: "Полный Отчёт PDF",
      customReport: "Настраиваемый Отчёт",
      exportChart: "Экспорт Графика",
      options: "Опции",
      includeCharts: "Включить Графики",
      includeKarmic: "Включить Кармический Анализ",
      includePinnacles: "Включить Пики",
      includeCycles: "Включить Циклы",
      includePredictions: "Включить Прогнозы",
      exporting: "Экспорт...",
      success: "Экспорт успешен!",
      error: "Ошибка экспорта"
    },
    sharing: {
      share: "Поделиться",
      shareTo: "Поделиться в",
      facebook: "Facebook",
      twitter: "Twitter",
      whatsapp: "WhatsApp",
      instagram: "Instagram",
      email: "Отправить по Email",
      copyLink: "Копировать Ссылку",
      linkCopied: "Ссылка скопирована!",
      nativeShare: "Поделиться"
    },
    
    // Lucky Dates
    luckyDates: {
      title: "Удачные Даты",
      subtitle: "Найдите благоприятные даты на основе ваших чисел",
      nextLucky: "Следующая удачная дата",
      bestDates: "Лучшие даты месяца",
      score: "Оценка",
      reasons: {
        lifePathMatch: "Совпадение с Жизненным Путём",
        lifePathCompatible: "Совместимость с Жизненным Путём",
        destinyMatch: "Совпадение с Судьбой",
        destinyCompatible: "Совместимость с Судьбой",
        personalYearMatch: "Совпадение с Личным Годом",
        dayMatch: "Совпадение дня",
        masterNumber: "Мастер-число",
        mirrorDate: "Зеркальная дата",
        repeatingDigits: "Повторяющиеся цифры"
      },
      selectMonth: "Выберите месяц",
      noLuckyDates: "Нет удачных дат в выбранном периоде",
      dayNumber: "Число дня",
      universalNumber: "Универсальное число"
    },
    
    // Premium
    premium: {
      title: "Премиум",
      subtitle: "Разблокировать расширенные функции",
      plans: "Планы подписки",
      aiConsultant: "ИИ Консультант",
      features: "Премиум функции",
      currentPlan: "Ваш текущий план",
      upgrade: "Обновить",
      premiumFeatures: "Премиум функции",
      advancedReports: "Расширенные отчеты",
      aiConsultantDesc: "ИИ консультант для нумерологических вопросов",
      unlimitedAccess: "Неограниченный доступ",
      prioritySupport: "Приоритетная поддержка",
      exportPDF: "Экспорт PDF",
      customReports: "Пользовательские отчеты",
      monthly: "Ежемесячно",
      yearly: "Ежегодно",
      subscribe: "Подписаться",
      mostPopular: "Самый популярный",
      save: "Сэкономить",
      perMonth: "/месяц",
      perYear: "/год",
      featureTitle: "Премиум функция",
      featureDescription: "Эта функция требует премиум подписки.",
      upgradeToPremium: "Обновить до Премиум",
      unlockAdvanced: "Разблокировать расширенные функции",
      getStarted: "Начать",
      consultantTitle: "ИИ Нумерологический консультант",
      consultantDescription: "Задавайте вопросы о нумерологии и получайте персонализированные ответы",
      consultantPlaceholder: "Например: Что означает мое Число Жизненного Пути для меня?",
      ask: "Спросить",
      quickQuestions: "Быстрые вопросы",
      relatedNumbers: "Связанные числа",
      suggestions: "Предложения",
      followUp: "Вопросы для продолжения",
      noResponse: "Задайте вопрос, чтобы начать разговор"
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];
