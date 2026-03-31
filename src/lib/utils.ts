export function isStaticAsset(value: string | null | undefined): boolean {
  return Boolean(value && value.startsWith('/static/'));
}

export function buildAssetUrl(baseUrl: string, assetPath: string): string {
  if (!assetPath) {
    return '';
  }

  if (/^https?:\/\//.test(assetPath)) {
    return assetPath;
  }

  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function formatRouteTitle(pathname: string): string {
  if (pathname.startsWith('/app/create')) {
    return 'Laboratorio Creativo';
  }

  if (pathname.startsWith('/app/screens')) {
    return 'Mis Pantallas';
  }

  return 'Dashboard';
}

export function conversationLabel(id: number): string {
  return `Conversacion #${id}`;
}

export function conversationPreview(content: string | undefined): string {
  if (!content) {
    return 'Sin mensajes todavia';
  }

  if (isStaticAsset(content)) {
    return 'Imagen generada por IA';
  }

  return content;
}

export function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}
