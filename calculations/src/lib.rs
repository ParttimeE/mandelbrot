use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct ComplexNumber {
    pub real_part: f64,
    pub imaginary_part: f64,
}

#[wasm_bindgen]
pub fn calculate_iterations_per_pixel(c: ComplexNumber, max_iterations: u32) -> u32 {
    let mut z = ComplexNumber {
        real_part: 0.0,
        imaginary_part: 0.0,
    };
    let mut iterations = 0;

    while iterations < max_iterations {
        let new_real_part = z.real_part * z.real_part - z.imaginary_part * z.imaginary_part + c.real_part;
        let new_imaginary_part = 2.0 * z.real_part * z.imaginary_part + c.imaginary_part;

        z = ComplexNumber {
            real_part: new_real_part,
            imaginary_part: new_imaginary_part,
        };
        //This is wrong by definition of the mandelbrot set but looks nicer
        if z.real_part * z.real_part + z.imaginary_part * z.imaginary_part > 4.0 {
            return iterations;
        }

        iterations += 1;
    }

    max_iterations
}

#[wasm_bindgen]
pub fn new_complex_number(real: f64, imaginary: f64) -> ComplexNumber {
    ComplexNumber {
        real_part: real,
        imaginary_part: imaginary,
    }
}

