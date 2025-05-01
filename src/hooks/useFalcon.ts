import { useEffect, useState } from 'react';


export const useFalcon = () => {
  const [falcon, setFalcon] = useState<any>(null);

  useEffect(() => {
    const loadFalcon = async () => {
      const createFalconModule = (await import('../../public/falcon/falcon.js')).default;
      const instance = await createFalconModule();

      const init = instance.cwrap('init', null, []);
      const generateKeypair = instance.cwrap('generate_keypair', 'number', []);
      const getPublicKey = instance.cwrap('get_public_key', 'number', []);
      const getPrivateKey = instance.cwrap('get_private_key', 'number', []);
      const signMessage = instance.cwrap('sign_message', 'number', [
        'number', 'number', 'number', 'number'
      ]);

      init();
      setFalcon({ instance, generateKeypair, getPublicKey, getPrivateKey, signMessage });
    };

    loadFalcon();
  }, []);

  return falcon;
};
