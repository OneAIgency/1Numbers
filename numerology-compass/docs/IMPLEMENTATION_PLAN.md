# Plan de Implementare - Numerology Compass
## Implementare completă a funcționalităților din FEATURE_RESEARCH.md

**Data**: 2026-01-01  
**Scop**: Plan detaliat pas cu pas pentru implementarea tuturor funcționalităților, organizate logic în structura aplicației

---

## 📋 REZUMAT EXECUTIV

Acest plan organizează **572 de funcționalități** din FEATURE_RESEARCH.md în **12 faze principale**, implementate progresiv, respectând:
- Arhitectura aplicației (lib/ → components/ → pages/)
- Dependențele între funcționalități
- Complexitatea și prioritizarea
- Pattern-urile orchestrator.md

**Estimare totală**: ~200-250 ore de dezvoltare (distribuite pe 12 faze)

---

## 🎯 STRATEGIA DE IMPLEMENTARE

### Principii de Organizare

1. **Foundation First**: Funcționalități de bază înainte de cele avansate
2. **Layer Order**: lib/ → components/ → pages/ → integrations
3. **Dependency Graph**: Funcționalități dependente în aceeași fază sau secvențial
4. **Parallel Potential**: Maximizarea paralelizării unde este posibil
5. **Incremental Value**: Fiecare fază aduce valoare independentă

### Structura Fazei

Fiecare fază conține:
- **Scop**: Ce se implementează
- **Complexitate**: LOW / MEDIUM / HIGH
- **Sub-tasks**: Lista detaliată de task-uri
- **Dependențe**: Ce trebuie făcut înainte
- **Output**: Ce se obține la final
- **Verification**: Ce se verifică

---

## 📦 FAZA 1: EXTINDERE CALCULE NUMEROLOGICE DE BAZĂ
**Complexitate**: MEDIUM  
**Durată estimată**: 8-12 ore  
**Dependențe**: None (bază existentă)

### Scop
Extinderea calculelor numerologice existente cu funcționalități avansate de bază.

### Sub-tasks

#### PHASE 1.1: Extindere lib/numerology.ts (Sequential)
- [ ] **T1**: Implementare `calculateHiddenPassions()` - numere ascunse în nume
- [ ] **T2**: Implementare `calculateMaturityNumber()` - număr de maturitate
- [ ] **T3**: Implementare `calculateBalanceNumber()` - număr de echilibru
- [ ] **T4**: Implementare `analyzeLetterDistribution()` - distribuție litere în nume
- [ ] **T5**: Validare cu numerology-expert
- → **VERIFY**: TypeScript compile, tests pass

#### PHASE 1.2: Extindere lib/karmic.ts (Parallel - 2 threads)
- [ ] **T6**: Implementare `calculateKarmicLessons()` - lecții karmice extinse
- [ ] **T7**: Implementare `calculateKarmicPath()` - calea de vindecare karmică
- → **VERIFY**: Tests pass, numerology-expert validation

#### PHASE 1.3: Extindere lib/pinnacles.ts (Sequential)
- [ ] **T8**: Implementare `calculateChallenges()` - provocări personale (4 cicluri)
- [ ] **T9**: Implementare `calculateAchievements()` - numere de realizare
- → **VERIFY**: Tests pass

#### PHASE 1.4: Extindere lib/personalCycles.ts (Sequential)
- [ ] **T10**: Implementare `calculateLifeCycles()` - cicluri de viață detaliate (9 ani)
- [ ] **T11**: Implementare `calculatePeakYears()` - anii de apogeu
- [ ] **T12**: Implementare `calculateCurrentLifeStage()` - etapa de viață actuală
- → **VERIFY**: Tests pass

### Files Modified
- `src/lib/numerology.ts` (extend)
- `src/lib/karmic.ts` (extend)
- `src/lib/pinnacles.ts` (extend)
- `src/lib/personalCycles.ts` (extend)
- `src/lib/__tests__/numerology.test.ts` (add tests)
- `src/lib/__tests__/karmic.test.ts` (add tests)
- `src/lib/__tests__/pinnacles.test.ts` (add tests)
- `src/lib/__tests__/personalCycles.test.ts` (add tests)

### Output
- Funcții pure TypeScript pentru calcule avansate
- Tests complete pentru toate funcțiile noi
- Documentație JSDoc

---

## 📦 FAZA 2: ANALIZE NUMEROLOGICE EXTINSE (ADRESE, TELEFOANE, MAȘINI)
**Complexitate**: MEDIUM  
**Durată estimată**: 10-14 ore  
**Dependențe**: FAZA 1

### Scop
Implementarea analizelor numerologice pentru adrese, numere de telefon, numere de mașină.

### Sub-tasks

#### PHASE 2.1: Analiza adreselor (lib/locationAnalysis.ts) (Sequential)
- [ ] **T1**: Implementare `analyzeAddress()` - analiză adresă domiciliu
- [ ] **T2**: Implementare `analyzeOfficeAddress()` - analiză adresă birou
- [ ] **T3**: Implementare `compareAddresses()` - comparație între adrese
- [ ] **T4**: Implementare `getAddressRecommendations()` - recomandări pentru alegerea adreselor
- → **VERIFY**: TypeScript compile, tests pass

#### PHASE 2.2: Analiza numerelor de telefon (lib/phoneAnalysis.ts) (Sequential)
- [ ] **T5**: Implementare `analyzePhoneNumber()` - analiză număr telefon mobil
- [ ] **T6**: Implementare `analyzeLandlineNumber()` - analiză telefon fix
- [ ] **T7**: Implementare `getPhoneRecommendations()` - recomandări pentru numere
- [ ] **T8**: Implementare `analyzeCommunicationImpact()` - impact asupra comunicării
- → **VERIFY**: TypeScript compile, tests pass

#### PHASE 2.3: Analiza numerelor de mașină (lib/vehicleAnalysis.ts) (Sequential)
- [ ] **T9**: Implementare `analyzeLicensePlate()` - analiză număr înmatriculare
- [ ] **T10**: Implementare `calculateVehicleCompatibility()` - compatibilitate cu proprietar
- → **VERIFY**: TypeScript compile, tests pass

#### PHASE 2.4: Analiza datelor importante (lib/dateAnalysis.ts) (Sequential)
- [ ] **T11**: Implementare `analyzeWeddingDate()` - analiză dată nuntă
- [ ] **T12**: Implementare `analyzeBusinessLaunchDate()` - analiză dată lansare afacere
- [ ] **T13**: Implementare `analyzeMovingDate()` - analiză dată mutare
- [ ] **T14**: Implementare `getOptimalDateRange()` - calendar optim pentru evenimente
- → **VERIFY**: TypeScript compile, tests pass

#### PHASE 2.5: Traduceri (Parallel - 1 thread)
- [ ] **T15**: Adăugare traduceri pentru toate funcționalitățile noi (RO/EN/RU)
- → **VERIFY**: Toate traducerile complete

### Files Created
- `src/lib/locationAnalysis.ts` (new)
- `src/lib/phoneAnalysis.ts` (new)
- `src/lib/vehicleAnalysis.ts` (new)
- `src/lib/dateAnalysis.ts` (new)
- `src/lib/__tests__/locationAnalysis.test.ts` (new)
- `src/lib/__tests__/phoneAnalysis.test.ts` (new)
- `src/lib/__tests__/vehicleAnalysis.test.ts` (new)
- `src/lib/__tests__/dateAnalysis.test.ts` (new)

### Files Modified
- `src/lib/translations.ts` (add new sections)

### Output
- Funcții pure pentru analize extinse
- Tests complete
- Traduceri în toate limbile

---

## 📦 FAZA 3: ANALIZA COMPLETĂ A NUMELUI
**Complexitate**: MEDIUM  
**Durată estimată**: 8-10 ore  
**Dependențe**: FAZA 1

### Scop
Extinderea analizei numelui cu funcționalități detaliate: analiza fiecărei litere, consonanțe/vocale separate, sugestii de optimizare.

### Sub-tasks

#### PHASE 3.1: Extindere lib/nameAnalysis.ts (Sequential)
- [ ] **T1**: Implementare `analyzeIndividualLetters()` - analiză fiecare literă individual
- [ ] **T2**: Implementare `analyzeVowelsSeparately()` - analiză vocale separate
- [ ] **T3**: Implementare `analyzeConsonantsSeparately()` - analiză consoane separate
- [ ] **T4**: Implementare `findHiddenNumbers()` - numere ascunse în nume
- [ ] **T5**: Implementare `getNameOptimizationSuggestions()` - sugestii pentru optimizarea numelui
- → **VERIFY**: TypeScript compile, tests pass

#### PHASE 3.2: Componente UI (Parallel - 2 threads)
- [ ] **T6**: Creare `NameAnalysisCard.tsx` - card pentru analiza completă
- [ ] **T7**: Creare `LetterAnalysisChart.tsx` - grafic pentru distribuția literelor
- → **VERIFY**: Components render correctly

#### PHASE 3.3: Integrare în pagina Index (Sequential)
- [ ] **T8**: Integrare componente în `src/pages/Index.tsx`
- [ ] **T9**: Adăugare traduceri pentru UI
- → **VERIFY**: Full integration test

### Files Modified
- `src/lib/nameAnalysis.ts` (extend)
- `src/components/NameAnalysisCard.tsx` (new)
- `src/components/charts/LetterAnalysisChart.tsx` (new)
- `src/pages/Index.tsx` (integrate)
- `src/lib/translations.ts` (add keys)

### Output
- Analiză completă a numelui cu detalii extinse
- Componente UI pentru vizualizare
- Integrare în pagina principală

---

## 📦 FAZA 4: COMPATIBILITATE EXTINSĂ
**Complexitate**: MEDIUM  
**Durată estimată**: 10-12 ore  
**Dependențe**: FAZA 1

### Scop
Extinderea sistemului de compatibilitate cu tipuri de relații, analiza dinamicii, comparație multi-persoană.

### Sub-tasks

#### PHASE 4.1: Extindere lib/compatibility.ts (Sequential)
- [ ] **T1**: Implementare `calculateRomanticCompatibility()` - compatibilitate romantică detaliată
- [ ] **T2**: Implementare `calculateFriendshipCompatibility()` - compatibilitate prietenie
- [ ] **T3**: Implementare `calculateProfessionalCompatibility()` - compatibilitate profesională/afaceri
- [ ] **T4**: Implementare `calculateFamilyCompatibility()` - compatibilitate familială
- [ ] **T5**: Implementare `analyzeRelationshipDynamics()` - analiză dinamică relație
- [ ] **T6**: Implementare `getRelationshipStrengths()` - puncte forte
- [ ] **T7**: Implementare `getRelationshipChallenges()` - provocări potențiale
- [ ] **T8**: Implementare `getRelationshipRecommendations()` - recomandări pentru îmbunătățire
- → **VERIFY**: TypeScript compile, tests pass

#### PHASE 4.2: Comparație multi-persoană (lib/multiPersonCompatibility.ts) (Sequential)
- [ ] **T9**: Implementare `compareMultiplePeople()` - comparație 3+ persoane
- [ ] **T10**: Implementare `analyzeGroupCompatibility()` - analiză grup (familie, echipă)
- [ ] **T11**: Implementare `calculateGroupHarmony()` - armonie în grupuri
- → **VERIFY**: TypeScript compile, tests pass

#### PHASE 4.3: Componente UI (Parallel - 3 threads)
- [ ] **T12**: Creare `RelationshipTypeSelector.tsx` - selector tip relație
- [ ] **T13**: Creare `RelationshipDynamicsCard.tsx` - card dinamică relație
- [ ] **T14**: Creare `MultiPersonComparison.tsx` - componentă comparație multi-persoană
- → **VERIFY**: Components render correctly

#### PHASE 4.4: Extindere pagina Compatibility (Sequential)
- [ ] **T15**: Extindere `src/pages/Compatibility.tsx` cu funcționalități noi
- [ ] **T16**: Adăugare traduceri
- → **VERIFY**: Full integration test

### Files Created
- `src/lib/multiPersonCompatibility.ts` (new)
- `src/components/RelationshipTypeSelector.tsx` (new)
- `src/components/RelationshipDynamicsCard.tsx` (new)
- `src/components/MultiPersonComparison.tsx` (new)

### Files Modified
- `src/lib/compatibility.ts` (extend)
- `src/pages/Compatibility.tsx` (extend)
- `src/lib/translations.ts` (add keys)

### Output
- Sistem de compatibilitate extins cu tipuri de relații
- Comparație multi-persoană
- Componente UI complete

---

## 📦 FAZA 5: PREVIZIUNI EXTINSE ȘI CALENDAR NUMEROLOGIC
**Complexitate**: HIGH  
**Durată estimată**: 14-18 ore  
**Dependențe**: FAZA 1, FAZA 4

### Scop
Implementarea previziunilor zilnice/săptămânale/lunare/anuale extinse și calendar numerologic interactiv.

### Sub-tasks

#### PHASE 5.1: Previziuni zilnice detaliate (lib/dailyPredictions.ts) (Sequential)
- [ ] **T1**: Implementare `calculatePersonalDayNumber()` - număr personal al zilei
- [ ] **T2**: Implementare `calculateUniversalDayEnergy()` - energie universală zilei
- [ ] **T3**: Implementare `getDayRecommendations()` - recomandări pentru zi
- [ ] **T4**: Implementare `calculateDayColor()` - culoarea zilei (numerologie cromatică)
- [ ] **T5**: Implementare `getDayMusicRecommendations()` - cântece/ritmuri recomandate
- → **VERIFY**: TypeScript compile, tests pass

#### PHASE 5.2: Previziuni săptămânale/lunare (lib/weeklyMonthlyPredictions.ts) (Sequential)
- [ ] **T6**: Implementare `calculateWeeklyTheme()` - tema săptămânii
- [ ] **T7**: Implementare `calculateWeeklyEvents()` - evenimente importante săptămâna
- [ ] **T8**: Implementare `calculateMonthlyTheme()` - tema lunii
- [ ] **T9**: Implementare `calculateMonthlyFocus()` - focus-uri lunare
- [ ] **T10**: Implementare `getMonthlyRecommendations()` - recomandări pentru lună
- → **VERIFY**: TypeScript compile, tests pass

#### PHASE 5.3: Previziuni anuale și cicluri (lib/annualPredictions.ts) (Sequential)
- [ ] **T11**: Implementare `calculateAnnualTheme()` - tema anului
- [ ] **T12**: Implementare `calculateAnnualOpportunities()` - oportunități majore
- [ ] **T13**: Implementare `calculateAnnualChallenges()` - provocări anuale
- [ ] **T14**: Implementare `calculateCycleTransitions()` - tranziții importante
- → **VERIFY**: TypeScript compile, tests pass

#### PHASE 5.4: Calendar numerologic (lib/numerologyCalendar.ts) (Sequential)
- [ ] **T15**: Implementare `getFavorableDays()` - zile favorabile
- [ ] **T16**: Implementare `getUnfavorableDays()` - zile nefavorabile
- [ ] **T17**: Implementare `getOptimalDaysForAction()` - zile optime pentru acțiuni specifice
- [ ] **T18**: Implementare `analyzeEventDate()` - analiză dată eveniment
- → **VERIFY**: TypeScript compile, tests pass

#### PHASE 5.5: Componente UI (Parallel - 3 threads)
- [ ] **T19**: Creare `DailyPredictionCard.tsx` - card previziune zilnică
- [ ] **T20**: Creare `WeeklyMonthlyPredictionCard.tsx` - card săptămânal/lunar
- [ ] **T21**: Creare `NumerologyCalendar.tsx` - calendar interactiv (extend existing)
- → **VERIFY**: Components render correctly

#### PHASE 5.6: Extindere pagina Predictions (Sequential)
- [ ] **T22**: Extindere `src/pages/Predictions.tsx` cu funcționalități noi
- [ ] **T23**: Adăugare traduceri
- → **VERIFY**: Full integration test

### Files Created
- `src/lib/dailyPredictions.ts` (new)
- `src/lib/weeklyMonthlyPredictions.ts` (new)
- `src/lib/annualPredictions.ts` (new)
- `src/lib/numerologyCalendar.ts` (new)
- `src/components/DailyPredictionCard.tsx` (new)
- `src/components/WeeklyMonthlyPredictionCard.tsx` (new)

### Files Modified
- `src/lib/predictions.ts` (extend)
- `src/components/NumerologyCalendar.tsx` (extend)
- `src/pages/Predictions.tsx` (extend)
- `src/lib/translations.ts` (add keys)

### Output
- Sistem complet de previziuni zilnice/săptămânale/lunare/anuale
- Calendar numerologic interactiv
- Componente UI pentru toate tipurile de previziuni

---

## 📦 FAZA 6: EXPORT ȘI PARTAJARE
**Complexitate**: MEDIUM  
**Durată estimată**: 10-12 ore  
**Dependențe**: FAZA 1-5

### Scop
Implementarea exportului PDF, partajare pe social media, partajare prin email/link.

### Sub-tasks

#### PHASE 6.1: Export PDF (lib/pdfExport.ts) (Sequential)
- [ ] **T1**: Implementare `generateFullReportPDF()` - raport complet PDF
- [ ] **T2**: Implementare `generateCustomReportPDF()` - raport personalizat
- [ ] **T3**: Implementare `applyPDFBranding()` - opțiuni de branding
- [ ] **T4**: Integrare bibliotecă PDF (jsPDF sau similar)
- → **VERIFY**: PDF generation works

#### PHASE 6.2: Partajare social media (lib/socialShare.ts) (Sequential)
- [ ] **T5**: Implementare `shareToFacebook()` - partajare Facebook
- [ ] **T6**: Implementare `shareToInstagram()` - partajare Instagram (stories/post)
- [ ] **T7**: Implementare `shareToTwitter()` - partajare Twitter/X
- [ ] **T8**: Implementare `shareToWhatsApp()` - partajare WhatsApp
- → **VERIFY**: Share functions work

#### PHASE 6.3: Partajare email (lib/emailShare.ts) (Sequential)
- [ ] **T9**: Implementare `sendReportByEmail()` - trimite raport prin email
- [ ] **T10**: Implementare `scheduleEmailReports()` - email-uri programate
- [ ] **T11**: Implementare `createEmailTemplate()` - template-uri personalizate
- → **VERIFY**: Email functionality works (mock or real)

#### PHASE 6.4: Partajare prin link (lib/linkShare.ts) (Sequential)
- [ ] **T12**: Implementare `generateShareableLink()` - link partajabil pentru profil
- [ ] **T13**: Implementare `generateCompatibilityLink()` - link partajabil pentru compatibilitate
- [ ] **T14**: Implementare `createTemporaryLink()` - link-uri temporare/expirabile
- → **VERIFY**: Link generation works

#### PHASE 6.5: Componente UI (Parallel - 2 threads)
- [ ] **T15**: Creare `ExportMenu.tsx` - meniu export/partajare
- [ ] **T16**: Creare `ShareButtons.tsx` - butoane partajare social media
- → **VERIFY**: Components render correctly

#### PHASE 6.6: Integrare în pagini (Sequential)
- [ ] **T17**: Integrare în `src/pages/Index.tsx` (export raport)
- [ ] **T18**: Integrare în `src/pages/Compatibility.tsx` (partajare compatibilitate)
- [ ] **T19**: Adăugare traduceri
- → **VERIFY**: Full integration test

### Files Created
- `src/lib/pdfExport.ts` (new)
- `src/lib/socialShare.ts` (new)
- `src/lib/emailShare.ts` (new)
- `src/lib/linkShare.ts` (new)
- `src/components/ExportMenu.tsx` (new)
- `src/components/ShareButtons.tsx` (new)

### Files Modified
- `src/pages/Index.tsx` (add export)
- `src/pages/Compatibility.tsx` (add share)
- `src/lib/translations.ts` (add keys)
- `package.json` (add PDF library dependency)

### Output
- Export PDF complet
- Partajare pe toate platformele sociale
- Partajare prin email și link-uri

---

## 📦 FAZA 7: PROFILURI MULTIPLE ȘI GESTIUNE AVANSATĂ
**Complexitate**: MEDIUM  
**Durată estimată**: 8-10 ore  
**Dependențe**: Backend API existent

### Scop
Implementarea gestionării profilurilor multiple, schimbare rapidă, comparație între profiluri.

### Sub-tasks

#### PHASE 7.1: Backend API extins (server/src/routes/profiles.ts) (Sequential)
- [ ] **T1**: Extindere endpoint pentru profiluri multiple
- [ ] **T2**: Implementare `getAllProfiles()` - obține toate profilurile utilizatorului
- [ ] **T3**: Implementare `createProfile()` - creează profil nou
- [ ] **T4**: Implementare `updateProfile()` - actualizează profil
- [ ] **T5**: Implementare `deleteProfile()` - șterge profil
- [ ] **T6**: Implementare `setActiveProfile()` - setează profil activ
- → **VERIFY**: API endpoints work

#### PHASE 7.2: Frontend - Context și hooks (Sequential)
- [ ] **T7**: Extindere `src/contexts/AuthContext.tsx` pentru profiluri multiple
- [ ] **T8**: Creare `src/hooks/use-profiles.ts` - hook pentru gestionare profiluri
- [ ] **T9**: Implementare `switchProfile()` - schimbare rapidă între profiluri
- → **VERIFY**: Context and hooks work

#### PHASE 7.3: Componente UI (Parallel - 2 threads)
- [ ] **T10**: Creare `ProfileSwitcher.tsx` - selector profiluri
- [ ] **T11**: Creare `ProfileComparison.tsx` - comparație între profiluri proprii
- → **VERIFY**: Components render correctly

#### PHASE 7.4: Extindere pagina Profile (Sequential)
- [ ] **T12**: Extindere `src/pages/Profile.tsx` cu gestionare multiple
- [ ] **T13**: Adăugare traduceri
- → **VERIFY**: Full integration test

### Files Modified
- `server/src/routes/profiles.ts` (extend)
- `src/contexts/AuthContext.tsx` (extend)
- `src/pages/Profile.tsx` (extend)

### Files Created
- `src/hooks/use-profiles.ts` (new)
- `src/components/ProfileSwitcher.tsx` (new)
- `src/components/ProfileComparison.tsx` (new)

### Output
- Gestionare completă profiluri multiple
- Schimbare rapidă între profiluri
- Comparație între profiluri

---

## 📦 FAZA 8: FUNCȚIONALITĂȚI EDUCAȚIONALE
**Complexitate**: HIGH  
**Durată estimată**: 16-20 ore  
**Dependențe**: FAZA 1

### Scop
Implementarea cursurilor interactive, tutoriale video, ghiduri detaliate, quiz-uri, bibliotecă de articole.

### Sub-tasks

#### PHASE 8.1: Sistem de cursuri (lib/courses.ts) (Sequential)
- [ ] **T1**: Definire structură cursuri (lessons, progress, certificates)
- [ ] **T2**: Implementare `getCourseProgress()` - progres tracking
- [ ] **T3**: Implementare `completeLesson()` - completare lecție
- [ ] **T4**: Implementare `getCertificate()` - certificare la finalizare
- → **VERIFY**: Course system logic works

#### PHASE 8.2: Ghiduri detaliate (lib/guides.ts) (Sequential)
- [ ] **T5**: Creare conținut ghid pentru fiecare număr (1-9, 11, 22, 33)
- [ ] **T6**: Creare ghid pentru calcule
- [ ] **T7**: Creare ghid pentru interpretări
- [ ] **T8**: Structurare conținut în format JSON/TypeScript
- → **VERIFY**: Guides content complete

#### PHASE 8.3: Quiz-uri și teste (lib/quizzes.ts) (Sequential)
- [ ] **T9**: Implementare `createQuiz()` - creare quiz
- [ ] **T10**: Implementare `checkQuizAnswer()` - verificare răspunsuri
- [ ] **T11**: Implementare `getQuizStatistics()` - statistici progres
- [ ] **T12**: Implementare `awardBadge()` - badge-uri pentru realizări
- → **VERIFY**: Quiz system works

#### PHASE 8.4: Bibliotecă de articole (lib/articles.ts) (Sequential)
- [ ] **T13**: Creare structură articole (categorii, tags, search)
- [ ] **T14**: Implementare `getArticlesByCategory()` - articole pe categorii
- [ ] **T15**: Implementare `searchArticles()` - căutare articole
- [ ] **T16**: Creare conținut inițial (istoria numerologiei, studii de caz)
- → **VERIFY**: Article system works

#### PHASE 8.5: Componente UI (Parallel - 4 threads)
- [ ] **T17**: Creare `CourseCard.tsx` - card curs
- [ ] **T18**: Creare `GuideViewer.tsx` - viewer ghiduri
- [ ] **T19**: Creare `QuizComponent.tsx` - componentă quiz
- [ ] **T20**: Creare `ArticleLibrary.tsx` - bibliotecă articole
- → **VERIFY**: Components render correctly

#### PHASE 8.6: Pagini noi (Sequential)
- [ ] **T21**: Creare `src/pages/Courses.tsx` - pagină cursuri
- [ ] **T22**: Creare `src/pages/Articles.tsx` - pagină articole
- [ ] **T23**: Extindere `src/pages/Tutorials.tsx` - integrare quiz-uri și ghiduri
- [ ] **T24**: Adăugare rute în `src/App.tsx`
- [ ] **T25**: Adăugare traduceri
- → **VERIFY**: Full integration test

### Files Created
- `src/lib/courses.ts` (new)
- `src/lib/guides.ts` (new)
- `src/lib/quizzes.ts` (new)
- `src/lib/articles.ts` (new)
- `src/components/CourseCard.tsx` (new)
- `src/components/GuideViewer.tsx` (new)
- `src/components/QuizComponent.tsx` (new)
- `src/components/ArticleLibrary.tsx` (new)
- `src/pages/Courses.tsx` (new)
- `src/pages/Articles.tsx` (new)

### Files Modified
- `src/pages/Tutorials.tsx` (extend)
- `src/App.tsx` (add routes)
- `src/lib/translations.ts` (add keys)

### Output
- Sistem complet educațional cu cursuri, quiz-uri, ghiduri
- Bibliotecă de articole
- Pagini dedicate pentru fiecare funcționalitate

---

## 📦 FAZA 9: PERSONALIZARE INTERFAȚĂ (TEME VIZUALE)
**Complexitate**: MEDIUM  
**Durată estimată**: 10-12 ore  
**Dependențe**: None

### Scop
Implementarea temelor vizuale multiple (Dawn, Twilight, Midnight, Celestial, Personalizată).

### Sub-tasks

#### PHASE 9.1: Sistem de teme (contexts/ThemeContext.tsx) (Sequential)
- [ ] **T1**: Creare `src/contexts/ThemeContext.tsx` - context pentru teme
- [ ] **T2**: Definire teme (Dawn, Twilight, Midnight, Celestial)
- [ ] **T3**: Implementare `setTheme()` - schimbare temă
- [ ] **T4**: Implementare `saveThemePreference()` - salvare preferințe
- → **VERIFY**: Theme context works

#### PHASE 9.2: CSS Variables pentru teme (index.css) (Sequential)
- [ ] **T5**: Definire variabile CSS pentru tema Dawn (aurori, golds calde)
- [ ] **T6**: Definire variabile CSS pentru tema Midnight (albastru profund, argint)
- [ ] **T7**: Definire variabile CSS pentru tema Celestial (spațiu, constelații)
- [ ] **T8**: Păstrare tema Twilight (actuală) ca default
- → **VERIFY**: Themes render correctly

#### PHASE 9.3: Tema personalizată (lib/customTheme.ts) (Sequential)
- [ ] **T9**: Implementare `createCustomTheme()` - creare temă personalizată
- [ ] **T10**: Implementare `saveCustomTheme()` - salvare temă utilizator
- [ ] **T11**: Implementare `loadCustomTheme()` - încărcare temă salvată
- → **VERIFY**: Custom theme works

#### PHASE 9.4: Setări de afișare (components/Settings.tsx) (Sequential)
- [ ] **T12**: Creare `src/components/Settings.tsx` - componentă setări
- [ ] **T13**: Implementare control dimensiune font
- [ ] **T14**: Implementare control contrast (accesibilitate)
- [ ] **T15**: Implementare toggle animații on/off
- [ ] **T16**: Implementare selector layout preferat
- → **VERIFY**: Settings component works

#### PHASE 9.5: Componente UI (Parallel - 2 threads)
- [ ] **T17**: Creare `ThemeSelector.tsx` - selector teme
- [ ] **T18**: Creare `CustomThemeBuilder.tsx` - builder temă personalizată
- → **VERIFY**: Components render correctly

#### PHASE 9.6: Integrare în header (Sequential)
- [ ] **T19**: Integrare `ThemeSelector.tsx` în `src/components/layout/AppHeader.tsx`
- [ ] **T20**: Adăugare traduceri
- → **VERIFY**: Full integration test

### Files Created
- `src/contexts/ThemeContext.tsx` (new)
- `src/lib/customTheme.ts` (new)
- `src/components/Settings.tsx` (new)
- `src/components/ThemeSelector.tsx` (new)
- `src/components/CustomThemeBuilder.tsx` (new)

### Files Modified
- `src/index.css` (add theme variables)
- `src/components/layout/AppHeader.tsx` (add theme selector)
- `src/lib/translations.ts` (add keys)

### Output
- 4 teme vizuale predefinite
- Tema personalizată pentru utilizatori
- Setări de afișare complete

---

## 📦 FAZA 10: JURNAL NUMEROLOGIC ȘI TRACKING
**Complexitate**: MEDIUM  
**Durată estimată**: 10-12 ore  
**Dependențe**: FAZA 7 (profiluri), Backend API

### Scop
Implementarea jurnalului personal, tracking progres, statistici personale, istoric previziuni.

### Sub-tasks

#### PHASE 10.1: Backend API - Jurnal (server/src/routes/journal.ts) (Sequential)
- [ ] **T1**: Creare endpoint `POST /api/journal/entry` - adaugă intrare jurnal
- [ ] **T2**: Creare endpoint `GET /api/journal/entries` - obține intrări
- [ ] **T3**: Creare endpoint `PUT /api/journal/entry/:id` - actualizează intrare
- [ ] **T4**: Creare endpoint `DELETE /api/journal/entry/:id` - șterge intrare
- [ ] **T5**: Creare endpoint `GET /api/journal/statistics` - statistici personale
- → **VERIFY**: API endpoints work

#### PHASE 10.2: Frontend - Jurnal logic (lib/journal.ts) (Sequential)
- [ ] **T6**: Implementare `createJournalEntry()` - creare intrare
- [ ] **T7**: Implementare `getJournalEntries()` - obține intrări
- [ ] **T8**: Implementare `calculatePersonalStatistics()` - statistici personale
- [ ] **T9**: Implementare `identifyPatterns()` - identificare pattern-uri
- → **VERIFY**: Journal logic works

#### PHASE 10.3: Istoric previziuni (lib/predictionHistory.ts) (Sequential)
- [ ] **T10**: Implementare `savePrediction()` - salvare previziune
- [ ] **T11**: Implementare `getPredictionHistory()` - istoric previziuni
- [ ] **T12**: Implementare `analyzePredictionAccuracy()` - acuratețe previziuni
- [ ] **T13**: Implementare `compareTimePeriods()` - comparație temporală
- → **VERIFY**: Prediction history works

#### PHASE 10.4: Componente UI (Parallel - 3 threads)
- [ ] **T14**: Creare `JournalEntry.tsx` - componentă intrare jurnal
- [ ] **T15**: Creare `PersonalStatistics.tsx` - statistici personale
- [ ] **T16**: Creare `PredictionHistory.tsx` - istoric previziuni
- → **VERIFY**: Components render correctly

#### PHASE 10.5: Pagină Jurnal (Sequential)
- [ ] **T17**: Creare `src/pages/Journal.tsx` - pagină jurnal
- [ ] **T18**: Adăugare rută în `src/App.tsx`
- [ ] **T19**: Adăugare traduceri
- → **VERIFY**: Full integration test

### Files Created
- `server/src/routes/journal.ts` (new)
- `src/lib/journal.ts` (new)
- `src/lib/predictionHistory.ts` (new)
- `src/components/JournalEntry.tsx` (new)
- `src/components/PersonalStatistics.tsx` (new)
- `src/components/PredictionHistory.tsx` (new)
- `src/pages/Journal.tsx` (new)

### Files Modified
- `src/App.tsx` (add route)
- `src/lib/translations.ts` (add keys)

### Output
- Jurnal personal complet
- Tracking progres și statistici
- Istoric previziuni cu analiză acuratețe

---

## 📦 FAZA 11: FUNCȚIONALITĂȚI PREMIUM ȘI MONETIZARE
**Complexitate**: HIGH  
**Durată estimată**: 18-24 ore  
**Dependențe**: Backend API, Payment integration

### Scop
Implementarea sistemului de abonamente premium, rapoarte avansate, consultanță AI, limitări pentru utilizatori free.

### Sub-tasks

#### PHASE 11.1: Backend - Sistem de abonamente (server/src/routes/subscriptions.ts) (Sequential)
- [ ] **T1**: Creare model Subscription în baza de date
- [ ] **T2**: Implementare `createSubscription()` - creare abonament
- [ ] **T3**: Implementare `checkSubscriptionStatus()` - verificare status
- [ ] **T4**: Implementare `cancelSubscription()` - anulare abonament
- [ ] **T5**: Integrare payment gateway (Stripe/PayPal)
- → **VERIFY**: Subscription system works

#### PHASE 11.2: Backend - Rate limiting (server/src/middleware/rateLimit.ts) (Sequential)
- [ ] **T6**: Implementare rate limiting pentru utilizatori free
- [ ] **T7**: Implementare limitări pe funcționalități
- [ ] **T8**: Implementare upgrade prompts
- → **VERIFY**: Rate limiting works

#### PHASE 11.3: Rapoarte avansate (lib/advancedReports.ts) (Sequential)
- [ ] **T9**: Implementare `generateAdvancedReport()` - raport avansat PDF
- [ ] **T10**: Implementare `generateProfessionalInterpretation()` - interpretări profesionale
- [ ] **T11**: Implementare `createCustomReport()` - raport personalizat
- → **VERIFY**: Advanced reports work

#### PHASE 11.4: Chatbot AI numerologic (lib/aiConsultant.ts) (Sequential)
- [ ] **T12**: Integrare AI API (OpenAI/Claude)
- [ ] **T13**: Implementare `askNumerologyQuestion()` - răspunsuri la întrebări
- [ ] **T14**: Implementare `getClarifications()` - clarificări în timp real
- [ ] **T15**: Implementare context numerologic pentru AI
- → **VERIFY**: AI consultant works

#### PHASE 11.5: Componente UI Premium (Parallel - 3 threads)
- [ ] **T16**: Creare `SubscriptionPlans.tsx` - planuri abonamente
- [ ] **T17**: Creare `UpgradePrompt.tsx` - prompt upgrade
- [ ] **T18**: Creare `AIConsultant.tsx` - componentă chatbot AI
- → **VERIFY**: Components render correctly

#### PHASE 11.6: Pagină Premium (Sequential)
- [ ] **T19**: Creare `src/pages/Premium.tsx` - pagină premium
- [ ] **T20**: Adăugare rută în `src/App.tsx`
- [ ] **T21**: Adăugare traduceri
- → **VERIFY**: Full integration test

### Files Created
- `server/src/routes/subscriptions.ts` (new)
- `server/src/middleware/rateLimit.ts` (new)
- `src/lib/advancedReports.ts` (new)
- `src/lib/aiConsultant.ts` (new)
- `src/components/SubscriptionPlans.tsx` (new)
- `src/components/UpgradePrompt.tsx` (new)
- `src/components/AIConsultant.tsx` (new)
- `src/pages/Premium.tsx` (new)

### Files Modified
- `src/App.tsx` (add route)
- `src/lib/translations.ts` (add keys)
- `server/src/db.ts` (add subscription tables)

### Output
- Sistem complet de abonamente premium
- Rapoarte avansate și AI consultant
- Rate limiting și upgrade prompts

---

## 📦 FAZA 12: INTEGRĂRI ȘI FUNCȚIONALITĂȚI AVANSATE
**Complexitate**: HIGH  
**Durată estimată**: 20-28 ore  
**Dependențe**: FAZA 1-11

### Scop
Implementarea integrărilor cu astrologie/tarot, sincronizare cloud, funcționalități mobile-native (widget-uri, notificări), accesibilitate extinsă, gamification.

### Sub-tasks

#### PHASE 12.1: Integrare astrologie (lib/astrologyIntegration.ts) (Sequential)
- [ ] **T1**: Integrare API astrologie (sau calcul local)
- [ ] **T2**: Implementare `calculateNatalChart()` - hărți natale
- [ ] **T3**: Implementare `calculateAstrologicalCompatibility()` - compatibilitate astrologică
- [ ] **T4**: Implementare `combineNumerologyAstrology()` - combinare numerologie + astrologie
- → **VERIFY**: Astrology integration works

#### PHASE 12.2: Integrare tarot (lib/tarotIntegration.ts) (Sequential)
- [ ] **T5**: Implementare `getDailyTarotReading()` - citiri tarot zilnice
- [ ] **T6**: Implementare `getTarotSpread()` - spread-uri tarot
- [ ] **T7**: Implementare `combineNumerologyTarot()` - combinare cu numerologie
- → **VERIFY**: Tarot integration works

#### PHASE 12.3: Sincronizare cloud (lib/cloudSync.ts) (Sequential)
- [ ] **T8**: Implementare `syncToCloud()` - sincronizare automată
- [ ] **T9**: Implementare `backupData()` - backup în cloud
- [ ] **T10**: Implementare `restoreData()` - restaurare date
- [ ] **T11**: Implementare `exportAllData()` - export toate datele
- [ ] **T12**: Implementare `importData()` - import date
- → **VERIFY**: Cloud sync works

#### PHASE 12.4: Widget-uri și notificări (lib/widgets.ts) (Sequential)
- [ ] **T13**: Implementare `generateWidgetData()` - date pentru widget-uri
- [ ] **T14**: Implementare `scheduleNotifications()` - programare notificări
- [ ] **T15**: Implementare `sendDailyNotification()` - notificări zilnice
- [ ] **T16**: Implementare `sendEventNotification()` - notificări evenimente
- → **VERIFY**: Widgets and notifications work

#### PHASE 12.5: Accesibilitate extinsă (lib/accessibility.ts) (Sequential)
- [ ] **T17**: Implementare screen reader support complet
- [ ] **T18**: Implementare moduri contrast (ridicat, daltonic)
- [ ] **T19**: Implementare control animații
- [ ] **T20**: Implementare suport tastatură complet
- → **VERIFY**: Accessibility features work

#### PHASE 12.6: Gamification (lib/gamification.ts) (Sequential)
- [ ] **T21**: Implementare `awardBadge()` - badge-uri realizări
- [ ] **T22**: Implementare `calculateXP()` - sistem XP
- [ ] **T23**: Implementare `getUserLevel()` - nivel utilizator
- [ ] **T24**: Implementare `createChallenge()` - provocări săptămânale
- → **VERIFY**: Gamification system works

#### PHASE 12.7: Componente UI finale (Parallel - 4 threads)
- [ ] **T25**: Creare `AstrologyCard.tsx` - card astrologie
- [ ] **T26**: Creare `TarotCard.tsx` - card tarot
- [ ] **T27**: Creare `AchievementsBadge.tsx` - badge-uri achievements
- [ ] **T28**: Creare `AccessibilitySettings.tsx` - setări accesibilitate
- → **VERIFY**: Components render correctly

#### PHASE 12.8: Pagini finale (Sequential)
- [ ] **T29**: Creare `src/pages/Integrations.tsx` - pagină integrări
- [ ] **T30**: Extindere setări cu accesibilitate și cloud sync
- [ ] **T31**: Adăugare traduceri finale
- → **VERIFY**: Full integration test

### Files Created
- `src/lib/astrologyIntegration.ts` (new)
- `src/lib/tarotIntegration.ts` (new)
- `src/lib/cloudSync.ts` (new)
- `src/lib/widgets.ts` (new)
- `src/lib/accessibility.ts` (new)
- `src/lib/gamification.ts` (new)
- `src/components/AstrologyCard.tsx` (new)
- `src/components/TarotCard.tsx` (new)
- `src/components/AchievementsBadge.tsx` (new)
- `src/components/AccessibilitySettings.tsx` (new)
- `src/pages/Integrations.tsx` (new)

### Files Modified
- `src/App.tsx` (add routes)
- `src/lib/translations.ts` (add keys)

### Output
- Integrări complete cu astrologie și tarot
- Sincronizare cloud
- Widget-uri și notificări
- Accesibilitate extinsă
- Sistem de gamification

---

## 📊 REZUMAT FINAL

### Statistici Implementare

- **Total faze**: 12
- **Total sub-tasks**: ~280+
- **Durată estimată totală**: 200-250 ore
- **Files noi create**: ~80+
- **Files modificate**: ~40+

### Ordine de Implementare Recomandată

1. **FAZA 1-5**: Foundation (calcule, analize, compatibilitate, previziuni)
2. **FAZA 6-7**: User experience (export, profiluri multiple)
3. **FAZA 8-9**: Education și personalizare
4. **FAZA 10**: Tracking și jurnal
5. **FAZA 11**: Monetizare
6. **FAZA 12**: Integrări avansate

### Checkpoints Critice

După fiecare fază:
- ✅ TypeScript compile fără erori
- ✅ ESLint passes
- ✅ Tests pass
- ✅ Traduceri complete (RO/EN/RU)
- ✅ app-truth.md compliance
- ✅ Mobile responsive
- ✅ Accessibility basics

### Notițe Importante

1. **Paralelizare**: Maximizare paralelizării în fiecare fază (până la 4 agenți simultan)
2. **Verificare**: Verificare după fiecare fază înainte de continuare
3. **Incremental**: Fiecare fază aduce valoare independentă
4. **Testing**: Tests pentru toate funcțiile din lib/
5. **Documentație**: JSDoc pentru toate funcțiile publice

---

**Ultima actualizare**: 2026-01-01  
**Status**: Plan complet, ready for execution

