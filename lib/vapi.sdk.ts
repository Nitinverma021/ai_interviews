import Vapi from '@vapi-ai/web'

import { clientEnv } from "@/lib/env.client";

export const vapi = new Vapi(clientEnv.NEXT_PUBLIC_VAPI_WEB_TOKEN);
