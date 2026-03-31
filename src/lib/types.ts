export interface GeneradorPublic {
  id: number;
  alias: string;
  disabled: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
}

export interface Pantalla {
  id: number;
  alias: string;
  generador_id: number | null;
}

export interface Contenido {
  id: number;
  url: string;
  fecha_creacion: string;
}

export interface Mensaje {
  id: number;
  conversacion_id: number;
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversacion {
  id: number;
  generador_id: number;
  mensajes: Mensaje[];
}
