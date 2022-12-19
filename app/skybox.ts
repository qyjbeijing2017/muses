const skyBoxBuffer = [
    // positions            // normals         // texture Coords    //tangent

    // Font face
    -1.0, 1.0, -1.0,    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0,  // left-top-front
    -1.0, -1.0, -1.0,   0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // left-bottom-front
    1.0, -1.0, -1.0,    0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,  // right-bottom-front
    1.0, -1.0, -1.0,    0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,  // right-bottom-front
    1.0, 1.0, -1.0,     0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0,  // right-top-front
    -1.0, 1.0, -1.0,    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0,  // left-top-front

    // Left face
    -1.0, -1.0, 1.0,    1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, // left-bottom-left
    -1.0, -1.0, -1.0,   1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0, 0.0, // right-bottom-left
    -1.0, 1.0, -1.0,    1.0, 0.0, 0.0, 1.0, 1.0, -1.0, 0.0, 0.0, // right-top-left
    -1.0, 1.0, -1.0,    1.0, 0.0, 0.0, 1.0, 1.0, -1.0, 0.0, 0.0, // right-top-left
    -1.0, 1.0, 1.0,     1.0, 0.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0, // left-top-left
    -1.0, -1.0, 1.0,    1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, // left-bottom-left

    // Right face
    1.0, -1.0, -1.0,    -1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0, // left-bottom-right
    1.0, -1.0, 1.0,     -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0, // right-bottom-right
    1.0, 1.0, 1.0,      -1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0, // right-top-right
    1.0, 1.0, 1.0,      -1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0, // right-top-right
    1.0, 1.0, -1.0,     -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, // left-top-right
    1.0, -1.0, -1.0,    -1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0, // left-bottom-right

    // Back face
    -1.0, -1.0, 1.0,    0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, // right-bottom-back
    -1.0, 1.0, 1.0,     0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, // right-top-back
    1.0, 1.0, 1.0,      0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, // left-top-back
    1.0, 1.0, 1.0,      0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, // left-top-back
    1.0, -1.0, 1.0,     0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, // left-bottom-back
    -1.0, -1.0, 1.0,    0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, // right-bottom-back

    // Top face
    -1.0, 1.0, -1.0,    0.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, // left-buttom-top
    1.0, 1.0, -1.0,     0.0, -1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, // right-buttom-top
    1.0, 1.0, 1.0,      0.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 0.0, // right-top-top
    1.0, 1.0, 1.0,      0.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 0.0, // right-top-top
    -1.0, 1.0, 1.0,     0.0, -1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0, // left-top-top
    -1.0, 1.0, -1.0,    0.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, // left-buttom-top

    // Buttom face
    -1.0, -1.0, -1.0,   0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, // left-top-buttom
    -1.0, -1.0, 1.0,    0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, // left-bottom-buttom
    1.0, -1.0, -1.0,    0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, // right-top-buttom
    1.0, -1.0, -1.0,    0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, // right-top-buttom
    -1.0, -1.0, 1.0,    0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, // left-buttom-buttom
    1.0, -1.0, 1.0,     0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0  // right-buttom-buttom
]

export const skyBoxPosition = [
// Font face
-1.0, 1.0, -1.0, 
-1.0, -1.0, -1.0,
1.0, -1.0, -1.0, 
1.0, -1.0, -1.0, 
1.0, 1.0, -1.0,  
-1.0, 1.0, -1.0, 
// Left face
-1.0, -1.0, 1.0, 
-1.0, -1.0, -1.0,
-1.0, 1.0, -1.0, 
-1.0, 1.0, -1.0, 
-1.0, 1.0, 1.0,  
-1.0, -1.0, 1.0, 
 // Right face
 1.0, -1.0, -1.0,
 1.0, -1.0, 1.0, 
 1.0, 1.0, 1.0,  
 1.0, 1.0, 1.0,  
 1.0, 1.0, -1.0, 
 1.0, -1.0, -1.0,
 // Back face
 -1.0, -1.0, 1.0,
 -1.0, 1.0, 1.0, 
 1.0, 1.0, 1.0,  
 1.0, 1.0, 1.0,  
 1.0, -1.0, 1.0, 
 -1.0, -1.0, 1.0,
 // Top face
 -1.0, 1.0, -1.0,
 1.0, 1.0, -1.0, 
 1.0, 1.0, 1.0,  
 1.0, 1.0, 1.0,  
 -1.0, 1.0, 1.0, 
 -1.0, 1.0, -1.0,
 // Buttom face
 -1.0, -1.0, -1.0
 -1.0, -1.0, 1.0,
 1.0, -1.0, -1.0,
 1.0, -1.0, -1.0,
 -1.0, -1.0, 1.0,
 1.0, -1.0, 1.0, 
]
