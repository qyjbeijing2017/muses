Shader "Default" {
    Properties {
        _MainTex ("Texture", 2D) = "white" {}
        _Color ("Color", Color) = (1,1,1,1)
        _Vector ("Vector", Vector) = (0,0,0,0)
        _Float ("Float", Float) = 0
        _Range ("Range", Range(0,1)) = 0
        _Cubemap ("Cubemap", Cube) = "white" {}
    }
    SubShader {
        Cull Off
        Blend SrcAlpha One
        Pass {
        }
        Pass {
        }
    }
    FallBack "Diffuse"
}