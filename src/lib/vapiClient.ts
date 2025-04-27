// src/lib/vapiClient.ts

import  Vapi  from '@vapi-ai/web';

const VAPI_API_KEY = import.meta.env.VITE_VAPI_API_KEY;

export const vapi = new Vapi(VAPI_API_KEY);
