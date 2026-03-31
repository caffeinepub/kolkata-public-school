import { Actor, type ActorMethod } from "@icp-sdk/core/agent";
import { idlFactory } from "./declarations/backend.did.js";
import type { backendInterface } from "./backend.d";

export { Category, SchoolRole, UserRole } from "./backend.d";
export type { backendInterface };

export interface CreateActorOptions {
  agentOptions?: Record<string, unknown>;
  agent?: unknown;
  processError?: (error: unknown) => never;
}

export class ExternalBlob {
  private _bytes: Uint8Array | null = null;
  private _url: string | null = null;
  public onProgress: ((percentage: number) => void) | undefined = undefined;

  private constructor() {}

  static fromURL(url: string): ExternalBlob {
    const blob = new ExternalBlob();
    blob._url = url;
    return blob;
  }

  static fromBytes(bytes: Uint8Array<ArrayBuffer>): ExternalBlob {
    const blob = new ExternalBlob();
    blob._bytes = bytes as Uint8Array;
    return blob;
  }

  async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
    if (this._bytes) return this._bytes as Uint8Array<ArrayBuffer>;
    if (this._url) {
      const res = await fetch(this._url);
      const buf = await res.arrayBuffer();
      this._bytes = new Uint8Array(buf);
      return this._bytes as Uint8Array<ArrayBuffer>;
    }
    return new Uint8Array(0) as Uint8Array<ArrayBuffer>;
  }

  getDirectURL(): string {
    return this._url ?? "";
  }

  withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
    const clone = new ExternalBlob();
    clone._bytes = this._bytes;
    clone._url = this._url;
    clone.onProgress = onProgress;
    return clone;
  }
}

type UploadFile = (file: ExternalBlob) => Promise<Uint8Array>;
type DownloadFile = (bytes: Uint8Array) => Promise<ExternalBlob>;

export function createActor(
  canisterId: string,
  uploadFile: UploadFile,
  downloadFile: DownloadFile,
  options?: CreateActorOptions,
): backendInterface {
  const actorConfig = {
    canisterId,
    agent: options?.agent as any,
  };

  const rawActor = Actor.createActor<Record<string, ActorMethod>>(idlFactory, actorConfig);

  const processError = options?.processError;

  const handler: ProxyHandler<typeof rawActor> = {
    get(target, prop) {
      if (typeof prop !== "string") return (target as any)[prop];
      const method = (target as any)[prop];
      if (typeof method !== "function") return method;
      return async (...args: unknown[]) => {
        try {
          const serializedArgs = await Promise.all(
            args.map(async (arg) => {
              if (arg instanceof ExternalBlob) {
                return uploadFile(arg);
              }
              // Handle variant objects (Category, SchoolRole etc.)
              if (arg && typeof arg === "object" && !Array.isArray(arg)) {
                const keys = Object.keys(arg as object);
                if (keys.length === 1 && (arg as any)[keys[0]] === null) {
                  return arg;
                }
              }
              return arg;
            })
          );
          const result = await (method as (...a: unknown[]) => Promise<unknown>)(...serializedArgs);
          return deserializeResult(result, downloadFile);
        } catch (e) {
          if (processError) processError(e);
          throw e;
        }
      };
    },
  };

  return new Proxy(rawActor, handler) as unknown as backendInterface;
}

function deserializeResult(result: unknown, _downloadFile: DownloadFile): unknown {
  if (Array.isArray(result)) {
    return result.map((item) => deserializeResult(item, _downloadFile));
  }
  if (result && typeof result === "object") {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(result as Record<string, unknown>)) {
      obj[k] = deserializeResult(v, _downloadFile);
    }
    return obj;
  }
  return result;
}
