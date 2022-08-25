import wasmWorker from 'wasm-worker';

// supposing an "add.wasm" module that exports a single function "add"
wasmWorker('http://dev-machine:35668/wasm/hello_wasm_bg.wasm', {
  getImportObject: () => ({
    imports: {
    },
  })
})
  .then(wasmModule =>
    wasmModule.run(({
      module,
      instance,
      importObject,
      params,
    }) => {
      const err = new Error();
      if (params === undefined) throw err;
      if (!(module instanceof WebAssembly.Module)) throw err;
      if (!(instance instanceof WebAssembly.Instance)) throw err;
      if (importObject.imports === undefined) throw err;

      var ptr = instance.exports.my_alloc(5);
      var mem = new Uint8Array(instance.exports.memory.buffer, ptr, 5);
      mem.set(new Uint8Array(params[0]));
      var res = instance.exports.array_sum(ptr, 5);
      return res;
    }, [[1, 2, 3, 4, 5]]))
  .then(sum => {
    console.log('Array sum is = ' + sum);
  })
  .catch(ex => {
    // ex is a string that represents the exception
    console.error(ex);
  });

// you can also run js functions inside the worker
// to access importObject for example
/*wasmWorker('add.wasm')
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
  });*/
