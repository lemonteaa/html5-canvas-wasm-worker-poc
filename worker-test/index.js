import wasmWorker from 'wasm-worker';

// supposing an "add.wasm" module that exports a single function "add"
wasmWorker('add.wasm')
  .then(module => {
    return module.exports.add(1, 2);
  })
  .then(sum => {
    console.log('1 + 2 = ' + sum);
  })
  .catch(ex => {
    // ex is a string that represents the exception
    console.error(ex);
  });

// you can also run js functions inside the worker
// to access importObject for example
wasmWorker('add.wasm')
  .then(module => {
    return module.run(({
      // module,
      // importObject,
      instance,
      params
    }) => {
      // here is sync
      const sum = instance.exports.add(...params);
      return '1 + 2 = ' + sum;
    }, [1, 2]);
  })
  .then(result => {
    console.log(result);
  });

