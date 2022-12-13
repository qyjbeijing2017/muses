Shader "Default" {
    Properties {
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Texture", 2D) = "white" {}
        _Cutoff ("Alpha Cutoff", Range(0,1)) = 0.5
    }
    SubShader {
        Cull Front
        Blend 1 SrcAlpha One, OneMinusSrcAlpha OneMinusSrcAlpha
        Blend 2 SrcAlpha One, OneMinusSrcAlpha OneMinusSrcAlpha
        LOD 100
        Tags {
            "Queue"="Transparent"
            "IgnoreProjector"="True"
            "RenderType"="Transparent"
            "PreviewType"="Plane"
            "CanUseSpriteAtlas"="True"
        }

        Pass {
        
            Cull Back
            Blend SrcAlpha OneMinusSrcAlpha
            LOD 100

            GLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "glsl"

            void vert(float a){
                if(a>0.){
                    gl_Position = vec4(0.,0.,0.,0.);
                } else  {
                    gl_Position = vec4(0.,0.,0.,0.);
                }
            }

            void frag(float a){
                gl_FragColor = _Color;
            }

            ENDGLSL
        }
    }
    FallBack "Diffuse"
}