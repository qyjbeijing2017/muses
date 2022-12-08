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
                float a;
                int b;
            } love1, love2;

            void vert(float c, int a){
                float b;
            }

            ENDGLSL
        }
    }
    FallBack "Diffuse"
}