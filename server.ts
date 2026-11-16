import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

interface PersistedState {
  settings?: unknown;
  categories?: unknown;
  nominees?: unknown;
  partners?: unknown;
  gallery?: unknown;
  applications?: unknown;
  updatedAt?: string;
}

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'bak_store.json');

let memoryStore: PersistedState = loadStoreFromDisk();

function filterRealNominees(items: unknown): unknown[] {
  if (!Array.isArray(items)) return [];
  return items.filter(
    (item) =>
      Boolean(item) &&
      typeof item === 'object' &&
      (item as { isUserSubmitted?: boolean }).isUserSubmitted === true
  );
}

function loadStoreFromDisk(): PersistedState {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.nominees)) {
          parsed.nominees = filterRealNominees(parsed.nominees);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read persisted store, starting fresh:', err);
  }
  return {};
}

function saveStoreToDisk(nextState: PersistedState): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(nextState, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write persisted store to disk (using memory store):', err);
  }
}

async function startServer(): Promise<void> {
  const app = express();

  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/state', (_req, res) => {
    res.json({ ok: true, data: memoryStore });
  });

  app.put('/api/state', (req, res) => {
    const body = req.body as Record<string, unknown> | undefined;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ ok: false, error: 'Invalid payload' });
      return;
    }

    type StateSectionKey =
      | 'settings'
      | 'categories'
      | 'nominees'
      | 'partners'
      | 'gallery'
      | 'applications';

    const allowedKeys: StateSectionKey[] = [
      'settings',
      'categories',
      'nominees',
      'partners',
      'gallery',
      'applications',
    ];

    const patch: Omit<PersistedState, 'updatedAt'> = {};
    for (const key of allowedKeys) {
      if (key in body && body[key] !== undefined) {
        patch[key] = key === 'nominees' ? filterRealNominees(body[key]) : body[key];
      }
    }

    memoryStore = {
      ...memoryStore,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    saveStoreToDisk(memoryStore);
    res.json({ ok: true, data: memoryStore });
  });

  app.post('/api/nominees', (req, res) => {
    const body = req.body as
      | { nominee?: { id?: string; isUserSubmitted?: boolean }; baseNominees?: unknown[] }
      | undefined;
    const nominee = body?.nominee;
    if (!nominee || typeof nominee !== 'object' || !nominee.id) {
      res.status(400).json({ ok: false, error: 'Invalid nominee payload' });
      return;
    }

    const normalizedNominee = { ...nominee, isUserSubmitted: true };
    const existing = filterRealNominees(
      Array.isArray(memoryStore.nominees) ? memoryStore.nominees : body?.baseNominees
    ) as Array<{ id?: string }>;

    const filtered = existing.filter((item) => item?.id !== normalizedNominee.id);
    const updatedNominees = [normalizedNominee, ...filtered];

    memoryStore = {
      ...memoryStore,
      nominees: updatedNominees,
      updatedAt: new Date().toISOString(),
    };
    saveStoreToDisk(memoryStore);
    res.json({ ok: true, nominees: updatedNominees });
  });

  app.post('/api/applications', (req, res) => {
    const body = req.body as { application?: { id?: string }; baseApplications?: unknown[] } | undefined;
    const application = body?.application;
    if (!application || typeof application !== 'object' || !application.id) {
      res.status(400).json({ ok: false, error: 'Invalid application payload' });
      return;
    }

    const existing = Array.isArray(memoryStore.applications)
      ? (memoryStore.applications as Array<{ id?: string }>)
      : Array.isArray(body?.baseApplications)
      ? (body.baseApplications as Array<{ id?: string }>)
      : [];

    const filtered = existing.filter((item) => item?.id !== application.id);
    const updatedApplications = [application, ...filtered];

    memoryStore = {
      ...memoryStore,
      applications: updatedApplications,
      updatedAt: new Date().toISOString(),
    };
    saveStoreToDisk(memoryStore);
    res.json({ ok: true, applications: updatedApplications });
  });

  app.delete('/api/state', (_req, res) => {
    memoryStore = {};
    try {
      if (fs.existsSync(STORE_FILE)) {
        fs.unlinkSync(STORE_FILE);
      }
    } catch (err) {
      console.warn('Could not remove persisted store file:', err);
    }
    res.json({ ok: true });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(
      '/assets',
      express.static(path.join(distDir, 'assets'), {
        maxAge: '1y',
        immutable: true,
      })
    );
    app.use(
      express.static(distDir, {
        maxAge: '1h',
        index: false,
      })
    );
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
