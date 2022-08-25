import wasmWorker from 'wasm-worker';

const img = new Image();
//img.src = 'https://source.unsplash.com/800x600/?beach';

img.crossOrigin = "Anonymous";
img.src = 'https://picsum.photos/seed/fever/200/300';

const canvas = document.getElementById("cnvs");
const ctx = canvas.getContext("2d");
const cnvs_size = 128;
const img_buf_size = cnvs_size * cnvs_size * 4;
ctx.clearRect(0, 0, cnvs_size, cnvs_size);

img.onload = () => { 
  ctx.drawImage(img, 0, 0, cnvs_size, cnvs_size) 

  const memory = new WebAssembly.Memory({ initial: 1 });
  const image_data = ctx.getImageData(0, 0, cnvs_size, cnvs_size);
        //new ImageData(new Uint8ClampedArray(memory.buffer, 0, img_buf_size), cnvs_size, cnvs_size);
  
  // supposing an "add.wasm" module that exports a single function "add"
  wasmWorker('http://dev-machine:35668/wasm/hello_wasm_bg.wasm', {
    getImportObject: () => ({
      imports: {
        "hello": 42
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
  
        //return importObject.imports.hello;
  
        return params[1];
      }, [[1, 2, 3, 4, 5], image_data]))
    .then(sum => {
      //console.log('Array sum is = ' + sum);
      console.log(sum);
      ctx.putImageData(image_data, 0, 0);
    })
    .catch(ex => {
      // ex is a string that represents the exception
      console.error(ex);
    });

}



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
