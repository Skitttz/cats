export function createCatDetector({ loadModel, createImage, createObjectURL, revokeObjectURL }) {
  let modelPromise;
  let loadedModel;
  let disposed = false;
  let released = false;
  let running = 0;
  const releaseIfUnused = () => {
    if (disposed && running === 0 && loadedModel && !released) {
      released = true;
      loadedModel.dispose();
    }
  };
  const model = () => {
    if (!modelPromise) {
      modelPromise = loadModel().then((loaded) => {
        loadedModel = loaded;
        return loaded;
      }).catch((error) => {
        modelPromise = undefined;
        throw error;
      });
    }
    return modelPromise;
  };

  return {
    async detect(file) {
      if (disposed) throw new Error('Detector encerrado.');
      running += 1;
      let image;
      let objectURL;
      try {
        const currentModel = await model();
        if (disposed) throw new Error('Detector encerrado.');
        image = createImage();
        objectURL = createObjectURL(file);
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = () => reject(new Error('Não foi possível abrir a imagem.'));
          image.src = objectURL;
        });
        if (disposed) throw new Error('Detector encerrado.');
        const predictions = await currentModel.detect(image, 10);
        return predictions.some((prediction) => prediction.class === 'cat');
      } finally {
        if (image) {
          image.onload = null;
          image.onerror = null;
        }
        if (objectURL) revokeObjectURL(objectURL);
        running -= 1;
        releaseIfUnused();
      }
    },
    dispose() {
      disposed = true;
      releaseIfUnused();
    },
  };
}
