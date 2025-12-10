import { chacha20poly1305 } from '@noble/ciphers/chacha.js';
import { bytesToUtf8, utf8ToBytes } from '@noble/ciphers/utils.js';
import { base64 } from '@scure/base';
import { config } from './config';

const KEY = utf8ToBytes(config.decrypt.key);

export const decrypt = (b64: string) => {
  const data = base64.decode(b64);
  const nonce = data.slice(0, 12);
  const ciphertext = data.slice(12);
  return bytesToUtf8(chacha20poly1305(KEY, nonce).decrypt(ciphertext));
};
