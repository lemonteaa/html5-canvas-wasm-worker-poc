mod utils;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

extern crate photon_rs;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

//#[wasm_bindgen]
//extern {
//    fn alert(s: &str);
//}

//#[wasm_bindgen]
//pub fn greet() {
//    alert("Hello, hello-wasm!");
//}


/// Allocate memory into the module's linear memory
/// and return the offset to the start of the block.
#[no_mangle]
#[wasm_bindgen]
pub fn my_alloc(len: usize) -> *mut u8 {
    // create a new mutable buffer with capacity `len`
    let mut buf = Vec::with_capacity(len);
    // take a mutable pointer to the buffer
    let ptr = buf.as_mut_ptr();
    // take ownership of the memory block and
    // ensure that its destructor is not
    // called when the object goes out of scope
    // at the end of the function
    std::mem::forget(buf);
    // return the pointer so the runtime
    // can write data at this offset
    return ptr;
}

/// Given a pointer to the start of a byte array and
/// its length, return the sum of its elements.
#[no_mangle]
pub unsafe fn array_sum(ptr: *mut u8, len: usize) -> u8 {
    // create a Vec<u8> from the pointer to the
    // linear memory and the length
    let data = Vec::from_raw_parts(ptr, len, len);
    // actually compute the sum and return it
    data.iter().sum()
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    return a + b;
}

//#[wasm_bindgen]
//extern "C" {
//    pub type SomeJsType;
//}
//web_sys::ImageData
//photon_rs::PhotonImage

#[wasm_bindgen]
pub fn recolor(img : web_sys::ImageData) -> web_sys::ImageData {
    let mut p = photon_rs::PhotonImage::from(img);
    photon_rs::filters::filter(&mut p, "rosetint");
    return photon_rs::to_image_data(p);
}
