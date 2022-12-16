Shader "Default" {
    Properties {
    }
    SubShader {
        Pass {
            // renderstate
            
            // Cull OFF
            // ZWrite OFF

            // glsl        
            GLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "glsl"
            #include "muses_define"

            void vert() {
                gl_Position = a_projection * a_view * a_model * vec4(a_position, 1.0);
            }
            
            void frag() {
                gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
            }

            ENDGLSL
        }
    }

    FallBack "Diffuse"
}