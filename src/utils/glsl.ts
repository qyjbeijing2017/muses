export const glsl = `
#pragma compiler
vec4 gl_Position;
vec4 gl_FragColor;

float dot(vec2 a, vec2 b);
float dot(vec3 a, vec3 b);
float dot(vec4 a, vec4 b);

float length(vec2 a);
float length(vec3 a);
float length(vec4 a);

float distance(vec2 a, vec2 b);
float distance(vec3 a, vec3 b);
float distance(vec4 a, vec4 b);

vec2 normalize(vec2 a);
vec3 normalize(vec3 a);
vec4 normalize(vec4 a);

vec2 reflect(vec2 a, vec2 b);
vec3 reflect(vec3 a, vec3 b);
vec4 reflect(vec4 a, vec4 b);
vec2 refract(vec2 a, vec2 b, float c);
vec3 refract(vec3 a, vec3 b, float c);
vec4 refract(vec4 a, vec4 b, float c);

vec2 cross(vec2 a, vec2 b);
vec3 cross(vec3 a, vec3 b);
vec4 cross(vec4 a, vec4 b);

vec2 abs(vec2 a);
vec3 abs(vec3 a);
vec4 abs(vec4 a);

vec2 sign(vec2 a);
vec3 sign(vec3 a);
vec4 sign(vec4 a);

vec2 floor(vec2 a);
vec3 floor(vec3 a);
vec4 floor(vec4 a);

vec2 ceil(vec2 a);
vec3 ceil(vec3 a);
vec4 ceil(vec4 a);

vec2 round(vec2 a);
vec3 round(vec3 a);
vec4 round(vec4 a);

vec2 fract(vec2 a);
vec3 fract(vec3 a);
vec4 fract(vec4 a);

vec2 mod(vec2 a, vec2 b);
vec3 mod(vec3 a, vec3 b);
vec4 mod(vec4 a, vec4 b);

vec2 min(vec2 a, vec2 b);
vec3 min(vec3 a, vec3 b);
vec4 min(vec4 a, vec4 b);

vec2 max(vec2 a, vec2 b);
vec3 max(vec3 a, vec3 b);
vec4 max(vec4 a, vec4 b);

vec2 clamp(vec2 a, vec2 b, vec2 c);
vec3 clamp(vec3 a, vec3 b, vec3 c);
vec4 clamp(vec4 a, vec4 b, vec4 c);

vec2 mix(vec2 a, vec2 b, float c);
vec3 mix(vec3 a, vec3 b, float c);
vec4 mix(vec4 a, vec4 b, float c);

vec4 texture2D(sampler2D a, vec2 b);
vec4 textureCube(samplerCube a, vec3 b);
`