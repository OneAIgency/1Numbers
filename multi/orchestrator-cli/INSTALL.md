# Instalare Orchestrator

## Pași de instalare

1. **Instalează dependențele**

```bash
cd .claude/orchestrator
npm install
```

2. **Instalează tsx global (opțional, pentru development)**

```bash
npm install -g tsx
```

## Utilizare rapidă

### Din root-ul proiectului:

```bash
npm run orchestrate -- --task "Your task description"
```

### Din directorul orchestrator:

```bash
npm start -- --task "Your task description"
```

## Exemple

```bash
# Task simplu
npm run orchestrate -- --task "Fix bug in Profile page"

# Task cu mai mulți workeri
npm run orchestrate -- --task "Add new feature" --workers 8

# Mod verbose
npm run orchestrate -- --task "Task" --verbose
```

## Note

- Orchestratorul folosește worker threads pentru paralelizare reală
- Task decomposition este heuristică simplă (poate fi îmbunătățită cu AI)
- Agent executors pot fi extinși pentru execuție reală de cod

