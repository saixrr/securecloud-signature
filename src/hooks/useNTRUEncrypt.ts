import { useEffect, useState } from 'react';

export const useNTRUEncrypt = () => {
  const [loaded, setLoaded] = useState(false);
  const [module, setModule] = useState<any>(null);

  useEffect(() => {
    const loadModule = async () => {
      const script = document.createElement('script');
      script.src = '/ntruenc/ntruenc.js';
      script.async = true;

      script.onload = async () => {
        const instance = await (window as any).createNTRUEncryptModule();

        const _init = instance.cwrap('init', null, []);
        const _generate_keypair = instance.cwrap('generate_keypair', 'number', ['number', 'number']);
        const _encapsulate = instance.cwrap('encapsulate', 'number', ['number', 'number', 'number']);
        const _decapsulate = instance.cwrap('decapsulate', 'number', ['number', 'number', 'number']);

        _init();

        setModule({
          instance,
          _generate_keypair,
          _encapsulate,
          _decapsulate,
        });
        setLoaded(true);
      };

      script.onerror = () => {
        console.error('Failed to load ntruenc.js');
      };

      document.body.appendChild(script);
    };

    if (!loaded) loadModule();
  }, [loaded]);

  const generateKeypair = () => {
    const { instance, _generate_keypair } = module;
    const pk = instance._malloc(1184);
    const sk = instance._malloc(1600);
    _generate_keypair(pk, sk);
    return {
      publicKey: new Uint8Array(instance.HEAPU8.subarray(pk, pk + 1184)),
      secretKey: new Uint8Array(instance.HEAPU8.subarray(sk, sk + 1600)),
    };
  };

  const encrypt = (publicKey: Uint8Array) => {
    const { instance, _encapsulate } = module;
    const ct = instance._malloc(1280);
    const ss = instance._malloc(32);
    const pkPtr = instance._malloc(publicKey.length);
    instance.HEAPU8.set(publicKey, pkPtr);
    _encapsulate(ct, ss, pkPtr);
    return {
      ciphertext: new Uint8Array(instance.HEAPU8.subarray(ct, ct + 1280)),
      sharedSecret: new Uint8Array(instance.HEAPU8.subarray(ss, ss + 32)),
    };
  };

  const decrypt = (ciphertext: Uint8Array, secretKey: Uint8Array) => {
    const { instance, _decapsulate } = module;
    const ss = instance._malloc(32);
    const ctPtr = instance._malloc(ciphertext.length);
    const skPtr = instance._malloc(secretKey.length);
    instance.HEAPU8.set(ciphertext, ctPtr);
    instance.HEAPU8.set(secretKey, skPtr);
    _decapsulate(ss, ctPtr, skPtr);
    return new Uint8Array(instance.HEAPU8.subarray(ss, ss + 32));
  };

  return { loaded, generateKeypair, encrypt, decrypt };
};
