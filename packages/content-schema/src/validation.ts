import { z } from 'zod';

// Use the interpreter so validation never probes dynamic code under the web CSP.
z.config({ jitless: true });
export { z };
