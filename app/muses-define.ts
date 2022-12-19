export const muses_define = `
precision mediump float;
attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec3 a_tangent;

uniform mat4 a_model;
uniform mat4 a_view;
uniform mat4 a_projection;
uniform samplerCube a_skybox;
`;