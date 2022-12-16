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

            varying vec3 v_normal;

            void vert() {
                v_normal = a_normal;
                gl_Position = a_projection * a_view * a_model * vec4(a_position, 1.0);
            }
            
            void frag() {
                vec3 color = v_normal * 0.5 + 0.5;
                gl_FragColor = vec4(color, 1.0);
            }

            ENDGLSL
        }
    }

    FallBack "Diffuse"
}