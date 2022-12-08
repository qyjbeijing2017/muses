Shader "Default" {
    Properties {
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

            struct Love {
                float c,a;
            };

            uniform Love love;

            void vert(float a);

            void vert(float a){
            }

            ENDGLSL
        }
    }
    FallBack "Diffuse"
}