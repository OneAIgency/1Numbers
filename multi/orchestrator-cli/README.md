# Real Multi-Agent Orchestrator

Un orchestrator real care execută task-uri în paralel folosind Node.js worker threads.

## Caracteristici

- ✅ Paralelizare reală cu worker threads
- ✅ Management automat de dependențe
- ✅ Execuție în faze (sequential + parallel)
- ✅ Verificare automată după fiecare fază
- ✅ Raportare detaliată

## Instalare

```bash
cd .claude/orchestrator
npm install
```

## Utilizare

### Executare task simplu

```bash
npm start -- --task "Add new feature X"
```

### Executare cu mai mulți workeri

```bash
npm start -- --task "Complex task" --workers 8
```

### Mod verbose

```bash
npm start -- --task "Task" --verbose
```

## Arhitectură

```
orchestrator/
├── index.ts              # Entry point
├── core/
│   ├── Orchestrator.ts   # Main orchestrator class
│   ├── TaskDecomposer.ts # Task analysis & decomposition
│   ├── WorkerPool.ts     # Worker thread management
│   ├── TaskQueue.ts      # Dependency management
│   └── ResultAggregator.ts # Result collection
├── workers/
│   └── taskWorker.js     # Worker thread script
├── executors/
│   └── AgentExecutor.ts  # Agent execution logic
├── types/
│   └── index.ts          # TypeScript types
└── utils/
    └── cli.ts            # CLI parsing
```

## Exemple

### Task simplu (LOW complexity)

```bash
npm start -- --task "Fix bug in compatibility calculation"
```

Execuție:
- Phase 1: Implement fix (sequential)
- Phase 2: Verify (sequential)

### Task complex (HIGH complexity)

```bash
npm start -- --task "Add biorhythm calculator feature"
```

Execuție:
- Phase 1: Analysis (sequential)
- Phase 2: Implementation (parallel - logic + translations)
- Phase 3: Verification & Testing (parallel)

## Dezvoltare

```bash
# Development mode (watch)
npm run dev

# Build
npm run build
```

## Limitări actuale

- Task decomposition este heuristică simplă (nu folosește AI)
- Agent executors sunt simulate (nu generează cod real)
- Worker threads folosesc exec() pentru verificare (poate fi optimizat)

## Roadmap

- [ ] Integrare cu Claude API pentru task decomposition
- [ ] Agent executors reali care generează cod
- [ ] UI pentru monitoring execuție
- [ ] Persistență rezultate în baza de date
- [ ] Retry logic pentru task-uri eșuate

