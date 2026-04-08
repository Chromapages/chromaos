import * as fs from 'fs';
import * as path from 'path';

const CLIENTS_ROOT = '/Volumes/MiDRIVE/CHROMAPAGES/clients';

interface PlaceholderFile {
  filename: string;
  label: string;
}

function sanitizeName(name: string): string {
  return name.replace(/[\/\\:*?"<>|]/g, '-').trim();
}

function createPlaceholderFile(filePath: string, filename: string, clientName: string): void {
  const content = `# ${filename} — ${clientName}\n`;
  fs.writeFileSync(filePath, content);
}

export async function createClientFolder(
  clientName: string
): Promise<{ folderPath: string; folderId?: string }> {
  const sanitized = sanitizeName(clientName);
  const folderPath = path.join(CLIENTS_ROOT, sanitized);

  // If it already exists, just return — don't throw
  if (fs.existsSync(folderPath)) {
    return { folderPath };
  }

  // Define all directories to create
  const directories: string[] = [
    path.join(folderPath, '01-LEGAL', 'contracts'),
    path.join(folderPath, '01-LEGAL', 'proposals'),
    path.join(folderPath, '01-LEGAL', 'invoices'),
    path.join(folderPath, '02-DISCOVERY', 'strategy'),
    path.join(folderPath, '02-DISCOVERY', 'research'),
    path.join(folderPath, '02-DISCOVERY', 'brief'),
    path.join(folderPath, '02-DISCOVERY', 'moodboard'),
    path.join(folderPath, '03-DESIGN', 'reference-board'),
    path.join(folderPath, '03-DESIGN', 'designs'),
    path.join(folderPath, '03-DESIGN', 'brand-assets'),
    path.join(folderPath, '04-CONTENT', 'pages'),
    path.join(folderPath, '05-BUILD', 'site'),
    path.join(folderPath, '06-OPS'),
    path.join(folderPath, '07-DELIVERY'),
  ];

  // Create all directories
  for (const dir of directories) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Define placeholder files with their parent directories
  const placeholderFiles: PlaceholderFile[] = [
    { filename: 'DESIGN.md', label: 'Design Brief' },
    { filename: 'sitemap.md', label: 'Sitemap' },
    { filename: 'content-architecture.md', label: 'Content Architecture' },
    { filename: 'build-spec.md', label: 'Build Spec' },
    { filename: 'component-map.md', label: 'Component Map' },
    { filename: 'tracking-map.md', label: 'Tracking Map' },
    { filename: 'preflight-report.md', label: 'Pre-Flight Report' },
    { filename: 'qa-report.md', label: 'QA Report' },
    { filename: 'issues.md', label: 'Issues Log' },
    { filename: 'delivery-report.md', label: 'Delivery Report' },
    { filename: 'client-notes.md', label: 'Client Notes' },
  ];

  const placeholderDirs: Record<string, string> = {
    'DESIGN.md': '03-DESIGN',
    'sitemap.md': '04-CONTENT',
    'content-architecture.md': '04-CONTENT',
    'build-spec.md': '05-BUILD',
    'component-map.md': '05-BUILD',
    'tracking-map.md': '05-BUILD',
    'preflight-report.md': '06-OPS',
    'qa-report.md': '06-OPS',
    'issues.md': '06-OPS',
    'delivery-report.md': '07-DELIVERY',
    'client-notes.md': '07-DELIVERY',
  };

  for (const { filename } of placeholderFiles) {
    const parentDir = placeholderDirs[filename];
    const filePath = path.join(folderPath, parentDir, filename);
    createPlaceholderFile(filePath, filename.replace('.md', ''), sanitized);
  }

  return { folderPath };
}
