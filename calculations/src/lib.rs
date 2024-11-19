use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate_iterations_per_pixel(real_part: f64, imaginary_part: f64, max_iterations: u32) -> u32 {
    let mut zreal_part = 0.0;
    let mut zimaginary_part = 0.0;
    let mut iterations = 0;

    while iterations < max_iterations {
        let znewreal_part = zreal_part * zreal_part - zimaginary_part * zimaginary_part + real_part;
        let znewimaginary_part = 2.0 * zreal_part * zimaginary_part + imaginary_part;
        zreal_part = znewreal_part;
        zimaginary_part =znewimaginary_part;
        if zreal_part * zreal_part + zimaginary_part * zimaginary_part > 4.0 {
            return iterations;
        }
        iterations += 1;
    }
    max_iterations
}
