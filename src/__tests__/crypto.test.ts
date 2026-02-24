import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from '@/lib/crypto';

describe('crypto — AES-GCM encrypt/decrypt', () => {
  it('round-trips a simple string', async () => {
    const plaintext = 'Hello, PuffWise!';
    const passphrase = 'test-passphrase-123';

    const encrypted = await encrypt(plaintext, passphrase);
    expect(encrypted).not.toBe(plaintext);

    const decrypted = await decrypt(encrypted, passphrase);
    expect(decrypted).toBe(plaintext);
  });

  it('round-trips JSON data', async () => {
    const data = JSON.stringify({ logs: [{ amount: 3, type: 'cigarette' }] });
    const passphrase = 'another-secret';

    const encrypted = await encrypt(data, passphrase);
    const decrypted = await decrypt(encrypted, passphrase);
    expect(JSON.parse(decrypted)).toEqual({ logs: [{ amount: 3, type: 'cigarette' }] });
  });

  it('produces different ciphertext for the same input (random IV/salt)', async () => {
    const plaintext = 'same input';
    const passphrase = 'same-pass';

    const a = await encrypt(plaintext, passphrase);
    const b = await encrypt(plaintext, passphrase);
    expect(a).not.toBe(b);
  });

  it('fails to decrypt with wrong passphrase', async () => {
    const encrypted = await encrypt('secret', 'correct-pass');
    await expect(decrypt(encrypted, 'wrong-pass')).rejects.toThrow();
  });
});
